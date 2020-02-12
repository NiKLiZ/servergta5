mp.events.add({
	"moveSlot":  (mg, md,main,right)=> {
		let first = -1, second = -1;
		if(mg == -1||mg==md) return;
		if(mg < 30){
			first = mg;
			second = md;
		}else{
			first = md;
			second = mg;
		}
		if(!player.items[mg]) return;
		if(player.items[mg].id){
			mp.events.callRemote('moveSlot',first,second,main,right);
		}
	},
	"updateslot":  (id, item)=> {
		if(typeof(item) != 'object') item = JSON.parse(item);
		player.items[id] = item;
		if(item.id != 0){
			player.items[id] = item;
			if(item.id == 6)item.name = mp.game.ui.getLabelText(mp.game.vehicle.getDisplayNameFromVehicleModel(mp.game.joaat(item.model)));
			else if(item.count != false )item.name = item.count
			else item.name = '';
			item.image = infoitems[item.id].image;
			browser.execute(`menu.editItem(${id},${JSON.stringify(item)})`);
		}else{
			player.items[id] = {}
			browser.execute(`menu.editItem(${id},null)`);

		}
	},
	"INVENTORY::UPDATE_RIGHT":(items)=>{
		items = JSON.parse(items);
		items.forEach((item,i)=>{
			mp.events.call('updateslot',i+30, item ? item : {id:0});
		})
	}
});
global.inventoryright = {};
global.addinventoryright = (name,placeholder)=>{
	inventoryright[name] = {name:name,placeholder:placeholder};
	browser.execute(`menu.addRightInventory('${name}','${placeholder}')`)
	mp.events.callRemote('ShowItemsInventory',name);
	mp.events.add(name+'move',(id,item)=>{
		mp.events.call('updateslot',id,item);
	})
}
global.removeinventoryright = (name)=>{
	if(inventoryright[name] == undefined) return;
	inventoryright[name] = null;
	browser.execute(`menu.removeRightInventory('${name}')`);
	mp.events.remove(name+'move');
}
