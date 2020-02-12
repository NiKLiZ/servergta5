let {getNickName} = require('../../UI/GUI/chat.js'); 
let END_JOB_TAXI = false;
let start = false;
let mar = {
	type: 1,
	color:  [0,255,0,60],
	position: new mp.Vector3(895.3720092773438,-179.44007873535156,73.7052993774414),
	scale: 1.5
}
exports.position = mar.position;
mp.blips.new(198, mar.position,{
	name: 'Такси (Работа)',
	color: 81,
	dimension: 0,
	shortRange: true,
  alpha: 255
})
let pos_seat_taxi = null;
createMarker(mar,(m)=>{  
	let menu = {
		name: 'Такси',
		exit_mar: m,
		items: []}
	if(start){
		menu.items.push({
				type: 1,
				name: 'Закончить работу',
				callback_remote: 'TAXI::STOP',
				placeholder: 'Закончить работу'
			})
	} 
	else menu.items.push({
				type: 1,
				name: 'Начать работу',
				callback_remote: 'TAXI::START',
				placeholder: 'Начать работу'
			})
	createmenuv(menu);
})
let open_ordes = false;
let orders = [];
mp.events.add({
	"TAXI::CLOSE_ORDER":(orders)=>{
		open_ordes = false;
	},
	"TAXI::OPEN_ORDER":(orders)=>{
		orders = JSON.parse(orders);
		open_ordes = true;
		let menu = {
			name: 'Вызовы',
			items: [],
			exitmenu_callback: 'TAXI::CLOSE_ORDER',
		}
		for(let i=0;i<orders.length;i++){
			let order = mp.players.atRemoteId(orders[i])
			menu.items.push(getItemPl(order));
		}
		createmenuv(menu);
	},
	"TAXI::ADD_ORDER":  (id)=> {
		if(!start || player.vehicle != player.parking) return;
		let pl = mp.players.atRemoteId(id);
		orders.push(id);
		let Distance = parseInt(mp.Vector3.Distance(player.position,pl.position));
		if(open_ordes){
			additemMenuv(getItemPl(pl));
		}else alert(`[ВЫЗОВ] от ${getNickName(pl)}. Расстояние: ${Distance}м. Нажмите для выбора заказа J`)
	},
	"TAXI::REMOVE_ORDER":  (id)=> {
		if(!start || player.vehicle != player.parking) return;
		if(!open_ordes) return;
		let index = orders.indexOf(id)
		if(index != -1){
			delitemsMenuv(index)
			orders.splice(index,1)
		} 
	},
	"TAXI::START":()=>{
		start = true;
		seatparking(()=>{
			if(!start)return;
			pos_seat_taxi = player.parking.position;
			alert('Нажмите кнопку J для принятия заказов')
		})
		parkingexit(()=>{
			alert('Вы не успели сесть в такси');
			mp.events.callRemote('TAXI::STOP')
		})
	},
	"TAXI::STOP":()=>{
		start = false;
	}
})
let price = 2;
let prices = ['20','50','100','200']
//menu

let currentStyle = 0;
//j
mp.keys.bind(0x4A,false,function(){
	if(!start || player.vehicle != player.parking) return;
	if(END_JOB_TAXI) return alert('Вы закончили работу сдайте машину')
	let menu = {
		name: 'Такси',
		items: [
			{
				type: 4,
				name: 'Выдать чек на',
				callback: 'TAXI::PRICE',
				swith: prices,
				// index: price,
				placeholder: 'Нажми enter для утверждения заказа'
			},
			{
				type: 0,
				name: 'Вызовы',
				callback: 'TAXI::TASKS'
			},
			{
				type: 1,
				name: 'Закончить работу',
				callback: 'TAXI::END_JOB'
			},
		]
	};
	createmenuv(menu);
});
let getItemPl = function(pl) {
	let dist = parseInt(mp.Vector3.Distance(player.position,pl.position));
	return {
		type: 1,
		name: 'Вызов от '+(getNickName(pl)),
		callback: 'TAXI::ACCEPT',
		callpointenct: ''+pl.remoteId,
		placeholder: 'Дистанция '+dist
	}
}

callback('TAXI::END_JOB',()=>{
	if(END_JOB_TAXI) return;
 	alert('Поставте машину туда где она ранее стояла')
	END_JOB_TAXI = true
	let check = {
		type: 4,
		color:  [198, 22, 22,175],
		scale: 4,
		position: pos_seat_taxi,
		vehicle_stop: true
	}
	mp.game.ui.setNewWaypoint(pos_seat_taxi.x,pos_seat_taxi.y)
	CARRIER_check = createCheckpoint(check,(checkx)=>{
		END_JOB_TAXI = false;
		checkx.del();
		mp.events.callRemote('TAXI::STOP')
		start = false;
	})
})