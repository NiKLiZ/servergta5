let fraction = require('../class.js');
let posSpawn = new mp.Vector3(-540.1051635742188,-202.5170135498047,-194.11);
let config = require('../../../configs/fractions/CH.json');
let {unJail} = require('../lspd/jail.js');
mp.fractions.CH = new fraction('CH',[209, 115, 206,255],config.rank,config.vehs,posSpawn);
mp.events.push({
	"CH::LOCKER": (player)=>{
		player.locker_fraction = !!!player.locker_fraction;
		if(!player.locker_fraction){
			player.arms = false;
			player.removeAllWeapons();
			return player.inventory.refetchItems();
		} 
		let rang = player.fraction.rank[player.rank];
		if(rang.clothes)rang.clothes[player.gender].forEach(clot => {
			player.setClothes(clot.component, clot.drawable, 0, 0);
		});
		if(rang.props)rang.props[player.gender].forEach(clot => {
			player.setProp(clot.component, clot.drawable, 0);
		});
	},
	"CH::ARMS":(player)=>{
		let weapons = player.fraction.rank[player.rank].weapons;
		if(!weapons)return player.alert('Вы не можете взять оружие')
		if(player.arms)return player.alert('Вы уже взяли оружие')
		player.arms = !player.arms;
		for (let i = 0; i < weapons.length; i++) {
			player.giveWeaponAttachment(mp.joaat(weapons[i][0]),weapons[i][1]);
		}
	},
	"CH::VIEW_ARTICLE":(player,id)=>{
		let pl = mp.players.at(id);
		if(!pl)return player.alert('Игрок не найден')
		if(!pl.testJail())return player.alert('Игрок не сидит в тюрьме');
		let info = {
			"Имя": pl.mongoUser.name,
			"Фамилия": pl.mongoUser.surname,
			"Причина": pl.mongoUser.jail.discription,
			"Статья": pl.mongoUser.jail.article,
			"title": 'УДО'
		}
		player.call("DOCUMENT::SHOW",[JSON.stringify(info)])
	},
	"CH::UN_JAIL":(player,id)=>{
		if(!player.locker_fraction) return player.alert('Вы не надели униформу')
		let pl = mp.players.at(id);
		if(!pl)return player.alert('Игрок не найден')
		if(!pl.testJail())return player.alert('Игрок не сидит в тюрьме')
		pl.alert(`${player.name} предлагает вам помощь в освобождении из тюрьмы`);
		let menu = {
			name: 'Таблетка',
			items: [
				{
					type: 1,
					name: 'Принять помощь за 1000$',
					callback: 'CH::UN_JAIL_SUCCESS',
					callpointenct: player.id,
				},
				{
					type: 1,
					name: 'Отказаться',
					
				},
			]
		}
		pl.createmenuv(menu);
	}
})
mp.calbackmenuv({
	"CH::UN_JAIL_SUCCESS":(player,array)=>{
		let pl = mp.players.at(parseInt(array[0]))
		if(!pl)return player.alert('Игрок не найден');
		if(!player.testJail())return player.alert('Игрок не сидит в тюрьме')
		if(!player.editMoney(-1000,'Услуги адвоката')){
			pl.alert('У вас не хватает денег')
			player.alert('У игрока не хватает денег')
			return 
		}
		unJail(player);
		pl.alert('Игрок оплатил вашу услугу');
		player.alert('Вас освободили из тюрьмы за 1000$')
	},
})
mp.events.add({
    "CH::MENU":(player)=>{
		let online_staff = mp.fractions.CH.getOnlineMembers().map((pl)=>{
			return {
				name: pl.name,
				rank: pl.mongoUser.fraction.rank,
				underRang: pl.mongoUser.fraction.underRang,
				warn: pl.mongoUser.fraction.warn || 0,
				
			}
		})
		player.fractionEval(`
			ch_menu.online_staff = ${JSON.stringify(online_staff)};
		`)
	},
})