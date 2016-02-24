var Joi = require('joi');

module.exports = {
  quota: Joi.number().integer().min(10).required()
};