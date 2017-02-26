var DataUtils = function() {

	this.calcWorkoutSegmentPoints = function(climbType, ascentType, absGradeIndex, reps) {
		var points = 0;

		//The max boulder index is 22 and the max route index is 30. 
		var gradeNormalizationRatio = {
			'boulder': 1.0,
			'toprope': 22.0/30.0,
			'lead': 22.0/30.0
		};

		// A factor to account for difference in effort between different 
		// climb types
		var climbFactor = {
			'boulder': 1.0,
			'toprope': 1.5,
			'lead': 2.0
		};

		var ascentFactor = {
			'attempt': 0.5,
			'redpoint': 1.0,
			'flash': 1.15,
			'onsight': 1.2 
		};

		points = climbFactor[climbType]*(absGradeIndex + 0.5)*gradeNormalizationRatio[climbType]*100.0*ascentFactor[ascentType]*reps;		

		return points;
	}
} 

var dataUtils = new DataUtils();
module.exports = dataUtils;