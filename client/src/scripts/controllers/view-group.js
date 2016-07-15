'use strict';

(function(require, module) {

  module.exports = function(app, namespace) {

    var controllerName = namespace.viewGroup = 'ViewGroupCtrl';

    app.controller(controllerName, ['$scope', '$rootScope', '$http', '$stateParams', app.R.config, function($scope, $rootScope, $http, $stateParams, appConfig) {
          
      $scope.group = {};

      $http.get(appConfig.baseUrl+"/groups/"+$stateParams.id).then(function(response) {
        $scope.group = response.data;
      });

    }]);

    return controllerName;

  };
}(require, module));
