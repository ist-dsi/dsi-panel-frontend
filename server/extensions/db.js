var mongo = require('mongoskin');

module.exports = function(config) {

  var CONNECTION;

  var connect = function() {
    if(!CONNECTION) {
      console.log("No connection cached found...creating new one");
      CONNECTION = mongo.db(config.mongoDbUrl, { native_parser:true, safe: true });
    }
    return CONNECTION;
  };

  return {
    connect: connect,
    ObjectID: mongo.ObjectID,
    toObjectID: mongo.helper.toObjectID
  };
};
