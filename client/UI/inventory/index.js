let show = false;
require('./giveItem');
let infoitems = require('../../../packages/server/inventory/itemsinfo')
let intervalFaint;
let browserInventory = mp.browsers.new('package://HTML/inventory/index.html'); 	
let {browserElements} = require('./../elements/index.js');
const educationTasksList = require('../education/index');
mp.keys.bind(0x49,false,function(){
	if(chatActive || !loggined || (mp.gui.cursor.visible && !show)) return;
	if(hasJail && !show)return alert('Нельзя использовать инвентарь в тюрьме')
	show= !show;
	guitoggle(show);
	browserInventory.execute(show ? `inventory.show = ${show}` : `inventory.hide()`);

	if (educationTasksList.getTask('openInventory')) educationTasksList.setTask('openInventory');
	
});
mp.events.add({
	"INVENTORY::UPDATE_ITERACTIVE":(inventory,items)=>{
		browserInventory.execute(`inventory.setIteractiveItems('${inventory}',${items})`)
	},
	"INVENTORY::REMOVE_ITEM_ITERACTIVE":(inventory,id)=>{
		browserInventory.execute(`inventory.removeInteractionItem('${inventory}',${id})`)
	},
	"INVENTORY::UPDATE_SLOT_ITEM_INVENTORY_ITERACTIVE":(inventory,id,item)=>{
		item = JSON.parse(item);
		if(item.count != false )item.name = item.count
		else item.name = '';
		browserInventory.execute(`inventory.setInteractionItem('${inventory}',${id},${JSON.stringify(item)})`);
	},
	"INVENTORY::LOAD_PLAYER_ITEMS":(items)=>{
		browserInventory.execute(`inventory.playerItems = ${items}`)
	},
	"INVENTORY::UPDATE_PLAYER_SLOT":(slotId,item)=>{
		browserInventory.execute(`inventory.updateItemPlayer('${slotId}', ${item})`)
	},
	"INVENTORY::DROP_ITEM":(slot,inventory)=>{
		mp.events.callRemote('INVENTORY::DROP_ITEM',slot,inventory);
	},
	"INVENTORY::SHOW_RIGHT_INVENTORY":(id,items)=>{
		if(items == 'null') items = '[]';
		browserInventory.execute(`inventory.rightInventories[${id}].show = true`);
		browserInventory.execute(`inventory.setRightItems(${id},${items})`);
	},
	"INVENTORY::HIDE_RIGHT_INVENTORY":(id)=>{
		browserInventory.execute(`inventory.hideRightItems(${id});`);
	},
	"INVENTORY::UPDATE_SLOT_ITEM_INVENTORY":(itemIdInventory,id,item)=>{
		let inventory = infoitems[itemIdInventory].rightInventoryId;
		item = JSON.parse(item);
		if(item.count != false )item.name = item.count
		else item.name = '';
		browserInventory.execute(`inventory.setRightItem(${inventory},${id},${JSON.stringify(item)})`);
	},
	
	"INVENTORY::REMOVE_SLOT_ITEM_INVENTORY":(itemIdInventory,id,itemId)=>{
		let inventory = infoitems[itemIdInventory].rightInventoryId;
		browserInventory.execute(`inventory.removeRightItem(${inventory},${id});`);
	},
	"INVENTORY::UPDATE_HUNGER": (satiety, thirst) => {
		browserInventory.execute(`inventory.hunger = ${satiety}; inventory.water = ${thirst};`);
		player.satiety = satiety;
		player.thirst = thirst;
		if((player.satiety == 0 || player.thirst == 0 ) && !intervalFaint){
			statFaint();
		}else{
			stopFaint();
		}
	},
	"DOCUMENT::SHOW":(info)=>{
		browserElements.execute(`showItem(${info})`);
	}
})
mp.events.add("dropItem", function (id) {
	let item = player.items[id];
	if(!infoitems[item.id].id) return;
	mp.events.callRemote('dropItem',id);
})

let interactionsInventory = {};
let addInteractionInventory = (name,placeholder)=>{
	interactionsInventory[name] = {name:name,placeholder:placeholder};
	browserInventory.execute(`inventory.addInteractionInventory('${name}','${placeholder}')`)
	mp.events.callRemote('ShowItemsInventory',name);
}
let removeInteractionInventory = (name)=>{
	if(interactionsInventory[name] == undefined) return;
	interactionsInventory[name] = undefined;
	browserInventory.execute(`inventory.removeInteractionInventory('${name}')`);
}

module.exports = {addInteractionInventory,removeInteractionInventory,browserInventory}


function statFaint(){
	let time = 3*60*1000;
	intervalFaint = setInterval(()=>{
		if(player.thirst == 0){
			player.setToRagdoll(5000 ,6000 ,0,false,false,false)
			alert('Вы упали в обморок, срочно купите воды в 24/7')
		}
		else if(player.satiety == 0){
			player.setToRagdoll(4000 ,4000 ,0,false,false,false)
			alert('Вы упали в обморок, срочно покормите вашего персонажа')
		}
		
	},time)
}
function stopFaint() {
	clearInterval(intervalFaint)
	intervalFaint = undefined;
}
