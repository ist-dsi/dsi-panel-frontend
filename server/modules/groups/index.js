exports.register = function (server, options, next) {

  var controllers = require('./controllers');

  server.route({
    path: '/',
    method: 'POST',
    handler: controllers.createGroup.handler,
    config: controllers.createGroup.config(server.settings.app),
  });

  server.route({
    path: '/',
    method: 'GET',
    handler: controllers.listGroups.handler,
    config: controllers.listGroups.config(server.settings.app),
  });

  server.route({
    path: '/{id}',
    method: 'GET',
    handler: controllers.viewGroup.handler,
    config: controllers.viewGroup.config(server.settings.app),
  });

  next();
};

exports.register.attributes = {
  pkg: require('./package.json')
};