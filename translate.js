// Your Google Cloud Platform project ID
const projectId = 'translationtest-161115';

// Imports the Google Cloud client library
var translate = require('@google-cloud/translate')({
    projectId: 'translationtest-161115',
    keyFilename: 'translationTest-51ede6514eb3.json'
});



// Instantiates a client
/*const translateClient = Translate({
    projectId: projectId
});*/

var fs = require('fs');

fs.readFile('documentation/Accslaide.html', 'utf8', function(err, contents) {

    contents = '<html>img/</html>';
    console.log(contents);
    var options = {
        from: 'fr',
        to: 'en',
        format: 'html'
    };


    translate.translate(contents, options, function (err, translations) {
        console.log(err);
        if (!err) {
            console.log(translations);
            var result = translations.replace(/img \//g, 'enimg');
            console.log(result);
            fs.writeFile('test.html', result, function(err) {
                if (err) {
                    return console.error(err);
                }
            });

        }
    });
});

