'use strict';

(function(require, module, angular) {

  var directiveName = 'serviceEmail';

  module.exports = function(app) {

    app.directive(directiveName, [function() {
      return {
        restrict: 'C',
      	templateUrl: 'views/services/email.html',
        controller: ['$scope', app.R.config, function($scope, appConfig) {
        	$scope.message = "OLAAAAAA email";
        }]
      };
    }]);

    return directiveName;
  }
}(require, module, angular));
