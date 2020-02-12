mp.events.add({
	"vehicleDamage": (vehicle, bodyHealthLoss, engineHealthLoss) => {
		if(vehicle.parking){
			if(vehicle.bodyHealth > 20 ) return;
		  vehicle.parking.respawn(vehicle);
		}
		let driver = vehicle.getPlayers(-1);
		if(driver.pizza && driver.damage_pizza == false){
			if(driver){
				driver.damage_pizza = true;
				driver.alert('Вряд ли вам дадут чаевые')
			} 
		}
	},
	"vehicleDeath": (vehicle) => {
		if(vehicle.parking){
		  vehicle.parking.respawn(vehicle);
		}
	},
	"parkingCancle":(player)=>{
		player.clearParking();
	},
	"playerStartEnterVehicle":(player, vehicle,seat)=>{
		if(player.isBox){
			player.alert('Вы не можете сесть если у вас в руках коробка')
			player.stopAnimation();
			player.inventory.liesItem({id:58},true)
		}
		if(vehicle.parking){
			if(vehicle.target && vehicle.lock === false && vehicle.target != player ){//|доделать| && seat !== -1
				 if(vehicle.taxi === true) vehicle.locked = false;
				 if(vehicle.bus === true){
				 	let driver = vehicle.getPlayers(-1);
					if(!driver || vehicle.target != driver){
						vehicle.locked = true;
						return player.alert('Водителя нет в машине');
					} 
				 	if(player.money >= vehicle.bus_price ){
				 		vehicle.locked = false;
				 	}else player.alert('У вас не хватает денег. Сумма поездки'+vehicle.bus_price)
				 }
				 return;
			}
			if(vehicle.target !== player){
				vehicle.locked = true;
			}else{
				vehicle.locked = false;
		  }
		}
		
	},
	"updateFuel":(player, id,fuel)=>{
		let veh = mp.vehicles.at(id);
		if(veh) veh.setVariable('petrol',fuel)
		if(fuel == 0)veh.toggleengen(false)
	},
	"playerEnterVehicle":(player, vehicle, seat)=>{
		if(vehicle.target && vehicle.lock === false && vehicle.target != player && vehicle.bus === true){
			//Такси
			if(vehicle.taxi == true){
				let driver = vehicle.getPlayers(-1);
				if(!driver || vehicle.target != driver) player.alert('Таксиста нет в машине');
				if(driver && driver !== player){
					player.alert('Укажите место');
					player.status_taxi = 0;
					taxi.alert('К вам сел '+player.name);
				}
			}
			//Автобус
			if(vehicle.bus === true){
				 	let driver = vehicle.getPlayers(-1);
					if(!driver || vehicle.target != driver){
						player.removeFromVehicle();
						return player.alert('Водителя нет в машине');
					} 
				 	if(player.editMoney(-vehicle.bus_price, 'Проезд на автобусе')){
				 		vehicle.target.bus_cassa += vehicle.bus_price;
				 		vehicle.target.editmoneyCash(vehicle.bus_price,'Работа на автобусе');
				 		vehicle.locked = false;
				 	}else{
				 		player.alert('У вас не хватает денег. Сумма поездки'+vehicle.bus_price)
				 		player.removeFromVehicle();
				 	} 
				}
		}
		//Аренда транспорта
		
	},
	
})
