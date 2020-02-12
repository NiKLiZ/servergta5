let mongoose = require('./mongo'),
	Schema = mongoose.Schema;

let vehicle = new Schema({
	model: {
        type: String,
        default: ''
    },
    maxPetrol: {
        type: Number,
        default: 0,
    },
    consumptionPetrol: {
        type: Number,
        default: 0,
    },
    systemPetrol:{
        type: Boolean,
        default:true
    },
    glove:{
        type: Boolean,
        default:true
    },
    trunk:{
        type: Boolean,
        default:true
    },
    sizeGlove:{
        type: Number,
        default:0
    },
    sizeTrunk:{
        type: Number,
        default:0
    },
});

exports.configVehicle = mongoose.model('configVehicle',vehicle); 