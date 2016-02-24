var async = require('async');
var Joi = require('joi');
var Boom = require('boom');

var VALID_STATES = ["executing", "denied", "done", "failed"];

module.exports.handler = function(request, reply) {
  var db = request.db.connect();
  var requestId = request.db.toObjectID(request.params.id);
  db.collection('requests').findAndModify({ "_id": requestId }, {}, { "$set": { "status": request.payload.status, "response": request.payload.response }}, { new: true }, function(err, result) {
    if(err || !result.value) reply(Boom.badImplementation("Could not update the request."));
    else reply();
  });
};

module.exports.config = {
  description: "Update the status of an existing request.",
  validate: {
    params: {
      id: Joi.string().required()
    },
    payload: {
      status: Joi.string().valid(VALID_STATES).required(),
      response: Joi.object().required()
    }
  }
};