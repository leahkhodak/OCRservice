var projectId = 'ocrservice-173614';

// Imports the Google Cloud client library
var vision = require('@google-cloud/vision');

//credentials
var visionAPI = vision({
  projectId: 'ocrservice-173614',
  // The path to your key file:
  keyFilename: './public/jsons/ocrservice-148ae09e8fa3.json'
});

var textWithOutSpaces = "";

function detectText(fileName, callback){
  // Makes a call to google vision to detect the text
  visionAPI.detectText(fileName)
    .then((results) => {
      //gets a json of the whole first page analysis
      const detections = results[0];
      //parses and gets all the text in blocks, and appends it, without space and comma
      detections.forEach((text) => (textWithOutSpaces += (text.replace(/[ ,]/gm, ""))));
      //console.log(textWithOutSpaces);
      callback(textWithOutSpaces);
    })
    .catch((err) => {
      console.error('ERROR:', err);
      return err;
    });
}


module.exports = detectText;
