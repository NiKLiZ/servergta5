mp.events.add("playerWeaponChange", (player, oldWeapon, newWeapon) => {
	player.call('WeaponChange',[oldWeapon,newWeapon])
});