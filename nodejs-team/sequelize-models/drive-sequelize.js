'use strict';

const path = require('path');
const util = require('util');

const log = require('debug')('nodejs-team:drive-sequelize');
const error = require('debug')('nodejs-team:error');
const fsx = require("fs-extra");

var models = require('../models/index');
var Drive = require('../models/drive');
var sequelize = require('sequelize');


exports.create = function (id, name, path, type, size) {
  return new Promise((resolve, reject) => {
    models.Drive.create({
      parent_id: id,
      name: name,
      path: path,
      fileType: type,
      size: size
    }).then(function (drive) {
      if (drive)
        resolve(drive);
      else {
        reject(`Error while creating a Drive model`);
      }
    });
  });
};

exports.get_drive = function (id) {
  return new Promise((resolve, reject) => {
    models.Drive.find({
      where: {
        id: id
      }
    }).then(function (drive) {
      if (drive)
        resolve(drive);
      else {
        reject(`Error while get drive`);
      }
    });
  });
};

exports.getFilePath = function (id) {
  console.log("getFilePath" + id);
  return models.Drive.find({
    where: {
      id: id
    }
  })

}
/*
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
*/

exports.list = function (id) {
  console.log('id' + id);
  var x = getFilePath(id);
  return new Promise((resolve, reject) => {
    x.then(p_drive => {
      models.Drive.findAll({
        where: {
          parent_id: id
        }
      }).then(function (drive) {
        //  console.log('drrrive'+drive);
        if (drive) {
          resolve(drive);
        } else {
          reject(`Error while find a parent Drive model`);
        }
      }).catch(err => {
        reject(`Error while find a parent Drive model`);
      });
    });
  });
};

exports.get_childdrive = function (id) {
  if (id == 0) {
    return new Promise((resolve, reject) => {
      models.Drive.find({

        where: {
          parent_id: id
        }
      }).then(function (drive) {
        if (drive)
          resolve(drive);
        else {
          reject(`Error while get drive`);
        }
      }).catch(err => {
        reject(`Error while get drive`);
      });
    });
  } else {
    return new Promise((resolve, reject) => {
      models.Drive.find({
        where: {
          id: id
        }
      }).then(function (drive) {
        if (drive)
          resolve(drive);
        else {
          reject(`Error while get drive`);
        }
      }).catch(err => {
        reject(`Error while get drive`);
      });
    });

  }
};
exports.get_parent = function (id) {
  return new Promise((resolve, reject) => {
    models.Drive.find({
      where: {
        id: id,
        fileType: 1
      }
    }).then(function (drive) {
      if (drive)
        resolve(drive);
      else {
        reject(`Error while find a parent Drive model`);
      }
    });
  });
};


exports.multiple = function (id, isFile) {
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
      }).then(function (drive) {
        Object.keys(drive).forEach(function (key) {
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


var delete_file = function (id) {
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


var getFilePath = function (id) {
  console.log("getFilePath" + id);
  return models.Drive.find({
    where: {
      id: id
    }
  })
};


exports.update_SHA = function (id, sha) {
  return new Promise((resolve, reject) => {
    models.Drive.update({
      sha_256: sha
    }, {
        where: {
          id: id
        }
      }).then(function (drive) {
        console.log(`Return value : ${drive}`);
        if (drive == 0) {
          reject(`Failed to update SHA`);
        } else {
          resolve(`Updated successfully`);
        }
      });
  });
};


exports.move = function (sourceId, destPath) {
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
    models.Drive.findById(sourceId).then(function (sourceRow) {
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
      }).then(function (destRow) {
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
          }).then(function (moved) {
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
                }).then(function (results) {
                  // Loop through each record and update the path
                  var promises = [];
                  Object.keys(results).forEach(function (key) {
                    var val = results[key];
                    var updatedPath = val.path.replace(sourceRootPath, destFullPath);
                    console.log(`UPDATED PATH: '${updatedPath}'`);
                    val.updateAttributes({ path: updatedPath });
                  });

                  // Now move the actual folder on the server
                  fsx.move(sourceRootPath, destFullPath, function (err) {
                    if (err) {
                      console.log(err);
                      reject(err);
                    } else {
                      resolve("Move completed successfully");
                    }
                  });
                }).catch(err => {
                  console.log("Error caught: " + err);
                  reject(err);
                });
              } else {
                // Now move the actual file on the server
                fsx.move(sourceRootPath, destFullPath, function (err) {
                  if (err) {
                    console.log(err);
                    reject(err);
                  } else {
                    // File has been successfully moved, so we're done!
                    resolve(msg);
                  }
                });
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
