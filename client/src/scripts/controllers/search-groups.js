'use strict';

(function(require, module) {

  module.exports = function(app, namespace) {

  var controllerName = namespace.searchGroups = 'SearchGroupsCtrl';

    app.controller(controllerName, ['$scope', '$rootScope', '$http', '$state', app.R.config, function($scope, $rootScope, $http, $state, appConfig) {
      
      $scope.groups = [];

      $scope.searchGroup = function(query) {
        $http.get(appConfig.baseUrl+"/search?type=groups&q="+query).then(function(response) {
          $scope.groups = response.data.hits;
        });
      };

    }]);

    return controllerName;

  };
}(require, module));
