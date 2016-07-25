var async = require('async');
var Joi = require('joi');
var Boom = require('boom');

var PAGE_SIZE = 25;

var VALID_STATUS = ["pending", "done", "failed"];

module.exports.handler = function(request, reply) {
  var db = request.db.connect();
  db.collection('requests').find({ "status": request.query.status })
      .sort({ creationTimestamp: -1 })
      .skip((request.query.p-1)*PAGE_SIZE)
      .limit(PAGE_SIZE).toArray(function(err, userRequests) {
    if(err) reply(Boom.badImplementation("Could not list requests"));
    else reply({
      page: request.query.p,
      pageSize: PAGE_SIZE,
      requests: userRequests.map(request.idTransform)
    }).code(201);
  });
};

module.exports.config = function(config) {
  return {
    description: "List existing requests.",
    auth: config.auth(),
    validate: {
      query: {
        status: Joi.string().valid(VALID_STATUS).required(),
        p: Joi.number().integer().min(1).default(1)
      }
    }
  }
};