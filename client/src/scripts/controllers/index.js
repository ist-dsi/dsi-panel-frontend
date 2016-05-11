'use strict';

(function(require, module) {

  module.exports = function(app) {

    var dashboard = require('./dashboard')(app);
    var viewService = require('./view-service')(app);
    var searchUsers = require('./search-users')(app);
    var viewUser = require('./view-user')(app);

    return {
      viewService: viewService,
      dashboard: dashboard,
      searchUsers: searchUsers,
      viewUser: viewUser
    };
  }

}(require, module));
