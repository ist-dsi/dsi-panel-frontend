'use strict';

(function(require, module) {

  module.exports = function(app, namespace) {

    var controllerName = namespace.dashboard = 'DashboardCtrl';

    app.controller(controllerName, ['$scope', '$rootScope', '$http', '$stateParams', function($scope, $rootScope, $http, $stateParams) {

      $scope.categories = [
        { key: "network", services: [
          { key: "wifi", labelKey: "wifi" },
          { key: "proxy", labelKey: "proxy" },
          { key: "voip", labelKey: "voip" },
          { key: "vpn", labelKey: "vpn" }
        ]},
        { key: "storage", services: [
          { key: "afs", labelKey: "afs" },
          { key: "databases", labelKey: "databases" },
          { key: "password", labelKey: "password.change" }
        ]},
        { key: "email", services: [
          { key: "email", labelKey: "email.account" }
        ]},
        { key: "printing", services: [
          { key: "print", labelKey: "print" }
        ]}
      ];

    }]);

    return controllerName;

  };
}(require, module));
