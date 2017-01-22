var config = {
	dev: {
		db: {
			username: 'root',
			password: '',
			hostname: 'localhost',
			port: 3306,
			driver: 'mysql',
			db_name: 'trackyourclimb_db'
		},
		jwt_secret: 'abc123',
		http_port: 8080,
		https_port: 8443,
		ssl_key_path: '../secrets/privatekey.key',
		ssl_cert_path: '../secrets/certificate.crt'
	},
	prod: {
		db: {
			username: '',
			password: '',
			hostname: '',
			port: 3306,
			driver: 'mysql',
			db_name: 'trackyourclimb'
		},
		jwt_secret: 'abc123',
		http_port: 80,
		https_port: 443,
		ssl_key_path: '~/tyc-privatekey.key',
		ssl_cert_path: '~/tyc-certificate.crt'
	}
};

module.exports = config;