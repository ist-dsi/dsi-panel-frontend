var modRewrite = require('connect-modrewrite');
var jwt = require('jsonwebtoken');

module.exports = function(base, port, keepalive) {
  var serverPort = port || 9000;
  return {
    options: {
      protocol: 'https',
      base: base,
      port: serverPort,
      hostname: 'localhost',
      keepalive: keepalive || false,
      middleware: function(connect, options, middlewares) {
        var proxySnippet = require('grunt-connect-proxy/lib/utils').proxyRequest;
        return [proxySnippet, modRewrite (['!\\.html|\\.js|\\.svg|\\.css|\\.png|\\.jpg$ /index.html [L]'])].concat(middlewares);
        return middlewares;
      }
    },
    proxies: [
      {
        context: ['/api'],
        host: '0.0.0.0',
        port: 8000
      }
    ]
  };
}
