let fraction = require('../class.js');
let respawnPlayer = require('../../events/deat.js').respawnPlayer;

let posSpawn = new mp.Vector3(268.7584228515625,-1362.9803466796875,23.537796020507812);
let config = require('../../../configs/fractions/EMS.json')
let {alertEms} = require('../ems/alert');

mp.fractions.EMS = new fraction('EMS',[209, 115, 206,255],config.rank,config.vehs,posSpawn);
mp.events.push({
	"EMS::CHALLEGES_ACCEPT":(player,pl)=>{
		if(!player.vehicle || !player.vehicle.fraction || player.vehicle.fraction === 'EMS')return player.alert('Сначала сядьте в машину скорой помощи');
		pl = mp.players.findName(pl);
		if(!pl) return player.alert('Игрок не найден');
		player.setNewWaypoint(pl.position);
		pl.alert('За вами едет скорая помощь')
	},
	"EMS::LOCKER": (player)=>{
		player.locker_fraction = !!!player.locker_fraction;
		player.setVariable('locker_fraction',player.locker_fraction)
		if(!player.locker_fraction){
			player.removeAllWeapons();
			return player.inventory.refetchItems();
		} 
		if(player.gender == 0){
			player.setClothes(0,-1,-1,0);
			player.setClothes(1,0,0,0);
			player.setClothes(2,-1,-1,0);
			player.setClothes(3,90,0,0);
			player.setClothes(4,96,0,0);
			player.setClothes(5,-1,-1,0);
			player.setClothes(6,51,0,0);
			player.setClothes(7,126,0,0);
			player.setClothes(8,15,0,0);
			player.setClothes(9,0,0,0);
			player.setClothes(10,57,0,0);
			player.setClothes(11,249,0,0);
		}else{
			player.setClothes(0,-1,-1,0);
			player.setClothes(1,0,0,0);
			player.setClothes(2,-1,-1,0);
			player.setClothes(3,105,0,0);
			player.setClothes(4,99,0,0);
			player.setClothes(5,-1,-1,0);
			player.setClothes(6,52,0,0);
			player.setClothes(7,96,0,0);
			player.setClothes(8,14,0,0);
			player.setClothes(9,0,0,0);
			player.setClothes(10,65,0,0);
			player.setClothes(11,255,0,0);
			player.setProp(0,121,0);
		}
	},
	"EMS::TREAT":(player,id)=>{
		if(!player.locker_fraction) return player.alert('Вы не надели униформу')
		let pl = mp.players.at(id);
		player.stopAnimation();
		if(!pl.deat)return
		pl.alert('Вас вылечили')
		if(pl.deat){
			respawnPlayer(pl,pl.position);
			pl.health = 100;
			pl.closemenuv('DEAD::MENU');
		}
	},
	"EMS::TREAT_ANIM":(player,id)=>{
		let pl = mp.players.at(id);
		if(!pl.deat)return player.alert('Игрок не умирает')
		player.call('EMS::TREAT_ANIM_ACCEPT',[pl.id]);
		player.playAnimation("missheistfbi3b_ig8_2","cpr_loop_paramedic",1,1);
	},
	"EMS::PILL":(player,pl)=>{
		if(!player.locker_fraction) return player.alert('Вы не надели униформу')
		pl = mp.players.at(pl);
		if(!pl)return player.alert('Игрок не найден')
		if(pl.deat)return player.alert('Игрок при смерти, вы не можете дать игроку таблетку')
		pl.alert(`${player.name} предлагает вам таблетку`);
		let menu = {
			name: 'Таблетка',
			items: [
				{
					type: 1,
					name: 'Купить за 50$',
					callback: 'EMS::PILL_SUCCESS',
					callpointenct: player.id,
				},
				{
					type: 1,
					name: 'Отказаться',
					
				},
			]
		}
		pl.createmenuv(menu);
	},
})
mp.calbackmenuv({
	"EMS::PILL_SUCCESS":(player,array)=>{
		let pl = mp.players.at(parseInt(array[0]))
		if(!pl)return player.alert('Игрок не найден');
		if(player.deat)return pl.alert('Игрок при смерти, вы не можете дать игроку таблетку')
		if(!player.editmoneyCash(-50,'Таблятка')){
			pl.alert('У вас не хватает наличных')
			player.alert('У игрока не хватает наличных')
			return 
		}
		player.health = 100;
		pl.alert('Игрок купил таблетку');
		player.alert('Вы купили таблетку за 50$')
	},
	"EMS::CURE":(player)=>{
		if(player.deat)return player.alert('Вы при смерти, вы не можете вылечиться')
		if(!player.editMoney(-15,'Лечение в больницы')) return player.alert('У вас не хватает денег');
		player.health = 100;
		player.alert('Вас вылечили')
	},
	"EMS::CHANGE_APPEARANCE":(player)=>{
		if(player.deat)return player.alert('Вы при смерти, вы не можете вылечиться')
		if(!player.editMoney(-100000,'Смена внешности')) return player.alert('У вас не хватает денег');
		player.health = 100;
		player.alert('Вас вылечили')
	}
})
let calls = []
mp.events.add({
    "EMS::MENU":(player)=>{
		let deatPlayers = mp.players.toArray().filter((pl)=>{
			if(pl.deat == true) return true;
		});
		deatPlayers = deatPlayers.map((pl)=>{
			return {
				name: pl.name
			}
		})
		let callsData = calls.map((pl)=>{
			if(mp.players.exists(pl))return {
				name: pl.name
			}
		})
		deatPlayers.push(...callsData)
		let online_staff = mp.fractions.EMS.getOnlineMembers().map((pl)=>{
			return {
				name: pl.name,
				rank: pl.mongoUser.fraction.rank
			}
		})
		player.fractionEval(`
			ems_menu.deatPlayers = ${JSON.stringify(deatPlayers)}
			ems_menu.online_staff = ${JSON.stringify(online_staff)};
		`)
	},
	"playerQuit":(player)=>{
		let index = calls.indexOf(player);
		if(index != -1)calls.splice(index,1);
	},
	"EMS::CALL": (player)=>{
		addCall(player);
	}
})


function addCall(player){
	if(calls.indexOf(player) != -1)return player.alert('Вы уже вызвали скорую помощь')
	player.alert('Вы вызвали скорую помощь')
	calls.push(player);
	let text = `${player.name} вызвал скорую помощь`
	alertEms(text);
}



module.exports.addCall = addCall;