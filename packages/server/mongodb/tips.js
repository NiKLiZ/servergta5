let mongoose = require('./mongo'),
	Schema = mongoose.Schema;
mongoose.Promise = global.Promise;﻿
let tips = new Schema({
	title: String,
	icon: String,
	text: String,
});
exports.tips = mongoose.model('tip',tips); 