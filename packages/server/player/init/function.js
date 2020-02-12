let User = require('../../mongodb/user.js').User;
const weaponData = require("../../../configs/weaponData");
let unJail = require('../../fractions/lspd/jail').unJail
module.exports = (player)=>{
	player.editMoney = editMoney(player);
	player.editmoneyCard = editmoneyCard(player);
	player.editmoneyCash = editmoneyCash(player);
	player.checkMoney = checkMoney(player);
	player.createmenuv = createmenuv(player);
	player.closemenuv = closemenuv(player);
	player.savepos = savepos(player);
	player.broadcastInRange = broadcastInRange(player);
	player.clearParking = clearParking(player);
	player.updateNametags = updateNametags(player);
	player.updatetimeGame = updatetimeGame(player);
	player.updateLevels = updateLevels(player);
	player.updateEducation = updateEducation(player);
	player.completeEducation = completeEducation(player);
	player.setNewWaypoint = setNewWaypoint(player);
	player.fractionEval = fractionEval(player);
	player.testMute = testMute(player);
	player.testJail = testJail(player);
	player.isOwnerVehicle = isOwnerVehicle(player);
	player.isWorkUp = isWorkUp(player);
	player.updateInfoMenu = updateInfoMenu(player);
	player.testRightDrive = testRightDrive(player);
	player.testLicense = testLicense(player);
	player.hasAddVehicle = hasAddVehicle(player);
	player.addAttachment = _addAttachmentWrap;
	player.removeAttachment = removeAttachment;
	player.hasAttachment = _hasAttachment;
	player.callBrowser = callBrowser;
	player.callBrowserPhone = callBrowserPhone;
	player.removeWeaponAndAttachment = removeWeaponAndAttachment;
	player.setWeaponAttachment = setWeaponAttachment;
	player.giveWeaponAttachment = giveWeaponAttachment;
	player.updateVehiclesMenu = updateVehiclesMenu;
}

let editMoney = (player)=>{
		return (money,title)=>{
			if(player.card){
				if(player.editmoneyCard(money,title)) return true;
				else if(player.money +money >= 0){
					player.editmoneyCash(money,title)
					return true;
				}else{
					player.alert(`У вас не хватает денег`,1)
					return false;
				} 
			}else{
				if(player.money +money >= 0){
					player.editmoneyCash(money,title)
					return true;
				}else player.alert(`У вас не хватает денег`,1)
			}
		}
}

let checkMoney = (player)=>{
	return (money)=>{
		let hasCheckCard = player.card && player.card.money + money > 0;
		if(hasCheckCard || player.money + money >= 0) return true;
		return false;
	}
}
let editmoneyCash = (player)=>{
		return (money,title)=>{
			if(typeof money != 'number' || isNaN(money)){
				player.alert('Произошла ошибка')
				throw new Error();
			}
			if(player.money + money < 0) return player.alert(`У вас не хватает денег`,1);
			let taken = money<0 ? true :  false;
			player.money += money;
			let transaction = {money:money,title:title,taken:taken,date:new Date().getTime()};
			User.findByIdAndUpdate(player._id, { $set: {money: player.money},$push: {transactions:transaction}}, function(err, doc){
				if(err)console.error(err)
			});
			player.call("HUD::UPDATE_MONEY",[player.money,JSON.stringify(transaction)])
			return true;
		}
}
let editmoneyCard = (player)=>{
		return (money,title)=>{
			if(typeof money != 'number' || isNaN(money)){
				player.alert('Произошла ошибка')
				throw new Error();
			}
			if(player.card){
				if(player.card.money + money < 0) {
					return false
				}
				return player.card.editMoney(money,title);
			}else return false;
		}
}
let createmenuv = (player)=>{
		return (info)=>{
			player.call('MENUV::CREATE',[JSON.stringify(info)])
		}
}
let closemenuv = (player)=>{
		return (name)=>{
			player.call('MENUV::CLOSE',[name])
		}
}

