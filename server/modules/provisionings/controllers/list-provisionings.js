var async = require('async');
var Joi = require('joi');
var Boom = require('boom');
var _ = require('underscore');

var VALID_TYPES = ["user", "group"];

var generalError = Boom.badImplementation("Could not list provisionings");

module.exports.handler = function(request, reply) {
  var db = request.db.connect();
  async.waterfall([
    function(callback) {
      if(request.query.type === "user") {
        db.collection('users').find({ '_id': request.query.id })
          .limit(1).next(function(err, user) {
            if(err) callback(generalError);
            else callback(null, user.roles);
          })
      } else {
        callback(null, null);
      }
    },
    function(roles, callback) {
      db.collection('provisionings').find({ target: request.query.id }).toArray(function(err, provisionings) {
        if(err) callback(generalError);
        else callback(null, roles, provisionings.map(request.idTransform));
      });
    },
    function(roles, provisionings, callback) {
      var orClauses = [{ slug: { "$in": provisionings.map(function(provisioning) { return provisioning.service; }) }}];
      if(request.query.type === "user" && roles) {
        orClauses.push({ roles: { "$in": roles }, types: { "$in": ["user"]}});
      } else {
        orClauses.push({ types: { "$in": ["group"]}});
      }
      if(roles) {
        orClauses.push({ roles: { "$in": roles }});
      }
      db.collection('services').find({ "$or": orClauses }).toArray(function(err, services) {
        if(err) callback(generalError);
        else callback(null, provisionings, services.map(request.idTransform));
      });
    }], function(err, provisionings, services) {
      if(err) reply(err);
      else {
        var groupedProvisionings = _.indexBy(provisionings, 'service');
        var groupedServices = _.groupBy(services, function(service) {
          return service.category;
        });
        var result = [];
        Object.keys(groupedServices).forEach(function(category) {
          result.push({
            key: category,
            services: groupedServices[category].map(function(service) {
              var status = 'inactive';
              if(groupedProvisionings[service.id]) {
                status = groupedProvisionings[service.id].status;
              }
              return { slug: service.id, status: status };
            })
          });
        });
        reply(result);
      }
  });
};

module.exports.config = function(config) {
  return {
    description: "List provisioned services for an entity.",
    auth: config.auth(),
    validate: {
      query: {
        type: Joi.string().valid(VALID_TYPES).required(),
        id: Joi.string().required()
      }
    }
  }
};