'use strict';

(function(require, module) {

  module.exports = function(app) {

  	var namespace = app.R.resources = {};

    var profile = require('./profile')(app, namespace);

    return {
      profile: profile
    }

  }

}(require, module));