let savepos = (player)=>{
	return ()=>{
		//если игрок дома
		try{
			if(player.mongoUser.jail.time)return;
			if(player.notSavePos)return;
			let pos = player.position;
			if(player.joinhome === true){
				pos = player.joinhome_class.pos;
			}
			User.findOneAndUpdate({_id:player._id}, { $set: {'pos':pos,heading:player.heading}}, function(err, doc){
				if(err)return console.error(err)
				player.mongoUser.pos = pos;
			});	
		}catch(e){
			console.error(e)
		}
	}
}
let broadcastInRange = (player)=>{
	return (radius,text,color,textUp)=>{
		let pos = player.position;
		mp.players.forEachInRange(pos,radius,player.dimension,(pl)=>{
			try{
				pl.outputChatBox(text.replace(/"/gi,'\''))
				if(textUp&&color&&hexToRgb(color)){
					pl.call('chatplayer',[player.id,textUp,JSON.stringify(hexToRgb(color))])
				}
			}catch(e){
				console.error(e)
			}
		})
	}
}
let clearParking = (player)=>{
	return (isNotclienSide = false )=>{
		let veh = player.parking;
		if(veh){
			player.call("PARKING::SET",[isNotclienSide])
			veh.target = null;
			if(!mp.vehicles.exists(veh))return
			if(veh.dist(veh.pos) > 1 ) veh.parking.respawn(veh);
			if(player.vehicle == veh) player.removeFromVehicle();
		}
	}
}
let updateNametags = (player)=>{
	return (nameTagcolor)=>{
		if(!nameTagcolor){
			if(player.redNick) nameTagcolor = player.permision.nameTagColor;
			else nameTagcolor = [255,255,255,255]
		} 
		let namecolor = nameTagcolor.slice(0,3);
		let colorStyle = player.redNick ? `style='color: rgba(${namecolor+','+ nameTagcolor[3]/255})'` : '';
		player.setVariable('colorNametag',JSON.stringify(nameTagcolor));
		player.nameTag = `<span ${colorStyle}>${player.name}[${player.id}]</span>`;
		player.nameChatTag = `<span ${colorStyle}>${player.nameChat}</span>`;
	}
}
let updatetimeGame = (player)=>{
	return ()=>{
		let date = new Date().getTime();
		player.mongoUser.time_game =  player.mongoUser.time_game +(date - player.lastJoin_date);
		player.lastJoin_date = date;
		if(!player.mongoUser.$__.saving)player.mongoUser.save().catch(err=>{console.error(err)})
	}
}
let updateLevels = (player)=>{
	return ()=>{
		player.mongoUser.exp =  player.exp;
		player.mongoUser.level = player.lvl;
		if(!player.mongoUser.$__.saving)player.mongoUser.save().catch(err=>{console.error(err)})
	}
}
let updateEducation = (player)=>{
	return ()=>{
		player.mongoUser.educationComplete = player.educationComplete;
		player.mongoUser.education = player.education;
		if(!player.mongoUser.$__.saving)player.mongoUser.save().catch(err=>{console.error(err)})
	}
}
let completeEducation = (player)=>{
	return ()=>{
		player.mongoUser.completeEducation =  player.completeEducation;
		if(!player.mongoUser.$__.saving)player.mongoUser.save().catch(err=>{console.error(err)})
	}
}
let setNewWaypoint = (player)=>{
	return (pos)=>{
		player.call("PLAYER::SET_NEW_WAYPOINT",[pos.x,pos.y]);
	}
}
let fractionEval = (player)=>{
	return (text)=>{
		player.call('FRACTION::EXECUTE',[text])
	}
}

let testMute = (player)=>{
	return (noteSave)=>{
		if(player.mongoUser.mute && player.mongoUser.mute.time){
			let date = player.mongoUser.time_game;
			if(date > player.mongoUser.mute.time){
				player.mongoUser.mute = null;
				if(noteSave && !player.mongoUser.$__.saving)player.mongoUser.save().catch(err=>{console.error(err)})
				player.mute = false;
				player.call("VOICE::MUTE",[false])
				return false;
			}
			player.mute = true;
			player.call("VOICE::MUTE",[true])
			return true;
		}else {
			player.mute = false;
			return false;
		}	
	}
}
let testJail = (player)=>{
	return (noteSave)=>{
		if(player.mongoUser.jail.time){
			let date = player.mongoUser.time_game;
			if(date >= player.mongoUser.jail.time){
				unJail(player);
				player.jail = false;
				return false;
			}
			player.jail = true;
			return true;
		}else {
			return false;
		}	
	}
}


function hexToRgb(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16)
    ] : null;
}
let isOwnerVehicle = (player)=>{
	return (id)=>{
		let vehicles = player.vehiclesKeys;
		let veh;
		if(vehicles.indexOf(parseInt(id)) != -1){
			veh = mp.vehicles.at(parseInt(id));
		}
		return veh;
	}
}
let isWorkUp = (player)=>{
	return ()=>{
		if(player.fraction){
			player.alert('В фракции на подработках работать нельзя')
			return false;
		}
		return true;
	}
}
let updateInfoMenu = (player)=>{
	return (add)=>{
		let user = player.mongoUser;
		let info = {
			level:user.level,
			money:user.money,
			permision: user.permision,
			gender: player.gender,
			warn: user.warn,
			regIp: user.ip,
			lastIp: user.ip_last,
			regDate: user.register_date,
			lastJoinDate: user.lastJoin_date,
			gameTime: user.time_game,
			bans: user.banCount,
			kills: user.kills,
			deaths: user.deaths,
		}
		if(player.card)info.moneyBank = player.card.money;
		if(player.fraction)info.fraction = player.fraction.name;
		if(player.phone)info.numberPhone = player.phone.number;
		if(player.busines)info.busines = player.busines.title;
		if(add)info = Object.assign(info,add)
		player.call('MENU::INFO_MENU',[JSON.stringify(info)]);
	}
}

