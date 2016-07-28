var Joi = require('joi');
var Boom = require('boom');

var PAGE_SIZE = 25;

module.exports.handler = function(request, reply) {
  var db = request.db.connect();
  db.collection('script-executions').find()
      .sort({ creationTimestamp: -1 })
      .skip((request.query.p-1)*PAGE_SIZE)
      .limit(PAGE_SIZE).toArray(function(err, scriptExecutions) {
    if(err) reply(Boom.badImplementation("Could not list requests"));
    else reply({
      page: request.query.p,
      pageSize: PAGE_SIZE,
      scriptExecutions: scriptExecutions.map(request.idTransform)
    });
  });
};

module.exports.config = function(config) {
  return {
    description: "List script executions.",
    auth: config.auth(),
    validate: {
      query: {
        p: Joi.number().integer().min(1).default(1)
      }
    }
  }
};