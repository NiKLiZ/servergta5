let {Init,save} = require('../a/functions/coorder.js');
let permisions = require('../player/permision.js');
let {jail,unJail} = require('../fractions/lspd/jail.js');
let addDriving = require('../testpdd/index').addDriving
const user = require('../mongodb/user.js').User;
const moment = require('moment');
let {respawnPlayer} = require('../events/deat');
let BanModel = require('../mongodb/ban').ban;
let playerInit = require('../player/init/player');
let { addMessageReport } = require('../commands/index');

mp.events.addCommand('veh', (player, _, vehName) => {
	if(!player.permision['COMMAND::CREATE_VEH']) return player.alert(`У вас нет прав`,1);
    if (vehName && vehName.length > 0) {
        let pos = player.position;
        pos.x += 2;
        // If player has vehicle - change model.
        if (player.veh) {
                player.veh.position = pos;
                player.veh.model = mp.joaat(vehName);
                player.veh.dimension = player.dimension;
		// Else - create new vehicle.
        } else {
            player.veh = mp.vehicles.new(mp.joaat(vehName), pos,{
                numberPlate: "ADMIN",
                dimension: player.dimension
            });
		}
    } else
        player.alert(`Вы не написали название машины`);
});

mp.events.addCommand('vehdel', (player, _, vehName) => {
    if(!player.permision['COMMAND::CREATE_VEH']) return player.alert(`У вас нет прав`,1);
    if(!player.veh)return player.alert('У вас нет админской машины');
    player.veh.destroy();
    player.veh = undefined;
    player.alert('Машина удалена')
});

mp.events.addCommand('vehon', (player, _, vehName) => {
	if(!player.permision['COMMAND::CREATE_VEHS']) return player.alert(`У вас нет прав`,1);
    if (vehName && vehName.length > 0) {
        if(!player.vehs) player.vehs = [];
        let pos = player.position;
        pos.x += 2;
        // If player has vehicle - change model.
        player.vehs.push(mp.vehicles.new(mp.joaat(vehName), pos,{
            numberPlate: "ADMIN",
            dimension: player.dimension
        }));
		
    } else
        player.alert(`Вы не написали название машины`);
});
mp.events.addCommand('vehoff', (player, _, vehName) => {
    if(!player.permision['COMMAND::CREATE_VEH']) return player.alert(`У вас нет прав`,1);
    if(!player.vehs)return;
    player.vehs.forEach(veh=>veh.destroy());
    player.vehs = [];
});
mp.events.addCommand('noclip', (player, _, speed) => {
    if(!player.permision['COMMAND::NOCLIP']) return player.alert(`У вас нет прав`,1);
    speed = parseFloat(speed);
    player.call("ADMIN::CHANGE_SPEED_NOCLIP",[speed])
});
mp.events.addCommand('changetime', (player, _, hours,minutes) => {
    if(!player.permision['COMMAND::CHANGE_TIME']) return player.alert(`У вас нет прав`,1);
    hours = parseFloat(hours);
    minutes = parseFloat(minutes);
    if(hours && minutes){
        player.call("ADMIN::TIME",[hours,minutes])
    }else{
        player.call("ADMIN::TIME",[false])
    }
});
mp.events.addCommand('rcbandito', (player, _, playerID,level) => {
    if(!player.permision['COMMAND::CREATE_VEH']) return player.alert(`У вас нет прав`,1);
    mp.events.callCommand('veh',player,'','rcbandito')
    player.veh.setTune(41,3);
})
mp.events.addCommand('eval', (player, _, vehName) => {
    if(!player.permision['COMMAND::EVAL']) return player.alert(`У вас нет прав`,1);
    player.eval(_);
})

mp.events.addCommand('kick', (player, _, id,...reason) => {
	if(!player.permision['COMMAND::KICK']) return player.alert(`У вас нет прав`,1);
   	let sourcePlayer = mp.players.at(parseInt(id));
    if (!sourcePlayer) return player.alert(`Игрок не найден под id ${id}`,1);
    if (!reason || !reason.length) return player.alert(`Синтаксическая ошибка</b> /kick [player_id] [text]`);
    reason = reason.join(' ');
    if(sourcePlayer.permision.level > player.permision.level) return player.alert('Игрок которого вы пытаетесь кикнуть выше вас рангом')
    mp.players.broadcast(`<span style='color: #CD5C5C'>Администратор ${player.name}[${player.id}] кикнул ${sourcePlayer.name} по причине: ${reason}</span>`)
    player.alert('Вы кикнули игрока '+sourcePlayer.name)
    sourcePlayer.kick(reason);
});

