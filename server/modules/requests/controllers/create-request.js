var async = require('async');
var Joi = require('joi');
var Boom = require('boom');

var SERVICES = ["email", "afs", "mysql"];

module.exports.handler = function(request, reply) {
  var userRequest = request.payload;
  var now = new Date().getTime();
  userRequest.status = "pending";
  userRequest.creationTimestamp = now;
  var db = request.db.connect();
  async.waterfall([
    function(callback) {
      db.collection('requests').insertOne(userRequest, function(err, result) {
        if(err) callback(Boom.badImplementation("Could not create user request"));
        else calback(null, request.idTransform(userRequest)).code(201);
      });
    },
    function(userRequest, callback) {
      request.dsiPanel.sendRequest(userRequest.id, {
        callbackUrl: request.server.settings.app.callbackUrl,
        payload: request.payload
      }, request.headers.authorization, request.callback);
    }], function(err, userRequest) {
      if(err) reply(err);
      else reply(userRequest);
    });
};

module.exports.config = function(config) {
  return {
    description: "Creates a new user request.",
    auth: config.auth(),
    validate: {
      payload: Joi.alternatives().try(require('./schemas'))
    }
  }
};