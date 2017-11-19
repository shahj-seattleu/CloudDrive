'use strict';

const path = require('path');
const util = require('util');

var del = require('node-delete');
const log = require('debug')('nodejs-team:drive-sequelize');
const error = require('debug')('nodejs-team:error');

var models = require('../models/index');
var Drive = require('../models/drive');
var sequelize = require('sequelize');


exports.create = function(id, name, path, type, size) {
  return new Promise((resolve, reject) => {
    models.Drive.create({
      parent_id: id,
      name: name,
      path: path,
      fileType: type,
      size: size
    }).then(function(drive) {
      if (drive)
        resolve(drive);
      else {
        reject(`Error while creating a Drive model`);
      }
    });
  });
};

exports.get_drive = function(id) {
  return new Promise((resolve, reject) => {
    models.Drive.find({
      where: {
        id: id
      }
    }).then(function(drive) {
      if (drive)
        resolve(drive);
      else {
        reject(`File not Found `);
      }
    });
  });
};


exports.getFilePath = function(id) {
  console.log("getFilePath" + id);
  return models.Drive.find({
    where: {
      id: id
    }
  })

}


exports.list = function(drive) {
//  console.log(  drive['0']);
var num=[];
Object.keys(drive).forEach(function(key) {
  var val = drive[key];
  var id = val.id;
  num.push(id);
});
    console.log('num'+num);
    return new Promise((resolve, reject) => {
      models.Drive.findAll({
        where: {
          id:num
        }
      }).then(function(drive) {
        if (drive)
          resolve(drive);
        else {
          reject(`Error while get drive`);
        }
      }).catch(err => {
        reject(`Error while get drive`);
      });
    });
};


exports.get_childdrive = function(id) {
  return new Promise((resolve, reject) => {
      models.Drive.findAll({
        where: {
          parent_id: id
        }
      }).then(function(drive) {
        if (drive)
          resolve(drive);
        else {
          reject(`Error while get drive`);
        }
      }).catch(err => {
        reject(`Error while get drive`);
      });
    });
};
exports.get_parent = function(id) {
  return new Promise((resolve, reject) => {
    models.Drive.find({
      where: {
        id: id,
        fileType: 1
      }
    }).then(function(drive) {
      if (drive)
        resolve(drive);
      else {
        reject(`Error while find a parent Drive model`);
      }
    });
  });
};

var removefiles = function(filePath) {
 del([filePath, ''], function (err, paths) {
     console.log('Deleted files/folders:\n', paths.join('\n'));
 });

}

exports.multiple = function(id, isFile) {
  console.log('IsFile' + isFile);
  var p;
  if (!isFile) {
    var x = getFilePath(id);
    console.log('sssss'+x);
    x.then(pdrive => {
        console.log('Remove file from drive'+pdrive.path);
        delete_file(id);
        removefiles(pdrive.path);
    }).catch(err => {
      reject(err);
    });
    return x;
  } else {
    var x = getFilePath(id);
    console.log('else');
    const Op = sequelize.Op;
    x.then(p_drive => {
      models.Drive.findAll({
        where: {
          path: {
            [Op.like]: p_drive.dataValues.path + '%'
          }
        }
      }).then(function(drive) {
        if(drive){
        Object.keys(drive).forEach(function(key) {
          var val = drive[key];
          var path = val.path;
          p = delete_file(val.id);
          console.log('Remove file from drive'+path);
          removefiles(path);
          console.log('sdddd' + p);
        }).catch(err => {
          reject(err);
        });
      }
      });
    }).catch(err => {
      reject(err);
    });
  }

  return x;
};


var delete_file = function(id) {
  console.log("delete with id" + id);
  return new Promise((resolve, reject) => {
    models.Drive.destroy({
      where: {
        id: id
      }
    }).then(affectedRows => {
      console.log('affected' + affectedRows);
      if (affectedRows == 1)
        resolve(`Deleted Successfully`);
      else {
        reject(`Unable to find a matching Drive model`);
      }
      return affectedRows;
    });
  });
};


var getFilePath = function(id) {
  console.log("getFilePath" + id);
  return models.Drive.find({
    where: {
      id: id
    }
  })
};


exports.update_SHA = function(id, sha) {
  return new Promise((resolve, reject) => {
    models.Drive.update({
      sha_256: sha
    }, {
      where: {
        id: id
      }
    }).then(function(drive) {
      console.log(`Return value : ${drive}`);
      if (drive == 0) {
        reject(`Failed to update SHA`);
      } else {
        resolve(`Updated successfully`);
      }
    });
  });
};


