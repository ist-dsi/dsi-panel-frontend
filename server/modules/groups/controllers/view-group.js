var async = require('async');
var Joi = require('joi');
var Boom = require('boom');

module.exports.handler = function(request, reply) {
  var db = request.db.connect();
  db.collection('groups').findById(request.params.id, function(err, group) {
    if(err) reply(Boom.badImplementation("Could not find group"));
    else reply(request.idTransform(group));
  });
};

module.exports.config = {
  description: "Views an existing group.",
  validate: {
    params: {
      id: Joi.string().required()
    }
  }
};