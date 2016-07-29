'use strict';

(function(require, module, angular) {

  module.exports = function(app) {

    require('./wifi')(app);
    require('./vpn')(app);
    require('./afs')(app);
    require('./database')(app);
    require('./email')(app);


  }
}(require, module, angular));
