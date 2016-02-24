var createSchemasAndIndexes = require('./create-schemas-and-indexes');

module.exports = function(config) {
  return function() {
    createSchemasAndIndexes(config);
  }
};