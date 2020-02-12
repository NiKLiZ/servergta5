let model_vehicle = require('../mongodb/vehicle').vehicle;
let vehicleColorID = [
	[0,147,1,11,2,3,4,5,6,7,8,9,10,27,28,29,150,30,31,32,33,34,143,35,135,137,136,36,38,138,99,90,88,89,91,49,50,51,52,53,54,92,141,61,62,63,64,65,66,67,68,69,73,70,74,96,101,95,94,97,103,104,98,100,102,99,105,106,71,72,142,145,107,111,112], 
	[12,13,14,131,83,82,84,149,148,39,40,41,42,55,128,151,155,152,153], 
	[15,16,17,18,19,20,43,44,45,56,57,75,76,77,78,79,80,81,108,109,110,122],
	[117,118,119,158,159],
	[0,120]
];
let menu_customs = require('./tunningInfo').infoTuning;
let neonColor = require('./tunningInfo').neonColor;
mp.calbackmenuv('TUNING::BUY',(player,array)=>{
	if(!player.vehicle) return;
	array = array[0].split(',');
	let modType =  isNaN(parseInt(array[0])) ? array[0] : parseInt(array[0]);
	let modIndex = parseInt(array[1]);
	let veh = player.vehicle;
	let saveMods = {['mods.'+modType]:modIndex};
	let tuning = menu_customs[parseInt(array[2])];
	let price = modIndex == 0 ? 0 : tuning.startPrice+(tuning.nextPrice*modIndex);
	if(modType == 62 ){
		if(veh.numberPlateType == modIndex)return player.alert('Эта деталь у вас уже установлена')
		if(!player.editMoney(-price,'Тюнинг '))return;
		veh.numberPlateType = modIndex;
		saveMods = {'numberPlateType': modIndex}
	}
	else if(modType == 46 ){
		if(veh.windowTint == modIndex)return player.alert('Эта деталь у вас уже установлена')
		if(!player.editMoney(-price,'Тюнинг '))return;
		veh.windowTint = modIndex;
		saveMods = {'windowTint': modIndex}
	}
	else if(modType == 'neon' ){
		let curentNeon = veh.getNeonColor();
		if(modIndex == -1 && !veh.neon || modIndex != -1 && curentNeon == neonColor[modIndex].color)return player.alert('Эта деталь у вас уже установлена')
		if(!player.editMoney(-price,'Тюнинг'))return;
		if(modIndex == -1){
			veh.neonEnabled = false;
			saveMods = {'neon': null}
		}
		else{
			let neon = neonColor[modIndex].color;
			veh.neonEnabled = true;
			veh.setNeonColor(...neon);
			saveMods = {'neon': neon}
		} 
	}
	else if(modType == 'headlightColor'){
		if(veh.data.headlightColor == modIndex)return player.alert('Эта деталь у вас уже установлена')
		price = modIndex == -1 ? 0 : tuning.startPrice+(tuning.nextPrice*(modIndex+1));
		if(!player.editMoney(-price,'Тюнинг '))return;
		veh.data.headlightColor = modIndex;
		saveMods = {'headlightColor': modIndex}
	}
	else if(modType == 'extra'){
		if(veh.data.extra == modIndex)return player.alert('Эта деталь у вас уже установлена')
		if(!player.editMoney(-price,'Тюнинг '))return;
		veh.data.extra = modIndex;
		saveMods = {'extra': modIndex}
	}
	else if(modType == 'extraWheel'){
		if(veh.data.extraWheel == modIndex)return player.alert('Эта деталь у вас уже установлена')
		if(!player.editMoney(-price,'Тюнинг '))return;
		veh.data.extraWheel = modIndex;
		saveMods = {'extraWheel': modIndex}
	}else{
		price = modIndex == -1 ? 0 : tuning.startPrice+(tuning.nextPrice*(modIndex+1));
		if(player.vehicle.tuning[modType] == modIndex)return player.alert('Эта деталь у вас уже установлена')
		if(!player.editMoney(-price,'Тюнинг '))return;
		player.vehicle.setTune(modType,modIndex); //исправить на setMod в 0.4
		
	}
	if(player.vehicle.mongodb.mods.length){
		model_vehicle.updateOne({_id:veh._id},{$set: saveMods},(err,done)=>{
			if(err){
				console.error(err)
				player.alert('Произошла ошибка')
			}
		})
	}else{
		let mods = [];
		for(let i=0;i<=69;i++){
			mods.push(veh.getMod(i));
			model_vehicle.updateOne({_id:veh._id},{$set: {mods:mods}},(err,done)=>{
				if(err){
					console.error(err)
					player.alert('Произошла ошибка')
				}
			})
		}
	}
	player.call('TUNING::BUY_SUCCESS',[modType,modIndex])
	if(price != 0)player.alert(`Вы купили тюнинг за ${price}`)
	else player.alert('Вы сняли тюнинг')

})
mp.model = model_vehicle;
mp.events.add({
	'TUNING:OPEN':(player)=>{
		if(!player.vehicle) return;
		if(!player.vehicle.getVariable('gosFraction') && !player.vehicle._id) return player.alert('Эту машину нельзя тюнить')
		player.call('TUNING:OPEN')

	},
	'TUNING:EXIT':(player)=>{
		// player.vehicle.toggleengen(true)
	}
})
mp.calbackmenuv('TUNING::COLOR_PRIMARY_BUY',(player,array)=>{
	if(!player.vehicle) return;
	array = array[0].split(',');
	let modIndex = parseInt(array[1]);
	let tuning = menu_customs[parseInt(array[2])];
	let price = modIndex == 0 ? 0 : 70;
	if(!player.editMoney(-price,'Цвет машины'))return;
	let veh = player.vehicle;
	let color = vehicleColorID[parseInt(array[0])][parseInt(array[1])]
	model_vehicle.updateOne({_id:veh._id},{$set: {primary:color}},(err,done)=>{
		if(err){
			console.error(err)
			player.alert('Произошла ошибка')
		}
	})
	veh.setColor(color,veh.getColor(1));
	player.alert('Вы покрасили автомобиль')
	player.call('TUNING::COLOR_PRIMARY_CHANGE',[color])
})

