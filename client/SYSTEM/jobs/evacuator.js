mp.game.object.doorControl(1286535678,397.8851, -1607.386, 28.34166, false, 0.0, 50.0, 0);
mp.game.object.doorControl(2811495845,413.3649, -1620.036, 28.34509, false, 0.0, 50.0, 0);
mp.game.object.doorControl(2811495845,418.2896, -1651.396, 28.2951, false, 0.0, 50.0, 0);
let motorcycles = [1672195559,2179174271,2154536131,4180675781,3403504941,86520421,11251904,6774487,390201602,2006142190,2890830793,822018448,4267640610,2482017624,2920466844,4055125828,1790834270,2623969160,1753414259,2035069708,2452219115,55628203,3005788552,627535535,3537231886,741090084,1265391242,4039289119,301427732,4135840458,640818791,2771538552,3660088182,2688780135,884483972,2069146067,3385765638,1873600305,3401388520,2841686334,1491277511,3889340782,743478836,1836027715,4154065143,2941886209,3685342204,3676349299,3285698347,3724934023];
let mar = {
	type: 1,
	color:  [0,255,0,60],
	position: new mp.Vector3(409.539794921875,-1623.2257080078125,28.291940689086914),
	scale: 1.5
}
exports.position = mar.position;
mp.blips.new(446, mar.position,{
	name: 'Эвакуатор (Работа)',
    color: 0,
    dimension: 0,
	alpha: 255,
	shortRange: true,
})
let start = false;
let veh;
createMarker(mar,(m)=>{
	let menu = {
		name: 'Эвакуатор',
		exit_mar:m,
		items: [

		]
	}
	if(!start){
		menu.items.push({
			type: 1,
			name: 'Начать работу',
			callback_remote: 'EVACUATOR::START',
			placeholder: 'Начать работу'
		})
	}else{
		menu.items.push({
			type: 1,
			name: 'Закончить работу',
			callback_remote: 'EVACUATOR::FINISH_JOB',
			placeholder: 'Закончить работу'
		})
	}
	createmenuv(menu);
});
mar.position = new mp.Vector3(369.7660217285156,-1607.849609375,28.291940689086914);
let markerPayment = createMarker(mar,(m)=>{
	mp.events.callRemote('EVACUATOR::MENU_PAYMENT_LOAD')
});
let posEvacuation = new mp.Vector3(378.7218017578125,-1629.5399169921875,27.477806091308594);
let posEvacuationWaypoint = new mp.Vector3(395.3408203125,-1613.2747802734375,28.291940689086914);
let markerEvacuation;
mp.events.add({
	"EVACUATOR::START":()=>{
		start = true;
		seatparking(()=>{
			alert('Нажмите кнопку J для принятия вызовов')
		})
		parkingexit(()=>{
			alert('Вы не успели сесть в эвакуатор');
			mp.events.callRemote('EVACUATOR::FINISH_JOB')
		})
	},
	"EVACUATOR::CREATE_MARKER_VEH":()=>{
		mp.game.ui.setNewWaypoint(posEvacuationWaypoint.x,posEvacuationWaypoint.y);
		let check = {
			type: 4,
			color:  [198, 22, 22,175],
			scale: 4,
			position: new mp.Vector3(posEvacuation.x,posEvacuation.y,posEvacuation.z)
		}
		if(markerEvacuation)markerEvacuation.del();
		markerEvacuation = createCheckpoint(check,(checkx)=>{
			if(mp.game.invoke('0xEFEA18DCF10F8F75',player.parking.handle) === 0)return alert('Вы не прицепили машину')
			markerEvacuation = null;
			checkx.del();
			mp.events.callRemote('EVACUATOR::VEHICLE_EVACUATED')
		})
	},
	"EVACUATOR::TASK_MENU":(task)=>{
		task = JSON.parse(task);
		let tasks = [];
		task.forEach((veh)=>{
			let classVeh = mp.game.invoke('0xDEDF1C8BD47C2200', parseInt(veh.model));
			if(classVeh == 8 || classVeh == 13 || motorcycles.indexOf(veh.model) !== -1)return;
			let dist = mp.game.pathfind.calculateTravelDistanceBetweenPoints(player.position.x,player.position.y,player.position.z, veh.pos.x,veh.pos.y,veh.pos.z);
			tasks.push({
				type: 1,
				name: `Отвезти ${mp.game.ui.getLabelText(mp.game.vehicle.getDisplayNameFromVehicleModel(veh.model))}`,
				placeholder: `Расстояние до машины ${dist} км.`,
				callback: 'EVACUATOR::VEH_EVACUATE',
				callpointenct: veh.id
			})
		})
		let menu ={
			name: 'Эвакуатор',
			items:tasks
		}
		createmenuv(menu);
	},
	"EVACUATOR::MENU_PAYMENT":(vehicles)=>{
		vehicles = JSON.parse(vehicles);
		let menu = {
			name: 'Штраф стоянка',
			exit_mar:markerPayment.marker,
			items: vehicles.map((veh)=>{
				return{
					type: 1,
					name: `Штраф машины ${mp.game.ui.getLabelText(mp.game.vehicle.getDisplayNameFromVehicleModel(veh.model))}`,
					callpointenct: veh.id,
					placeholder: `Оплатит штраф 50$. Номер ${veh.numberPlate}`,
					callback: 'EVACUATOR::PAY_FINE',
				}
			})
		}
		createmenuv(menu);
	},

	"render": ()=>{
		try{
			if(!start)return
			let evacuateVeh = mp.game.invoke('0xEFEA18DCF10F8F75',player.parking.handle)
			if(evacuateVeh != 0 && (!veh || evacuateVeh != veh.handle)){
				player.parking.detachFromTowTruck(evacuateVeh);
			}
			if(!veh || evacuateVeh === veh.handle) return;
			let dist = mp.game.pathfind.calculateTravelDistanceBetweenPoints(player.position.x,player.position.y,player.position.z, veh.position.x,veh.position.y,veh.position.z);
			if(dist <= 100){
				let pos = veh.position;
				mp.game.graphics.drawMarker(
					2,
					pos.x, pos.y, pos.z + 2.7,
					0, 0, 0,
					0, 180, 0,
					1.0, 1.0, 1.0,
					200, 100, 0, 255,
					false, false, 2,
					true, "", "",false
					);
			}
		}catch(e){}
	},
	"EVACUATOR::STOP":()=>{
		veh = undefined;
		start = false;
		if(markerEvacuation)markerEvacuation.del();
	},
	"EVACUATOR::VEH":(vehEvacuator)=>{
		veh = vehEvacuator;
	}
})
mp.keys.bind(0x4A,false,function(){
	if(!start || player.vehicle != player.parking) return;
	let menu = {
		name: 'Эвакуатор',
		items: [
			{
				type: 1,
				name: 'Вызовы',
				callback: 'EVACUATOR::TASKS'
			},
			{
				type: 1,
				name: 'Поставить метку на вызов',
				callback: 'EVACUATOR::WAYPOINT'
			},
		]
	};
	createmenuv(menu);
})