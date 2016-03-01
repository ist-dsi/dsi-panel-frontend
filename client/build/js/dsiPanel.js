(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{"./controllers":2,"./directives":8,"./i18n":11,"./services":15}],2:[function(require,module,exports){
'use strict';

(function(require, module) {

  module.exports = function(app) {

    var serviceDashboard = require('./service-dashboard')(app);
    var viewService = require('./view-service')(app);
    var searchUsers = require('./search-users')(app);
    var viewUser = require('./view-user')(app);

    return {
      viewService: viewService,
      serviceDashboard: serviceDashboard,
      searchUsers: searchUsers,
      viewUser: viewUser
    };
  }

}(require, module));

},{"./search-users":3,"./service-dashboard":4,"./view-service":5,"./view-user":6}],3:[function(require,module,exports){
'use strict';

(function(require, module) {

  module.exports = function(app) {

    var controllerName = 'SearchUsersCtrl';

    app.controller(controllerName, ['$scope', '$rootScope', '$http', '$state', 'dsiPanelConfig', function($scope, $rootScope, $http, $state, dsiPanelConfig) {
      
      $scope.users = [];

      $scope.searchUser = function(query) {
        $http.get(dsiPanelConfig.baseUrl+"/search?type=users&q="+query).then(function(response) {
          $scope.users = response.data.hits;
        });
      };

    }]);

    return controllerName;

  };
}(require, module));

},{}],4:[function(require,module,exports){
'use strict';

(function(require, module) {

  module.exports = function(app) {

    var controllerName = 'ServiceDashboardCtrl';

    app.controller(controllerName, ['$scope', '$rootScope', '$http', '$stateParams', function($scope, $rootScope, $http, $stateParams) {

      $scope.profiles = [{
        name: "davidmartinho", type: "user"
      }, {
        name: "marmitas-gang", type: "group"
      }];

      $scope.selectedProfile = $scope.profiles[0];


      $scope.categories = [
        { key: "email", services: [
          { key: "activate-email", labelKey: "activate.email" },
          { key: "request-email-alias", labelKey: "request.email.alias" }
        ]},
        { key: "wifi", services: [
          { key: "activate-wifi", labelKey: "activate.wifi" }
        ]},
        { key: "afs", services: [
          { key: "activate-afs", labelKey: "activate.afs" }
        ]},
        { key: "database", services: [
          { key: "activate-db", labelKey: "activate.db" }
        ]}
      ];

    }]);

    return controllerName;

  };
}(require, module));

},{}],5:[function(require,module,exports){
'use strict';

(function(require, module) {

  module.exports = function(app) {

    var controllerName = 'ViewServiceCtrl';

    app.controller(controllerName, ['$scope', '$rootScope', '$http', '$stateParams', function($scope, $rootScope, $http, $stateParams) {

      $scope.service = $stateParams.slug;      

    }]);

    return controllerName;

  };
}(require, module));

},{}],6:[function(require,module,exports){
'use strict';

(function(require, module) {

  module.exports = function(app) {

    var controllerName = 'ViewUserCtrl';

    app.controller(controllerName, ['$scope', '$rootScope', '$http', '$stateParams', 'dsiPanelConfig', function($scope, $rootScope, $http, $stateParams, dsiPanelConfig) {
          
      $scope.user = {};

      $http.get(dsiPanelConfig.baseUrl+"/users/"+$stateParams.username).then(function(response) {
        $scope.user = response.data;
      });

    }]);

    return controllerName;

  };
}(require, module));

},{}],7:[function(require,module,exports){
'use strict';

(function(require, module, angular) {

  var directiveName = 'focusMe';

  module.exports = function(app) {

    app.directive('focusMe', ['$timeout', function($timeout) {
      return {
        scope: { trigger: '=focusMe' },
        link: function(scope, element) {
          scope.$watch('trigger', function(value) {
            if(value === true) {
              $timeout(function() {
                element[0].focus();
              });
            }
          });
        }
      };
    }]);

    return directiveName;
  }
}(require, module, angular));

},{}],8:[function(require,module,exports){
'use strict';

(function(require, module) {

  module.exports = function(app) {

    var ngEnter = require('./ng-enter')(app);
    var focusMe = require('./focus-me')(app);

    return {
      ngEnter: ngEnter,
      focusMe: focusMe
    }

  }

}(require, module));

},{"./focus-me":7,"./ng-enter":9}],9:[function(require,module,exports){
'use strict';

(function(require, module, angular) {

  var directiveName = 'ngEnter';

  module.exports = function(app) {

    app.directive(directiveName, function() {
      return function(scope, element, attrs) {
        element.bind("keydown keypress", function(event) {
          if(event.which === 13) {
            scope.$apply(function() {
              scope.$eval(attrs.ngEnter);
            });

            event.preventDefault();
          }
        });
      };
    });

    return directiveName;
  }
}(require, module, angular));

},{}],10:[function(require,module,exports){
module.exports = {
  "email": "Email",
  "wifi": "Wifi",
  "afs": "AFS",
  "database": "Database"
}
},{}],11:[function(require,module,exports){
'use strict';

(function(module, require) {

  var en = require('./en');
  var pt = require('./pt');

  module.exports = {
    pt: pt,
    en: en
  };

}(module, require))

},{"./en":10,"./pt":12}],12:[function(require,module,exports){
module.exports = {
  "email": "Email",
  "wifi": "Wifi",
  "afs": "AFS",
  "database": "Base de Dados",
  "activate.email": "Activar Email",
  "request.email.alias": "Pedir Alias de Email",
  "activate.wifi": "Activar WiFi",
  "activate.afs": "Activar AFS",
  "activate.db": "Activar Base de Dados"
}
},{}],13:[function(require,module,exports){
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

},{}],14:[function(require,module,exports){
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

},{}],15:[function(require,module,exports){
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

},{"./auth":14,"./auth-interceptor":13}]},{},[1])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvc2NyaXB0cy9hcHAubW9kdWxlLmpzIiwic3JjL3NjcmlwdHMvY29udHJvbGxlcnMvaW5kZXguanMiLCJzcmMvc2NyaXB0cy9jb250cm9sbGVycy9zZWFyY2gtdXNlcnMuanMiLCJzcmMvc2NyaXB0cy9jb250cm9sbGVycy9zZXJ2aWNlLWRhc2hib2FyZC5qcyIsInNyYy9zY3JpcHRzL2NvbnRyb2xsZXJzL3ZpZXctc2VydmljZS5qcyIsInNyYy9zY3JpcHRzL2NvbnRyb2xsZXJzL3ZpZXctdXNlci5qcyIsInNyYy9zY3JpcHRzL2RpcmVjdGl2ZXMvZm9jdXMtbWUuanMiLCJzcmMvc2NyaXB0cy9kaXJlY3RpdmVzL2luZGV4LmpzIiwic3JjL3NjcmlwdHMvZGlyZWN0aXZlcy9uZy1lbnRlci5qcyIsInNyYy9zY3JpcHRzL2kxOG4vZW4uanMiLCJzcmMvc2NyaXB0cy9pMThuL2luZGV4LmpzIiwic3JjL3NjcmlwdHMvaTE4bi9wdC5qcyIsInNyYy9zY3JpcHRzL3NlcnZpY2VzL2F1dGgtaW50ZXJjZXB0b3IuanMiLCJzcmMvc2NyaXB0cy9zZXJ2aWNlcy9hdXRoLmpzIiwic3JjL3NjcmlwdHMvc2VydmljZXMvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCc7XG5cbihmdW5jdGlvbihyZXF1aXJlLCBtb2R1bGUsIGFuZ3VsYXIpIHtcblxuICB2YXIgbW9kdWxlTmFtZSA9ICdkc2lQYW5lbEFwcCc7XG5cbiAgdmFyIGFwcCA9IGFuZ3VsYXIubW9kdWxlKG1vZHVsZU5hbWUsIFtcbiAgICAnbmdSb3V0ZScsXG4gICAgJ3VpLnJvdXRlcicsXG4gICAgbW9kdWxlTmFtZSsnLnRlbXBsYXRlcycsXG4gICAgJ3Bhc2NhbHByZWNodC50cmFuc2xhdGUnLFxuICAgICduZ1RhZ3NJbnB1dCcsXG4gICAgJ25nRmlsZVVwbG9hZCcsXG4gICAgJ25nU3RvcmFnZSdcbiAgXSk7XG5cbiAgYXBwLmNvbnN0YW50KCdkc2lQYW5lbENvbmZpZycsIHtcbiAgICBiYXNlVXJsOiBcImh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvdjFcIlxuICB9KTtcblxuICB2YXIgY29udHJvbGxlcnMgPSByZXF1aXJlKCcuL2NvbnRyb2xsZXJzJykoYXBwKTtcbiAgdmFyIGRpcmVjdGl2ZXMgPSByZXF1aXJlKCcuL2RpcmVjdGl2ZXMnKShhcHApO1xuXG4gIHZhciBzZXJ2aWNlcyA9IHJlcXVpcmUoJy4vc2VydmljZXMnKShhcHApO1xuXG4gIGFwcC5jb25maWcoWyckdXJsUm91dGVyUHJvdmlkZXInLCAnJGh0dHBQcm92aWRlcicsICckc3RhdGVQcm92aWRlcicsICckbG9nUHJvdmlkZXInLCAnJHRyYW5zbGF0ZVByb3ZpZGVyJywgJyRsb2NhdGlvblByb3ZpZGVyJyxcbiAgICBmdW5jdGlvbiAoJHVybFJvdXRlclByb3ZpZGVyLCAkaHR0cFByb3ZpZGVyLCAkc3RhdGVQcm92aWRlciwgJGxvZ1Byb3ZpZGVyLCAkdHJhbnNsYXRlUHJvdmlkZXIsICRsb2NhdGlvblByb3ZpZGVyKSB7XG5cbiAgICAgIC8vJGh0dHBQcm92aWRlci5pbnRlcmNlcHRvcnMucHVzaChzZXJ2aWNlcy5hdXRoSW50ZXJjZXB0b3IpO1xuXG4gICAgICB2YXIgaTE4biA9IHJlcXVpcmUoJy4vaTE4bicpO1xuXG4gICAgICAkbG9jYXRpb25Qcm92aWRlci5odG1sNU1vZGUoe1xuICAgICAgICBlbmFibGVkOiB0cnVlLFxuICAgICAgICByZXF1aXJlQmFzZTogZmFsc2VcbiAgICAgIH0pO1xuXG5cbiAgICAgICR0cmFuc2xhdGVQcm92aWRlci50cmFuc2xhdGlvbnMoJ2VuJywgaTE4bi5lbik7XG4gICAgICAkdHJhbnNsYXRlUHJvdmlkZXIudHJhbnNsYXRpb25zKCdwdCcsIGkxOG4ucHQpO1xuXG4gICAgICAkdHJhbnNsYXRlUHJvdmlkZXIucHJlZmVycmVkTGFuZ3VhZ2UoJ3B0Jyk7XG5cbiAgICAgIHZhciB0ZW1wbGF0ZVJlc29sdmVyID0gZnVuY3Rpb24odGVtcGxhdGUpIHtcbiAgICAgICAgcmV0dXJuIFsnJHRlbXBsYXRlQ2FjaGUnLCBmdW5jdGlvbigkdGVtcGxhdGVDYWNoZSkge1xuICAgICAgICAgIHJldHVybiAkdGVtcGxhdGVDYWNoZS5nZXQodGVtcGxhdGUpO1xuICAgICAgICB9XTtcbiAgICAgIH07XG5cbiAgICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdkYXNoYm9hcmQnLCB7XG4gICAgICAgIHVybDogJy8nLFxuICAgICAgICB0ZW1wbGF0ZVByb3ZpZGVyOiB0ZW1wbGF0ZVJlc29sdmVyKCd2aWV3cy9kYXNoYm9hcmQuaHRtbCcpLFxuICAgICAgICBjb250cm9sbGVyOiBjb250cm9sbGVycy5zZXJ2aWNlRGFzaGJvYXJkXG4gICAgICB9KVxuICAgICAgLnN0YXRlKCdzZXJ2aWNlJywge1xuICAgICAgICB1cmw6ICcvc2VydmljZXMve3NsdWd9JyxcbiAgICAgICAgdGVtcGxhdGVQcm92aWRlcjogdGVtcGxhdGVSZXNvbHZlcigndmlld3Mvc2VydmljZS5odG1sJyksXG4gICAgICAgIGNvbnRyb2xsZXI6IGNvbnRyb2xsZXJzLnZpZXdTZXJ2aWNlXG4gICAgICB9KVxuICAgICAgLnN0YXRlKCdhZG1pbicsIHtcbiAgICAgICAgdXJsOiAnL2FkbWluJyxcbiAgICAgICAgdGVtcGxhdGU6ICc8dWktdmlldy8+JyxcbiAgICAgICAgYWJzdHJhY3Q6IHRydWVcbiAgICAgIH0pXG4gICAgICAuc3RhdGUoJ2FkbWluLnNlYXJjaC11c2VycycsIHtcbiAgICAgICAgdXJsOiAnL3NlYXJjaC91c2VycycsXG4gICAgICAgIHRlbXBsYXRlUHJvdmlkZXI6IHRlbXBsYXRlUmVzb2x2ZXIoJ3ZpZXdzL2FkbWluL3NlYXJjaC11c2Vycy5odG1sJyksXG4gICAgICAgIGNvbnRyb2xsZXI6IGNvbnRyb2xsZXJzLnNlYXJjaFVzZXJzXG4gICAgICB9KVxuICAgICAgLnN0YXRlKCdhZG1pbi52aWV3LXVzZXInLCB7XG4gICAgICAgIHVybDogJy91c2Vycy97dXNlcm5hbWV9JyxcbiAgICAgICAgdGVtcGxhdGVQcm92aWRlcjogdGVtcGxhdGVSZXNvbHZlcigndmlld3MvYWRtaW4vdmlldy11c2VyLmh0bWwnKSxcbiAgICAgICAgY29udHJvbGxlcjogY29udHJvbGxlcnMudmlld1VzZXJcbiAgICAgIH0pO1xuXG4gICAgICAkdXJsUm91dGVyUHJvdmlkZXIub3RoZXJ3aXNlKCcvJyk7XG5cblxuICB9XSkucnVuKFsnJHJvb3RTY29wZScsICckc3RhdGUnLCBzZXJ2aWNlcy5hdXRoLCBmdW5jdGlvbigkcm9vdFNjb3BlLCAkc3RhdGUsIEF1dGhTZXJ2aWNlKSB7XG5cbiAgICAvLyAkcm9vdFNjb3BlLmxvZ291dCA9IGZ1bmN0aW9uKCkge1xuICAgIC8vICAgQXV0aFNlcnZpY2UubG9nb3V0KGZ1bmN0aW9uKCkge1xuICAgIC8vICAgICAkc3RhdGUudHJhbnNpdGlvblRvKFwibG9naW5cIik7XG4gICAgLy8gICB9KTtcbiAgICAvLyB9O1xuXG4gICAgLy8gJHJvb3RTY29wZS4kb24oXCIkc3RhdGVDaGFuZ2VTdGFydFwiLCBmdW5jdGlvbihldmVudCwgdG9TdGF0ZSwgdG9QYXJhbXMsIGZyb21TdGF0ZSwgZnJvbVBhcmFtcykge1xuICAgIC8vICAgaWYgKCF0b1N0YXRlLmlzUHVibGljICYmICFBdXRoU2VydmljZS5pc0F1dGhlbnRpY2F0ZWQoKSkge1xuICAgIC8vICAgICAvLyBVc2VyIGlzbuKAmXQgYXV0aGVudGljYXRlZFxuICAgIC8vICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIC8vICAgICAkc3RhdGUudHJhbnNpdGlvblRvKFwibG9naW5cIik7XG4gICAgLy8gICB9IGVsc2Uge1xuICAgIC8vICAgICBpZih0b1N0YXRlLmNoZWNrQXV0aG9yaXR5KSB7XG4gICAgLy8gICAgICAgaWYoIUF1dGhTZXJ2aWNlLmhhc0F1dGhvcml0eSh0b1N0YXRlLmNoZWNrQXV0aG9yaXR5KSkge1xuICAgIC8vICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAvLyAgICAgICAgICRzdGF0ZS50cmFuc2l0aW9uVG8oXCJub3QtZm91bmRcIik7XG4gICAgLy8gICAgICAgfVxuICAgIC8vICAgICB9XG4gICAgLy8gICB9XG4gICAgLy8gfSk7XG4gIH1dKTtcbn0ocmVxdWlyZSwgbW9kdWxlLCBhbmd1bGFyKSk7XG4iLCIndXNlIHN0cmljdCc7XG5cbihmdW5jdGlvbihyZXF1aXJlLCBtb2R1bGUpIHtcblxuICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGFwcCkge1xuXG4gICAgdmFyIHNlcnZpY2VEYXNoYm9hcmQgPSByZXF1aXJlKCcuL3NlcnZpY2UtZGFzaGJvYXJkJykoYXBwKTtcbiAgICB2YXIgdmlld1NlcnZpY2UgPSByZXF1aXJlKCcuL3ZpZXctc2VydmljZScpKGFwcCk7XG4gICAgdmFyIHNlYXJjaFVzZXJzID0gcmVxdWlyZSgnLi9zZWFyY2gtdXNlcnMnKShhcHApO1xuICAgIHZhciB2aWV3VXNlciA9IHJlcXVpcmUoJy4vdmlldy11c2VyJykoYXBwKTtcblxuICAgIHJldHVybiB7XG4gICAgICB2aWV3U2VydmljZTogdmlld1NlcnZpY2UsXG4gICAgICBzZXJ2aWNlRGFzaGJvYXJkOiBzZXJ2aWNlRGFzaGJvYXJkLFxuICAgICAgc2VhcmNoVXNlcnM6IHNlYXJjaFVzZXJzLFxuICAgICAgdmlld1VzZXI6IHZpZXdVc2VyXG4gICAgfTtcbiAgfVxuXG59KHJlcXVpcmUsIG1vZHVsZSkpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4oZnVuY3Rpb24ocmVxdWlyZSwgbW9kdWxlKSB7XG5cbiAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihhcHApIHtcblxuICAgIHZhciBjb250cm9sbGVyTmFtZSA9ICdTZWFyY2hVc2Vyc0N0cmwnO1xuXG4gICAgYXBwLmNvbnRyb2xsZXIoY29udHJvbGxlck5hbWUsIFsnJHNjb3BlJywgJyRyb290U2NvcGUnLCAnJGh0dHAnLCAnJHN0YXRlJywgJ2RzaVBhbmVsQ29uZmlnJywgZnVuY3Rpb24oJHNjb3BlLCAkcm9vdFNjb3BlLCAkaHR0cCwgJHN0YXRlLCBkc2lQYW5lbENvbmZpZykge1xuICAgICAgXG4gICAgICAkc2NvcGUudXNlcnMgPSBbXTtcblxuICAgICAgJHNjb3BlLnNlYXJjaFVzZXIgPSBmdW5jdGlvbihxdWVyeSkge1xuICAgICAgICAkaHR0cC5nZXQoZHNpUGFuZWxDb25maWcuYmFzZVVybCtcIi9zZWFyY2g/dHlwZT11c2VycyZxPVwiK3F1ZXJ5KS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgJHNjb3BlLnVzZXJzID0gcmVzcG9uc2UuZGF0YS5oaXRzO1xuICAgICAgICB9KTtcbiAgICAgIH07XG5cbiAgICB9XSk7XG5cbiAgICByZXR1cm4gY29udHJvbGxlck5hbWU7XG5cbiAgfTtcbn0ocmVxdWlyZSwgbW9kdWxlKSk7XG4iLCIndXNlIHN0cmljdCc7XG5cbihmdW5jdGlvbihyZXF1aXJlLCBtb2R1bGUpIHtcblxuICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGFwcCkge1xuXG4gICAgdmFyIGNvbnRyb2xsZXJOYW1lID0gJ1NlcnZpY2VEYXNoYm9hcmRDdHJsJztcblxuICAgIGFwcC5jb250cm9sbGVyKGNvbnRyb2xsZXJOYW1lLCBbJyRzY29wZScsICckcm9vdFNjb3BlJywgJyRodHRwJywgJyRzdGF0ZVBhcmFtcycsIGZ1bmN0aW9uKCRzY29wZSwgJHJvb3RTY29wZSwgJGh0dHAsICRzdGF0ZVBhcmFtcykge1xuXG4gICAgICAkc2NvcGUucHJvZmlsZXMgPSBbe1xuICAgICAgICBuYW1lOiBcImRhdmlkbWFydGluaG9cIiwgdHlwZTogXCJ1c2VyXCJcbiAgICAgIH0sIHtcbiAgICAgICAgbmFtZTogXCJtYXJtaXRhcy1nYW5nXCIsIHR5cGU6IFwiZ3JvdXBcIlxuICAgICAgfV07XG5cbiAgICAgICRzY29wZS5zZWxlY3RlZFByb2ZpbGUgPSAkc2NvcGUucHJvZmlsZXNbMF07XG5cblxuICAgICAgJHNjb3BlLmNhdGVnb3JpZXMgPSBbXG4gICAgICAgIHsga2V5OiBcImVtYWlsXCIsIHNlcnZpY2VzOiBbXG4gICAgICAgICAgeyBrZXk6IFwiYWN0aXZhdGUtZW1haWxcIiwgbGFiZWxLZXk6IFwiYWN0aXZhdGUuZW1haWxcIiB9LFxuICAgICAgICAgIHsga2V5OiBcInJlcXVlc3QtZW1haWwtYWxpYXNcIiwgbGFiZWxLZXk6IFwicmVxdWVzdC5lbWFpbC5hbGlhc1wiIH1cbiAgICAgICAgXX0sXG4gICAgICAgIHsga2V5OiBcIndpZmlcIiwgc2VydmljZXM6IFtcbiAgICAgICAgICB7IGtleTogXCJhY3RpdmF0ZS13aWZpXCIsIGxhYmVsS2V5OiBcImFjdGl2YXRlLndpZmlcIiB9XG4gICAgICAgIF19LFxuICAgICAgICB7IGtleTogXCJhZnNcIiwgc2VydmljZXM6IFtcbiAgICAgICAgICB7IGtleTogXCJhY3RpdmF0ZS1hZnNcIiwgbGFiZWxLZXk6IFwiYWN0aXZhdGUuYWZzXCIgfVxuICAgICAgICBdfSxcbiAgICAgICAgeyBrZXk6IFwiZGF0YWJhc2VcIiwgc2VydmljZXM6IFtcbiAgICAgICAgICB7IGtleTogXCJhY3RpdmF0ZS1kYlwiLCBsYWJlbEtleTogXCJhY3RpdmF0ZS5kYlwiIH1cbiAgICAgICAgXX1cbiAgICAgIF07XG5cbiAgICB9XSk7XG5cbiAgICByZXR1cm4gY29udHJvbGxlck5hbWU7XG5cbiAgfTtcbn0ocmVxdWlyZSwgbW9kdWxlKSk7XG4iLCIndXNlIHN0cmljdCc7XG5cbihmdW5jdGlvbihyZXF1aXJlLCBtb2R1bGUpIHtcblxuICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGFwcCkge1xuXG4gICAgdmFyIGNvbnRyb2xsZXJOYW1lID0gJ1ZpZXdTZXJ2aWNlQ3RybCc7XG5cbiAgICBhcHAuY29udHJvbGxlcihjb250cm9sbGVyTmFtZSwgWyckc2NvcGUnLCAnJHJvb3RTY29wZScsICckaHR0cCcsICckc3RhdGVQYXJhbXMnLCBmdW5jdGlvbigkc2NvcGUsICRyb290U2NvcGUsICRodHRwLCAkc3RhdGVQYXJhbXMpIHtcblxuICAgICAgJHNjb3BlLnNlcnZpY2UgPSAkc3RhdGVQYXJhbXMuc2x1ZzsgICAgICBcblxuICAgIH1dKTtcblxuICAgIHJldHVybiBjb250cm9sbGVyTmFtZTtcblxuICB9O1xufShyZXF1aXJlLCBtb2R1bGUpKTtcbiIsIid1c2Ugc3RyaWN0JztcblxuKGZ1bmN0aW9uKHJlcXVpcmUsIG1vZHVsZSkge1xuXG4gIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oYXBwKSB7XG5cbiAgICB2YXIgY29udHJvbGxlck5hbWUgPSAnVmlld1VzZXJDdHJsJztcblxuICAgIGFwcC5jb250cm9sbGVyKGNvbnRyb2xsZXJOYW1lLCBbJyRzY29wZScsICckcm9vdFNjb3BlJywgJyRodHRwJywgJyRzdGF0ZVBhcmFtcycsICdkc2lQYW5lbENvbmZpZycsIGZ1bmN0aW9uKCRzY29wZSwgJHJvb3RTY29wZSwgJGh0dHAsICRzdGF0ZVBhcmFtcywgZHNpUGFuZWxDb25maWcpIHtcbiAgICAgICAgICBcbiAgICAgICRzY29wZS51c2VyID0ge307XG5cbiAgICAgICRodHRwLmdldChkc2lQYW5lbENvbmZpZy5iYXNlVXJsK1wiL3VzZXJzL1wiKyRzdGF0ZVBhcmFtcy51c2VybmFtZSkudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAkc2NvcGUudXNlciA9IHJlc3BvbnNlLmRhdGE7XG4gICAgICB9KTtcblxuICAgIH1dKTtcblxuICAgIHJldHVybiBjb250cm9sbGVyTmFtZTtcblxuICB9O1xufShyZXF1aXJlLCBtb2R1bGUpKTtcbiIsIid1c2Ugc3RyaWN0JztcblxuKGZ1bmN0aW9uKHJlcXVpcmUsIG1vZHVsZSwgYW5ndWxhcikge1xuXG4gIHZhciBkaXJlY3RpdmVOYW1lID0gJ2ZvY3VzTWUnO1xuXG4gIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oYXBwKSB7XG5cbiAgICBhcHAuZGlyZWN0aXZlKCdmb2N1c01lJywgWyckdGltZW91dCcsIGZ1bmN0aW9uKCR0aW1lb3V0KSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBzY29wZTogeyB0cmlnZ2VyOiAnPWZvY3VzTWUnIH0sXG4gICAgICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50KSB7XG4gICAgICAgICAgc2NvcGUuJHdhdGNoKCd0cmlnZ2VyJywgZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIGlmKHZhbHVlID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGVsZW1lbnRbMF0uZm9jdXMoKTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfV0pO1xuXG4gICAgcmV0dXJuIGRpcmVjdGl2ZU5hbWU7XG4gIH1cbn0ocmVxdWlyZSwgbW9kdWxlLCBhbmd1bGFyKSk7XG4iLCIndXNlIHN0cmljdCc7XG5cbihmdW5jdGlvbihyZXF1aXJlLCBtb2R1bGUpIHtcblxuICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGFwcCkge1xuXG4gICAgdmFyIG5nRW50ZXIgPSByZXF1aXJlKCcuL25nLWVudGVyJykoYXBwKTtcbiAgICB2YXIgZm9jdXNNZSA9IHJlcXVpcmUoJy4vZm9jdXMtbWUnKShhcHApO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIG5nRW50ZXI6IG5nRW50ZXIsXG4gICAgICBmb2N1c01lOiBmb2N1c01lXG4gICAgfVxuXG4gIH1cblxufShyZXF1aXJlLCBtb2R1bGUpKTtcbiIsIid1c2Ugc3RyaWN0JztcblxuKGZ1bmN0aW9uKHJlcXVpcmUsIG1vZHVsZSwgYW5ndWxhcikge1xuXG4gIHZhciBkaXJlY3RpdmVOYW1lID0gJ25nRW50ZXInO1xuXG4gIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oYXBwKSB7XG5cbiAgICBhcHAuZGlyZWN0aXZlKGRpcmVjdGl2ZU5hbWUsIGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xuICAgICAgICBlbGVtZW50LmJpbmQoXCJrZXlkb3duIGtleXByZXNzXCIsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgaWYoZXZlbnQud2hpY2ggPT09IDEzKSB7XG4gICAgICAgICAgICBzY29wZS4kYXBwbHkoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgIHNjb3BlLiRldmFsKGF0dHJzLm5nRW50ZXIpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH07XG4gICAgfSk7XG5cbiAgICByZXR1cm4gZGlyZWN0aXZlTmFtZTtcbiAgfVxufShyZXF1aXJlLCBtb2R1bGUsIGFuZ3VsYXIpKTtcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xuICBcImVtYWlsXCI6IFwiRW1haWxcIixcbiAgXCJ3aWZpXCI6IFwiV2lmaVwiLFxuICBcImFmc1wiOiBcIkFGU1wiLFxuICBcImRhdGFiYXNlXCI6IFwiRGF0YWJhc2VcIlxufSIsIid1c2Ugc3RyaWN0JztcblxuKGZ1bmN0aW9uKG1vZHVsZSwgcmVxdWlyZSkge1xuXG4gIHZhciBlbiA9IHJlcXVpcmUoJy4vZW4nKTtcbiAgdmFyIHB0ID0gcmVxdWlyZSgnLi9wdCcpO1xuXG4gIG1vZHVsZS5leHBvcnRzID0ge1xuICAgIHB0OiBwdCxcbiAgICBlbjogZW5cbiAgfTtcblxufShtb2R1bGUsIHJlcXVpcmUpKVxuIiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gIFwiZW1haWxcIjogXCJFbWFpbFwiLFxuICBcIndpZmlcIjogXCJXaWZpXCIsXG4gIFwiYWZzXCI6IFwiQUZTXCIsXG4gIFwiZGF0YWJhc2VcIjogXCJCYXNlIGRlIERhZG9zXCIsXG4gIFwiYWN0aXZhdGUuZW1haWxcIjogXCJBY3RpdmFyIEVtYWlsXCIsXG4gIFwicmVxdWVzdC5lbWFpbC5hbGlhc1wiOiBcIlBlZGlyIEFsaWFzIGRlIEVtYWlsXCIsXG4gIFwiYWN0aXZhdGUud2lmaVwiOiBcIkFjdGl2YXIgV2lGaVwiLFxuICBcImFjdGl2YXRlLmFmc1wiOiBcIkFjdGl2YXIgQUZTXCIsXG4gIFwiYWN0aXZhdGUuZGJcIjogXCJBY3RpdmFyIEJhc2UgZGUgRGFkb3NcIlxufSIsIid1c2Ugc3RyaWN0JztcblxuKGZ1bmN0aW9uKHJlcXVpcmUsIG1vZHVsZSkge1xuXG4gIHZhciBzZXJ2aWNlTmFtZSA9ICdhdXRoSW5qZWN0b3InO1xuXG4gIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oYXBwLCBhdXRoU2VydmljZSkge1xuXG4gICAgYXBwLmZhY3Rvcnkoc2VydmljZU5hbWUsIFsnJHEnLCAnJGxvY2FsU3RvcmFnZScsICckaW5qZWN0b3InLCBhdXRoU2VydmljZSwgZnVuY3Rpb24oJHEsICRsb2NhbFN0b3JhZ2UsICRpbmplY3RvciwgQXV0aFNlcnZpY2UpIHtcbiAgICAgICAgdmFyIHNlc3Npb25JbmplY3RvciA9IHtcbiAgICAgICAgICAgIHJlcXVlc3Q6IGZ1bmN0aW9uKGNvbmZpZykge1xuICAgICAgICAgICAgICAgIGlmKCRsb2NhbFN0b3JhZ2UgJiYgJGxvY2FsU3RvcmFnZS5wcmluY2lwYWwpIHtcbiAgICAgICAgICAgICAgICAgIGNvbmZpZy5oZWFkZXJzWydBdXRob3JpemF0aW9uJ10gPSAkbG9jYWxTdG9yYWdlLnByaW5jaXBhbC50b2tlbjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbmZpZztcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICByZXNwb25zZUVycm9yOiBmdW5jdGlvbihjb25maWcpIHtcbiAgICAgICAgICAgICAgaWYoY29uZmlnLnN0YXR1cyA9PT0gNDAxKSB7XG4gICAgICAgICAgICAgICAgQXV0aFNlcnZpY2UubG9nb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgJGluamVjdG9yLmdldCgnJHN0YXRlJykudHJhbnNpdGlvblRvKFwibG9naW5cIik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcmV0dXJuICRxLnJlamVjdChjb25maWcpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gc2Vzc2lvbkluamVjdG9yO1xuICAgIH1dKTtcblxuICAgIHJldHVybiBzZXJ2aWNlTmFtZTtcbiAgfTtcbn0ocmVxdWlyZSwgbW9kdWxlKSk7XG4iLCIndXNlIHN0cmljdCc7XG5cbihmdW5jdGlvbihyZXF1aXJlLCBtb2R1bGUpIHtcblxuICB2YXIgc2VydmljZU5hbWUgPSAnQXV0aGVudGljYXRpb25TZXJ2aWNlJztcblxuICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGFwcCkge1xuXG4gICAgYXBwLmZhY3Rvcnkoc2VydmljZU5hbWUsIFsnJHJvb3RTY29wZScsICckbG9jYWxTdG9yYWdlJywgZnVuY3Rpb24oJHJvb3RTY29wZSwgJGxvY2FsU3RvcmFnZSkge1xuXG4gICAgICB2YXIgc2V0UHJpbmNpcGFsID0gZnVuY3Rpb24ocHJpbmNpcGFsKSB7XG4gICAgICAgICRsb2NhbFN0b3JhZ2UucHJpbmNpcGFsID0gcHJpbmNpcGFsO1xuICAgICAgfTtcblxuICAgICAgdmFyIGxvZ291dCA9IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgICAgIGRlbGV0ZSAkbG9jYWxTdG9yYWdlLnByaW5jaXBhbDtcbiAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgIH07XG5cbiAgICAgIHZhciBpc0F1dGhlbnRpY2F0ZWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYoJHJvb3RTY29wZS4kbG9jYWxTdG9yYWdlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAkcm9vdFNjb3BlLiRsb2NhbFN0b3JhZ2UgPSAkbG9jYWxTdG9yYWdlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAkbG9jYWxTdG9yYWdlLnByaW5jaXBhbCAhPT0gdW5kZWZpbmVkO1xuICAgICAgfTtcblxuICAgICAgdmFyIGhhc0F1dGhvcml0eSA9IGZ1bmN0aW9uKHJvbGUpIHtcbiAgICAgICAgcmV0dXJuIGlzQXV0aGVudGljYXRlZCgpICYmICRsb2NhbFN0b3JhZ2UucHJpbmNpcGFsLnVzZXIuc2NvcGUuaW5kZXhPZihyb2xlKSA+IC0xO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4ge1xuICAgICAgICBzZXRQcmluY2lwYWw6IHNldFByaW5jaXBhbCxcbiAgICAgICAgbG9nb3V0OiBsb2dvdXQsXG4gICAgICAgIGhhc0F1dGhvcml0eTogaGFzQXV0aG9yaXR5LFxuICAgICAgICBpc0F1dGhlbnRpY2F0ZWQ6IGlzQXV0aGVudGljYXRlZFxuICAgICAgfTtcblxuICAgIH1dKTtcblxuICAgIHJldHVybiBzZXJ2aWNlTmFtZTtcbiAgfTtcbn0ocmVxdWlyZSwgbW9kdWxlKSk7XG4iLCIndXNlIHN0cmljdCc7XG5cbihmdW5jdGlvbihyZXF1aXJlLCBtb2R1bGUpIHtcblxuICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGFwcCkge1xuXG4gICAgdmFyIGF1dGhTZXJ2aWNlID0gcmVxdWlyZSgnLi9hdXRoJykoYXBwKTtcbiAgICB2YXIgYXV0aEludGVyY2VwdG9yU2VydmljZSA9IHJlcXVpcmUoJy4vYXV0aC1pbnRlcmNlcHRvcicpKGFwcCwgYXV0aFNlcnZpY2UpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGF1dGg6IGF1dGhTZXJ2aWNlLFxuICAgICAgYXV0aEludGVyY2VwdG9yOiBhdXRoSW50ZXJjZXB0b3JTZXJ2aWNlXG4gICAgfVxuXG4gIH1cblxufShyZXF1aXJlLCBtb2R1bGUpKTtcbiJdfQ==
