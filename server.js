var express = require('express'),
	app = express(),
	fs = require('fs'),
	http = require('http'),
	https = require('https'),
	bodyParser = require('body-parser'),
	context = require('./app/context.js');

var envType = 'dev'; // TODO: Make this a command-line option

// Initialize the app context
context.init({
	envType: envType
});

var envConfig = context.envConfig;

app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

// Set headers for all requests
app.all('/*', function (req, res, next) {
	// CORS headers
	res.header("Access-Control-Allow-Origin", '*');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');

	if (req.method == 'OPTIONS') {
		res.status(200).end();
	} else {
		next();
	}
});

// Auth middleware - Check if token is valid (only those request that start with
// /api/v1/* will be checked for token
app.all('/api/v1/*', require('./app/auth.js').validateRequest);

// Register routes
app.use('/', require('./routes.js'));

// If no route matched at this point, return 404
app.use(function (req, res) {
	res.status(404).send('<h1>Not Found</h1>');
});

var httpServer = http.createServer(app).listen(process.env.PORT || envConfig['http_port'], function() {
	var host = httpServer.address().address;
	var port = httpServer.address().port;

	console.log(`App listening at http://localhost:${port}`);
});

var httpsServer = https.createServer({
	cert: fs.readFileSync(envConfig['ssl_cert_path']),
	key: fs.readFileSync(envConfig['ssl_key_path'])
}, app).listen(process.env.HTTPS_PORT || envConfig['https_port'], function() {
	var host = httpsServer.address().address;
	var port = httpsServer.address().port;

	console.log(`App listening at https://localhost:${port}`);
})

