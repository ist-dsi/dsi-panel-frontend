var async = require('async');
var Joi = require('joi');
var Boom = require('boom');
var u2f = require('u2f');
const jwt = require('jsonwebtoken');

module.exports.handler = function(request, reply) {

	var db = request.db.connect();
	db.collection("keys").find({ '_id': request.getPrincipal() }).limit(1).next(function(err, key) {
		console.log(key);
		var checkRes = u2f.checkSignature(
		    key.authRequest,
		    request.payload,
		    key.publicKey
        );
        console.log(checkRes);
        if(checkRes.successful) {
        	var token = jwt.sign({ sub: request.getPrincipal(), scope: ["user", "admin"] }, request.server.settings.app.jwtKey, { expiresIn: "1 hour" });
        	reply(token);
        } else {
        	reply(false);
        }

	});
};

module.exports.config = function(config) {
  return {
    description: "List existing services for a given entity type.",
    auth: config.auth
  }
};