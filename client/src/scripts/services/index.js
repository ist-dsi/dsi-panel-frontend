'use strict';

(function(require, module) {

  module.exports = function(app) {

  	var namespace = app.R.services = {};

    var dsiPanelApi = require('./dsipanel-api')(app, namespace);
    var u2f = require('./u2f')(app, namespace);

    return {
      dsiPanelApi: dsiPanelApi,
      u2f: u2f
    }

  }

}(require, module));
