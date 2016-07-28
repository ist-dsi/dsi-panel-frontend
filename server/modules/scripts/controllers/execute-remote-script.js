var async = require('async');
var Joi = require('joi');
var Boom = require('boom');

module.exports.handler = function(request, reply) {
  var db = request.db.connect();  
  var scriptExecution = request.payload;
  scriptExecution.startTimestamp = request.info.received;
  scriptExecution.author = request.getPrincipal();
  async.waterfall([
    function(callback) {
      db.collection('script-executions').insertOne(scriptExecution, function(err, result) {
        if(err) callback(Boom.badImplementation("Could not list script executions."));
        else callback(null, request.idTransform(scriptExecution));
      });
    },
    function(scriptExecution, callback) {
      request.dsiPanel.executeScript(scriptExecution.id, scriptExecution.code, request.headers.authorization, function() {
        callback(null, scriptExecution);
      });
    }], function(err, scriptExecution) {
      if(err) reply(err);
      else reply(scriptExecution).code(201);
  });
};

module.exports.config = function(config) {
  return {
    description: "Execute custom script.",
    auth: config.auth(),
    validate: {
      payload: {
        description: Joi.string().required(),
        code: Joi.string().required()
      }
    }
  }
};