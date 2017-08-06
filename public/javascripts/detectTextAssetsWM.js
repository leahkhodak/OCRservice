var detectText = require('./detectText');
var search = require('string-search');
var assetObject = require('./WMassetsObject');

var totalLineNumber;
var secondTotalLineNumber;
var numberValues;
var divideBy4 = false;
var assetNames;
var percentages;
var marketValueArray = new Array();
var taxCostArray = new Array();

function detectAssets(fileName, callback){
  detectText(fileName, function(result){
    console.log(result);
    searchInDocument(result, function(uselessResult){
      filterPercentageArray(function(bla){});
      filterAssetNames(function(bla){});
      filterNumberValuesArray(function(bla){});
      createJson(function(JSONbla){
        callback(JSONbla);
      });
    });

  });
}

function searchInDocument (fileText, callback){
  //searching for total, aka unneeded text
  search.find(fileText, 'total[a-zA-Z]*')
        .then(function (foundTotal){
          console.log(foundTotal);
          totalLineNumber = foundTotal[0].line;
          secondTotalLineNumber = foundTotal[1].line;
        });
  search.find(fileText, '^[$0-9]{4,}.?[0-9]*$')
        .then(function (foundBigValues){
          console.log(foundBigValues);
          numberValues = foundBigValues;
        });
  search.find(fileText, 'GAIN/LOSS')
        .then(function(foundDivideBy4){
          if (foundDivideBy4.length != 0){
            divideBy4 = true;
          }
          console.log(foundDivideBy4.length);
        });
  search.find(fileText, '(^cash|short|fixed|bond|preferredshare|commonshare|equit|mutual|foreign|loan|realestate|other)[a-zA-Z]{0,28}$')
        .then(function(foundAssetNames){
          console.log(foundAssetNames);
          assetNames = foundAssetNames;
        });
  search.find(fileText, '^[0-9o]{1,2}[.][0-9o%]{1,3}$')
        .then(function(foundPercentages){
          console.log(foundPercentages);
          percentages = foundPercentages;
          callback("done");
        });
};

function filterNumberValuesArray (callback){
  //check the location of the assets amounts, to know which ones to filter out (the overall ones)
  console.log("numberValues:");
  console.log(numberValues);

  //remove unneeded dollar values, according to how many values there should be
  var lengthOfPercentageArray = percentages.length;
  var arrayLength = 0;
  if(divideBy4){
    arrayLength = lengthOfPercentageArray * 4;
  }
  else {
    arrayLength = lengthOfPercentageArray;
  }
  numberValues = numberValues.slice(0, arrayLength);
  console.log(numberValues);
  //assign dollar values to appropriate arrays
  if(divideBy4){
    //assign values to marketValueArray
    var marketValueIndex = -1;
    for(i = 0; i < numberValues.length; i += 4){
      marketValueIndex++;
      marketValueArray[marketValueIndex] = numberValues[i].text;
    }
    console.log("marketValueArray");
    console.log(marketValueArray);
    //assign values to taxCostArray
    var taxCostIndex = -1;
    for(i = 3; i < numberValues.length; i += 4){
      taxCostIndex++;
      taxCostArray[taxCostIndex] = numberValues[i].text;
    }
    console.log("taxCostArray");
    console.log(taxCostArray);
  }
  else {
    var marketValueIndex = -1;
    for(i = 0; i < numberValues.length; i++){
      marketValueIndex++;
      marketValueArray[marketValueIndex] = numberValues[i].text;
    }
  }
  callback("bla");
};

function filterPercentageArray (callback){
  console.log("percentages");
  console.log(percentages);
  var sumOfPercentage = 0;
  for (i = 0; i < (percentages.length); i ++){
    var number = parseInt(percentages[i].text);
    if (!isNaN(number)){
      sumOfPercentage = sumOfPercentage + number;
      console.log("sumOfPercentage: " + sumOfPercentage);
      console.log("number: "+ number);
      if (sumOfPercentage > 100){
        percentages = percentages.slice(0,i);
        break;
      }
    }
  }
  console.log(percentages);
  callback("bla");
}

function filterAssetNames (callback){
  console.log("assetNames");
  console.log(assetNames);

  //remove totals
  for(i = 0; i < assetNames.length; i++){
    if(assetNames[i].line > totalLineNumber){
      assetNames = assetNames.slice(0, i);
    }
  }
  //loop through percentages array and find 0.0
  var j = -1;
  var arrayOfPercentageOfZero = new Array();
  for(i = 0; i < percentages.length; i++){
    var number = parseFloat(percentages[i].text);
    console.log("number "+number);
    //created an array arrayOfPercentageOfZero, that will store all the index numbers of 0.0
    if((isNaN(number))|| (number == 0)){
      j++;
      console.log("j: "+j);
      console.log("i: "+i);
      console.log("arrayOfPercentageOfZero "+arrayOfPercentageOfZero);
      arrayOfPercentageOfZero[j] = i;
    }
  }
  //if found, remove that same index in the assetNames array and percentages array
  if (arrayOfPercentageOfZero.length > 0){
    for(i = (arrayOfPercentageOfZero.length-1); i >= 0; i--){
      console.log("to remove i: "+i);
      var indexToRemove = arrayOfPercentageOfZero[i];
      console.log("indexToRemove " + indexToRemove);
      assetNames.splice(indexToRemove, 1);
      console.log("assetNames "+assetNames);
      percentages.splice(indexToRemove, 1);
      console.log("percentages "+percentages);
    }
  }
  console.log(assetNames);
  console.log(percentages);
  callback("bla");
}

function createJson(callback){
  var arrayOfResults = new Array();
  var j = -1;
  for(i = 0; i < percentages.length; i++){
    j++;
    var name = assetNames[i].text;
    var marketValue = marketValueArray[i];
    if(divideBy4){
      var taxCost = taxCostArray[i];
      arrayOfResults[j] = new assetObject(name, marketValue, taxCost);
    }
    else{
      arrayOfResults[j]  = new assetObject(name, marketValue, null);
    }
  }
  console.log("arrayOfResults "+arrayOfResults);
  callback(arrayOfResults);
}

module.exports = detectAssets;