exports.move = function(sourceId, destPath) {
  console.log(`sourceId:${sourceId}  destPath:${destPath}`)

  return new Promise((resolve, reject) => {

    var destRootPath = path.join(__dirname, '../public/cloud/');
    var destSearchPath;
    var destFullPath;
    var destFileName;
    var sourceFileType;
    var sourceRootPath;
    var msg;

    // First perform basic error checking on the parameters
    if (sourceId <= 0) {
      msg = `Invalid sourceId:${sourceId}`;
      console.log(msg);
      return reject(msg);
    } else if (!destPath) {
      msg = `Invalid destPath:'${destPath}'`;
      console.log(msg);
      return reject(msg);
    }

    // Find the name of the source file/folder that we're moving
    models.Drive.findById(sourceId).then(function(sourceRow) {
      if (sourceRow) {
        destFileName = sourceRow.name;
        sourceFileType = sourceRow.fileType;
        sourceRootPath = sourceRow.path;
      } else {
        msg = `Failed to find data for sourceId:${sourceId}`;
        console.log(msg);
        return reject(msg);
      }

      destSearchPath = path.join(destPath, '/');
      console.log(`destSearchPath: '${destSearchPath}'`);

      // Find new parent ID
      var destParentId;
      var destFileType;
      models.Drive.find({
        where: {
          path: destSearchPath
        }
      }).then(function(destRow) {
        if (destRow) {
          // Found the path specified, use it's ID as the new parentId
          destParentId = destRow.id;
          destFileType = destRow.fileType;
        } else if (destRootPath == destSearchPath) {
          // The path was not found, but it's the same as the root,
          // so set the root (0) as the parentId
          destParentId = 0;
          destFileType = 1;
        } else {
          // Unable to find the path
          msg = `Failed to find data for destPath:${destSearchPath}`;
          console.log(msg);
          return reject(msg);
        }

        // Sanity check -- validate that we can actually move from the source
        // to the specified destination
        if (sourceRow.id == destParentId) {
          msg = `Cannot move sourceId:${sourceId} to the same file/folder! (destSearchPath: '${destSearchPath}')`;
          console.log(msg);
          return reject(msg);
        } else if (sourceRow.parent_id == destParentId) {
          msg = `Cannot move sourceId:${sourceId} to the same parent folder! (destSearchPath: '${destSearchPath}')`;
          console.log(msg);
          return reject(msg);
        } else if (destFileType != 1) {
          msg = `Cannot move sourceId:${sourceId} to an existing file!`;
          console.log(msg);
          return reject(msg);
        } else if (destSearchPath.indexOf(sourceRootPath) >= 0) {
          msg = `Cannot move sourceId:${sourceId} to a path within itself! (destSearchPath: '${destSearchPath}')`;
          console.log(msg);
          return reject(msg);
        }

        // Build the path from the filename and destination path
        destFullPath = path.join(destSearchPath, destFileName);
        if (sourceFileType == 1) {
          // Destination is a path, so make sure there's a trailing slash
          destFullPath = path.join(destFullPath, '/');
        }

        console.log(`destFullPath: '${destFullPath}'`);

        // Update the source file/folder in the database with the new path and parentId
        models.Drive.update({
          parent_id: destParentId,
          path: destFullPath
        }, {
          where: {
            id: sourceId
          }
        }).then(function(moved) {
          if (moved != 0) {
            msg = `Moved id:${sourceId} to new parent:${destParentId}`;
            console.log(msg);

            // If we're moving a folder, then we need to update the paths for each of
            // it's children as well to reflect the new location.
            if (sourceFileType == 1) {

              // When querying for a string with backslashes, they need to be doubled up,
              // even if they already look doubled up in anything output to the console.
              // For example, if we search for C:\\SOME\\PATH then we need to actually look
              // for C:\\\\SOME\\\\PATH in order for the search to be successful.
              var pattern = /\\/g;
              var sqlSearchPath = sourceRootPath.replace(pattern, "\\\\");
              console.log(`sqlSearchPath: '${sqlSearchPath}'`);

              // Find all records that match the path we're looking for
              const Op = sequelize.Op;
              models.Drive.findAll({
                where: {
                  path: {
                    [Op.like]: sqlSearchPath + '%'
                  }
                }
              }).then(function(results) {
                // Loop through each record and update the path
                var promises = [];
                Object.keys(results).forEach(function(key) {
                  var val = results[key];
                  var updatedPath = val.path.replace(sourceRootPath, destFullPath);
                  console.log(`UPDATED PATH: '${updatedPath}'`);
                  val.updateAttributes({path: updatedPath});
                });

                resolve("Move completed successfully");

              }).catch(err => {
                console.log("Error caught: " + err);
                reject(err);
              });
            } else {
              // File has been successfully moved, so we're done!
              resolve(msg);
            }
          } else {
            msg = `Failed to move id:${sourceId} to new parent:${destParentId}`;
            console.log(msg);
            reject(msg);
          }
        });
      });
    });
  });
};
