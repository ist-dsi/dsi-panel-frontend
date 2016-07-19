'use strict';

(function(require, module, angular) {

  var directiveName = 'focusMe';

  module.exports = function(app) {

    app.directive(directiveName, ['$timeout', function($timeout) {
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
