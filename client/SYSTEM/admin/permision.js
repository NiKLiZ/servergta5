let {browserListPlayers} = require('../../UI/listplayers');
mp.events.add('PERMISION::SET',(per)=>{
	player.permision = JSON.parse(per);
	browserListPlayers.execute(`list_players.hasShowFraction = ${!!player.permision['PLAYER_LIST::SHOW_FRACTION']}`);
})
player.permision = {};