'use strict';

(function(module) {
	
	module.exports = function(app, namespace) {

		var serviceName = namespace.u2f = 'U2FService';

		app.factory(serviceName, [
			'store',
			'$rootScope',
			app.R.config,
			function(store, $rootScope, appConfig) {
			    return {
			    	registerYubiKey: function() {
			    		$rootScope.smallModalTemplate = 'views/admin/register-yubi-key-modal.html';
			    	},
			    	loginYubiKey: function() {
			    		$rootScope.smallModalTemplate = 'views/admin/login-yubi-key-modal.html';
			    	}
			    };
		}]);

	  return serviceName;
	};
}(module));