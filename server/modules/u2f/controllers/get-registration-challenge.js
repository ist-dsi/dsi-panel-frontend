var async = require('async');
var Joi = require('joi');
var Boom = require('boom');
var u2f = require('u2f');

module.exports.handler = function(request, reply) {
  var authRequest = u2f.request("https://localhost:9000");
  var db = request.db.connect();
  db.collection("keys").insertOne({ '_id': request.getPrincipal(), authRequest: authRequest }, function(err, result) {
    reply(JSON.stringify(authRequest));
  });
};

module.exports.config = function(config) {
  return {
    description: "List existing services for a given entity type.",
    auth: config.auth
  }
};