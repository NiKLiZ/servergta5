let mongoose = require('./mongo'),
	Schema = mongoose.Schema;


let SchemaTypes = mongoose.Schema.Types;
let card = new Schema({
	money: {
		type: Number,
		default: 0
	},
	card_number: {
		type: Number,
		default: 0
	},
	player: {
		type: Schema.Types.ObjectId,
  		ref: 'user',
	},
  transactions:{
    type:Array,
    default:[],
    title: String,
    money: Number,
    taken: {
        type: Boolean,
        default:false
    },
    date: Number
},
});

exports.card = mongoose.model('card',card);