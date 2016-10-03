var allDBConfig = require('./config'),
	anyDB = require('any-db');

function getDBConnection (dbType) {
	var dbConfig = allDBConfig[dbType],
		driver = dbConfig.driver,
		username = dbConfig.username,
		password = dbConfig.password,
		hostname = dbConfig.hostname,
		port = dbConfig.port,
		db_name = dbConfig.db_name;
	
	var connURL = `${driver}://${username}:${password}@${hostname}:${port}/${db_name}`;
	var conn = anyDB.createConnection(connURL);

	return conn;
}

module.exports = getDBConnection;