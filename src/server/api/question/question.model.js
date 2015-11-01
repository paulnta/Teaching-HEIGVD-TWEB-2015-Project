'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Poll = require('../poll/poll.model');
var Choice = require('../choice/choice.model');

var QuestionSchema = new Schema({
	poll		:	{ type: Schema.ObjectId, ref: 'Poll', required: true },
	title		:	{ type: String, trim: true, required: true },
	type		:	{ type: String, trim: true, default: '' },
	choices	:	[{ type: Schema.ObjectId, ref: 'Choice' }]
});

QuestionSchema.pre('remove', function (next) {
	// Note: There is no hook for Model.remove() i.e. delete on cascade does not work.
	Poll.update({ _id: this.poll }, { $pull: { questions: this._id } });
	Choice.find({ question: this._id }, function (err, choices) {
		if(err) { throw err; }
		choices.forEach(function (choice) { choice.remove() });
	});
	next();
});


QuestionSchema.post('save', function () {
	if(this.isNew) { Poll.findById(this.poll, { $push: { questions: this._id } }); }
});

module.exports = mongoose.model('Question', QuestionSchema);