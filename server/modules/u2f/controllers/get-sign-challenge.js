var async = require('async');
var Joi = require('joi');
var Boom = require('boom');
var u2f = require('u2f');

module.exports.handler = function(request, reply) {
  var db = request.db.connect();
  db.collection("keys").find({ '_id': request.getPrincipal() }).limit(1).next(function(err, key) {
	  var authRequest = u2f.request("https://localhost:9000", key.keyHandle);
	  db.collection("keys").update({ '_id': request.getPrincipal() }, { "$set": { authRequest: authRequest }}, function(err, result) {
	    reply(authRequest);
	  });
  });

  
};

module.exports.config = function(config) {
  return {
    description: "List existing services for a given entity type.",
    auth: config.auth()
  }
};