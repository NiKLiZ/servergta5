mp.events.add({
    "CARSHOWROOM::MENAGER_MENU":(player)=>{
        let vehicles = [];
        player.vehicles.forEach((veh,i)=>{
            if(veh.evacuated)return;
            vehicles.push({
                model: veh.model,
                id: i,
                price: veh.mongodb.price ? parseInt(veh.mongodb.price*0.5) : 50,
                numberPlate: veh.numberPlate
            })
        })
        player.call("CARSHOWROOM::MENAGER_MENU",[JSON.stringify(vehicles)])
    }
})
mp.calbackmenuv('CARSHOWROOM::MENAGER_BUY_KEY',(player,array,json)=>{
    if(!player.inventory.isEmptySlot(6))return player.alert('Нет свободного места в инвентаре');
    let veh = player.vehicles[parseInt(array[0])]
    if(!player.editMoney(-20,'Ключи от машины')) return;
	let info = {
		vehid: veh._id,
        model: veh.model,
        numberPlate: veh.numberPlate
	}
	player.alert('Вы купили ключ',2)
	player.inventory.addItem(6,null,info,true);
});
mp.calbackmenuv('CARSHOWROOM::MENAGER_SELF_VEH',(player,array,json)=>{
    let veh = player.vehicles[parseInt(array[0])]
    let price = veh.mongodb.price ? parseInt(veh.mongodb.price*0.5) : 50;
    player.mongoUser.vehicles.pull(veh._id);
    player.inventory.forEach(6,(item,i,inventory)=>{
        if(item.vehid && item.vehid.toString() === veh._id.toString()){
            inventory.removeSlot(i);
        }
    })
    if(player.editMoney(price,'Продажа автомобиля'));
    player.vehicles.splice(player.vehicles.indexOf(veh),1)
    if(!player.mongoUser.$__.saving)player.mongoUser.save().catch((err)=>{console.error(err)})
    player.alert('Вы продали автомобиль',2);
    player.updateVehiclesMenu();
    veh.mongodb.remove().catch((err)=>console.error(err));
    veh.destroy();
});