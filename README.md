# Track Your Climb Backend Service

## Setup

0a. `npm config set http-proxy=null`
0b. `npm config set https-proxy=null`
0c. `nvm use 5.0.0`
0d. `set HTTP_PROXY=`
0e. `set HTTPS_PROXY=`
1. Copy the example-config.js into the same directory as config.js. 
	a. Edit database connection information for test database.
	b. Add your own "jwt_secret", which can be generated by random byte generator. For example:
		```
		var crypto = require('crypto');

		crypto.randomBytes(32, function(ex, buf) {
			console.log("Example JWT Secret: " + buf.toString('hex'));
		});
		```
	c. Generate self-signed SSL certficates (for testing). In linux or Git Bash (on Windows), run the following command:
		`openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout privatekey.key -out certificate.crt`. Copy the private key and certificate to desired location and update the path to those files in config.js.
		i. Note: If you want to run Postman against the https server, need to import the certificate in Chrome Settings > Manage SSL Certificates.
		ii. Even if you've done this once, it seems new Chrome instances don't remember this import, and the certificate needs to be imported again.
2. Run `npm install` to install dependencies
3. To start, navigate to app/ in terminal and run `node server.js`
4. Use Postman to hit: http://localhost:8080/login using Basic Auth with username/password credentials that are in your database
