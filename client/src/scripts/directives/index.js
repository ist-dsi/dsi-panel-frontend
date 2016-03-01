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
