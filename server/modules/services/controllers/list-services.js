var async = require('async');
var Joi = require('joi');
var Boom = require('boom');

var VALID_TYPES = ["user", "group"];

module.exports.handler = function(request, reply) {
  var db = request.db.connect();
  db.collection('services').find().toArray(function(err, services) {
    if(err) reply(Boom.badImplementation("Could not list services"));
    else reply(services.map(request.idTransform));
  });
};

module.exports.config = function(config) {
  return {
    description: "List all available services.",
    auth: config.auth(["admin"]),
    validate: {
      query: {
        type: Joi.string().valid(VALID_TYPES).required(),
        id: Joi.string().required()
      }
    }
  }
};