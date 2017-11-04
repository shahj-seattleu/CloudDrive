'use strict';

var util = require('util');
var path = require('path');
var express = require('express');
var router = express.Router();
const log   = require('debug')('nodejs-team:router-home');
const error = require('debug')('nodejs-team:error');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
      title: 'Cloud Drive',
      description: 'Directory',
      directorylist: [],
      breadcrumbs: [
          { href: '/', text: 'Root' }
      ]
  });
});

module.exports = router;
