'use strict';

(function(require, module) {

  module.exports = function(app, namespace) {

    var controllerName = namespace.viewUser = 'ViewUserCtrl';

    app.controller(controllerName, ['$scope', '$rootScope', '$http', '$stateParams', app.R.config, function($scope, $rootScope, $http, $stateParams, appConfig) {
          
      $scope.user = {};

      $http.get(appConfig.baseUrl+"/users/"+$stateParams.username).then(function(response) {
        $scope.user = response.data;
      });

    }]);

    return controllerName;

  };
}(require, module));
