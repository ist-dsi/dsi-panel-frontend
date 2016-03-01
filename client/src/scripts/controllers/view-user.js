'use strict';

(function(require, module) {

  module.exports = function(app) {

    var controllerName = 'ViewUserCtrl';

    app.controller(controllerName, ['$scope', '$rootScope', '$http', '$stateParams', 'dsiPanelConfig', function($scope, $rootScope, $http, $stateParams, dsiPanelConfig) {
          
      $scope.user = {};

      $http.get(dsiPanelConfig.baseUrl+"/users/"+$stateParams.username).then(function(response) {
        $scope.user = response.data;
      });

    }]);

    return controllerName;

  };
}(require, module));
