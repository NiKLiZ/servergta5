let parking = require('../parking/class.js');
let vehs = mp.configs.farm.vehs;
let max_warehouse = 100;
let produce = mp.configs.farm.produce;
for(let i=0;i<produce.length;i++){
	produce[i].id = i;
	create_product(i);
}
//спавн тракторов
let park = new parking(vehs,{
	farm: true,
});
//спавн грузовиков для разгрузки
let mules = new parking(mp.configs.farm.mules,{
	farm: true,
});
//магазины для разгрузки
const vegetables = [new mp.Vector3(-118.17411041259766,6214.0546875,30.199663162231445)]

let label_pos_warehouse = new mp.Vector3(2001.7203369140625,4976.7109375,41.63191604614258);

let warehouse_label = mp.labels.new('Склад: '+mp.world.farm.warehouse, label_pos_warehouse,{
		los: true,
		drawDistance: 10,
})
//Сохранение трактор
mp.events.addCommand('savefarm_tractor', (player, _, vehName) => {
	if(!player.permision['FRAM::SAVE_TRACTOR']) return player.alert(`У вас нет прав`,1);
	let veh = {
		"model": "tractor2",
		"pos": player.vehicle.position,
		"heading": player.vehicle.rotation.z,
		"color": [[20, 150, 0],[20, 150, 0]]
	}
	mp.configs.farm.vehs.push(veh);
	mp.configs.farm.save();
})
//Сохранение грузовиков для разгрузки
mp.events.addCommand('save_farm_mule', (player, _, vehName) => {
	if(!player.permision['FRAM::SAVE_MULE']) return player.alert(`У вас нет прав`,1);
	let veh = {
		"model": "mule",
		"pos": player.vehicle.position,
		"heading": player.vehicle.rotation.z,
		"color": [[0, 0, 0],[0, 0, 0]]
	}
	mp.configs.farm.mules.push(veh);
	mp.configs.farm.save();
})

mp.events.add({
	"FARM::SPROUTS_ANIM_STOP":(player,index)=>{
		player.stopAnimation();
		player.animJob = false;
		player.sproutsAnim = false;
		let prod = produce[index];
		if(prod.isgrow){
			prod.dataUpGrow = new Date().getTime();
			prod.object.destroy();
			prod.isgrow = false;
		}else return player.alert('Овощ ещё не вырос')
		player.SPROUTS++;
		player.mongoUser.jobs.farm.exp++; 
		if(!player.mongoUser.$__.saving)player.mongoUser.save().catch(()=>{
			console.error('ERRROR : world farme model ' +err.toString())
		});;
		player.alert('Отнесите овощи в амбар')
		player.setNewWaypoint(label_pos_warehouse)
	},
	"FARM::SPROUTS_ANIM":(player,index,id_mar)=>{
		if(player.sproutsAnim)return;
		if(player.SPROUTS > 4)return player.alert('В сумке не хватает места, отнесите овощи в амбар')
		let prod = produce[index];
		if(prod.isgrow){
			player.call('FARM::SPROUTS_SBOR_ANIM',[id_mar])
			player.playScenario("WORLD_HUMAN_GARDENER_PLANT")
			player.animJob = true;
			player.sproutsAnim = true;
		}else return player.alert('Овощ ещё не вырос')
	},
	"FARM::SPROUTS_ANBAR":(player)=>{
		if(player.SPROUTS === 0){
			player.alert('Вы ничего не собрали')
			return;
		}
		updeteLabel(player.SPROUTS)
		update_warehouse(player.SPROUTS);
		player.editmoneyCash(player.SPROUTS*2,'Сбор урожая')
		player.call('FARM::CLEAR_SPOROUT')
		player.SPROUTS = 0;
	},
	"FARM::STOP":(player)=>{
		player.farm = false;
		player.farmJob = null;
		player.call("FARM::SET_JOB",[null])
		player.call("FARM::STOP")
		player.SPROUTS = null;
		player.warehouse_prize = null;
		player.cargo = null;
		player.sproutsAnim = false;
	},
	"FARM::TRACTOR_FINISH":(player)=>{
		if(player.farm != true) return player.alert('Вы не работаете трактористом')
		player.mongoUser.jobs.farm.exp += 30; 
		player.editmoneyCash(30,'Тракторист');
		updeteLabel(50)
		update_warehouse(50);
		if(!player.mongoUser.$__.saving)player.mongoUser.save().catch((err)=>{
			console.error('ERRROR : world farme model ' ,err)
		});;
		let menu = {
			name: 'Тракторист',
			items: [
				{
					type: 1,
					name: 'Продолжить путь',
					callback: 'FARM::TRACTOR_RELOAD',
					placeholder: 'Нажми Enter для продолжения работы'
				},
				{
					type: 1,
					name: 'Закончить работу',
					callback: 'FARM::TRACTOR_RETURN_BACK',
					placeholder: 'Закончить работу'
				}
			]
		};
		player.createmenuv(menu);
	},
	"FARM::CARRIER_GET_SPROUTS":(player)=>{
		if(mp.world.farm.warehouse == 0) return player.alert('Сейчас нет семян')
		player.call('FARM::CARRIER_ZAGRUZ')
	},
	"FARM::CARRIER_GET_SHOP": (player)=>{
		if(mp.world.farm.warehouse == 0) return player.alert('Сейчас нет семян')
		let rand = mp.getRandomInRange(0,vegetables.length-1);
		let pos = vegetables[rand];
		player.call('FARM::CARRIER_MAGEZ',[JSON.stringify(pos)])
		player.alert('Теперь отправляйтесь к магазину')
		let cargo = ( mp.world.farm.warehouse > max_warehouse) ? max_warehouse :  mp.world.farm.warehouse;
		updeteLabel(-cargo)
		player.cargo = cargo;
		// Расчёт экономики для множество магазинов
		// player.warehouse_prize = parseInt(player.dist(vegetables[rand])/30)+1.5;
		player.warehouse_prize = 70;
		player.cargo = cargo;
	},
	"FARM::CARRIER_RESTART":(player)=>{
		player.call("FARM::CARRIER_RESTART")
	},
	"FARM::CARRIER_SHOP_CHECK":(player)=>{
		player.editmoneyCash(player.warehouse_prize,'Перевозка продуктов');
		player.alert('Вам заплатили '+player.warehouse_prize)
		player.warehouse_prize = 0;
		update_warehouse(-player.cargo);
		let menu = {
			name: 'Перевозчик',
			items: [
				{
					type: 1,
					name: 'Продолжить путь',
					callback_remote: 'FARM::CARRIER_RESTART',
					placeholder: 'Нажми Enter для продолжения работы'
				},
				{
					type: 1,
					name: 'Закончить работу',
					callback: 'FARM::CARRIER_RETURN_BACK',
					placeholder: 'Закончить работу'
				}
			]
		};
		player.createmenuv(menu);
	},
	"FARM::END_JOBS": (player)=>{
		if(player.farmJob == 0){
			if(player.SPROUTS !== 0 )return player.alert('Отнесите овощи в амбар (помечено точкой)')
			player.inventory.refetchClothes();
			player.call('FARM::DEL_CHECK')
		} 
		if(player.farmJob == 1)player.call('FARM::STOP')
		if(player.farmJob == 2) mp.events.call('FARM::CARRIER_CLOSE',player)
		player.alert('Вы закончили рабочий день')
		mp.events.call('FARM::STOP',player);
		player.clearParking(true)
	},
	"FARM::CARRIER_CLOSE":(player)=>{
		mp.events.call('FARM::STOP',player);
		player.clearParking(true)
	}
})

