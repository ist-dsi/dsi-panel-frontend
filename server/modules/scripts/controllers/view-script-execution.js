var Joi = require('joi');
var Boom = require('boom');

module.exports.handler = function(request, reply) {
  var db = request.db.connect();
  db.collection('script-executions')
    .find({ "_id": request.db.toObjectID(request.params.id) })
    .limit(1).next(function(err, scriptExecution) {
    if(err) reply(Boom.badImplementation("Could not find script execution"));
    else reply(request.idTransform(scriptExecution));
  });
};

module.exports.config = function(config) {
  return {
    description: "List script executions.",
    auth: config.auth(),
    validate: {
      params: {
        id: Joi.string().required()
      }
    }
  }
};