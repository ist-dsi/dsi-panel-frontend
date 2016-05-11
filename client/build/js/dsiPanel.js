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

      $stateProvider.state('layout', {
        abstract: true,
        templateProvider: templateResolver('views/layout.html')
      })
      .state('dashboard', {
        url: '/',
        parent: 'layout',
        templateProvider: templateResolver('views/dashboard.html'),
        controller: controllers.dashboard
      })
      .state('service', {
        url: '/services/{slug}',
        templateProvider: templateResolver('views/service.html'),
        controller: controllers.viewService
      })
      .state('admin', {
        url: '/admin',
        parent: 'layout',
        template: '<ui-view/>',
        abstract: true
      })
      .state('admin.search-users', {
        url: '/search/users',
        parent: 'layout',
        templateProvider: templateResolver('views/admin/search-users.html'),
        controller: controllers.searchUsers
      })
      .state('admin.view-user', {
        url: '/users/{username}',
        parent: 'layout',
        templateProvider: templateResolver('views/admin/view-user.html'),
        controller: controllers.viewUser
      });

      $urlRouterProvider.otherwise('/');


  }]).run(['$rootScope', '$state', services.auth, function($rootScope, $state, AuthService) {



      $rootScope.profiles = [{
        name: "davidmartinho",
        type: "user"
      }, {
        name: "marmitas-gang",
        type: "group"
      }];

      $rootScope.selectedProfile = $rootScope.profiles[0];


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

},{"./controllers":3,"./directives":8,"./i18n":11,"./services":15}],2:[function(require,module,exports){
'use strict';

(function(require, module) {

  module.exports = function(app) {

    var controllerName = 'DashboardCtrl';

    app.controller(controllerName, ['$scope', '$rootScope', '$http', '$stateParams', function($scope, $rootScope, $http, $stateParams) {

      $scope.categories = [
        { key: "network", services: [
          { key: "wifi", labelKey: "wifi" },
          { key: "proxy", labelKey: "proxy" },
          { key: "voip", labelKey: "voip" },
          { key: "vpn", labelKey: "vpn" }
        ]},
        { key: "storage", services: [
          { key: "afs", labelKey: "afs" },
          { key: "databases", labelKey: "databases" },
          { key: "password", labelKey: "Mudança de Password" }
        ]},
        { key: "email", services: [
          { key: "email", labelKey: "email.account" }
        ]},
        { key: "printing", services: [
          { key: "printer", labelKey: "print" }
        ]}
      ];

    }]);

    return controllerName;

  };
}(require, module));

},{}],3:[function(require,module,exports){
'use strict';

(function(require, module) {

  module.exports = function(app) {

    var dashboard = require('./dashboard')(app);
    var viewService = require('./view-service')(app);
    var searchUsers = require('./search-users')(app);
    var viewUser = require('./view-user')(app);

    return {
      viewService: viewService,
      dashboard: dashboard,
      searchUsers: searchUsers,
      viewUser: viewUser
    };
  }

}(require, module));

},{"./dashboard":2,"./search-users":4,"./view-service":5,"./view-user":6}],4:[function(require,module,exports){
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
  "network": "Network",
  "proxy": "Proxy",
  "voip": "VoIP",
  "vpn": "VPN",
  "databases": "Databases",
  "storage": "Storage",
  "database": "Database",
  "printing": "Printing Service",
  "print": "Print",
  "email.account": "Conta de Email"
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
  "network": "Rede",
  "proxy": "Proxy",
  "voip": "VoIP",
  "vpn": "VPN",
  "databases": "Bases de Dados",
  "storage": "Armazenamento",
  "database": "Base de Dados",
  "printing": "Serviço de Impressão",
  "print": "Print",
  "email.account": "Conta de Email"
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvc2NyaXB0cy9hcHAubW9kdWxlLmpzIiwic3JjL3NjcmlwdHMvY29udHJvbGxlcnMvZGFzaGJvYXJkLmpzIiwic3JjL3NjcmlwdHMvY29udHJvbGxlcnMvaW5kZXguanMiLCJzcmMvc2NyaXB0cy9jb250cm9sbGVycy9zZWFyY2gtdXNlcnMuanMiLCJzcmMvc2NyaXB0cy9jb250cm9sbGVycy92aWV3LXNlcnZpY2UuanMiLCJzcmMvc2NyaXB0cy9jb250cm9sbGVycy92aWV3LXVzZXIuanMiLCJzcmMvc2NyaXB0cy9kaXJlY3RpdmVzL2ZvY3VzLW1lLmpzIiwic3JjL3NjcmlwdHMvZGlyZWN0aXZlcy9pbmRleC5qcyIsInNyYy9zY3JpcHRzL2RpcmVjdGl2ZXMvbmctZW50ZXIuanMiLCJzcmMvc2NyaXB0cy9pMThuL2VuLmpzIiwic3JjL3NjcmlwdHMvaTE4bi9pbmRleC5qcyIsInNyYy9zY3JpcHRzL2kxOG4vcHQuanMiLCJzcmMvc2NyaXB0cy9zZXJ2aWNlcy9hdXRoLWludGVyY2VwdG9yLmpzIiwic3JjL3NjcmlwdHMvc2VydmljZXMvYXV0aC5qcyIsInNyYy9zY3JpcHRzL3NlcnZpY2VzL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0JztcblxuKGZ1bmN0aW9uKHJlcXVpcmUsIG1vZHVsZSwgYW5ndWxhcikge1xuXG4gIHZhciBtb2R1bGVOYW1lID0gJ2RzaVBhbmVsQXBwJztcblxuICB2YXIgYXBwID0gYW5ndWxhci5tb2R1bGUobW9kdWxlTmFtZSwgW1xuICAgICduZ1JvdXRlJyxcbiAgICAndWkucm91dGVyJyxcbiAgICBtb2R1bGVOYW1lKycudGVtcGxhdGVzJyxcbiAgICAncGFzY2FscHJlY2h0LnRyYW5zbGF0ZScsXG4gICAgJ25nVGFnc0lucHV0JyxcbiAgICAnbmdGaWxlVXBsb2FkJyxcbiAgICAnbmdTdG9yYWdlJ1xuICBdKTtcblxuICBhcHAuY29uc3RhbnQoJ2RzaVBhbmVsQ29uZmlnJywge1xuICAgIGJhc2VVcmw6IFwiaHR0cDovL2xvY2FsaG9zdDo4MDAwL2FwaS92MVwiXG4gIH0pO1xuXG4gIHZhciBjb250cm9sbGVycyA9IHJlcXVpcmUoJy4vY29udHJvbGxlcnMnKShhcHApO1xuICB2YXIgZGlyZWN0aXZlcyA9IHJlcXVpcmUoJy4vZGlyZWN0aXZlcycpKGFwcCk7XG5cbiAgdmFyIHNlcnZpY2VzID0gcmVxdWlyZSgnLi9zZXJ2aWNlcycpKGFwcCk7XG5cbiAgYXBwLmNvbmZpZyhbJyR1cmxSb3V0ZXJQcm92aWRlcicsICckaHR0cFByb3ZpZGVyJywgJyRzdGF0ZVByb3ZpZGVyJywgJyRsb2dQcm92aWRlcicsICckdHJhbnNsYXRlUHJvdmlkZXInLCAnJGxvY2F0aW9uUHJvdmlkZXInLFxuICAgIGZ1bmN0aW9uICgkdXJsUm91dGVyUHJvdmlkZXIsICRodHRwUHJvdmlkZXIsICRzdGF0ZVByb3ZpZGVyLCAkbG9nUHJvdmlkZXIsICR0cmFuc2xhdGVQcm92aWRlciwgJGxvY2F0aW9uUHJvdmlkZXIpIHtcblxuICAgICAgLy8kaHR0cFByb3ZpZGVyLmludGVyY2VwdG9ycy5wdXNoKHNlcnZpY2VzLmF1dGhJbnRlcmNlcHRvcik7XG5cbiAgICAgIHZhciBpMThuID0gcmVxdWlyZSgnLi9pMThuJyk7XG5cbiAgICAgICRsb2NhdGlvblByb3ZpZGVyLmh0bWw1TW9kZSh7XG4gICAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICAgIHJlcXVpcmVCYXNlOiBmYWxzZVxuICAgICAgfSk7XG5cblxuICAgICAgJHRyYW5zbGF0ZVByb3ZpZGVyLnRyYW5zbGF0aW9ucygnZW4nLCBpMThuLmVuKTtcbiAgICAgICR0cmFuc2xhdGVQcm92aWRlci50cmFuc2xhdGlvbnMoJ3B0JywgaTE4bi5wdCk7XG5cbiAgICAgICR0cmFuc2xhdGVQcm92aWRlci5wcmVmZXJyZWRMYW5ndWFnZSgncHQnKTtcblxuICAgICAgdmFyIHRlbXBsYXRlUmVzb2x2ZXIgPSBmdW5jdGlvbih0ZW1wbGF0ZSkge1xuICAgICAgICByZXR1cm4gWyckdGVtcGxhdGVDYWNoZScsIGZ1bmN0aW9uKCR0ZW1wbGF0ZUNhY2hlKSB7XG4gICAgICAgICAgcmV0dXJuICR0ZW1wbGF0ZUNhY2hlLmdldCh0ZW1wbGF0ZSk7XG4gICAgICAgIH1dO1xuICAgICAgfTtcblxuICAgICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2xheW91dCcsIHtcbiAgICAgICAgYWJzdHJhY3Q6IHRydWUsXG4gICAgICAgIHRlbXBsYXRlUHJvdmlkZXI6IHRlbXBsYXRlUmVzb2x2ZXIoJ3ZpZXdzL2xheW91dC5odG1sJylcbiAgICAgIH0pXG4gICAgICAuc3RhdGUoJ2Rhc2hib2FyZCcsIHtcbiAgICAgICAgdXJsOiAnLycsXG4gICAgICAgIHBhcmVudDogJ2xheW91dCcsXG4gICAgICAgIHRlbXBsYXRlUHJvdmlkZXI6IHRlbXBsYXRlUmVzb2x2ZXIoJ3ZpZXdzL2Rhc2hib2FyZC5odG1sJyksXG4gICAgICAgIGNvbnRyb2xsZXI6IGNvbnRyb2xsZXJzLmRhc2hib2FyZFxuICAgICAgfSlcbiAgICAgIC5zdGF0ZSgnc2VydmljZScsIHtcbiAgICAgICAgdXJsOiAnL3NlcnZpY2VzL3tzbHVnfScsXG4gICAgICAgIHRlbXBsYXRlUHJvdmlkZXI6IHRlbXBsYXRlUmVzb2x2ZXIoJ3ZpZXdzL3NlcnZpY2UuaHRtbCcpLFxuICAgICAgICBjb250cm9sbGVyOiBjb250cm9sbGVycy52aWV3U2VydmljZVxuICAgICAgfSlcbiAgICAgIC5zdGF0ZSgnYWRtaW4nLCB7XG4gICAgICAgIHVybDogJy9hZG1pbicsXG4gICAgICAgIHBhcmVudDogJ2xheW91dCcsXG4gICAgICAgIHRlbXBsYXRlOiAnPHVpLXZpZXcvPicsXG4gICAgICAgIGFic3RyYWN0OiB0cnVlXG4gICAgICB9KVxuICAgICAgLnN0YXRlKCdhZG1pbi5zZWFyY2gtdXNlcnMnLCB7XG4gICAgICAgIHVybDogJy9zZWFyY2gvdXNlcnMnLFxuICAgICAgICBwYXJlbnQ6ICdsYXlvdXQnLFxuICAgICAgICB0ZW1wbGF0ZVByb3ZpZGVyOiB0ZW1wbGF0ZVJlc29sdmVyKCd2aWV3cy9hZG1pbi9zZWFyY2gtdXNlcnMuaHRtbCcpLFxuICAgICAgICBjb250cm9sbGVyOiBjb250cm9sbGVycy5zZWFyY2hVc2Vyc1xuICAgICAgfSlcbiAgICAgIC5zdGF0ZSgnYWRtaW4udmlldy11c2VyJywge1xuICAgICAgICB1cmw6ICcvdXNlcnMve3VzZXJuYW1lfScsXG4gICAgICAgIHBhcmVudDogJ2xheW91dCcsXG4gICAgICAgIHRlbXBsYXRlUHJvdmlkZXI6IHRlbXBsYXRlUmVzb2x2ZXIoJ3ZpZXdzL2FkbWluL3ZpZXctdXNlci5odG1sJyksXG4gICAgICAgIGNvbnRyb2xsZXI6IGNvbnRyb2xsZXJzLnZpZXdVc2VyXG4gICAgICB9KTtcblxuICAgICAgJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSgnLycpO1xuXG5cbiAgfV0pLnJ1bihbJyRyb290U2NvcGUnLCAnJHN0YXRlJywgc2VydmljZXMuYXV0aCwgZnVuY3Rpb24oJHJvb3RTY29wZSwgJHN0YXRlLCBBdXRoU2VydmljZSkge1xuXG5cblxuICAgICAgJHJvb3RTY29wZS5wcm9maWxlcyA9IFt7XG4gICAgICAgIG5hbWU6IFwiZGF2aWRtYXJ0aW5ob1wiLFxuICAgICAgICB0eXBlOiBcInVzZXJcIlxuICAgICAgfSwge1xuICAgICAgICBuYW1lOiBcIm1hcm1pdGFzLWdhbmdcIixcbiAgICAgICAgdHlwZTogXCJncm91cFwiXG4gICAgICB9XTtcblxuICAgICAgJHJvb3RTY29wZS5zZWxlY3RlZFByb2ZpbGUgPSAkcm9vdFNjb3BlLnByb2ZpbGVzWzBdO1xuXG5cbiAgICAvLyAkcm9vdFNjb3BlLmxvZ291dCA9IGZ1bmN0aW9uKCkge1xuICAgIC8vICAgQXV0aFNlcnZpY2UubG9nb3V0KGZ1bmN0aW9uKCkge1xuICAgIC8vICAgICAkc3RhdGUudHJhbnNpdGlvblRvKFwibG9naW5cIik7XG4gICAgLy8gICB9KTtcbiAgICAvLyB9O1xuXG4gICAgLy8gJHJvb3RTY29wZS4kb24oXCIkc3RhdGVDaGFuZ2VTdGFydFwiLCBmdW5jdGlvbihldmVudCwgdG9TdGF0ZSwgdG9QYXJhbXMsIGZyb21TdGF0ZSwgZnJvbVBhcmFtcykge1xuICAgIC8vICAgaWYgKCF0b1N0YXRlLmlzUHVibGljICYmICFBdXRoU2VydmljZS5pc0F1dGhlbnRpY2F0ZWQoKSkge1xuICAgIC8vICAgICAvLyBVc2VyIGlzbuKAmXQgYXV0aGVudGljYXRlZFxuICAgIC8vICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIC8vICAgICAkc3RhdGUudHJhbnNpdGlvblRvKFwibG9naW5cIik7XG4gICAgLy8gICB9IGVsc2Uge1xuICAgIC8vICAgICBpZih0b1N0YXRlLmNoZWNrQXV0aG9yaXR5KSB7XG4gICAgLy8gICAgICAgaWYoIUF1dGhTZXJ2aWNlLmhhc0F1dGhvcml0eSh0b1N0YXRlLmNoZWNrQXV0aG9yaXR5KSkge1xuICAgIC8vICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAvLyAgICAgICAgICRzdGF0ZS50cmFuc2l0aW9uVG8oXCJub3QtZm91bmRcIik7XG4gICAgLy8gICAgICAgfVxuICAgIC8vICAgICB9XG4gICAgLy8gICB9XG4gICAgLy8gfSk7XG4gIH1dKTtcbn0ocmVxdWlyZSwgbW9kdWxlLCBhbmd1bGFyKSk7XG4iLCIndXNlIHN0cmljdCc7XG5cbihmdW5jdGlvbihyZXF1aXJlLCBtb2R1bGUpIHtcblxuICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGFwcCkge1xuXG4gICAgdmFyIGNvbnRyb2xsZXJOYW1lID0gJ0Rhc2hib2FyZEN0cmwnO1xuXG4gICAgYXBwLmNvbnRyb2xsZXIoY29udHJvbGxlck5hbWUsIFsnJHNjb3BlJywgJyRyb290U2NvcGUnLCAnJGh0dHAnLCAnJHN0YXRlUGFyYW1zJywgZnVuY3Rpb24oJHNjb3BlLCAkcm9vdFNjb3BlLCAkaHR0cCwgJHN0YXRlUGFyYW1zKSB7XG5cbiAgICAgICRzY29wZS5jYXRlZ29yaWVzID0gW1xuICAgICAgICB7IGtleTogXCJuZXR3b3JrXCIsIHNlcnZpY2VzOiBbXG4gICAgICAgICAgeyBrZXk6IFwid2lmaVwiLCBsYWJlbEtleTogXCJ3aWZpXCIgfSxcbiAgICAgICAgICB7IGtleTogXCJwcm94eVwiLCBsYWJlbEtleTogXCJwcm94eVwiIH0sXG4gICAgICAgICAgeyBrZXk6IFwidm9pcFwiLCBsYWJlbEtleTogXCJ2b2lwXCIgfSxcbiAgICAgICAgICB7IGtleTogXCJ2cG5cIiwgbGFiZWxLZXk6IFwidnBuXCIgfVxuICAgICAgICBdfSxcbiAgICAgICAgeyBrZXk6IFwic3RvcmFnZVwiLCBzZXJ2aWNlczogW1xuICAgICAgICAgIHsga2V5OiBcImFmc1wiLCBsYWJlbEtleTogXCJhZnNcIiB9LFxuICAgICAgICAgIHsga2V5OiBcImRhdGFiYXNlc1wiLCBsYWJlbEtleTogXCJkYXRhYmFzZXNcIiB9LFxuICAgICAgICAgIHsga2V5OiBcInBhc3N3b3JkXCIsIGxhYmVsS2V5OiBcIk11ZGFuw6dhIGRlIFBhc3N3b3JkXCIgfVxuICAgICAgICBdfSxcbiAgICAgICAgeyBrZXk6IFwiZW1haWxcIiwgc2VydmljZXM6IFtcbiAgICAgICAgICB7IGtleTogXCJlbWFpbFwiLCBsYWJlbEtleTogXCJlbWFpbC5hY2NvdW50XCIgfVxuICAgICAgICBdfSxcbiAgICAgICAgeyBrZXk6IFwicHJpbnRpbmdcIiwgc2VydmljZXM6IFtcbiAgICAgICAgICB7IGtleTogXCJwcmludGVyXCIsIGxhYmVsS2V5OiBcInByaW50XCIgfVxuICAgICAgICBdfVxuICAgICAgXTtcblxuICAgIH1dKTtcblxuICAgIHJldHVybiBjb250cm9sbGVyTmFtZTtcblxuICB9O1xufShyZXF1aXJlLCBtb2R1bGUpKTtcbiIsIid1c2Ugc3RyaWN0JztcblxuKGZ1bmN0aW9uKHJlcXVpcmUsIG1vZHVsZSkge1xuXG4gIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oYXBwKSB7XG5cbiAgICB2YXIgZGFzaGJvYXJkID0gcmVxdWlyZSgnLi9kYXNoYm9hcmQnKShhcHApO1xuICAgIHZhciB2aWV3U2VydmljZSA9IHJlcXVpcmUoJy4vdmlldy1zZXJ2aWNlJykoYXBwKTtcbiAgICB2YXIgc2VhcmNoVXNlcnMgPSByZXF1aXJlKCcuL3NlYXJjaC11c2VycycpKGFwcCk7XG4gICAgdmFyIHZpZXdVc2VyID0gcmVxdWlyZSgnLi92aWV3LXVzZXInKShhcHApO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIHZpZXdTZXJ2aWNlOiB2aWV3U2VydmljZSxcbiAgICAgIGRhc2hib2FyZDogZGFzaGJvYXJkLFxuICAgICAgc2VhcmNoVXNlcnM6IHNlYXJjaFVzZXJzLFxuICAgICAgdmlld1VzZXI6IHZpZXdVc2VyXG4gICAgfTtcbiAgfVxuXG59KHJlcXVpcmUsIG1vZHVsZSkpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4oZnVuY3Rpb24ocmVxdWlyZSwgbW9kdWxlKSB7XG5cbiAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihhcHApIHtcblxuICAgIHZhciBjb250cm9sbGVyTmFtZSA9ICdTZWFyY2hVc2Vyc0N0cmwnO1xuXG4gICAgYXBwLmNvbnRyb2xsZXIoY29udHJvbGxlck5hbWUsIFsnJHNjb3BlJywgJyRyb290U2NvcGUnLCAnJGh0dHAnLCAnJHN0YXRlJywgJ2RzaVBhbmVsQ29uZmlnJywgZnVuY3Rpb24oJHNjb3BlLCAkcm9vdFNjb3BlLCAkaHR0cCwgJHN0YXRlLCBkc2lQYW5lbENvbmZpZykge1xuICAgICAgXG4gICAgICAkc2NvcGUudXNlcnMgPSBbXTtcblxuICAgICAgJHNjb3BlLnNlYXJjaFVzZXIgPSBmdW5jdGlvbihxdWVyeSkge1xuICAgICAgICAkaHR0cC5nZXQoZHNpUGFuZWxDb25maWcuYmFzZVVybCtcIi9zZWFyY2g/dHlwZT11c2VycyZxPVwiK3F1ZXJ5KS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgJHNjb3BlLnVzZXJzID0gcmVzcG9uc2UuZGF0YS5oaXRzO1xuICAgICAgICB9KTtcbiAgICAgIH07XG5cbiAgICB9XSk7XG5cbiAgICByZXR1cm4gY29udHJvbGxlck5hbWU7XG5cbiAgfTtcbn0ocmVxdWlyZSwgbW9kdWxlKSk7XG4iLCIndXNlIHN0cmljdCc7XG5cbihmdW5jdGlvbihyZXF1aXJlLCBtb2R1bGUpIHtcblxuICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGFwcCkge1xuXG4gICAgdmFyIGNvbnRyb2xsZXJOYW1lID0gJ1ZpZXdTZXJ2aWNlQ3RybCc7XG5cbiAgICBhcHAuY29udHJvbGxlcihjb250cm9sbGVyTmFtZSwgWyckc2NvcGUnLCAnJHJvb3RTY29wZScsICckaHR0cCcsICckc3RhdGVQYXJhbXMnLCBmdW5jdGlvbigkc2NvcGUsICRyb290U2NvcGUsICRodHRwLCAkc3RhdGVQYXJhbXMpIHtcblxuICAgICAgJHNjb3BlLnNlcnZpY2UgPSAkc3RhdGVQYXJhbXMuc2x1ZzsgICAgICBcblxuICAgIH1dKTtcblxuICAgIHJldHVybiBjb250cm9sbGVyTmFtZTtcblxuICB9O1xufShyZXF1aXJlLCBtb2R1bGUpKTtcbiIsIid1c2Ugc3RyaWN0JztcblxuKGZ1bmN0aW9uKHJlcXVpcmUsIG1vZHVsZSkge1xuXG4gIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oYXBwKSB7XG5cbiAgICB2YXIgY29udHJvbGxlck5hbWUgPSAnVmlld1VzZXJDdHJsJztcblxuICAgIGFwcC5jb250cm9sbGVyKGNvbnRyb2xsZXJOYW1lLCBbJyRzY29wZScsICckcm9vdFNjb3BlJywgJyRodHRwJywgJyRzdGF0ZVBhcmFtcycsICdkc2lQYW5lbENvbmZpZycsIGZ1bmN0aW9uKCRzY29wZSwgJHJvb3RTY29wZSwgJGh0dHAsICRzdGF0ZVBhcmFtcywgZHNpUGFuZWxDb25maWcpIHtcbiAgICAgICAgICBcbiAgICAgICRzY29wZS51c2VyID0ge307XG5cbiAgICAgICRodHRwLmdldChkc2lQYW5lbENvbmZpZy5iYXNlVXJsK1wiL3VzZXJzL1wiKyRzdGF0ZVBhcmFtcy51c2VybmFtZSkudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAkc2NvcGUudXNlciA9IHJlc3BvbnNlLmRhdGE7XG4gICAgICB9KTtcblxuICAgIH1dKTtcblxuICAgIHJldHVybiBjb250cm9sbGVyTmFtZTtcblxuICB9O1xufShyZXF1aXJlLCBtb2R1bGUpKTtcbiIsIid1c2Ugc3RyaWN0JztcblxuKGZ1bmN0aW9uKHJlcXVpcmUsIG1vZHVsZSwgYW5ndWxhcikge1xuXG4gIHZhciBkaXJlY3RpdmVOYW1lID0gJ2ZvY3VzTWUnO1xuXG4gIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oYXBwKSB7XG5cbiAgICBhcHAuZGlyZWN0aXZlKCdmb2N1c01lJywgWyckdGltZW91dCcsIGZ1bmN0aW9uKCR0aW1lb3V0KSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBzY29wZTogeyB0cmlnZ2VyOiAnPWZvY3VzTWUnIH0sXG4gICAgICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50KSB7XG4gICAgICAgICAgc2NvcGUuJHdhdGNoKCd0cmlnZ2VyJywgZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIGlmKHZhbHVlID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGVsZW1lbnRbMF0uZm9jdXMoKTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfV0pO1xuXG4gICAgcmV0dXJuIGRpcmVjdGl2ZU5hbWU7XG4gIH1cbn0ocmVxdWlyZSwgbW9kdWxlLCBhbmd1bGFyKSk7XG4iLCIndXNlIHN0cmljdCc7XG5cbihmdW5jdGlvbihyZXF1aXJlLCBtb2R1bGUpIHtcblxuICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGFwcCkge1xuXG4gICAgdmFyIG5nRW50ZXIgPSByZXF1aXJlKCcuL25nLWVudGVyJykoYXBwKTtcbiAgICB2YXIgZm9jdXNNZSA9IHJlcXVpcmUoJy4vZm9jdXMtbWUnKShhcHApO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIG5nRW50ZXI6IG5nRW50ZXIsXG4gICAgICBmb2N1c01lOiBmb2N1c01lXG4gICAgfVxuXG4gIH1cblxufShyZXF1aXJlLCBtb2R1bGUpKTtcbiIsIid1c2Ugc3RyaWN0JztcblxuKGZ1bmN0aW9uKHJlcXVpcmUsIG1vZHVsZSwgYW5ndWxhcikge1xuXG4gIHZhciBkaXJlY3RpdmVOYW1lID0gJ25nRW50ZXInO1xuXG4gIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oYXBwKSB7XG5cbiAgICBhcHAuZGlyZWN0aXZlKGRpcmVjdGl2ZU5hbWUsIGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xuICAgICAgICBlbGVtZW50LmJpbmQoXCJrZXlkb3duIGtleXByZXNzXCIsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgaWYoZXZlbnQud2hpY2ggPT09IDEzKSB7XG4gICAgICAgICAgICBzY29wZS4kYXBwbHkoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgIHNjb3BlLiRldmFsKGF0dHJzLm5nRW50ZXIpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH07XG4gICAgfSk7XG5cbiAgICByZXR1cm4gZGlyZWN0aXZlTmFtZTtcbiAgfVxufShyZXF1aXJlLCBtb2R1bGUsIGFuZ3VsYXIpKTtcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xuICBcImVtYWlsXCI6IFwiRW1haWxcIixcbiAgXCJ3aWZpXCI6IFwiV2lmaVwiLFxuICBcImFmc1wiOiBcIkFGU1wiLFxuICBcIm5ldHdvcmtcIjogXCJOZXR3b3JrXCIsXG4gIFwicHJveHlcIjogXCJQcm94eVwiLFxuICBcInZvaXBcIjogXCJWb0lQXCIsXG4gIFwidnBuXCI6IFwiVlBOXCIsXG4gIFwiZGF0YWJhc2VzXCI6IFwiRGF0YWJhc2VzXCIsXG4gIFwic3RvcmFnZVwiOiBcIlN0b3JhZ2VcIixcbiAgXCJkYXRhYmFzZVwiOiBcIkRhdGFiYXNlXCIsXG4gIFwicHJpbnRpbmdcIjogXCJQcmludGluZyBTZXJ2aWNlXCIsXG4gIFwicHJpbnRcIjogXCJQcmludFwiLFxuICBcImVtYWlsLmFjY291bnRcIjogXCJDb250YSBkZSBFbWFpbFwiXG59IiwiJ3VzZSBzdHJpY3QnO1xuXG4oZnVuY3Rpb24obW9kdWxlLCByZXF1aXJlKSB7XG5cbiAgdmFyIGVuID0gcmVxdWlyZSgnLi9lbicpO1xuICB2YXIgcHQgPSByZXF1aXJlKCcuL3B0Jyk7XG5cbiAgbW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgcHQ6IHB0LFxuICAgIGVuOiBlblxuICB9O1xuXG59KG1vZHVsZSwgcmVxdWlyZSkpXG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgXCJlbWFpbFwiOiBcIkVtYWlsXCIsXG4gIFwid2lmaVwiOiBcIldpZmlcIixcbiAgXCJhZnNcIjogXCJBRlNcIixcbiAgXCJuZXR3b3JrXCI6IFwiUmVkZVwiLFxuICBcInByb3h5XCI6IFwiUHJveHlcIixcbiAgXCJ2b2lwXCI6IFwiVm9JUFwiLFxuICBcInZwblwiOiBcIlZQTlwiLFxuICBcImRhdGFiYXNlc1wiOiBcIkJhc2VzIGRlIERhZG9zXCIsXG4gIFwic3RvcmFnZVwiOiBcIkFybWF6ZW5hbWVudG9cIixcbiAgXCJkYXRhYmFzZVwiOiBcIkJhc2UgZGUgRGFkb3NcIixcbiAgXCJwcmludGluZ1wiOiBcIlNlcnZpw6dvIGRlIEltcHJlc3PDo29cIixcbiAgXCJwcmludFwiOiBcIlByaW50XCIsXG4gIFwiZW1haWwuYWNjb3VudFwiOiBcIkNvbnRhIGRlIEVtYWlsXCJcbn0iLCIndXNlIHN0cmljdCc7XG5cbihmdW5jdGlvbihyZXF1aXJlLCBtb2R1bGUpIHtcblxuICB2YXIgc2VydmljZU5hbWUgPSAnYXV0aEluamVjdG9yJztcblxuICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGFwcCwgYXV0aFNlcnZpY2UpIHtcblxuICAgIGFwcC5mYWN0b3J5KHNlcnZpY2VOYW1lLCBbJyRxJywgJyRsb2NhbFN0b3JhZ2UnLCAnJGluamVjdG9yJywgYXV0aFNlcnZpY2UsIGZ1bmN0aW9uKCRxLCAkbG9jYWxTdG9yYWdlLCAkaW5qZWN0b3IsIEF1dGhTZXJ2aWNlKSB7XG4gICAgICAgIHZhciBzZXNzaW9uSW5qZWN0b3IgPSB7XG4gICAgICAgICAgICByZXF1ZXN0OiBmdW5jdGlvbihjb25maWcpIHtcbiAgICAgICAgICAgICAgICBpZigkbG9jYWxTdG9yYWdlICYmICRsb2NhbFN0b3JhZ2UucHJpbmNpcGFsKSB7XG4gICAgICAgICAgICAgICAgICBjb25maWcuaGVhZGVyc1snQXV0aG9yaXphdGlvbiddID0gJGxvY2FsU3RvcmFnZS5wcmluY2lwYWwudG9rZW47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBjb25maWc7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcmVzcG9uc2VFcnJvcjogZnVuY3Rpb24oY29uZmlnKSB7XG4gICAgICAgICAgICAgIGlmKGNvbmZpZy5zdGF0dXMgPT09IDQwMSkge1xuICAgICAgICAgICAgICAgIEF1dGhTZXJ2aWNlLmxvZ291dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICRpbmplY3Rvci5nZXQoJyRzdGF0ZScpLnRyYW5zaXRpb25UbyhcImxvZ2luXCIpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHJldHVybiAkcS5yZWplY3QoY29uZmlnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIHNlc3Npb25JbmplY3RvcjtcbiAgICB9XSk7XG5cbiAgICByZXR1cm4gc2VydmljZU5hbWU7XG4gIH07XG59KHJlcXVpcmUsIG1vZHVsZSkpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4oZnVuY3Rpb24ocmVxdWlyZSwgbW9kdWxlKSB7XG5cbiAgdmFyIHNlcnZpY2VOYW1lID0gJ0F1dGhlbnRpY2F0aW9uU2VydmljZSc7XG5cbiAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihhcHApIHtcblxuICAgIGFwcC5mYWN0b3J5KHNlcnZpY2VOYW1lLCBbJyRyb290U2NvcGUnLCAnJGxvY2FsU3RvcmFnZScsIGZ1bmN0aW9uKCRyb290U2NvcGUsICRsb2NhbFN0b3JhZ2UpIHtcblxuICAgICAgdmFyIHNldFByaW5jaXBhbCA9IGZ1bmN0aW9uKHByaW5jaXBhbCkge1xuICAgICAgICAkbG9jYWxTdG9yYWdlLnByaW5jaXBhbCA9IHByaW5jaXBhbDtcbiAgICAgIH07XG5cbiAgICAgIHZhciBsb2dvdXQgPSBmdW5jdGlvbihjYWxsYmFjaykge1xuICAgICAgICBkZWxldGUgJGxvY2FsU3RvcmFnZS5wcmluY2lwYWw7XG4gICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICB9O1xuXG4gICAgICB2YXIgaXNBdXRoZW50aWNhdGVkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmKCRyb290U2NvcGUuJGxvY2FsU3RvcmFnZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgJHJvb3RTY29wZS4kbG9jYWxTdG9yYWdlID0gJGxvY2FsU3RvcmFnZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gJGxvY2FsU3RvcmFnZS5wcmluY2lwYWwgIT09IHVuZGVmaW5lZDtcbiAgICAgIH07XG5cbiAgICAgIHZhciBoYXNBdXRob3JpdHkgPSBmdW5jdGlvbihyb2xlKSB7XG4gICAgICAgIHJldHVybiBpc0F1dGhlbnRpY2F0ZWQoKSAmJiAkbG9jYWxTdG9yYWdlLnByaW5jaXBhbC51c2VyLnNjb3BlLmluZGV4T2Yocm9sZSkgPiAtMTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgc2V0UHJpbmNpcGFsOiBzZXRQcmluY2lwYWwsXG4gICAgICAgIGxvZ291dDogbG9nb3V0LFxuICAgICAgICBoYXNBdXRob3JpdHk6IGhhc0F1dGhvcml0eSxcbiAgICAgICAgaXNBdXRoZW50aWNhdGVkOiBpc0F1dGhlbnRpY2F0ZWRcbiAgICAgIH07XG5cbiAgICB9XSk7XG5cbiAgICByZXR1cm4gc2VydmljZU5hbWU7XG4gIH07XG59KHJlcXVpcmUsIG1vZHVsZSkpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4oZnVuY3Rpb24ocmVxdWlyZSwgbW9kdWxlKSB7XG5cbiAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihhcHApIHtcblxuICAgIHZhciBhdXRoU2VydmljZSA9IHJlcXVpcmUoJy4vYXV0aCcpKGFwcCk7XG4gICAgdmFyIGF1dGhJbnRlcmNlcHRvclNlcnZpY2UgPSByZXF1aXJlKCcuL2F1dGgtaW50ZXJjZXB0b3InKShhcHAsIGF1dGhTZXJ2aWNlKTtcblxuICAgIHJldHVybiB7XG4gICAgICBhdXRoOiBhdXRoU2VydmljZSxcbiAgICAgIGF1dGhJbnRlcmNlcHRvcjogYXV0aEludGVyY2VwdG9yU2VydmljZVxuICAgIH1cblxuICB9XG5cbn0ocmVxdWlyZSwgbW9kdWxlKSk7XG4iXX0=
