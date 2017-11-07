var isValid = require('is-valid-path');
const fs = require("fs");
var bytes = require('bytes');
var fileExtension = require('file-extension');



function validation(filepath) {
  this.filepath = filepath;
}


var isValidFilePath = function (filepath) {
  return isValid(filepath);
};

var ispathExist = function(filepath) {
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
var isCheckSize = function (filepath) {
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
//.zip, .doc, .pdf, .txt, no extension,
function checkExtension(filepath) {
  var extension  =  fileExtension(filepath);
  if(!extension.includes(".")){
    return true;
  }else if(extension ==  ".zip" || extension == ".doc" || extension ==".pdf" || extension ==".txt"){
    return true;
  } else {
    return false;

  }
}

//Main Validation method
function check_validation() {
  filePath ="/Users/arti.seshadri/Documents/CloudDrive/nodejs-team/drive";
  var result = isValidFilePath (this.filepath);
  var result1 = ispathExist(this.filepath);
  var result2 = isCheckSize(this.filepath);
  var result3 = checkExtension(this.filepath);

  if(result && result1 && result2 && result3){
      console.log("true");
      return Promise.resolve(true);
  }else {
      console.log("false");
      return Promise.resolve(true);


  }
}
