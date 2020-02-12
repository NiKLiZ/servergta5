const ban = require('../mongodb/ban.js').ban;
const decoder = require('../a/functions/decoder.js');
const decoder_cef = require('../a/functions/decoder_cef.js');

let withSocial = mp.config.withSocial

let join = (player) => {
	if(player.ready)return;
	let social = player.socialClub;
	if(withSocial && withSocial.indexOf(social) == -1)return player.kick();
	player.ready = true;
	player.alert = alert(player);
	player.dimension = player.id*324+10;
	if(mp.debag == false){
		player.eval(`browser.execute(\`${decoder_cef}\`)`)
		player.eval(decoder)
	} 
	ban.findOne({$or : [{value: player.name},{value: player.ip}, {value: social}, {value: social}]},(err,done)=>{
		if(err){
			player.alert('Произошла ошибка входа',1)
			return console.error(err)
		}
		if(done){
			if (done.LiftTimestamp == -1) {
				player.notify(`Вы были забанены. \nПричина: ${done.Reason}`);
				player.kick("Banned from server.");
			}else{
				if(done.LiftTimestamp > mp.bans.getUnixTimestamp()) {
					player.notify(`Вы были забанены. Причина: ${done.Reason}Конец бана: \n${mp.bans.formatUnixTimestamp(done.LiftTimestamp)}`);
					player.kick("Banned from server.");
				} else {
					player.call('AUTHORIZETE::FORM_REG');
					mp.bans.remove(done.name).throw(()=>{
						player.alert('Вы были разбанены за '+done.name);
					}).catch((err) => {
						console.error(err);
						player.notify("Произошла ошибка разбана напиши администраторам об этом");
						player.kick("Произошла ошибка разбана");
					});
				}
			}
		}else{
			player.call('AUTHORIZETE::FORM_REG');
		}
	});
}
mp.events.add({
	'playerReadyLoad': join,
});
let alert = (player)=>{
	return (text,type, time,pos,progresbar)=>{
		let args = [text]
		if(type)args.push(type)
		if(time)args.push(time)
		if(pos)args.push(pos)
		if(progresbar)args.push(progresbar)
		player.call('alert',args)
	}
}
