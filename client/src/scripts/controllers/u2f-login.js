'use strict';

(function(require, module) {

  module.exports = function(app, namespace) {

    var controllerName = namespace.u2fLogin = 'U2FLoginCtrl';

    app.controller(controllerName, ['$scope', '$rootScope', '$http', '$stateParams', app.R.config, 'store', function($scope, $rootScope, $http, $stateParams, appConfig, store) {
          
    	var target = decodeURI($stateParams.cb);

    	$http.get(appConfig.baseUrl+"/u2f/challenge").then(function(response) {
    		u2f.sign(response.data.appId, response.data.challenge, [response.data],
			  function(deviceResponse) {
			  	$http.post(appConfig.baseUrl+"/u2f/challenge", deviceResponse).then(function(response) {
				  	store.set("session.admin", response.data);
				  	window.location = decodeURI($stateParams.cb);
			  	});
			  }
			);
    	});

    }]);

    return controllerName;

  };
}(require, module));
