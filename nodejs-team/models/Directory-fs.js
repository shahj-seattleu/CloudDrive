'use strict';

const fs    = require('fs-extra');
const path  = require('path');
const util  = require('util');

const log   = require('debug')('nodejs-team:Directory-fs-model');
const error = require('debug')('nodejs-team:error');

const Directory = require('./Directory');

function folderDir() {
    const dir = process.env.DIRECTORY_FS_DIR || "directory-fs-data";
    return new Promise((resolve, reject) => {
        fs.ensureDir(dir, err => {
            if (err) reject(err);
            else resolve(dir);
        });
    });
}

function filePath(documentsdir, key) {
    return path.join(documentsdir, key + ".json");
}

function readJSON(documentsdir, key) {
    const readFrom = filePath(documentsdir, key);
    return new Promise((resolve, reject) => {
        fs.readFile(readFrom, 'utf8', (err, data) => {
            if (err) return reject(err);
            log('readJSON '+ data);
            resolve(Directory.fromJSON(data));
        });
    });
}

exports.update = exports.create = function(key,name,path,type,date,size) {
    return folderDir().then(folderdir => {
        if (key.indexOf('/') >= 0) throw new Error(`key ${key} cannot contain '/'`);
        var directory = new Directory(key,name,path,type,date,size);
        const writeTo = filePath(folderdir, key);
        const writeJSON = directory.JSON;
        log('WRITE '+ writeTo +' '+ writeJSON);
        return new Promise((resolve, reject) => {
            fs.writeFile(writeTo, writeJSON, 'utf8', err => {
                if (err) reject(err);
                else resolve(note);
            });
        });
    });
};

exports.read = function(key) {
    return folderDir().then(folderdir => {
        return readJSON(folderdir, key).then(thedirectory => {
            log('READ '+ folderdir +'/'+ key +' '+ util.inspect(thedirectory));
            return thedirectory;
        });
    });
};

exports.destroy = function(key) {
    return folderDir().then(folderdir => {
        return new Promise((resolve, reject) => {
            fs.unlink(filePath(folderdir, key), err => {
                if (err) reject(err);
                else resolve();
            });
        });
    });
};

exports.keylist = function() {
    return folderDir().then(folderdir => {
        return new Promise((resolve, reject) => {
            fs.readdir(folderdir, (err, filez) => {
                if (err) return reject(err);
                if (!filez) filez = [];
                resolve({ folderdir, filez });
            });
        });
    })
    .then(data => {
        log('keylist dir='+ data.folderdir +' files='+ util.inspect(data.filez));
        var thedirectories = data.filez.map(fname => {
            var key = path.basename(fname, '.json');
            log('About to READ '+ key);
            return readJSON(data.folderdir, key).then(thedirectory => {
                return thedirectory.key;
            });
        });
        return Promise.all(thedirectories);
    });
};

exports.count   = function()    {
    return folderDir().then(folderdir => {
        return new Promise((resolve, reject) => {
            fs.readdir(folderdir, (err, filez) => {
                if (err) return reject(err);
                resolve(filez.length);
            });
        });
    });
};
