let parking = require('../parking/class.js');
let vehs = mp.configs.taxi.vehs;
let park = new parking(vehs,{
	taxi: true,
	lock: false,
});
let taxist = [];
let orders = [];

mp.events.push({
	"TAXI::START": (player)=>{
		if(!player.isWorkUp()) return;
		if(!player.testRightDrive())return ;
		if(!player.testLicense('deliveryPassengers'))
			return player.alert('Для работы таксистом необходимо приобрести лицензию на развоз пассажиров')
		if(player.taxi == true) return player.alert('Вы уже начали работу таксистом')
		let veh = park.targetVeh(player);
		if(veh){
			player.alert('Сядьте в автомобиль на который указывает стрелка');
			player.taxi = true;
			player.call('TAXI::START')
			taxist.push(player);
		}	
		else player.alert('Все машины заняты ')
	},
	"TAXI::STOP":(player)=>{
		player.taxi = false;
		taxist.splice(taxist.indexOf(player),1)
		player.clearParking()
		player.alert('Вы закончили рабочий день')
		player.call('TAXI::STOP')
	}
})
mp.calbackmenuv('TAXI::TASKS',(player,array)=>{

	if(orders.length == 0) return player.alert('Сейчас нет заказов');
	let items = [];
	for(let i=0;i< orders.length;i++){
		items.push(orders[i].id)
	}
	player.call('TAXI::OPEN_ORDER',[JSON.stringify(items)])
})
mp.calbackmenuv('TAXI::ACCEPT',(player,array)=>{
	let client = mp.players.at(parseInt(array[0]))
	if(!client) return player.alert('Игрок вышел с сервера');
	if(client.status_taxi == 2) return player.alert('Другой таксист уже взял заказ')
	for(let i=0;i< taxist.length;i++){
		taxist[i].call('TAXI::REMOVE_ORDER',[client.id])
	}
	orders.splice(orders.indexOf(client),1)
	client.status_taxi = 0;
	player.taxi_client = client.id;
	client.taxi_driver = player.id;
	client.alert(`Игрок ${player.name}[${player.id}] уже едет к вам, ожидайте`);
	player.setNewWaypoint(client.position)
	player.alert('Заказ принят')
})
let prices = ['20','50','100','200']
mp.calbackmenuv('TAXI::PRICE',(player,array)=>{
	if(!player.taxi || player.vehicle !== player.parking) return;
	let players = player.vehicle.getPlayers();
	let money = prices[parseInt(array[0])]
	let menu = {
			name: 'Такси',
			items: [
				{
					type: 1,
					name: 'Принять',
					callback: 'TAXI::START',
					placeholder: 'Цена за поездку '+money,
					callpointenct: money

				},
				{
					type: 1,
					name: 'Отклонить',
					callback: 'TAXI::REJECT',
					placeholder: 'Цена за поездку '+money
				}
			]
	}
	player.alert('Вы выдали чек за поездку')
	players.forEach((pl)=>{
		if(pl !== player){
			pl.status_taxi = 0;
			pl.createmenuv(menu)
		}
	})
})
mp.calbackmenuv('TAXI::START',(player,array)=>{

	if(!player.vehicle.taxi === true) return player.alert('Вы не сидите в такси')
	let taxi = player.vehicle.getPlayers(-1);
	if(taxi === null) player.alert('Таксиста нет в машине');
	let money = parseInt(array[0])
	player.status_taxi = 0;
	if(taxi && taxi !== player){
		if(player.editMoney(-money, 'Поездка на такси')){
			taxi.editmoneyCash(money,'Поездка на такси ');
		}
	}
})
mp.calbackmenuv('TAXI::REJECT',(player,array)=>{
	
	if(!player.vehicle.taxi === true) return player.alert('Вы не сидите в такси')
	let taxi = player.vehicle.getPlayers(-1);
	if(taxi === null) player.alert('Таксиста нет в машине');
	if(taxi && taxi !== player){
		taxi.alert('Игрок отклонил такси')
		player.alert('Вы отклонили такси')
	}
})

mp.events.push('TAXI::CALL', (player) => {
	
	if (player.status_taxi == 2) return player.alert('Такси уже выехало за вами!');

	if (player.status_taxi == 1) return player.alert('Вы уже вызвали такси!');

	if (taxist.length == 0) return player.alert(`В штате нет свободных таксистов!`);

	orders.push(player)
	player.alert('Вы вызвали такси, ожидайте когда вызов примут! Таксистов в штате: '+taxist.length);
	player.status_taxi = 1; 
	for(let i=0;i< taxist.length;i++){
		taxist[i].call('TAXI::ADD_ORDER',[player.id]);
	}
});
mp.events.add("playerQuit", (player)=>{
	if(player.taxi){
		taxist.splice(taxist.indexOf(player),1)
		if(player.taxi_client){
			let client = mp.players.at(player.taxi_client);
			if(client){
				client.alert(`Таксит ${player.name} вышел с сервера`)
				client.status_taxi = 0;
				client.taxi_driver = null;
			}
		}
	}
	if(player.status_taxi && player.status_taxi > 0){
			orders.splice(orders.indexOf(player),1)
			let driver = mp.players.at(player.taxi_driver);
			if(player.taxi_driver ){
					if(driver){
						driver.alert(`Вызов от игрока ${player.name} был отменён`)
						driver.taxi_client = null;
				}
		}
	}
})