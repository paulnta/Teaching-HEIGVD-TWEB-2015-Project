'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Poll = require('../poll/poll.model');
var Answer = require('../answer/answer.model');

var ParticipationSchema = new Schema({
 	poll					:	{ type: Schema.ObjectId, ref: 'Poll', required: true },
	participant		:	{ type: String, trim: true, required: true },
	submissionDate:	{ type: Date, default: Date.now },
	answers				:	[{ type: Schema.ObjectId, ref: 'Answer' }]
});

ParticipationSchema.pre('remove', function (next) {
	Poll.update({ _id: this.poll }, { $pull: { participations: this._id } });
	Answer.find({ participation: this._id }, function (err, answers) {
		if(err) { throw err; }
		answers.forEach(function (answer) { answer.remove(); });
	});
	next();
});

ParticipationSchema.post('save', function () {
	if(this.isNew) { Poll.update({ _id: this.poll }, { $push: { participations: this._id } });}
});

module.exports = mongoose.model('Participation', ParticipationSchema);