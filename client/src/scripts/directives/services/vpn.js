'use strict';

(function(require, module, angular) {

  var directiveName = 'serviceVpn';

  module.exports = function(app) {

    app.directive(directiveName, [function() {
      return {
        restrict: 'C',
      	templateUrl: 'views/services/vpn.html',
        controller: ['$scope', app.R.config, function($scope, appConfig) {
        	$scope.message = "OLAAAAAA VPN";
        }]
      };
    }]);

    return directiveName;
  }
}(require, module, angular));
