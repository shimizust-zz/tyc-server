var dataUtils = require(global.appRoot + '/common/dataUtils');

describe('dataUtils', function() {
	it('should return correct points calculation', function() {
		assert.equal(550, dataUtils.calcWorkoutSegmentPoints('boulder', 'attempt', 5, 2));
	});
});