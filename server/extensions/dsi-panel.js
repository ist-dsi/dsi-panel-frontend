var request = require('request');

module.exports = function(config) {
	return {
		fetchUserInfo: function(username, authorizationHeader, callback) {
			request({
				method: 'GET',
				headers: {
					'Authorization': 'authorizationHeader'
				},
				uri: config.dsiPanelUsersUrl+username
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
				body: payload
			}, function(error, response, body) {
				console.log(error);
				callback();
			});
		}
	};
};