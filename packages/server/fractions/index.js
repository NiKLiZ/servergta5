mp.fractions = {};
require('./ems/index.js');
require('./ch/index.js');
require('./lspd/index.js');
require('./army/index.js');
require('./warehouse.js');

mp.events.addCommand({
	'f': (player, message) => {
		if(!player.fraction) return player.alert('Вы не состоите ни в одной фракции');
		if(!message || !message.length) return player.alert('Вы не написали сообщение')
		player.fraction.broadcastPlayer(message,player);
	},
	'ainvite': (player, _,playerID,fractionName) => {
		if(!playerID || !playerID.length)return player.alert('Вы не написали id игрока')
		let pl = mp.players.at(parseInt(playerID));
		if(!player.permision['FRACTION::INVITE'])return player.alert('У вас нет прав')
		if(!fractionName ||  !fractionName.length) return player.alert('Вы не написали фракцию');
		fractionName = fractionName.toLocaleUpperCase();
		if(!pl)return player.alert('Игрок не найден');
		if(pl.mongoUser.warn > 0)return player.alert('У игрока варн')
		let fraction = mp.fractions[fractionName];
		if(!fraction)return player.alert('Фракция не найдена');
		if(pl.mongoUser.fraction && pl.mongoUser.fraction.name == fraction.name) return player.alert('Игрок уже находится в этой фракции')
		if(pl.fraction){
			clearClothesFraction(pl);
			pl.fraction.removeMember(pl);
		}
		fraction.addMember(pl);
		pl.alert('Вас добавили в фракцию '+fraction.name);
		fraction.log(`${player.name} добавил в фракцию ${pl.name}`)
		player.alert(`Вы добавили игрока ${pl.name} в фракцию `+fraction.name);
	},
	'auninvite': (player, _,playerID) => {
		if(!player.permision['FRACTION::UMINVITE'])return player.alert('У вас нет прав')
		let pl = mp.players.at(parseInt(playerID));
		if(!pl)return player.alert('Игрок не найден');
		let fraction = pl.fraction;
		if(!fraction)return player.alert('Фракция у игрока не найден');
		clearClothesFraction(pl);
		fraction.removeMember(pl);
		pl.alert('Вас удалили из фракции '+fraction.name);
		player.alert(`Вы удалили из фракции ${fraction.name} игрока ${pl.name} `);
	},
	'invite': (player, _,playerID,fractionName) => {
		if(!playerID || !playerID.length)return player.alert('Вы не написали id игрока')
		let pl = mp.players.at(parseInt(playerID));
		if(!pl)return player.alert('Игрок не найден');
		if(pl.dist(player.position) > 10)player.alert('Игрок слишком далеко от вас')
		if(!player.permision['FRACTION::INVITE']){
			if(!player.fraction) return player.alert('Вы не состоите в организации')
			if(pl.fraction)return player.alert('Игрок в другой фракции')
			let isleader = player.mongoUser.fraction.rank == player.fraction.rank.length-1;
			if(!isleader || !player.fraction.rank[player.rank].invite) return player.alert('Вы не лидер фракции')
			else{
				fractionName = player.fraction.name;
			}
		} 
		if(!fractionName ||  !fractionName.length) return player.alert('Вы не написали фракцию');
		fractionName = fractionName.toLocaleUpperCase();
		if(pl.mongoUser.warn > 0)return player.alert('У игрока варн')
		let fraction = mp.fractions[fractionName];
		if(!fraction)return player.alert('Фракция не найдена');
		if(pl.mongoUser.fraction && pl.mongoUser.fraction.name == fraction.name) return player.alert('Игрок уже находится в этой фракции')
		if(pl.fraction){
			clearClothesFraction(pl);
			pl.fraction.removeMember(pl);
		}
		fraction.addMember(pl);
		pl.alert('Вас добавили в фракцию '+fraction.name);
		fraction.log(`${player.name} добавил в фракцию ${pl.name}`)
		player.alert(`Вы добавили игрока ${pl.name} в фракцию `+fraction.name);
	},
	"gnews":(player,text)=>{
		if(!player.fraction) return player.alert('Вы не состоите в организации')
		if (!text || !text.length) return player.alert(`Вы не написали текст`);
		if(player.fraction.hasGang || player.fraction.hasMafia)return player.alert('Вы не можете слать новости организации')
		let rangs = player.fraction.rank.length-1;
		let rang = player.mongoUser.fraction.rank;
		let isleader = rang == rangs;
		if(isleader || rang == rangs-1){
			let chat = `<span style='color:#1E90FF'>[Гос. Новости] [${player.fraction.name}] ${player.name}[${player.id}] - ${text}</span>`;
			mp.players.forEach((pl)=>{
				try{
					if(pl.loggined) pl.outputChatBox(chat)
				}catch(e){
					console.error(e)
				}
			})
		}else player.alert('Вы не можете слать новости организации')
	},
	'uninvite': (player, _,playerID) => {
		if(!playerID || !playerID.length)return player.alert('Вы не написали id игрока')
		let pl = mp.players.at(parseInt(playerID));
		if(!pl)return player.alert('Игрок не найден');
		if(!player.permision['FRACTION::UMINVITE']){
			if(!player.fraction) return player.alert('Вы не состоите в фракции')
			let isleader = player.mongoUser.fraction.rank == player.fraction.rank.length-1;
			if(pl.fraction.name != player.fraction.name)return player.alert('Игрок в другой фракции')
			if(!isleader || !player.fraction.rank[player.rank].uninvite) return player.alert('Вы не лидер фракции')
		} 
		let fraction = pl.fraction;
		if(!fraction)return player.alert('Фракция у игрока не найден');
		clearClothesFraction(pl);
		fraction.removeMember(pl);
		pl.alert('Вас удалили из фракции '+fraction.name);
		player.alert(`Вы удалили из фракции ${fraction.name} игрока ${pl.name} `);
	},
	'makeleader': (player, _,playerID,fractionName) => {
		if(!player.permision['FRACTION::MAKELEADER']) return player.alert(`У вас нет прав`,1);
		if(!fractionName ||  !fractionName.length) return player.alert('Вы не написали фракцию');
		fractionName = fractionName.toLocaleUpperCase();
		let pl = mp.players.at(parseInt(playerID));
		if(!pl)return player.alert('Игрок не найден');
		let fraction = mp.fractions[fractionName];
		if(!fraction)return player.alert('Фракция не найдена');
		if(pl.mongoUser.fraction && pl.mongoUser.fraction.name == fraction.name) return player.alert('Игрок уже находится в этой фракции')
		fraction.addMember(pl,true);
		pl.alert('Вы лидер '+fraction.name);
		fraction.log(`${player.name} сделал лидером в фракцию ${pl.name}`)
		player.alert(`${pl.name} стал лидером `+fraction.name);
	},
	'templeader': (player, _,fractionName) => {
		if(!player.permision['FRACTION::TEMPLEADER'])return player.alert('У вас нет прав')
		if(!fractionName ||  !fractionName.length) return player.alert('Вы не написали фракцию');
		fractionName = fractionName.toLocaleUpperCase();
		let fraction = mp.fractions[fractionName];
		if(!fraction)return player.alert('Фракция не найден');
		fraction.addTempleader(player);
		player.alert('Вы слушаете '+fraction.name);
	},
	
	"spawncar":(player)=>{
		if(!player.fraction) return player.alert('Вы не состоите в фракции')
		if(player.mongoUser.fraction.rank != player.fraction.rank.length-1) return player.alert('Вы не лидер фракции')
		player.fraction.spawncar();
		player.alert('Машины заспавнились')
	},
	'frang': (player, _,playerID,rank,reason) => {
		if(player.fraction)
		if(!player.permision['FRACTION::FRANG']) return player.alert(`У вас нет прав`,1);
		let pl = mp.players.at(parseInt(playerID));
		if(!pl)return player.alert('Игрок не найден');
		if(!pl.fraction) return player.alert('Игрок не состоите ни в одной фракции')
		if(!reason ||  !reason.length) return player.alert('Вы не написали причину /frang [id] [+ или - пишите] [причина]');
		if(rank === '+'){
			if(pl.mongoUser.fraction.rank == pl.fraction.rank.length-1) return player.alert('Выше ранга нет');	
			pl.fraction.uprank(pl).then(()=>{
				pl.fraction.log(`${player.name} повысил ранг ${pl.name} за ${reason}`)
				pl.alert('Вам повысили ранг за '+reason);
				player.alert('Вы повысили ранг игроку '+pl.name)
			}).catch((e)=>{
				console.error(e);
				player.alert('Произошла ошибка на сервере во врямя поднятия ранга')
			})
		}
		else if(rank === '-'){
			if(pl.rank == 0){
				mp.events.callCommand('uninvite',player,pl.id)
				return;
			}
			pl.fraction.downrank(pl).then(()=>{
				pl.fraction.log(`${player.name} понизил ранг ${pl.name} за ${reason}`)
				pl.alert('Вам понизили ранг за '+reason);
				player.alert('Вы понизили ранг игроку '+pl.name)
			}).catch((e)=>{
				console.error(e);
				player.alert('Произошла ошибка на сервере во врямя поднятия ранга')
			})

		}else  if(!isNaN(parseInt(rank)) && parseInt(rank) != 0){
			rank = parseInt(rank);
			if(pl.rank == 0 && rank == -1){
				mp.events.callCommand('uninvite',player,pl.id)
				return;
			}
			if(!pl.fraction.rank[pl.rank+rank]) return player.alert(`Такого ранга не существует`)
			pl.fraction.uprank(pl,rank).then(()=>{
				pl.fraction.log(`${player.name} ${ pl.rank > rank?'повысил':'понизил'} ранг на ${rank} игроку ${pl.name} за ${reason}`)
				pl.alert(`Вам ${ rank > 0?'повысили':'понизили'} ранг на ${rank} за ${reason}`);
				player.alert(`Вы ${ rank > 0?'повысили':'понизили'} ранг игроку ${pl.name}`);
			}).catch((e)=>{
				console.error(e);
				player.alert('Произошла ошибка на сервере во врямя изменения ранга')
			});
		}else player.alert('Неправильно введён ранг')
	}
});

