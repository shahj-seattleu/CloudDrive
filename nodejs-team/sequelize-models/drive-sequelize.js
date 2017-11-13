'use strict';

const path = require('path');
const util = require('util');

const log = require('debug')('nodejs-team:drive-sequelize');
const error = require('debug')('nodejs-team:error');

var models = require('../models/index');
var Drive = require('../models/drive');


exports.create = function(id,name, path, type, size) {
  return new Promise((resolve, reject) => {
    models.Drive.create({
      parent_id:id,
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

exports.list = function(parentId) {
  return new Promise((resolve, reject) => {
    models.Drive.findAll({
      where: {
         parent_id: parentId
      }
    }).then(function(drives) {
      if (drives)
        resolve(drives);
      else {
        reject(`Error while listing all drives`);
      }
    });
  });
};

exports.get_parent = function(id) {
  return new Promise((resolve, reject) => {
    models.Drive.find({
      where: {
         parent_id: id , fileType :1
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



exports.multiple  = function (id , isFile) {
   console.log("delete multiple");
   console.log("id"+id);
    id = '8';
    var x= getFile(id);
    if(isFile) {
    /*  return new Promise ((resolve, reject ) => {
        models.Drive.destroy({ where: { id: id }}).then(function(drive)  {
        if(drive == 0) {
          reject(`Not Deleted Successfully`);
        }
        else  {
          resolve("Deleted successfully");
        }
      });
    });*/
    } else {

     p = getFile(id);
   }

}

var getFile = function (id) {
  var array = [];
  console.log("get folders");
  console.log('id' +id);
  var drive = -1;
do{
     return new Promise ((resolve, reject ) => {
      models.Drive.findAll({ where: { parent_id: id }}).then(function(drive)  {
      console.log(drive);
      console.log('drivvvess' + drive.dataValues.id);
      array.push(drive.id);
      id = drive.id;
      console.log('id' + id);
    });
      });
  } while(drive !=0);

}

exports.delete = function (id) {
  console.log("delete");
  var id = '2';
  console.log('id'+id);
  return new Promise ((resolve, reject ) => {
  models.Drive.destroy({ where: { id: id }}).then(function(drive)  {
  console.log(drive);
  if(drive == 0) {
    reject (`Not Deleted Successfully`);
  }
  else  {
    resolve(drive);
  }
  });
});
}

exports.move = function (sourceId, destParentId) {
    console.log(`sourceId:${sourceId}  parentId:${destParentId}`)

    return new Promise((resolve, reject) => {

        var destRootPath = path.join(__dirname, '../public/cloud/');
        var destFullPath;
        var destFileName;

        // Find the name of the file/folder that we're moving
        models.Drive.findById(sourceId).then(function (sourceRow) {
            if (sourceRow) {
                destFileName = sourceRow.name;
            }
            else {
                var msg = `Failed to find "name" data for sourceId:${sourceId}`;
                console.log(msg);
                reject(msg);
            }

            // Find the path of the destination folder
            models.Drive.findById(destParentId).then(function (destRow) {
                if (destRow) {
                    // Build the path from the parent row
                    destFullPath = path.join(destRow.path, destFileName);
                }
                else if (destParentId == 0) {
                    // Use the default root path
                    destFullPath = path.join(destRootPath, destFileName)
                }
                else {
                    var msg = `Failed to find "path" data for id (destParentId):${destParentId}`;
                    console.log(msg);
                    reject(msg);
                }

                console.log(`destParentId full path: '${destFullPath}'`);

                // Update the database with the new path for the sourceId
                models.Drive.update(
                    {
                        parent_id: destParentId,
                        path: destPath
                    },
                    {
                        where: { id: sourceId }
                    }
                ).then(function (moved) {
                    if (moved != 0) {
                        var msg = `Moved id:${sourceId} to new parent:${destParentId}`;
                        console.log(msg);
                        resolve(msg);
                    }
                    else {
                        var msg = `Failed to move id:${sourceId} to new parent:${destParentId}`;
                        console.log(msg);
                        reject(msg);
                    }
                });
            });
        });
    });
};
