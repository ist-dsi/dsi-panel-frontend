var async = require('async');
var Joi = require('joi');
var Boom = require('boom');

var PAGE_SIZE = 25;

module.exports.handler = function(request, reply) {
  var db = request.db.connect();
  db.collection('groups').find({}).skip((request.query.p-1)*PAGE_SIZE).limit(PAGE_SIZE).toArray(function(err, groups) {
    if(err) reply(Boom.badImplementation("Could not list groups"));
    else reply({
      page: request.query.p,
      pageSize: PAGE_SIZE,
      groups: groups.map(request.idTransform)
    });
  });
};

module.exports.config = function(config) {
  return {
    description: "List existing groups.",
    auth: config.auth(),
    validate: {
      query: {
        p: Joi.number().integer().min(1).default(1)
      }
    }
  }
}