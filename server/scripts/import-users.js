var mongo = require('mongoskin');
var async = require('async');

module.exports = function(config) {

  var db = mongo.db(config.mongoDbUrl, { native_parser:true, safe: true });

  return function(filepath) {
    require('fs').readFile(filepath, 'utf8', function (err, data) {
      if (err) throw err;
      var users = JSON.parse(data).map(function(user) {
        user._id = user.username;
        delete user.username;
        return user;
      });

      db.collection('users').insert(users, function(err, result) {
        if(err) console.log("Problem while loading users.");
        else console.info("Users loaded successfully");
        process.exit(0);
      });
    });
  };
};