var async = require('async');
var Joi = require('joi');
var Boom = require('boom');

module.exports.handler = function(request, reply) {
  var group = request.payload;
  var now = new Date().getTime();
  group.creationTimestamp = now;
  var db = request.db.connect();
  db.collection('groups').insertOne(group, function(err, result) {
    if(err) reply(Boom.badImplementation("Could not create group"));
    else reply(request.idTransform(group)).code(201);
  });
};

module.exports.config = function(config) {
  return {
    description: "Creates a new group.",
    validate: {
      payload: {
        name: Joi.string().required(),
        memberships: Joi.array().items(Joi.object({
          username: Joi.string().required(),
          admin: Joi.boolean().default(false)
        })).required()
      }
    }
  }
}