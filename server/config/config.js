module.exports = {
  "jwtKey": "123456789",
  "mongoDbUrl": "mongodb://localhost:27017/dsi-panel",
  "cas": {
    "casServerUrl": "http://fenix-garuda.tecnico.ulisboa.pt:8080/cas",
    "localAppUrl": "http://localhost:8000",
    "endPointPath": "/cas-st-handler",
    "authenticateEndpointPath": "/cas-authenticate"
  },
  "callbackActionUrl": "https://localhost:8080/api/v1/actions",
  "dsiPanelUsersUrl": "http://localhost:9000/api/v1/users/",
  "dsiPanelRequestsUrl": "http://localhost:9000/api/v1/requests/",
  "auth": function(scopes) {
    var strategy = { "strategy": "cas" };
    if(scopes) {
      strategy.scope = scopes;
    }
    return strategy;
  }
};