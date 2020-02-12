require('./save_clothes.js');
const clothes = mp.configs.clothes;
let addClothes = require('./addClothes.js');
let infoitems = require('../inventory/itemsinfo.js');

let inventoryItemTypeId = {
	1: 2,
	2: 3,
	3: 4,
	4: 5,
	5: 8,
	6: 9,
	7: 10,
	8: 11,
	9: 12,
	10: 13,
	11: 14,
	12: 63
}

let add_event = (name,conf,id)=>{
	mp.calbackmenuv(name,(player,array)=>{
		let clot = clothes[conf][player.gender][parseInt(array[0])]
		let item = infoitems[inventoryItemTypeId[id]];
		if(!player.inventory.isEmptySlot(item))return player.alert('Нет свободного места в инвентаре');
		if(!player.editMoney(-clot.price,'Одежда'))return
		player.alert('Вы купили одежду',2);
		addClothes(player,id,array,true);
	});
}

mp.calbackmenuv('buy_top',(player,array)=>{
	let top = clothes['tors'][player.gender][parseInt(array[0])]
	let additionally = clothes.additionally[player.gender].filter((item)=>{
		if(top.type === item.type) return true;
	})
	let price = top.price + additionally[parseInt(array[2])].price;
	let item = infoitems[inventoryItemTypeId[1]];
	if(!player.inventory.isEmptySlot(item))return player.alert('Нет свободного места в инвентаре');
	if(!player.editMoney(-price,'Одежда'))return;
	player.alert('Вы купили одежду',2);
	addClothes(player,1,array,true);
});

add_event('buy_legs','legs',2)
add_event('buy_foot','foot',3)
add_event('buy_glove','gloves',4)
add_event('buy_hats','hats',5)
add_event('buy_glasses','glasses',6)
add_event('buy_ears','ears',7)
add_event('buy_masks','masks',8)
add_event('buy_accessories','accessories',9)
add_event('buy_watches','watches',10)
add_event('buy_bracelets','bracelets',11)
add_event('buy_bags','bags',12)