'use strict';

(function(require, module) {

  module.exports = function(app) {

  	var namespace = app.R.services = {};

    var dsiPanelApi = require('./dsipanel-api')(app, namespace);

    return {
      dsiPanelApi: dsiPanelApi
    }

  }

}(require, module));
