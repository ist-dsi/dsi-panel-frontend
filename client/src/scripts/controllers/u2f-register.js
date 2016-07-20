'use strict';

(function(require, module) {

  module.exports = function(app, namespace) {

    var controllerName = namespace.u2fRegister = 'U2FRegisterCtrl';

    app.controller(controllerName, ['$scope', '$timeout', '$rootScope', '$http', '$stateParams', app.R.config, function($scope, $timeout, $rootScope, $http, $stateParams, appConfig) {

        $http.get(appConfig.baseUrl+"/u2f/registration").then(function(response) {
            var authRequest = response.data;
            u2f.register(authRequest.appId, [authRequest], [], function(res) {
                $http.post(appConfig.baseUrl+"/u2f/registration", res).then(function(res) {
                    console.log(res);
                });
            })
        });
    	
    }]);

    return controllerName;

  };
}(require, module));
