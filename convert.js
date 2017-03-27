/**
 * Created by jadoux on 06/03/2017.
 */
var fs = require( 'fs' );
var path = require( 'path' );
var cheerio = require('cheerio');

const translateClient = require('@google-cloud/translate')({
    projectId: 'translationtest-161115',
    keyFilename: 'translationTest-51ede6514eb3.json'
});


let folderDoc = "documentation";
let menuFile = "toc.html";
let convertTargetFolder = "views/doc";


init();

function init() {
    cleanDocFolder('fr,en').then(function() {
        console.log('wool');
        convertAllToStandard();
    });
}

function cleanDocFolder(languages) {
    let promises = [];

    return new Promise(function(resolve, reject) {

        languages.split(',').forEach(function(language){
            fs.readdir( convertTargetFolder + '/' + language, function( err, files ) {
                if( err ) {
                    console.error( "Could not list the directory.", err );
                    process.exit( 1 );
                }
                files.forEach( function( file, index ) {
                    fs.unlink(path.join(convertTargetFolder + '/' + language, file), function() {
                        promises.push();
                    });
                });
            });
        })

        resolve(promises);
    });
}

function convertAllToStandard() {
    fs.readdir( folderDoc, function( err, files ) {
        if( err ) {
            console.error( "Could not list the directory.", err );
            process.exit( 1 );
        }

        files.forEach( function( file, index ) {
            // Make one pass and make the file complete
            let fromPath = path.join( folderDoc, file );
            fs.readFile(fromPath, 'utf8', function (err,data) {
                if (err) {
                    return console.log(err);
                }
                let promises = [];
                const $ = cheerio.load(data);

                if(file == "toc.html") {
                    $("a").removeAttr("target");
                }

                let dataHtml = $("body").html();

                if(dataHtml) {
                    writeDataToFile(dataHtml.replace(new RegExp("lib/", 'g'), "img/"), file).then(function () {
                        console.log("writing");
                    });
                }
            });
        } );
    });


}

function writeDataToFile(data, file) {
    return new Promise(function(resolve, reject) {
        fs.writeFile(path.join( convertTargetFolder + '/fr' , file.replace('html', 'ejs') ) , data.replace(/img\//g, "fr/imgspec/"), function(err) {
            if(err) {
                return console.log(err);
            }

            var options = {
                from: 'fr',
                to: 'en',
                format: 'html'
            };

            translateClient.translate(data.replace(/img\//g, "en/imgspec/"), options, function (err, translations) {
                console.log(err);
                if (!err) {
                    console.log(translations);

                    fs.writeFile(path.join( convertTargetFolder + '/en', file.replace('html', 'ejs')), translations, function(err) {
                        if (err) {
                            return console.error(err);
                        }
                    }.bind({file : file}));

                }
            });

            console.log("The node was saved!");
        });
    });
}
