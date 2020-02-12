let parking = require('../parking/class.js');
let createVehModel = require("../a/functions/vehicle/create").createVehModel;
let modelUser = require('../mongodb/user').User;
let vehicleModel = require('../mongodb/vehicle').vehicle;
let moment = require('moment');
let moneySalary = 50;
let vehicleParking = [{
	pos:new mp.Vector3(393.2631530761719,-1629.3453369140625,28.291940689086914),
	heading: 52
	},
	{
		pos:new mp.Vector3(395.59375,-1627.1881103515625,28.291940689086914),
		heading: 52
	},
	{
		pos:new mp.Vector3(397.3957824707031,-1624.6092529296875,28.291940689086914),
		heading: 52
	},
	{
		pos:new mp.Vector3(399.4222717285156,-1621.9774169921875,28.291940689086914),
		heading: 52
	},
	{
		pos:new mp.Vector3(401.6484069824219,-1619.8934326171875,28.291940689086914),
		heading: 52
	},
	{
		pos:new mp.Vector3(403.4270324707031,-1617.05517578125,28.291940689086914),
		heading: 52
	},
	{
		pos:new mp.Vector3(392.46221923828125,-1607.192626953125,28.291940689086914),
		heading: 233
	},
	{
		pos:new mp.Vector3(390.525390625,-1609.621826171875,28.291940689086914),
		heading: 233
	},
	{
		pos:new mp.Vector3(388.4042053222656,-1612.027099609375,28.291940689086914),
		heading: 233
	},]

let towntruckOne = new parking(mp.configs.evacuator.vehiclesOne,{
    evacuator: true,
})

let towntruckTwo = new parking(mp.configs.evacuator.vehiclesTwo,{
    evacuator: true,
})
mp.events.add({
	"trailerAttached": (vehicle, trailer) => {
		if(!trailer || !trailer.evacuated)return;
		let player = vehicle.getPlayers(-1);
		if(trailer.evacuated == player){
			player.alert('Отвезите машину на парковку');
			player.call("EVACUATOR::CREATE_MARKER_VEH")
			vehicle.TowTruck = trailer;
		}else{
			vehicle.detachTowTruck();
			player.alert('Вы не можете цеплять эту машину')
		}
   },
   "EVACUATOR::START":(player)=>{
		if(!player.isWorkUp()) return;
		if(!player.testRightDrive())return ;
		let veh;
		if(player.mongoUser.jobs.evacuator.exp > 9 ){
			veh = towntruckOne.targetVeh(player);
		}else{
			veh = towntruckTwo.targetVeh(player);
		}
		if(veh){
			player.evacuator = 1;
			player.call('EVACUATOR::START')
		}
		else player.alert('Все машины заняты ')
   },
   "EVACUATOR::VEHICLE_EVACUATED":(player)=>{
		if(!player.vehicle)return;
		player.call("EVACUATOR::VEH",[null]);
		player.evacuatedVeh = null;
		let trailer = player.vehicle.TowTruck;
		trailer.mongodb.evacuated = true;
		if(!trailer.mongodb.$__.saving)trailer.mongodb.save().catch((e)=>{
			player.alert('Произошла ошибка')
			console.error(e);
		})
		player.mongoUser.jobs.evacuator.exp += 1;
		if(!player.mongoUser.$__.saving)player.mongoUser.save().catch((e)=>{
			player.alert('Произошла ошибка')
			console.error(e);
		})
		trailer.destroy();
		player.evacuated = undefined;
		player.alert('Вы эвакуировали машину. Вам заплатили '+moneySalary);
		player.editmoneyCash(moneySalary,'Работа эвакуаторщиком');

	},
	"EVACUATOR::MENU_PAYMENT_LOAD":(player)=>{
		let ret = [];
		player.vehicles.forEach((veh,i)=>{
			if(veh.evacuated == true){
				ret.push({
					id: i,
					model: veh.model.model,
					numberPlate: veh.model.numberPlate
				})
			}
		})
		player.call("EVACUATOR::MENU_PAYMENT",[JSON.stringify(ret)])
	},
	"EVACUATOR::FINISH_JOB":(player)=>{
		player.clearParking(true);
		player.call("EVACUATOR::STOP");
		player.evacuator = null;
	}
});
mp.calbackmenuv({
	"EVACUATOR::TASKS":(player)=>{
		player.alert('Загрузка данных')
		let lastDate = moment().subtract(5, 'days').valueOf();
		modelUser.find({lastJoin_date:{$lt:lastDate}}).populate('vehicles').then((users)=>{
			let tasks = [];
			users.forEach((user)=>{
				user.vehicles.forEach((vehModel)=>{
					if(vehModel.evacuated == true || vehModel.garage)return;
					let veh = mp.vehicles.atMongoId(vehModel._id);
					if(veh && veh.evacuated == true) return;
					tasks.push({
						id: vehModel._id,
						model: vehModel.model,
						pos: veh ? veh.position : vehModel.pos
					})
				})
			})
			if(!tasks.length)return player.alert('Вызовов нет')
			player.call("EVACUATOR::TASK_MENU",[JSON.stringify(tasks)]);
		}).catch((err)=>{
			console.error(err)
		})
	},
	"EVACUATOR::VEH_EVACUATE":(player,array)=>{
		if(player.evacuated){
			if(player.evacuated._id && !mp.vehicles.hasCreatedVehicle(player.evacuated._id) && mp.vehicles.exists(player.evacuated))player.evacuated.destroy();
			player.evacuated.evacuated = undefined;
			player.evacuated = undefined;
		}
		let veh = mp.vehicles.atMongoId(array[0]);
		if(!veh || !mp.vehicles.exists(veh)){
			vehicleModel.findOne({_id:array[0].toObjectId()}).then((vehModel)=>{
				veh = createVehModel(vehModel);
				vehEvacuate(player,veh)
			}).catch((err)=>{
				console.error(err)
			})
		}
		else{
			if(veh.evacuated && veh.evacuated != player) return player.alert('Машину уже кто то эвакуирует');
			vehEvacuate(player,veh)
		}
	},
	"EVACUATOR::PAY_FINE":(player,array)=>{
		let veh = player.vehicles[array[0]];
		let vehicles = mp.vehicles.toArray();
		let park = vehicleParking.find((p)=>{
			return !vehicles.find((veh)=>{
				return veh.position.dist(p.pos)< 1.5;
			});
		})
		if(!park)return player.alert('Мест на парковки нет')
		veh.model.evacuated = false;
		if(!player.editMoney(-50,'Штраф за машину'))return;
		veh.model.pos = park.pos;
		veh.model.rot.z = park.heading;
		if(!veh.model.$__.saving)veh.model.save().catch((e)=>{
			player.alert('Произошла ошибка')
			console.error(e);
		})
		player.vehicles[veh.id] = createVehModel(veh.model);
	},
	"EVACUATOR::WAYPOINT":(player)=>{
		let veh = player.evacuatedVeh;
		if(!veh) return player.alert('У вас нет вызова');
		player.setNewWaypoint(veh.position);
	}
});

let vehEvacuate = (player,veh)=>{
	
	player.evacuated = veh;
	veh.evacuated = player;
	veh.startEvacuated = true;
	player.call("EVACUATOR::VEH",[veh]);
	player.evacuatedVeh = veh;
	player.setNewWaypoint(veh.position);
}