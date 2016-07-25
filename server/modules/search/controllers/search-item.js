var async = require('async');
var Joi = require('joi');
var Boom = require('boom');

var PAGE_SIZE = 25;

module.exports.handler = function(request, reply) {
  var db = request.db.connect();
  db.collection(request.query.type).find({ "$text": { "$search": request.query.q }}, { score: {$meta: "textScore" }}).sort({score:{$meta:"textScore"}}).skip((request.query.p-1)*PAGE_SIZE).limit(PAGE_SIZE).toArray(function(err, hits) {
    if(err) reply(Boom.badImplementation("Could not search "+request.query.type));
    else reply({
      page: request.query.p,
      pageSize: PAGE_SIZE,
      hits: hits.map(request.idTransform)
    });
  });
};

module.exports.config = function(config) {
  return {
    description: "Search existing groups, users or requests.",
    auth: config.auth(),
    validate: {
      query: {
        q: Joi.string().required(),
        type: Joi.string().valid(["users", "groups", "requests"]).required() 
      }
    }
  }
};