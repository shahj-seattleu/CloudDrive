'use strict';

var util = require('util');
var path = require('path');
var express = require('express');
var router = express.Router();
var directories = require('../models/Directory-fs');

const log   = require('debug')('nodejs-team:router-directory');
const error = require('debug')('nodejs-team:error');


// Add Directory(File or Folder). (create)
router.post('/add', (req, res, next) => {
  console.log(req);
  //  log('File info='+ util.inspect(req.files));



});


module.exports = router;
