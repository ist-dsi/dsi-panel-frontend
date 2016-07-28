exports.register = function (server, options, next) {

  var controllers = require('./controllers');

  server.route({
    path: '/',
    method: 'POST',
    handler: controllers.executeRemoteScript.handler,
    config: controllers.executeRemoteScript.config(server.settings.app),
  });

  server.route({
    path: '/',
    method: 'GET',
    handler: controllers.listScriptExecutions.handler,
    config: controllers.listScriptExecutions.config(server.settings.app),
  });

  server.route({
    path: '/{id}',
    method: 'GET',
    handler: controllers.viewScriptExecution.handler,
    config: controllers.viewScriptExecution.config(server.settings.app),
  });

  next();
};

exports.register.attributes = {
  pkg: require('./package.json')
};