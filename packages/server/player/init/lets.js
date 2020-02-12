module.exports = function(player) {
	player.money = 0;
	player.health = 100;
	player.armour = 0;
	player.admin = false;
	player.mute = false;
	player.rc = null;
	player._id = null;
	player.joinhome = false;
	player.vehicles = [];
	player.heading = 325;
	//jobs
	player.status_taxi = 0;
	//voice
	player.voice_active = 0;
	player.voice_listen = 0;
	player.time_game = 0;
	player.jail = false;
	player.lastJoin_date = new Date().getTime();
	player.Join_date = new Date().getTime();

	player.setVariable('visible',true);
	player.armsLastTime = {};

	player._attachments = [];
	player._bodyWeapons = {};
	player.vehiclesKeys = [];
}