mp.calbackmenuv('FARM::TRACTOR_RELOAD',(player,array)=>{
	player.call('FARM::TRACTOR_RELOAD')
})
mp.calbackmenuv('FARM::START',(player,array)=>{
	if(!player.isWorkUp()) return;
	if(player.farm == true) return player.alert('Вы уже начали работу на ферме')
	let job = parseInt(array[0]);
	
	if(job === 0){
		player.SPROUTS = 0;
		player.farm = true;
		player.farmJob = job;
		player.call("FARM::SET_JOB",[job])
		player.alert('На метке указано место где растут овощи. Подходите к ним и собирайте')
		player.setNewWaypoint({x:2068.249267578125,y:4915.64697265625});
		let sprouts_mar = [];
		for(let i=0;i<produce.length;i++){
			if(produce[i].dataUpGrow && new Date().getTime() - produce[i].dataUpGrow > 120000){
				produce[i].isgrow = true;
				produce[i].dataUpGrow = null;
				create_product(i);
			} 
			sprouts_mar.push(produce[i].isgrow);
		}
		//одежда
		if(player.gender == 0){
			player.setClothes(11,26,0,0)
			player.setClothes(3,11,0,0)
			player.setClothes(4,36,0,0)
			player.setClothes(6,50,0,0)
			player.setClothes(8,15,0,0);
			player.setClothes(5,40,0,0)
			player.setProp(0,13,0);
		}else{
			player.setClothes(11,119,0,0)
			player.setClothes(3,0,0,0)
			player.setClothes(4,35,0,0)
			player.setClothes(6,50,0,0)
			player.setClothes(8,15,0,0)
			player.setClothes(5,40,0,0)
			player.setProp(0,20,0);
		}
		if(sprouts_mar.length !== 0) player.call('FARM::SPROUTS_START',[JSON.stringify(sprouts_mar)]);
		else player.alert('Овощи ещё не выросли')
	}else if(job === 1){
		if(!player.testRightDrive())return ;
		if(player.mongoUser.jobs.farm.exp < 100) return player.alert(`у вас ${player.mongoUser.jobs.farm.exp}/100 опыта`)
		if(player.farm == true) return player.alert('Вы уже начали работу на ферме')
		let veh = park.targetVeh(player);
		if(veh){
			player.farm = true;
			player.farmJob = job;
			player.call("FARM::SET_JOB",[job])
			player.alert('Сядьте в трактор');
			player.call('FARM::TRACTOR_START')
		}	
		else player.alert('Все тракторы заняты ')
	}else if(job === 2){
		if(!player.testRightDrive())return ;
		if(player.mongoUser.jobs.farm.exp < 200) return player.alert(`у вас ${player.mongoUser.jobs.farm.exp}/200 опыта`)
		let veh = mules.targetVeh(player);
		if(veh){
			player.farm = true;
			player.farmJob = job;
			player.call("FARM::SET_JOB",[job])
			player.alert('Сядьте в машину');
			player.call('FARM::CARRIER_START')
		}	
		else player.alert('Все машины заняты ')
	}
})
function updeteLabel(edit) {
	mp.world.farm.warehouse += edit;
	warehouse_label.text  =  'Склад: '+mp.world.farm.warehouse;
}
function update_warehouse(edit) {
	mp.world.model.farm.warehouse += edit;
	if(!mp.world.model.$__.saving)mp.world.model.save().catch(()=>{
		console.error('ERRROR : world farme model ' +err.toString())
	});
}
function create_product(product) {
	produce[product].object = mp.objects.new(mp.joaat(produce[product].model), produce[product].pos);
}
setInterval(()=>{
	for(let i=0;i<produce.length;i++){
		if(produce[i].dataUpGrow && new Date().getTime() - produce[i].dataUpGrow > 120000){
			produce[i].isgrow = true;
			produce[i].dataUpGrow = null;
			create_product(i);
		}
	}
},60*30*1000)