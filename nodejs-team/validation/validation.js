//Check if the path is valid
//npm i is-valid-path --save
var isValidFilePath = function(filepath) {
  var isValid = require('is-valid-path');
  return isValid(filepath);
};

exports.isDirectory = function(filePath) {
  var fs = require('fs');
  return fs.lstatSync(filePath).isDirectory();
}
//needs $ npm install --save path-exists
var ispathExist = function(filepath) {
  var fs = require('fs');
  if (fs.lstatSync(filepath).isDirectory()) {
    if (fs.existsSync(filepath)) {
      console.log('Found folder ' + filepath);
      return true;
    } else {
      return false;
    }
  } else {
    if (fs.existsSync(filepath)) {
      console.log('Found file ' + filePath);
      return true;
    } else {
      return false;
    }
  }

}

exports.getSize = function(filepath) {

  const fs = require("fs");
  var bytes = require('bytes');
  const stats = fs.statSync(filepath);
  const fileSizeInBytes = stats.size;
  return fileSizeInBytes;

}

//Check if the size of the file is less than 2MB
//npm install filesize
var isCheckSize = function(filepath) {
  const fs = require("fs");
  var bytes = require('bytes');
  const stats = fs.statSync(filepath);
  const fileSizeInBytes = stats.size;
  var mb_size = bytes(fileSizeInBytes, {
    unit: 'MB',
    unitSeparator: ' '
  })
  var res = mb_size.split(" ");
  if (parseFloat(res[0]) < 2) {
    return true;
  } else {
    return false;
  }

}

//check if the extension exists
//.zip, .doc, .pdf, .txt, no extension,
//npm install --save file-extension
function checkExtension(filepath) {
  var fileExtension = require('file-extension');
  var extension = fileExtension(filepath);
  if (!extension.includes(".")) {
    return true;
  } else if (extension == ".zip" || extension == ".doc" || extension == ".pdf" || extension == ".txt") {
    return true;
  } else {
    return false;

  }
}

//Main Validation method
exports.check_validation = function(filepath) {
  //var filepath ="/Users/arti.seshadri/Desktop/textnotes.rtf";
  var result = isValidFilePath(filepath);
  var result1 = ispathExist(filepath);
  var result2 = isCheckSize(filepath);
  var result3 = checkExtension(filepath);

  if (result && result1 && result2 && result3) {
    console.log("all validations passed: true");
    return Promise.resolve(true);
  } else {
    console.log("all validations passed: false");
    return Promise.resolve(true);


  }

}
