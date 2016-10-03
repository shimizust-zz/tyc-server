function Context() {
	var self = this,
		dbConn,
		services = {};

	this.init = function (params) {
		var dbType = params.dbType;

		// Initialize database connection
		dbConn = require('./db/conn.js')(dbType);

		// Add to services
		self.addService('db', dbConn);
	}

	this.addService = function (serviceName, service) {
		services[serviceName] = service;
	}

	this.getService = function (service) {
		return services[service];	
	}
}

var context = new Context();

module.exports = context;