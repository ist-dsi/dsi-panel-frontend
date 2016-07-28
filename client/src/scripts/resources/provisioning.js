'use strict';

(function(module) {

	var resourceName = 'ProvisioningResource';

	module.exports = function(app, namespace) {

		namespace.provisioning = resourceName;
		
		app.factory(resourceName, [
			app.R.config,
			'$resource',
			function(appConfig, $resource) {
				var baseUrl = appConfig.baseUrl+'/provisionings';

				return $resource(baseUrl, {}, {
					'getProvisioningsTree': {
						url: baseUrl,
						method: 'GET',
						params: { id: '@id', type: '@type' },
						isArray: true
					},
					'checkStatus': {
						url: baseUrl+'/:service',
						method: 'GET',
						params: { id: '@id', type: '@type', service: '@service' }
					},
					'activateService': {
						url: baseUrl+'/:service',
						method: 'POST',
						params: { id: '@id', type: '@type', service: '@service' }
					}
				});
		}]);

		return resourceName;
	};

}(module));