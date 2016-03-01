var Boom = require('boom');
var Hoek = require('hoek');
var jwt = require('jsonwebtoken');

exports.register = function (plugin, options, next) {

  plugin.auth.scheme('token', function(server, options) {

    Hoek.assert(typeof options.validateFunc === 'function', 'options.validateFunc must be a valid function in token scheme');

    var scheme = {
      authenticate: function(request, reply) {
        var req = request.raw.req;
        var authorization = req.headers.authorization;

        if (!authorization) {
          return reply(Boom.unauthorized(null, 'JWT'));
        }

        options.validateFunc(request, authorization, function(err, isValid, principal) {
          if(!isValid) {
            return reply(Boom.unauthorized('Bad authorization token'));
          } else {
            return reply.continue({ credentials: principal });
          }
        });
      }
    };

    return scheme;
  });

  var validate = function (request, jwtToken, callback) {
    jwt.verify(jwtToken, request.jwtSecret, function(err, decoded) {
      if(err) callback(null, false);
      else callback(null, true, decoded);
    });
  };

  plugin.auth.strategy('jwt', 'token', { validateFunc: validate });

  next();
};

exports.register.attributes = {
  pkg: require('./package.json')
};