mp.calbackmenuv('TUNING::COLOR_SECONDARY_BUY',(player,array)=>{
	if(!player.vehicle) return;
	let modIndex = parseInt(array[1]);
	let tuning = menu_customs[parseInt(array[2])];
	let price = modIndex == 0 ? 0 : 70;
	if(!player.editMoney(-price,'Цвет автомобиля'))return;
	array = array[0].split(',');
	let veh = player.vehicle
	let color = vehicleColorID[parseInt(array[0])][parseInt(array[1])]
	model_vehicle.updateOne({_id:veh._id},{$set: {secondary:color}},(err,done)=>{
			if(err){
				console.error(err)
				player.alert('Произошла ошибка')
			}
		})
	player.alert('Вы покрасили машину')
	veh.setColor(veh.getColor(0),color);
	player.call('TUNING::COLOR_SECONDARY_CHANGE',[color])
})
mp.calbackmenuv('TUNING::REPAIR',(player,array)=>{
	if(!player.vehicle) return;
	// if(player.vehicle.bodyHealth == 1000) return player.alert('Машину не нужно чинить')
	let price = parseInt((1000 - player.vehicle.bodyHealth )/ 50  * 8) || 15;
	if(!player.vehicle.getVariable('gosFraction') && !player.editMoney(-price,'Починка автомобиля'))player.alert(`Цена починки ${price}$`); 
	if(player.vehicle.getVariable('gosFraction'))player.alert('Вы отремонтировали машину за счет гос. организации')
	player.alert(`Вы починили автомобиль за ${price}$`)
	player.vehicle.repair();
})