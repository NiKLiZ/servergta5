let mongoose = require('./mongo'),
	Schema = mongoose.Schema;
mongoose.Promise = global.Promise;﻿
let home = new Schema({
	pos: {
		type: Object,
		require: true
	},
	type:{
		type: Number,
		require:true,
		default: 0
	},
	price: {
		type: Number,
		require:true,
	},
	owner: {
		type: Schema.Types.ObjectId,
  		ref: 'user',
	},
	garage:{
		type: Array,
		default: [
			null,null,null,null,null,null,null,null,null,null
		]
	},
	garagePos:{},
	garageType:{
		type: Number
	},
	garageHeading:Number
});
exports.home = mongoose.model('home',home); 