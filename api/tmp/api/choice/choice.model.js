'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Question = require('../question/question.model');
var Answer = require('../answer/answer.model');

var ChoiceSchema = new Schema({
	question:	{ type: Schema.ObjectId, ref: 'Question', required: true },
	key			:	{ type: String, trim: true, required: true },
	text		:	{ type: String, trim: true, required: true },
	answers	:	[{ type: Schema.ObjectId, ref: 'Answer' }]
});

ChoiceSchema.pre('remove', function (next) {
	Question.findByIdAndUpdate(this.question, { $pull: { choices: this._id } }).exec();
	Answer.find({ _id: { $in: this.answers } }, function (err, answers) {
		if(err) { throw err; }
		answers.forEach(function (answer) { answer.remove(); });
	}).exec();
	next();
});

ChoiceSchema.pre('save', function (next) {
	this.wasNew = this.isNew;
	next();
});

ChoiceSchema.post('save', function () {
	if(this.wasNew) { Question.findByIdAndUpdate(this.question, { $push: { choices: this._id } }).exec(); }
});

module.exports = mongoose.model('Choice', ChoiceSchema);