mp.events.addCommand('ban', (player, _, playerID,time,...reason) => {
    if(!player.permision['COMMAND::BAN']) return player.alert(`У вас нет прав`,1);
    if (!playerID || !playerID.length) return player.alert('Вы не ввели id игрока /ban [id] [время] [причина]');
    if (!time || !time.length) return player.alert(`Вы не ввели время /ban [id] [время] [причина]`);
    if (!reason || !reason.length) return player.alert('Вы не ввели причинау бана игрока /ban [id] [время] [причина]');
    reason = reason.join(' ');   
    let sourcePlayer = mp.players.at(parseInt(playerID));
    if (!sourcePlayer) return player.alert(`Игрок не найден под id ${id}`,1);
    if(sourcePlayer.permision.level > player.permision.level) return player.alert('Игрок которого вы пытаетесь кикнуть выше вас рангом')
    let LiftTimestamp = parseFloat(time) == 0 ? -1 : mp.bans.getUnixTimestamp()+(parseFloat(time)*24*60*60);
    let timeBan = `${LiftTimestamp == -1 ? 'Навсегда' : time+' дней' }`;
    mp.players.broadcast(`<span style='color: #8B0000'>Администратор ${player.name}[${player.id}] выдал блокировку ${sourcePlayer.nameTag}${LiftTimestamp == -1 ? '' : 'на ' } ${timeBan} по причине: ${reason}</span>`)
    user.findOneAndUpdate({_id:sourcePlayer._id},{$set:{ban:true,reason_ban: reason,LiftTimestamp: LiftTimestamp}},(err,doc)=>{
        try{
            if(err){
                player.alert('Ошибка на сервере',1);
              return console.error(err);
            }
            player.alert('Вы забанили игрока с ником '+sourcePlayer.name,2,3000)
            sourcePlayer.notify(`Вы были забанены. \nПричина: ${reason}\nКонец бана: \n${timeBan}`);
            sourcePlayer.kick("Banned from server.");
        }catch(e){
            console.error(e)
        }
    })
});

mp.events.addCommand('unban', (player, _, name,surname) => {
    if(!player.permision['COMMAND::BAN']) return player.alert(`У вас нет прав`,1);
    if (!name || !name.length) return player.alert('Вы не ввели имя /offjail [Имя] [Фимилия]');
    if (!surname || !surname.length) return player.alert('Вы не ввели фамилию /offjail [Имя] [Фимилия]');
    user.findOneAndUpdate({name: new RegExp(name, "i") ,surname: new RegExp(surname, "i")},{ban: false},(err,done)=>{
        try{
            if(err){
                player.alert('Ошибка на сервере',1);
              return console.error(err);
            }
            if(done){
                player.alert('Игрок разбанен')
            }else{
                player.alert('Игрок не найден')
            }
        }catch(e){
            console.error(e);
        }
    })
});

