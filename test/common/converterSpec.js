var converter = require(global.appRoot + '/common/converter');

describe('grade conversion', function() {
	it('should get absolute grade index', function() {
		assert.equal(5, converter.getAbsoluteGradeIndex('boulder', 'hueco', 'V3'));
	});

});