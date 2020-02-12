let infoitems = require('./itemsinfo.js');
let clothes = require('../../configs/clothes.json');
let donClothes = require('../clothes/donClothes.js');
let inventory = require('./newclass.js');
const phoneModel = require('../mongodb/phone.js').phone;
const User = require('../mongodb/user.js').User;
const weaponData = require("../../configs/weaponData");

let weaponSlots = ['weapon1','weapon2','weapon3','weapon4']

let playerInventory = class playerInventory{
	constructor(player,items = {}) {
		this.entity = player;
		this.items = items;
		player.call("INVENTORY::LOAD_PLAYER_ITEMS",[JSON.stringify(items)]);
	}
	addItem(id,count,data,isactive){
		let item = {}; // клонирование 
		let infoitem = infoitems[id];
		for (let key in infoitem) {
			item[key] = infoitem[key];
		}
		if(item.isStack && count)item.count = count;
		if(data) item = Object.assign(item,data);
		let hasEmptySLot = this.isEmptySlotPlayer(item);
		if((!!item.playerItem || item.type == "weapon" && this.isEmptyWeapon(item)) && hasEmptySLot){
			let playerItem = item.type == "weapon" ? this.findEmptySlot(item) : item.playerItem;
			this.items[playerItem] = item;
			if(item.inventory){
				item.items =  cloneArrayJSON(infoitems[0],infoitem.inventoryWidth*infoitem.inventoryHeight);
			}
			this.updateslot(playerItem,item);
			this.itemActive(item);
			this.saveItem(playerItem);
			this.refetchKeysVeh();
			return true;
		}else{
			for(let i in this.items){
				let itemInventory = this.items[i];
				if(itemInventory){
					let infoitemInventory = infoitems[itemInventory.id];
					if(infoitemInventory.inventory == true && infoitemInventory.id != item.id && (!item.inventory || !infoitemInventory.hasNotInventoryInside) || infoitemInventory.id == 63 && infoitemInventory.id != item.id){
						let inventory = this[infoitemInventory.playerItem];
						let hasClothesAddItem = inventory.item.id == 63 || ( item.width == 1 && item.height == 1)
						if(inventory.isEmptySlot(item) && hasClothesAddItem){
							inventory.addItemData(item);
							this.refetchKeysVeh();
							return true;
						}
					}
				}
			}
		}
		return false;
	}
	addItemAllHands(item){
		let itemInfo = infoitems[item.id];
		if(!this.hasAllNotEmptyGlove()){
			this.updateslot('hand1',item)
			this.saveItem('hand1');
			if(itemInfo.isLies)this.liesItem(item, true);
			return true
		}else return false
	}
	addItemData(item,data){
		// Когда добавлять предмет который можно положить только в руки
		let itemInfo = infoitems[item.id];
		if(itemInfo.allHandSlot == true ){
			this.addItemAllHands(item);
			return true;
		}
		// доделать примерно как и additem
		if(data) item = Object.assign(item,data);
		let slot = this.isEmptySlotPlayer(item);
		if(!slot){
			if(this.isEmptySlot(item)){
				for(let i in this.items){
					let itemInventory = this.items[i];
					let infoitemInventory = infoitems[itemInventory.id];
					if(infoitemInventory.inventory == true){
						let inventory = this[infoitemInventory.playerItem];
						let hasClothesAddItem = inventory.item.id == 63 || ( item.width == 1 && item.height == 1)
						if(inventory && inventory.isEmptySlot && inventory.isEmptySlot(item) && hasClothesAddItem){
							inventory.addItemData(item);
							if(item.id == 6)this.refetchKeysVeh();
							return true;
						}
					}
				}
			} 
			return false;

		}
		let playerItem = item.type == "weapon" ? this.findEmptySlot(item) : item.playerItem;
		this.addItemSlot(playerItem,item,item.count);
		this.itemActive(item);
		if(item.id == 6)this.refetchKeysVeh();
		return true;
	}
	addItemSlot(slot,item,count,save = true){
		// Когда добавлять предмет который можно положить только в руки
		let itemInfo = infoitems[item.id];
		if(itemInfo.allHandSlot == true ){
			if(this.hasAllNotEmptyGlove()){
				this.updateslot('hand1',item)
				this.saveItem('hand1');
				return true;
			}else false
		}
		if(itemInfo.isStack){
			if(this.items[slot].count){
				let maxStack = itemInfo.maxStack;
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
		if(this.isEmptySlot(slot))this.updateslot(slot,item)
		else this.updateslot(slot)
		if(item.isLies)this.liesItem(item, true);
		if(save)this.saveItem(slot);
	}
	saveItem(id){
		User.findOneAndUpdate({_id:this.entity._id}, { ['items.'+id]:this.items[id]}, function(err, doc){
			if(err)console.error(err)
		});	
	}
	saveAllItems(){
		this.saveItems();
		for(let i in this.items){
			let itemInventory = this.items[i];
			let infoitemInventory = infoitems[itemInventory.id];
			if(infoitemInventory.inventory == true){
				let inventory = this[infoitemInventory.playerItem];
				inventory.saveItems();
			}
		}
	}
	saveItems(){
		User.findOneAndUpdate({_id:this.entity._id}, { 'items':this.items}, function(err, doc){
			if(err)console.error(err)
		});	
	}
	itemActive(item){
		try{
			if(!item)return;
			let infoitem = infoitems[item.id];
			let type = infoitem.type;
			let active = !this.isEmptySlotPlayer(item);
			if(infoitem.inventory){
				if(active){
					if(mp.players.exists(this.entity))this.entity.call("INVENTORY::SHOW_RIGHT_INVENTORY",[infoitem.rightInventoryId,JSON.stringify(item.items) ])
					this[infoitem.playerItem] = new inventory(infoitem.inventoryWidth,infoitem.inventoryHeight,item.items,this.entity,"player",item);
				}
				else{
					this.entity.call("INVENTORY::HIDE_RIGHT_INVENTORY",[infoitem.rightInventoryId ])
					this[infoitem.playerItem] = undefined;
				} 
			}
			if(type == "clothes"){
				if(this.entity.gender == item.gender) donClothes(this.entity,item,active);
			} 
			else if(type == "bag"){
				donClothes(this.entity,item,active);
			} 
			else if(type == 'weapon'){
				let weaponActive = this.isWeapon(item);
				if(weaponActive == true){
					let ammo = item.id == 7 ? item.ammo * 45 : item.ammo;
					this.entity.setWeaponAttachment(infoitem.weapon_hash,ammo);
				}else{
					if(item.id == 7){
						this.entity.setWeaponAmmo(infoitem.weapon_hash,0);
					}
					this.entity.setWeaponAmmo(infoitem.weapon_hash,0);
					this.entity.removeWeaponAndAttachment(infoitem.weapon_hash);
				}
			}
			else if(type == 'card'){
				if(active == true){
					let card = mp.cards[item.card_id.toString()]
					if(card){
						this.entity.call('HUD::UPDATE_BANK_MONEY',[card.money]);
						this.entity.card = card;
					}
				}else{
					this.entity.call('HUD::UPDATE_BANK_MONEY',[null])
					this.entity.card = null;
	
				}
				this.entity.updateInfoMenu();
			}
			else if(type == 'phone'){
				if(active == true){
					phoneModel.findOne({_id:item.phone}).then((phone)=>{
						if(!phone){
							this.entity.call('PHONE::DATA_UPDATE',[undefined])
							this.entity.phone = null;
							return this.entity.alert('Телефон не найден')
						}
						this.entity.call('PHONE::DATA_UPDATE',[JSON.stringify(phone._doc)])
						this.entity.phone = phone;
					}).catch((err)=>{
						this.entity.alert('Произошла ошибка')
						console.error(err)
					})
				}else{
					if(this.entity.caller)mp.events.callSocket('PHONE::CALL_REJECT',this.entity.socket,this.entity);
					this.entity.call('PHONE::DATA_UPDATE',[undefined])
					this.entity.phone = null;
				}
			}
		}catch(e){
			console.error(e)
		}
	}
	isEmptySlotPlayer(item){
		let playerItem = typeof item == "object" ? item.playerItem : item;
		if(typeof item == "object" && !item.playerItem && item.type != "weapon")return false
		if(typeof item == "object" && item.type == "weapon"){
			for(let i = 0 ;i< weaponSlots.length;i++){
				let weaponSlot = weaponSlots[i];
				if(typeof this.items[weaponSlot] != 'object' || this.items[weaponSlot].id == 0)return true;
			}
			return false;
		}
		if(typeof this.items[playerItem] != 'object' || this.items[playerItem] == null || !this.items[playerItem].id)return true;
		return false;
	}
	isEmptySlot(item){
		item = typeof item == "number" ? infoitems[item] : item;
		if(this.isEmptySlotPlayer(item))return true;
		for(let i in this.items){
			let itemInventory = this.items[i];
			if(itemInventory){
				let infoitemInventory = infoitems[itemInventory.id];
				if(infoitemInventory.inventory == true && infoitemInventory.id != item.id && (!item.inventory || !infoitemInventory.hasNotInventoryInside)  || infoitemInventory.id == 63 && infoitemInventory.id != item.id){
					let inventory = this[infoitemInventory.playerItem];
					if(inventory && inventory.isEmptySlot(item)){
						return true;
					}
				}
			}
		}
		return false;
	}
	findEmptySlot(item){
		if(typeof item == "object" && item.type == "weapon"){
			for(let i = 0 ;i< weaponSlots.length;i++){
				let weaponSlot = weaponSlots[i];
				if(typeof this.items[weaponSlot] != 'object' || this.items[weaponSlot].id == 0 && this.isEmptyWeapon(item))return weaponSlot;
			}
		}
		if(item.playerItem){
			if(!this.items[item.playerItem])return  item.playerItem;
		}
		return false;
	}
	isEmptyWeapon(item){
		for(let i = 0 ;i< weaponSlots.length;i++){
			let weaponSlot = weaponSlots[i];
			if(typeof this.items[weaponSlot] == 'object' && this.items[weaponSlot].weapon_hash == item.weapon_hash)return false;
		}
		return true;
	}
  refetchItems(){
	  try{

		  let ignorClothes = [];
		  for(let i in this.items){
			  let item = this.items[i];
			  if(item && i != "undefined"){
				  this.itemActive(item);
				  let type = infoitems[item.id].type;
				  if(type == "clothes" || type == "bag"){
					  if(item.id == 2){
						  ignorClothes[11] = true;
						  ignorClothes[3] = true;
						  if(item.first) ignorClothes[8] = true;
					  }
					  if(item.id == 3)ignorClothes[4] = true;
					  if(item.id == 4)ignorClothes[6] = true;
					  if(item.id == 5)ignorClothes[3] = true;
					  if(item.id == 11)ignorClothes[1] = true;
					  if(item.id == 12)ignorClothes[7] = true;
					  // props
					  if(item.id == 8)ignorClothes[13] = true;
					  if(item.id == 9)ignorClothes[14] = true;
					  if(item.id == 10)ignorClothes[15] = true;
					  if(item.id == 13)ignorClothes[16] = true;
					  if(item.id == 14)ignorClothes[17] = true;
					  // bag
					  if(item.id == 63){
						  ignorClothes[5] = true;
					  }
				  }
				  if(item.isLies)this.liesItem(item, true)
			  }
		  }
		  this.clearClothes(ignorClothes);
	  }catch(e){
		  console.error(e)
	  }
	}
	refetchKeysVeh(){
		let vehicles = [];
		this.forEach(6, (item,index)=>{
			try{
				let veh = mp.vehicles.atMongoId(item.vehid);
				if(veh && vehicles.indexOf(veh.id) === -1){
					vehicles.push(veh.id);
				}
			}catch(err){
				console.log(err)
			}
		})
		this.entity.vehiclesKeys = vehicles;
		this.entity.setVariable('vehicles',JSON.stringify(vehicles));
	}
 	updateslot(id,item){
		if(item)this.items[id] = item;
		item = this.items[id];
		this.entity.call('INVENTORY::UPDATE_PLAYER_SLOT',[id,JSON.stringify(item)])
	}
	liesItem(item,toggle){
		let infoitem = infoitems[item.id];
		if(!infoitem.isLies || !this.isplayer)return;
		if(item.id == 58){
			if(toggle){
				this.entity.isBox = true;
				this.entity.playAnimation("anim@heists@box_carry@","idle",1,53)
				this.entity.addAttachment('boxWeapon')
			}else{
				this.entity.isBox = false;
				if(!this.entity.vehicle)this.entity.stopAnimation();
				this.entity.removeAttachment('boxWeapon')
			}
		}
	}
	refetchClothes(){
		let ignorClothes = [];
		for(let i in this.items){
			let item = this.items[i];
			if(item && (item.type == "clothes" || item.type == "bag")){
				this.itemActive(item);
				if(item.id == 2){
					ignorClothes[11] = true;
					ignorClothes[3] = true;
					if(item.first) ignorClothes[8] = true;
				}
				if(item.id == 3)ignorClothes[4] = true;
				if(item.id == 4)ignorClothes[6] = true;
				if(item.id == 5)ignorClothes[3] = true;
				if(item.id == 11)ignorClothes[1] = true;
				if(item.id == 12)ignorClothes[7] = true;
				// props
				if(item.id == 8)ignorClothes[13] = true;
				if(item.id == 9)ignorClothes[14] = true;
				if(item.id == 10)ignorClothes[15] = true;
				if(item.id == 13)ignorClothes[16] = true;
				if(item.id == 14)ignorClothes[17] = true;
				// bag
				if(item.id == 63)ignorClothes[5] = true;
			}
		}
		this.clearClothes(ignorClothes);
	}
	clearClothes(ignorClothes = []){
		let player = this.entity;
		let clot = clothes.clearclothes[player.gender];
		for(let i=1;i<=11;i++){
			if(i != 2 && !ignorClothes[i])player.setClothes(i, clot[i], 0, 0);
		}
		if(!ignorClothes[13])player.setProp(0,-1, 0);
		if(!ignorClothes[14])player.setProp(1,-1, 0);
		if(!ignorClothes[15])player.setProp(2,-1, 0);
		if(!ignorClothes[16])player.setProp(6,-1, 0);
		if(!ignorClothes[17])player.setProp(7,-1, 0);
	}
	removeSlot(slot){
		try{
			let item = this.items[slot];
			let playerItem = item.type == "weapon" || slot.indexOf('hand') !== -1 ? slot : item.playerItem;
			this.updateslot(slot,JSON.parse(JSON.stringify(infoitems[0])));
			if(this.isEmptySlotPlayer(slot) || slot.indexOf('hand') != -1)this.saveItem(playerItem);
			if(item.isLies)this.liesItem(item,false)
		}catch(e){
			console.error(e)
		}
	}
	findGloveIdItem(id){
		if(!this.isEmptySlotPlayer('hand1') && this.items['hand1'].id == id)return 'hand1'
		if(!this.isEmptySlotPlayer('hand2') && this.items['hand2'].id == id)return 'hand2'
		return false
	}
	dropItem(id,pos){
		let item = typeof id == 'string'? this.items[id] : id;
		let drop = infoitems[item.id].drop;
		if(drop === undefined) return;
		drop = typeof drop == "string" ? mp.joaat(drop) : drop;
	 	let obje = mp.objects.new(drop, pos,{
			dimension: this.entity.dimension
		});
	 	obje.item = item;
		this.removeSlot(id)
		this.itemActive(obje.item)
		if(obje.item.isLies)this.liesItem(obje.item, false)
	 	obje.setVariable('isitem',true);
	}
	liesItem(item,toggle){
		let infoitem = infoitems[item.id];
		if(!infoitem.isLies)return;
		if(item.id == 58){
			if(toggle){
				this.entity.isBox = true;
				this.entity.playAnimation("anim@heists@box_carry@","idle",1,53)
				this.entity.addAttachment('boxWeapon')
			}else{
				this.entity.isBox = false;
				if(!this.entity.vehicle)this.entity.stopAnimation();
				this.entity.removeAttachment('boxWeapon')
			}
		}
	}
	updateAmmoWeapons(hash,ammo){
		for(let i in this.items){
			if(this.items[i] && this.items[i].type === 'weapon' && this.items[i].weapon_hash == hash){
				let item = infoitems[this.items[i].id];
				ammo = parseInt(this.items[i].id == 7 ?  ammo/45 : ammo);
				this.items[i].ammo = ammo;
				this.updateslot(i);
				this.saveItems();
			}
		}
	}
	findItem(id){
		if(this.items[infoitems[id].playerItem]){
			return this.items[infoitems[id].playerItem];
		}else{
			return false;
		}
	}
	isWeapon(item){
		for(let i = 0 ;i< weaponSlots.length;i++){
			let weaponSlot = weaponSlots[i];
			if(typeof this.items[weaponSlot] == 'object' && this.items[weaponSlot].id == item.id && item == this.items[weaponSlot]) return true;
		}
		return false;
	}
	findItemsId(id){
		let items = [];
		if(!this.isEmptySlotPlayer(infoitems[id].playerItem))items.push(this.items.card);
		for(let i in this.items){
			let itemInventory = this.items[i];
			let infoitemInventory = infoitems[itemInventory.id];
			if(infoitemInventory.inventory == true){
				let inventory = this[infoitemInventory.playerItem];
				let itemsInventory = inventory.findItems(id);
				if(itemsInventory != null)items.push(...itemsInventory);
			}
		}
		return items;
	}
	getItemWeapon(weaponName){
		let weaponHash = typeof weaponName == 'number' ? weaponName : mp.joaat(weaponName);
		return infoitems.find((item)=>{
			try{
				if(item.type == "weapon" && item.weapon_hash == weaponHash)return true
			}catch(e){console.error(e)}
		})
	}
	forEach(id,callback){
		if(infoitems[id].playerItem && !this.isEmptySlotPlayer(infoitems[id].playerItem))callback(this.items[infoitems[id].playerItem],infoitems[id].playerItem,this);
		for(let i in this.items){
			if(i != "undefined"){
				let itemInventory = this.items[i];
				let infoitemInventory = infoitems[itemInventory.id];
				if(infoitemInventory.inventory == true && !this.isEmptySlotPlayer(i)){
					let inventory = this[infoitemInventory.playerItem];
					if(inventory && inventory.forEach)inventory.forEach(id,callback)
				}
			}
		}
	}
	hasAllNotEmptyGlove(){
		return !this.isEmptySlotPlayer('hand1') || !this.isEmptySlotPlayer('hand2');
	}
}
let cloneArrayJSON = (obj,size)=>{
	return JSON.parse('['+(Array(size).fill(JSON.stringify(obj)).join(','))+']');
} 

function dropWeapons(player){
	for(let i = 0 ;i< weaponSlots.length;i++){
		let weaponSlot = weaponSlots[i];
		if(typeof player.inventory.items[weaponSlot] == 'object' && player.inventory.items[weaponSlot].id){
			player.inventory.dropItem(weaponSlot,player.position)
		}
	}
}

module.exports.playerInventory = playerInventory;
module.exports.cloneArrayJSON = cloneArrayJSON;
module.exports.dropWeapons = dropWeapons;