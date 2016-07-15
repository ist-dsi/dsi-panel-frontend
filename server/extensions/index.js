module.exports = function(server, config) {

  var db = require('./db')(config);
  var getPrincipal = require('./get-principal');
  var idTransform = require('./id-transform');

  if(server) {
    server.app.config = config;

    server.decorate('request', 'db', db);
    server.decorate('request', 'getPrincipal', getPrincipal);
    server.decorate('request', 'idTransform', idTransform);
  }

  return {
    db: db,
    idTransform: idTransform,
    getPrincipal: getPrincipal
  };

};