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
var sha = require("../sha/sha");


router.get('/list', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-  With, Content-Type, Accept");
  var key = 0;
  if (req.query.path_id) {
    key = req.query.path_id;
  }
  var p = drive_sequelize.list(key);
  p.then(drives => {
      res.json(JSON.stringify(drives));
    })
    .catch(err => {
      res.status(404).send({
        error: err
      });
    });

});

router.get('/sha', function(req, res, next) {
  var key = 0;
  if (req.body.path_id != undefined) {
    key = req.body.path_id;
  }
  var path = drive_sequelize.getFilePath(key);
  path.then(drive => {
      if (drive) {
        var isFile = validate.isDirectory(drive.path);
        if (!isFile) {
          var sha_encyp = sha.getHash_Checksum(drive.path);
          sha_encyp.then(dat => {
            res.json(JSON.stringify(dat));
          }).catch(err => {
            next(err);
          });
        }
      }
    })
    .catch(err => {
      res.status(404).send({
        error: err
      });
    });

});


router.get('/delete', function(req, res, next) {
  console.log('here');
  var key = 0;
  if (req.body.path_id != undefined) {
    key = req.body.path_id;
  }
  var p = drive_sequelize.get_drive(key);

  p.then(drive => {
      if (drive) {
        console.log('pathhhhh' + drive.path);
        var isFile = validate.isDirectory(drive.path);
        var mul = drive_sequelize.multiple(key, isFile);

        mul.then(drives => {
            res.json(JSON.stringify(drives));
          })
          .catch(err => {
            res.status(404).send({
              error: err
            });
          });
      }
    })
    .catch(err => {
      res.status(404).send({
        error: err
      });
    });


});

router.post('/download', function(req, res, next) {

  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-  With, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');

  var key = 0;
  if (req.body.path_id != undefined) {
    key = req.body.path_id;
  }
  var p = drive_sequelize.get_drive(key);
  p.then(drive => {
      if (drive) {
        res.json(JSON.stringify(drive.path));
      }
    })
    .catch(err => {
      res.status(404).send({
        error: err
      });
    });


});


router.get('/move', function(req, res, next) {
  console.log("router move");
  var filePath = path.join(__dirname, '../drive', '');
  var result = validate.check_validation(filePath);
  if (result) {
    fs.readdir(filePath, function(err, id, destPath) {
      if (err)
        res.status(404).send({
          error: err
        });

      //////////////////////////////////////////////////////////
      id = 3; // TODO: Remove this test data! //
      destPath = 'test path'; // TODO: Remove this test data! //
      //////////////////////////////////////////////////////////

      var p = drive_sequelize.move(id, destPath);
      p.then(fileId => {
          res.json(JSON.stringify(p));
        })
        .catch(err => {
          res.status(404).send({
            error: err
          });
        });
    });
  } else {
    res.status(404).send({
      error: "Can't Move.No File Found"
    });
  }

});


router.post('/add', function(req, res, next) {
  var src = path.join(__dirname, '../drive', '');
  var key = 0;
  if (req.body.path_id != undefined) {
    key = req.body.path_id;
  }
  if (req.body.file_path != undefined) {
    src = path.join(__dirname, req.body.file_path, '');
  }
  console.log(`src: ${src}`);
  let dest = path.join(__dirname, '../public/cloud/');
  fs.access(dest, (err) => {
    if (err)
      fs.mkdirSync(dest);

    if (key != 0) {
      var root = drive_sequelize.get_parent(key);
      root.then(p_drive => {
          // console.log(`Drive : ${p_drive}`);
          walkSync(src, dest, [], p_drive);
          var parent = drive_sequelize.list(key);
          parent.then(drives => {
              res.status(200).send(JSON.stringify(drives));
            })
            .catch(err => {
              res.status(404).send({
                error: err
              });
            });
        })
        .catch(err => {
          next(err);
        });
    } else {
      walkSync(src, dest, [], null);
      var parent = drive_sequelize.list(key);
      parent.then(drives => {
          res.status(200).send(JSON.stringify(drives));
        })
        .catch(err => {
          res.status(404).send({
            error: err
          });
        });
    }

  });


});


var walkSync = function(dir, dest, filelist, data) {
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
              return;
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
              return;
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
                  var sha_ret = copyFile(path.join(dir, file), path.join(dest, file));
                  sha_ret.then(sha_data => {
                      var update_sha = drive_sequelize.update_SHA(drive.id, sha_data);
                      update_sha.then(status => {
                          console.log(status);
                        })
                        .catch(err => {
                          return;
                        });
                    })
                    .catch(err => {
                      return;
                    });
                  filelist.push(file);
                })
                .catch(err => {
                  return;
                });

            });

          } else {
            let destDir = path.join(dest, file);
            // console.log(`File Root destDir ${destDir}`);
            fs.access(destDir, (err) => {
              var child = drive_sequelize.create(0, file, destDir, 2, stats["size"]);
              child.then(drive => {
                  var sha_ret = copyFile(path.join(dir, file), path.join(dest, file));
                  sha_ret.then(sha_data => {
                      var update_sha = drive_sequelize.update_SHA(drive.id, sha_data);
                      update_sha.then(status => {
                          console.log(status);
                        })
                        .catch(err => {
                          return;
                        });
                    })
                    .catch(err => {
                      return;
                    });
                  filelist.push(file);

                })
                .catch(err => {
                  return;
                });

            });

          }
        } else {
          console.log("Read error");
          return;
        }
      });
    }

  });
  return filelist;
};


function copyFile(src, dest) {
  return new Promise((resolve, reject) => {
    // console.log('src', src);
    // console.log('dest', dest);
    let readStream = fs.createReadStream(src);

    readStream.once('error', (err) => {
      console.log(err);
      if (err) return reject(err);
    });

    readStream.once('end', () => {
      // console.log('done copying');
      var sha_encyp = sha.getHash_Checksum(dest);
      sha_encyp.then(sha_data => {
        resolve(sha_data);
      }).catch(err => {
        reject(err);
      });
    });

    readStream.pipe(fs.createWriteStream(dest));
  });
}


module.exports = router;
