var request = require('request');

module.exports = function(config) {
	return {
		fetchUserInfo: function(username, authorizationHeader, callback) {
			request({
				method: 'GET',
				headers: {
					'Authorization': 'authorizationHeader'
				},
				qs: {
					callbackUrl: config.callbackActionUrl
				},
				uri: config.dsiPanelUsersUrl+username,

			}, function (error, response, body) {
				console.log(error);
				callback();
			});
		},
		sendRequest: function(requestId, authorizationHeader, payload, callback) {
			request({
				method: 'POST',
				uri: config.dsiPanelRequestsUrl+requestId,
				headers: {
					'Authorization': authorizationHeader
				},
				body: {
					payload: payload,
					callbackUrl: config.callbackActionUrl
				}
			}, function(error, response, body) {
				console.log(error);
				callback();
			});
		},
		executeScript: function(scriptId, code, authorizationHeader, callback) {
			request({
				method: 'POST',
				uri: config.dsiPanelScriptsUrl+scriptId,
				headers: {
					'Authorization': authorizationHeader,
				},
				body: {
					callbackUrl: config.callbackActionUrl,
					code: code
				}
			}, function(error, response, body) {
				callback();
			})
		}
	};
};