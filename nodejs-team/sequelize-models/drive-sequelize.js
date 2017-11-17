'use strict';

const path = require('path');
const util = require('util');

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
        reject(`Error while get drive`);
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

exports.list = function(sourceId) {
  return new Promise((resolve, reject) => {
    var isFile;
    console.log(`ID:${sourceId}`)

    // Find the name of the file/folder that we're moving
    models.Drive.findById(sourceId).then(function(sourceRow) {
      if (sourceRow || sourceId == 0) {
        isFile = (sourceId == 0) ? 1 : sourceRow.fileType;
        if (isFile == 1) {
          // A folder list has been requested, so find everything that has this folder as a parent
          models.Drive.findAll({
            where: {
              parent_id: sourceId
            }
          }).then(function(drives) {
            if (drives)
              resolve(drives);
            else {
              // This case covers when a folder is empty and thus intentionally returns an empty result,
              // which indicates that the folder is empty.
              resolve(drives);
            }
          });
        } else if (isFile == 2) {
          // An individual file has been requested, so send back the data that we already have
          resolve(sourceRow);
        } else {
          // Someone goofed somewhere and the database has an invalid fileType, so complain!
          var msg = `Error: Unknown fileType detected:${isFile}`;
          console.log(msg);
          reject(msg);
        }
      } else {
        var msg = `Failed to find "name" data for sourceId:${sourceId}`;
        console.log(msg);
        reject(msg);
      }
    });
  });
};


exports.get_parent = function(id) {
  return new Promise((resolve, reject) => {
    models.Drive.find({
      where: {
        parent_id: id,
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


exports.multiple = function(id, isFile) {
  console.log('IsFile' + isFile);

  var p;
  if (!isFile) {
    var c = delete_file(id);
    return c;
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
        Object.keys(drive).forEach(function(key) {
          var val = drive[key];
          p = delete_file(val.id);
          console.log('sdddd' + p);
        }).catch(err => {
          reject(err);
        });
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
        reject(`Error while find a deletinf Drive model`);
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
    var destFullPath;
    var destFileName;
    var isFile;

    // Find the name of the file/folder that we're moving
    models.Drive.findById(sourceId).then(function(sourceRow) {
      if (sourceRow) {
        destFileName = sourceRow.name;
        isFile = sourceRow.fileType;
      } else {
        var msg = `Failed to find "name" data for sourceId:${sourceId}`;
        console.log(msg);
        reject(msg);
      }

      // Use the destination path provided in the function
      if (destPath) {
        // Build the path from the filename and destination path
        if (isFile == 1) {
          destFullPath = path.join(destPath, destFileName, '\\');
        } else if (isFile == 2) {
          destFullPath = path.join(destPath, destFileName);
        }
      } else {
        var msg = `Path not valid (destPath):${destPath}`;
        console.log(msg);
        reject(msg);
      }

      console.log(`destFullPath full path: '${destFullPath}'`);

      // Find new parent ID
      var destParentId;
      models.Drive.find({
        where: {
          path: destPath
        }
      }).then(function(sourceRow) {
        if (sourceRow) {
          destParentId = sourceRow.id;
        } else if (destRootPath == destPath) {
          destParentId = 0;
        } else {
          var msg = `Failed to find "Id" data for destPath:${destPath}`;
          console.log(msg);
          reject(msg);
        }

        //Update the database with the new path for the sourceId
        models.Drive.update({
          parent_id: destParentId,
          path: destFullPath
        }, {
          where: {
            id: sourceId
          }
        }).then(function(moved) {
          if (moved != 0) {
            var msg = `Moved id:${sourceId} to new parent:${destParentId}`;
            console.log(msg);
            resolve(msg);
          } else {
            var msg = `Failed to move id:${sourceId} to new parent:${destParentId}`;
            console.log(msg);
            reject(msg);
          }
        });

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // TODO: FIX THIS SINCE IT WILL LIKELY RUN **BEFORE** THE PREVIOUS CALL TO models.Drive.update() FINISHES ITS UPDATE  //
        // (SINCE IT IS NOT PART OF THE CALLBACK) -- OR IS THAT OK SINCE IT'S BASICALLY DELETING IN PARALLEL WITH THE UPDATE? //
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        if (isFile == 1) {
          //to be tested with nested folders
          models.Drive.find({
            where: {
              parent_id: sourceId
            }
          }).then(function(drive) {
            exports.move(drive.id, path.join(destFullPath))
          });
        }
      });
    });
  });
};
