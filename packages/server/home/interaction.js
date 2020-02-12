mp.homes = require('./homes.js');
let homeClass = require('./class.js');
let homeSchema = require('../mongodb/home.js').home;
let admin = (id)=>{
	let admin = {
		name: 'Админка дома №'+id,
		items: [
			{
				type: 0,
				name: 'Удалить',
				placeholder: 'Удалить',
				callback: 'deletehome',
				callpointenct: ''+id
			}
		]
	}
	if(mp.homes[id].garage){
		admin.items.push({
			type: 1,
			name: 'Удалить гараж',
			placeholder: 'Удалить гараж',
			callback: 'deletegarage',
			callpointenct: ''+id
		})
	}
	return {
			type: 2,
			name: 'Админка',
			infomenu: admin
		};
}
mp.events.add("playerEnterColshape", (player, colshape) => {
	if(!player.loggined) return;
	if(colshape.garage_home){
		let home = colshape.garage_home;
		if(home.owner != null && home.owner.toString() === player._id.toString()||player.permision['HOME::JOIN']){ 
			let menu = {
				name: 'Дом №'+home.id,
				exitmenu: 'HOME::GARAGE',
				items: [

				]
			}
			if(player.vehicle){
				menu.items.push({
					type: 1,
					name: 'Заехать в гараж',
					placeholder: 'Заехать в гараж',
					callback: 'HOME::JOIN_GARAGE',
					callpointenct: ''+home.id
				})
			}else
			menu.items.push({
					type: 1,
					name: 'Войти в гараж',
					placeholder: 'Войти в гараж',
					callback: 'HOME::JOIN_GARAGE_PLAYER',
					callpointenct: ''+home.id
				})
			player.createmenuv(menu);
		}
	}
	if(colshape.home && !player.vehicle){
		let home = colshape.home;
		let menu = {
			name: 'Дом №'+home.id,
			exitmenu: 'home',
			items: [
			]
		}
		if(home.owner != null && home.owner.toString() === player._id.toString()||player.permision['HOME::JOIN']){ 
			menu.items.push({
					type: 0,
					name: 'Войти',
					placeholder: 'Войти',
					callback: 'joinhome',
					callpointenct: ''+home.id
				})
		}
		if(home.owner!=null && home.owner.toString() === player._id.toString()){
			menu.items.push({
					type: 1,
					name: 'Продать',
					placeholder: 'Продать',
					callback: 'selfhome',
					callpointenct: ''+home.id
				})
		}
	 else if(home.owner == null) menu.items.push({
					type: 0,
					name: 'Купить',
					placeholder: 'Купить',
					callback: 'buyhome',
					callpointenct: ''+home.id
		})
		if(player.permision['HOME::MENU_ADMIN']) menu.items.push(admin(home.id));
		if(player.pizza && player.homePizza && player.homePizza == home){
			menu.items.push({
					type: 1,
					name: 'Отдать заказ',
					placeholder: 'Отдать заказ',
					callback: 'PIZZA::DELIVERED',
			})
		} 
		player.createmenuv(menu);
	}
	if(colshape.exithome){
		let home = colshape.exithome;
		let menu = {
			name: 'Дом №'+home.id,
			exitmenu: 'home',
			items: [{
				type: 0,
				name: 'Выйти',
				placeholder: 'Выйти',
				callback: 'exithome',
				callpointenct: ''+home.id
			}]
		}
		if(home.owner == player._id){ 
			menu.items.push({
					type: 0,
					name: 'Продать',
					placeholder: 'Продать',
					callback: 'selfhome',
					callpointenct: ''+home.id
				})
		}
		if(player.permision['HOME::MENU_ADMIN']) menu.items.push(admin(home.id));
		player.createmenuv(menu);
	}
	if(colshape.exitgarage){
		let home = colshape.exitgarage;
		let menu = {
			name: 'Дом №'+home.id,
			exitmenu: 'HOME::EXIT_GARAG',
			items: [{
				type: 0,
				name: 'Выйти',
				placeholder: 'Выйти',
				callback: 'HOME::EXIT_GARAG',
				callpointenct: ''+home.id
			}]
		}
		if(home.owner == player._id){ 
			menu.items.push({
					type: 0,
					name: 'Продать',
					placeholder: 'Продать',
					callback: 'selfhome',
					callpointenct: ''+home.id
				})
		}
		if(player.permision['HOME::MENU_ADMIN']) menu.items.push(admin(home.id));
		player.createmenuv(menu);
	}
});
mp.events.add("playerExitColshape", (player, colshape) => {
	if(!player.loggined)return;
	if(colshape.home || colshape.exithome){
		player.closemenuv('home')
	}
	if(colshape.garage_home){
		player.closemenuv('HOME::GARAGE')
	}
	if(colshape.exitgarage){
		player.closemenuv('HOME::EXIT_GARAG')
	}
});
mp.calbackmenuv('createhome',(player,array)=>{
	if(!player.permision['HOME::CREATE']) return player.alert(`У вас нет прав`,1);
	let type = parseInt(array[0]);
	if(array[1] == '') return player.alert(`Неверное значение цены`,1);
	let price = parseInt(array[1]);
	let homeModel = new homeSchema({
		pos: player.position,
		type: type,
		price: price
	});	
	homeModel.save((err)=>{
		 if(err) console.error(err);
	});
	let home = new homeClass(mp.homes.length,player.position,type,price,null,homeModel)
	mp.homes.push(home);
});
mp.calbackmenuv('buyhome',(player,array)=>{
	if(!player.testLicense('registration',false))return player.alert('Чтобы купить дом нужна прописка в штате')
	if(player.home) return player.alert('Можно купить только один дом')
	mp.homes[parseInt(array[0])].buy(player);
})
mp.calbackmenuv('selfhome',(player,array)=>{
	let home = mp.homes[parseInt(array[0])];
	if(home.garage){
		let vehs = home.garage.filter((pos)=>{
			if(pos !== null)return true
		})
		if(vehs.length) return player.alert('Вы не можете продать дом, пока там припаркованы автомобили')
	}
	home.self(player);
})
mp.calbackmenuv('joinhome',(player,array)=>{
	mp.homes[parseInt(array[0])].join(player);
})
mp.calbackmenuv('exithome',(player,array)=>{
	mp.homes[parseInt(array[0])].exit(player);
})
mp.calbackmenuv('HOME::EXIT_GARAG',(player,array)=>{
	mp.homes[parseInt(array[0])].garageExitPlayer(player);
})
mp.calbackmenuv('HOME::JOIN_GARAGE',(player,array)=>{
	if(!player.vehicle) return;
	if(!player.vehicle._id) return player.alert('Данную машину нельзя поставить в гараж')
	let home = mp.homes[parseInt(array[0])]
	let is = home.garageJoinVeh(player.vehicle,player);
	player.alert(is?'Вы заехали в гараж':'Мест нет')
})
mp.calbackmenuv('HOME::JOIN_GARAGE_PLAYER',(player,array)=>{
	if(player.vehicle) return;
	let home = mp.homes[parseInt(array[0])]
	home.garageJoinPlayer(player);
})
mp.calbackmenuv('deletehome',(player,array)=>{
	let home = mp.homes[parseInt(array[0])];
	if(!home && mp.labels.exists(home.label))return player.alert('Дома не существует')
	home.delete(player);
})
mp.calbackmenuv('ADMIN::CREATE_GARAG',(player,array)=>{
	if(!player.permision['HOME::CREATE_GARAG']) return player.alert(`У вас нет прав`,1);
	let menu = {
			name: 'Создания гаража' ,
			items: [
				{
					type: 3,
					name: 'ID дома',
					max: mp.homes.length-1
				},
				{
					type: 4,
					name: 'Тип бана',
					swith: ['2 местный','6 местный','10 местный']
				},
				{
					type: 0,
					name: 'Добавить для гаража дом ',
					placeholder: 'Создание дома',
					callback: 'ADMIN:MAKE_GARAGE'
				}
			]
		}
	player.createmenuv(menu);

})
mp.calbackmenuv('ADMIN:REMOVE_GARAGE',(player,array)=>{
	let home = mp.homes[parseInt(array[0])];
	if(home){
		let vehs = home.garage.filter((pos)=>{
			if(pos !== null)return true
		})
		if(vehs.length) return player.alert('Вы не можете удалить дом, пока там припаркованы автомобили')
		home.deleteGarage();
		player.alert('Вы удалил гараж у дома '+array[0])
	}
})
mp.calbackmenuv('ADMIN:MAKE_GARAGE',(player,array)=>{
	if(!player.permision['HOME::CREATE_GARAG']) return player.alert(`У вас нет прав`,1);
	let home = mp.homes[parseInt(array[0])];
	if(home){
		if(home.markerexit_garage){
			home.colshapeexit_garage.destroy();
			home.markerexit_garage.destroy();
		}
		home.mongodb.garagePos = player.position;
		home.mongodb.garageHeading = player.heading;
		home.mongodb.garageType = parseInt(array[1]);
		home.mongodb.save().catch((e)=>{
			if(err)console.error(err)
		})
		home.createGarage(player.position,player.heading ,parseInt(array[1]))
		player.alert(`Гараж для дома №${array[0]} был создан`)
	}
})
mp.events.add("HOME::EXIT_GARAG_VEH", (player) => {
	if(!player.vehicle || !player.vehicle.home) return;
	if(!player.permision['HOME::EXIT_GARAG_VEH'] && (!player.vehicle.home.owner || player.vehicle.home.owner.toString() !== player._id.toString())) return;
	if(!player.vehicle.home) return;
	player.vehicle.home.garageExitVeh(player.vehicle);
	player.joinhome = null;
	player.joinhome_class = null;
})