global.menushow = false;
global.menuactive = true;
// f2
let browserMenu = mp.browsers.new('package://HTML/menu/index.html'); 
module.exports.browserMenu = browserMenu;
mp.keys.bind(0x71,false,function(){
	if(chatActive || !loggined || !menuactive) return;
	menushow= !menushow;
	guitoggle(menushow)
	global.menuactive = true;
	browserMenu.execute(`menu.togleMenu()`);
	mp.events.callRemote("MENU::GET_ADMIN")
});

mp.events.add({
	"MENU::ADD_TRANSACTION": (info,money) => {
		browserMenu.execute(`menu.addtransaction(${info},${money})`);
	},
	"MENU::INFO_MENU":(info)=>{
		browserMenu.execute(`menu.setInfo(${info})`);
	},
	"MENU::TRANSACTIONS":(...transactions)=>{
		browserMenu.execute(`menu.transactions = ${transactions.join('')}`)
	},
	"AUTHORIZETE::SUCCESS_LOAD":()=>{
		browserMenu.execute(`menu.name = '${player.name}'`)
	},
	"MENU::INFO_VEHICLES":(vehicles)=>{
		vehicles = JSON.parse(vehicles)
		vehicles.forEach((veh)=>{
			veh.model = mp.game.ui.getLabelText(mp.game.vehicle.getDisplayNameFromVehicleModel(veh.model))
		})
		browserMenu.execute(`menu.vehicles = ${JSON.stringify(vehicles)}`)
	},
	"MENU::GET_ADMIN":(admins,helpers)=>{
		browserMenu.execute(`
		menu.admins = ${admins};
		menu.helpers = ${helpers};`)
	},
	"MENU::ADD_MESSAGE_REPORT":(message)=>{
		browserMenu.execute(`menu.addReportMessage(${message})`)
	},
	"MENU::ADD_LICENSE":(license)=>{
		browserMenu.execute(`menu.licenses['${license}'] = true`)
	}
});

function test(){

	let pedHeadShot;
	if (pedHeadShot == null) {
		pedHeadShot = mp.players.local.registerheadshot();
		mp.gui.chat.push(`pedHeadShot: ${pedHeadShot}`);
	}
	// while (!mp.game.ped.isPedheadshotValid(pedHeadShot) || !mp.game.ped.isPedheadshotReady(pedHeadShot)){
	// 	mp.game.system.wait(100);
	// }
	// let headshotTexture = mp.game.ped.getPedheadshotTxdString(pedHeadShot);
	
	// mp.events.add('render', () => {
	// 	mp.game.graphics.drawSprite(headshotTexture, headshotTexture, 0.5, 0.5, 0.1, 0.1, 0, 255, 255, 255, 255);
	// })

	// chat(mp.game.invoke("0x5E62BE5DC58E9E06"));


	let pedCLone = player.clone(30, false, true);
	
	// chat(mp.game.invoke("0x027DB6817AB239EB",pedCLone,1,0));
	// REQUEST_MENU_PED_MODEL
	chat(mp.game.invoke("0xA0261AEF7ACFC51E",player.model));
	// 0x4668D80430D6C299 
	chat(mp.game.invoke("0x4668D80430D6C299 ",pedCLone));
	// 	
	let  t = mp.game.invoke("0xAC0BFBDC3BE00E14",pedCLone,1)
	// SET_PAUSE_MENU_PED_LIGHTING
	chat(mp.game.invoke("0x3CA6050692BC61B0",true));
	copy(t)
	
	mp.events.add('render', () => {
		mp.game.graphics.drawSprite(69172, 69172, 0.3, 0.3, 0.4, 0.4, 0, 255, 255, 255, 255);
	})
}
