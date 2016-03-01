'use strict';

(function(require, module) {

  module.exports = function(app) {

    var authService = require('./auth')(app);
    var authInterceptorService = require('./auth-interceptor')(app, authService);

    return {
      auth: authService,
      authInterceptor: authInterceptorService
    }

  }

}(require, module));
