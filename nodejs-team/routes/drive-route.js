'use strict';
var util = require('util');
var path = require('path');
var express = require('express');
var router = express.Router();
var drive_sequelize = require('../sequelize-models/drive-sequelize');
const log = require('debug')('nodejs-team:router-dive');
const error = require('debug')('nodejs-team:error');
const fs = require("fs");
var validate = require("../validation/validation");


router.get('/list', function(req, res, next) {
  console.log("here");
  var filePath = path.join(__dirname, '../drive', '');
  var result = validate.check_validation(filePath);
  if (result) {
    var isRoot = false;
    fs.readdir(filePath, function(err, id) {
      if (err)
        next(err);
      if (id == 0) {
        isRoot = true;
      }
      var p = drive_sequelize.list(id, isRoot);
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



router.post('/delete', function(req, res, next) {
  var filePath = path.join(__dirname, '../drive', '');
  var result = validate.check_validation(filePath);
  if (result) {
    fs.readdir(filePath, function(err, id) {
      if (err)
        next(err);
      var p = drive_sequelize.delete(id);
      p.then(fileId => {
          res.json(JSON.stringify(p));
        })
        .catch(err => {
          next(err);
        });

    });
  } else {
    res.send(`Can't Delete.Faced Issue while Execution`);
  }
});



router.post('/add', function(req, res, next) {
  var filePath = path.join(__dirname, '../drive', '');
  console.log(`filePath: ${filePath}`);
  var data_promise = walkSync(filePath, [], null);
  data_promise.then(data => {
      console.log(data);
      res.send(`respond `);
    })
    .catch(err => {
      next(err);
    });
});


var walkSync = function(dir, filelist, data) {
  return new Promise((resolve, reject) => {
    var files = fs.readdirSync(dir);
    filelist = filelist || [];
    // console.log(`All Files: ${files}`);
    files.forEach(function(file) {
      if (fs.statSync(path.join(dir, file)).isDirectory()) {
        // console.log(`Directory: ${path.join(dir, file)}`);
        var folder_name = path.basename(path.join(dir, file));
        // console.log(`folder_name: ${folder_name}`);
        if (data) {
          var parent = drive_sequelize.create(data.id, folder_name, path.join(dir, file), 1, 0);
          parent.then(drive => {
              filelist = walkSync(path.join(dir, file), filelist, drive);
            })
            .catch(err => {
              reject(err);
            });
        } else {
          var parent = drive_sequelize.create(0, folder_name, path.join(dir, file), 1, 0);
          parent.then(drive => {
              filelist = walkSync(path.join(dir, file), filelist, drive);
            })
            .catch(err => {
              reject(err);
            });
        }

      } else {
        // console.log(`File: ${file}`);
        fs.stat(path.join(dir, file), function(err, stats) {
          if (stats) {
            // console.log(stats["size"]);
            var file_path = path.basename(path.join(dir, file));
            // console.log(`file_path: ${file_path}`);
            if (data) {
              var child = drive_sequelize.create(data.id, file, file_path, 2, stats["size"]);
              child.then(drive => {
                  filelist.push(file);
                })
                .catch(err => {
                  reject(err);
                });
            } else {
              var child = drive_sequelize.create(0, file, file_path, 2, stats["size"]);
              child.then(drive => {
                  filelist.push(file);
                })
                .catch(err => {
                  reject(err);
                });
            }
          } else {
            console.log("Read error");
            reject("Read error");
          }
        });
      }

    });
    return resolve(filelist);;
  });
};




module.exports = router;
