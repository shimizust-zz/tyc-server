var context = require('./context.js'),
	db = context.getService('db');

gyms = {
	getAll: function (req, res) {
		db.query('SELECT * FROM gyms', function (error, result) {
			if (!error) {
				res.json(result.rows);
			}
		});
	}
}

module.exports = gyms;