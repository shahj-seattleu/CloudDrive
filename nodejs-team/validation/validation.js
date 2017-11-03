//Check if the path is valid
//npm i is-valid-path --save
var isValidFilePath = function (filepath) {
  var isValid = require('is-valid-path');
  return isValid(filepath);
};

//needs $ npm install --save path-exists
var ispathExist = function(filepath) {
    var fs = require('fs');
    if(fs.lstatSync(filePath).isDirectory()) {
      if (fs.existsSync(filePath)) {
        console.log('Found folder');
         return true;
       } else {
        return false;
      }
    } else {
       if (fs.existsSync(filePath)) {
         console.log('Found file');
         return true;
       } else {
        return false;
       }
     }

}

//Check if the size of the file is less than 2MB
//npm install filesize
var isCheckSize = function (filepath) {
    const fs = require("fs");
    var bytes = require('bytes');
    const stats = fs.statSync(filepath);
    const fileSizeInBytes = stats.size;
    var mb_size = bytes(fileSizeInBytes, {unit:'MB', unitSeparator: ' '})
    var res = mb_size.split(" ");
    if (parseFloat(res[0])< 2){
      return true;
    }
    else {
      return false;
    }

}

//check if the extension exists




//Main Validation method

function validation(filePath) {
  filePath ="/Users/arti.seshadri/Desktop/ML";
  var result = isValidFilePath (filePath);
  var result1 = ispathExist(filePath);
  var result2 = isCheckSize(filePath);

  if(result && result1 && result2){
      console.log("true");
      return Promise.resolve(true);
  }else {
      console.log("false");
      return Promise.resolve(true);


  }
}
