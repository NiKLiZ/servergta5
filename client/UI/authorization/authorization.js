let browserAuth = mp.browsers.new('package://HTML/auth/index.html'); 
module.exports.browser = browserAuth; 
let {browserHud} = require('../GUI/gui')
let {browserInventory} = require('../inventory/index.js');
let spawnMenu = mp.browsers.new('package://HTML/spawnMenu/index.html'); 
mp.events.add({
	"AUTHORIZETE::FORM_REG": () => {
		if(mp.storage.data.setting.authauto === true && mp.storage.data.authpass!=undefined&&mp.storage.data.authpass != ''){
			alert('Входим')
			mp.events.callRemote('AUTHORIZETE::CHECK_AUTH_AUTO',mp.storage.data.authpass);
		}else{
			browserAuth.execute(`window.auth.start('${mp.storage.data.email ? mp.storage.data.email : "" }' ,${!mp.storage.data.email});`);
			cursor(true);
		}
	},
	"AUTHORIZETE::FORM_AUTH":(pas)=>{
		if(pas) mp.storage.data.authpass = pas;
		if(mp.storage.data.setting.authauto === true && mp.storage.data.authpass!=undefined &&  mp.storage.data.authpass != '' &&  pas != ''){
			alert('Входим')
			mp.events.callRemote('AUTHORIZETE::CHECK_AUTH_AUTO',mp.storage.data.authpass);
		}else{
			browserAuth.execute(`window.auth.start('${mp.storage.data.email ? mp.storage.data.email : ''}');`);
			cursor(true);
		}
	},
	"AUTHORIZETE::CHECK_REG":(name,surname,pass,email,check,regPromo)=>{
		mp.events.callRemote('AUTHORIZETE::CHECK_REG',name,surname,pass,email,regPromo)
		mp.storage.data.setting.authauto = check;//|Доделать|
		mp.storage.flush();
	},
	"AUTHORIZETE::CHECK_AUTH":(email,pass,check)=>{
		mp.events.callRemote('AUTHORIZETE::CHECK_AUTH',email,pass);
		mp.storage.data.email = email;
		mp.storage.data.setting.authauto = check;//|Доделать|
		mp.storage.flush();
	},
	"AUTHORIZETE::REG_SUCCESS":(pas,playervars,tips)=>{
		alert('Вы успешно зарегистрированы',2)
		log(pas,playervars,tips);
		mp.events.call('cameradefault',0);
		player.position = new mp.Vector3(-1039.8583984375,-2737.814208984375,12.819873809814453);
	},
	"AUTHORIZETE::AUTH_SUCCESS":(authpass,playervars,tips)=>{
		alert('Вы успешно авторизовались',2)
		log(authpass,playervars,tips);
		mp.events.call('cameradefault',3000);
	},
	"AUTHORIZETE::NOTIFICATION":(msg,type)=>{
		alert(msg,type);
	},
	"AUTHORIZETE::SPAWN_START":(items)=>{
		cursor(true);
		spawnMenu.execute(`startSpawnMenu(${items})`)
		browserAuth.execute(`window.auth.hide()`);
	}
});
let log = (authpass,playervars)=>{
	if(mp.storage.data.setting.authauto==true) mp.storage.data.authpass = authpass;
	else mp.storage.data.authpass = undefined;
	browserAuth.active = false;
	mp.storage.flush();
	spawnMenu.execute(`
		stopSpawnMenu();
		`);
	browserHud.execute(`hud.show = true;`)
		
	browserAuth.execute(`window.auth.hide();`)
	cursor(false);
	mp.gui.chat.activate(true);
	displayRadar(true);
	player.freezePosition(false);
	if(playervars) player = Object.assign(player,JSON.parse(playervars));
	// global.clothes_shop = player.clothes;
	player.clothes = null;
	global.infoitems = player.infoitems;
	global.loggined = true;
	// Исправить точно ты же не чубака
	setTimeout(()=>{
		browserInventory.execute(`window.nickName = '${player.name}'`)
		mp.events.call("AUTHORIZETE::SUCCESS_LOAD")
	},2000)
	mp.events.call('AUTHORIZETE::SUCCESS');
	// for(let i=0;i<player.points.length;i++){
	// 	let m = player.points[i];
	// 	createMarker(m);
	// }
}


setInterval(()=>{
	mp.discord.update("westrp.ru West RP", `Збт ID:${player.remoteId}`);
},10000)