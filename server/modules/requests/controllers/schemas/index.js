var Joi = require('joi');

var createServiceValidation = function(serviceId) {
  var schema = require('./'+serviceId);
  schema.service = Joi.string().valid(serviceId).required();
  return schema;
};

var services = ['afs', 'email'];

module.exports = services.map(createServiceValidation);