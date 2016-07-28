'use strict';

(function(module) {
	
	module.exports = function(app, namespace) {

		var serviceName = namespace.dsiPanelAPI = 'DSIPanelAPI';

		app.factory(serviceName, [
			'store',
			app.R.config,
			app.R.resources.profile,
			app.R.resources.provisioning,
			function(store, appConfig, ProfileResource, ProvisioningResource) {
			    return {
			    	activateService: function(ctx) {
			    		ProvisioningResource.activateService({
			    			id: ctx.profile.slug,
			    			type: ctx.profile.type,
			    			service: ctx.service
			    		}, function(response) {
			    			ctx.successCallback(response);
			    		}, ctx.errorCallback);
			    	},
			    	getProfiles: function(ctx) {
			    		ProfileResource.get({}, function(response) {
			    			ctx.successCallback(response);
			    		}, ctx.errorCallback);
			    	},
			    	getProvisionings: function(ctx) {
			    		ProvisioningResource.getProvisioningsTree({ id: ctx.profile.slug, type: ctx.profile.type }, function(response) {
			    			ctx.successCallback(response);
			    		}, ctx.errorCallback);
			    	},
			    	checkServiceStatus: function(ctx) {
			    		ProvisioningResource.checkStatus({ id: ctx.profile.slug, type: ctx.profile.type, service: ctx.service }, function(response) {
			    			ctx.successCallback(response);
			    		}, ctx.errorCallback);
			    	}
			    };
		}]);

	  return serviceName;
	};
}(module));