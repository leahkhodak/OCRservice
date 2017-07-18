var express = require('express');
var detectText = require('../public/javascripts/detectText.js');
var incomeJSON = require('../public/javascripts/incomeObject.js');

var router = express.Router();
// The path to the local image file
const fileName = './public/images/t4-1.jpeg';




/* GET home page. */
router.get('/', function(req, res, next){
  detectText(fileName, function(income){
    console.log("inside");
    console.log("income: "+income);
    var responseIncome = new incomeJSON(income);
    res.send(responseIncome);
  });

});

module.exports = router;
