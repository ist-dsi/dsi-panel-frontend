module.exports = function(server, config) {

  var db = require('./db')(config);
  var getAuthor = require('./get-author');
  var idTransform = require('./id-transform');

  if(server) {
    server.app.config = config;

    server.decorate('request', 'db', db);
    server.decorate('request', 'getAuthor', getAuthor);
    server.decorate('request', 'idTransform', idTransform);
    server.decorate('request', 'jwtSecret', config.jwtSecret);
  }

  return {
    db: db,
    idTransform: idTransform,
    getAuthor: getAuthor
  };

};