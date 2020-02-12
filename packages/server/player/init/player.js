let lets = require('./lets.js');
let functions = require('./function.js');
let playerInventory = require('../../inventory/playerInventory.js').playerInventory;
let skins=[mp.joaat("MP_M_Freemode_01"),mp.joaat("MP_F_Freemode_01")];
let permisions = require('../permision.js');
let playerDeathHandler = require('../../events/deat.js').playerDeathHandler;
let spawnStart = new mp.Vector3(-1039.8583984375,-2737.814208984375,12.819873809814453);
let createVehModel = require('../../a/functions/vehicle/create').createVehModel;
let sendReferralsWindowData = require('../../donate/referrals').sendWindowData;
let moment = require('moment');
let {getBusnessInfo,getBusinessByOwner} = require('../../busines/class');
let licenseShow = ['driving','rightBoat','rightPlane'];
let {configVehicles} = require('../../a/functions/vehicle/configsVehicles')

module.exports = function(player,user,pos,typePos) {
	return new Promise( (resolve,reject) => { 
		try{
			functions(player);
			lets(player);
			if(user) {
				user.ip_last = player.ip;
				user.lastJoin_date = new Date().getTime();
				player._id = user._id;
				player.name = user.name+" "+user.surname;
				player.nameChat = `%playerName[${user.name} ${user.surname}]% [${player.id}]`
				player.money = user.money;
				player.call("HUD::UPDATE_MONEY",[player.money])
				player.admin = user.admin;
				player.lvl = user.level;
				player.exp = user.exp;
				player.educationComplete = user.educationComplete;
				player.education = user.education;

				//фракция
				let nameTagcolor = [255,255,255,255];
				//permision 
				if(user.permision){
					let per = permisions[user.permision];
					if(per) player.permision = per;
					else player.permision = permisions['default'];
    				player.call('PERMISION::SET',[JSON.stringify(per)])
				}
				if(user.fraction && user.fraction.name){
					player.fraction = mp.fractions[user.fraction.name];
					player.rank = user.fraction.rank;
					player.fraction.updateInfo(player);
					if( typePos === 0 && typeof player.fraction.dimension != "undefined" && user.fraction.hasJoinInterior){
						player.dimension = player.fraction.dimension;
						player.position = player.fraction.interiror;
					}
					else player.dimension = 0;
				}else{
					if(player.permision) nameTagcolor = player.permision.nameTagColor;
					else nameTagcolor = [255,255,255,255];
					player.dimension = 0;
				}
				player.updateNametags();
				player.mongoUser = user;
				// машины
				player.vehicles = [];
				let gender = parseInt(user.personage.gender);
				player.gender = gender;
				player.inventory = new playerInventory(player,user.items);
				let homes = mp.homes.map((home)=>{
				 	return {
						pos: home.pos,
						owner: !!home.owner
					}
				})
				let business = getBusnessInfo()
				player.call("BUSINESS::CREATE",[JSON.stringify(business)])
				let busines = getBusinessByOwner(user._id);
				if(busines){
					player.call("BUSINESS::UPDATE_MY",[busines.id])
					player.busines = busines;
				}
				player.call("HOME::LOAD_BLIPS",[JSON.stringify(homes)])
				player.home = mp.homes.find((home)=>{
					if(home.owner && home.owner.toString() === user._id.toString())return true;
				})
				if(player.home)player.home.updateData(player)
				setTimeout(()=>{
					try{
						player.model = skins[player.gender];
						player.inventory.refetchItems();
						player.inventory.refetchKeysVeh();
						let heredity = user.personage.heredity;
						let features = user.personage.features;
						let appearance = user.personage.appearance;
						let overlay = user.personage.overlay;
						let tattoos = user.tattoos;
						player.setHeadBlend(heredity[0],heredity[1],0,heredity[0],heredity[1],0,heredity[2],heredity[3],0);
						player.setClothes(2,appearance[0],0,0);
						player.setHairColor(appearance[1],appearance[2]);

						let personalInfo = {
							appearance: appearance,
							overlay:overlay ,
							tattoos: tattoos
						}

						player.call("PLAYER::LOAD_PERSONAGE",[JSON.stringify(personalInfo)]);
						
						for(tatto in tattoos){
							let item = tattoos[tatto];
							player.setDecoration(mp.joaat(item.collection),mp.joaat(item.hash))
						}
						player.eyeColor = appearance[3];
						for(let i=0;i<features.length;i++){
							player.setFaceFeature(i,features[i]);
						}
						for(let i=0;i<overlay.length;i++){
							player.setHeadOverlay(i,[overlay[i].draw,overlay[i].opacity,overlay[i].color_one,overlay[i].color_two]);
						}
						let transactions = user.transactions.slice(0,50)
						let reportsMessage = user.reportsMessage.slice(0,50)
						let licenses = [];
						licenseShow.forEach((license)=>{
							if(player.testLicense(license))licenses.push(license);
						})
						player.updateInfoMenu({
							transactions,
							reportsMessage,
							licenses
						});
					}catch(err){
						console.error(e)
						reject(err)
					}
					resolve();
				},3000)
				
				user.populate('vehicles').populate({path: 'friends', select: '_id name surname'}).populate({path: 'referrals', select: '_id name surname time_game'})
					.execPopulate((err,user)=>{
						try{

							if(err)reject(err)
							let friends = user.friends.map((friend)=>{
								return friend.name+" "+friend.surname;
							})
							player.call("CHAT::UPDATE_FRIENDS",[JSON.stringify(friends)])
							user.vehicles.forEach((vehModel,i)=>{
								if(vehModel.evacuated == true){
									let veh = {evacuated: true,model: vehModel,id:i}
									player.vehicles.push(veh);
								}
								else{
									let veh = mp.vehicles.atMongoId(vehModel._id);
									if(!veh)veh = createVehModel(vehModel)
									player.vehicles.push(veh);
									if(vehModel.garage){
										let garageHome = mp.homes.find((home)=>{
											if(vehModel.garage.toString() == home.mongodb._id.toString())return true
										})
										if(garageHome)garageHome.vehGarag(veh,vehModel.garagePos);
									}
								}
							})
							player.updateVehiclesMenu();
							if(player.inventory)player.inventory.refetchKeysVeh();
							sendReferralsWindowData(player);
							player.populated = true;
						}catch(e){
							console.error(e)
							reject(err)
						}
					})
				player.heading = user.heading;
				//Подгрузка персонажа
				
				player.call('INVENTORY::UPDATE_HUNGER', [user.satiety, user.thirst])
				//lspd
				player.setVariable('lspd_star',user.lspd.stars)
				//mute 
				player.testMute(true);
				if(!user.fraction.hasJoinInterior && (user.jail == null || user.jail) ){
					if(user.deat == true){
						player.alert('Вы умерли')
						player.spawn(user.pos);
						playerDeathHandler(player);
					}else{
						if(pos) player.spawn(pos);
						else player.spawn(spawnStart);
					}
				}
				//jail
				if(player.testJail()){
					let jails = [
						new mp.Vector3(459.25750732421875,-1001.5284423828125,24.914859771728516),
						new mp.Vector3(459.3766174316406,-997.9525756835938,24.914859771728516), 
						new mp.Vector3(460.325927734375,-994.3788452148438,24.914859771728516),]
					let jail = jails[mp.getRandomInRange(0,jails.length-1)];
					player.spawn(jail);
					let time = player.mongoUser.jail.time - player.mongoUser.time_game;
    				let textTime =   moment.duration(time).locale("ru").humanize();
					player.alert(`Вас посадили на ${textTime} ${ user.jail.reason ? 'за '+user.jail.reason  : '' }`,0,time);
					player.call("LSPD::JAIL",[true]);
				}
				// greenZones 
				mp.events.call('loadGreenZones', player);

				// Обучение

				if (player.educationComplete === false) mp.events.call('educationContinue', player)

				if(!user.$__.saving)user.save().catch(err=>{console.error(err)})
				player.health = user.health;
				player.loggined = true;
				player.call("CARSHOWROOM::LOAD_OPTIONS_VEHICLE",[JSON.stringify(configVehicles)])
				// let transactions = stringSplitFromArray(JSON.stringify( user.transactions.slice(800)),65535);
				// player.call('MENU::TRANSACTIONS',[...transactions]);
			}
		}catch(e){
			//инициализация  игрока прошла не успешна
			player.alert('Произошла ошибка. Администрация в скором времени её устранит')
			reject(e)
			player.spawn(spawnStart);
			player.loggined = false;
		}
		//инициализация  игрока прошла успешна
		
	})
}

const stringSplitFromArray = (str, length) => {
    const arrayStrings = [];

    for (let i = 0; i < str.length; i += length) {
        const subStringText = str.substr(i, Math.min(length, str.length - i));
        arrayStrings.push(subStringText)
    }

    return arrayStrings;
}