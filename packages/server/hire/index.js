let hires = mp.configs.hire.hires;
let genNumberPlate = require('../a/functions/vehicle/getvariabels').generationPlate;
mp.calbackmenuv({
	'HIRE::RENT':(player,array)=>{
		if(!array[0])return;
		array = array[0].split(',');
		let hire = hires[parseInt(array[1])];
		let model = hire.vehs[parseInt(array[0])].model;
		if(player.hire && player.hire.model === mp.joaat(model))return player.alert('Вы уже арендуете данную машину');
		let vehicleParking = hire.spawns;
		let park = getEmptyPark(vehicleParking,player.hire);
		if(!park)return player.alert('Не хватает места на стоянке')
		let price = -hire.vehs[parseInt(array[0])].price;
		if(player.editMoney(price, 'Прокат машины ')){
			if(player.hire) player.hire.destroy();
			let veh = createVeh({
				model: model,
				pos: park.pos,
				h: park.heading,
				price: 20
			})
			player.call('HIRE::SET',[veh])
			player.alert('Вы арендовали транспорт')
			veh.hire_player = player;
			player.hire = veh;
		}
	}
})
mp.events.push("HIRE::STOP",(player)=>{
	let veh = player.hire;
	if(!veh) return;
	player.alert('Вы слишком далеко отошли от машины',0,3000);
	player.hire = null;
	player.call('HIRE::SET',[false])
	veh.destroy();
})
let createVeh = (car)=>{
	let numberPlate = genNumberPlate();
	let veh = mp.vehicles.new(car.model,car.pos ,{
		heading: car.h,
		numberPlate
	})
	veh.numberPlate = numberPlate
	veh.hire = true;
	veh.pos = car.pos;
	veh.h = car.h;
	veh.price = car.price;
	veh.setVariable('hire',true)
	// veh.toggleengen(false);
	veh.hire_player = null;
	return veh;
}
mp.events.add({
	"playerExitVehicle":(player,vehicle)=>{
		//Аренда транспорта
		if(vehicle){
			if(vehicle.hire && vehicle.hire == true) player.closemenuv('HIRE')
		}
	},
	"playerEnterVehicle":(player, vehicle, seat)=>{
		if(vehicle.hire === true){
			if(!vehicle.hire_player){
				let menu = {
					name: 'Аренда',
					exitmenu: 'HIRE',
					items: [
						{
							type: 1,
							name: 'Арендовать за '+vehicle.price,
							callback: 'HIRE::RENT',
						},
					]
				}
				player.createmenuv(menu);
				vehicle.toggleengen(false);
			}
		}
	}
})

function getEmptyPark(vehicleParking,ignorVeh){
	let vehicles = mp.vehicles.toArray();
	return vehicleParking.find((p)=>{
		let find = !vehicles.find((veh)=>{
			return ignorVeh != veh && veh.position.dist(p.pos) < 1.5;
		});
		return find;
	})
}