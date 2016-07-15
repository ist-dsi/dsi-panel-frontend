'use strict';

const jwt = require('jsonwebtoken');
const CAS = require('simple-cas-interface');
const Hoek = require('hoek');
const Joi = require('joi');
const Boom = require('boom');

const optsSchema = Joi.object().keys({
  casServerUrl: Joi.string().uri({sheme: ['http', 'https']}).required(),
  casProtocolVersion: Joi.number().valid([1,2,3]).default(2.0),
  casRequestMethod: Joi.string().valid(['GET', 'POST']).default('GET'),
  casAsGateway: Joi.boolean().default(false),
  localAppUrl: Joi.string().uri({scheme: ['http', 'https']}).required(),
  authenticateEndpointPath: Joi.string().regex(/^\/[\w\W\/]+\/?$/).required(),
  endPointPath: Joi.string().regex(/^\/[\w\W\/]+\/?$/).required(),
  includeHeaders: Joi.array().items(Joi.string()).default(['Authorization']),
  strictSSL: Joi.boolean().default(true),
  saveRawCAS: Joi.boolean().default(false)
});

var casPlugin = function (server, options) {
  Hoek.assert(options, 'Missing CAS auth scheme options');
  const _options = Joi.validate(options, optsSchema);
  Hoek.assert(_options, 'Options object does not pass schema validation');
  console.log('validated options: %j', _options.value);

  const casOptions = {
    serverUrl: _options.value.casServerUrl,
    serviceUrl: _options.value.localAppUrl + _options.value.endPointPath,
    protocolVersion: _options.value.casProtocolVersion,
    method: _options.value.casRequestMethod,
    useGateway: _options.value.casAsGateway,
    strictSSL: _options.value.strictSSL
  };
  const cas = new CAS(casOptions);

  function addHeaders(request, response) {
    for (let h of _options.value.includeHeaders) {
      response.header(h, request.headers[h]);
    }
    return response;
  }

  function gethandler(request, reply) {
    const ticket = request.query.ticket;
    if (!ticket) {
      console.log('No ticket query parameter supplied to CAS handler end point');
      const boom = Boom.badRequest('Missing ticket parameter');
      return addHeaders(request, reply(boom));
    }

    return cas.validateServiceTicket(ticket).then(function (result) {

        var scopes = ["user"];
        const token = jwt.sign({ sub: result.user, scope: scopes }, request.server.settings.app.jwtKey, { expiresIn: "1 hour" });
        return reply().redirect("https://localhost:9000/#token="+token);
      })
      .catch(function caught(error) {
        console.log('Service ticket validation failed:');
        console.log('%j', error);
        return addHeaders(request, reply(Boom.forbidden(error.message)));
      });
  }

  function getAuthentication(request, reply) {
    return addHeaders(
      request,
      reply('cas redirect', null, {})
    ).redirect(cas.loginUrl);
  }

  server.route({
    method: 'GET',
    path: options.endPointPath,
    handler: gethandler,
    config: {
      auth: false,
      cache: {
        privacy: 'private',
        expiresIn: 0
      }
    }
  });

  server.route({
    method: 'GET',
    path: options.authenticateEndpointPath,
    handler: getAuthentication,
    config: {
      auth: false,
      cache: {
        privacy: 'private',
        expiresIn: 0
      }
    }
  });

  const scheme = {};

  scheme.authenticate = function (request, reply) {
    
    const authorization = request.headers.authorization || request.query.jwt;
    if (authorization) {
      console.log('User has Authorization header');
      jwt.verify(authorization, request.server.settings.app.jwtKey, function(err, decoded) {
        console.log(decoded);
        if(err) reply(Boom.unauthorized("You do not have authorization"));
        return reply.continue({credentials: decoded});
      });
    } else {
      console.log('Authentication not found. Redirecting user to: %s', cas.loginUrl);

      return addHeaders(
        request,
        reply(Boom.unauthorized("You do not have authorization"))
      );
    }
  };

  return scheme;
};

exports.register = function (server, options, next) {
  server.auth.scheme('casauth', casPlugin);
  server.auth.strategy('cas', 'casauth', options);

  return next();
};

module.exports.register.attributes = {
    pkg: require(__dirname + '/package.json')
};