mp.events.addCommand('skick', (player, _, id,...reason) => {
	if(!player.permision['COMMAND::SKICK']) return player.alert(`У вас нет прав`,1);
   	let sourcePlayer = mp.players.at(parseInt(id));
    if (!sourcePlayer) return player.alert(`Игрок не найден под id ${id}`,1);
    if (!reason || !reason.length) return player.alert(`Синтаксическая ошибка</b> /skick [player_id] [text]`);
    reason = reason.join(' ');
    if(sourcePlayer.permision.level > player.permision.level) return player.alert('Игрок которого вы пытаетесь кикнуть выше вас рангом')
    let text = `<span style='color: #bfbdbd'>${player.name}[${player.id}]: кикнул ${sourcePlayer.name} по причине: ${reason}</span>`;
    mp.players.forEach((pl)=>{
        try{
            if(pl.loggined && pl.permision.level > 0)pl.outputChatBox(text)
        }catch(e){console.error(e)}
    })
    player.alert('Вы кикнули игрока '+sourcePlayer.name)
    sourcePlayer.kick(reason);
});
mp.events.addCommand('gh', (player, _, playerID) => {
    if(!player.permision['COMMAND::GH']) return player.alert(`У вас нет прав`,1);
    if (playerID && playerID.length > 0) {
        let sourcePlayer = mp.players.at(parseInt(playerID));
        if (sourcePlayer) {
            if(!sourcePlayer.loggined)return player.alert('Игрок не вошел')
            let playerPos = player.position;
            playerPos.x += 1;
            sourcePlayer.position = playerPos;
            sourcePlayer.dimension = player.dimension;
            sourcePlayer.alert(`Вы были телепортированы администратором ${player.nameTag}`)
        } else
            player.alert(`Игрок не найден`,1);
                 
    } else
        player.alert(`Синтаксическая ошибка</b> /warp [player_id]`);
});
mp.events.addCommand('tp', (player, _, playerID) => {
    if(!player.permision['COMMAND::TP']) return player.alert(`У вас нет прав`,1);
    if (playerID && playerID.length > 0) {
        let sourcePlayer = mp.players.at(parseInt(playerID));
        if (sourcePlayer) {
            if(!sourcePlayer.loggined) return player.alert('Игрок не вошел в игру')
            let playerPos = sourcePlayer.position;
            playerPos.x += 1;
            player.position = playerPos;
            player.dimension = sourcePlayer.dimension;
        } else
            player.alert(`Игрок не найден`,1);
                 
    } else
        player.alert(`Синтаксическая ошибка</b> /tp [player_id]`);
});
mp.events.addCommand('rc', (player, _, playerID) => {
    if(!player.permision['COMMAND::RC']) return player.alert(`У вас нет прав`,1);
    if ((!playerID || !playerID.length)){ 
        player.rc = null;
        player.setVariable('visible',true);
        player.dimension = player.rcDimension;
        delete player.rcDimension;
        player.hasRc = false;
        return player.call('remotecamera',[-1]);
    }
    else {
        let sourcePlayer = mp.players.at(parseInt(playerID));
        if(sourcePlayer == player)return player.alert('Вы не можете смотреть за собой')
        if (sourcePlayer) {
            if(sourcePlayer.hasRc)return player.alert('Игрок следит за другим игроком')
            player.rcDimension = player.dimension;
            player.dimension = sourcePlayer.dimension;
            player.rc = sourcePlayer.id;
            player.hasRc = true;
            player.setVariable('visible',false);
            player.call('remotecamera',[sourcePlayer.id,JSON.stringify(sourcePlayer.position)]);
            player.position = sourcePlayer.position
        } else
            player.alert(`Игрок не найден`,1);
    }
});
mp.events.addCommand('mute', (player, _, playerID,time,...reason) => {
    if(!player.permision['COMMAND::MUTE']) return player.alert(`У вас нет прав`,1);
    if (!playerID || !playerID.length) return player.alert('Вы не ввели id игрока /mute [id] [время] [причина]');
    let sourcePlayer = mp.players.at(parseInt(playerID));
    if (!sourcePlayer) return player.alert(`Игрок не найден`,1);
    if(!sourcePlayer.mute){
        if (!reason || !reason.length) return player.alert(`Вы не ввели причину /mute [id] [время] [причина]`);
        if (!time || !time.length) return player.alert(`Вы не ввели время /mute [id] [время] [причина]`);
        reason = reason.join(' ');
        if(isNaN(parseInt(time))) return player.alert('Время введено неверно')
        if(sourcePlayer.permision.level > player.permision.level) return player.alert('Игрок которого вы пытаетесь замутить выше вас рангом')
        mp.players.broadcast(`<span style='color: #CD5C5C'>Администратор ${player.name}[${player.id}] выдал мут ${sourcePlayer.name} на ${time} минут по причине: ${reason}</span>`)
        player.alert(`Игрок замучен`);
        sourcePlayer.outputChatBox(`Вас замутил ${player.nameTag} за ${reason} на ${time}м.`)
        let date = new Date(player.mongoUser.time_game);
        date = date.setMinutes(date.getMinutes() + parseInt(time))
        sourcePlayer.mute = true;
        sourcePlayer.mongoUser.mute.time = date;
        sourcePlayer.call("VOICE::MUTE",[true])
        if(!sourcePlayer.mongoUser.$__.saving)sourcePlayer.mongoUser.save().catch(err=>{console.error(err)})
    } 
    else{
        sourcePlayer.mute = false;
        sourcePlayer.call("VOICE::MUTE",[false])
        sourcePlayer.mongoUser.mute = null;
        if(!sourcePlayer.mongoUser.$__.saving)sourcePlayer.mongoUser.save().catch(err=>{console.error(err)})
        player.alert(`Игрок размучен`);
        sourcePlayer.outputChatBox(`Вас размутил ${player.nameTag}`)
    } 
});
mp.events.addCommand('smute', (player, _, playerID,time,reason) => {
    if(!player.permision['COMMAND::SMUTE']) return player.alert(`У вас нет прав`,1);
    if (!playerID || !playerID.length) return player.alert('Вы не ввели id игрока /smute [id] [время] [причина]');
    let sourcePlayer = mp.players.at(parseInt(playerID));
    if (!sourcePlayer) return player.alert(`Игрок не найден`,1);
    if(!sourcePlayer.mute){
        if (!reason || !reason.length) return player.alert(`Вы не ввели причину /smute [id] [время] [причина]`);
        if (!time || !time.length) return player.alert(`Вы не ввели время /smute [id] [время] [причина]`);
        if(isNaN(parseInt(time))) return player.alert('Время введено не верно')
        if(sourcePlayer.permision.level > player.permision.level) return player.alert('Игрок которого вы пытаетесь замутить выше вас рангом')
        let text = `<span style='color: #bfbdbd'>${player.permision.nameTag}: ${player.name}[${player.id}] выдал мут ${sourcePlayer.name} на ${time} минут по причине: ${reason}</span>`;
        mp.players.forEach((pl)=>{
            try{
                if(pl.loggined && pl.permision.level > 0)pl.outputChatBox(text)
            }catch(e){console.error(e)}
        })
        player.alert(`Игрок замучен`);
        sourcePlayer.outputChatBox(`Вас замутил ${player.nameTag} за ${reason} на ${time}м.`)
        let date = new Date(player.mongoUser.time_game);
        date = date.setMinutes(date.getMinutes() + parseInt(time))
        sourcePlayer.mute = true;
        sourcePlayer.mongoUser.mute.time = date;
        sourcePlayer.call("VOICE::MUTE",[true])
        if(!sourcePlayer.mongoUser.$__.saving)sourcePlayer.mongoUser.save().catch(err=>{console.error(err)})
    } 
    else{
        sourcePlayer.mute = false;
        sourcePlayer.call("VOICE::MUTE",[false])
        sourcePlayer.mongoUser.mute = null;
        if(!sourcePlayer.mongoUser.$__.saving)sourcePlayer.mongoUser.save().catch(err=>{console.error(err)})
        player.alert(`Игрок размучен`);
        sourcePlayer.outputChatBox(`Вас размутил ${player.nameTag}`)
    } 
});



