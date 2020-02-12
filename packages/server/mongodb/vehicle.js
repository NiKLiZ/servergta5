let mongoose = require('./mongo'),
	Schema = mongoose.Schema;

let SchemaTypes = mongoose.Schema.Types;
let vehicle = new Schema({
		model: Number,
		primary: {
			type: Number,
			default: 0
		},
		secondary: {
			type: Number,
			default: 0
		},
		color: Array,
		mods: Array,
		pos: {
		},
		rot: {
		},
		glovebox: {
			type: Array
		},
		mods: {
			default: [],
			type: Array
		},
		trunk: {
			type: Array
		},
		locked: Boolean,
		engine: Boolean,
		petrol: Number,
		numberPlate: String,
		garage: {},
		garagePos: {},
		player: {
			type: Schema.Types.ObjectId,
			ref: 'user',
		},
		numberPlateType: Number,
		windowTint: Number,
		price: Number,
		evacuated: {
			type:Boolean,
			default: false,
		},
		headlightColor: {
			type: Number,
			default: null
		},
		extra: {
			type: Number,
			default: 0
		},
		extraWheel: {
			type: Number,
			default: 0
		},
		neon: {
			type: Array
		}
});

exports.vehicle = mongoose.model('vehicle',vehicle); 