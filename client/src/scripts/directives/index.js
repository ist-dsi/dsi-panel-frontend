'use strict';

(function(require, module) {

  module.exports = function(app) {

    var ngEnter = require('./ng-enter')(app);
    var focusMe = require('./focus-me')(app);
    var loginYubiKey = require('./login-yubi-key')(app);
    var registerYubiKey = require('./register-yubi-key')(app);
    require('./services')(app);

    return {
      ngEnter: ngEnter,
      focusMe: focusMe,
      loginYubiKey: loginYubiKey,
      registerYubiKey: registerYubiKey
    }

  }

}(require, module));
