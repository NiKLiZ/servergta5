let TimeoutUpdateItems = null;
let weapon;
let ammoWeapon;
mp.events.add({
	"playerWeaponShot":  ()=> {
		if(TimeoutUpdateItems){
			clearTimeout(TimeoutUpdateItems);
		}	
		if(player.weapon != 2725352035){
			weapon = player.weapon
			ammoWeapon = player.getAmmoWeapon(player.weapon);
		}
		TimeoutUpdateItems = setTimeout(()=>{
			TimeoutUpdateItems = null;
			mp.events.callRemote("updateAmmoWeapons",weapon,ammoWeapon);
		},500)
	}
}) 	