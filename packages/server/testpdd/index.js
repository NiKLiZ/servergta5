let parking = require('../parking/class.js');
let vehs = mp.configs.parking_testpdd.vehs;
let park = new parking(vehs);
let moment = require('moment');
mp.events.addCommand('savepark', (player, _, vehName) => {
	if(!player.permision['TESTPDD::SAVE_VEH']) return player.alert(`У вас нет прав`,1);
	let veh = {
				"model": "premier",
				"pos": player.vehicle.position,
				"heading": player.vehicle.rotation.z,
				"color": [[0, 0, 255],[0, 0, 255]]
			}
	mp.configs.parking_testpdd.vehs.push(veh);
	mp.configs.parking_testpdd.save();
})
mp.events.add({
	"TEST_PDD:START": (player) => {
		if(!player.editMoney(-300,'Сдача на права'))return;
		if(!player.inventory.isEmptySlot(1))return player.alert('Нет свободного места в инвентаре');
		let veh = park.targetVeh(player);
		if(veh)	player.call('startTestPdd');
		else player.alert('Все машины заняты ',1)
	},
	"TEST_PDD:FINISH": (player)=>{
		addDriving(player);
		player.clearParking(true);
		let parking = player.parking;
		parking.target = null;
	},
	"LSMYC::CHECK":(player,indexLicense)=>{
		if(indexLicense == 0){
			if(!player.checkMoney(-300)){
				player.alert('У вас недостаточно средств!',1);
				player.call('LSMYC::HIDE')
			}else player.call('TEST_PDD::START')
		}
		if(indexLicense == 1){
			if(!player.editmoneyCash(-550,'Сдача на водный транспорт'))return;
			if(player.testLicense('rightBoat'))return player.alert('У вас уже есть права на водный транспортна ')
			let date = moment().add(2, 'months').valueOf();
			addLicense(player,'rightBoat',date)
			player.alert('Вы купили права на водный транспорт 2 месяца')
			player.call('LSMYC::HIDE')
		}
		if(indexLicense == 2){
			if(!player.editmoneyCash(-1500,'Права на самолёт'))return;
			if(player.testLicense('rightPlane'))return player.alert('У вас уже есть права на самолёт ')
			let date = moment().add(2, 'months').valueOf();
			addLicense(player,'rightPlane',date)
			player.alert('Вы купили права на самолёт на 2 месяца')
			player.call('LSMYC::HIDE')
		}
	}
});

function addDriving(player){
if(!player.inventory.isEmptySlot(1))return player.alert('У вас не хватает места в инвентаре')
	let date = moment().add(3, 'months').valueOf();
	let info = {
		name_cart: player.mongoUser.name,
		surname: player.mongoUser.surname,
		current: date,
		date: Date.now(),
	};
	player.inventory.addItem(1,null,info);
	addLicense(player,'driving',date)
}


function addLicense(player,name,date){
	player.mongoUser.licenses[name].is = true;
	player.mongoUser.licenses[name].date = date;
	if(!player.mongoUser.$__.saving)player.mongoUser.save().catch((e)=>{
		player.alert('Произошла ошибка')
		console.error(e);
	})
	player.call("MENU::ADD_LICENSE",[name]);
}
module.exports.addLicense = addLicense;
module.exports.addDriving = addDriving;