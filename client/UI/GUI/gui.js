let colorMinus = [194, 56, 56, 255];
let colorPlus = [106, 144, 107, 255];
let cartridges = null;
let weapon = 2725352035;

let players = 0;
let light = false;
let locked = false;
let hpVeh = 100;
let browserHud = mp.browsers.new('package://HTML/hud/index.html'); 
module.exports.browserHud = browserHud;

mp.events.add({
	'render': () => {
		try{
			if(!loggined) return;
			
			if(players !=  mp.players.length){
				players = mp.players.length;
				browserHud.execute(`hud.players = ${players}`)
			}
			
			if(player.weapon != weapon){
				weapon = player.weapon;
				if(weapon == 2725352035 || weapon == 966099553){
					browserHud.execute(`hud.cartridges = null;`)
					cartridges = null;
				}
				else{
					let carts = player.getAmmoWeapon(player.weapon);
					if(carts != cartridges){
						cartridges = carts;
						updateCartridges(cartridges);
					}
				}
			}
			
			if (mp.game.invoke(getNative('IS_CUTSCENE_ACTIVE'))) {
				mp.game.invoke(getNative('STOP_CUTSCENE_IMMEDIATELY'))
			}
			if (mp.game.invoke(getNative('GET_RANDOM_EVENT_FLAG'))) {
				mp.game.invoke(getNative('SET_RANDOM_EVENT_FLAG'), false);
			}
			if (mp.game.invoke(getNative('GET_MISSION_FLAG'))) {
				mp.game.invoke(getNative('SET_MISSION_FLAG'), false);
			}
			hideHudShit();	
		}catch(e){}
	},
	"playerWeaponShot":()=>{
		let carts = player.getAmmoWeapon(player.weapon);
		if(carts != cartridges){
			cartridges = carts;
			updateCartridges(cartridges);
		}
	},
	"HUD::UPDATE_CARTRIDGES":()=>{
		weapon = player.weapon;
		if(weapon == 2725352035){
			browserHud.execute(`hud.cartridges = null;`)
			cartridges = null;
		}
		else{
			let carts = player.getAmmoWeapon(player.weapon);
			if(carts != cartridges){
				cartridges = carts;
				updateCartridges(cartridges);
			}
		}
	},
	'HUD::UPDATE_MONEY':(money,info)=>{
		browserHud.execute(`hud.money = ${money}`);
		mp.events.call("MENU::ADD_TRANSACTION",info)
	},
	"HUD::UPDATE_BANK_MONEY":(money)=>{
		browserHud.execute(`hud.bank = ${money}`)
		player.cardMoney = money;
	},
	"BROWSER::CALL":(cal,...args)=>{
		browser.execute(`mp.call('${cal}',${args.join(',')})`)
	}
})
let updateCartridges = (carts)=>{
	let weapon = player.weapon;
	if(weapon == 883325847)browserHud.execute(`hud.cartridges = ${parseInt(carts/45)}`);
	else if(weapon == 911657153) browserHud.execute(`hud.cartridges = '∞'`);
	else browserHud.execute(`hud.cartridges = ${carts}`);
}
let speedLast = 0,gearLast,petrolLast;
setInterval(function () {
	try{
		if(!loggined) return;
		if(mp.storage.data.setting.hud != false && mp.storage.data.setting.spedometr && mp.storage.data.setting.spedometr.active == false) return;
		if(player.vehicle){
				let veh = player.vehicle;
				if(!veh.petrol) veh.petrol = veh.getVariable('petrol')
				let petrol = (veh.petrol || 50).toFixed(1);
				let speed = mp.storage.data.setting.spedometr.type_speed == 0 ? (veh.getSpeed()*3.6).toFixed(0) :( veh.getSpeed()*2.236936).toFixed(0);
				let gear = veh.gear;
				if(mp.storage.data.setting.spedometr.type == 1){
					browser.execute(`
						${speed != speedLast || petrol != petrolLast ? 'speed.clearContex();' : ''}
						${speed != speedLast || petrol != petrolLast ? `speed.updateSpeed(${speed});`: ''}
						${speed != speedLast || petrol != petrolLast ? `speed.updateFuel(${petrol},${veh.getVariable('MAX_PETROL') } );`: ''}
						${gear != gearLast ? `speed.updateGear(${gear});`: ''}
					`);
				}else{
					let veh = player.vehicle;
					if(!veh.petrol) veh.petrol = veh.getVariable('petrol')
					let petrol = veh.petrol;
					browserHud.execute(`hud.speedText = ${speed}`)
					browserHud.execute(`hud.fuel = ${petrol.toFixed()}`)
					let lightCurent = veh.getLightsState(0,0).highbeamsOn > 0; 
					if(lightCurent != light){
						light = lightCurent;
						browserHud.execute(`hud.speedLigh = ${light}`)
					}
					let lockedCurent = veh.getDoorLockStatus() != 1;
					if(lockedCurent != locked){
						locked = lockedCurent;
						browserHud.execute(`hud.speedLocked = ${locked}`)
					}
					let hp = (veh.getHealth() / 10).toFixed(0);
					if (hp !== hpVeh) {
						browserHud.execute(`hud.speedHealth=${hp}`);
						hpVeh = hp;
					}
				}
				speedLast = speed;
				petrolLast = petrol;
				gearLast = gear;
			}
		}catch(e){}
}, 100);

function hideHudShit() {
	mp.game.ui.hideHudComponentThisFrame(2);//cash
	mp.game.ui.hideHudComponentThisFrame(3);//weapon patron


    mp.game.ui.hideHudComponentThisFrame(6);
    mp.game.ui.hideHudComponentThisFrame(7);
    mp.game.ui.hideHudComponentThisFrame(8);
	mp.game.ui.hideHudComponentThisFrame(9);
	
}


// tips
let showTips = !mp.storage.data.setting ? true : mp.storage.data.setting.tips;
if(typeof showTips == "undefined"){
	mp.storage.data.setting.tips = true;
	showTips = true;
}
browserHud.execute(`hud.showTips = ${showTips ? 'true' : 'false'}`)
// f3
mp.keys.bind(0x72, true, function() {
	showTips = !showTips;
	mp.storage.data.setting.tips = showTips;
	browserHud.execute(`hud.showTips = ${showTips ? 'true' : 'false'}`)
});

// tips
let nameTagShow =  !mp.storage.data.setting ? true : mp.storage.data.setting.nameTagShow;
if(typeof showTips == "undefined"){
	mp.storage.data.setting.nameTagShow = true;
	nameTagShow = true;
}
// f3
mp.keys.bind(0x75, true, function() {
	nameTagShow = !nameTagShow;
	mp.storage.data.setting.nameTagShow = nameTagShow;
});

let bigSizeMap = false
// Z
mp.keys.bind(0x5A, true, function() {
	if(chatActive || !isGUIOpen())return;
	bigSizeMap = !bigSizeMap;
	mp.game.ui.setRadarBigmapEnabled(bigSizeMap, false);
});