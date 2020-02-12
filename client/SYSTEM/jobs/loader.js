const educationTasksList = require('../../UI/education/index');
let complete = false;
let colshape = {
	position: new mp.Vector3(500.5186462402344,-648.90087890625,24.75115394592285),
	scale: 2
}
mp.peds.new(mp.game.joaat('g_m_y_korean_02'),colshape.position, 260);

let markerTake = {
	type: 1,
	color:  [0,255,0,60],
	position: new mp.Vector3(501.4201354980469,-637.7301025390625,23.835050582885742),
	scale: 1.5
}
let markerLay = {
	type: 1,
	color:  [0,255,0,60],
	position: new mp.Vector3(512.8154296875,-557.1165161132812,24.930164337158203),
	scale: 1.5
}
let marTake;
let marLay;

let start = false;
exports.position = colshape.position;
mp.blips.new(478, colshape.position,{
	name: 'Грузчик (Работа)',
	color: 21,
	dimension: 0,
	shortRange: true,
  	alpha: 255
})
createColshapeRadius(colshape,(m)=>{
	let menu = {
		name: 'Грузчик ',
		exit_cols: m,
		items: [

		]
	};
	if(start) menu.items.push({
				type: 1,
				name: 'Закончить работу',
				callback: 'LOADER::STOP',
				placeholder: 'Закончить работу'
			})
	else menu.items.push({
				type: 1,
				name: 'Начать работу',
				callback: 'LOADER::START',
				placeholder: 'Начать работу'
			})
	createmenuv(menu);
	mp.events.callRemote("LOADER::GET_HOME");
		
})
mp.events.add({
	"LOADER::START":()=>{
		start = true;
		mp.events.call("LOADER::CREATE_TAKE_BOX");
	},
	"LOADER::STOP":()=>{
		start = false;
		if(marTake && marTake.marker)marTake.marker.del();
		if(marLay && marLay.marker)marLay.marker.del();

		if (educationTasksList.getTask('gruzJob')) {
			if (!complete) {
				complete = true;
				return educationTasksList.setFirstComplete();
			}
		}
	},
	"LOADER::CREATE_TAKE_BOX":()=>{
		mp.game.ui.setNewWaypoint(markerTake.position.x,markerTake.position.y);
		marTake = createMarker(markerTake,(m)=>{
			mp.events.callRemote('LOADER::TAKE_BOX')
			m.del();
		});
	},
	"LOADER::LAY_TAKE_BOX":()=>{
		mp.game.ui.setNewWaypoint(markerLay.position.x,markerLay.position.y);
		marLay = createMarker(markerLay,(m)=>{
			mp.events.callRemote('LOADER::LAY_BOX')
			m.del();
		});
	}
})
