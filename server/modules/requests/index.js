exports.register = function (server, options, next) {

  var controllers = require('./controllers');

  server.route({
    path: '/',
    method: 'POST',
    handler: controllers.createRequest.handler,
    config: controllers.createRequest.config(server.settings.app),
  });

  server.route({
    path: '/',
    method: 'GET',
    handler: controllers.listRequests.handler,
    config: controllers.listRequests.config(server.settings.app),
  });

  server.route({
    path: '/{id}',
    method: 'GET',
    handler: controllers.viewRequest.handler,
    config: controllers.viewRequest.config(server.settings.app),
  });

  server.route({
    path: '/{id}',
    method: 'PUT',
    handler: controllers.updateRequest.handler,
    config: controllers.updateRequest.config(server.settings.app),
  });

  next();
};

exports.register.attributes = {
  pkg: require('./package.json')
};