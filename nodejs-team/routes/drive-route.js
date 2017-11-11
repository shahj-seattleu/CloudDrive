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
  var src = path.join(__dirname, '../drive', '');
  // console.log(`src: ${src}`);
  let dest = path.join(__dirname, '../public/cloud/');
  fs.access(dest, (err) => {
    if (err)
      fs.mkdirSync(dest);

    var data_promise = walkSync(src, dest, [], null);
    data_promise.then(data => {
        console.log(data);
        res.send(data);
      })
      .catch(err => {
        next(err);
      });
  });


});


var walkSync = function(dir, dest, filelist, data) {

  return new Promise((resolve, reject) => {
    // console.log(`dest in the params : ${dest}`);
    var files = fs.readdirSync(dir);
    filelist = filelist || [];
    // console.log(`All Files: ${files}`);
    files.forEach(function(file) {
      if (fs.statSync(path.join(dir, file)).isDirectory()) {
        // console.log(`Directory: ${path.join(dir, file)}`);
        var folder_name = path.basename(path.join(dir, file));
        // console.log(`folder_name: ${folder_name}`);
        if (data) {
          let destDir = path.join(dest, file, '/');
          // console.log(`Folder destDir ${destDir}`);
          fs.access(destDir, (err) => {
            if (err)
              fs.mkdirSync(destDir);
            var parent = drive_sequelize.create(data.id, folder_name, destDir, 1, 0);
            parent.then(drive => {
                filelist = walkSync(path.join(dir, file), destDir, filelist, drive);
              })
              .catch(err => {
                reject(err);
              });
          });


        } else {
          let destDir = path.join(dest, file, '/');
          // console.log(`Folder destDir Root${destDir}`);
          fs.access(destDir, (err) => {
            if (err)
              fs.mkdirSync(destDir);
            var parent = drive_sequelize.create(0, folder_name, destDir, 1, 0);
            parent.then(drive => {
                filelist = walkSync(path.join(dir, file), destDir, filelist, drive);
              })
              .catch(err => {
                reject(err);
              });
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
              let destDir = path.join(dest, file);
              // console.log(`File destDir ${destDir}`);
              fs.access(destDir, (err) => {
                var child = drive_sequelize.create(data.id, file, destDir, 2, stats["size"]);
                child.then(drive => {
                    copyFile(path.join(dir, file), path.join(dest, file));
                    filelist.push(file);
                  })
                  .catch(err => {
                    reject(err);
                  });
              });

            } else {
              let destDir = path.join(dest, file);
              // console.log(`File Root destDir ${destDir}`);
              fs.access(destDir, (err) => {
                var child = drive_sequelize.create(0, file, destDir, 2, stats["size"]);
                child.then(drive => {
                    copyFile(path.join(dir, file), path.join(dest, file));
                    filelist.push(file);
                  })
                  .catch(err => {
                    reject(err);
                  });
              });

            }
          } else {
            console.log("Read error");
            reject("Read error");
          }
        });
      }

    });
    return resolve(filelist);
  });
};


function copyFile(src, dest) {

  // console.log('src', src);
  // console.log('dest', dest);
  let readStream = fs.createReadStream(src);

  readStream.once('error', (err) => {
    console.log(err);
  });

  readStream.once('end', () => {
    // console.log('done copying');
  });

  readStream.pipe(fs.createWriteStream(dest));
}

module.exports = router;
