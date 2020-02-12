let mongoose = require('./mongo'),
	Schema = mongoose.Schema;


let SchemaTypes = mongoose.Schema.Types;
let phone = new Schema({
	number: {
		type: Number,
		unique: true
	},
	apps:{
		sms:{
			dialogs: [],
			sleeping: false,
		},
		contact: {
			contacts: [],
		},
		call: {
			calls: []
		}

	}
});

exports.phone = mongoose.model('phone',phone);