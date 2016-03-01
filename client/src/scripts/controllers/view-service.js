'use strict';

(function(require, module) {

  module.exports = function(app) {

    var controllerName = 'ViewServiceCtrl';

    app.controller(controllerName, ['$scope', '$rootScope', '$http', '$stateParams', function($scope, $rootScope, $http, $stateParams) {

      $scope.service = $stateParams.slug;      

    }]);

    return controllerName;

  };
}(require, module));
