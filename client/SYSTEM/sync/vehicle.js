let activateNitro = false;
let exhausts = ["exhaust", "exhaust_2", "exhaust_4", "exhaust_5", "exhaust_6", "exhaust_7"];

mp.game.streaming.requestNamedPtfxAsset("veh_xs_vehicle_mods");

mp.events.add({
	"entityStreamIn": (entity) => {
		if (entity.type !== "vehicle") return;
		entity.setIndicatorLights(0,!!entity.getVariable('IndicatorLights_one'));
		entity.setIndicatorLights(1,!!entity.getVariable('IndicatorLights_one'));
		entity.setSirenSound(!!entity.getVariable('SirenSound'));
		entity.setEngineOn(!!entity.getVariable('Undriveable'), true, false);
		entity.setUndriveable(!entity.getVariable('Undriveable'));
		try{
			door_veh(entity,JSON.parse(entity.getVariable('doors')))
		}catch(e){

		}
		try{
			let tuning = JSON.parse(entity.getVariable('tuning'))
			tuning_veh(entity,tuning);
		}catch(e){

		}
		setHeadlightsColor(entity, parseInt(entity.getVariable("headlightColor")));
		entity.setExtraColours(entity.getVariable('extra') || 0,entity.getVariable('extraWheel') || 0);
	},
	"entityStreamOut":(entity)=>{
		if (entity.type != "vehicle") return;
		entity.tuning = undefined;
		entity.doors = undefined;
	},
    "VEHICLE::RESET_TUNE":()=>{
		mp.vehicles.forEachInStreamRange((veh)=>{
			veh.tuning = new Array(70).fill(-1);
			let tuning = JSON.parse(veh.getVariable('tuning') || '[]')
			tuning_veh(veh,tuning);
		});
    }
	// "render":()=>{
	// 	if (mp.game.controls.isControlPressed(0, 73) && player.vehicle) {
	// 		if (!activateNitro && player.vehicle.nosAmount > 0.1) {
	// 			toggleNitro(true);
	// 		}
	// 	}
	// 	if(activateNitro && !mp.game.controls.isControlPressed(0, 73)){
	// 		toggleNitro(false);
	// 	}
	// 	if (player.vehicle && player.vehicle.nosAmount < 0.1) {
	// 		toggleNitro(false);
	// 	}
	// 	mp.vehicles.forEachInStreamRange((veh)=>{
	// 		if(veh && veh.handle != 0 &&  veh.getVariable('nitro') == true){
	// 			try {
	// 				if (mp.game.streaming.hasNamedPtfxAssetLoaded("veh_xs_vehicle_mods")) {
	// 					let heading = veh.getHeading();
	// 					let pitch = veh.getPitch();
	// 					exhausts.forEach((element) => {
	// 						let boneIndex = mp.game.invoke('0x4F9AEAB2CC029A5C', veh.handle, element); // GET_ENTITY_BONE_INDEX_BY_NAME
	// 						if (boneIndex >= 0) {
	// 							let boneCoords = veh.getWorldPositionOfBone(boneIndex);
	// 							mp.game.graphics.setPtfxAssetNextCall("veh_xs_vehicle_mods");
	// 							mp.game.graphics.startParticleFxNonLoopedAtCoord("veh_nitrous", boneCoords.x, boneCoords.y, boneCoords.z,
	// 								0, pitch, heading - 89, 1.0, false, false, false);
	// 						}
	// 					});
	// 				} else {
	// 					mp.game.streaming.requestNamedPtfxAsset("veh_xs_vehicle_mods");
	// 				}
	// 			} catch (e) {
	// 				mp.gui.chat.push(e.toString());
	// 			}
	// 		}
	// 	})
	// }
});
mp.events.addDataHandler({
	"IndicatorLights_one": (entity, value) =>{
		entity.setIndicatorLights(0,value );
	},
	"IndicatorLights_two": (entity, value)=>{
		entity.setIndicatorLights(1,value );
	},
	"SirenSound":(entity, value)=>{
		entity.setSirenSound(value );
	},
	"Undriveable":(entity, value)=>{
		entity.setEngineOn(value, true, false);
		entity.setUndriveable(!value);
	},
	"doors":(entity, value)=>{
		try{
			let doors = JSON.parse(entity.getVariable('doors'))
			door_veh(entity,doors);
		}catch(e){

		}
	},
	"tuning":(entity, value)=>{
		try{
			// if(entity.model == mp.game.joaat('rcbandito')) entity.setModKit(1);
			let tuning = JSON.parse(entity.getVariable('tuning'))
			tuning_veh(entity,tuning);
		}catch(e){

		}
	},
	"headlightColor": (entity, value) => {
		if (entity.type === "vehicle") setHeadlightsColor(entity, value);
	},
	"extra": (entity, value) => {
		if (entity.type === "vehicle")  entity.setExtraColours(entity.getVariable('extra') || 0,entity.getVariable('extraWheel') || 0);
	},
	"extraWheel": (entity, value) => {
		if (entity.type === "vehicle")  entity.setExtraColours(entity.getVariable('extra') || 0,entity.getVariable('extraWheel') || 0);
	},
	"nitro":()=>{
	}
});

