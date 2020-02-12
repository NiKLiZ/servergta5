let infoitems = require('./itemsinfo.js');
const User = require('../mongodb/user.js').User;
const phoneModel = require('../mongodb/phone.js').phone;
const vehicle = require('../mongodb/vehicle.js').vehicle;
let clothes = require('../../configs/clothes.json');
let donClothes = require('../clothes/donClothes.js');

let inventory = class inventory{
	constructor(maxitems,items,entity,update) {
		if(items){
			this.items = items;
		}else{
			//Заполнить все яснйки пустым предметом
			this.items = Array(maxitems+1).fill(infoitems[0]);
		}
		if(entity){
			this.entity = entity;
			if(entity.type && entity.type == 'player'){
				this.isplayer = true;
			} 
		}
		if(update) this.update = update;
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
		if(item.isLies)this.liesItem(item, true);
		if(save)this.saveItems();
	}
	addItemData(item,data){
		if(data) item = Object.assign(item,data);
		let slot = this.findEmptySlot(item);
		if(slot === null) return false;
		this.addItemSlot(slot,item,item.count);
		return true;
	}
	removeSlot(id){
		let item = infoitems[this.items[id].id];
		if(item.isLies)this.liesItem(item, false)
		this.updateslot(id,infoitems[0]);
		this.saveItems();
	}
	updateslot(id,item,update){
		if(item) this.items[id] = item;
		else item = this.items[id];
		if(this.entity && this.isplayer===true&&!update){
			this.entity.call('updateslot',[id,JSON.stringify(item)])
		} 
		if(update){
			if(this.entity){
				this.items[id].isactive = false;
				mp.players.callInRange(this.entity.position,10,0,update+'move',[id+30,JSON.stringify(item)]);
			}
		}
	}
	saveItems(){
		if(this.entity&&this.isplayer===true){
			User.findOneAndUpdate({_id:this.entity._id}, { 'items':this.items}, function(err, doc){
				if(err)console.error(err)
			});	
		}
		if(this.entity&&this.entity.type==='vehicle' && this.entity._id){
			vehicle.findOneAndUpdate({'_id':this.entity._id}, { $set: {[this.update]: this.items}}, function(err, doc){
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
			if(this.items[dragslot].isLies)this.liesItem(this.items[dragslot], false)
			if(slot.isLies)this.liesItem(slot, true)
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
	showitems(player){
		let items = this.items.map(item=>{
			if(item && item.id!==0)return item;
			else return 0;
		})
		player.call('INVENTORY::UPDATE_RIGHT',[JSON.stringify(items)])
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
	itemActive(item){
		let infoitem = infoitems[item.id];
		let type = infoitem.type;
		if(type == "clothes"){
			if(this.entity.gender == item.gender) donClothes(this.entity,item);
		} 
		let finditem = this.findIdItem(item.id,true)
		let active = finditem === null ? false : true;
		if(type == "car-key"){
			let veh = mp.vehicles.atMongoId(item.vehid)
			if(veh){
				let vehicles = this.entity.getVariable('vehicles');
				vehicles = vehicles ? JSON.parse(vehicles) : [];
				if(item.isactive){
					vehicles.push(veh.id);
				}else{
					let idx = vehicles.indexOf(veh.id);
					if(idx != -1) vehicles.splice(idx,1);
				} 
				this.entity.setVariable('vehicles',JSON.stringify(vehicles));
			} 
		} 
		if(type == 'weapon'){
			if(active == true){
				let ammo = item.id == 7 ? item.ammo * 45 : item.ammo;
				this.entity.setWeaponAmmo(infoitem.weapon_hash,ammo);
			}else{
				if(item.id == 7){
					this.entity.setWeaponAmmo(infoitem.weapon_hash,0);
				}
				this.entity.removeWeapon(infoitem.weapon_hash);
			}
		}
		if(type == 'card'){
			if(active == true){
				let card = mp.cards[item.card_id.toString()]
				pl.call('HUD::UPDATE_BANK_MONEY',[card.money])
				this.entity.card = card;
			}else{
				tpl.call('HUD::UPDATE_BANK_MONEY',[null])
				this.entity.card = null;

			}
			this.entity.updateInfoMenu();
		}
		if(type == 'phone'){
			if(active == true){
				phoneModel.findOne({_id:item.phone}).then((phone)=>{
					if(!phone){
						this.entity.setVariable('phone',null)
						this.entity.phone = null;
						return this.entity.alert('Телефон не найден')
					}
					this.entity.setVariable('phone',JSON.stringify(phone._doc))
					this.entity.phone = phone;
				}).catch((err)=>{
					this.entity.alert('Произошла ошибка')
					console.error(err)
				})
			}else{
				if(this.entity.caller)mp.events.callSocket('PHONE::CALL_REJECT',this.entity.socket,this.entity);
				this.entity.setVariable('phone',null)
				this.entity.phone = null;
			}
		}
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
	findItems(id,isactive){
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
			if(res.length == 1)return res[0];
			else return res;
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
			let hasStack = (!!item && infoitems[item.id].isStack && this.items[i].id == item.id && this.items[i].count < item.maxStack );
			if(hasStack || this.items[i].id === 0 ){
				return i;
			}
		}
		return null;
	}
	isEmptySlot(item){
		return this.findEmptySlot(item) != null ? true : false; 
	}
	refetchItems(){
		let ignorClothes = [];
		for(let i=0;i<this.items.length;i++){
			let item = this.items[i]
			if(item.isActivate === true && item.isactive == true ){
				this.itemActive(item);
				if(item.type == "clothes"){
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
				}
			}
			if(item.isLies)this.liesItem(item, true)
		}
		this.clearClothes(ignorClothes);
	}
	refetchClothes(){
		let ignorClothes = [];
		for(let i=0;i<this.items.length;i++){
			let item = this.items[i];
			if(item.isActivate && item.isactive == true && item.type == "clothes"){
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
			}
		}
		this.clearClothes(ignorClothes);
	}
	clearClothes(ignorClothes = []){
		let player = this.entity;
		let clot = clothes.clearclothes[player.gender]
		for(let i=1;i<=11;i++){
			if(i != 2 && !ignorClothes[i])player.setClothes(i, clot[i], 0, 0);
		}
		player.setProp(0,-1, 0);
		player.setProp(1,-1, 0);
		player.setProp(2,-1, 0);
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
		if(obje.item.isLies)this.liesItem(obje.item, false)
		this.updateslot(id,infoitems[0]);
		this.saveItems()
	 	obje.setVariable('isitem',true);
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