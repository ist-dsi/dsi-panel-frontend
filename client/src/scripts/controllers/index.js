'use strict';

(function(require, module) {

  module.exports = function(app) {

    var namespace = app.R.controllers = {};

    var dashboard = require('./dashboard')(app, namespace);
    var viewService = require('./view-service')(app, namespace);
    var searchUsers = require('./search-users')(app, namespace);
    var searchGroups = require('./search-groups')(app, namespace);
    var searchRequests = require('./search-requests')(app, namespace);
    var viewUser = require('./view-user')(app, namespace);
    var viewGroup = require('./view-group')(app, namespace);
    var u2fLogin = require('./u2f-login')(app, namespace);
    var u2fRegister = require('./u2f-register')(app, namespace);

    return {
      viewService: viewService,
      dashboard: dashboard,
      searchUsers: searchUsers,
      searchGroups: searchGroups,
      searchRequests: searchRequests,
      viewUser: viewUser,
      viewGroup: viewGroup,
      u2fLogin: u2fLogin,
      u2fRegister: u2fRegister
    };
  }

}(require, module));
