'use strict';

(function(require, module) {

  module.exports = function(app) {

  	var namespace = app.R.resources = {};

    var profile = require('./profile')(app, namespace);
    var service = require('./service')(app, namespace);
    var provisioning = require('./provisioning')(app, namespace);

    return {
      profile: profile,
      service: service,
	  provisioning: provisioning
    }

  }

}(require, module));
