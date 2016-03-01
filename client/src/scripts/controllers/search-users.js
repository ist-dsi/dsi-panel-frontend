'use strict';

(function(require, module) {

  module.exports = function(app) {

    var controllerName = 'SearchUsersCtrl';

    app.controller(controllerName, ['$scope', '$rootScope', '$http', '$state', 'dsiPanelConfig', function($scope, $rootScope, $http, $state, dsiPanelConfig) {
      
      $scope.users = [];

      $scope.searchUser = function(query) {
        $http.get(dsiPanelConfig.baseUrl+"/search?type=users&q="+query).then(function(response) {
          $scope.users = response.data.hits;
        });
      };

    }]);

    return controllerName;

  };
}(require, module));
