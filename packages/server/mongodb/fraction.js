let mongoose = require('./mongo'),
	Schema = mongoose.Schema;


let SchemaTypes = mongoose.Schema.Types;
let fraction = new Schema({
	name: String,
	members: [{
		type: Schema.Types.ObjectId,
		ref: 'user',
		default: []
	}],
	logs: {
		type: Array,
		default: [],
	},
	data: {
		money: {
			type: Number,
			default: 0,
		},
		weapons: {

		},
		ammo: {
			type: Number,
			default: 0
		}
	},
	zones: []
});

exports.fraction = mongoose.model('fraction',fraction);