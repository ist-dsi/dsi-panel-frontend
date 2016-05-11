(function(angular) {angular.module('dsiPanelApp.templates', []).run(['$templateCache', function($templateCache) {   'use strict';

  $templateCache.put('views/admin/search-users.html',
    "<input ng-model=$query placeholder=Pesquisa class=form-control style=\"margin-top: 20px\" ng-enter=\"searchUser($query)\"><br><table class=table ng-if=\"users.length > 0\"><thead><tr><th class=col-lg-1>Photo</th><th>Name</th><th>Username</th></tr></thead><tbody><tr ng-repeat=\"user in users\"><td><img src=\"\" alt=\"\"></td><td ui-sref=\"admin.view-user({ username: user.id })\">{{user.name}}</td><td>{{user.id}}</td></tr></tbody></table>"
  );


  $templateCache.put('views/admin/view-user.html',
    "<h2>{{user.name}}</h2>"
  );


  $templateCache.put('views/dashboard.html',
    "<div class=row><div class=col-lg-12 style=\"margin-top: 20px\"><h2>Conta Pessoal</h2><p class=text-muted>Painel de Controlo referente aos serviços da DSI.</p></div><div class=col-lg-4 ng-repeat=\"category in categories\" style=\"margin-top: 20px\"><div class=\"panel panel-default\" style=\"height: 280px\"><div class=panel-heading>{{ category.key | translate }}</div><ul class=list-group><li style=\"border: 1px solid #ddd; border-width: 1px 0; padding: 20px\" ng-repeat=\"service in category.services\" ui-sref=\"service({ slug: service.key })\" class=list-group-item>{{service.labelKey | translate }}</li></ul></div></div></div><a ui-sref=admin.search-users>Go to search users</a>"
  );


  $templateCache.put('views/layout.html',
    "<nav class=\"navbar navbar-default\"><div class=container><div class=navbar-header><a class=navbar-brand href=#>DSI PANEL | TÉCNICO LISBOA</a></div><ul class=\"nav navbar-nav navbar-right\"><li class=dropdown><a href=# class=dropdown-toggle data-toggle=dropdown role=button aria-haspopup=true aria-expanded=false>{{selectedProfile.name}} <span class=caret></span></a><ul class=dropdown-menu><li ng-repeat=\"profile in profiles\"><a href=#>{{profile.name}}</a></li><li role=separator class=divider></li><li><a href=#>Logout</a></li></ul></li></ul></div></nav><div class=container ui-view=\"\"></div><footer><div class=container><span>Contactar</span> <span class=pull-right>1997-2016 Instituto Superior Técnico, Universidade de Lisboa</span></div></footer>"
  );


  $templateCache.put('views/service.html',
    "<style>body { background: white; }</style><div class=container><h2>View Service {{service}}</h2></div>"
  );
 }])}(angular));