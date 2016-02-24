exports.register = function (server, options, next) {

  var controllers = require('./controllers');

  server.route({
    path: '/',
    method: 'GET',
    handler: controllers.listServices.handler,
    config: controllers.listServices.config,
  });
  
  next();
};

exports.register.attributes = {
  pkg: require('./package.json')
};