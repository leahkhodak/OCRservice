var express = require('express');
var detectT4Text = require('../public/javascripts/detectTextT4.js');
var incomeJSON = require('../public/javascripts/incomeObject.js');

var router = express.Router();
// The path to the local image file
const fileName = './public/images/t4-1.jpeg';

/* GET home page. */
router.get('/', function(req, res, next){
  detectT4Text(fileName, function(income){
    console.log("inside");
    console.log("income: "+income);
    var responseIncome = new incomeJSON(income);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.send(responseIncome);
  });

});

module.exports = router;
