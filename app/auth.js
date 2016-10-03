var context = require('./context.js'),
	uuid = require('uuid'),
	bcrypt = require('bcrypt'),
	sha1 = require('sha1'),
	moment = require('moment'),
	db = context.getService('db');

var auth = {

	login: function (req, res) {
		var encodedCredentials = req.headers.authorization.split(' ')[1];

		var decodedCredentials = new Buffer(encodedCredentials, 'base64').toString('ascii').split(':'),
			username = decodedCredentials[0],
			password = decodedCredentials[1];
		
		// Verify the username/password
		// Hash password
		// Obtain hashed password from database
		db.query(`SELECT pass_hash FROM users WHERE username='${username}'`, function (error, results) {

			if (error) {
				res.status(401).send('Login failed');
			} else {
				var passHash = results && results.rows && results.rows[0] && results.rows[0]['pass_hash'] || '';
				// Replace $2y$ with $2a$ due to differences in php hash method
				passHash = passHash.replace(/^\$2y\$/i, '$2a$');
				bcrypt.compare(password, passHash, function (err, result) {
					if (result) {
						// Successful authentication
						var accessToken = uuid.v1();
						
						var tokenHash = sha1(accessToken),
							expiration = moment().add(7, 'days') // store token for a week
								.format("YYYY-MM-DD HH:mm:ss"); // format to MYSQL datetime format

						// Save access token
						db.query(`INSERT INTO tokens (token_hash, expiration, username) VALUES 
							('${tokenHash}','${expiration}','${username}')`, function (error, results) {
								if (error) {
									res.status(401).send('Token generation failed');
								} else {
									res.json({accessToken: accessToken});
								}
							});
					} else {
						// either invalid username or password
						res.status(401).send('Invalid username or password');
					}
				})
			}
		});
	},

	validateRequest: function (req, res, next) {
		console.log("Validated request");
		next();
	}
}

module.exports = auth;