function updateVehiclesMenu(){
	let vehicles = this.vehicles.map((vehicle)=>{
		return {
			model: vehicle.model,
			numberPlate: vehicle.numberPlate
		}
	})
	this.call('MENU::INFO_VEHICLES',[JSON.stringify(vehicles)]);
}

let testRightDrive =(player)=>{
	return ()=>{
		let item = player.inventory.findItem(1);
		if(!item || item.name_cart != player.mongoUser.name && item.surname != player.mongoUser.surname){
			player.alert('У вас нет прав в инвентаре')
			return false; 
		}
		if(Date.now() < item.date){
			player.alert('У вас просрочены права');
			return false;
		}
		return true;
	}
}
let testLicense =(player)=>{
	return (license,testDate = true)=>{
		if(testDate == true 
			&& player.mongoUser.licenses[license].is == true
            && Date.now() < player.mongoUser.licenses[license].date 
			&&  player.mongoUser.licenses[license].date != 0 
			|| !testDate && player.mongoUser.licenses[license].is == true)
				return true;
		return false;
	}
}
let hasAddVehicle = (player)=>{
	return ()=>{
		if(!player.home && player.vehicles.length >= 1)return false
		else{
			if(player.home && player.home.garageConfig){
				if(player.home.garageConfig.positions.length == player.vehicles.length)return false;
			}else if(player.vehicles.length){
				return false
			}
		}
		return true;
	}
}

function serializeAttachments(attachments)
{
	return (attachments.map((hash) => (hash.toString(36)))).join("|");
}

function _addAttachment(entity, attachmentHash)
{
	let idx = entity._attachments.indexOf(attachmentHash);
	
	if(idx === -1)
	{
	    entity._attachments.push(attachmentHash);
	}
	
	entity.setVariable("attachmentsData", serializeAttachments(entity._attachments));
}

function _addAttachmentWrap(attachmentName)
{
    let attachmentHash = typeof(attachmentName) == 'number' ? attachmentName : mp.joaat(attachmentName);
    _addAttachment(this, attachmentHash);
}

function _hasAttachment(attachmentName)
{
	return this._attachments.indexOf((typeof(attachmentName) === 'string') ? mp.joaat(attachmentName) : attachmentName) !== -1;
}
function callBrowser(cal,...args)
{
	this.call('BROWSER::CALL',[cal,...args])	
}
function callBrowserPhone(cal,...args)
{
	this.call('PHONE::CALL_BROWSER',[cal,...args])	
}
function removeAttachment(attachmentName){
    let attachmentHash = typeof(attachmentName) == 'number' ? attachmentName : mp.joaat(attachmentName);
    let idx = this._attachments.indexOf(attachmentHash);
    if(idx !== -1){
		this._attachments.splice(idx, 1);
	}
	this.setVariable("attachmentsData", serializeAttachments(this._attachments));
}
function giveWeaponAttachment(weapon_hash,ammo){
	if(!weaponData[weapon_hash])return console.error('нет оружия '+weapon_hash)
	let weaponAttachmentName = `WDSP_${weaponData[weapon_hash].HashKey}`
	this.giveWeapon(weapon_hash,ammo);
	this.addAttachment(weaponAttachmentName);
}
function setWeaponAttachment(weapon_hash,ammo){
	if(!weaponData[weapon_hash])return console.error('нет оружия '+weapon_hash)
	let weaponAttachmentName = `WDSP_${weaponData[weapon_hash].HashKey}`
	this.setWeaponAmmo(weapon_hash,ammo);
	this.addAttachment(weaponAttachmentName);
}
let weaponAttachmentData = require('../weaponSync').weaponAttachmentData;
function removeWeaponAndAttachment(weapon_hash){
	let weaponAttachmentName = `WDSP_${weaponData[weapon_hash].HashKey}`;
	this.removeAttachment( weaponAttachmentName);
	this.removeWeapon(weapon_hash)
	let hash = weaponData[weapon_hash].HashKey;
	if(weaponAttachmentData[hash]){
		let slot = weaponAttachmentData[hash].Slot;
		delete this._bodyWeapons[slot]
	}
}
