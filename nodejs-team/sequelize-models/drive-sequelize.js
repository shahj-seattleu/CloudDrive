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
