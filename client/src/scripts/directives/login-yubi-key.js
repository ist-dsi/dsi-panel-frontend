'use strict';

(function(require, module, angular) {

  var directiveName = 'loginYubiKey';

  module.exports = function(app) {

    app.directive(directiveName, [function() {
      return {
      	templateUrl: 'views/admin/login-yubi-key.html',
        controller: ['$http', '$rootScope', '$state', '$timeout', 'store', app.R.config, function($http, $rootScope, $state, $timeout, store, appConfig) {
    		$rootScope.yubiStatusMessage = 'Fetching challenge from the server...';
			$http.get(appConfig.baseUrl+"/u2f/challenge").then(function(response) {
        		$rootScope.yubiStatusMessage = 'Please push your YubiKey button...';
	    		u2f.sign(response.data.appId, response.data.challenge, [response.data],
				  function(deviceResponse) {
  	        		$rootScope.yubiStatusMessage = 'Submitting challenge to the server...';
				  	$http.post(appConfig.baseUrl+"/u2f/challenge", deviceResponse).then(function(response) {
				  		if(response.data) {
		  	        		$rootScope.yubiStatusMessage = 'We verified that it really is you '+$rootScope.profiles[0].name;
		  	        		$timeout(function() {
		  	        			delete $rootScope.smallModalTemplate;
							  	store.set("session.admin", response.data);
							  	$state.go($rootScope.u2fTransition.toState, $rootScope.u2fTransition.toParams, { reload: true });
		  	        		}, 2000);
				  		} else {
		  	        		$rootScope.yubiStatusMessage = 'Unknown YubiKey';
		  	        		$timeout(function() {
		  	        			delete $rootScope.smallModalTemplate;
							  	store.remove("session.admin");
		  	        		}, 2000);
				  		}
				  	});
				  }
				);
	    	});
        }]
      };
    }]);

    return directiveName;
  }
}(require, module, angular));
