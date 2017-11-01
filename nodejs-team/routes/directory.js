'use strict';

var util = require('util');
var path = require('path');
var express = require('express');
var router = express.Router();
var directories = require('../models/Directory-fs');
var multer = require('multer');

const log   = require('debug')('nodejs-team:router-directory');
const error = require('debug')('nodejs-team:error');
const fs = require("fs");


// Add Directory(File or Folder). (create)
router.post('/add', function(req, res, next) {
  console.log(`req: ${req.body}`);
  var filePath = path.join(__dirname,"drive",'Icon.png');
  console.log(`filePath: ${filePath}`);
  fs.stat(filePath,(err,fileInfo) => {
    if (err){
      next(err);
      return;
    }
    if(fileInfo.isFile()){
      console.log(`Is file: ${fileInfo.isFile()}`);
      res.sendFile(filePath);
    }else if(fileInfo.isDirectory()){
      console.log(`Is directory: ${fileInfo.isDirectory()}`);
      res.send('respond with a resource');
    }else{
      next();
    }

  });
});



module.exports = router;
