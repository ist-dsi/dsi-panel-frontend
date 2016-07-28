var async = require('async');
var Joi = require('joi');
var Boom = require('boom');
var _ = require('underscore');

var VALID_TYPES = ["user", "group"];

var generalError = Boom.badImplementation("Could not list provisionings");

module.exports.handler = function(request, reply) {
  var db = request.db.connect();
  
  db.collection('provisionings').find({ target: request.query.id, service: request.params.service }).limit(1).next(function(err, provisioning) {
    if(err) reply(generalError);
    else {
      var result = request.idTransform(provisioning);
      provisioning.slug = provisioning.service;
      reply(result);
    }
  });
};

module.exports.config = function(config) {
  return {
    description: "List provisioned services for an entity.",
    auth: config.auth(),
    validate: {
      params: {
        service: Joi.string().required()
      },
      query: {
        type: Joi.string().valid(VALID_TYPES).required(),
        id: Joi.string().required()
      }
    }
  }
};