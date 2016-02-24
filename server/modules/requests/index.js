exports.register = function (server, options, next) {

  var controllers = require('./controllers');

  server.route({
    path: '/',
    method: 'POST',
    handler: controllers.createRequest.handler,
    config: controllers.createRequest.config,
  });

  server.route({
    path: '/',
    method: 'GET',
    handler: controllers.listRequests.handler,
    config: controllers.listRequests.config,
  });

  server.route({
    path: '/{id}',
    method: 'GET',
    handler: controllers.viewRequest.handler,
    config: controllers.viewRequest.config,
  });

  server.route({
    path: '/{id}',
    method: 'PUT',
    handler: controllers.updateRequest.handler,
    config: controllers.updateRequest.config,
  });

  next();
};

exports.register.attributes = {
  pkg: require('./package.json')
};