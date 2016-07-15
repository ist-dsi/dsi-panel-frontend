'use strict';

(function(module) {

	var resourceName = 'ProfileResource';

	module.exports = function(app, namespace) {

		namespace.profile = resourceName;
		
		app.factory(resourceName, [
			app.R.config,
			'$resource',
			function(appConfig, $resource) {
				var baseUrl = appConfig.baseUrl+'/profile';

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