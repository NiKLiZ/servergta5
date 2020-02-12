let signal1 = false;
let signal2 = false;
let signalx = false;
let SirenSound = false;

mp.keys.bind(0x32,true,function(){
	if(!loggined) return;
	if(!isGUIOpen())return;
	if(player.vehicle && isSeatVehicle(-1)){
		if(!player.vehicle.hire) openMenuvVeh(player.vehicle);
		else if(player.hire && player.hire == player.vehicle) openMenuvVeh(player.vehicle);
	}else{
		mp.vehicles.forEachInStreamRange(
			(vehicle, id) => {
				let veh = isOwnerVehicle(vehicle)
				if(!veh) return;
				if(mp.Vector3.Distance(veh.position,player.position)<20)return openMenuvVeh(veh);
			}
		);
		if(player.hire) if(mp.Vector3.Distance(player.hire,player.position)<20)return openMenuvVeh(veh);
	}
});


//b key 
mp.keys.bind(0x42, false, function() {
	if(!isGUIOpen() || !player.vehicle || !isSeatVehicle(-1) )return;
	mp.events.callRemote('VEHICLE::ENGINE_TOGGLE')
});

function getVehicleRadius(radius){
	let vehicle;
	mp.vehicles.forEachInStreamRange((veh)=>{
		if(mp.Vector3.Distance(veh.position,player.position) < radius && !!isOwnerVehicle(veh) && veh.dimension == player.dimension)
			vehicle = veh;
	});
	return vehicle;
}

// l key
mp.keys.bind(0x4C, false, function() {
	if(!isGUIOpen())return;
	let veh = player.vehicle && isSeatVehicle(-1) ? player.vehicle : getVehicleRadius(3);
	if(!veh)return
	mp.events.callRemote('VEHICLE::LOCKED_TOGGLE',veh.remoteId)
});

//right indicator 6key
mp.keys.bind(0x66, false, function() {
	let classVeh = mp.game.invoke('0xDEDF1C8BD47C2200', player.vehicle.model);
	//0.4 player.vehicle.getClass() исправить
	if(!isSeatVehicle(-1) || classVeh == 15 || classVeh == 16) return; 
	signal1 = !signal1;
	mp.events.callRemote('setIndicatorLights_one',signal1)
})
//Left indicator 4key
mp.keys.bind(0x64, false, function() { 
	let classVeh = mp.game.invoke('0xDEDF1C8BD47C2200', player.vehicle.model);
	if(!isSeatVehicle(-1) ||classVeh == 15 || classVeh == 16) return;
	signal2 = !signal2;
	mp.events.callRemote('setIndicatorLights_two',signal2)

})
//5 key
mp.keys.bind(0x65, false, function() { 
	let classVeh = mp.game.invoke('0xDEDF1C8BD47C2200', player.vehicle.model);
	//2971866336 модель эвакуатора
	if(!isSeatVehicle(-1) || classVeh == 15 || classVeh == 16 || player.vehicle.model == 2971866336) return;
	signalx = !signalx;
	mp.events.callRemote('setIndicatorLightsAll',signalx)
	alert(`Аварийная кнопка ${signalx == true?'Вкл':'Выкл'}`)
});
//0 key
mp.keys.bind(0x60, false, function() { 
	if(!isSeatVehicle(-1) /*|| mp.game.invoke('0xDEDF1C8BD47C2200', player.vehicle.model) != 17 0.4*/) return;
	SirenSound = !SirenSound;
	mp.events.callRemote('setSirenSound',SirenSound)
	alert(`Сирена ${SirenSound == true?'Вкл':'Выкл'}`)
})
// Круговое меню

