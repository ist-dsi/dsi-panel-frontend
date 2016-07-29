'use strict';

(function(require, module, angular) {

  var directiveName = 'serviceDatabase';

  module.exports = function(app) {

    app.directive(directiveName, [function() {
      return {
        restrict: 'A',
        scope: {
          service: '=serviceDatabase'
        },
      	templateUrl: 'views/services/database.html',
        controller: ['$scope', app.R.config, function($scope, appConfig) {
          $scope.$on('serviceStateToggle', function() {

            if($scope.service.status !== 'active') {
              $scope.showForm = true;
            } else {

            }


            if($scope.service.state === 'inactive') {
              DSIPanelAPI.activateService({
                profile: $rootScope.selectedProfile,
                service: $scope.service.slug,
                successCallback: function() {
                  recheckServiceStateIn($scope.availableServices[$scope.service.slug].recheckTimeInMs);
                },
                errorCallback: console.log
              });
            } else {
              DSIPanelAPI.deactivateService({
                service: $scope.service.slug,
                successCallback: function() {
                  recheckServiceStateIn($scope.availableServices[$scope.service.slug].recheckTimeInMs);
                },
                errorCallback: console.log
              });
            }



          });
        	$scope.message = "OLAAAAAA Database";
        }]
      };
    }]);

    return directiveName;
  }
}(require, module, angular));
