'use strict';

(function(require, module) {

  module.exports = function(app) {

    var controllerName = 'ServiceDashboardCtrl';

    app.controller(controllerName, ['$scope', '$rootScope', '$http', '$stateParams', function($scope, $rootScope, $http, $stateParams) {

      $scope.profiles = [{
        name: "davidmartinho", type: "user"
      }, {
        name: "marmitas-gang", type: "group"
      }];

      $scope.selectedProfile = $scope.profiles[0];


      $scope.categories = [
        { key: "email", services: [
          { key: "activate-email", labelKey: "activate.email" },
          { key: "request-email-alias", labelKey: "request.email.alias" }
        ]},
        { key: "wifi", services: [
          { key: "activate-wifi", labelKey: "activate.wifi" }
        ]},
        { key: "afs", services: [
          { key: "activate-afs", labelKey: "activate.afs" }
        ]},
        { key: "database", services: [
          { key: "activate-db", labelKey: "activate.db" }
        ]}
      ];

    }]);

    return controllerName;

  };
}(require, module));
