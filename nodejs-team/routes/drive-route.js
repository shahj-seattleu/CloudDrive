'use strict';

var util = require('util');
var path = require('path');
var express = require('express');
var router = express.Router();
var files = require('../sequelize-models/drive-sequelize');

const log = require('debug')('nodejs-team:router-dive');
const error = require('debug')('nodejs-team:error');
const fs = require("fs");



// Add Directory(File or Folder). (create)

router.post('/add', function(req, res, next) {
  console.log(`req: ${req.body}`);
  var filePath = path.join(__dirname, '../drive', '');
  console.log(`filePath: ${filePath}`);
  fs.readdir(filePath, function(err, items) {
    if (err)
      next(err);
    for (var i = 0; i < items.length; i++) {
      var file = filePath + '/' + items[i];
      console.log("File Location Path: " + file);
      fs.stat(file, function(err, stats) {
        if (stats) {
          console.log(stats);
          console.log(stats["size"]);
          var p = files.create(file,file,1,stats["size"]);
          p.then(fileId => {
              res.send(`respond with a resource id = ${fileId}`);
            })
            .catch(err => {
              next(err);
            });
        }
        else {
          // read error
          console.log("Read error");
        }

      });
    }


  });

});


module.exports = router;
