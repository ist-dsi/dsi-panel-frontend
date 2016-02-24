var config = require('../config/config');

var script = require('./'+process.argv[2])(config);

script(process.argv[3]);