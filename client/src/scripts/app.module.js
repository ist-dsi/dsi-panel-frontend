'use strict';

(function(require, module, angular) {

  var moduleName = 'dsiPanelApp';

  var app = angular.module(moduleName, [
    'ngRoute',
    'ui.router',
    moduleName+'.templates',
    'pascalprecht.translate',
    'ngResource',
    'ngTagsInput',
    'ngFileUpload',
    'ngStorage',
    'angularMoment',
    'ngAnimate',
    'angular-storage',
    'ui.bootstrap'
  ]);

  app.R = {};
  var appConfigKey = app.R.config = 'appConfig';
  app.constant(appConfigKey, { baseUrl: window.REMOTE_BASE_URL });

  require('./resources')(app);
  require('./controllers')(app);
  require('./directives')(app);

  require('./services')(app);

  app.config(['$provide', '$urlRouterProvider', '$httpProvider', '$stateProvider', '$logProvider', '$translateProvider', '$locationProvider', '$urlMatcherFactoryProvider',
    function ($provide, $urlRouterProvider, $httpProvider, $stateProvider, $logProvider, $translateProvider, $locationProvider, $urlMatcherFactoryProvider) {

      $locationProvider.hashPrefix('#');
      $locationProvider.html5Mode({
        enabled: true,
        requireBase: true
      });


      var i18n = require('./i18n');

      $translateProvider.translations('en', i18n.en);
      $translateProvider.translations('pt', i18n.pt);

      $translateProvider.preferredLanguage('pt');

      var templateResolver = function(template) {
        return ['$templateCache', function($templateCache) {
          return $templateCache.get(template);
        }];
      };

      $urlMatcherFactoryProvider.strictMode(false)


      $stateProvider.state('layout', {
        abstract: true,
        views: {
          '': {
            templateProvider: templateResolver('views/layout.html')
          },
          'modal@layout':  {}
        }
      })
      .state('dashboard', {
        url: '/',
        parent: 'layout',
        templateProvider: templateResolver('views/dashboard.html'),
        controller: app.R.controllers.dashboard
      })
      .state('service', {
        url: '^/services/{slug}',
        parent: 'dashboard',
        isModal: true,
        views: {
          'modal@layout': {
            templateProvider: templateResolver('views/service.html'),
            controller: app.R.controllers.viewService
          }
        }
      })
      .state('admin', {
        url: '/admin',
        parent: 'layout',
        template: '<ui-view/>',
        abstract: true
      })
      .state('admin.u2f-login', {
        url: '/u2f-login?callback={cb}',
        templateProvider: templateResolver('views/admin/u2f-login.html'),
        controller: app.R.controllers.u2fLogin
      })
      .state('admin.u2f-register', {
        url: '/u2f-register',
        templateProvider: templateResolver('views/admin/u2f-register.html'),
        controller: app.R.controllers.u2fRegister
      })
      .state('admin.search', {
        url: '/search',
        abstract: true,
        templateProvider: templateResolver('views/admin/search-layout.html')
      })
      .state('admin.search.users', {
        url: '/users',
       requiresU2F: true,
       templateProvider: templateResolver('views/admin/search-users.html'),
        controller: app.R.controllers.searchUsers
      })
      .state('admin.view-user', {
        url: '/users/{username}',
        requiresU2F: true,
        templateProvider: templateResolver('views/admin/view-user.html'),
        controller: app.R.controllers.viewUser
      })
      .state('admin.search.groups', {
        url: '/groups',
        requiresU2F: true,
        templateProvider: templateResolver('views/admin/search-groups.html'),
        controller: app.R.controllers.searchGroups
      })
      .state('admin.search.requests', {
        url: '/requests',
        requiresU2F: true,
        templateProvider: templateResolver('views/admin/search-requests.html'),
        controller: app.R.controllers.searchRequests
      })
      .state('admin.view-group', {
        url: '/admin/groups/{id}',
        requiresU2F: true,
        templateProvider: templateResolver('views/admin/view-group.html'),
        controller: app.R.controllers.viewGroup
      });

      $urlRouterProvider.otherwise('/');

      $provide.factory('myHttpInterceptor', ['$q', 'store', function ($q, store) {
        return {
          'request': function(config) {
            var hash = window.location.hash;
            var tokenIndex = hash.indexOf("token=");
            if (tokenIndex >= 0) {
              var auth = {};
              hash.substring(tokenIndex).split("&").map(function (param) {
                  var arg = param.split("=");
                  auth[arg[0]] = decodeURIComponent(arg[1]);
              });
              store.set("session.token", auth.token);
              window.location.hash = "";
              history.replaceState({}, document.title, "/");
            }
            if(store.get("session.token")) {
              config.headers['Authorization'] = store.get("session.admin") ? store.get("session.admin") : store.get("session.token");
            }
            return config;
          },
          // optional method
         'responseError': function(rejection) {
            if(rejection.status === 401) {
              store.set("session.token", undefined);
              window.location = window.CAS_URL+encodeURI("http://localhost:8000/cas-st-handler");
            }
            return $q.reject(rejection);
          },
        }

      }]);
      $httpProvider.interceptors.push('myHttpInterceptor');


  }]).run(['$rootScope', '$state', 'store', app.R.services.dsiPanelAPI, app.R.services.u2f, function($rootScope, $state, store, DSIPanelAPI, U2FService) {
    DSIPanelAPI.getProfiles({
      successCallback: function(profiles) {
        $rootScope.profiles = profiles;
        $rootScope.selectedProfile = $rootScope.profiles[0];
      },
      errorCallback: console.log
    });

    $rootScope.logout = function() {
      store.remove("session.token");
      store.remove("session.admin");
    };

    $rootScope.selectProfile = function(profile) {
      $rootScope.selectedProfile = profile;
    };

    $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams) {
      $rootScope.isModalOpen = toState.isModal;
      if (toState.requiresU2F) {
        if(!store.get("session.admin")) {
          event.preventDefault();
          $rootScope.u2fTransition = {
            toState: toState,
            toParams: toParams
          };
          //var url = $state.href(toState.name, toParams, { absolute: true });
          U2FService.loginYubiKey();
        }
      }
    });
  }]);
}(require, module, angular));
