'use strict';

var util = require('util');
var path = require('path');
var express = require('express');
var router = express.Router();
var directories = require('../sequelize-models/Directory-fs');

const log   = require('debug')('nodejs-team:router-home');
const error = require('debug')('nodejs-team:error');

/* GET home page. */
router.get('/', function(req, res, next) {
    directories.keylist()
    .then(keylist => {
        var keyPromises = keylist.map(key => {
            return directories.read(key).then(directory => {
                return { key: directory.key, name: directory.name,path: directory.path,type: directory.type,
                  date: directory.date,size: directory.size };
            });
        });
        return Promise.all(keyPromises);
    })
    .then(directorylist => {
        log('HOMEPAGE directorylist='+ util.inspect(directorylist));
        res.render('index', {
            title: 'Cloud Drive',
            description: 'Directory',
            directorylist: directorylist,
            breadcrumbs: [
                { href: '/', text: 'Root' }
            ]
        });
    })
    .catch(err => { error(err); next(err); });
});

module.exports = router;
