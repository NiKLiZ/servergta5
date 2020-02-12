let mongoose = require('mongoose');
exports.getVariableVehicle = (veh,player)=>{
	if(veh){
		vehs = {
			_id: veh._id ? veh._id : mongoose.Types.ObjectId(),
			model: veh.model,
			numberPlate: veh.numberPlate,
			primary: veh.getColor(0),
			secondary: veh.getColor(1),
			pos: veh.position,
			rot: veh.rotation,
			isactive: true,
			isseat: false,
			glovebox: veh.glovebox.items,
			trunk: veh.trunk.items,
			locked: veh.locked,
			engine: veh.engine,
			petrol: veh.getVariable('petrol')
		}
		if(player){
			if(player.vehicle === veh){
				vehs.isseat = player.seat;
			}
		}
		return vehs;
	}
}
exports.generationPlate = ()=>{
	return mp.randomString(2)+`${mp.getRandomInRange(0,9)+''+mp.getRandomInRange(0,9)+''+mp.getRandomInRange(0,9)+''+mp.getRandomInRange(0,9)}`+mp.randomString(2)
}