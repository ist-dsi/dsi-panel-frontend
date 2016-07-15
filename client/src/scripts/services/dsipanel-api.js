'use strict';

(function(module) {
	
	module.exports = function(app, namespace) {

		var serviceName = namespace.dsiPanelAPI = 'DSIPanelAPI';

		app.factory(serviceName, [
			'store',
			app.R.config,
			app.R.resources.profile,
			function(store, appConfig, ProfileResource) {
			    return {
			    	getProfiles: function(ctx) {
			    		ProfileResource.get({}, function(response) {
			    			ctx.successCallback(response);
			    		}, ctx.errorCallback);
			    	}
			    };
		}]);

	  return serviceName;
	};
}(module));