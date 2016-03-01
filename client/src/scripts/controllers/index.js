'use strict';

(function(require, module) {

  module.exports = function(app) {

    var serviceDashboard = require('./service-dashboard')(app);
    var viewService = require('./view-service')(app);
    var searchUsers = require('./search-users')(app);
    var viewUser = require('./view-user')(app);

    return {
      viewService: viewService,
      serviceDashboard: serviceDashboard,
      searchUsers: searchUsers,
      viewUser: viewUser
    };
  }

}(require, module));
