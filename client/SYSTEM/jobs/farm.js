const educationTasksList = require('../../UI/education/index');
let mar = {
	type: 1,
	color:  [0,255,0,60],
	position: new mp.Vector3(2016.5711669921875,4987.4697265625,41.10325241088867),
	scale: 1.5
}
exports.position = mar.position;
mp.blips.new(467, mar.position,{
	name: 'Ферма (Работа)',
	color: 2,
	dimension: 0,
	alpha: 255,
	shortRange: true,
})
let start = false;
let pos_warehouse = new mp.Vector3(2001.7203369140625,4976.7109375,40.63191604614258);
let CARRIER_check = null;
let CARRIER_timeout = null;
let CARRIER_load_timeout = null;
let SPROUTS_timeout = null;
let pos_start_veh = null;
let sporoutsCount = 0;
let totalSporoutsCount = 0;
let totalDeliverySporouts = 0;
let farmJob;
let products = require('../../../packages/configs/farm.json').produce;
createMarker(mar,(m)=>{
	let menu = {
		name: 'Ферма',
		exit_mar: m,
		items: []}
	if(start){
		menu.items.push({
				type: 1,
				name: 'Закончить работу',
				callback_remote: 'FARM::END_JOBS',
				placeholder: 'Закончить работу'
			})
	} 
	else menu.items.push(
		{
			type: 1,
			name: 'Сбор урожая',
			callback: 'FARM::START',
			placeholder: 'Сбор урожая',
			callpointenct: 0
		},
		{
			type: 1,
			name: 'Тракторист',
			callback: 'FARM::START',
			placeholder: 'Нужно 100 опыта',
			callpointenct: 1
		},
		{
			type: 1,
			name: 'Перевозчик',
			callback: 'FARM::START',
			placeholder: 'Нужно 200 опыта',
			callpointenct: 2
		})
	createmenuv(menu);
})
let checks = [
	new mp.Vector3(1991.2713623046875,4946.09228515625,42.45903396606445),
	new mp.Vector3(1962.7747802734375,4933.138671875,44.20443344116211),
	new mp.Vector3(1947.583984375,4745.87890625,41.720516204833984),
	new mp.Vector3(2042.876220703125,4791.1416015625,41.76750183105469),
	new mp.Vector3(2082.59423828125,4758.15185546875,41.75837707519531),
	new mp.Vector3(1887.322998046875,4945.1572265625,51.328956604003906),
	new mp.Vector3(1867.729248046875,4930.7802734375,48.13254928588867),
	new mp.Vector3(1833.75732421875,4907.85986328125,43.54877471923828),
	new mp.Vector3(1814.56396484375,4890.658203125,42.0301399230957),
	new mp.Vector3(1825.0557861328125,4856.00048828125,42.94563674926758),
	new mp.Vector3(2149.633544921875,4799.3720703125,41.21573257446289),
]
let markers_SPROUTS = [];
mp.events.add({
	"FARM::TRACTOR_RELOAD":()=>{
		start_tractor();
	},
	"FARM::TRACTOR_START":()=>{
		start = true;
		seatparking(()=>{
			if(farmJob != 1)return;
			pos_start_veh = player.parking.position;
			alert('Доедьте до точки')
			start_tractor();
		})
		parkingexit(()=>{
			alert('Вы не успели сесть в трактор');
			start = false;
			mp.events.callRemote('FARM::STOP')
		})
	},
	"FARM::TRACTOR_CLOSE":()=>{
		endrace();
		start = false;
	},
	"FARM::CLEAR_SPOROUT":()=>{
		sporoutsCount = 0;
	},
	"FARM::SPROUTS_START":(sprouts_mar)=>{
		if(farmJob != 0)return;
		start = true;
		let mar_spor = {
			type: 1,
			color:  [0,255,0,60],
			position: pos_warehouse,
			scale: 1.5
		}
		CARRIER_check = createMarker(mar_spor,(marc)=>{
			mp.events.callRemote('FARM::SPROUTS_ANBAR')
		}).marker;
		sprouts_mar = JSON.parse(sprouts_mar);
		mar_spor.color = [0,255,0,0];
		for(let i=0;i<sprouts_mar.length;i++){
			products.isgrow = sprouts_mar[i];
			if(sprouts_mar[i]){
				mar_spor.position = new mp.Vector3(products[i].pos.x,products[i].pos.y,products[i].pos.z);
				let m = createColshapeRadius(mar_spor,(marc)=>{
					if(SPROUTS_timeout)return;
					if(sporoutsCount > 4)return alert('В сумке не хватает места, отнесите овощи в амбар')
					mp.events.callRemote("FARM::SPROUTS_ANIM",marc.spor_id,marc.id)
				}).colshape
				m.spor_id = i;
				m.name = "капусту";
				markers_SPROUTS.push(m);
			}
		}
	},
	"FARM::SPROUTS_SBOR_ANIM":(id_mar)=>{
		let marc = mp.colshapes.at(id_mar);
		set_player_pos_at_position(marc.position,0.4)
		SPROUTS_timeout = setTimeout(()=>{
			mp.events.callRemote("FARM::SPROUTS_ANIM_STOP",marc.spor_id)
			sporoutsCount++;
			totalSporoutsCount++;
			alert('Вы собрали '+marc.name)
			markers_SPROUTS.splice(markers_SPROUTS.indexOf(marc),1);
			marc.del();
			SPROUTS_timeout = null;
			CARRIER_timeout = null;
		},3000)
	},
	"FARM::STOP":()=>{
		if(CARRIER_check)CARRIER_check.del();
		start = false;
		sporoutsCount = 0;
		totalSporoutsCount = 100

		if (totalSporoutsCount >= 100) {
			if (educationTasksList.getTask('giveOneHoundred')) educationTasksList.setTask('giveOneHoundred');
		}
	},
	"FARM::CARRIER_START":()=>{
		start = true;
		seatparking(()=>{
			if(farmJob != 2)return;
			pos_start_veh = player.parking.position;
			alert('Доедьте до точки чтобы загрузить машину ')
			CARRIER_LOAD();
		})
		parkingexit(()=>{
			alert('Вы не успели сесть в машину');
			start = false;
			mp.events.callRemote("FARM::STOP")
		})
	},
	"FARM::DEL_CHECK":()=>{
		if(CARRIER_check) CARRIER_check.del()
		for(let i=0;i<markers_SPROUTS.length;i++)markers_SPROUTS[i].del();
		markers_SPROUTS = [];
		start = false;
		sporoutsCount = 0;
		totalSporoutsCount = 0;
	},
	"FARM::CARRIER_MAGEZ":(pos)=>{
		pos = JSON.parse(pos)
		let check = {
			type: 4,
			color:  [198, 22, 22,175],
			scale: 6,
			position: pos
		}
		CARRIER_check.del();
		mp.game.ui.setNewWaypoint(pos.x,pos.y)
		CARRIER_check = createRouteMarker(check,(checkx)=>{
			alert('Подождите. Овощи разгружают')
			CARRIER_timeout = setTimeout(()=>{
				alert('Можете загрузится опять')
				checkx.del();
				mp.events.callRemote("FARM::CARRIER_SHOP_CHECK")
				++totalDeliverySporouts;
				totalDeliverySporouts = 5;
				if (totalDeliverySporouts >= 5) {
					if (educationTasksList.getTask('driveTruck')) educationTasksList.setTask('driveTruck');
				}
			},5000)
		},()=>{
			if(CARRIER_timeout) alert('Куда поехал!')
			clearTimeout(CARRIER_timeout);
			CARRIER_timeout = null
		}
		)
	},
	"FARM::CARRIER_ZAGRUZ":(pos)=>{
		CARRIER_load_timeout = setTimeout(()=>{
				mp.events.callRemote('FARM::CARRIER_GET_SHOP')
			},5000)
		alert('Ждите загрузки груза')
	},
	"FARM::SET_JOB":(job)=>{
		farmJob = job;
	},
	"FARM::CARRIER_RESTART":()=>{
		CARRIER_LOAD();
	}
})
function start_tractor() {
	let parking = player.parking
	startrace(checks,parking,()=>{
		mp.events.callRemote("FARM::TRACTOR_FINISH")
	})
	parkingexit(()=>{
		mp.events.callRemote("FARM::STOP")
		alert('Вы вышли из трактора',1)
		start = false;
		endrace();
	})
}
function CARRIER_LOAD() {
	mp.game.ui.setNewWaypoint(pos_warehouse.x,pos_warehouse.y)
	let check = {
		type: 4,
		color:  [198, 22, 22,175],
		scale: 6,
		position: pos_warehouse
	}
	CARRIER_check = createCheckpoint(check,(checkx)=>{
		if(player.vehicle != player.parking) return;
		mp.events.callRemote('FARM::CARRIER_GET_SPROUTS')
	},()=>{
		//если игрок выехал с чекпоинта и груз загружается
		if(CARRIER_load_timeout) alert('Куда поехал!')
		clearTimeout(CARRIER_load_timeout);
		CARRIER_load_timeout = null
	})
}
callback('FARM::TRACTOR_RETURN_BACK',()=>{
	alert('Поставьте трактор там где он стоял')
	mp.game.ui.setNewWaypoint(pos_start_veh.x,pos_start_veh.y)
	let check = {
		type: 4,
		color:  [198, 22, 22,175],
		scale: 6,
		position: pos_start_veh
	}
	CARRIER_check = createCheckpoint(check,(checkx)=>{
		checkx.del();
		mp.events.callRemote('FARM::TRACTOR_CLOSE')
	})
	pos_start_veh = null;

	if (educationTasksList.getTask('driveTractor')) educationTasksList.setTask('driveTractor');
})
callback('FARM::CARRIER_RETURN_BACK',()=>{
	alert('Поставте машину где она и стоял')
	mp.game.ui.setNewWaypoint(pos_start_veh.x,pos_start_veh.y)
	let check = {
		type: 4,
		color:  [198, 22, 22,175],
		scale: 6,
		position: pos_start_veh,
		vehicle_stop: true
	}
	CARRIER_check.del();
	pos_start_veh = null;
	CARRIER_check = createCheckpoint(check,(checkx)=>{
		checkx.del();
		mp.events.callRemote('FARM::CARRIER_CLOSE')
		start = false;
	})
})