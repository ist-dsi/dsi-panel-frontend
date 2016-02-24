var async = require('async');
var Joi = require('joi');
var Boom = require('boom');

var VALID_TYPES = ["user", "group"];

module.exports.handler = function(request, reply) {
  var db = request.db.connect();
  db.collection('services').find({ target: request.query.id }).toArray(function(err, services) {
    if(err) reply(Boom.badImplementation("Could not list services"));
    else reply(services.map(request.idTransform));
  });
};

module.exports.config = {
  description: "List existing services for a given entity type.",
  validate: {
    query: {
      type: Joi.string().valid(VALID_TYPES).required(),
      id: Joi.string().required()
    }
  }
};