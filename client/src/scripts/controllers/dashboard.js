'use strict';

(function(require, module) {

  module.exports = function(app, namespace) {

    var controllerName = namespace.dashboard = 'DashboardCtrl';

    app.controller(controllerName, ['$scope', '$rootScope', app.R.services.dsiPanelAPI, function($scope, $rootScope, DSIPanelAPI) {

      $rootScope.$watch('selectedProfile', function(newVal, old) {
        if(newVal) {
          DSIPanelAPI.getProvisionings({
            profile: $rootScope.selectedProfile,
            successCallback: function(categories) {
              $scope.categories = categories;
            },
            errorCallback: console.log
          });
        }
        
      });

    }]);

    return controllerName;

  };
}(require, module));
