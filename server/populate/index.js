var mongo = require('mongoskin');
var async = require('async');

var config = require('../config/config');
var data = require('./data');

var db = mongo.db(config.mongoDbUrl, { native_parser:true, safe: true });

async.parallel([
  function(callback) {
    db.collection("users").insert(data.users, function(err, result) {
      callback(err, result);
    });
  },
  function(callback) {
  	db.collection("groups").insert(data.groups, function(err, result) {
      callback(err, result);
    });
  }
], function(err, results) {
  if(err) {
    console.log(err);
  }
  process.exit(0);
});