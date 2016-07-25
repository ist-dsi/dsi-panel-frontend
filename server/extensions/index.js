module.exports = function(server, config) {

  var db = require('./db')(config);
  var dsiPanel = require('./dsi-panel')(config);
  var getPrincipal = require('./get-principal');
  var idTransform = require('./id-transform');

  if(server) {
    server.app.config = config;

    server.decorate('request', 'db', db);
    server.decorate('request', 'dsiPanel', dsiPanel);
    server.decorate('request', 'getPrincipal', getPrincipal);
    server.decorate('request', 'idTransform', idTransform);
  }

  return {
    db: db,
    dsiPanel: dsiPanel,
    idTransform: idTransform,
    getPrincipal: getPrincipal
  };

};