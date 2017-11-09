'use strict';
var util = require('util');
var path = require('path');
var express = require('express');
var router = express.Router();
var files = require('../sequelize-models/drive-sequelize');
const log = require('debug')('nodejs-team:router-dive');
const error = require('debug')('nodejs-team:error');
const fs = require("fs");
var validate = require("../validation/validation");


router.get('/list', function(req, res, next) {
  console.log("here");
    var filePath = path.join(__dirname, '../drive', '');
    var result = validate.check_validation(filePath);
    if(result) {
    var isRoot = false;
    fs.readdir(filePath, function(err, id) {
      if (err)
        next(err);
      if(id == 0 ) {
        isRoot = true;
      }
      var p = files.list(id, isRoot);
      p.then(fileId => {
        res.json(JSON.stringify(p));
        })
        .catch(err => {
          next(err);
        });
    });
} else {
    res.send(`Can't list.Faced Issue while Execution`);
}

  });

/*
router.post('/add', function (req, res, next) {
  var filePath = path.join(__dirname, '../drive', '');
  console.log(`filePath: ${filePath}`);
  fs.readdir(filePath, function(err, items) {
    if (err)
      next(err);
    for (var i = 0; i < items.length; i++) {
      var file = filePath+'/'+items[i];
      console.log('name :'+items[i]);
      console.log('filepath' + file);
    }
  });

});*/



router.post('/delete', function(req, res, next) {
      var filePath = path.join(__dirname, '../drive', '');
      var result = validate.check_validation(filePath);
      if(result) {
      fs.readdir(filePath, function(err, id) {
      if (err)
        next(err);
      var p =files.delete(id);
      p.then(fileId => {
              res.json(JSON.stringify(p));
      })
      .catch(err => {
         next(err);
      });

  });
}
else {
      res.send(`Can't Delete.Faced Issue while Execution`);
}
});



// Add Directory(File or Folder). (create)
router.post('/add', function(req, res, next) {
  console.log(`req: ${req.body}`);
  var filePath = path.join(__dirname, '../drive', '');
  console.log(`filePath: ${filePath}`);
 /*fs.readdir(filePath, function(err, items) {
  while(items.length >0){*/
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
