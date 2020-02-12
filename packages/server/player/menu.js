let moment = require("moment");
let timeGiveMoney = 4*60*60*1000

mp.calbackmenuv({
	'findveh':(player,array)=>{
		let veh = player.isOwnerVehicle(array[0]);
		if(veh){
			if(!veh.home) player.setNewWaypoint(veh.position)
			else if(veh.evacuated){
				player.alert('Машину эвакуировали');
			}
			else{
				let pos = veh.home.garage_pos;
				player.setNewWaypoint(pos)
			} 
		}	
		else player.alert('Ключи не активированы')
	},
	"PLAYER::EVACUTE_VEHICLE":(player,array)=>{
		let veh = mp.vehicles.at(parseInt(array[0]));
		if(!player.home)return player.alert('У вас нет дома')
		let home = player.home;
		if(!home.colshape_garage)return player.alert('В доме нет гаража')
		if(!player.editmoneyCash(-50,'Эвакуация машины домой'))return;
		if(player.vehicle == veh)player.removeFromVehicle();
		home.garageJoinVeh(veh);
		player.alert('Машина эвакуирована в дом');
	}
})
mp.events.push({
	"RADIAL::GIVE_MONEY":(player,id,money)=>{
		let pl = mp.players.at(parseInt(id));
		money = parseInt(money);
		if(isNaN(money))return player.alert('Вы не написали сумму')
		if(pl.mongoUser.time_game < timeGiveMoney)return player.alert('Деньги можно переадавать после 4 часов игры на сервере')
		if(money <= 0) return player.alert('Нельзя передать меньше 1$')
		if(money > 10000)return player.alert('Нельзя передать наличкой больше 10000$')
		if(!player.editmoneyCash(-money,'Передал игроку '+pl.name))return;
		pl.alert(`${player.name} передал вам ${money}`)
		mp.events.callCommand('me',player,`Передал деньги ${pl.nameChat}`);
		pl.editmoneyCash(money,'Игрок '+pl.name);
	},
	"RADIAL::SELF_VEHICLE":(player,id)=>{
		let ret = [];
		player.vehicles.forEach((veh,i)=>{
			if(veh.evacuated)return;
			ret.push({
				id: i,
				model: veh.model,
				data: veh._id.toString()
			}) 
		})
		player.call("RADIAL::SELF_VEHICLE_TABLE",[id,JSON.stringify(ret)]);
	},
	"RADIAL::SELF_VEHICLE_MENU":(player,id,model,veh_id,price)=>{
		let pl = mp.players.at(parseInt(id));
		let veh = mp.vehicles.atMongoId(veh_id);
		if(veh.dist(player.position) > 20 || veh.dimension != player.dimension)return player.alert('Машина слишком далеко от вас')
		if(!pl.hasAddVehicle()){
			 pl.alert('У вас не хватает места для машины',1);
			 player.alert('У игрока не хватает места для машины',1);
			 return
		}
		pl.call("RADIAL::SELF_VEHICLE_BUYER",[player.id,model,veh_id,price]);
	},
	"RADIAL::HELLO_PLAYER":(player,id)=>{
		let pl = mp.players.at(parseInt(id));
		if(hasAddedFriend(player, pl))return player.alert('Игрок уже у вас в друзьях')
		let menu = {
			name: 'Дружба',
			items: [
				{
					type: 1,
					name: 'Принять',
					placeholder: `Принять дружбу от ${player.name}`,
					callback: 'PLAYER::ADD_FRIEND_SUCCESS',
					callpointenct: player.id
				},
				{
					type: 1,
					name: 'Отклонить',
				}
			]
		}
		pl.createmenuv(menu);
	},
	"RADIAL::SHOW_DRIVER_LICENSE":(pl,id)=>{
		let item = player.inventory.findItem(1,true);
		let player = mp.players.at(parseInt(id));
		if(!player)return;
		if(item){
			let data = new Date(item.date);
			let current = new Date(item.current);
			let info = {
				"Имя": item.name_cart,
				"Дата выдачи": `${data.getDate()}-${data.getMonth()}-${data.getFullYear()}`,
				"Фамилия":item.surname,
				"Действует до": `${current.getDate()}-${current.getMonth()}-${current.getFullYear()}`,
				"title": "DRIVER'S LICENSE OF SAN ANDREAS STATE"
			}
			pl.call('DOCUMENT::SHOW',[JSON.stringify(info)]);
			addFriend(player,pl);
		}else player.alert('У вас нет вод. прав');
	},
	"RADIAL::SHOW_DOCUMENT":(player,callback,id,name)=>{
		let pl = mp.players.at(parseInt(id));
		if(!pl)return;
		pl.call("RADIAL::SHOW_DOCUMENT",[player.id,callback,name])
	},
	"RADIAL::SHOW_PASSPORT":(pl,id)=>{
		let player = mp.players.at(parseInt(id));
		if(!player)return;
		let info = {
			"Имя": player.mongoUser.name,
			"Прописка в штате": player.mongoUser.licenses.registration.is? 'Имеется':'Не имеется',
			"Фамилия": player.mongoUser.surname,
			'Дата рождения': moment(player.mongoUser.dateBirth).format('DD-MM-YYYY'),
			"title": 'Паспорт'
		}
		pl.call('DOCUMENT::SHOW',[JSON.stringify(info)]);
		pl.alert('Вам показали паспорт')
		addFriend(player,pl);
	},
	"MENU::GET_ADMIN":(player)=>{
		let admins = 0;
		let helpers = 0;
		mp.players.forEach((pl)=>{
			try{
				if(pl.loggined && pl.permision.level > 1){
					if(pl.permision.name == 'Helper')helpers++;
					else admins++
				}
			}catch(e){
				console.error(e)
			}
		});
		player.call("MENU::GET_ADMIN",[admins,helpers])
	}
})
mp.calbackmenuv('RADIAL::SELF_VEHICLE_SUCCESS',(player,array,json)=>{
	let info = array[0].split(',')
	let price = parseInt(info[3]);
	let pl = mp.players.at(parseInt(info[0]));
	let veh = mp.vehicles.atMongoId(info[2]);
	if(veh){
		let ret,id,inventory;
		// Поиск инвентаря и ячейки где находится ключи от машины
		if(!player.inventory.isEmptySlot(6))return player.alert('У вас не хватает места в инвенторе');
		pl.inventory.forEach(6,(item,i,_inventory)=>{
			if(item.vehid && item.vehid.toString() === info[2]){
				ret = item;
				id = i;
				inventory = _inventory;
				// Удаление предматов ключей 
				_inventory.removeSlot(i);
			}
		})
		// Если ключ не найден
		if(!ret){
			player.alert('У игрока нет ключей от машины');
			return pl.alert('У вас нет в кармане ключей от машины '+info[1]);
		};
		if(!player.editMoney(-price,`Покупка ${info[1]} от ${pl.name}`)) return;
		pl.editMoney(price,`Продажа ${info[1]} игроку ${player.name}`);
		veh.mongodb.player = player.mongoUser;
		if(!veh.mongodb.$__.saving)veh.mongodb.save().catch((err)=>{console.error(err)})
		let vehs = veh._id;
		inventory.removeSlot(id);
		// Добавляет один ключ в инвентарь
		player.inventory.addItemData(ret);
		pl.mongoUser.vehicles.pull(vehs);
		pl.mongoUser.markModified('vehicles')
		let index = pl.vehicles.findIndex((vehicle)=>{
			if(vehicle == veh)return true;
		})
		pl.vehicles.splice(index,1)
		player.vehicles.push(veh)
		if(veh.garage)veh.garage.garageExitVeh(veh);
		player.mongoUser.vehicles.push(vehs);
		if(!pl.mongoUser.$__.saving)pl.mongoUser.save().catch((err)=>{console.error(err)})
		if(!player.mongoUser.$__.saving)player.mongoUser.save().catch((err)=>{console.error(err)})
		player.inventory.refetchKeysVeh();
		player.alert('Вы купили машину');
		pl.inventory.refetchKeysVeh();
		pl.alert('У вас купили машину');
		player.updateVehiclesMenu();
		pl.updateVehiclesMenu();
	}else{
		console.log('Машина не найдена'+info[2])
	}

});
mp.calbackmenuv('PLAYER::EDIT_MOODS',(player,array,json)=>{
  player.data.currentMood = array[0];
});
const walkingStyles = [
	{Name: "Нормальная", AnimSet: null},
	{Name: "Смелая", AnimSet: "move_m@brave"},
	{Name: "Уверенная", AnimSet: "move_m@confident"},
	{Name: "Широкая", AnimSet: "move_m@fat@a"},
	{Name: "Бандитская", AnimSet: "move_m@shadyped@a"},
	{Name: "Спешая", AnimSet: "move_m@hurry@a"},
	{Name: "Хромая", AnimSet: "move_m@injured"},
	{Name: "Запуганная", AnimSet: "move_m@intimidation@1h"},
	{Name: "Быстрая", AnimSet: "move_m@quick"},
	{Name: "Грустная", AnimSet: "move_m@sad@a"},
	{Name: "Грубая", AnimSet: "move_m@tool_belt@a"}
];
mp.events.push('PLAYER::EDIT_STYLE',(player,style)=>{
	player.data.walkingStyle = walkingStyles[style].AnimSet;
})
mp.calbackmenuv({
	"PLAYER::ADD_FRIEND_SUCCESS": (player,array)=>{
		let playerFriend = mp.players.at(parseInt(array[0]));
		if(hasAddedFriend(player, playerFriend))return player.alert('Игрок уже у вас в друзьях')
		addFriend(player,playerFriend);
		player.alert(`Вы добавили ${playerFriend.name}`);
		playerFriend.alert(`Вас добавил ${player.name}`);
	},
})

let addFriend = (player,playerFriend)=>{
	if(hasAddedFriend(player,playerFriend))return;
	player.call("CHAT::ADD_FRIEND",[playerFriend.name])
	playerFriend.call("CHAT::ADD_FRIEND",[player.name])
	playerFriend.mongoUser.friends.push(player._id);
	player.mongoUser.friends.push(playerFriend._id);
	if(!player.mongoUser.$__.saving)player.mongoUser.save().catch(err=>{console.error(err)}) 
	if(!playerFriend.mongoUser.$__.saving)playerFriend.mongoUser.save().catch(err=>{console.error(err)}) 
}

function hasAddedFriend(player,playerFriend){
	let objectsId = player.mongoUser.friends.map(function (e) { return e._id ?  e._id.toString() : e.toString() });
	return objectsId.indexOf(playerFriend.mongoUser._id.toString()) != -1;
}