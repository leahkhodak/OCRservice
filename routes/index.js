var express = require('express');
var detectText = require('../public/javascripts/detectText.js');

var router = express.Router();
// The path to the local image file
const fileName = './public/images/t4-1.jpeg';

/* GET home page. */
router.get('/', function(req, res, next){
  detectText(fileName, function(err, income){
    console.log("inside");
    if(err != null){
      console.log(err);
    }
    else{
    console.log("income: "+income);
    res.send(income);
    }
  });

});

module.exports = router;
