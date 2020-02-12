let parking = require('../parking/class.js');
let moneyCargo = 600;
let moneyPriceCargo = 1000;
let truckerOne = new parking(mp.configs.trucker.vehLevelOne,{
    trunker: true,
})
let truckerTwo = new parking(mp.configs.trucker.vehLevelTwo,{
    trunker: true,
})
let truckerThree = new parking(mp.configs.trucker.vehLevelThree,{
    trunker: true,
})
let { getBusinessByType , getBusiness} = require('../busines/class')
let carshowrooms = getBusinessByType(0);

let transports = [
	{
		signal: new mp.Vector3(125.6939468383789,6412.4169921875,30.32160186767578),
		traffic: new mp.Vector3(150.72988891601562,6399.70166015625,30.166893005371094),
		headingTraffic: 33,
		modelTraffic: 'tr4'
	},
	{
		signal: new mp.Vector3(2763.990966796875,1390.721923828125,23.521530151367188),
		traffic: new mp.Vector3(2738.1259765625,1389.0836181640625,23.501367568969727), 
		headingTraffic: 176,
		modelTraffic: 'tanker2'
	},
	{
		signal: new mp.Vector3(2761.3837890625,3467.443603515625,54.682037353515625), 
		traffic: new mp.Vector3(2769.338134765625,3481.081787109375,54.423797607421875),
		headingTraffic: 181,
		modelTraffic: 'trailers3'
	},
	{
		signal: new mp.Vector3(2763.990966796875,1390.721923828125,23.521530151367188),
		traffic: new mp.Vector3(2738.1259765625,1389.0836181640625,23.501367568969727),
		headingTraffic: 220,
		modelTraffic: 'trailers2' 
	},
]
mp.calbackmenuv({
	"TRUCKER::FINISH_JOB":(player)=>{
		mp.events.call("TRUCKER::FINISH_JOB",player)
		if(player.businesTruncker && player.orderTruncker){
			let idx = player.businesTruncker.ordersExecuted.indexOf(player.orderTruncker);
			if(idx != -1)player.businesTruncker.ordersExecuted.splice(idx,1);
		}
	},
    "TRUCKER::START":(player,array)=>{
        if(!player.isWorkUp()) return ;
		if(!player.testRightDrive())return 
		let typeHire = parseInt(array[0]);
		let veh;
		if(typeHire == 1){
			veh = truckerOne.targetVeh(player);
			if(!veh)return player.alert('Все машины заняты ')
			if(!player.editmoneyCash(-20,'Аренда грузовика'))return;
		}
		if(typeHire == 2){
			if(player.mongoUser.jobs.trucker.exp > 10000) return player.alert(`У вас не хватает уровня. Осталось exp для 2 уровня ${10000 - player.mongoUser.jobs.trucker.exp}`)
			veh = truckerTwo.targetVeh(player);
			if(!veh)return player.alert('Все машины заняты ')
			if(!player.editmoneyCash(-40,'Аренда грузовика'))return;
		}
		if(typeHire == 3){
			if(player.mongoUser.jobs.trucker.exp > 20000) return player.alert(`У вас не хватает уровня. Осталось exp для 2 уровня ${20000 - player.mongoUser.jobs.trucker.exp}`)
			veh = truckerThree.targetVeh(player);
			if(!veh)return player.alert('Все машины заняты ')
			if(!player.editmoneyCash(-60,'Аренда грузовика'))return;
		}

		if(veh){
			player.trucker = true;
			player.call('TRUCKER::START')
		}
	},
	"TRUCKER::START_TASK":(player,array)=>{
		if(!player.vehicle || player.parking != player.vehicle)return player.alert('Заказ можно принять только в грузовике')
		array = array[0].split(",")
		let idBusines = parseInt(array[0]);
		let idOrder = parseInt(array[1]);
		let busines = getBusiness(idBusines);
		let transport = transports[busines.bizType];
		let order = busines.model.orders[idOrder]
		player.orderTruncker = order;
		busines.ordersExecuted.push(order);
		player.businesTruncker = busines;
		player.transport = transport;
		player.orderTrunckerId = idOrder;
		player.call("TRUCKER::START_TASK_SIGNAL",[JSON.stringify(transport.signal)])
		if(mp.vehicles.exists(player.truckerTrailer))player.truckerTrailer.destroy();
	},
	"TRUCKER::SIGNAL_CLOSE":(player)=>{
		player.call('TRUCKER::DESTROY_TASK_SIGNAL');
		let idx = player.businesTruncker.ordersExecuted.indexOf(player.orderTruncker);
		if(idx != -1)player.businesTruncker.ordersExecuted.splice(idx,1);
		if(player.truckerTrailer)delete player.truckerTrailer.trucker
		delete player.transport;
		delete player.truckerMoney;
		delete player.truckerCargo;
	},
	"TRUCKER::SIGNAL_ACCEPT":(player)=>{
		if(!player.editmoneyCash(-player.truckerMoney,'Покупка груза')){
		}else{
			player.call('TRUCKER::DESTROY_TASK_SIGNAL')
			player.truckerTrailer = mp.vehicles.new(mp.joaat(player.transport.modelTraffic),player.transport.traffic,{
				heading: player.transport.headingTraffic
			})
			player.truckerTrailer.trucker = player; 
		}
	}
});
mp.events.push({
	"TRUCKER::TASKS":(player)=>{
		let info = []
		carshowrooms.forEach((carshowroom)=>{
			carshowroom.model.orders.forEach((order,i)=>{
				if(carshowroom.ordersExecuted.indexOf(order) === -1)info.push({
					model: order.model,
					price: order.price,
					bizId: carshowroom.id,
					id: i
				})
			})
		})
		player.call("TRUCKER::TASKS",[JSON.stringify(info)])
	},
	"TRUNCKER::END_MISSION":(player)=>{
		if(player.truckerTrailer)player.truckerTrailer.destroy();
		// Дать деньги за груз
		player.editMoney(parseInt(player.truckerMoney*0.2),'Доставка груза');
		player.businesTruncker.editStoke(player.orderTruncker.model,1);
		let idx = player.businesTruncker.ordersExecuted.indexOf(player.orderTruncker);
		if(idx != -1)player.businesTruncker.ordersExecuted.splice(idx,1);
		player.businesTruncker.deleteOrder(player.orderTrunckerId)
		player.mongoUser.jobs.trucker.exp += player.truckerCargo;
		if(!player.mongoUser.$__.saving)player.mongoUser.save().catch((e)=>{
			player.alert('Произошла ошибка')
			console.error(e);
		})
		if(player.truckerTrailer)delete player.truckerTrailer.trucker
		player.vehicle.TowTruck = undefined;
		player.alert('Вы довезли груз')
		player.alert('Чтобы взять новый заказ нажмите J')
		deleteVarsPlayer(player);
	},
	"TRUNCKER::OPEN_MENU":(player)=>{
		player.truckerCargo = 1;
		player.truckerMoney = parseInt(player.orderTruncker.price/2);
		player.call("TRUNCKER::OPEN_MENU",[moneyCargo])
	},
})
mp.events.add({
	"trailerAttached":(vehicle, trailer)=>{
		if(vehicle.trunker && trailer){
			let player = vehicle.getPlayers(-1);
			if(trailer.trucker == player){
				if(!player.TowTruck){
					let pos = player.businesTruncker.trunckerPos;
					// if(player.businesTruncker.bizType == 0) 
					// if(player.typeTask == 1) pos = getRandomArray(mp.configs.fillings).pos;
					// if(player.typeTask == 1) pos = getRandomArray(mp.configs.shops.positions).posTransport;
					// if(player.typeTask == 2) pos = getRandomArray(mp.configs.shopsClothes.shops).posTransport;
					player.call("TRUCKER::START_MISSION",[JSON.stringify(pos)])
					player.TowTruck = trailer;
				}
			}else{
				vehicle.detachTowTruck();
				player.alert('Вы не можете цеплять эту машину')
			}
		}
	},
	"TRUCKER::FINISH_JOB":(player)=>{
		player.clearParking(true)
		player.trucker = false;
		player.call('TRUCKER::END');
		deleteVarsPlayer(player);
		if(player.truckerTrailer && mp.vehicles.exists(player.truckerTrailer))player.truckerTrailer.destroy();
	},
	"playerQuit":(player)=>{
		if(player.businesTruncker){
			let idx = player.businesTruncker.ordersExecuted.indexOf(player.orderTruncker);
			if(idx != -1)player.businesTruncker.ordersExecuted.splice(idx,1);
		}
	}
})

let getRandomArray = (array)=>{
	return array[Math.floor(Math.random()*array.length)];
}


function deleteVarsPlayer(player){
	delete player.transport;
	delete player.truckerMoney;
	delete player.truckerCargo;
	delete player.TowTruck;
	delete player.businesTruncker;
	delete player.orderTruncker;
	delete player.orderTrunckerId;
}