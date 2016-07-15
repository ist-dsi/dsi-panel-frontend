exports.register = function (server, options, next) {

  var controllers = require('./controllers');

  server.route({
    path: '/{id}',
    method: 'GET',
    handler: controllers.viewUser.handler,
    config: controllers.viewUser.config(server.settings.app),
  });
  
  next();
};

exports.register.attributes = {
  pkg: require('./package.json')
};