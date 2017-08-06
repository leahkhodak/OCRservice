
assetJSON = new Object();

var name;
var marketValue;
var taxCost;

function AssetJSON(name, marketValue, taxCost) {
  this.name = name;
  this.marketValue = marketValue;
  this.taxCost = taxCost;
};

module.exports = AssetJSON;
