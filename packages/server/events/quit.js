mp.events.add("playerQuit", (player)=>{
	try{
		
		if(player.loggined != true) return;
		if(player.veh) player.veh.destroy();
		player.mongoUser.health = player.health;
		player.inventory.saveItems();
		player.clearParking();
		player.updatetimeGame();
		player.updateLevels()
		//Аренда
		if(player.hire){
			player.hire.destroy();
		}
		player.savepos();
		if(player.truckerTrailer)player.truckerTrailer.destroy();
		player.vehicles.forEach(veh => {
			try{
				if(mp.vehicles.exists(veh) && !veh.evacuated){
					if(veh._id)veh.savepos();
					veh.destroy();
				}
			}catch(e){
				console.error(e)
			}
		});
		if(player.evacuatedVeh){
			if(!mp.vehicles.hasCreatedVehicle(player.evacuatedVeh._id))player.evacuatedVeh.destroy();
		}
	}catch(e){
		console.error(e)
	}
});
