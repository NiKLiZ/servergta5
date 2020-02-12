const user = require('../mongodb/user.js').User;
mp.calbackmenuv('ban',(player,array)=>{
	if(!player.permision['ADMIN::BAN']) return player.alert(`У вас нет прав`,1);
	let pl = mp.players.at(parseInt(array[1]))
	if(!pl) return player.alert(`Игрок под id:${array[1]} не найден`,1)
	if(pl.permision.level > player.permision.level )return player.alert('Игрок выше вас по уровню админа')
	let LiftTimestamp = parseFloat(array[3]) == 0 ? -1 : Math.round(moment().add(parseFloat(array[3],'days').valueOf()/1000));
	let type = parseInt(array[0]);
	console.log(`Игрок ${player.name} забанил ${pl.name} `)
	let reason = array[2];
	let timeBan = `${LiftTimestamp == -1 ? 'Навсегда' : mp.bans.formatUnixTimestamp(LiftTimestamp) }`;
	if(type === 0){
		user.findOneAndUpdate({_id:pl._id},{$set:{ban:true,reason_ban: array[2],LiftTimestamp: LiftTimestamp}},(err,doc)=>{
			if(err){
				player.alert('Ошибка на сервере',1);
			  return console.error(err);
			}
			player.alert('Вы забанили игрока с ником '+pl.name,2,3000)
			pl.notify(`Вы были забанены. \nПричина: ${array[2]}\nКонец бана: \n${timeBan}`);
			pl.kick("Banned from server.");
		})
		mp.bans.banPlayer(array[1],4,array[2],LiftTimestamp).catch(()=>{
			player.alert('Произошла ошибка ',3000)
		})
	}
	if(type === 1){
			mp.bans.banPlayer(array[1],4,array[2],LiftTimestamp).then((l)=>{
				player.alert('Вы забанили игрока с ником '+pl.name,2,3000)
				pl.notify(`Вы были забанены. \nПричина: ${array[2]}\nКонец бана: \n${timeBan}`);
				pl.kick("Banned from server.");
			}).catch(()=>{
				player.alert('Произошла ошибка ',3000)
			})
	}
	if(type === 2){
		user.findOneAndUpdate({_id:pl._id},{$set:{ban:true,Reason: array[2],LiftTimestamp: LiftTimestamp}},(err,doc)=>{
			if(err){
				player.alert('Ошибка на сервере',1);
			  return console.error(err);
			}
			player.alert('Вы забанили игрока с ником '+pl.name,2,3000)
			pl.notify(`Вы были забанены. \nПричина: ${array[2]}\nКонец бана: \n ${timeBan}`);
			pl.kick("Banned from server.");
		})
	}
	mp.players.broadcast(`<span style='color: #8B0000'>Администратор ${player.nameTag} выдал блокировку ${pl.nameTag} ${LiftTimestamp == -1 ? '' : 'до' }${timeBan} по причине: ${reason}</span>`)
	
})
mp.calbackmenuv('ADMIN::DEBAG_SAVEPOS',(player,array)=>{
	if(!player.permision['ADMIN::DEBAG_SAVEPOS']) return player.alert(`У вас нет прав`,1);
	player.savepos();
	player.alert('Координаты сохранились')
})
mp.events.add('ADMIN::CHANGE_GENDER',(player,is)=>{
	player.gender = is;
	player.updateInfoMenu();
})

