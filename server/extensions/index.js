module.exports = function(server, config) {

  var db = require('./db')(config);
  var idTransform = require('./id-transform');

  if(server) {
    server.app.config = config;

    server.decorate('request', 'db', db);
    server.decorate('request', 'idTransform', idTransform);
  }

  return {
    db: db,
    idTransform: idTransform
  };

};