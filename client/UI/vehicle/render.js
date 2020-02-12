let istrunk = false;
let isglovebox = false;
let hasVehJoin = false;
let isglovebox_name = '';
let dimensions = {};
let {addInteractionInventory,removeInteractionInventory} = require('../inventory/index.js');
let {browserHud} = require('../GUI/gui.js');
mp.events.add({
	"render":  () =>{
		try{
			if(!loggined) return;
			mp.vehicles.forEachInStreamRange((veh)=>{
				if(!veh)return;
				let radius = 1;
				if(veh.istrunk === undefined) veh.istrunk = false;
				let size;
				if(!dimensions[veh.model]){
					let sizing = mp.game.gameplay.getModelDimensions(veh.model);
					size = sizing.max.y - sizing.min.y;
					dimensions[veh.model] = size;
				}else{
					size = dimensions[veh.model];
				}
				let typeVeh = mp.game.invoke('0xDEDF1C8BD47C2200', veh.model)
				if(typeVeh == 14){
					radius = 3;
					size = size/2;
				}
				// model titan
				if(veh.model == 1981688531) size = size/2;
				let pos = veh.getOffsetFromInWorldCoords(0,-size/2,0);
				if(typeVeh == 14){
					pos.z += 1;
				}
				radius = radius*2;
				if(mp.Vector3.Distance(pos,player.position)<radius){
					// cargobob => 2025593404
					if(typeVeh == 14 || veh.model == 2025593404 || veh.getDoorAngleRatio(5)>0){
						if(!veh.istrunk && veh.getVariable('trunk')){
							addInteractionInventory(`${veh.remoteId}vehicle_trunk`,'Багажник '+veh.getNumberPlateText());
							veh.istrunk = true;
						}
					}
				}else{
					if(veh.istrunk){
						veh.istrunk=false;
						removeInteractionInventory(`${veh.remoteId}vehicle_trunk`);
					}
				}
			});
			if(player.vehicle) {
				//Бардачок
				if(isglovebox === false && player.vehicle.remoteId != null ){
					let maxSpeed = mp.game.vehicle.getVehicleModelMaxSpeed(player.vehicle.model);
					if( !!mp.storage.data.setting.maxSpeedVehicle && maxSpeed > mp.storage.data.setting.maxSpeedVehicle/3.6)player.vehicle.setMaxSpeed(mp.storage.data.setting.maxSpeedVehicle/3.6);
					//Скрыть мешок мусора
					if(player.getVariable('BagTrash'))player.getVariable('BagTrash').setVisible(false,true)
					let hasDriverSeat = isSeatVehicle(-1);
					if(hasDriverSeat){
						browserHud.execute(`hud.vehicleTips = true`)
					}
					if(hasDriverSeat || isSeatVehicle(0)){
						if(player.vehicle.getVariable('glove')){
							isglovebox_name = `${player.vehicle.remoteId}vehicle_glovebox`;
							addInteractionInventory(isglovebox_name,'Бардачок');
							isglovebox = true;
						}
						
					}
					if(hasDriverSeat &&
						mp.storage.data.setting.hud != false 
						&& mp.storage.data.setting.spedometr.active == true 
						){
							if(hasVehJoin == false){
								hasVehJoin = true;
							}
							if(mp.storage.data.setting.spedometr.type == 1)browser.execute(`speed.show(); ${player.vehicle.getVariable('systemPetrol') ? 'speed.showFuel()' : 'speed.hideFuel()'};`);
							else browserHud.execute(`hud.showSpeed = true`);
						}
				} 
			}else{
				if(player.getVariable('BagTrash'))player.getVariable('BagTrash').setVisible(true,true)
				if(isglovebox){
					//Показать мешок мусора
					removeInteractionInventory(isglovebox_name);
					isglovebox_name = '';
					isglovebox = false;
					
				} 
				if(hasVehJoin){
					hasVehJoin = false;
					if(mp.storage.data.setting.spedometr.type == 1)browser.execute('speed.hide();');
					else browserHud.execute(`hud.showSpeed = false`);
					browserHud.execute(`hud.vehicleTips = false`)
					closemenuv("VEHICLE::MENU");
				}
				let entity = LookingEntity;
				if(entity){
					if(entity.type == 'vehicle' && entity.remoteId != null){
						let veh = isOwnerVehicle(entity);
						if(veh == entity){
							let pos = veh.position;
							mp.game.graphics.drawText(`G`, [pos.x, pos.y,pos.z], {scale:[0.5, 0.5], color:[255, 255, 255, 255], font: 0});
						}
					}
				}
			}
		}catch(e){}
	},
	// "playerEnterVehicle":(vehicle)=>{
	// 	if(vehicle.getDoorLockStatus() != 1) return;
	// 	if(mp.storage.data.setting.hud != false && mp.storage.data.setting.spedometr.active == true && mp.storage.data.setting.spedometr.type == 1) browser.execute(`speed.show();speed.updateSpeedomet(null,0,${vehicle.getVariable('petrol')}),${vehicle.getVariable('MAX_PETROL')})`);
	// 	if(isglovebox === false && vehicle.remoteId != null ){
	// 		addinventoryright(`${vehicle.remoteId}vehicle_glovebox`,'Бардачок');
	// 		isglovebox = true;
	// 	}
	// },
	"playerLeaveVehicle":(vehicle)=>{
		if(isglovebox){
			closemenuv("VEHICLE::MENU");
			removeInteractionInventory(`${player.vehicle.remoteId}vehicle_glovebox`);
			isglovebox = false;
		} 
		browser.execute('speed.hide();');
	}
});