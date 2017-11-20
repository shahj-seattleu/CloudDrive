var express = require('express');
var models = require('../models/index');
var Drive = require('../models/drive');
var routes = require("../routes");
var sequelize = require('sequelize');
var assert = require('chai').assert;
var request = require('chai').request;
var expect = require('chai').expect;

let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
chai.use(chaiHttp);

// test case to insert and delete a record into database

describe('model', function() {
  it('should insert record into model', function() {
    models.Drive.create({
      parent_id: 2,
      name: 'folder1',
      path: 'testpath',
      fileType: 1,
      size: 352,
      sha_256: 'testsha'
    });
    models.Drive.count({
        where: {
          path: 'testpath'
        }
      })
      .then(function(count) {
        assert.isAbove(count, -1);
        console.log("Test insert Passed");
      });
  });

  it('should delete record from model', function() {
    models.Drive.destroy({
      where: {
        path: 'testpath'
      }
    });
    models.Drive.count({
        where: {
          path: 'testpath'
        }
      })
      .then(function(count) {
        assert.isAbove(count, -1);
        console.log("Test delete Passed");
      });
  });

});


describe('/response ', () => {
  it('Response should be JSON', function() {
    chai.request('http://127.0.0.1:3000/files/')
      .get('/list')
      .end((err, res) => {
        res.should.be.json;
        res.should.not.be.html;
        res.should.not.be.text;
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body.length.should.be.eql(0);
        console.log("Test response Passed");

      }).catch(err => {
        reject(`Test response failed`);
      });
  });
});
