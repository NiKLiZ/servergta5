let hasCuff = false;
var anumeans = 0;
var anumeanstogle = false;
let show = false;
let lspd = {};
let {getNickName} = require('../../UI/GUI/chat.js'); 
global.hasJail = false;
let {browserFractions} = require('./browser');
function toggleJail(toggle){
	hasJail = toggle;
	global.isInSafeZone = toggle;
}
module.exports.hasJail = hasJail;
mp.game.object.doorControl(631614199, 461.8065, -994.4086, 25.06443, true, 0.0, 0.0, 0.0);
mp.game.object.doorControl(631614199, 461.8065, -997.6583, 25.06443, true, 0.0, 0.0, 0.0);
mp.game.object.doorControl(631614199, 461.8065, -1001.302, 25.06443, true, 0.0, 0.0, 0.0);


let colshapeJail = mp.colshapes.newSphere(458.84051513671875,-998.059814453125,23.914859771728516, 15);
colshapeJail.jail = true;


let marPD = {
	type: 1,
	color:  [0,0,255,60],
	position: new mp.Vector3(441.10888671875,-981.7169189453125,29.689594268798828),
	scale: 1.5
}
createMarker(marPD,(m)=>{
	let menu = {
		name: 'LSPD',
		exit_mar: m,
		items:  [
			{
				type: 1,
				name: 'Купить права на владение оружие',
				callback: 'LSPD::BUY_LICENSE_GUN',
				placeholder: 'Купить права на владение оружие на 2 месяца за 5000$',
			}
		]
	}
	createmenuv(menu)
});

let weaponsNames = {
	"weapon_stungun": "Шокер",
	"weapon_nightstick": "Дубинку",
	"weapon_pistol_mk2": "Пистолет",
	"weapon_pumpshotgun": "Дробовик",
	"weapon_smg": "SMG",
	"weapon_carbinerifle": "Carbine Rifle",
	"weapon_appistol": "Пистолет",
	"weapon_assaultsmg": "SMG",
	"weapon_pumpshotgun_mk2": "Дробовик ",
	"weapon_smokegrenade": "Дымовая шашка" 
}


let toggle = function() {
	if(!isGUIOpen() && !show) return;
	if(player.fraction === 'LSPD'){
		show = !show;
		guitoggle(show)
		if(show){
			let ret = [];
			mp.players.forEachInStreamRange((pl)=>{//player != pl && 
				if(mp.Vector3.Distance(player.position,pl.position) <= 20){
					ret.push({
						name: getNickName(pl),
						stars: pl.getVariable('lspd_star')
					})
				}
			});
			mp.events.callRemote('LSPD::MENU')
			browserFractions.execute(`lspd_menu.players = ${JSON.stringify(ret)};lspd_menu.show = true;`);
		}else{
			browserFractions.execute(`lspd_menu.show = false;`);
		}
	}
}

mp.blips.new(526, new mp.Vector3(441.0595397949219,-983.0401000976562,29.689594268798828),{
	    name: 'LSPD',
	    color: 63,
	    dimension: 0,
	    shortRange: true,
	    alpha: 255
	})