let fractionUnInvite = (player,pl)=>{
	
	if(!player.fraction)return player.alert('Вы не состоит в фракции');
	if(player.mongoUser.fraction.rank != player.fraction.rank.length-1  && !player.fraction.rank[player.rank].clear && player != pl) return player.alert('Вы не можете это сделать')
	clearClothesFraction(pl);
	pl.alert(`${player == pl?'Вы':'Вас'} исключили из фракции`)
	pl.fraction.log(`${player.name} исключил из фракции ${pl.name}`)
	pl.fraction.removeMember(pl)
	pl.removeAllWeapons();
	pl.inventory.refetchClothes();
}

mp.events.push({
	"FRACTION::EMPLOYEES_FIND": (player,name)=>{
		let pl = mp.players.findName(name);
		if(!pl) return player.alert('Игрок не найден')
		player.setNewWaypoint(pl.position);
		player.alert('Метка поставлена')
	},
	"FRACTION::EMPLOYEES_UP": (player,name)=>{
		let pl = mp.players.findName(name);
		if(!pl) return player.alert('Игрок не найден')
		if(!player.permision['FRACTION::FRANG']){
			if(player.mongoUser.fraction.rank != player.fraction.rank.length-1 && !player.fraction.rank[player.rank].FRang) return player.alert('Вы не можете повышать ранг')
			if(player.fraction.rank[player.rank].FRang && player ==  pl)return player.alert('Вы не можете поднять свой ранг')
			if(player.fraction.rank[player.rank].FRang && pl.rank+1 > player.rank )return player.alert('Вы не можете поднять выше своего ранга')
		}
		if(!pl.fraction)return player.alert('Игрок не в фракции');
		if(pl.mongoUser.fraction.rank == player.fraction.rank.length-1) return player.alert('Выше ранга нет');	
		let menuName = player.fraction.menuName;
		pl.fraction.uprank(pl).then(()=>{
			player.fraction.log(`${player.name} повысил игрока ${pl.name}`)
		}).catch((err)=>{
			player.alert('Произошла ошибка',1)
			mp.events.call(`${menuName}::MENU`,player)
		});
		mp.events.call(`${menuName}::MENU`,player)
	},
	"FRACTION::EMPLOYEES_DOWN": (player,name)=>{
		let pl = mp.players.findName(name);
		if(!pl) return player.alert('Игрок не найден')
		if(!player.permision['FRACTION::FRANG']){
			if(player.mongoUser.fraction.rank != player.fraction.rank.length-1 && !player.fraction.rank[player.rank].FRang) return player.alert('Вы не можете понижать ранг')
			if(player.rank <= pl.rank && !player.permision['FRACTION::FRANG'])return player.alert('Игрок выше вас рангом');
			if(player.fraction.rank[player.rank].FRang && pl.rank >= player.rank) return player.alert('Вы не можете понизить ранг у того, кого он выше вашего.')
		}
		if(pl.mongoUser.fraction.rank == 0) return player.alert('Ниже ранга нет');	
		let menuName = player.fraction.menuName;
		pl.fraction.downrank(pl).then(()=>{
			player.fraction.log(`${player.name} понизил игрока ${pl.name}`)
		}).catch((err)=>{
			player.alert('Произошла ошибка',1)
			mp.events.call(`${menuFraction}::MENU`,player)
		});
		mp.events.call(`${menuName}::MENU`,player)
	},
	"FRACTION::EMPLOYEES_CLEAR": (player,name)=>{
		let pl = mp.players.findName(name);
		if(!pl) return player.alert('Игрок не найден')
		if(!player.fraction) return player.alert('Вы не состоите в фракции')
		let isleader = player.mongoUser.fraction.rank == player.fraction.rank.length-1;
		if(pl.fraction.name != player.fraction.name)return player.alert('Игрок в другой фракции')
		if(!isleader || !player.fraction.rank[player.rank].uninvite) return player.alert('Вы не лидер фракции')
		fractionUnInvite(player,pl);

	},
	"FRACTION::WARN_UP":(player,name)=>{
		let pl = mp.players.findName(name);
		if(!pl) return player.alert('Игрок не найден')
		if(!player.fraction.rank[player.rank].upWarn) return player.alert('Вы не можете давать варн игроку')
		if(player.rank <= pl.rank && !player.permision['FRACTION::FRANG'])return player.alert('Игрок выше вас рангом');
		if(player == pl)return player.alert('Вы не можете выдать себе варн')
		if(pl.mongoUser.warn >=  2 && !player.fraction.rank[player.rank].lastWarn)return player.alert('Только лидер фракции может выдать 3 варн');
		pl.mongoUser.fraction.warn += 1;
		pl.alert(`${player.name} выдал варн`)
		if(!pl.mongoUser.$__.saving)pl.mongoUser.save().catch((err)=>{console.error(err)}); 
		player.fraction.log(`${player.name} выдал варн ${pl.name}`);
		player.alert('Вы выдали варн '+pl.name)
		mp.events.call(`${player.fraction.menuName}::MENU`,player)
		if(pl.mongoUser.fraction.warn >= 3){
			fractionUnInvite(player,pl);
		}
	},
	"FRACTION::WARN_DOWN":(player,name)=>{
		let pl = mp.players.findName(name);
		if(!pl) return player.alert('Игрок не найден')
		if(!player.fraction.rank[player.rank].downWarn) return player.alert('Вы не можете снять варн')	
		if(player.rank <= pl.rank)return player.alert('Игрок выше вас рангом');
		if(pl.mongoUser.fraction.warn == 0)return player.alert('У игрока нет варнов')
		if(player == pl)return player.alert('Вы не можете снять у себя варн')
		pl.mongoUser.fraction.warn -= 1;
		pl.alert(`${player.name} снял варн`)
		if(!pl.mongoUser.$__.saving)pl.mongoUser.save().catch((err)=>{console.error(err)}); 
		player.fraction.log(`${player.name} выдал варн ${pl.name}`);
		player.alert('Вы сняли варн '+pl.name)
		mp.events.call(`${player.fraction.menuName}::MENU`,player)
	},
	"FRACTION::GIVE_AWARD":(player)=>{
		player.alert('Вы дали игроку премиальные')
	},
	"FRACTION::SHOW_DOCUMENT":(pl,id)=>{
		let player = mp.players.at(parseInt(id));
		let nameRank = player.fraction.rank[player.mongoUser.fraction.rank].name;
		if(!player)return;
		let info = {
			"Имя": player.mongoUser.name,
			"Фракция": player.fraction.name,
			"Фамилия": player.mongoUser.surname,
			'Должность': `${nameRank} - ${player.mongoUser.fraction.rank} `,
			"title": 'Удостоверение'
		}
		pl.call('DOCUMENT::SHOW',[JSON.stringify(info)]);
		pl.alert('Вам показали удостоверение')
	}
})
let clearClothesFraction = (pl)=>{
	if(pl.locker_fraction){
		if(pl.fraction.name == 'LSPD')mp.events.call('LSPD::LOCKER',pl);
		if(pl.fraction.name == 'EMS')mp.events.call('EMS::LOCKER',pl);
		if(pl.fraction.name == 'CH')mp.events.call('CH::LOCKER',pl);
	}
}
mp.events.add({
	"playerEnterVehicle":(player, vehicle,seat)=>{
		if(seat == -1){
			if(vehicle.fraction){
				if(player.fraction && player.fraction.name === vehicle.fraction.name && vehicle.rank <= player.rank){
					
				}
				else{
					player.removeFromVehicle();
					player.alert('Вы не можете садится за руль этой машины')
				} 
			}
		}
	}
})