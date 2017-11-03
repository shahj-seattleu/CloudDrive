'use strict';

const path = require('path');
const util = require('util');

const log = require('debug')('nodejs-team:drive-sequelize');
const error = require('debug')('nodejs-team:error');

var models = require('../models/index');
var Drive = require('../models/drive');


exports.create = function(name, path, type, size) {
  console.log("test");
  return new Promise((resolve, reject) => {
    models.Drive.create({
      name: name,
      path: path,
      type: type,
      size: size
    }).then(function(user) {
      if (user)
        resolve(user.id);
      else {
        reject(`Error while creating a file`);
      }
    });
  });
};
