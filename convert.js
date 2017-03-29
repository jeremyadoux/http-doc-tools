/**
 * Created by jadoux on 06/03/2017.
 */
var fs = require( 'fs-extra' );
var path = require( 'path' );
var cheerio = require('cheerio');

//Google translate API configuration
const translateClient = require('@google-cloud/translate')({
    projectId: 'translationtest-161115',
    keyFilename: 'translationTest-51ede6514eb3.json'
});

let deploymentFolder = "deploy";
let rootDocFolder = "deploy/documentation";
let docImagesFolder = "lib";
let convertTargetFolder = "views/doc";
let translatedImagesDirectory = "imgspec";
let menuFile = "toc.html";
let toLanguages = ["en"];
let fromLanguage = "fr";

init();

function init() {
    cleanDocFolder().then(function() {
        console.log('wool');
        convertHtml();
        copyImages();
    });
}

//function for deleting the all the files for each language
function cleanDocFolder() {
    let promises = [];
    let languages = toLanguages.slice(0);

    languages.push(fromLanguage);

    return new Promise(function(resolve, reject) {
        languages.forEach(function(language){
            fs.readdir( path.join(convertTargetFolder, language), function( err, files ) {
                if( err ) {
                    console.error( "Could not list the directory.", err );
                    reject(err);
                }
                files.forEach( function( file, index ) {

                    fs.unlink(path.join(convertTargetFolder, language, file), function(err) {
                        if(err)
                        {
                            console.error("the file is a directory", err.path);
                            if( err.code === "EPERM")
                            {
                                fs.readdir(err.path, function( err, files ){
                                    if( err ) {
                                        console.error( "Could not list the directory.", err );
                                        reject(err);
                                    }
                                    files.forEach( function( file, index ) {
                                        fs.unlink(path.join(convertTargetFolder, language, translatedImagesDirectory, file));
                                        promises.push();
                                    });

                                });
                            }
                            else
                            {
                                console.error("erreur lors de la suppression du fichier : ", err.message);
                                reject(err);
                            }
                        }

                        promises.push();
                    });

                });
            });
        })

        resolve(promises);
    });
}

function convertHtml() {
    fs.readdir( rootDocFolder, function( err, files ) {
        if( err ) {
            console.error( "Could not list the directory.", err );
            process.exit( 1 );
        }

        files.forEach( function( file, index ) {
            // Make one pass and make the file complete
            let fromPath = path.join( rootDocFolder, file );

            if(file.search("html") > -1) {
                fs.readFile(fromPath, 'utf8', function (err, data) {
                    if (err) {
                        return console.log(err);
                    }
                    let promises = [];
                    const $ = cheerio.load(data);

                    if (file == "toc.html") {
                        $("a").removeAttr("target");
                    }

                    let dataHtml = $("body").html();

                    if (dataHtml) {
                        writeDataToFile(dataHtml, file).then(function () {
                            console.log("writing");
                        });
                    }
                });
            }
        } );
    });


}

function writeDataToFile(data, file) {
    return new Promise(function(resolve, reject) {
        fs.writeFile(path.join( convertTargetFolder, fromLanguage, file.replace('html', 'ejs') ) , data.replace(/lib\//g, "fr/imgspec/"), function(err) {
            if(err) {
                return console.log(err);
            }

            toLanguages.forEach(function(language, index) {
                var options = {
                    from: fromLanguage,
                    to: language,
                    format: 'html'
                };

                translateClient.translate(data.replace(/lib\//g, path.join(language, translatedImagesDirectory, '/')), options, function (err, translations) {
                    if(err)
                    {
                        console.log(err);
                    }
                    else
                    {
                        console.log("fichier traduit");

                        fs.writeFile(path.join( convertTargetFolder, language, file.replace('html', 'ejs')), translations, function(err) {
                            if (err) {
                                return console.error(err);
                            }
                        }.bind({file : file}));
                    }

                 });
            }  );

            console.log("The node was saved!");
        });
    });
}

function copyImages(){
    let languages = toLanguages.slice(0);

    languages.push(fromLanguage);

    fs.readdir( path.join(rootDocFolder, docImagesFolder), function( err, files ) {
        files.forEach(function (file, index) {
            languages.forEach(function (language, index) {
                fs.copy(path.join(rootDocFolder, docImagesFolder, file),
                    path.join(convertTargetFolder, language, translatedImagesDirectory, file),
                    function (err) {
                        if(err)
                        {
                            console.log(err);
                        }
                    });
            });
        });
    });
}
