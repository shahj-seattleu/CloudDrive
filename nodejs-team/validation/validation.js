var isValid = require('is-valid-path');
var fs = require('fs');
var bytes = require('bytes');
var fileExtension = require('file-extension');


var isValidFilePath = function(filepath) {
  return isValid(filepath);
};

exports.isDirectory = function(filePath) {
  return fs.lstatSync(filePath).isDirectory();
}
var ispathExist = function(filepath) {
  if (fs.lstatSync(filepath).isDirectory()) {
    if (fs.existsSync(filepath)) {
      console.log('Found folder');
      return true;
    } else {
      return false;
    }
  } else {
    if (fs.existsSync(filepath)) {
      console.log('Found file');
      return true;
    } else {
      return false;
    }
  }

}

exports.getSize = function(filepath) {
  const stats = fs.statSync(filepath);
  const fileSizeInBytes = stats.size;
  return fileSizeInBytes;
}

//Check if the size of the file is less than 2MB
var isCheckSize = function(filepath) {
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
function checkExtension(filepath) {
  var extension = fileExtension(filepath);
  if (!extension.includes(".")) {
    return true;
  } else if (extension == ".zip" || extension == ".doc" || extension == ".pdf" || extension == ".txt" ||
    extension == ".png") {
    return true;
  } else {
    return false;

  }
}

//Main Validation method
exports.check_validation = function(filepath) {
  return new Promise((resolve, reject) => {
  var result = isValidFilePath(filepath);
  var result1 = ispathExist(filepath);
  var result2 = isCheckSize(filepath);
  var result3 = checkExtension(filepath);
  if (result && result1 && result2 && result3) {
    resolve(true);
  } else {
    resolve(false);
  }
});
}
