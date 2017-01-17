var context = require('./context.js'),
	db = context.getService('db');

users = {

	getAll: function (req, res) {
		console.log("The user performing the request is: " + req.username);
		res.json({'users': [1,2,3]});
	},

	getUserInfo: function (req, res) {
		var tokenUserId = req.username,
			requestedUserId = req.params.userId;
		
		if (requestedUserId == "me") {
			db.query(`SELECT * FROM users INNER JOIN userdata ON users.userid = userdata.userid WHERE users.username = "${tokenUserId}"`, 
				function(err, result) {
					console.log(err, result);
					res.json(result);
				}
			);
		} else {
			// only return public user information
			db.query(`SELECT * FROM users INNER JOIN userdata ON users.userid = userdata.userid WHERE users.username = "${tokenUserId}"`, 
				function(err, result) {
					res.json(result);
				}
			);
		}
	},

	getUserPastWorkouts: function (req, res) {
		res.json("Work in progress");
	}
}

module.exports = users;