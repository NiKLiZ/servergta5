mp.calbackmenuv('vehengine',(player,array) => {
	let veh = mp.vehicles.at(parseInt(array[1]));
	if(!veh) veh = player.vehicle;
	if(player.vehicle && player.seat === -1) veh = player.vehicle;
	let hasEngine = array[0];
	toggleEngineVehicle(player,veh,hasEngine);
})
mp.calbackmenuv('vehlocked',(player,array)=>{
	let veh = mp.vehicles.at(parseInt(array[1]));
	if(!veh) veh = player.vehicle;
	let hasLocked = array[0];
	toggleLockedVehicle(player,veh,hasLocked)
});
mp.calbackmenuv('opendor',(player,array)=>{
	array[0] = array[0].split('|')
	let veh = player.isOwnerVehicle(array[1]);
	if(player.vehicle && player.seat === -1) veh = player.vehicle;
	if(!veh) return;
	let dor = parseInt(array[0])
	veh.toggledor(dor);
});
mp.events.add('opendor', (player,dor) => {
	let vehId = dor.split('|')[1];
	let veh = player.isOwnerVehicle(vehId);
	if(player.vehicle && player.seat === -1) veh = player.vehicle;
	if(!veh) return;
	dor = parseInt(dor)
	veh.toggledor(dor);
});
mp.events.add('vehlocked', (player,vehId) => {
	let veh = player.isOwnerVehicle(vehId);
	if(player.vehicle && player.seat === -1) veh = player.vehicle;
	if(vehId) veh = mp.vehicles.at(parseInt(vehId))
	if(!veh) return;
	veh.locked = !veh.locked;
	if(veh._id){
		veh.mongodb.locked = veh.locked;
		if(!veh.mongodb.$__.saving)veh.mongodb.save().catch((err)=>console.error(err));
	}
});

// Проверяет, является ли транспорт фракционным
function isFractionVehicle(player, vehicle) {
	return vehicle.fraction && player.fraction && player.fraction.name === vehicle.fraction.name;
}

function toggleLockedVehicle(player,veh,hasLocked){
	let vehOwner = player.isOwnerVehicle(veh.id);
	if(!(player.vehicle && player.seat === -1) && !isFractionVehicle(player, veh) && !(veh._id && vehOwner == vehOwner) ){
		let hasCollector = veh.collectorLobby && player.collectorMission == 0 && player.collectorLobby.players[0] == player;
		let hasParking = veh && veh == player.parking;
		if(player.hire != veh && !hasCollector &&  !hasParking && veh != vehOwner && !player.veh) return player.alert('У вас нет ключей от этой машины');
		if(player.hire != veh && !hasCollector && !hasParking) return player.alert('У вас нет ключей от этой машины');
	}
	if(!veh) return;
	if(veh._id){
		veh.mongodb.locked = hasLocked;
		if(!veh.mongodb.$__.saving)veh.mongodb.save().catch((err)=>console.error(err));
	}
	veh.locked = hasLocked;
	player.alert(`Вы ${hasLocked ? 'закрыли' : 'открыли'} машину`)
}

function toggleEngineVehicle(player,veh,hasEngine){
	let vehOwner = player.isOwnerVehicle(veh.id);
	if(hasEngine && !veh.hireFagio && !player.permision['MENU_VEH::CHANGE_ENGINE'] && !isFractionVehicle(player, veh)) {
		let hasCollector = veh.collectorLobby && player.collectorMission == 0 && player.collectorLobby.players[0] == player;
		let hasParking = player.vehicle.parking && player.vehicle == player.parking;
		if(player.hire != veh && !hasCollector &&  !hasParking && veh != vehOwner && !player.veh) return player.alert('У вас нет ключей от этой машины');
	}
	if(veh.getVariable('petrol') > 0){
		veh.toggleengen(hasEngine);
		if(veh._id){
			veh.mongodb.engine = hasEngine;
			if(!veh.mongodb.$__.saving)veh.mongodb.save().catch((err)=>console.error(err));
		}
	}else{
		player.alert('В машине нет бензина',1)
	}
	player.alert(`Вы ${hasEngine ? 'завели' : 'заглушили'} машину`)
}

mp.events.push({
	"VEHICLE::LOCKED_TOGGLE":(player,vehId)=>{
		let veh = mp.vehicles.at(vehId);
		if(!veh)return;
		toggleLockedVehicle(player,veh,!veh.locked)
	},
	"VEHICLE::ENGINE_TOGGLE":(player)=>{
		if(!player.vehicle)return;
		let veh = player.vehicle
		toggleEngineVehicle(player,veh,!veh.engine)
	},
})