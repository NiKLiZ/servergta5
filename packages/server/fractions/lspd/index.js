let fraction = require('../class.js');
let posSpawn = new mp.Vector3(456.1913757324219,-992.3951416015625,29.689594268798828);
let jail = require('./jail').jail;
let config = require('../../../configs/fractions/LSPD.json')
let moment = require('moment');
let {addLicense} = require('../../testpdd/index');
mp.fractions.LSPD = new fraction('LSPD',[31, 107, 167,255],config.rank,config.vehs,posSpawn);

mp.events.push({
	"LSPD::battue": (player,name,discription,article,stars)=>{
		stars = parseInt(stars)
		if(discription.length < 2) return player.alert('Вы не написали описание');
		if(article.length < 2) return player.alert('Вы не написали описание');
		let pl = mp.players.findName(name);
		if(!pl) return player.alert('Игрок не найден')
		mp.fractions.LSPD.log(`${player.name} объявил в розыск ${pl.name} на ${stars}зв. за ${discription}`)
		pl.setVariable('lspd_star',stars);
		pl.mongoUser.lspd.stars = stars;
		pl.mongoUser.lspd.discription = discription;
		pl.mongoUser.lspd.article = article;
		if(!pl.mongoUser.$__.saving)pl.mongoUser.save().catch((err)=>console.error(err));
		mp.fractions.LSPD.broadcast(`${player.name} объявил в розыск ${pl.name} на ${stars}зв. за ${discription} по статье ${article}`);
		player.alert('Вы обьявиливи в розыск '+pl.name)
		mp.events.call('LSPD::MENU',player)
		player.updateInfoMenu();
	},
	"LSPD::search_online_find": (player,name)=>{
		let pl = mp.players.findName(name);
		if(!pl) return player.alert('Игрок не найден')
		player.setNewWaypoint(pl.position);
		player.alert('Метка поставлена')
	},
	"LSPD::search_online_clear": (player,name)=>{
		let pl = mp.players.findName(name);
		if(!pl) return player.alert('Игрок не найден')
		pl.mongoUser.lspd.stars = 0;
		pl.mongoUser.lspd.discription = "";
		if(!pl.mongoUser.$__.saving)pl.mongoUser.save().catch((err)=>console.error(err));
		pl.setVariable('lspd_star',0);
		player.alert(`Игрок ${pl.name} удлалён из розыска`)
		mp.fractions.LSPD.log(`${player.name}  удлаялил из розыска ${pl.name}`)
		mp.events.call('LSPD::MENU',player)
		player.updateInfoMenu();
	},
	"LSPD::CHALLEGES_ACCEPT": (player,name)=>{
		let pl = mp.players.findName(name);
		if(!pl) return player.alert('Игрок не найден');
		for (let i = 0; i < challenges.length; i++) {
			if(mp.players.at(challenges[i].id) === pl){
				pl.alert('Вызов принят');
				player.setNewWaypoint(pl.position);
				mp.fractions.LSPD.log(`${player.name} принял вызов ${pl.name} описани: ${challenges[i].discription}`);
				challenges.splice(i,1);
				mp.events.call('LSPD::MENU',player)
				return;
			}
		}
		player.alert('Игрок не найден');
	},
	"LSPD::CHALLEGES_CANCEL": (player,name)=>{
		let pl = mp.players.findName(name);
		if(!pl) return player.alert('Игрок не найден');
		for (let i = 0; i < challenges.length; i++) {
			if(mp.players.at(challenges[i].id) === pl){
				pl.alert('Вызов отменен');
				mp.fractions.LSPD.log(`${player.name} отменил вызов ${pl.name} описани: ${challenges[i].discription}`);
				challenges.splice(i,1);
				mp.events.call('LSPD::MENU',player)
				return;
			}
		}
		player.alert('Игрок не найден');
	},
	"LSPD::fine":(player,name,discription,amount)=>{
		let pl = mp.players.findName(name);
		if(!pl) return player.alert('Игрок не найден');
		amount = parseInt(amount);
		if(discription.length < 2) return player.alert('Вы не написали описание');
		mp.fractions.LSPD.log(`${player.name} выдал штраф ${pl.name} на ${amount}$ за ${discription}`)
		pl.mongoUser.lspd.fines.push({
			discription: discription,
			amount: amount
		})
		if(!pl.mongoUser.$__.saving)pl.mongoUser.save().catch((err)=>console.error(err));
		player.alert('Вы виписали штраф '+pl.name)
		mp.events.call('LSPD::MENU',player)
	},
	"LSPD::LOCKER": (player,name)=>{
		player.locker_fraction = !!!player.locker_fraction;
		if(!player.locker_fraction){
			player.removeAllWeapons();
			player.alert('Вы закончили рабочий день')
			return player.inventory.refetchItems();
		} 
		player.alert('Вы начали рабочий день')
		if (player.gender == 0) {
			player.setClothes(11, 55, 0, 0);
			player.setClothes(3, 0, 0, 0)
			player.setClothes(8, 130, 0, 0)
			player.setClothes(4, 35, 0, 0)
			player.setClothes(6, 25, 0, 0)
			player.setProp(0,-1, 0);
		}else{
			player.setClothes(11, 48, 0, 0)
			player.setClothes(3, 14, 0, 0)
			player.setClothes(8, 152, 0, 0)
			player.setClothes(4, 34, 0, 0)
			player.setClothes(6, 64, 0, 0)
			player.setProp(0,-1, 0);
		}							
	},
})
mp.events.add({
	"LSPD::ATACH":(player,pl)=>{
		pl = mp.players.at(parseInt(pl));
		let atach = !!pl.getVariable('LSPD::ATACH');
		if(atach)return player.alert('Другой игрок уже перетаскивает этого игрока');
		pl.call('LSPD::Attach',[player.id,pl.id]);
		pl.setVariable('LSPD::ATACH',true);
		pl.setVariable('LSPD::ATACH_ID',player.id);
	},
	"LSPD::UNTACH":(player,pl)=>{
		pl = mp.players.at(parseInt(pl));
		let atach = !!pl.getVariable('LSPD::ATACH');
		if(!atach)return player.alert('Игрок не перетаскивается');
		pl.call('LSPD::UNTACH',[player.id,pl.id]);
		pl.setVariable('LSPD::ATACH',false);
		pl.setVariable('LSPD::ATACH_ID',null);
	},
	"LSPD::CUFF":(player,pl,broadcast = true)=>{
		if(!player.locker_fraction) return player.alert('Вы не надели униформу')
		pl = mp.players.at(pl);
		let cuff = !pl.getVariable('LSPD::CUFF');
		pl.setVariable('LSPD::CUFF',cuff);
		if(cuff){
			if(broadcast)mp.events.callCommand('me',player,` надел${player.gender?'а':''} наручники ${ pl.name }`);
			let cuffId = [41,25]
			pl.setClothes(7, cuffId[pl.gender], 0, 0);
			pl.playAnimation('mp_arresting', 'idle', 1, 53);
			pl.setVariable('LSPD::CUFF_PLAYER',player);
			player.setVariable('LSPD::CUFFING_PLAYER',pl)
			pl.call("LSPD::CUFF", [''+true]);		
		}else{
			if(broadcast)mp.events.callCommand('me',player,` снял${player.gender?'а':''} наручники с ${ pl.name }`);
			pl.setClothes(7, 0, 0, 0);
			pl.stopAnimation();
			if(pl.getVariable('LSPD::ATACH')) pl.call('LSPD::UNTACH',[player.id,pl.id]);
			pl.setVariable('LSPD::CUFF_PLAYER',undefined);
			player.setVariable('LSPD::CUFFING_PLAYER',undefined)
			pl.call("LSPD::CUFF", [''+false]);
		}
	},
	"LSPD::MENU":(player)=>{
		let search_online = [];
		mp.players.forEach((pl)=>{
			try{
				if(pl.loggined){
					if(pl.mongoUser.lspd.stars > 0) search_online.push({
						name: pl.name,
						stars: pl.mongoUser.lspd.stars
					}); 
				}
			}catch(e){
				console.error(e)
			}
		});
		let chang = [];
		challenges.forEach((call)=>{
			chang.push({
				name: mp.players.at(call.id).name,
				discription: call.discription
			})
		})
		let online_staff = []
		let online = mp.fractions.LSPD.getOnlineMembers();
		for (let i = 0; i < online.length; i++) {
			online_staff.push({
				name: online[i].name,
				rank: online[i].mongoUser.fraction.rank
			}) 
		}
		player.fractionEval(`
				lspd_menu.search_online = ${JSON.stringify(search_online)};
				lspd_menu.challenges = ${JSON.stringify(chang)};
				lspd_menu.online_staff = ${JSON.stringify(online_staff)};
		`)

	},
	"LSPD::TRANSMITTER_START":(player)=>{
		player.fraction.getOnlineMembers().forEach((pl)=>{
			player.enableVoiceTo(pl);
		})
	},
	"LSPD::TRANSMITTER_END":(player)=>{
		player.fraction.getOnlineMembers().forEach((pl)=>{
			player.disableVoiceTo(pl);
		})
	},
	"LSPD::ATTENDANT":(player)=>{
		if(!player.locker_fraction) return player.alert('Вы не надели униформу')
		if(!player.getVariable('LSPD::CUFFING_PLAYER'))return player.alert('Вы никому не надели наручники')
		let cuffPlayer = player.getVariable('LSPD::CUFFING_PLAYER');
		if(player.dist(cuffPlayer.position) > 5)return player.alert(`${cuffPlayer.name} слишком долеко от вас`);
		let menu = {
			name: 'LSPD',
			items: [
				{
					type: 2,
					name: 'Посадить в тюрьму '+cuffPlayer.name,
					infomenu: {
						name: 'Посадить',
						items: [
							{
								type: 1,
								name: 'Посадить',
								callback: 'LSPD::LAND',
							},
						]
					}
				}
			]
		}
		player.createmenuv(menu);
	},
	"LSPD::ARMS":(player)=>{
		if(!player.locker_fraction) return player.alert('Сначала начните рабочий день');
		player.call("LSPD::ARMS")
	},
	"LSPD::CALL": (player)=>{
		addCall(player);
	},
	"playerQuit":(player)=>{
		let index = findCallPlayer(player);
		if(index != -1)challenges.splice(index,1);
	},
})
mp.calbackmenuv({
	'LSPD::LAND': (player,array)=>{
		if(!player.locker_fraction) return player.alert('Вы не надели униформу')
		if(!player.getVariable('LSPD::CUFFING_PLAYER'))return player.alert('Вы не надевали наручники')
		let cuffPlayer = player.getVariable('LSPD::CUFFING_PLAYER');
		if(cuffPlayer.mongoUser.lspd.stars == 0 )return player.alert('У игрока нет розыска')
		//Если игрок следует за кем-то то мы отключаем следование
		if(cuffPlayer.getVariable('LSPD::ATACH'))mp.events.call('LSPD::UNTACH',player,cuffPlayer.id)
		let time = cuffPlayer.mongoUser.lspd.stars*10;
		player.fraction.broadcast(`${player.name} посадил ${cuffPlayer.name} за ${cuffPlayer.mongoUser.lspd.discription} на ${time}м.`)
		mp.events.call('LSPD::CUFF',player,cuffPlayer.id,false);
		// каждая звезда + 10 минут к заключению
		jail(cuffPlayer,time,cuffPlayer.mongoUser.lspd.discription);
		cuffPlayer.mongoUser.lspd.stars = 0;
		cuffPlayer.mongoUser.jail.discription = cuffPlayer.mongoUser.lspd.discription;
		cuffPlayer.mongoUser.jail.article = cuffPlayer.mongoUser.lspd.article;
		cuffPlayer.mongoUser.lspd.discription = '';
		if(!cuffPlayer.mongoUser.$__.saving)cuffPlayer.mongoUser.save().catch((err)=>console.error(err));
	},
	"LSPD::TAKE_ARMS": (player,array)=>{
		if(!!!player.locker_fraction) return player.alert('Сходите в гардеробную и возьмите форму');
		if(player.fraction.name == 'LSPD'){
			let weapons = player.fraction.rank[player.rank].weapons;
			let weapon = weapons[parseInt(array[0])];
			let weaponItem = player.inventory.getItemWeapon(weapon[0]);
			if(!player.inventory.isEmptyWeapon(weaponItem))return player.alert('У вас уже лежит это оружие в инвенторе');
			if(player.armsLastTime[weapon[0]] && Date.now() - player.armsLastTime[weapon[0]] < 300000){
				let minutes =  moment( 300000- (Date.now() - player.armsLastTime[weapon[0]])).format('mm:ss') ;
				return player.alert(`Вы сможете взять еще раз это оружие через ${minutes}`)
			}
			player.armsLastTime[weapon[0]] = Date.now();
			player.giveWeaponAttachment(mp.joaat(weapon[0]),weapon[1]);
		}
	},
	"LSPD::BUY_LICENSE_GUN": (player)=>{
		if(!player.editmoneyCash(-5000,'Права на самолёт'))return;
		if(player.testLicense('gun'))return player.alert('У вас уже есть права на владение оружие')
		let date = moment().add(2, 'months').valueOf();
		addLicense(player,'gun',date)
		player.alert('Вы купили права на владение оружие на 2 месяца')
	}
})
let challenges = [];
mp.events.addCommand({
	'calllspd': (player, discription) => {
		if(discription.length < 4) return player.alert('Вы не написали описание');
		addCall(player, discription)
	},
});



mp.events.addCommand('m', (player, message) => {
	if(!player.fraction || player.fraction.name != 'LSPD') return player.alert(`Вы не состоите в фракции LSPD`,1);
	if(!player.vehicle || !player.vehicle.fraction || player.vehicle.fraction.name != 'LSPD') return player.alert('Вы не сидите в полицейской машине');
	if (!message || !(message.length > 0)) return player.alert(`Вы ничего не написали`,1);
	player.broadcastInRange(40, `<span style='color:#fff'>Мегафон: ${message}</span> `,'#fff',message);
})


function findCallPlayer(player){
	return challenges.findIndex((challenge)=>{
		if(challenges.id === player.id)return true
	})
}

function addCall(player,discription){
	if(findCallPlayer(player) != -1)return player.alert('Вы уже вызвали полицию')
	let text = `${player.name} вызывает полицию`
	challenges.push({
		id: player.id,
		discription: discription
	})
	player.alert('Запрос принят')
	alertLspd(text);
}

function alertLspd(text){
	mp.fractions['LSPD'].getOnlineMembers().forEach((pl)=>{
		pl.alert(text);
	});
}

module.exports.addCall = addCall;