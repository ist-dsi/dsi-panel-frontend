var app = angular.module('dsiPanelApp', [
  'ngRoute',
  'ui.router',
  'ngSanitize',
  'pascalprecht.translate'
]).config(['$urlRouterProvider', '$stateProvider', '$logProvider', '$translateProvider', function($urlRouterProvider, $stateProvider, $logProvider, $translateProvider) {

  $stateProvider
    .state('dashboard', {
      url: '/',
      templateUrl: 'views/dashboard.html',
      controller: 'ServiceDashboardCtrl'
    })
    .state('service', {
      url: '/services/{slug}',
      templateUrl: 'views/service.html',
      controller: 'ServiceCtrl'
    })
    .state('admin', {
      url: '/admin',
      template: '<ui-view/>',
      abstract: true
    })
    .state('admin.search-users', {
      url: '/search/users',
      templateUrl: 'views/admin/search-users.html',
      controller: 'SearchUsersCtrl'
    })
    .state('admin.view-user', {
      url: '/users/{username}',
      templateUrl: 'views/admin/view-user.html',
      controller: 'ViewUserCtrl'
    });

  $urlRouterProvider.otherwise('/');

  $translateProvider.useStaticFilesLoader({
    prefix: 'i18n/',
    suffix: '.json'
  });
  $translateProvider.preferredLanguage('pt');
  $translateProvider.useSanitizeValueStrategy('sanitize');

}]);


app.controller("ServiceDashboardCtrl", ["$scope", "$http", function($scope, $http) {

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

app.controller("ServiceCtrl", ["$scope", "$http", "$stateParams", function($scope, $http, $stateParams) {

  $scope.service = $stateParams.slug;

}]);

app.controller("SearchUsersCtrl", ["$scope", "$http", "$stateParams", function($scope, $http, $stateParams) {

  $scope.users = [];

  $scope.searchUser = function(query) {
    $http.get("http://localhost:8000/api/v1/search?type=users&q="+query).then(function(response) {
      $scope.users = response.data.hits;
    });
  };


}]);



app.controller("ViewUserCtrl", ["$scope", "$http", "$stateParams", function($scope, $http, $stateParams) {

  $scope.user = {};

  $http.get("http://localhost:8000/api/v1/users/"+$stateParams.username).then(function(response) {
    $scope.user = response.data;
  });


}]);


app.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });
 
                event.preventDefault();
            }
        });
    };
});
