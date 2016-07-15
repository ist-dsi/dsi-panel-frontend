'use strict';

(function(require, module) {

  module.exports = function(app, namespace) {

  var controllerName = namespace.searchUsers = 'SearchUsersCtrl';

    app.controller(controllerName, ['$scope', '$rootScope', '$http', '$state', app.R.config, function($scope, $rootScope, $http, $state, appConfig) {
      
      $scope.users = [];

      $scope.searchUser = function(query) {
        $http.get(appConfig.baseUrl+"/search?type=users&q="+query).then(function(response) {
          $scope.users = response.data.hits;
        });
      };

    }]);

    return controllerName;

  };
}(require, module));