mp.events.addCommand('tpc', (player, _, x, y ,z) => {
    if(!player.permision['COMMAND::TPC']) return player.alert(`У вас нет прав`,1);
    if (parseFloat(x) && parseFloat(y) && parseFloat(z) || _.indexOf(',') != -1)
        if(_.indexOf(',') == -1) player.position = new mp.Vector3(parseFloat(x),parseFloat(y),parseFloat(z));
        else{
            let pos = _.split(',')
             player.position = new mp.Vector3(parseFloat(pos[0]),parseFloat(pos[1]),parseFloat(pos[1]));
        }
    else
        player.alert(`Синтаксическая ошибка</b> /tp [x] [y] [z]`);
});
mp.events.addCommand('emoney', (player, _, money,id) => {
    if(!player.permision['COMMAND::EMONEY']) return player.alert(`У вас нет прав`,1);
    if(id){
        let pl = mp.players.at(parseInt(id))
        if(pl){
            if(!pl.loggined)return player.alert('Игрок не вошел')
            pl.editmoneyCash(parseInt(money),'Администратор '+player.name);
            player.alert(`Вы ${money < 0 ? 'отняли у игрока' : 'дали игроку'} ${money}$`);
        }
        else player.alert('Игрок не найден')
        return;
    }
    money = parseInt(money)
    if(isNaN(money))return player.alert('Деньги введены не верны')
    player.editmoneyCash(money,'Администратор '+player.name);
    player.alert(`Вы ${money < 0 ? 'отняли у себя' : 'дали себе' } ${money}$`)
});
mp.events.addCommand('pos', (player, _, money) => {
    if(!player.permision['COMMAND::POS']) return player.alert(`У вас нет прав`,1);
    let pos = player.position;
    player.outputChatBox(`x:${pos.x} y:${pos.y} z:${pos.z} `);
});
mp.events.addCommand('spos', (player, _, money) => {
     if(!player.permision['COMMAND::SPOS']) return player.alert(`У вас нет прав`,1);
    let p = player.position;
    save(`new mp.Vector3(${p.x},${p.y},${p.z}),`);
});
mp.events.addCommand('repair', (player) => {
    if(!player.permision['COMMAND::REPAIR']) return player.alert(`У вас нет прав`,1);
    if(player.vehicle) player.vehicle.repair();
    else player.alert('Вы не сидите в машине');
})
mp.events.addCommand('getcar', (player, _, vehid) => {
    if(!player.permision['COMMAND::GETCAR']) return player.alert(`У вас нет прав`,1);
    let veh = mp.vehicles.at(parseInt(vehid));
    if(!veh) return player.alert(`Машина не найдена`,1);
    veh.position = player.position;
    veh.dimension = player.dimension;
});
mp.events.addCommand('gotocar', (player, _, vehid) => {
    if(!player.permision['COMMAND::GOTOCAR']) return player.alert(`У вас нет прав`,1);
    let veh = mp.vehicles.at(parseInt(vehid));
    if(!veh) return player.alert(`Машина не найдена`,1);
    player.putIntoVehicle(veh,-1)
});
mp.events.addCommand('givew', (player, _, weapon,playerID) => {
    if(!player.permision['COMMAND::GIVEW']) return player.alert(`У вас нет прав`,1);
    if(!weapon) return player.alert(`Вы не написали название оружия`);
    if(playerID){
        let sourcePlayer = mp.players.at(parseInt(playerID));
        if(!sourcePlayer) return player.alert(`Игрок не найден`,1);
        if(!sourcePlayer.loggined) return player.alert('Игрок не вошел в игру')
        sourcePlayer.giveWeaponAttachment(mp.joaat(weapon), 1000);
    }else{
        player.giveWeaponAttachment(mp.joaat(weapon), 1000);
    }
});

mp.events.addCommand('hp', (player, _, playerID,hp) => {
    if(!player.permision['COMMAND::HP']) return player.alert(`У вас нет прав`,1);
    if (!playerID || !playerID.length) return player.alert(`Синтаксическая ошибка</b> /hp [player_id] [hp]`);
    if (!hp || !hp.length) return player.alert(`Синтаксическая ошибка</b> /hp [player_id] [hp]`);
    let sourcePlayer = mp.players.at(parseInt(playerID));
    if(!sourcePlayer) return player.alert(`Игрок не найден`,1);
    if(!sourcePlayer.loggined) return player.alert('Игрок не вошел в игру')
    hp = parseInt(hp);
    if(isNaN(hp)) return player.alert('hp введен неверно')
    if(sourcePlayer.deat && hp > 0){
        respawnPlayer(player,player.position)
    }
    sourcePlayer.health = hp;
});
mp.events.addCommand('setfuel', (player, _, playerID,fuel) => {
    if(!player.permision['COMMAND::SETFUEL']) return player.alert(`У вас нет прав`,1);
    if(!playerID || !playerID.length) return player.alert(`Синтаксическая ошибка</b> /setfuel [player_id] [fuel]`);
    if(!fuel || !fuel.length ) return player.alert(`Синтаксическая ошибка</b> /setfuel [player_id] [fuel]`);
    let sourcePlayer = mp.players.at(parseInt(playerID));
    if(!sourcePlayer) return player.alert(`Игрок не найден`,1);
    if(!sourcePlayer.loggined) return player.alert('Игрок не вошел в игру')
    if(!sourcePlayer.vehicle) return player.alert('Игрок не сидит в машине')
    if(isNaN(parseInt(fuel))) return player.alert('fuel введен неверно')
    let veh = sourcePlayer.vehicle
    veh.setVariable('petrol', parseInt(fuel) < veh.getVariable('MAX_PETROL')? parseInt(fuel) : veh.getVariable('MAX_PETROL'))
});

