var async = require('async');
var Joi = require('joi');
var Boom = require('boom');
var u2f = require('u2f');

module.exports.handler = function(request, reply) {

	var db = request.db.connect();
	db.collection("keys").find({ '_id': request.getPrincipal() }).limit(1).next(function(err, key) {
		var checkRes = u2f.checkRegistration(key.authRequest, request.payload);
		console.log(checkRes);
		if(checkRes.successful) {
			db.collection("keys").updateOne({ '_id': request.getPrincipal() },
				{ publicKey: checkRes.publicKey,
				  keyHandle: checkRes.keyHandle,
				  certificate: checkRes.certificate 
				}, function(err, result) {
					reply(true);
				});
		} else {
			reply(checkRes.errorMessage);
		}

	});
};

module.exports.config = function(config) {
  return {
    description: "List existing services for a given entity type.",
    auth: config.auth()
  }
};