mp.events.add({
	 "opendors":(data)=>{
	 		mp.events.callRemote('opendor',"0|"+data)
	 		mp.events.callRemote('opendor',"1|"+data)
	 },
	 "DownG":()=>{
			if(!loggined) return;
			if(!player.vehicle){
				let entity = LookingEntity;
				if (entity){
					if(entity.type == 'vehicle' && entity.remoteId != null){
						let veh = isOwnerVehicle(entity);
						if(veh && veh == entity ) createRadialVeh(veh);
						if(player.hire && entity == player.hire) createRadialVeh(player.hire);
					}
				}
			}
			else createRadialVeh(player.vehicle)
	 },
	 "PressG":()=>{
	 		if(!loggined) return;
			hideRadialGUI();
	 },
	 "VEHICLE::DETACH_TOW_TRUCK":(id)=>{
		vehTowTruck = mp.vehicles.atRemoteId(id);
		vehTowTruck.detachFromTowTruck(mp.game.invoke('0xEFEA18DCF10F8F75',vehTowTruck.handle));
	 }
})

let  createRadialVeh = (veh)=>{
	let menu = [
		{
			icon: 'trunk-open',
			name: `${veh.getDoorAngleRatio(5)>0?'<font color="red">Закрыть</font>':'<font color="green">Открыть</font>'} багажник`,
			callremote: 'opendor',
			data: '5|'+veh.remoteId,
		},
		{
			icon: 'hood-open',
			name: `${veh.getDoorAngleRatio(4)>0?'<font color="red">Закрыть</font>':'<font color="green">Открыть</font>'} капот`,
			callremote: 'opendor',
			data: '4|'+veh.remoteId,
		},
		{
			icon: 'door-key',
			name: `Дверь <br /> ${veh.getDoorLockStatus()== 1 ? '<font color="red">Закрыть</font>': '<font color="green">Открыть</font>'}`,
			callremote: 'vehlocked',
			data: ''+veh.remoteId,
		},
		{
			icon: 'car',
			name: `${veh.getDoorAngleRatio(1)>0?'Закрыть':'Открыть'} двери`,
			callback: "opendors",
			data: ''+veh.remoteId,
		},
	];
	updateRadialGUI(menu)
	showRadialGUI()
}
let openMenuvVeh = (veh)=>{
				let menu = {
				name: 'Ключи от машины',
				exitmenu: 'VEHICLE::MENU',
				items: []
			}
				menu.items.push({
						type: 6,
						name: 'Закрытые двери',
						checked: veh.getDoorLockStatus()== 1 ? false : true,
						callback: 'vehlocked',
						callpointenct: ''+veh.remoteId,
						placeholder: 'Закрыть машину'
					});
				if(player.vehicle.getVariable('systemPetrol'))menu.items.push({
						type: 6,
						name: 'Двигатель',
						checked: veh.getIsEngineRunning() != 1 ? false : true,
						callback: 'vehengine',
						callpointenct: ''+veh.remoteId,
						placeholder: 'Двигатель'
					});
				let doors = {
					name: 'Тумблер дверей',
					items:[{
						type: 0,
						name: 'Открыть/Закрыть багажник',
						callback: 'opendor',
						callpointenct: '5|'+veh.remoteId,
						placeholder: 'Открыть/Закрыть багажник'
					},
					{
						type: 0,
						name: 'Открыть/Закрыть капот',
						callback: 'opendor',
						callpointenct: '4|'+veh.remoteId,
						placeholder: 'Открыть/Закрыть капот'
					},
					{
						type: 0,
						name: 'Открыть/Закрыть левую дверь',
						callback: 'opendor',
						callpointenct: '0|'+veh.remoteId,
						placeholder: 'Открыть/Закрыть левую дверь'
					},
					{
						type: 0,
						name: 'Открыть/Закрыть правую дверь',
						callback: 'opendor',
						callpointenct: '1|'+veh.remoteId,
						placeholder: 'Открыть/Закрыть правую дверь'
					},
					]};
					menu.items.push({
						type: 2,
						name: 'Тумблер дверей',
						placeholder: 'Открытие и закрытие дверей',
						infomenu: doors
				})
			createmenuv(menu);
}