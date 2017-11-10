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
