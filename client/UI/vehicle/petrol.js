player.getAmmoWeapon = (weaponhash) => mp.game.invoke('0x015A522136D7F951', player.handle, weaponhash);
let {browserHud} = require('../GUI/gui')
let fills_shape = null;
let fills = false;
function get_veh_tank_Coord(veh) {
 	let bones = [
            "petrolcap",
            "petroltank",
            "petroltank_r",
            "petroltank_l",
            "wheel_lr"
        ];
	let pos;
	for(let i=0;i<bones.length;i++){
		let boneIndex = veh.getBoneIndexByName(bones[i]);
		if(boneIndex == -1){
			pos = veh.position;
		}else{
			pos = veh.getWorldPositionOfBone(boneIndex)
		}
	}
	return pos;
 }

setInterval(function () {
	if(player.vehicle && player.vehicle.getIsEngineRunning() && player.vehicle.getVariable('systemPetrol')){
		let km = player.vehicle.getSpeed()* 3.6;
		let gear = player.vehicle.gear || 1;
		let v = gear * player.vehicle.rpm * 4;
		let fC = 0.5*3.6;

		let fuelChange = (fC/100*km + v)/3600;
		let consumptionPetrol = player.vehicle.getVariable('consumptionPetrol') || 10;
		minusFuel(fuelChange*consumptionPetrol);
	}
}, 1000);
setInterval( ()=> {
	if(player.vehicle && player.vehicle.getIsEngineRunning()){
		mp.events.callRemote("updateFuel", player.vehicle.remoteId, player.vehicle.petrol);
	}
},5000)

mp.events.add("callVehicleSystem", function (system) {

	transmissionFunctions(system.transmission);
	suspensionFunctions(system.suspension);

	player.vehicle.setEnginePowerMultiplier(parseInt(player.vehicle.getEngineHealth()/20));

});
function taskParkVeh(veh,pos) {
	player.taskVehiclePark(veh.handle, pos.x, pos.y, pos.z,0 , 1, 10, false);	
}
mp.events.add("playerReachWaypoint", (player, position) => {
	player.clearTasks()
})
mp.events.add("playerCreateWaypoint", (player, position) => {
	taskParkVeh(player.vehicle,position)
});
function transmissionFunctions(value){
	let chance = 0;
	if(value >= 750 && value < 900) chance = 10;
	if(value >= 650 && value < 750) chance = 20;
	if(value >= 500 && value < 650) chance = 35;
	if(value >= 250 && value < 500) chance = 60;
	if(value >= 150 && value < 250) chance = 80;
	if( value < 150) chance = 100;
	let random = randomInt(1, 101);
	if( chance >= random ){
		let speed = randomInt(1, 30);
		let setSpeed = 2;
		if(player.vehicle.getSpeed() - speed > 0) setSpeed = player.vehicle.getSpeed() - speed;
		player.vehicle.setForwardSpeed(setSpeed)
	}
}


function suspensionFunctions(value){
	let chance = 0;
	if(value >= 750 && value < 900) chance = 10;
	if(value >= 650 && value < 750) chance = 20;
	if(value >= 500 && value < 650) chance = 35;
	if(value >= 250 && value < 500) chance = 60;
	if(value >= 150 && value < 250) chance = 80;
	if( value < 150) chance = 100;
	let random = randomInt(1, 101);
	if( chance >= random ){
		let wheel = randomInt(0, 6);
		player.vehicle.setTyreBurst(wheel, false, 0);
	}
}

