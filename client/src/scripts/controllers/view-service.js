'use strict';

(function(require, module) {

  module.exports = function(app, namespace) {

    var controllerName = namespace.viewService = 'ViewServiceCtrl';

    app.controller(controllerName, ['$scope', '$rootScope', '$timeout', '$stateParams', app.R.services.dsiPanelAPI, function($scope, $rootScope, $timeout, $stateParams, DSIPanelAPI) {

      $scope.availableServices = {
      	"wifi": { recheckTimeInMs: 5000 }
      };

      $scope.service = { slug: $stateParams.slug, state: 'inactive' };

      $rootScope.$watch('selectedProfile', function(newVal, old) {
      	if(newVal) {
    			DSIPanelAPI.checkServiceStatus({
    		      	profile: $rootScope.selectedProfile,
    		      	service: $scope.service.slug,
    		      	successCallback: function(service) {
    		      		$scope.service = service;
    		      	},
    		      	errorCallback: console.log
    			});
      	}
      });

      $scope.toggleServiceState = function(event) {
        event.preventDefault();
        if(!$scope.service.status) {
          $scope.service.status = 'pending';
        }
        $scope.$broadcast('serviceStateToggle');      	
      };

      var recheckServiceStateIn = function(timeoutInMs) {
      	$timeout(function() {
      		DSIPanelAPI.checkServiceStatus({
      			service: $scope.service.slug,
      			successCallback: function(service) {
      				if(service.status === 'pending') {
      					recheckServiceStateIn($scope.availableServices[$scope.service.slug].recheckTimeInMs);
      				} else {
      					$scope.service = service;
      				}
      			},
      			errorCallback: console.log
      		});
      	}, timeoutInMs);
      };

    }]);

    return controllerName;

  };
}(require, module));
