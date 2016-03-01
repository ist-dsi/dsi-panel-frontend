(function(angular) {angular.module('dsiPanelApp.templates', []).run(['$templateCache', function($templateCache) {   'use strict';

  $templateCache.put('views/admin/search-users.html',
    "<input ng-model=$query placeholder=Pesquisa class=form-control style=\"margin-top: 20px\" ng-enter=\"searchUser($query)\"><br><table class=table ng-if=\"users.length > 0\"><thead><tr><th class=col-lg-1>Photo</th><th>Name</th><th>Username</th></tr></thead><tbody><tr ng-repeat=\"user in users\"><td><img src=\"\" alt=\"\"></td><td ui-sref=\"admin.view-user({ username: user.id })\">{{user.name}}</td><td>{{user.id}}</td></tr></tbody></table>"
  );


  $templateCache.put('views/admin/view-user.html',
    "<h2>{{user.name}}</h2>"
  );


  $templateCache.put('views/dashboard.html',
    "<div class=row><div class=col-lg-12 style=\"margin-top: 20px\"><select ng-model=selectedProfile ng-options=\"profile.name for profile in profiles track by profile.name\"></select></div><div class=col-lg-3 ng-repeat=\"category in categories\" style=\"margin-top: 20px\"><div class=\"panel panel-default\"><div class=panel-heading>{{ category.key | translate }}</div><div class=panel-body><ul><li ng-repeat=\"service in category.services\" ui-sref=\"service({ slug: service.key })\">{{service.labelKey | translate }}</li></ul></div></div></div></div><a ui-sref=admin.search-users>Go to search users</a>"
  );


  $templateCache.put('views/service.html',
    "<h2>View Service {{service}}</h2>"
  );
 }])}(angular));