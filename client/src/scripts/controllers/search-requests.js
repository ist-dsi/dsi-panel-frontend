'use strict';

(function(require, module) {

  module.exports = function(app, namespace) {

  var controllerName = namespace.searchGroups = 'SearchRequestsCtrl';

    app.controller(controllerName, ['$scope', '$rootScope', '$http', '$state', app.R.config, function($scope, $rootScope, $http, $state, appConfig) {
      
      $scope.requests = [];

      $scope.searchGroup = function(query) {
        $http.get(appConfig.baseUrl+"/search?type=requests&q="+query).then(function(response) {
          $scope.requests = response.data.hits;
        });
      };

    }]);

    return controllerName;

  };
}(require, module));
