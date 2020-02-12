const educationTasksList = require('../../UI/education/index');
let mar = {
	type: 1,
	color:  [0,255,0,60],
	position: new mp.Vector3(90.81661987304688,298.2567138671875,109.21023559570312),
	scale: 1.5
}
let start = false;
let blip;
exports.position = mar.position;
let blipJob = mp.blips.new(568, mar.position,{
	name: 'Развозчик пиццы (Работа)',
	color: 46,
	dimension: 0,
	shortRange: true,
  	alpha: 255
})
createMarker(mar,(m)=>{
	let menu = {
		name: 'Пиццерия',
		exit_mar: m,
		items: [

		]
	};
	if(start) menu.items.push({
				type: 1,
				name: 'Закончить работу',
				callback: 'PIZZA::STOP',
				placeholder: 'Закончить работу'
			},
			{
				type: 1,
				name: 'Взять заказ',
				callback: 'PIZZA::GET_HOME',
				placeholder: 'Взять заказ'
			})
	else menu.items.push({
				type: 1,
				name: 'Начать работу',
				callback: 'PIZZA::START',
				placeholder: 'Начать работу'
			})
	createmenuv(menu);
	mp.events.callRemote("PIZZA::GET_HOME");
		
})
mp.events.add({
	"PIZZA::START":()=>{
		start = true;
		seatparking(()=>{
			if(!start)return;
			alert('Довезите пиццу до дома')
		})
		parkingexit(()=>{
			alert('Вы не успели сесть на скутер');
			mp.events.callRemote('menuvcalback','PIZZA::STOP','[]')
		})
	},
	"PIZZA::CREATE_BLIP":(pos)=>{
		pos = JSON.parse(pos);
		if(blip){
			blip.destroy();
			blip = null;
		}
		blip = mp.blips.new(40, pos,{
			name: 'Дом (доставьте пиццу)',
			color: 38,
			dimension: 0,
			shortRange: true,
			alpha: 255
		})
		blip.setRoute(true);
	},
	"PIZZA::STOP":(count)=>{
		start = false;
		if(blip){
			blip.destroy();
			blip = null;
		}
		blipJob.setRoute(false);

		if (count >= 5) {
			if (educationTasksList.getTask('givePizza')) educationTasksList.setTask('givePizza');
		}
	},
	"PIZZA::DESTROY_BLIP":()=>{
		if(blip){
			blip.destroy();
			blip = null;
		}
		blipJob.setRoute(true);
	}
})
