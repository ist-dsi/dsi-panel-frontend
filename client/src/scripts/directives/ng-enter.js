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
