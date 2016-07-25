module.exports = function(config) {
  return {
    "server": {
      "app": config
    },
    "connections": [{
      "port": 8000,
      "labels": ["api"],
      "routes": {
        "cors": true
      }
    }],
    "plugins": [
      {"blipp": null },
      {"inert": null},
      {"./auth": config.cas },
      {"./groups": [{
        "routes": {
          "prefix": "/api/v1/groups"
        }
      }]},
      {"./requests": [{
        "routes": {
          "prefix": "/api/v1/requests"
        }
      }]},
      {"./u2f": [{
        "routes": {
          "prefix": "/api/v1/u2f"
        }
      }]},
      {"./profile": [{
        "routes": {
          "prefix": "/api/v1/profile"
        }
      }]},
      {"./search": [{
        "routes": {
          "prefix": "/api/v1/search"
        }
      }]},
      {"./users": [{
        "routes": {
          "prefix": "/api/v1/users"
        }
      }]},
      {"./services": [{
        "routes": {
          "prefix": "/api/v1/services"
        }
      }]},
      {"./actions": [{
        "routes": {
          "prefix": "/api/v1/actions"
        }
      }]}
    ]
  };
};