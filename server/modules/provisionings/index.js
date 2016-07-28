exports.register = function (server, options, next) {

  var controllers = require('./controllers');

  server.route({
    path: '/',
    method: 'GET',
    handler: controllers.listProvisionings.handler,
    config: controllers.listProvisionings.config(server.settings.app),
  });

  server.route({
    path: '/{service}',
    method: 'GET',
    handler: controllers.viewProvisioningStatus.handler,
    config: controllers.viewProvisioningStatus.config(server.settings.app),
  });

  next();
};

exports.register.attributes = {
  pkg: require('./package.json')
};