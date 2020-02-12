let mar = {
	type: 1,
	color:  [0,255,0,60],
	position: new mp.Vector3(-774.5216064453125,-2632.742919921875,12.94449234008789),
	scale: 1.5
}
let start = false;
let markerTaskSignal;
let checkMission;

let blipOrder;
exports.position = mar.position;

mp.blips.new(477, mar.position,{
	name: 'Дальнобойщик (Работа)',
    color: 0,
    dimension: 0,
	alpha: 255,
	shortRange: true,
})
createMarker(mar,(m)=>{
	let menu = {
		name: 'Дальнобойщик',
		exit_mar:m,
		items: [

		]
	}
	if(!start){
		menu.items.push({
			type: 1,
			name: 'Арендовать грузовик Packer',
			callback: 'TRUCKER::START',
			placeholder: 'Арендовать грузовик за 20$',
			callpointenct: 1
		})
		menu.items.push({
			type: 1,
			name: 'Арендовать грузовик Phantom',
			callback: 'TRUCKER::START',
			placeholder: 'Арендовать грузовик за 40$',
			callpointenct: 2
			
		}) 
		menu.items.push({
			type: 1,
			name: 'Арендовать грузовик Phantom заказной',
			callback: 'TRUCKER::START',
			placeholder: 'Арендовать грузовик за 60$',
			callpointenct: 3
		})
	}else{
		menu.items.push({
			type: 1,
			name: 'Закончить работу',
			callback_remote: 'TRUCKER::FINISH_JOB',
			placeholder: 'Закончить работу'
		})
	}
	createmenuv(menu);
});

let trunck;

mp.events.add({
	"TRUCKER::START":()=>{
		start = true;
		seatparking(()=>{
			alert('Нажмите кнопку J для принятия заказов');
		})
		parkingexit(()=>{
			alert('Вы не успели сесть в грузовик');
			mp.events.callRemote('TRUCKER::FINISH_JOB')
		})
	},
	"TRUCKER::TASKS":(orders)=>{
		orders = JSON.parse(orders)
		let menuCars = {
			name: 'Автосалон',
			items: orders.map((order)=>{
				let menu = {
					name: `Отвезти ${order.model} за ${order.price}$`,
					type: 2,
					infomenu: {
						name: `${order.model}`,
						items: [
							{
								type:1 ,
								name: 'Принять',
								placeholder: `Отвезти ${order.model} за ${order.price}$`,
								callback: 'TRUCKER::START_TASK',
								callpointenct: [order.bizId,order.id],
							},
							{
								type: 1,
								name: 'Отказаться'
							}
						]
					}
				}
				return menu;
			}) 
		}
		let menu = {
			name: 'Дальнобойщик',
			items: [
				{
					name: 'Автосалон',
					type: 2,
					infomenu: menuCars
				},
				// {
				// 	name: 'Заправка',
				// 	placeholder: 'Отвезти 1500 единиц товара за 600$',
				// 	type: 2,
				// 	infomenu: {
				// 		name: 'Заправка',
				// 		items: [
				// 			{
				// 				type:1 ,
				// 				name: 'Принять',
				// 				placeholder: 'Отвезти 1500 единиц товара за 600$',
				// 				callback: 'TRUCKER::START_TASK',
				// 				callpointenct: 0,
				// 			},
				// 			{
				// 				type: 1,
				// 				name: 'Отказаться'
				// 			}
				// 		]
				// 	}
				// },
				// {
				// 	name: 'Магазин одежды',
				// 	placeholder: 'Отвезти 1500 единиц товара за 600$',
				// 	type: 2,
				// 	infomenu: {
				// 		name: 'Магазин одежды',
				// 		items: [
				// 			{
				// 				type:1 ,
				// 				name: 'Принять',
				// 				placeholder: 'Отвезти 1500 единиц товара за 600$',
				// 				callback: 'TRUCKER::START_TASK',
				// 				callpointenct: 1,
				// 			},
				// 			{
				// 				type: 1,
				// 				name: 'Отказаться'
				// 			}
				// 		]
				// 	}
				// },
				// {
				// 	name: 'Магазин 24/7',
				// 	placeholder: 'Отвезти 1500 единиц товара за 600$',
				// 	type: 2,
				// 	infomenu: {
				// 		name: 'Магазин одежды',
				// 		items: [
				// 			{
				// 				type:1 ,
				// 				name: 'Принять',
				// 				placeholder: 'Отвезти 1500 единиц товара за 600$',
				// 				callback: 'TRUCKER::START_TASK',
				// 				callpointenct: 2,
				// 			},
				// 			{
				// 				type: 1,
				// 				name: 'Отказаться'
				// 			}
				// 		]
				// 	}
				// },
			]
		}
		createmenuv(menu);
	},
	"TRUCKER::START_TASK_SIGNAL":(pos)=>{
		if(markerTaskSignal)markerTaskSignal.del();
		pos = JSON.parse(pos);
		mp.game.ui.setNewWaypoint(pos.x,pos.y);
		alert('Доедьте до точки');
		let check = {
			type: 4,
			color:  [198, 22, 22,175],
			scale: 4,
			position: pos
		}
		markerTaskSignal = createRouteMarker(check,(checkx)=>{
			mp.events.callRemote('TRUNCKER::OPEN_MENU')
		},()=>{
			closemenuv('TRUCKER::MENU');
		})
	},
	"TRUCKER::END":()=>{
		if(markerTaskSignal)markerTaskSignal.del();
		if(checkMission)checkMission.del();
		if(blipOrder)blipOrder.destroy();
		start = false;
	},
	"TRUCKER::DESTROY_TASK_SIGNAL":()=>{
		if(markerTaskSignal)markerTaskSignal.del();
	},
	"TRUNCKER::OPEN_MENU":(money)=>{
		let menu = {
			name: 'Дальнобойщик',
			exitmenu: 'TRUCKER::MENU',
			items: [
				{
					type: 1,
					name: 'Купить',
					callback: 'TRUCKER::SIGNAL_ACCEPT',
					placeholder: 'Цена груза '+money
				},
				{
					type: 1,
					name: 'Отказаться',
					callback: 'TRUCKER::SIGNAL_CLOSE'
				},
			]
		}
		createmenuv(menu)
	},
	"TRUCKER::START_MISSION":(pos)=>{
		if(checkMission)checkMission.del();
		pos = JSON.parse(pos);
		blipOrder = mp.blips.new(477, pos,{
			name: 'Точка доставки груза',
			color: 1,
			dimension: 0,
			alpha: 255,
			shortRange: true,
		})
		blipOrder.setRoute(true);
		let check = {
			type: 4,
			color:  [198, 22, 22,175],
			scale: 10,
			position: pos
		}
		alert('Довезите груз на точку')
		checkMission = createRouteMarker(check,(shape)=>{
			if(!player.vehicle || player.vehicle != player.parking)return alert('Вы не сидите в грузовике')
			if(player.vehicle.getTrailer(0) === 0)return alert('Вы не прицепили груз')
			shape.del();
			blipOrder.destroy();
			mp.events.callRemote('TRUNCKER::END_MISSION')
		})
	},
	
});


mp.keys.bind(0x4A,false,function(){
	if(!start || player.vehicle != player.parking) return;
	mp.events.callRemote('TRUCKER::TASKS')
})