'use strict';

(function(require, module) {

  module.exports = function(app, namespace) {

    var controllerName = namespace.viewService = 'ViewServiceCtrl';

    app.controller(controllerName, ['$scope', '$rootScope', '$http', '$stateParams', function($scope, $rootScope, $http, $stateParams) {

      $scope.service= { slug: $stateParams.slug };

    }]);

    return controllerName;

  };
}(require, module));
