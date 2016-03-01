'use strict';

(function(require, module, angular) {

  var moduleName = 'dsiPanelApp';

  var app = angular.module(moduleName, [
    'ngRoute',
    'ui.router',
    moduleName+'.templates',
    'pascalprecht.translate',
    'ngTagsInput',
    'ngFileUpload',
    'ngStorage'
  ]);

  app.constant('dsiPanelConfig', {
    baseUrl: "http://localhost:8000/api/v1"
  });

  var controllers = require('./controllers')(app);
  var directives = require('./directives')(app);

  var services = require('./services')(app);

  app.config(['$urlRouterProvider', '$httpProvider', '$stateProvider', '$logProvider', '$translateProvider', '$locationProvider',
    function ($urlRouterProvider, $httpProvider, $stateProvider, $logProvider, $translateProvider, $locationProvider) {

      //$httpProvider.interceptors.push(services.authInterceptor);

      var i18n = require('./i18n');

      $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
      });


      $translateProvider.translations('en', i18n.en);
      $translateProvider.translations('pt', i18n.pt);

      $translateProvider.preferredLanguage('pt');

      var templateResolver = function(template) {
        return ['$templateCache', function($templateCache) {
          return $templateCache.get(template);
        }];
      };

      $stateProvider.state('dashboard', {
        url: '/',
        templateProvider: templateResolver('views/dashboard.html'),
        controller: controllers.serviceDashboard
      })
      .state('service', {
        url: '/services/{slug}',
        templateProvider: templateResolver('views/service.html'),
        controller: controllers.viewService
      })
      .state('admin', {
        url: '/admin',
        template: '<ui-view/>',
        abstract: true
      })
      .state('admin.search-users', {
        url: '/search/users',
        templateProvider: templateResolver('views/admin/search-users.html'),
        controller: controllers.searchUsers
      })
      .state('admin.view-user', {
        url: '/users/{username}',
        templateProvider: templateResolver('views/admin/view-user.html'),
        controller: controllers.viewUser
      });

      $urlRouterProvider.otherwise('/');


  }]).run(['$rootScope', '$state', services.auth, function($rootScope, $state, AuthService) {

    // $rootScope.logout = function() {
    //   AuthService.logout(function() {
    //     $state.transitionTo("login");
    //   });
    // };

    // $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams) {
    //   if (!toState.isPublic && !AuthService.isAuthenticated()) {
    //     // User isn’t authenticated
    //     event.preventDefault();
    //     $state.transitionTo("login");
    //   } else {
    //     if(toState.checkAuthority) {
    //       if(!AuthService.hasAuthority(toState.checkAuthority)) {
    //         event.preventDefault();
    //         $state.transitionTo("not-found");
    //       }
    //     }
    //   }
    // });
  }]);
}(require, module, angular));
