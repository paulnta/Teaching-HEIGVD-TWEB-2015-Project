'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Question = require('../question/question.model');
var Participation = require('../participation/participation.model');

var PollSchema = new Schema({
	title					:	{ type: String, trim: true, required: true },
	creationDate 	:	{ type: Date, 	default: Date.now },
	state					:	{ type: String, default: 'draft', enum: ['draft', 'active', 'closed']},
	questions			:	[{ type: Schema.ObjectId, ref: 'Question' }],
	participations:	[{ type: Schema.ObjectId, ref: 'Participation' }]
});

PollSchema.pre('remove', function (next) {
	// Note: There is no hook for Model.remove() i.e. delete on cascade does not work.
	/*Question.find({ poll: this._id }, function (err, questions) {
		if(err) { throw err; }
		questions.forEach(function (question) { question.remove(); });
	});*/
	Participation.find({ poll: this._id }, function (err, participations) {
		if(err) { throw err; }
		participations.forEach(function (participation) { participation.remove(); });
	});
	next();
});

module.exports = mongoose.model('Poll', PollSchema);