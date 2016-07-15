exports.register = function (server, options, next) {

  var controllers = require('./controllers');

  server.route({
    path: '/registration',
    method: 'GET',
    handler: controllers.getRegistrationChallenge.handler,
    config: controllers.getRegistrationChallenge.config(server.settings.app),
  });

  server.route({
    path: '/registration',
    method: 'POST',
    handler: controllers.submitRegistrationChallenge.handler,
    config: controllers.submitRegistrationChallenge.config(server.settings.app),
  });

  server.route({
    path: '/challenge',
    method: 'GET',
    handler: controllers.getSignChallenge.handler,
    config: controllers.getSignChallenge.config(server.settings.app),
  });

  server.route({
    path: '/challenge',
    method: 'POST',
    handler: controllers.submitSignChallenge.handler,
    config: controllers.submitSignChallenge.config(server.settings.app),
  });
  
  next();
};

exports.register.attributes = {
  pkg: require('./package.json')
};