function door_veh(veh,doors) {
	if(!veh.doors){
		veh.doors = [0,0,0,0,0,0,0,0];
	}
	for(let i =0;i<doors.length;i++){
		if(veh.doors[i] != doors[i]){
			veh.doors[i] = doors[i];
			veh.setDoorControl(i,5, doors[i]);
			if(doors[i]==0) veh.setDoorShut(i, false);
		}
	}
}

function tuning_veh(veh,tuning) {
	if(!veh.tuning){
		veh.tuning = new Array(70).fill(-1);
	}
	for(let i =0;i<tuning.length;i++){
		if(veh.tuning[i] != tuning[i]){
			veh.tuning[i] = tuning[i];
			veh.setMod(i,tuning[i]);
		}
	}
}
let curent_waypoint = new mp.Vector3();
setInterval(function(){
	radio_sync();
	if(player.vehicle){
		let way = getWaypointPosition();
		if(way && way.x != curent_waypoint.x){
			curent_waypoint = way;
			mp.events.callRemote('waypoint',JSON.stringify(way))
		}
	}
},1000);


function radio_sync() {
	if(player.vehicle){
		let radio_index = 0;
		if(player.vehicle.getVariable('radio') != null) radio_index = player.vehicle.getVariable('radio');

		if (player.vehicle && player.vehicle.getPedInSeat(-1) === player.handle){ // Check if player is in vehicle and is driver
			if(radio_index != mp.game.invoke("0xE8AF77C4C06ADC93")){
				radio_index = mp.game.invoke("0xE8AF77C4C06ADC93");
				mp.events.callRemote('radiochange', radio_index);
			}
		}else{
			if(radio_index == 255){
				mp.game.audio.setRadioToStationName("OFF");
			}else{
				mp.game.invoke("0xF7F26C6E9CC9EBB8", true);
				mp.game.invoke("0xA619B168B8A8570F ", radio_index);
			}
			
		}
	}
};

global.setHeadlightsColor = (vehicle, color)=>{
    if (typeof color !== "number" || isNaN(color) || color < 0 || color === 255) {
        // Disable
        vehicle.toggleMod(22, false);
        mp.game.invoke("0xE41033B25D003A07", vehicle.handle, 255);
    } else {
        // Enable
        vehicle.toggleMod(22, true);
        mp.game.invoke("0xE41033B25D003A07", vehicle.handle, color);
    }
}

function toggleNitro(state) {
    if (state) {
        activateNitro = true;
        mp.events.callRemote("NITRO_START");
    } else {
        activateNitro = false;
        mp.events.callRemote("NITRO_STOP");
    }
};