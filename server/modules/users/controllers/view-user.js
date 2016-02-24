var async = require('async');
var Joi = require('joi');
var Boom = require('boom');

module.exports.handler = function(request, reply) {
  var db = request.db.connect();
  db.collection('users').findById(request.params.id, function(err, user) {
    if(err) reply(Boom.badImplementation("Could not find the user"));
    else reply(request.idTransform(user));
  });
};

module.exports.config = {
  description: "Views an existing user.",
  validate: {
    params: {
      id: Joi.string().required()
    }
  }
};