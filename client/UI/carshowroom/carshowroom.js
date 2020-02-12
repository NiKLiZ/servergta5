let start_carshowroom = false;
let veh;
let vehicles = require('../../../packages/server/carshowroom/config').vehicles;
let ScaleForm = require('../../SYSTEM/scaleform/scaleform.js').ScaleForm;
let myScaleForm_stats = new ScaleForm('mp_car_stats_01');
let interiorIDSalon = mp.game.interior.getInteriorAtCoords(-43.8536, -1098.7268, 25.4224); 
mp.game.interior.enableInteriorProp(interiorIDSalon, 'csr_beforeMission'); 
mp.game.interior.disableInteriorProp(interiorIDSalon, 'csr_afterMissionA'); 
mp.game.interior.disableInteriorProp(interiorIDSalon, 'csr_afterMissionB'); 
mp.game.interior.disableInteriorProp(interiorIDSalon, 'csr_inMission'); 
mp.game.interior.disableInteriorProp(interiorIDSalon, 'shutter_open'); 
mp.game.interior.enableInteriorProp(interiorIDSalon, 'shutter_closed'); 
mp.game.interior.refreshInterior(interiorIDSalon);
mp.game.object.doorControl(1417577297, -37.33113, -1108.873, 26.7198, false, 0.0, 50.0, 0); 
mp.game.object.doorControl(2059227086, -39.13366, -1108.218, 26.7198, false, 0.0, 50.0, 0); 
mp.game.object.doorControl(1417577297, -60.54582, -1094.749, 26.88872, false, 0.0, 50.0, 0); 
mp.game.object.doorControl(2059227086, -59.89302, -1092.952, 26.88362, false, 0.0, 50.0, 0);
mp.game.object.doorControl(2051651622, -31.72353, -1101.847, 26.57225, false, 0.0, 50.0, 0);
let colors = [0,147,1,11,2,3,4,5,6,7,8,9,10,27,28,29,150,30,31,32,33,34,143,35,135,137,136,36,38,138,99,90,88,89,91,49,50,51,52,53,54,92,141,61,62,63,64,65,66,67,68,69,73,70,74,96,101,95,94,97,103,104,98,100,102,99,105,106,71,72,142,145,107,111,112];
let posVeh = new mp.Vector3(-85.66077423095703,-834.8216552734375,106.88711364746094);
let heading = 18;
let browserCarshowroom = mp.browsers.new('package://HTML/carshowroom/index.html'); 
let colorCurent = 0;
let carsInfo = [];
mp.blips.new(225, new mp.Vector3(-59.89302, -1092.952, 26.88362),{
    name: 'Автосалон',
    color: 0,
    dimension: 0,
    shortRange: true,
    alpha: 255
})
let configVehicles;
let playerPosition;
let {getBusinessById} = require('../../SYSTEM/business/index');
let curentBuines;
mp.events.add({
	"showroomcars": (infoVehicles,idBusines) => {
		mp.events.callRemote("PLAYER::CHANGE_MY_DIMENSION",true,true)
		infoVehicles = JSON.parse(infoVehicles);
		curentBuines = idBusines;
		start_carshowroom = true;
		playerPosition = player.position;
		player.position = new mp.Vector3(-83.8015365600586,-824.2444458007812,106.80711364746094);
		// player.freezePosition(true);
		displayRadar(false);
		mp.gui.chat.activate(false);
		mp.vehicles.forEach((vehicle,id)=>{
			if(vehicle.carshowroom === true)
			vehicle.destroy();
		})
		veh = mp.vehicles.new(mp.game.joaat(infoVehicles[0].model), posVeh,{
			heading: heading,
		});
		
		veh.carshowroom = true;
		carsInfo = [];
		colorCurent = 0;
		for(let i=0;i<infoVehicles.length;i++){
			let name = mp.game.ui.getLabelText(mp.game.vehicle.getDisplayNameFromVehicleModel(mp.game.joaat(infoVehicles[i].model)));
			if(name != 'NULL'){
				carsInfo.push({
					name: name,
					model: mp.game.joaat(infoVehicles[i].model),
					price:infoVehicles[i].price,
					vehicleId: i
				})
			}
		}
		alert(`Что-бы выйти из меню нажмите Backspace`)
		guitoggle(true,true);
		mp.gui.chat.show(false);
		let nameType = getBusinessById(idBusines).title;
		
		veh.setOnGroundProperly();
		let posCam = veh.getOffsetFromInWorldCoords(-0.5,4.5,1.5)
		mp.events.call("setCameraPosition",posCam.x,posCam.y, posCam.z,-13.3,0,-175,0,0);
		veh.setRotation(0, 0, heading, 1, true);
		browserCarshowroom.execute(`carshowroom.start('${nameType}',${JSON.stringify(carsInfo)});${carParam()}`);
	},
	"CARSHOWROOM::BUY":(vehicleId)=>{
		mp.events.callRemote("CARSHOWROOM::BUY",curentBuines,vehicleId,colorCurent)
	},
	"clearroomcars": (tp = true) => {
		// player.freezePosition(false);
		start_carshowroom = false;
		browserCarshowroom.execute('carshowroom.show = false;')
		mp.vehicles.forEach((vehicle,id)=>{
			if(vehicle.carshowroom === true)
			vehicle.destroy();
		})
		mp.events.call("cameradefault",0);
		guitoggle(false);
		veh = null;
		mp.gui.chat.activate(true);
		displayRadar(true);
		mp.gui.chat.show(true);
		mp.events.callRemote("PLAYER::CHANGE_MY_DIMENSION",false)
		if(tp)player.position = playerPosition;
	},
	"CARSHOWROOM::LOAD_OPTIONS_VEHICLE":(json)=>{
		configVehicles = JSON.parse(json);
	}
});
mp.events.add('selectAuto', (currentSlide)=>{
	if(!veh || !carsInfo[currentSlide])return
	let model = carsInfo[currentSlide].model;
	veh.model = model;
	veh.setRotation(0, 0, heading, 1, true);
	veh.position = new mp.Vector3(posVeh.x, posVeh.y, veh.position.z);
	while(mp.game.streaming.hasModelLoaded(model) === false){
		mp.game.system.wait(0);
	} 
	browserCarshowroom.execute(carParam());
	veh.setColours(colorCurent, veh.getColours(0,0).colorSecondary);
});
mp.events.add('selectColor',(t)=>{
	colorCurent = colors[t]; 
	veh.setColours(colors[t], veh.getColours(0,0).colorSecondary);
})
mp.events.add('render', () => {
	try{
		if(!veh) return;
		if(!mp.vehicles.exists(veh)) return;
		if(!veh.position) return;
		let pos = veh.position;
		pos.z += 3.6;
		// myScaleForm_stats.render3D(pos, new mp.Vector3(0, 30, 0), new mp.Vector3(10, 5, 100));
		if(!mp.keys.isDown(0x01)) return;
		let rx = veh.getRotation(2).z;
		let xMagnitude = mp.game.controls.getDisabledControlNormal(0,1)
		rx = rx + xMagnitude * 30;
		if(rx >= 360 ){
			rx = 0;
		}
		veh.setRotation(0, 0, rx, 1, true);
	}catch(e){
		chat(e)
	}
});
function update_statscar() {
	myScaleForm_stats.callFunction('SET_VEHICLE_INFOR_AND_STATS', 
		mp.game.ui.getLabelText(mp.game.vehicle.getDisplayNameFromVehicleModel(veh.model)),
		'Tracked and Insured',"MPCarHUD","Annis","Cкорость","Ускорение","Торможение","Тяга",
		(100/300)*mp.game.vehicle.getVehicleModelMaxSpeed(veh.model),
		mp.game.vehicle.getVehicleModelAcceleration(veh.model)*30,
		mp.game.vehicle.getVehicleModelMaxBraking(veh.model)*10,
		mp.game.vehicle.getVehicleModelMaxTraction(veh.model)*10 )
}

function carParam() {
	try{
		let maxBraking = mp.game.vehicle.getVehicleClassMaxBraking(0)*5;
		let maxAcceleration = mp.game.vehicle.getVehicleClassMaxAcceleration(0)*5;
		let speed = mp.game.vehicle.getVehicleModelMaxSpeed(veh.model)*3.6,
			braking = mp.game.vehicle.getVehicleModelMaxBraking(veh.model),
			fuelRate = 0,
			clutch = mp.game.vehicle.getVehicleModelAcceleration(veh.model);
		let execute = '';
		execute += `window.carshowroom.carSpeed = ${parseInt(speed)};`;
		execute += `window.carshowroom.carBrake = ${parseInt(100/maxBraking*braking)};`;
		execute += `window.carshowroom.carClutch = ${parseInt(100/maxAcceleration*clutch)};`;
		execute += `window.carshowroom.carFuel = ${configVehicles[veh.model] ? configVehicles[veh.model].maxPetrol : configVehicles['default'].maxPetrol};`;
	
		return execute
	}catch(e){
		chat(e)
	}
}