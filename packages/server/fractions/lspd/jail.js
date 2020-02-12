let moment = require('moment');

let jails = [
    new mp.Vector3(459.25750732421875,-1001.5284423828125,24.914859771728516),
    new mp.Vector3(459.3766174316406,-997.9525756835938,24.914859771728516), 
    new mp.Vector3(460.325927734375,-994.3788452148438,24.914859771728516),
]
function getRandomJail(){
    return jails[mp.getRandomInRange(0,jails.length-1)];
}

let jail = (player,time,reason)=>{
    if(!player.loggined) return;
    let jail = getRandomJail();
    player.savepos();
    let date = new Date(player.mongoUser.time_game);
    date = date.setMinutes(date.getMinutes() + parseFloat(time));
    player.jail = true;
    player.call("LSPD::JAIL",[true]);
    player.position = jail;
    player.mongoUser.jail.time = date;
    player.mongoUser.jail.reason = reason;
    if(!player.mongoUser.$__.saving)player.mongoUser.save().catch(err=>{console.error(err)})
}
let JailExit = {
	pos: new mp.Vector3(443.1412658691406,-982.986083984375,29.689594268798828),
	heading: 80
}
let unJail =  (player)=>{
	if(player.mongoUser.jail.time){
		player.mongoUser.jail = null;
		player.position = JailExit.pos;
		player.heading = JailExit.heading;
		player.mongoUser.pos = JailExit.pos;
        player.jail = false;
        player.call("LSPD::JAIL",[false]);
		if(!player.mongoUser.$__.saving) player.mongoUser.save().catch(err=>{console.error(err)})
		return true;
	}else {
		return false;
	}	
}

mp.events.addCommand('time', (player) => {
    if(!player.mongoUser.jail || !player.mongoUser.jail.time)return player.alert('Вы не сидите в тюрьме')
    let time = player.mongoUser.jail.time - player.mongoUser.time_game;
    let textTime =   moment.duration(time).locale("ru").humanize();
    player.alert(`Вам осталось сидеть ${textTime}`)
});


mp.events.add("LSPD::JAIL_EXIT",(player)=>{
    let jail = getRandomJail();
    player.position = jail;
})
module.exports.jail = jail;
module.exports.unJail = unJail;