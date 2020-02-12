
let infoitems = require('./itemsinfo.js');
const User = require('../mongodb/user.js').User;
const vehicle = require('../mongodb/vehicle.js').vehicle;
const cloneArrayJSON = (obj,size)=>{
	return JSON.parse('['+(Array(size).fill(JSON.stringify(obj)).join(','))+']');
} 
let inventory = class inventory{
	constructor(width,height,items,entity,type,update) {
		try{
			this.width = width;
			this.height = height;
			if(items){
				this.items = items;
			}else{
				//Заполнить все яснйки пустым предметом
				this.items = cloneArrayJSON(infoitems[0],width*height)
			}
			if(type == "player"){
				this.item = update;
				this.itemId = update.id;
				this.saveName = infoitems[update.id].playerItem;
				this.update = infoitems[update.id].rightInventoryId;
				this.isplayer = entity.type == "player";
			}else{
				this.interactionInventoryName = entity.id+entity.type+"_"+type;
				this.type = type;
			}
			this.entity = entity;
		}catch(e){
			console.error(e)
		}
  }
  addItem(id,count,data,isactive){
		let item = {}; // клонирование 
		for (let key in infoitems[id]) {
			item[key] = infoitems[id][key];
		}
		let slot = this.findEmptySlot(item);
		if(slot === null) return false;
		if(infoitems[id].isActivate || infoitems[id].isActivates)item.isactive = false;
		if(data) item = Object.assign(item,data);
		this.addItemSlot(slot,item,count);
		if(isactive){
			this.toggleItem(slot);
		}
		return true;
	}
	addItemSlot(slot,item,count,save = true){
		if(infoitems[item.id].isStack){
			if(this.items[slot].count){
				let maxStack = infoitems[item.id].maxStack;
				// если нет места в слоте то ищем слот в котором хватает место и помещаем его туда
				if(this.items[slot].count + count >  maxStack ){
					let maxCount = maxStack - this.items[slot].count;
					let addCount = maxCount > count ? count : maxCount;
					this.items[slot].count += addCount;
					let findSlot = this.findEmptySlot(item);
					// если место не найденно то выкидывает предмет на который не хвотило место
					if(findSlot === null){
						item.count = +(count - addCount).toFixed(1);
						this.dropItem(item, this.entity.position)
					} 
					else this.addItemSlot(findSlot,item,+(count - addCount).toFixed(1),false);
					
				}
				else{
					this.items[slot].count = +(this.items[slot].count + count).toFixed(1);
				} 
			}
			else item.count = count || 1;
		}
		if(this.items[slot].id == 0)this.updateslot(slot,item)
		else this.updateslot(slot)
		if(save)this.saveItems();
	}
	addItemData(item,data){
		if(data) item = Object.assign(item,data);
		let slot = this.findEmptySlot(item);
		
		if(slot === null) return false;
		this.addItemSlot(slot,item,item.count);
		return true;
	}
	removeSlot(id,save = true){
		let item = infoitems[this.items[id].id];
		// if(item.isLies)this.liesItem(item, false);
		let infoitem = infoitems[item.id];
		let x = id%this.width;
		let y = (id-x)/this.width;
		for(let xFor = x;xFor < infoitem.width+x;xFor++){
			for(let yFor = y;yFor < infoitem.height+y;yFor++){
				if(!(x == xFor && y == yFor)){
					let index = yFor * this.width + xFor;
					let itemEmpty = {}; // клонирование 
					for (let key in infoitems[0]) {
						itemEmpty[key] = infoitems[0][key];
					}
					this.items[index] = itemEmpty;
					delete this.items[index].linkId;
				}
			}
		}
		let itemEmpty = {}; // клонирование 
		for (let key in infoitems[0]) {
			itemEmpty[key] = infoitems[0][key];
		}
		this.items[id] = itemEmpty; 
		if(this.entity && this.isplayer===true){
			this.entity.call('INVENTORY::REMOVE_SLOT_ITEM_INVENTORY',[this.itemId,id])
		}else{
			mp.players.callInRange(this.entity.position,10,this.entity.dimension,"INVENTORY::REMOVE_ITEM_ITERACTIVE",[this.interactionInventoryName,id]);
		}
		if(save)this.saveItems();
	}
	updateslot(id,item,update){
		if(item){
			let infoitem = infoitems[item.id];
			this.items[id] = item;
			let x = id%this.width;
			let y = (id-x)/this.width;
			for(let xFor = x;xFor < infoitem.width+x;xFor++){
				for(let yFor = y;yFor < infoitem.height+y;yFor++){
					if(!(x == xFor && y == yFor)){
						let index = yFor * this.width + xFor;
						this.items[index].linkId = id;
					}
				}
			}
		} 
		else item = this.items[id];
		if(this.entity && this.isplayer===true){
			this.entity.call('INVENTORY::UPDATE_SLOT_ITEM_INVENTORY',[this.itemId,id,JSON.stringify(item)])
		}else{
			mp.players.callInRange(this.entity.position,10,this.entity.dimension,"INVENTORY::UPDATE_SLOT_ITEM_INVENTORY_ITERACTIVE",[this.interactionInventoryName,id,JSON.stringify(item)]);
		}
	}
	saveItem(id){
		if(this.entity&&this.isplayer===true){
			User.findOneAndUpdate({_id:this.entity._id}, { ['items.'+this.saveName+".items."+id]:this.items[id]}, function(err, doc){
				if(err)console.error(err)
			});	
		}
	}
	saveItems(){
		if(this.item){
			this.item.items = this.items;
		}
		if(this.isplayer===true){
			User.findOneAndUpdate({_id:this.entity._id}, { $set: { ['items.'+this.saveName+'.items']:this.items}}, function(err, doc){
				if(err)console.error(err)
			});	
		}else if(this.entity && this.entity._id && this.entity.type == "vehicle"){
			vehicle.findOneAndUpdate({'_id':this.entity._id}, { $set: {[this.type]: this.items}}, function(err, doc){
				if(err)console.error(err)
			});	
		}
	}
	moveslot(dragslot,inventory,dragoutslot,update,isthis){
		let slot = inventory.items[dragoutslot];
		if(update && this.isplayer === true){
			if(this.items[dragslot].isActivate == true && this.items[dragslot].isactive == true){
				this.items[dragslot].isactive = false;
				this.itemActive(this.items[dragslot])
			}
		}
		if(infoitems[this.items[dragslot].id].isStack && this.items[dragslot].id == inventory.items[dragoutslot].id && (this.items[dragoutslot].count < infoitems[this.items[dragoutslot].id].maxStack && this.items[dragslot].count < infoitems[this.items[dragslot].id].maxStack)){
			let maxStack = infoitems[this.items[dragslot].id].maxStack;
			let maxCount = +(maxStack - inventory.items[dragoutslot].count).toFixed(1);
			let addCount =  maxStack < maxCount ? +(maxCount - inventory.items[dragoutslot].count).toFixed(1) : this.items[dragslot].count;
			if(+(this.items[dragslot].count - addCount).toFixed(1) <= 0){
				inventory.items[dragoutslot].count = +(inventory.items[dragoutslot].count +  addCount).toFixed(1);
				inventory.updateslot(dragoutslot,inventory.items[dragoutslot],update)
				this.updateslot(dragslot,infoitems[0],isthis?update:null)
			}else{
				this.items[dragslot].count =  +(this.items[dragslot].count-maxCount).toFixed(1);
				inventory.items[dragoutslot].count =  +(inventory.items[dragoutslot].count +maxCount).toFixed(1);
				inventory.updateslot(dragoutslot,inventory.items[dragoutslot],update)
				this.updateslot(dragslot,this.items[dragslot],isthis?update:null)
			}
		}else{
			inventory.updateslot(dragoutslot,this.items[dragslot],update)
			this.updateslot(dragslot,slot,isthis?update:null)
		}
 		if(update){
 			this.saveItems();
 			inventory.saveItems();
 		}
	}
	getItemWeapon(weaponName){
		let weaponHash = typeof weaponName == 'number' ? weaponName : mp.joaat(weaponName);
		return infoitems.find((item)=>{
			if(item.type == "weapon" && item.weapon_hash == weaponHash)return true
		})
	}
	showitems(player){
		player.call('INVENTORY::UPDATE_ITERACTIVE',[this.interactionInventoryName,JSON.stringify(this.items)])
	}
	toggleItem(id){
		let item = this.items[id];
		if(item.id === 0) return;
		if(!infoitems[item.id].isActivate)return;
		if(infoitems[item.id].type == "clothes"){
			if(this.entity.locker_fraction){
				this.entity.alert('Вы сейчас на службе')
				return;
			}
			else if(this.entity.gender == item.gender){
				item.isactive = !item.isactive;
			} 
			else{
				item.isactive = false;
				this.entity.alert('Одежда не вашего пола',1)
				return;
			} 
		}else item.isactive = !item.isactive;
		//Когда ты активирешь придмет который можно активировать не однин раз
		if(!infoitems[item.id].isActivates){
			let serch_item = this.findIdItem(item.id,true)
			if(serch_item != null){
				serch_item.forEach((ser)=>{
					if(ser !== id) {
						this.items[ser].isactive = false;
						this.updateslot(ser);
					}
				});
			}
		}
		this.updateslot(id,item);
		this.saveItems();
		if(this.entity&&this.isplayer===true){
			this.itemActive(item);
		}
	}
	findIdItem(id,isactive){
		let res = [];
		for(let i=0;i<this.items.length;i++){
			let item = this.items[i]
			let slot = i;
			if(item.id==id){
				if(isactive !== null){
					if(item.isactive === isactive) res.push(slot)
				}else res.push(slot)
			}
		}
		if(res.length !== 0) return res;
		return null;
	}
	findItems(id){
		let res = [];
		for(let i=0;i<this.items.length;i++){
			let item = this.items[i]
			if(item.id==id){
				if(isactive != null){
					if(item.isactive == isactive) res.push(item)
				}else res.push(item)
			}
		}
		if(res.length != 0){
			return res;
		}
		return null;
	}
	findItemData(data,value){
		let res = [];
		for(let i=0;i<this.items.length;i++){
			let item = this.items[i]
				if(item[data]===value){
					res.push(item)
				}
		}
		if(res.length != 0){
			if(res.length == 1)return res[0];
			else return res;
		}
		return null;
	}
	findEmptySlot(item){
		for(let i=0;i<this.items.length;i++){
			let itemSlot = this.items[i];
			let hasStack = (!!item && !!infoitems[item.id].isStack && itemSlot.id == item.id && itemSlot.count < infoitems[item.id].maxStack );
			let hasEmptySlotLink =  typeof itemSlot.linkId == "undefined";
			let x = i%this.width;
			let y = (i-x)/this.width;
			let hasSize = !(x+item.width> this.width || y+item.height > this.height);
			// Влезает ли предмет в ширину и в высоту и нету ли есть ли вокруг этого прдемта сcылка на объект предмета
			let hasFreeItem = this.isFreeItem(item,i);
			if(hasSize && hasEmptySlotLink && (hasStack || this.items[i].id === 0) && hasFreeItem){
				return i;
			}
		}
		return null;
	}
	isFreeItem(item,index){
		let infoitem = infoitems[item.id]
		let inventoryWidth = this.width;
		let x = index%inventoryWidth;
		let y = (index-x)/inventoryWidth;
		for(let xFor = x;xFor < infoitem.width+x;xFor++){
			for(let yFor = y;yFor < infoitem.height+y;yFor++){
				if(!(x == xFor && y == yFor)){
					let index = yFor * inventoryWidth + xFor;
					if(this.items[index] && this.items[index].id  || this.items[index] &&  typeof this.items[index].linkId != "undefined" )
					return false;
				}
			}
		}
		return true;
	}
	isEmptySlot(item){
		return this.findEmptySlot(item) != null ? true : false; 
	}
	dropItem(id,pos){
		let item = typeof id == 'number'? this.items[id] : id;
		let drop = infoitems[item.id].drop;
		if(drop === undefined) return;
		drop = typeof drop == "string" ? mp.joaat(drop) : drop;
	 	let obje = mp.objects.new(drop, pos);
	 	obje.item = item;
	 	if(obje.item.isactive == true){
		 	obje.item.isactive = false;
			this.itemActive(obje.item)
		}
		this.removeSlot(id);
		this.saveItems()
	 	obje.setVariable('isitem',true);
	}
	forEach(id,callback){
		for(let i=0;i<this.items.length;i++){
			let item = this.items[i]
			if(item.id==id){
				callback(item,i,this)
			}
		}
	}
	updateAmmoWeapons(hash,ammo){
		for(let i = 0;i<this.items.length;i++ ){
			if(this.items[i].type === 'weapon' && this.items[i].isactive && this.items[i].weapon_hash == hash){
				let item = infoitems[this.items[i].id];
				ammo = parseInt(this.items[i].id == 7 ?  ammo/45 : ammo);
				this.items[i].ammo = ammo;
				this.saveItems();
			}
		}
	}
};

module.exports = inventory;