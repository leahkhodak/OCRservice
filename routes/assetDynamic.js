var express = require('express');
const bodyParser = require('body-parser');
var detectText = require('../public/javascripts/assetsWMDynamic.js');

var router = express.Router();
router.use(bodyParser);

/* GET home page. */
router.get('/', function(req, res, next){
  detectText(req.body, function(asset){
    console.log("inside");
    console.log("asset: "+asset);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.send(asset);
  });
});

module.exports = router;