mp.events.add({
	"playerExitColshape":(shape)=>{
		if(shape.jail && hasJail){
			mp.events.callRemote("LSPD::JAIL_EXIT")
		}
	},
	'LSPD::Attach': (cop, criminal) => {
		cop = mp.players.atRemoteId(cop)
		criminal = mp.players.atRemoteId(criminal)
		if(cop == criminal) return alert('Нельзя самово себя вести')
		anumeans = cop.remoteId;
		if(cop != player)anumeanstogle = true;
	},
	"LSPD::JAIL":(toggle)=>{
		toggleJail(toggle)
	},
	"LSPD::UNTACH": (pl)=>{
			anumeanstogle = false;
	},
	"LSPD::CUFF":(is)=>{
		hasCuff = is == "true" ? true: false; 
		if(hasCuff) player.setEnableHandcuffs(true);
		else player.uncuff();
	},
	"render": () => {
		try{
		// if(cuff){
			//VEHICLE
			// mp.game.controls.disableControlAction(2, 23, hasCuff);
			// mp.game.controls.disableControlAction(2,63,hasCuff);
			if(hasCuff === true){
				mp.game.controls.disableControlAction(2, 12, hasCuff);
				mp.game.controls.disableControlAction(2, 13, hasCuff);
				mp.game.controls.disableControlAction(2, 14, hasCuff);
				mp.game.controls.disableControlAction(2, 15, hasCuff);
				mp.game.controls.disableControlAction(2, 16, hasCuff);
				mp.game.controls.disableControlAction(2, 37, hasCuff);
				mp.game.controls.disableControlAction(2, 44, hasCuff);
				mp.game.controls.disableControlAction(2,59,hasCuff);
				mp.game.controls.disableControlAction(2, 24, hasCuff);
				mp.game.controls.disableControlAction(2, 25, hasCuff);
				mp.game.controls.disableControlAction(2, 140, hasCuff);
				mp.game.controls.disableControlAction(2, 141, hasCuff);
				mp.game.controls.disableControlAction(2, 142, hasCuff);
				mp.game.controls.disableControlAction(2, 257, hasCuff);
				mp.game.controls.disableControlAction(2, 263, hasCuff);
				mp.game.controls.disableControlAction(2, 264, hasCuff);
			}
		}catch(e){}
  },
  "LSPD::CLOSE":()=>{
		if (show) {
			toggle();
		}
	},
	"FRACTION::SET":(fraction,rang,underRang,infoRangs)=>{
		if(player.fraction != fraction){
			if(fraction == 'LSPD'){
				browserFractions.execute(`lspd_menu.rangs = ${infoRangs}`)
					let mar = {
						type: 1,
						color:  [0,0,255,60],
						position: new mp.Vector3(451.47149658203125,-992.1358642578125,29.689594268798828),
						scale: 1.5
					}
					lspd.locker = createMarker(mar,(m)=>{
						mp.events.callRemote('LSPD::LOCKER');
					});
					mar.position = new mp.Vector3(452.0934753417969,-980.1425170898438,29.689594268798828);
					lspd.arms = createMarker(mar,(m)=>{
						mp.events.callRemote('LSPD::ARMS');
					});
					mar.position = new mp.Vector3(459.6820983886719,-988.9371948242188,23.914859771728516)
					lspd.attendant = createMarker(mar,(m)=>{
						mp.events.callRemote('LSPD::ATTENDANT');
					});
			}
			else{
				if(player.fraction == 'LSPD'){
					lspd.locker.marker.del();
					lspd.arms.marker.del();
					lspd.attendant.marker.del();
				}
			}
		}
	},
	"LSPD::ARMS":()=>{
		let menu = {
			name: 'Оружие',
			exit_mar: lspd.arms.marker,
			items: player.infoRang.weapons.map((item,i)=>{
					return {
						type: 1,
						name: 'Взять '+(weaponsNames[item[0]] || item[0]),
						callback: 'LSPD::TAKE_ARMS',
						callpointenct: i
					};
				})
		}
		createmenuv(menu)
	}
})

mp.keys.bind(0x74, true,toggle)

setInterval(function () {
	if(anumeanstogle){
		let pl = mp.players.atRemoteId(anumeans);
		if(!pl.vehicle){
			let pos = pl.getOffsetFromInWorldCoords(0, 1, 0);
			if(player.vehicle){
				player.taskLeaveAnyVehicle(0, 0);
			}
			player.taskGoToCoordAnyMeans(pos.x, pos.y, pos.z, 10.0, 0, true, 1, 0.0)
		}else{
			if(pl.vehicle.isAnySeatEmpty() && player.vehicle != pl.vehicle)player.taskEnterVehicle(pl.vehicle.handle, 5000, 0, 2, 1, 0);
		}
	}
}, 500);