module.exports = function(request, reply, payload) {
	var requestId = payload.request;
	var state = payload.state;
	var info = payload;
	delete info.request;
	delete info.state;

	var db = request.db.connect();
	db.collection("requests").findOneAndUpdate(
		{ "_id": request.db.toObjectID(requestId) },
		{ "$set": {
			"lastUpdate": request.info.received,
			"state": state,
			"info": info }
		},
		function(err, result) {
			if(err) console.info("Error while updating request " + requestId);
			reply();
	});
};