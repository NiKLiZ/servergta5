let show = false;
let browserListPlayers = mp.browsers.new('package://HTML/listPlayers/index.html'); 
mp.keys.bind(0x77, false, () => {
	if(chatActive || !loggined || menushow ) return;
	if(!show && mp.gui.cursor.visible) return;
	show = !show;
	browserListPlayers.execute(`window.TogglewPlayersList(${''+show})`);
});

mp.events.add({
	"LIST_PLAYERS::LOAD":(ret)=>{
		browserListPlayers.execute(`mp.call('ShowPlayersList',${ret})`)
	}
})

exports.browserListPlayers = browserListPlayers;
