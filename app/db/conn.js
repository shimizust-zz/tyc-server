var anyDB = require('any-db');

function getDBConnection (context) {
	var envConfig = context.envConfig;

	var dbConfig = envConfig['db'],
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