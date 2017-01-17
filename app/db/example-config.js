var config = {
	dev: {
		username: 'admin',
		password: 'pass',
		hostname: 'localhost',
		port: 3306,
		driver: 'mysql',
 		db_name: 'trackyourclimb_test_db',
 		secret: 'abc123'
	},
	prod: {
		username: 'test',
		password: 'pass',
		hostname: 'productionurl.com',
		port: 3306,
		driver: 'mysql',
		db_name: 'trackyourclimb_prod_db',
		secret: 'abc123'
	}
}

module.exports = config;