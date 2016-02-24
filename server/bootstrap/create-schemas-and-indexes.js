var mongo = require('mongoskin');
var async = require('async');

module.exports = function(config) {

  var db = mongo.db(config.mongoDbUrl, { native_parser:true, safe: true });

  console.info("[BOOTSTRAP]", "Ensuring index on users, groups and requests collections...");
  async.parallel([
    function(callback) {
      db.collection('users').ensureIndex({ "_id": "text", "email": "text", "name": "text" }, callback);
    },
    function(callback) {
      db.collection('requests').ensureIndex({ "author": "text", "service": "text", "_id": 1 }, callback);
    },
    function(callback) {
      db.collection('groups').ensureIndex({ "name": "text" }, callback);
    }
  ], function(err, result) {
    db.close();
    console.info("[BOOTSTRAP]", "Indexes created!");
  });

};