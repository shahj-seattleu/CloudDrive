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
var sha = require("../sha/sha.js");


router.get('/list', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-  With, Content-Type, Accept");
  var key = 0;
  if (req.params.path_id != undefined) {
    key = req.params.path_id;
  }
  var p = drive_sequelize.list(key);
  p.then(drives => {
      res.json(JSON.stringify(drives));
    })
    .catch(err => {
      next(err);
    });

});



router.post('/delete', function(req, res, next) {

  var key = 0;
  if (req.body.path_id != undefined) {
    key = req.body.path_id;
  }
  var p = drive_sequelize.get_drive(key);
  p.then(drive => {
      if (drive) {
        var isFile = validate.isDirectory(drive.path);
        var mul = drive_sequelize.multiple(key, isFile);
      mul.then(drives => {

          })
          .catch(err => {
            res.send(`Can't Delete.No File Found`);
            // needs to give an error json
            next(err);
          });
      }
    })
    .catch(err => {
      res.send(`Can't Delete.No File Found`);
      next(err);
    });


});


router.get('/move', function(req, res, next) {
  console.log("router move");
  var filePath = path.join(__dirname, '../drive', '');
  var result = validate.check_validation(filePath);
  if (result) {
    fs.readdir(filePath, function(err, id, destPath) {
      if (err)
        next(err);

      //////////////////////////////////////////////////////////
      id = 3; // TODO: Remove this test data! //
      destPath = 'test path'; // TODO: Remove this test data! //
      //////////////////////////////////////////////////////////

      var p = drive_sequelize.move(id, destPath);
      p.then(fileId => {
          res.json(JSON.stringify(p));
        })
        .catch(err => {
          next(err);
        });
    });
  } else {
    res.send(`Can't move. Faced Issue while Execution`);
  }

});


router.post('/add', function(req, res, next) {
  var src = path.join(__dirname, '../drive', '');

  var key = 0;
  if (req.body.path_id != undefined) {
    key = req.body.path_id;
  }
  if (req.body.file_path != undefined) {
    src = req.body.file_path;
  }
  // console.log(` Key query: ${key}`);
  // console.log(`src: ${src}`);
  let dest = path.join(__dirname, '../public/cloud/');
  fs.access(dest, (err) => {
    if (err)
      fs.mkdirSync(dest);

    if (key != 0) {
      var root = drive_sequelize.get_parent(key);
      root.then(p_drive => {
          // console.log(`Drive : ${p_drive}`);
          var data_promise = walkSync(src, dest, [], p_drive);
          data_promise.then(data => {
              var parent = drive_sequelize.list(key);
              parent.then(drives => {
                  res.status(200).send(JSON.stringify(drives));
                })
                .catch(err => {
                  reject(err);
                });

            })
            .catch(err => {
              next(err);
            });
        })
        .catch(err => {
          reject(err);
        });
    } else {
      var data_promise = walkSync(src, dest, [], null);
      data_promise.then(data => {
          console.log(`Key qu :${key}`);
          var parent = drive_sequelize.list(key);
          parent.then(drives => {
              res.status(200).send(JSON.stringify(drives));
            })
            .catch(err => {
              reject(err);
            });
        })
        .catch(err => {
          next(err);
        });
    }

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
                console.log('Path before SHA' + destDir);
                var sha_encyp = sha.getHash_Checksum(destDir);
                sha_encyp.then(data => {
                  drive_sequelize.update(data.id, sha_encyp);
                }).catch(err => {
                  next(err);
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
                console.log('Path before SHA' + destDir);
                var sha_encyp = sha.getHash_Checksum(destDir);
                sha_encyp.then(data => {
                  drive_sequelize.update(0, sha_encyp);
                }).catch(err => {
                  next(err);
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
