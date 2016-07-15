exports.register = function (server, options, next) {

  var controllers = require('./controllers');

  server.route({
    path: '/',
    method: 'GET',
    handler: controllers.listProfiles.handler,
    config: controllers.listProfiles.config(server.settings.app),
  });

  next();
};

exports.register.attributes = {
  pkg: require('./package.json')
};