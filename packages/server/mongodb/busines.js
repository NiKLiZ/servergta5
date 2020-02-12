let mongoose = require('./mongo'),
	Schema = mongoose.Schema;


let SchemaTypes = mongoose.Schema.Types;
let busines = new Schema({
    id: {
        type: Number,
        default: 0
    },
    type: {
        type: String,
        default: ''
    },
    logs: {
        type: Array,
        default: []
    },
    owner: {
		type: Schema.Types.ObjectId,
  		ref: 'user',
    },
    balance: {
        type: Number,
        default: 0
    },
    stock: Schema.Types.Mixed,
    transactions: {
        type: Array,
        default: []
    },
    orders: {
        type: Array,
        default: []
    },
});

exports.busines = mongoose.model('busines',busines);