let configVehicleModel = require('../../../mongodb/configVehicle.js').configVehicle;
let configVehicles = {
    'default': {
        maxPetrol: 50,
        consumptionPetrol: 10,
        systemPetrol: true,
        glove: true,
        trunk: true,
        sizeGlove: 20,
        sizeTrunk: 20
    }
};
let load = (callback)=>{
    configVehicleModel.find({},(err,confs)=>{
        confs.forEach((conf)=>{
            configVehicles[mp.joaat(conf.model)] = conf;
        })
        callback(err);
    })
}
exports.load = load
exports.configVehicles = configVehicles;