mp.events.addCommand('sp', (player, _, playerID,...text) => {
    if(!player.permision['COMMAND::SP']) return player.alert(`У вас нет прав`,1);
    if (!playerID || !playerID.length) return player.alert(`Синтаксическая ошибка</b> /sp [player_id] [text]`);
    if (!text || !text.length) return player.alert(`Синтаксическая ошибка</b> /sp [player_id] [text]`);
    let sourcePlayer = mp.players.at(parseInt(playerID));
    if(!sourcePlayer) return player.alert(`Игрок не найден`,1);
    if(!sourcePlayer.loggined) return player.alert('Игрок не вошел в игру')
    text = text.join(' ');
    let chat = `<span style='color: #edda2f'>[ANS] ${player.name}[${player.id}] ответил ${sourcePlayer.nameTag}: ${text}</span>`
    mp.players.forEach((pl)=>{
        try{
            if(pl.loggined && pl.permision.level > 1) pl.outputChatBox(chat);
        }catch(e){
            console.error(e)
        }
    })
    sourcePlayer.outputChatBox(`Ответ Администратора ${player.name}[${player.id}]: ${text}`);
    player.outputChatBox(`Вы написали ${sourcePlayer.nameTag}: ${text}`);
    player.alert('Вы написали '+sourcePlayer.name);
    addMessageReport(player,`${player.name}: ${text}`,true)
});
mp.events.addCommand('ao', (player, text) => {
    if(!player.permision['COMMAND::GLOBAL_CHAT']) return player.alert(`У вас нет прав`,1);
    if (!text || !text.length) return player.alert(`Вы не написали текст`);
    let chat = `<span style='color:#ef2323'>[GLOBAL] ${player.name}[${player.id}]: ${text}</span>`;
    mp.players.forEach((pl)=>{
        try{
            if(pl.loggined) pl.outputChatBox(chat)
        }catch(e){
            console.error(e)
        }
    })
})

mp.events.addCommand('admins', (player, _) => {
    if(!player.permision['COMMAND::ADMINS']) return player.alert(`У вас нет прав`,1);
    let admins = ``;
    mp.players.forEach((pl)=>{
        try{
            if(pl.loggined && pl.permision.level > 1) admins += `<span style='color: #FFFFE0'> ${pl.nameTag} ${pl.permision.level}</span>, `;
        }catch(e){
            console.error(e)
        }
    })
    player.outputChatBox(`<span style='color: #FFFACD'>Администраторы в сети: </span>${admins.length} <br />${admins}`)
});

mp.events.addCommand('stats', (player, _, playerID) => {
    if(!player.permision['COMMAND::STATS']) return player.alert(`У вас нет прав`,1);
    if (!playerID || !playerID.length ) return player.alert(`Синтаксическая ошибка</b> /stats [playerID] `);
    let sourcePlayer = mp.players.at(parseInt(playerID));
    if(!sourcePlayer) return player.alert(`Игрок не найден`,1);
    if(!sourcePlayer.loggined) return player.alert('Игрок не вошел в игру');
    let lastJoin_date = moment(sourcePlayer.mongoUser.lastJoin_date).format('DD.MM.YYYY HH:mm:ss');
    let register_date =   moment(sourcePlayer.mongoUser.register_date).format('DD.MM.YYYY HH:mm:ss');
    let gameTime =   moment.duration(sourcePlayer.mongoUser.time_game).locale("ru").humanize();
    player.outputChatBox(` Имя: ${sourcePlayer.nameTag} <br />Последний вход в игру: ${lastJoin_date} <br />Дата регистрации: ${register_date} <br />Денег: ${sourcePlayer.money}$  <br />Время в игре: ${gameTime}`);
});
mp.events.addCommand('slap', (player, _, playerID) => {
    if(!player.permision['COMMAND::SLAP']) return player.alert(`У вас нет прав`,1);
    if (!playerID || !playerID.length ) return player.alert(`Синтаксическая ошибка</b> /slap [playerID] `);
    let sourcePlayer = mp.players.at(parseInt(playerID));
    if(!sourcePlayer) return player.alert(`Игрок не найден`,1);
    if(!sourcePlayer.loggined) return player.alert('Игрок не вошел в игру');
    sourcePlayer.alert(`Вам дал поджопник ${player.name}`)
    let pos = sourcePlayer.position;
    pos.z += 5;
    sourcePlayer.position = pos;
    player.alert(`Вы подкинули игрока ${sourcePlayer.name}`)
});


mp.events.addCommand('makeadmin', (player, _, playerID,level) => {
    if(!player.permision['COMMAND::MAKE_ADMIN']) return player.alert(`У вас нет прав`,1);
    if (!playerID || !playerID.length ) return player.alert(`Синтаксическая ошибка</b> /makeadmin [playerID] [level]`);
    if (!level || !level.length ) return player.alert(`Синтаксическая ошибка</b> /makeadmin [playerID] [level]`);
    if(isNaN(parseInt(level))) return player.alert('level введен неверно')
    let sourcePlayer = mp.players.at(parseInt(playerID));
    if(!sourcePlayer) return player.alert(`Игрок не найден`,1);
    if(!sourcePlayer.loggined) return player.alert('Игрок не вошел в игру');
    let permision = Object.keys(permisions)[parseInt(level)];
    if(!permision) return player.alert('Такого уровня нет');
    player.alert(`Игрок ${sourcePlayer.name} стал ${permision}`);
    sourcePlayer.alert(`Вы стали ${permision}`);
    sourcePlayer.permision = permisions[permision];
    sourcePlayer.updateNametags();
    sourcePlayer.mongoUser.permision = permision;
    if(!player.mongoUser.$__.saving)sourcePlayer.mongoUser.save().catch(err=>{console.error(err)})
    sourcePlayer.updateInfoMenu();
});

mp.events.addCommand('red', (player, text) => {
    if(!player.permision['COMMAND::RED']) return player.alert(`У вас нет прав`,1);
    player.redNick = !player.redNick;
    player.alert(`Вы ${player.redNick ?'включили':'выключили'} красный ник`)
    
    player.updateNametags();
})


