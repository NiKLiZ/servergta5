const shops = require('../../../packages/configs/shops').positions;
shops.forEach((shop)=>{
	mp.blips.new(59, shop.pos,{
	    name: '24/7',
	    color: 0,
	    dimension: 0,
	    shortRange: true,
	    alpha: 255
	})
	let mar = {
		type: 1,
		color:  [19,145,32,60],
		scale: 1.5,
		position: shop.pos
	}
	let m = createMarker(mar,(m)=>{
		if(!isGUIOpen()) return;
		mp.events.callRemote('SHOP::MENU');
		guitoggle(true,true)
	});
})
let browserShop = mp.browsers.new('package://HTML/shop/index.html'); 
mp.events.add({
	"SHOP::MENU":(menu)=>{
		browserShop.execute(`shop.show = true; shop.items = ${menu};shop.menu = 0;`);
	}
})