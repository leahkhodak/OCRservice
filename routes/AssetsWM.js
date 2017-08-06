var express = require('express');
var detectText = require('../public/javascripts/detectTextAssetsWM.js');
var assetsArrayJson = require('../public/javascripts/assetsArrayObject.js');

var router = express.Router();
// The path to the local image file
const fileName = './public/images/assets1.jpeg';

/* GET home page. */
router.get('/', function(req, res, next){
  detectText(fileName, function(asset){
    var responseAssets= new assetsArrayJson(asset);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.send(responseAssets);
  });

});

module.exports = router;