function minusFuel(value){
	if(value <= player.vehicle.petrol) player.vehicle.petrol = player.vehicle.petrol - value;
	else player.vehicle.petrol = 0.0;
	if(player.vehicle.petrol == 0) mp.events.callRemote("updateFuel", player.vehicle.remoteId, 0);
}
mp.events.addDataHandler({
	"petrol": (entity, value) => {
		if(entity.type != "vehicle") return;
		entity.petrol = entity.getVariable('petrol');
	},
});
mp.events.add({
	"playerLeaveVehicle":  (vehicle)=> {
		mp.events.callRemote("updateFuel", player.vehicle.remoteId, player.vehicle.petrol);
	},
	"playerStartEnterVehicle": (vehicle,seat)=>{
		vehicle.petrol = vehicle.getVariable('petrol');
	},
	"PressG":()=>{
		if(!fills_shape) return;
		if(player.money <= 2 && player.cardMoney && player.cardMoney <= 2) return alert('У вас не хватает денег');
			if(player.vehicle && player.vehicle.petrol  >= player.vehicle.getVariable('MAX_PETROL') - 0.1) return alert('Бак полон');
			if(player.vehicle && player.vehicle.getSpeed() > 0.1) return alert('Остановите машину');
			let menu = {
				name: 'Заправка',
				exitmenu_callback: 'petrol_exit',
				exitmenu: 'petrol',
				items: [
					{
						type: 5,
						name: 'Литров',
						placeholder: 'За 1 л. 5$',
						type_input: 'number'
					},
					{
						type: 0,
						name: 'Купить канистру с бензином',
						placeholder: 'За 1 л. 5$ + 5$ канистра',
						callback: 'Buy_can'
					},
				]
			}
			if(isSeatVehicle(-1)){
				menu.items.splice(1, 0,  {
						type: 0,
						name: 'Заправить',
						placeholder: 'Заправить',
						callback: 'Fills_petrol'
					});
			}
			createmenuv(menu);
			guitoggle(true,true);
			cursor(false);
			fills = true;
			browserHud.execute('keyTip(false)');
	},
	'playerEnterColshape': (shape) => {
		if(mp.colshapes.exists(shape) && shape.getVariable('filling') === true){
			fills_shape = shape;
			browserHud.execute('keyTip(true,"G")');
		}
	},
	'playerExitColshape': (shape) => {
		if(mp.colshapes.exists(shape) && shape.getVariable('filling') === true && fills_shape != null){
			fills_shape = null;
			closemenuv('petrol');
			browserHud.execute('keyTip(false)');
		}
	},
	"render":()=>{
		try{
			if(player.vehicle && player.vehicle.petrolLoad){
				mp.game.fire.stopFireInRange(player.vehicle.position.x, player.vehicle.position.y, player.vehicle.position.z, 20);
			}
			if(!loggined) return;
			if(fills){
				mp.game.controls.disableControlAction(2, 75, true);
			}
			if(player.vehicle)return;
			let entity = LookingEntity;
			if(player.weapon == 883325847 && entity && entity.type == 'vehicle'){
				mp.vehicles.forEach((vehicle)=>{
					try{

						if(vehicle.dimension == player.dimension && mp.Vector3.Distance(player.position, vehicle.position) <= 5 ){
							let pos = get_veh_tank_Coord(vehicle);
							let dist = mp.Vector3.Distance(player.position, pos);
							if(dist <= 2){
								if(vehicle.petrol == null)vehicle.petrol = vehicle.getVariable('petrol');
								mp.game.graphics.drawText(`бак ${dist <= 1.3? ` ~o~${vehicle.petrol.toFixed(1)} ~w~л.` : ''}`,  [pos.x, pos.y,pos.z], {scale:0.15, color:[255, 255, 255, 255], font: 0});
							}
						}
					}catch(e){}
			 })
			}
		}catch(e){}
	},
	"petrol_exit":()=>{
		guitoggle(false);
		fills = false;
	},
	"playerWeaponShot":()=>{
		if(!loggined) return;
		if(player.vehicle) return;
		let entity = LookingEntity;
		if(player.weapon == 883325847 && entity && entity.type == 'vehicle'){
			mp.vehicles.forEach((vehicle)=>{
				if(vehicle.dimension == player.dimension && mp.Vector3.Distance(player.position, vehicle.position) <= 5){
					let pos =	get_veh_tank_Coord(vehicle);
						let dist = mp.Vector3.Distance(player.position, pos);
						if(dist <= 1.3){
							if(vehicle.petrol  >= vehicle.getVariable('MAX_PETROL') - 0.1 ){
								if(alert_full_tank == false){
									alert_full_tank = true;
									setTimeout(function () { alert_full_tank = false; }, 3000);
									return alert('Бак полон');
								}else{
									return;
								}
							} 
							if(timeout_tank_back){
								clearTimeout(timeout_tank_back);
							}
							if(timeout_tank_back == null){
								old_petrol_tank = player.getAmmoWeapon(883325847);
								vehicle.petrol = vehicle.getVariable('petrol');
								old_petrol = vehicle.getVariable('petrol')
							}
							fuel_tank = parseInt((old_petrol_tank - player.getAmmoWeapon(883325847))/45)+0.95;
							vehicle.petrol = old_petrol + fuel_tank*0.2;
							mp.game.graphics.removeDecalsInRange(pos.x,pos.y, pos.z, 1.5);
							timeout_tank_back = setTimeout(()=>{
								let veh = vehicle;
								veh.petrolLoad = true;
								mp.game.invoke("0x7F0DD2EBBB651AFF",veh.handle)
								mp.game.fire.stopFireInRange(veh.position.x, veh.position.y, veh.position.z, 20);
								let fuel = (fuel_tank*0.2).toFixed(1);
								alert('Вы заправили бак на '+fuel+'л.')
								mp.events.callRemote("updateFuel", vehicle.remoteId, vehicle.petrol);
								old_petrol_tank = 0;
								old_petrol = 0;
								timeout_tank_back = null;
								mp.game.graphics.removeDecalsInRange(pos.x,pos.y, pos.z, 1.5);
								veh.setDisablePetrolTankFires(true);
							},500)
						}
					}
			})
		}
	},
});


let timeout_tank_back = null;
let old_petrol_tank = 0;
let old_petrol = 0;
let fuel_tank = 0;
let alert_full_tank = false;