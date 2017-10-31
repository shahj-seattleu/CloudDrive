'use strict';

var util = require('util');
var path = require('path');
var express = require('express');
var router = express.Router();
var directories = require('../models/Directory-fs');
var multer = require('multer');

const log   = require('debug')('nodejs-team:router-directory');
const error = require('debug')('nodejs-team:error');

var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, "public/uploads");
    },
    filename: function (req, file, callback) {
        callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    }
});

var upload = multer({ storage: storage });

const fs = require("fs");

let filepath = "/Users/kanav/Desktop/CloudDrive";

fs.lstat(filepath, (err, stats) => {

    if(err)
        return console.log(err); //Handle error

    console.log(`Is file: ${stats.isFile()}`);
    console.log(`Is directory: ${stats.isDirectory()}`);
    console.log(`Is symbolic link: ${stats.isSymbolicLink()}`);
    console.log(`Is FIFO: ${stats.isFIFO()}`);
    console.log(`Is socket: ${stats.isSocket()}`);
    console.log(`Is character device: ${stats.isCharacterDevice()}`);
    console.log(`Is block device: ${stats.isBlockDevice()}`);
});


// Add Directory(File or Folder). (create)
router.post( '/add', upload.any(), function( req, res, next ) {
  // Metadata about the uploaded file can now be found in req.file

  console.log(req.files);
});


module.exports = router;
