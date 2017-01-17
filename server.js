var express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	context = require('./app/context.js');

params = {
	dbType: 'dev' // TODO: Make this a command-line option
};

context.init(params);

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

var server = app.listen(process.env.PORT || 8080, function() {
	var host = server.address().address;
	var port = server.address().port;

	console.log(`App listening at localhost:${port}`);
});