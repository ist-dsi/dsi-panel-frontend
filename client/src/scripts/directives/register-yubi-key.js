'use strict';

(function(require, module, angular) {

  var directiveName = 'registerYubiKey';

  module.exports = function(app) {

    app.directive(directiveName, [function() {
      return {
      	templateUrl: 'views/admin/register-yubi-key.html',
        controller: ['$http', app.R.config, function($http, appConfig) {
        	$http.get(appConfig.baseUrl+"/u2f/registration").then(function(response) {
	            var authRequest = response.data;
	            u2f.register(authRequest.appId, [authRequest], [], function(res) {
	                $http.post(appConfig.baseUrl+"/u2f/registration", res).then(function(res) {
	                	callback(res);
	                });
	            })
	        });
        }]
      };
    }]);

    return directiveName;
  }
}(require, module, angular));
