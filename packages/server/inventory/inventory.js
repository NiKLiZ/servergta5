let infoitems = require('./itemsinfo');
mp.events.add({
  'ShowItemsInventory': (player,inventoryId) => {
    let inventory = getInventoryByName(player,inventoryId);
    inventory.showitems(player);
  },
  'moveSlot': (player,dragslot,dragoutslot,main,right) => {
    if(player.deat == true)return player.alert('Инвентарь недоступен');
    let dr = dragslot;
    let drout = dragoutslot;
    if(dragoutslot>=30||dragslot>=30){
      if(dragoutslot>=30) dragoutslot= dragoutslot-30;
      if(dragslot>=30) dragslot= dragslot-30;
      if(right.indexOf('vehicle_trunk') >= 0){
        let veh = mp.vehicles.at(parseInt(right));
        if(!veh)return;
        if(!(dr>=30&&drout>=30)) player.inventory.moveslot(dragslot,veh.trunk,dragoutslot,right);
        else{
          veh.trunk.moveslot(dragoutslot ,veh.trunk,dragslot,right,true);
        }
      }
      if(right.indexOf('vehicle_glovebox') >= 0){
        let veh = mp.vehicles.at(parseInt(right));
        if(!veh)return;
        if(!(dr>=30&&drout>=30)) player.inventory.moveslot(dragslot,veh.glovebox,dragoutslot,right);
        else{
          veh.glovebox.moveslot(dragoutslot ,veh.glovebox,dragslot,right,true);
        }
      }
    }
    else{
      player.inventory.moveslot(dragslot,player.inventory,dragoutslot);
    }
  },
  'activateItem': (player,id) => {
    if(player.deat == true)return player.alert('Инвентарь недоступен');
    player.inventory.toggleItem(id);
  },
  'INVENTORY::DROP_ITEM': (player,slot,inventory) => {
    let cuff = !!player.getVariable('LSPD::CUFF');
    if(cuff)return player.alert('Вы не можете использовать инвентарь в наручниках')
    if(player.deat == true)return player.alert('Инвентарь недоступен');
    if(player.vehicle) return player.alert('Нельзя выкинуть предмет сидя в машине')
    let pos = player.position;
    pos.z -= 1;
    if(inventory != "player"){
      player.inventory[inventory].dropItem(slot,pos);
    }
    else{
      player.inventory.dropItem(slot,pos)
    }
  },
  'INVENTORY::TAKE_ITEM': (player,id) => {
    let cuff = !!player.getVariable('LSPD::CUFF');
    if(cuff)return player.alert('Вы не можете использовать инвентарь в наручниках')
    if(player.deat == true)return player.alert('Инвентарь недоступен');
    let obj = mp.objects.at(id);
    if(!obj)return player.alert('Предмет не найден')
    if(obj.item != undefined){
      if(obj.item.allHandSlot == true && player.inventory.hasAllNotEmptyGlove())return player.alert('Коробка не помещается в руки')
      if(!player.inventory.isEmptySlot(obj.item && !obj.item.allHandSlot))return player.alert('Нет свободного места в инвентаре');
      if(obj.item.allHandSlot == true && player.isBox)return player.alert('Вы уже несёте коробку')
      let isAdd = player.inventory.addItemData(obj.item)
      if(isAdd) obj.destroy();
      else player.alert('В инвентаре нет места');
      player.inventory.saveItem(obj.item.playerItem);
    } 
  },
  'updateAmmoWeapons': (player,weapon,ammo) => {
    player.inventory.updateAmmoWeapons(weapon,ammo);
  },
  'INVENTORY::USE_ITEM': (player,id,inventoryIteractive) => {
    let cuff = !!player.getVariable('LSPD::CUFF');
    if(cuff)return player.alert('Вы не можете использовать инвентарь в наручниках')
    let inventory =   inventoryIteractive == "player" ? player.inventory : player.inventory[inventoryIteractive];
    let item = inventory.items[id];
    let infoitem = infoitems[item.id];
    if(item.type == 'drink'){
      let thirst = player.mongoUser.thirst+infoitem.thirst > 100 ? 100 - player.mongoUser.thirst : infoitem.thirst;
      player.mongoUser.thirst += thirst;
      player.call('INVENTORY::UPDATE_HUNGER', [player.mongoUser.satiety, player.mongoUser.thirst])
      player.alert('Вы выпили '+item.name)
      inventory.removeSlot(id); 
      if(!player.mongoUser.$__.saving)player.mongoUser.save().catch(err=>{console.error(err)})
    }
    if(item.type == 'food'){
      let satiety = player.mongoUser.satiety+infoitem.satiety > 100 ? 100 - player.mongoUser.satiety : infoitem.satiety;
      player.mongoUser.satiety += satiety;
      player.call('INVENTORY::UPDATE_HUNGER', [player.mongoUser.satiety, player.mongoUser.thirst])
      player.alert('Вы съели '+item.name)
      inventory.removeSlot(id); 
      if(!player.mongoUser.$__.saving)player.mongoUser.save().catch(err=>{console.error(err)})
    }
    if(item.id == 58){
      if(item.weapon){
        let weapon = player.inventory.getItemWeapon(item.weapon);
        if(!weapon)return player.alert('Оружие не найдено',1)
        player.inventory.removeSlot(id); 
        player.inventory.addItemData(weapon)
      }
      if(item.ammo){
        inventory.removeSlot(id); 
        player.inventory.addItem(19,3)
      }
    }
    if(item.id == 61){
      if(item.count  < 0.2)return player.alert('Для того чтобы скрутить косяк нужно 2гр.')
      if(item.count > 0.2){
        item.count = +(item.count - 0.2).toFixed(1);
        inventory.updateslot(id);
      }else player.inventory.removeSlot(id); 
      player.inventory.addItem(62,1);
    }
    if(item.id == 62){
      if(player.smoking)return player.alert('Вы сейчас курите');
      if(item.count > 1){
        item.count -= 1;
        inventory.updateslot(id);
      }else inventory.removeSlot(id);
      player.smoking = true; 
      player.playScenario("WORLD_HUMAN_SMOKING");
      player.call("GANG::START_SMOKE")
    }
    if(inventoryIteractive != "player" && !item.isUse && item.playerItem){
      mp.events.call("INVENTORY::DRAG_SLOT",player,inventoryIteractive,id,"player",item.playerItem)
    }
    inventory.saveItems();
  },
  "INVENTORY::RCHARGE_ITEM":(player,id,inventory,rchargeId)=>{
    let cuff = !!player.getVariable('LSPD::CUFF');
    if(cuff)return player.alert('Вы не можете использовать инвентарь в наручниках')
    let inventoryClass = player.inventory[inventory];
    let itemAmmo = inventoryClass.items[id];
    let itemWeapon = player.inventory.items[rchargeId];
    if(itemAmmo.id == 19){
      if(itemAmmo.count > 1){
        itemAmmo.count -= 1;
        inventoryClass.updateslot(id);
      }else inventoryClass.removeSlot(id); 
      player.inventory.items[rchargeId].ammo += 60; 
      player.inventory.updateslot(rchargeId);
      player.inventory.saveItem(rchargeId);
      player.setWeaponAmmo(itemWeapon.weapon_hash,itemWeapon.ammo);
      player.call("HUD::UPDATE_CARTRIDGES")
    }
  },
  "INVENTORY::DRAG_SLOT":(player,inventoryDrag,dragSlot,inventoryOut,dragoOutSlot)=>{
    let cuff = !!player.getVariable('LSPD::CUFF');
    if(cuff)return player.alert('Вы не можете использовать инвентарь в наручниках')
    if(dragSlot === -1 || dragoOutSlot === -1)return;
    if(inventoryDrag == "player" && inventoryOut != "player"){
      let itemDrag = player.inventory.items[dragSlot];
      let inventory = getInventoryByName(player,inventoryOut); 
      if(inventory.item && (infoitems[inventory.item.id].hasNotInventoryInside && inventory.item.id != 63 && (itemDrag.width > 1 || itemDrag.height > 1)))return player.alert("Невозможно переместить этот предмет в одежду")
      if(inventory.item && (inventory.item.id == itemDrag.id  || (inventory.item.id != 63 && itemDrag.inventory && infoitems[inventory.item.id].hasNotInventoryInside)) )return player.alert('Нельзя положить этот предмет сюда')
      if(itemDrag == inventory.item && inventory.item)return player.alert('Нельзя положить предмет в свой же инвентарь')
      if(infoitems[itemDrag.id].hasClothes  && inventory.item)return player.alert('Нельзя положить этот предмет в инвентарь одежды')
      let hasEmptySLot = player.inventory.isEmptySlotPlayer(itemDrag.playerItem);
      if(!!inventory && !player.inventory.items[dragoOutSlot] || !player.inventory.items[dragoOutSlot].id ){
        inventory.addItemSlot(dragoOutSlot,itemDrag);
        player.inventory.removeSlot(dragSlot );
        // если предмет перемещён не из рук в инвентарь
        if(dragSlot.indexOf('hand') == -1){
          player.inventory.itemActive(itemDrag);
        }
      }
    }
    else if(inventoryOut == "player" && inventoryDrag != "player"){
      let inventory = getInventoryByName(player,inventoryDrag); 
      let itemDrag = inventory.items[dragSlot];
      if(dragoOutSlot.indexOf('hand') == -1 && !itemDrag.playerItem && itemDrag.type != "weapon")return player.alert('Этот предмет нельзя переместить в инвентарь игрока');
      let  playerItem = itemDrag.type == "weapon" || dragoOutSlot.indexOf('hand') !== -1  ? dragoOutSlot : itemDrag.playerItem  ;
      let itemDragOut = player.inventory.items[playerItem];
      if(dragoOutSlot.indexOf('hand') != -1 && itemDrag.allHandSlot && (!player.inventory.isEmptySlotPlayer('hand1') || !player.inventory.isEmptySlotPlayer('hand2')))return player.alert('Предмет не помещается в руки')
      if(dragoOutSlot.indexOf('hand') == -1 && itemDrag.type === "weapon" && !player.inventory.isEmptyWeapon(itemDrag))return player.alert('Это оружие вы уже несете')
      let hasEmptySLot = player.inventory.isEmptySlotPlayer(playerItem);
      if(itemDrag.type === "weapon"  && dragoOutSlot.indexOf('hand') == -1 && dragoOutSlot.indexOf('weapon') == -1)return player.alert('Нельзя положить оружие в этот слот');
      if(!!inventory){
        // если предмет перемещён в руки
        if(dragoOutSlot.indexOf('hand') != -1){
          player.inventory.updateslot(playerItem,itemDrag);
          inventory.removeSlot(dragSlot);
          player.inventory.saveItem(playerItem);
        }
        // Если пустой слот
        else if(hasEmptySLot){
          player.inventory.updateslot(playerItem,itemDrag);
          inventory.removeSlot(dragSlot);
          player.inventory.itemActive(itemDrag);
          player.inventory.saveItem(playerItem);
        }
        // если предметы одинаковы
        else if(itemDrag.id == itemDragOut.id){
          player.inventory.updateslot(playerItem,itemDrag);
          inventory.updateslot(dragSlot,itemDragOut)
          player.inventory.itemActive(itemDrag);
        }
      }
    }
    // Перетаскивание  в другой слот инвентаря игрока 
    else if(inventoryOut == "player" && inventoryDrag == "player"){
      let itemDrag = player.inventory.items[dragSlot];
      let itemDragOut = player.inventory.items[dragoOutSlot]
      if(!itemDragOut)itemDragOut = JSON.parse(JSON.stringify(infoitems[0]));
      let hasSlotsWeapons = dragSlot.indexOf('weapon') != -1 && dragoOutSlot.indexOf('weapon') != -1;
      let hasSlotsHands = dragSlot.indexOf('hand') != -1 && dragoOutSlot.indexOf('hand') != -1;
      if(hasSlotsWeapons || hasSlotsHands){
        player.inventory.updateslot(dragoOutSlot,itemDrag);
        player.inventory.updateslot(dragSlot,itemDragOut);
        player.inventory.saveItem(dragoOutSlot);
        player.inventory.saveItem(dragSlot);
      }
    }
    // Перетаскивание с инвентаря в инвентарь  
    else if(inventoryOut == inventoryDrag){
      let inventory = getInventoryByName(player,inventoryDrag);
      if(dragSlot == dragoOutSlot)return;
      let itemDrag = inventory.items[dragSlot];
      let dragoOutItem = inventory.items[dragoOutSlot];
      if(!dragoOutItem || !inventory.items[dragoOutSlot].id && (typeof inventory.items[dragoOutSlot].linkId == "undefined" || inventory.items[dragoOutSlot].linkId == dragSlot)){
        inventory.removeSlot(dragSlot,false);
        inventory.updateslot(dragoOutSlot,itemDrag);
        inventory.saveItems();
      }
    }
    // Перетаскивание между разными инвентарями кроме игрока 
    else{    
      let inventory = getInventoryByName(player,inventoryDrag); 
      let itemDrag = inventory.items[dragSlot];
      let inventoryDragOut = getInventoryByName(player,inventoryOut);
      if(inventoryDragOut.item && (infoitems[inventoryDragOut.item.id].hasNotInventoryInside && itemDrag.width > 1 || itemDrag.height > 1))return player.alert("Невозможно переместить этот предмет в одежду")
      if(inventoryDragOut.isplayer && (inventoryDragOut.item.id == itemDrag.id || (inventoryDragOut.item.id != 63 && itemDrag.inventory && infoitems[inventoryDragOut.item.id].hasNotInventoryInside)))return player.alert('Нельзя положить этот предмет сюда')
      if(infoitems[itemDrag.id].hasClothes  && inventoryDragOut.item)return player.alert('Нельзя положить это предмет в инвентарь одежды')
      if(!inventoryDragOut.items[dragoOutSlot] || !inventoryDragOut.items[dragoOutSlot].id && typeof inventoryDragOut.items[dragoOutSlot].linkId == "undefined"){
        inventory.removeSlot(dragSlot);
        inventoryDragOut.updateslot(dragoOutSlot,itemDrag);
        inventoryDragOut.saveItems();
      }
    }
  }
});

mp.events.addCommand({
  'additem': (player, _, id) => {
    if(!player.permision['INVENTORY::ADD_ITEM']) return player.alert(`У вас нет прав`,1);
    
    player.outputChatBox(''+player.inventory.addItem(parseInt(id)));
  },
})


function getInventoryByName(player,name){
  let inventory = player.inventory[name];
  if(name.indexOf('vehicle_trunk') != -1)inventory = mp.vehicles.at(parseInt(name)).trunk;
  if(name.indexOf('vehicle_glovebox') != -1)inventory = mp.vehicles.at(parseInt(name)).glovebox;
  return inventory;
}