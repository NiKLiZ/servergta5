let banks = [new mp.Vector3(149.90382385253906,-1040.5643310546875,29.37909698486328), 
new mp.Vector3(314.365478515625,-278.9095458984375,54.175811767578125), 
new mp.Vector3(-2962.565185546875,482.98480224609375,15.708114624023438),
new mp.Vector3(-113.12633514404297,6469.716796875,31.6267147064209),
new mp.Vector3(-350.82275390625,-49.6043701171875,49.04759216308594),
new mp.Vector3(246.15802001953125,222.8441925048828,106.28683471679688),
new mp.Vector3(1174.8482666015625,2706.8046875,38.09906005859375),
new mp.Vector3(-1212.77978515625,-330.4972839355469,37.792049407958984),]

mp.game.object.doorControl(73386408, -348,8109, -47,26213 ,49,38759, false, 0.0, 50.0, 0); 
mp.game.object.doorControl(3142793112,-351,2598, -46,41221, 49,38765, false, 0.0, 50.0, 0); 

let browserBank = mp.browsers.new('package://HTML/bank/index.html'); 

let show = false;
exports.bankPositions = banks;
exports.browserBank = browserBank;
banks.forEach((bank)=>{
	let mar = {
		type: 29,
		color:  [19,145,32,60],
		scale: 1,
		position: bank
	}
	let m = createMarker(mar,(m)=>{
		mp.events.callRemote('BANK::MENU');
	});
	m.marker.colshape.exitmenu = 'BANK::ADD_CARD';
	mp.blips.new(431, bank,{
	    name: 'Банк',
	    color: 52,
	    dimension: 0,
	    shortRange: true,
	    alpha: 255
	})
})

mp.events.add({
	"BANK::ADD_CARD_MENU":()=>{
		let menu = {
			name: 'Банк',
			exitmenu: 'BANK::ADD_CARD',
			items: [
				{
					type: 1,
					name: 'Оформить карту',
					callback_remote: 'BANK::ADD_NEW_CARD',
					placeholder: 'Оформить карту 5$'
				}
			]
		}
		createmenuv(menu);
	},
	"BANK::CARD_MENU":(accounts)=>{
		show = !show;
		browserBank.execute(`
			bank.name = "${player.name}";
			bank.show = true;
			bank.menu = 'bank';
			bank.accounts = ${accounts};
			bank.account = 0;
			bank.hideOverlay();
		`);
		guitoggle(true);
	}
})