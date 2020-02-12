var player = mp.players.local;
mp.gui.chat.show(false);
mp.gui.chat.safeMode = false;
mp.gui.chat.colors = false;
mp.game.ui.displayRadar(false);
player.freezePosition(true);
mp.game.cam.destroyAllCams(false);
global.cam = mp.cameras.new('default',new mp.Vector3(-1074.6763916015625,5234.841796875,222.2374267578125),new mp.Vector3(0,0, 0), 90.0);
cam.setActive(true); 
mp.game.cam.renderScriptCams(true, false, 15000, true, false);
global.browser = mp.browsers.new('package://HTML/index.html'); 
browser.execute(`window.cdn = "http://fivem.untamedhero.com/rage-en/"`);
mp.gui.execute(`$('#chat').remove()`);
browser.markAsChat();
mp.gui.chat.activate(false);
var loggined = false;
let guiReady = false;
let browserReady = false;
var ClientInterval;
mp.events.add({
	"render": () => {
		 if(!global.clientsideLoaded) {
		 	const graphics = mp.game.graphics;
		 	mp.game.controls.disableAllControlActions(0);
		 	graphics.drawText(`Загрузка интерфейса`, [0.5, 0.5], { font: 4, color: [255, 255, 255, 255], scale: [0.6, 0.6], outline: true });
		 	graphics.drawText(`Если долго не заходит, то перезайдите`, [0.5, 0.55], { font: 4, color: [255, 255, 255, 255], scale: [0.6, 0.6], outline: false,centre: true });
		 	graphics.drawRect(0.5, 0.5, 1, 1, 0,0,0,200);
		 }
	},
	"guiReady":()=>{
		guiReady = true;
		mp.gui.execute(`$('#chat').remove()`);
		if(browserReady && guiReady)mp.events.callRemote("playerReadyLoad")
	},
	"browserDomReady":(brow)=>{
		if(brow == browser){
			browserReady = true;
			if(browserReady && guiReady)mp.events.callRemote("playerReadyLoad")
		} 
	}
});
require('./client.js')