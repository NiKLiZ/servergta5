let mongoose = require('./mongo'),
	Schema = mongoose.Schema


let SchemaTypes = mongoose.Schema.Types;
let ban = new Schema({
	name: String,
	Type: Number,
	value: String,
	Reason: String,
	LiftTimestamp: Number
});

exports.ban = mongoose.model('ban',ban);