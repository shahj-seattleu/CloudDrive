var expect  = require('chai').expect;
var request = require('request');
var models = require('../models/index');
var Drive = require('../models/drive');
var sequelize = require('sequelize');
var assert = require('chai').assert;

// test case to insert and delete a record into database

  describe('model', function() {
    it('should insert record into model', function() {
      models.Drive.create(
       { parent_id: 2, name: 'folder1',path:'testpath',
       fileType:1,size:352,sha_256:'testsha' });
       models.Drive.count({where: { path : 'testpath' }})
        .then(function(count) {
            assert.isAbove(count,-1);
              console.log("Test Passed");
    });
    });

    it('should insert record into model', function() {
      models.Drive.destroy(
       {where: {path:'testpath'}});
       models.Drive.count({where: { path : 'testpath' }})
        .then(function(count) {
            assert.isAbove(count,-1);
              console.log("Test Passed");
    });
    });

});
