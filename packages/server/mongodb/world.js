let mongoose = require('./mongo'),
	Schema = mongoose.Schema


let SchemaTypes = mongoose.Schema.Types;
let world = new Schema({
	farm:{
		warehouse:{
			type: Number,
			default: 0,
		}
	},
});

exports.world = mongoose.model('world',world);