mp.events.addCommand('clear',(player)=>{
    if(!player.permision['COMMAND::CLEAR']) return player.alert(`У вас нет прав`,1);
    let chat = `<span style='color: #ffffff'>Администратор ${player.name}[${player.id}] очистил${player.gender ? 'а' : ''} чат</span>`;
	mp.players.forEach((pl)=>{
        try{
            pl.call('CHAT::CLEAR');
            pl.outputChatBox(chat)
        }catch(e){
            console.error(e)
        }
	})
	player.alert('Чат очищен');
})

mp.events.addCommand('jail', (player, _, playerID,time,...reason) => {
    if(!player.permision['COMMAND::JAIL']) return player.alert(`У вас нет прав`,1);
    if (!playerID || !playerID.length) return player.alert('Вы не ввели id игрока /jail [id] [время] [причина]');
    if (!reason || !reason.length) return player.alert(`Вы не ввели причину /jail [id] [время] [причина]`);
    reason = reason.join(' ');
    if (!time || !time.length) return player.alert(`Вы не ввели время /jail [id] [время] [причина]`);
    if(isNaN(parseInt(time))) return player.alert('Время введено неверно')
    if(time > 180)return player.alert('Нельзя сажать больше чем на 180 минут');
    let sourcePlayer = mp.players.at(parseInt(playerID));
    if (!sourcePlayer) return player.alert(`Игрок не найден`,1);
    if(!sourcePlayer.jail){
        if(sourcePlayer.permision.level > player.permision.level) return player.alert('Игрок которого вы пытаетесь посадить выше вас рангом')
        mp.players.broadcast(`<span style='color: #CD5C5C'>Администратор ${player.name}[${player.id}] посадил в тюрьму ${sourcePlayer.name} на ${time} минут по причине: ${reason}</span>`)
        jail(sourcePlayer,time,reason)
        player.alert(`Вы посадили игрока`);
        sourcePlayer.outputChatBox(`Вас посадил ${player.nameTag} за ${reason} на ${time}м.`)
    }
});

mp.events.addCommand('setname', (player, _, id,name,surname,) => {
    if(!player.permision['COMMAND::SETNAME']) return player.alert(`У вас нет прав`,1);
    if (!id || !id.length) return player.alert('Вы не ввели id /setname [id] [Имя] [Фимилия] [время]');
    if (!name || !name.length) return player.alert('Вы не ввели имя /setname [id] [Имя] [Фимилия] [время]');
    if (!surname || !surname.length) return player.alert('Вы не ввели фимилию /setname [Имя] [Фимилия] ');
    let sourcePlayer = mp.players.at(parseInt(id))
    if(!sourcePlayer)return player.alert('Игрок не найден')
    if(!sourcePlayer.loggined)return player.alert('Игрок не вошел')
    sourcePlayer.mongoUser.name = name;
    sourcePlayer.mongoUser.surname = surname;
    sourcePlayer.mongoUser.save().then(()=>{
        player.alert('Ник изменён')
    }).catch((err)=>console.error(err))
    player.name = user.name+" "+user.surname;
    player.nameChat = `%playerName[${user.name} ${user.surname}]% [${player.id}]`;
    player.updateNametags();
});


mp.events.addCommand('offjail', (player, _, name,surname,time,...reason) => {
    if(!player.permision['COMMAND::JAIL']) return player.alert(`У вас нет прав`,1);
    if (!name || !name.length) return player.alert('Вы не ввели имя /offjail [Имя] [Фимилия] [время] [причина]');
    if (!surname || !surname.length) return player.alert('Вы не ввели фамилию /offjail [Имя] [Фимилия] [время] [причина]');
    if (!reason || !reason.length) return player.alert(`Вы не ввели причину /offjail [Имя] [Фимилия] [время] [причина]`);
    if (!time || !time.length) return player.alert(`Вы не ввели время /offjail [Имя] [Фимилия] [время] [причина]`);
    if(isNaN(parseInt(time))) return player.alert('Время введено неверно')
    reason = reason.join(' ');
    user.findOne({name: new RegExp(name, "i") ,surname: new RegExp(surname, "i")},(err,user)=>{
        try{
            if(err){
                player.alert('Ошибка на сервере',1);
                return console.error(err);
            }
            if(user){
                let date = new Date(user.time_game);
                date = date.setMinutes(date.getMinutes() + parseFloat(time));
                user.jail.time = date;
                user.jail.reason = reason;
                if(!user.$__.saving)user.save().catch(err=>{console.error(err)}).then(()=>{
                    player.alert('Игрок посажен')
                })
            }else{
                player.alert('Игрок не найден')
            }
        }catch(e){
            console.error(e);
        }
    })
});



mp.events.addCommand('unjail', (player, _, playerID) => {
    if(!player.permision['COMMAND::JAIL']) return player.alert(`У вас нет прав`,1);
    if (!playerID || !playerID.length) return player.alert('Вы не ввели id игрока /unjail');
    let sourcePlayer = mp.players.at(parseInt(playerID));
    if (!sourcePlayer) return player.alert(`Игрок не найден`,1);
    if(sourcePlayer.jail){
        unJail(sourcePlayer);
        player.alert(`Вы выпустили ${sourcePlayer.name}`);
        sourcePlayer.outputChatBox(`Вас выпустили из деморгана ${player.nameTag}`)
    }else player.alert('Ирок не сидит в тюрьме')
});

mp.events.addCommand('testloadplayer', (player, _, playerID) => {
    if(!player.permision['COMMAND::TEST_LOAD_PLAYERS']) return player.alert(`У вас нет прав`,1);
    if (!playerID || !playerID.length) return player.alert('Вы не ввели id игрока /testloadplayer');
    user.findOne({_id: playerID.toObjectId()}).then((user)=>{
        if(user){
            playerInit(player,user,player.position,0);
        }else player.alert('Игрок не найден')
    })
});

