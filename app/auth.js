var context = require('./context.js'),
	path = require('path'),
	fs = require('fs'),
	jwt = require('jsonwebtoken'),
	bcrypt = require('bcryptjs'),
	moment = require('moment'),
	db = context.getService('db'),
	envConfig = context.envConfig;

var jwt_secret = envConfig['jwt_secret'];

var auth = {

	login: function (req, res) {
		var encodedCredentials = req.headers.authorization.split(' ')[1];

		var decodedCredentials = new Buffer(encodedCredentials, 'base64').toString('ascii').split(':'),
			username = decodedCredentials[0],
			password = decodedCredentials[1];
		
		// Verify the username/password
		// Hash password
		// Obtain hashed password from database
		db.query(`SELECT userid, pass_hash FROM users WHERE username='${username}'`, function (error, results) {

			if (error) {
				res.status(401).send('Login failed');
			} else {
				var passHash = results && results.rows && results.rows[0] && results.rows[0]['pass_hash'] || '',
						userid = results && results.rows && results.rows[0] && results.rows[0]['userid'];

				// Replace $2y$ with $2a$ due to differences in php hash method
				passHash = passHash.replace(/^\$2y\$/i, '$2a$');
				bcrypt.compare(password, passHash, function (err, result) {
					if (result) {

						var accessToken = jwt.sign({
							userid: userid
						}, jwt_secret, {
							expiresIn: '7d'
						});

						res.json({
							accessToken: accessToken
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
		// Need to check the validity of access token
		var accessToken = req.headers['authorization'].split(" ")[1];

		try {
			var decoded = jwt.verify(accessToken, jwt_secret);
			console.log("Validated request", decoded);
			console.log(decoded);
      // At this point, the request is validated to the extent that the
      // token is valid and not expired, and req.username is the username
      // of the user initiating the request
      req.userid = decoded.userid;
			next();
		} catch(err) {
			console.log(err);
			res.status(401).send('Invalid or expired token: ' + accessToken);
		}
	}
}

module.exports = auth;