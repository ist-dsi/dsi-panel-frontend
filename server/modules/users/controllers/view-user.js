var async = require('async');
var Joi = require('joi');
var Boom = require('boom');

module.exports.handler = function(request, reply) {
  var db = request.db.connect();
  var principal = request.getPrincipal();
  async.parallel([
    function(callback) {
      db.collection('users').find({ "_id": request.params.id }).limit(1).next(function(err, user) {
        if(err) callback(Boom.badImplementation("Could not find the user"));
        else callback(null, request.idTransform(user));
      });
    },
    function(callback) {
      db.collection('requests').find({ "author": request.params.id }).toArray(function(err, requests) {
        if(err) callback(Boom.badImplementation("Could not find the user"));
        else callback(null, requests.map(request.idTransform));
      });
    },
    function(callback) {
      db.collection('groups').find({ members: { "$in": [request.params.id] }}).toArray(function(err, groups) {
        if(err) callback(Boom.badImplementation("Could not find the user"));
        else callback(null, groups.map(function(group) {
          var group = request.idTransform(group);
          group.isAdmin = group.admins.indexOf(request.params.id) > -1;
          delete group.admins;
          return group;
        }));
      });
  }], function(err, results) {
    if(err) reply(err);
    else {
      var user = results[0];
      user.requests = results[1];
      user.groups = results[2];
      reply(user);
    }
  });
};

module.exports.config = function(config) {
  return {
    description: "Views an existing user.",
    auth: Object.assign({}, config.auth, { scope: ["admin"]}),
    validate: {
      params: {
        id: Joi.string().required()
      }
    }
  }
};