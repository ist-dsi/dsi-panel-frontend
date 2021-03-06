var Glue = require('glue');

var options = {
    relativeTo: __dirname + '/modules'
};

var config = require('./config/config');

Glue.compose(require('./config/manifest')(config), options, function (err, server) {
  if (err) {
    throw err;
  }
  module.exports = server;

  var bootstrap = require('./bootstrap')(config);
  var extensions = require('./extensions')(server, config);

  bootstrap();

  server.start(function(err) {
    console.log("DSI Panel API running on port "+server.info.port);
  });
});