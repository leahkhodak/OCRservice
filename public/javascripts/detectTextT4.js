
//import dependancies
var express = require('express');
var search = require('string-search');

var projectId = 'ocrservice-173614';

// Imports the Google Cloud client library
var vision = require('@google-cloud/vision');

//credentials
var visionAPI = vision({
  projectId: 'ocrservice-173614',
  // The path to your key file:
  keyFilename: './public/jsons/ocrservice-148ae09e8fa3.json'
});

//will store the text of the document
var textWithOutSpaces = "";
//will store the line of the "line 101"
var line;

//file name to import
//const fileName = './public/images/t4-1.jpeg';

  //function that detects text
  function detectTextT4(fileName, callback){
    // Makes a call to google vision to detect the text
    visionAPI.detectText(fileName)
      .then((results) => {
        //gets a json of the whole first page analysis
        const detections = results[0];
        //parses and gets all the text in blocks, and appends it, without space and comma
        detections.forEach((text) => (textWithOutSpaces += (text.replace(/[ ,]/gm, ""))));
        console.log(textWithOutSpaces);
        //searching for Employmentincome-line101, english or french
        search.find(textWithOutSpaces, '[a-zA-Z]*101')
              .then(function(result){
                console.log(result);
                //gets the line in the document that has that text
                line = result[0].line;
                console.log(line);
              });
        //searching for a number that has more than 3 digits, to find the salary
        search.find(textWithOutSpaces, '^[0-9]{3,}$')
            .then(function(result){
              console.log(result);
              //loop to find the first number that appears after "line 101 of T4"
              for (i = 0; i < result.length; i++) {
                  resultLine = result[i].line;
                  console.log("resultLine "+resultLine);
                  //see if the line is after the line of "line 101"
                  if(resultLine > line){
                    console.log(result[i].text);
                    var result2 = result[i].text
                    //remove the cents out of the income
                    var income = result2.slice(0, -2);
                    console.log("bla "+income);
                    //return result to index.js
                    callback(income);
                    return;
                  }
              }
            });
      })
      .catch((err) => {
        console.error('ERROR:', err);
        return err;
      });
  }
module.exports = detectTextT4;
