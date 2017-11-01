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
  var filePath = path.join(__dirname,'../drive','');
  console.log(`filePath: ${filePath}`);
  fs.readdir(filePath, function(err, items) {
       if(err)
         next(err);
      for (var i=0; i<items.length; i++) {
          var file = filePath + '/' + items[i];
          console.log("Start: " + file);
          fs.stat(file, function(err, stats) {
              console.log(stats);
              console.log(stats["size"]);
          });
      }
      res.send('respond with a resource');

  });

});


module.exports = router;
