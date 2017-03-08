/**
 * Created by jadoux on 06/03/2017.
 */
var fs = require( 'fs' );
var path = require( 'path' );
var cheerio = require('cheerio');

let folderDoc = "documentation";
let menuFile = "toc.html";
let convertTargetFolder = "views/doc";


init();

function init() {
    cleanDocFolder().then(function() {
        console.log('wool');
        convertAllToStandard();
    });
}

function cleanDocFolder() {
    let promises = [];

    return new Promise(function(resolve, reject) {
        fs.readdir( convertTargetFolder, function( err, files ) {
            if( err ) {
                console.error( "Could not list the directory.", err );
                process.exit( 1 );
            }
            files.forEach( function( file, index ) {
                fs.unlink(path.join(convertTargetFolder, file), function() {
                    promises.push();
                });
            });
        });
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
        fs.writeFile(path.join( convertTargetFolder, file.replace('html', 'ejs') ) , data, function(err) {
            if(err) {
                return console.log(err);
            }

            console.log("The node was saved!");
        });
    });
}
