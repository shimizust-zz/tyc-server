
users = {

	getAll: function (req, res) {
		res.json({'users': [1,2,3]});
	}
}

module.exports = users;