'use strict';

(function(require, module) {

  var serviceName = 'AuthenticationService';

  module.exports = function(app) {

    app.factory(serviceName, ['$rootScope', '$localStorage', function($rootScope, $localStorage) {

      var setPrincipal = function(principal) {
        $localStorage.principal = principal;
      };

      var logout = function(callback) {
        delete $localStorage.principal;
        callback();
      };

      var isAuthenticated = function() {
        if($rootScope.$localStorage === undefined) {
          $rootScope.$localStorage = $localStorage;
        }
        return $localStorage.principal !== undefined;
      };

      var hasAuthority = function(role) {
        return isAuthenticated() && $localStorage.principal.user.scope.indexOf(role) > -1;
      }

      return {
        setPrincipal: setPrincipal,
        logout: logout,
        hasAuthority: hasAuthority,
        isAuthenticated: isAuthenticated
      };

    }]);

    return serviceName;
  };
}(require, module));
