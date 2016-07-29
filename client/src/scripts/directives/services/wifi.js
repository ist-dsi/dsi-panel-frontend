'use strict';

(function(require, module, angular) {

  var directiveName = 'serviceWifi';

  module.exports = function(app) {

    app.directive(directiveName, [function() {
      return {
        restrict: 'C',
      	templateUrl: 'views/services/wifi.html',
        controller: ['$scope', app.R.config, function($scope, appConfig) {
        	$scope.message = "OLAAAAAA WIFI";
        }]
      };
    }]);

    return directiveName;
  }
}(require, module, angular));
