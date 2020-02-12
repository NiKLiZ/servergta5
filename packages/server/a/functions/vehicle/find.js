mp.vehicles.atMongoId = (id)=>{
	let vehicles = mp.vehicles.toArray();
	let vehfind;
	vehicles.forEach((veh)=>{
		if(veh._id && veh._id.toString() === id+""){
			vehfind = veh;
		}
	})
	return vehfind;
}
mp.vehicles.hasCreatedVehicle = (vehId)=>{
	let players = mp.players.toArray();
	for (let i = 0; i < players.length; i++) {
		const player = players[i];
		if(player.loggined == true){
			for (let i = 0; i < player.vehicles.length; i++) {
				const vehicle = player.vehicles[i];
				if(vehicle._id.toString() == vehId.toString()){
					return true;
				}
			}
		}
	}
	return false;
}