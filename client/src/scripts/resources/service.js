'use strict';

(function(module) {

	var resourceName = 'ServiceResource';

	module.exports = function(app, namespace) {

		namespace.service = resourceName;
		
		app.factory(resourceName, [
			app.R.config,
			'$resource',
			function(appConfig, $resource) {
				var baseUrl = appConfig.baseUrl+'/services';

				return $resource(baseUrl, {}, {
					'get': {
						url: baseUrl,
						method: 'GET',
						isArray: true
					}
				});
		}]);

		return resourceName;
	};

}(module));