let loadUser = (users,index,player)=>{
    let user = users[index];
    console.log(user._id,index)
    playerInit(player,user,player.position,0).then(()=>{
        if(index != users.length-1)loadUser(users,index+1,player);
        else console.log('Цикл закончен')
    })
    .catch((err)=>{
        console.log(user._id)
        console.error(err);
    });
}

mp.events.addCommand('testloadplayers', (player, _, playerID) => {
    if(!player.permision['COMMAND::TEST_LOAD_PLAYERS']) return player.alert(`У вас нет прав`,1);
    let index =  parseInt(playerID)
    if(!playerID || !playerID.length || isNaN(index))index = 0;
    user.find({}).then((users)=>{
        loadUser(users,index,player)
    })
});

mp.events.addCommand('unpermban', (player, _, name,surname) => {
    if(!player.permision['COMMAND::UNPERMBAN']) return player.alert(`У вас нет прав`,1);
    if (!name || !name.length) return player.alert('Вы не ввели имя /unpermban [Имя] [Фимилия] ');
    if (!surname || !surname.length) return player.alert('Вы не ввели фамилию /unpermban [Имя] [Фимилия]');
    name = name+" "+surname;
    BanModel.deleteMany({name: new RegExp(name, "i") },(err,done)=>{
        try{
            if(err){
                player.alert('Ошибка на сервере',1);
              return console.error(err);
            }
            if(done.deletedCount > 0){
                player.alert('Игрок разбанен')
            }else{
                player.alert('Игрок не найден')
            }
        }catch(e){
            console.error(e);
        }
    })
})

mp.events.addCommand('permban', (player, _, name,surname,time,...reason) => {
    if(!player.permision['COMMAND::PERMBAN']) return player.alert(`У вас нет прав`,1);
    if (!name || !name.length) return player.alert('Вы не ввели имя /permban [Имя] [Фимилия] [время] [причина]');
    if (!surname || !surname.length) return player.alert('Вы не ввели фамилию /permban [Имя] [Фимилия] [время] [причина]');
    if (!reason || !reason.length) return player.alert(`Вы не ввели причину /permban [Имя] [Фимилия] [время] [причина]`);
    if (!time || !time.length) return player.alert(`Вы не ввели время /permban [Имя] [Фимилия] [время] [причина]`);
    if(isNaN(parseInt(time))) return player.alert('Время введено неверно')
    if(time > 99999)return player.alert('Нельзя забанить больше чем на 99999 дней')
    reason = reason.join(' ');
    user.findOne({name: new RegExp(name, "i") ,surname: new RegExp(surname, "i")},(err,user)=>{
        try{
            if(err){
                player.alert('Ошибка на сервере',1);
                return console.error(err);
            }
            if(user){
                let endUnixTimestamp = time == 0 ? -1 : Math.round(moment().add(time,'days').valueOf()/1000);
                let name = user.name+" "+user.surname;
                console.log(`Игрок ${player.name} забанил ${name} `)
                if(user.social)mp.bans.add(name,1, user.social,reason, endUnixTimestamp);
                mp.bans.add(name,2, user.ip,reason, endUnixTimestamp);
                mp.bans.add(name,3,user.serial,reason, endUnixTimestamp).then((info) => {
                    if (endUnixTimestamp == -1) {
                        player.alert(`Игрок был забанен на всегда. \nПричина: ${reason}`);
                    } else {
                        player.alert(`Игрок был забанен. \nПричина: ${reason}\nКонец бана: ${mp.bans.formatUnixTimestamp(endUnixTimestamp)}`);
                    }
                    let sourcePlayer = mp.players.findName(name);
                    if(sourcePlayer){
                        sourcePlayer.alert(`Вы были забанены за ${reason}`)
                        sourcePlayer.kick();
                    }
                })
            }else{
                player.alert('Игрок не найден')
            }
        }catch(e){
            console.error(e);
        }
    })
});

mp.events.addCommand('adddriving', (player, _, playerID,) => {
    if(!player.permision['COMMAND::ADD_DRIVING']) return player.alert(`У вас нет прав`,1);
    if (!playerID || !playerID.length) return player.alert('Вы не ввели id игрока /adddriving');
    let sourcePlayer = mp.players.at(parseInt(playerID));
    if (!sourcePlayer) return player.alert(`Игрок не найден`,1);
    addDriving(sourcePlayer);
    player.alert(`Вы дали права ${sourcePlayer.name}`);
    sourcePlayer.outputChatBox(`Вам дал прова ${player.nameTag}`)
});

