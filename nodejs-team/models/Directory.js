'use strict';

const util = require('util');

const log = require('debug')('nodejs-team:Directory');
const error = require('debug')('nodejs-team:error');

module.exports = class Directory {
  constructor(key, name, path, type, date, size) {
    this.key = key;
    this.name = name;
    this.path = path;
    this.type = type;
    this.date = date;
    this.size = size;
  }

  get JSON() {
    return JSON.stringify({
      key: this.key,
      name: this.name,
      path: this.path,
      type: this.type,
      date: this.date,
      size: this.size
    });
  }

  static fromJSON(json) {
    var data = JSON.parse(json);
    var directory = new Directory(data.key, data.name, data.path, data.type, data.date, data.size);
    log(json + ' => ' + util.inspect(directory));
    return directory;
  }
};
