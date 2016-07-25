var async = require('async');
var Joi = require('joi');
var Boom = require('boom');

module.exports.handler = function(request, reply) {
  var db = request.db.connect();
  db.collection('requests').findById(request.params.id, function(err, userRequest) {
    if(err) reply(Boom.badImplementation("Could not find the request"));
    else reply(request.idTransform(userRequest));
  });
};

module.exports.config = function(config) {
  return {
    description: "Views an existing user or group request.",
    auth: config.auth(),
    validate: {
      params: {
        id: Joi.string().required()
      }
    }
  }
};