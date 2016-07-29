'use strict';

(function(require, module, angular) {

  var directiveName = 'serviceAfs';

  module.exports = function(app) {

    app.directive(directiveName, [function() {
      return {
        restrict: 'C',
      	templateUrl: 'views/services/afs.html',
        controller: ['$scope', app.R.config, function($scope, appConfig) {
        	$scope.message = "OLAAAAAA AFS";
        }]
      };
    }]);

    return directiveName;
  }
}(require, module, angular));
