var config = require('../config');

function Context() {
	var self = this,
		dbConn,
		services = {};

	this.init = function (params) {
		var envType = params.envType;

		self.envConfig = config[envType];

		// Initialize database connection
		dbConn = require('./db/conn.js')(self);

		// Add to services
		self.addService('db', dbConn);
	};

	this.addService = function (serviceName, service) {
		services[serviceName] = service;
	};

	this.getService = function (service) {
		return services[service];	
	};
}

var context = new Context();

module.exports = context;