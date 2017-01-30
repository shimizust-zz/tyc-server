var context = require('./context.js'),
	db = context.getService('db'),
	begin = require('any-db-transaction'),
	_ = require('underscore'),
	squel = require('squel');

// Object mapping the reponse object property keys to the column names
// of the resultset from database query

// A map of response property names to the corresponding database <table>.<column>
var responsePropertyToDatabaseMapping = {
	"userId": "users.userid",
	"username": "users.username",
	"email": "users.email",
	"createdDate": "users.date_created",
	"firstname": "userdata.firstname",
	"lastname": "userdata.lastname",
	"aboutMe": "userdata.aboutme",
	"gender": "userdata.gender",
	"countryCode": "userdata.countryCode",
	"zipcode": "userdata.zipcode",
	"height": "userdata.height",
	"armspan": "userdata.armspan"
};

var availableUserProperties = {
	"user": {
		"GET": {
			"public": [
				"userId",
				"email",
				"createdDate",
				"firstname",
				"lastname",
				"aboutMe",
				"gender",
				"countryCode"
			],
			"private": [
				"userId",
				"email",
				"createdDate",
				"firstname",
				"lastname",
				"aboutMe",
				"gender",
				"countryCode",
				"zipcode",
				"height",
				"armspan"
			]
		},
		"POST": [
			"username",
			"email",
			"firstname",
			"lastname",
			"aboutMe",
			"gender",
			"countryCode",
			"zipcode",
			"height",
			"armspan"
		]
	}
}


users = {

	getAll: function (req, res) {
		console.log("The user performing the request is: " + req.username);
		res.json({'users': [1,2,3]});
	},

	getUserInfo: function (req, res) {
		var tokenUserId = req.userid,
			requestedUserId = req.params.userId;
		
		db.query("SELECT * FROM users INNER JOIN userdata ON users.userid = userdata.userid WHERE users.userid = ?", [tokenUserId],
			function(err, result) {
				var resultRow = result.rows[0];

				// Determine which set of columns to return. Return less information
				// if a user is requesting another user's information
				if (requestedUserId == tokenUserId) {
					outputType = 'private';
				} else {
					outputType = 'public';
				}

				var responsePropertiesList = availableUserProperties['user']['GET'][outputType],
					outputResponse = {};

				responsePropertiesList.forEach(function(responseProperty) {
					var databaseColumn = responsePropertyToDatabaseMapping[responseProperty];
					outputResponse[responseProperty] = resultRow[databasColumn.split(".")[1]];
				});

				res.json(outputResponse);
			}
		);
	},

	setUserInfo: function (req, res) {
		var tokenUserId = req.userid,
			requestedUserId = parseInt(req.params.userId);

		// Generate the query using the column mapping. The problem is that some columns cannot be modified, but are still
		// returned in the response. The userid, for example, is 
		// for setting data, client should pass the following: 
		if (tokenUserId !== requestedUserId) {
			res.status(400).send('Cannot set data for user that does not match access token');
		} else {
			// Can set the following data during post:
			var body = req.body;
			// For each property that we allow setting, we see if the body has it
			var allowedProperties = availableUserProperties['user']['POST'];

			// object mapping <table>.<column> with the value to set
			// only set allowed properties that are specified in the post call
			var usersTableDataToSet = {},
				userdataTableDataToSet = {};
			allowedProperties.forEach(function(allowedProperty) {
				if (req.body.hasOwnProperty(allowedProperty)) {
					var columnName = responsePropertyToDatabaseMapping[allowedProperty],
						tableName = columnName.split(".")[0],
						propertyValue = req.body[allowedProperty];

					if (tableName == "users") {
						usersTableDataToSet[columnName] = propertyValue;	
					} else if (tableName == "userdata") {
						userdataTableDataToSet[columnName] = propertyValue;
					}
				}
			});

			begin(db, function(err, transaction) {
				// Insert properties into users table
				if (!_.isEmpty(usersTableDataToSet)) {
					var usersQuery = squel.update().table("users").setFields(usersTableDataToSet).where("userid = ?", tokenUserId).toParam();
					transaction.query(usersQuery.text, usersQuery.values, function(err, result) {
						console.log(err);
					});
				}
		
				if (!_.isEmpty(userdataTableDataToSet)) {
					var userdataQuery = squel.update().table("userdata").setFields(userdataTableDataToSet).where("userid = ?", tokenUserId).toParam();
					transaction.query(userdataQuery.text, userdataQuery.values, function(err, result) {
						console.log(err);
					});
				}
				transaction.commit();
			});

			res.json({
				success: true
			});
		}
	},

	getUserPastWorkouts: function (req, res) {
		res.json("Work in progress");
	}
}

module.exports = users;