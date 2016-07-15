var async = require('async');
var Joi = require('joi');
var Boom = require('boom');

module.exports.handler = function(request, reply) {
  var principal = request.getPrincipal();
  var db = request.db.connect();
  async.parallel([
    function(callback) {
      db.collection('users').find({ _id: principal }).limit(1).next(function(err, user) {
        if(err) callback(Boom.badImplementation("Could not list profiles"));
        else callback(null, [{ slug: user._id, name: user.name, type: "user" }])
      });
    },
    function(callback) {
      db.collection('groups').find({ admins: { "$in": [ principal ] } }).toArray(function(err, groups) {
        if(err) callback(Boom.badImplementation("Could not list profiles"));
        else callback(null, groups.map(function(group) {
            return {
              name: group.name,
              type: group
            }
        }));
          
      });
  }], function(err, results) {
    if(err) reply(err);
    else reply(results[0].concat(results[1]));
  });
};

module.exports.config = function(config) {
  return {
    description: "List user profiles.",
    auth: config.auth
  }
}