var async = require('async');
var Joi = require('joi');
var Boom = require('boom');

var handlers = require("./action-handlers");

module.exports.handler = function(request, reply) {
  console.log("Processing action...");
  console.log(request.payload);
  handlers[request.payload.action](request, reply, request.payload.payload);
};

module.exports.config = function(config) {
  return {
    description: "Posts an action to update the server status.",
    auth: config.auth(["external-system"]),
    validate: {
      payload: {
        action: Joi.string().required(),
        payload: Joi.object().required()
      }
    }
  }
}