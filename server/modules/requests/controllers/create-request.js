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
  db.collection('requests').insertOne(userRequest, function(err, result) {
    if(err) reply(Boom.badImplementation("Could not create user request"));
    else reply(request.idTransform(userRequest)).code(201);
  });
};

module.exports.config = {
  description: "Creates a new user request.",
  validate: {
    payload: Joi.alternatives().try(require('./schemas'))
  }
};