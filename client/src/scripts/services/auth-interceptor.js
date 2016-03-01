'use strict';

(function(require, module) {

  var serviceName = 'authInjector';

  module.exports = function(app, authService) {

    app.factory(serviceName, ['$q', '$localStorage', '$injector', authService, function($q, $localStorage, $injector, AuthService) {
        var sessionInjector = {
            request: function(config) {
                if($localStorage && $localStorage.principal) {
                  config.headers['Authorization'] = $localStorage.principal.token;
                }
                return config;
            },
            responseError: function(config) {
              if(config.status === 401) {
                AuthService.logout(function() {
                  $injector.get('$state').transitionTo("login");
                });
              }
              return $q.reject(config);
            }
        };
        return sessionInjector;
    }]);

    return serviceName;
  };
}(require, module));