mp.events.addCommand('warn', (player, _, playerID,...reason) => {
    if(!player.permision['COMMAND::WARN']) return player.alert(`У вас нет прав`,1);
    if (!playerID || !playerID.length) return player.alert('Вы не ввели id игрока /warn [id] [причина]');
    if (!reason || !reason.length) return player.alert(`Вы не ввели причину /warn [id] [причина]`);
    let sourcePlayer = mp.players.at(parseInt(playerID));
    if (!sourcePlayer) return player.alert(`Игрок не найден`,1);
    if(sourcePlayer.permision.level > player.permision.level) return player.alert('Игрок которого вы пытаетесь дать warn выше вас рангом')
    reason = reason.join(' ');
    if(sourcePlayer.fraction){
        sourcePlayer.fraction.removeMember(sourcePlayer);
    }
    mp.players.broadcast(`<span style='color: #CD5C5C'>Администратор ${player.name}[${player.id}] выдал предупреждение ${sourcePlayer.nameTag} по причине: ${reason}</span>`)
    sourcePlayer.mongoUser.warn += 1;
    player.alert(`Вы выдали варн ${sourcePlayer.nameTag} варнов: ${sourcePlayer.mongoUser.warn}`);
    if(sourcePlayer.mongoUser.warn >= 3){
        reason = `Варнов стало 3 из за ${reason}`
        let LiftTimestamp = moment().add(15,'days').valueOf();
         mp.bans.banPlayer(sourcePlayer.id,4,reason,LiftTimestamp).catch(()=>{
            player.alert('Произошла ошибка ',0,3000)
        })
        sourcePlayer.mongoUser.warn = 0;
        sourcePlayer.ban = true;
        sourcePlayer.banCount++;
        sourcePlayer.Reason = reason;
        sourcePlayer.LiftTimestamp = LiftTimestamp;
        if(!player.mongoUser.$__.saving)sourcePlayer.mongoUser.save().catch(err=>{console.error(err)})
    }else{
        sourcePlayer.outputChatBox(`Вам дал ${player.nameTag} warn за ${reason}. Варнов: ${sourcePlayer.mongoUser.warn} `)
        if(!player.mongoUser.$__.saving) sourcePlayer.mongoUser.save().catch(err=>{console.error(err)})
    }
    sourcePlayer.kick();
});

mp.events.addCommand('unwarn', (player, _, playerID) => {
    if(!player.permision['COMMAND::WARN']) return player.alert(`У вас нет прав`,1);
    if (!playerID && !playerID.length) return player.alert('Вы не ввели id игрока /unwarn [id] [причина]');
    let sourcePlayer = mp.players.at(parseInt(playerID));
    if (!sourcePlayer) return player.alert(`Игрок не найден`,1);
    if(sourcePlayer.mongoUser.warn == 0 )return player.alert('У игрока нет варнов')
    player.alert(`Вы сняли варн у игрока`)
    sourcePlayer.mongoUser.warn -= 1;
    if(!player.mongoUser.$__.saving) sourcePlayer.mongoUser.save().catch(err=>{console.error(err)})
})


mp.events.addCommand('colors', (player, _, playerID,id,id2) => {
    if(!player.permision['COMMAND::COLORS']) return player.alert(`У вас нет прав`,1);
    if(!playerID || !playerID.length) return player.alert(`Синтаксическая ошибка /colors [player_id]  [id] [id2]`);
    if(!id || !id.length ) return player.alert(`Синтаксическая ошибка /colors [player_id]  [id] [id2]`);
    if(!id2 || !id2.length ) return player.alert(`Синтаксическая ошибка /colors [player_id]  [id] [id2]`);
    let sourcePlayer = mp.players.at(parseInt(playerID));
    if(!sourcePlayer) return player.alert(`Игрок не найден`,1);
    if(!sourcePlayer.loggined) return player.alert('Игрок не вошел в игру')
    if(!sourcePlayer.vehicle) return player.alert('Игрок не сидит в машине')
    if(isNaN(parseInt(id))) return player.alert('id введен неверно')
    if(isNaN(parseInt(id2))) return player.alert('id2 введен неверно')
    let veh = sourcePlayer.vehicle
    veh.setColor(parseInt(id),parseInt(id2))
    player.alert('Цвет машины изменён')
});

mp.events.addCommand('tvisible', (player, _, playerID) => {
    if(!player.permision['COMMAND::TVISIBLE']) return player.alert(`У вас нет прав`,1);
    let visible = !player.getVariable('visible')
    player.setVariable('visible',visible);
    player.alert(`Вы ${!visible ?'включили':'выключили'} невидимость`)
});
mp.events.addCommand('gm', (player, _, playerID) => {
    if(!player.permision['COMMAND::GM']) return player.alert(`У вас нет прав`,1);
    let invincible = !player.getVariable('invincible');
    player.setVariable('invincible',invincible);
    player.alert(`Вы ${invincible ?'включили':'выключили'} неуязвимость`)
});
mp.events.addCommand('getdata', (player, _, playerID) => {
    if(!player.permision['COMMAND::GET_DATA']) return player.alert(`У вас нет прав`,1);
    if(!playerID || !playerID.length){
        player.outputChatBox(JSON.stringify(player.data))
    }else{
        let pl = mp.players.at(parseInt(playerID));
        if(!pl)return player.alert('Игрок не найден')
        player.outputChatBox(JSON.stringify(pl.data))
    }
});

mp.events.addCommand('ac', (player, _) => {
    if(!player.permision['COMMAND::ADMIN_CHAT']) return player.alert(`У вас нет прав`,1);
    let text = `<span style='color: #FFFACD'>[A] ${player.name} [${player.id}]: ${_} </span>`
    mp.players.forEach((pl)=>{
        try{
            if(pl.loggined && pl.permision['COMMAND::ADMIN_CHAT']) pl.outputChatBox(text)
        }catch(e){
            console.error(e)
        }
    })
});

mp.events.addCommand('hc', (player, _) => {
    if(!player.permision['COMMAND::HELPER_CHAT']) return player.alert(`У вас нет прав`,1);
    let text = `<span style='color: #FFFACD'>[A] ${player.name} [${player.id}]: ${_} </span>`
    mp.players.forEach((pl)=>{
        try{
            if(pl.loggined && pl.permision['COMMAND::HELPER_CHAT']) pl.outputChatBox(text)
        }catch(e){
            console.error(e)
        }
    })
});