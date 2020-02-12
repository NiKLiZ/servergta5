let create = mp.vehicles.new;
let vehicle = require('../../../mongodb/vehicle.js').vehicle;
let inventory = require('../../../inventory/newclass.js');
let configVehicles =  require('./configsVehicles.js').configVehicles;
let getVariableVehicle = require('./getvariabels').getVariableVehicle;
let generationPlate = require('./getvariabels').generationPlate;

let funct  = (veh)=>{
		let funcs = {
			toggledor: (dor)=>{
				let doors = JSON.parse(veh.getVariable('doors'))
				if(doors[dor] != 2){
					doors[dor] = doors[dor] == 1 ? 0 : 1;
					veh.setVariable('doors',JSON.stringify(doors));
				}
			},
			isOpenDoor:(dor)=>{
				let doors = JSON.parse(veh.getVariable('doors'))
				return doors[dor] == 1;
			},
			toggleengen: (toggle)=>{
				veh.engine = toggle;
				veh.setVariable('Undriveable',toggle);
			},
			getPlayers: (seat)=>{
				let players = [];
				mp.players.forEachInRange(veh.position,10,(player) => {
					try{

						if(player.vehicle && player.vehicle == veh){
							if(seat != null) {
								if(player.seat === seat)return players = player;
							}
							else players.push(player);
						} 
					}catch(e){
						console.error(e)
					}
				})
				if(seat != null && players.length == 0) return null;
				return players;
			},
			setTune:(mod,index)=>{
				let tunes = JSON.parse(veh.getVariable('tuning'))
				veh.tuning[mod] = index;
				tunes[mod] = index;
				veh.setVariable('tuning',JSON.stringify(tunes));
			},
			detachTowTruck:()=>{
				mp.players.forEachInRange(veh.position, mp.config['stream-distance'],veh.dimension,
					(player) => {
						try{
							player.call("VEHICLE::DETACH_TOW_TRUCK",[veh.id]);
						}catch(e){
							console.error(e)
						}
					}
				);
			}

	}
	veh = Object.assign(veh,funcs);
}


mp.vehicles.new = (model,pos,json = {})=>{
	if(!json.numberPlate) json.numberPlate = generationPlate();
	let veh = create(model,pos,json);
	veh.engine = false;
	let confVehicle = configVehicles[model];
	if(!confVehicle)confVehicle = configVehicles['default'];
	if(confVehicle.glove)veh.glovebox = new inventory(4,7,null,veh,'glovebox',confVehicle.sizeGlove);
	if(confVehicle.trunk)veh.trunk = new inventory(4,7,null,veh,'trunk',confVehicle.sizeTrunk);
	if(!json.numberPlate){
		let numberPlate = genNumberPlate();
		veh.numberPlate = numberPlate;
	}
	funct(veh);
	veh.data.petrol = confVehicle.maxPetrol; 
	veh.data.glove = confVehicle.glove; 
	veh.data.trunk = confVehicle.trunk; 
	veh.data.systemPetrol = confVehicle.systemPetrol; 
	veh.data.consumptionPetrol = confVehicle.consumptionPetrol; 
	veh.setVariable('Undriveable',false);
	veh.data.IndicatorLights_one = false; 
	veh.data.IndicatorLights_two = false; 
	veh.data.SirenSound = false; 
	veh.data.MAX_PETROL = confVehicle.maxPetrol;
	veh.data.doors = JSON.stringify(new Array(8).fill(0)); 
	veh.data.tuning = JSON.stringify(new Array(70).fill(-1));
	veh.tuning = new Array(70).fill(-1);
	return veh;
}
mp.vehicles.add = (player,...vars)=>{
	try{
		let veh = mp.vehicles.new(...vars);
		if(vars[2].color)veh.setColor(...vars[2].color);
		let vehs = getVariableVehicle(veh); 
		vehs.secondary = vars[2].color[1];
		vehs.mods = Array(90).fill(-1);
		veh._id = vehs._id
		if(vars[2].price)vehs.price = vars[2].price;
		vehs = new vehicle(vehs)
		vehs.player = player.mongoUser;
		player.mongoUser.vehicles.push(vehs);
		if(!player.mongoUser.$__.saving)player.mongoUser.save().catch((err)=>{console.error('err',err)})
		LoadVehModel(veh,vehs);
		vehs.save((err,done)=>{
			if (err) console.error(err); 
		})
		return veh;
	}catch(err){
		console.error(err);
	}
}
function LoadVehModel(veh,vehs) {
	veh._id = vehs._id;
	if(vehs.glovebox && veh.glovebox) veh.glovebox.items = vehs.glovebox;
	if(vehs.trunk && veh.trunk) veh.trunk.items = vehs.trunk;
	if(vehs.petrol) veh.setVariable('petrol',vehs.petrol);
	veh.locked = vehs.locked;
	if(vehs.numberPlateType)veh.numberPlateType = vehs.numberPlateType;
	if(vehs.windowTint)veh.windowTint = vehs.windowTint;
	if(vehs.numberPlate)veh.numberPlate = vehs.numberPlate;
	veh.setColor(vehs.primary,vehs.secondary);
	veh.garage = vehs.garage;
	veh.toggleengen(vehs.engine);
	veh.data.extra = vehs.extra;
	veh.data.extraWheel = vehs.extraWheel;
	if(vehs.headlightColor)veh.data.headlightColor = vehs.headlightColor;
	veh.mongodb = vehs;
	if(vehs.mods.length){
		for(let i=0;i<vehs.mods.length;i++){
			if(!isNaN(parseInt(vehs.mods[i])) && vehs.mods[i] != 255 && vehs.mods[i] != -1)veh.setTune(i,vehs.mods[i]); //|set setMod исправить в 0.4|
		}
	}
	veh.savepos = ()=>{
		try{
			veh.mongodb.pos = veh.position;
			veh.mongodb.rot = veh.rotation;
			veh.mongodb.petrol = veh.getVariable('petrol');
			veh.mongodb.markModified('pos');
			if(!veh.mongodb.$__.saving)veh.mongodb.save().catch((err)=>{
				console.error(err);
			})
			
		}catch(e){
			console.error(e)
		}
	}
	if(vehs.neon && vehs.neon.length > 2){
		veh.neonEnabled = true;
		veh.setNeonColor(...vehs.neon);
	}else{
		veh.neonEnabled = false;
	}
}
let createVehModel = (vehs)=>{
	let pos = new mp.Vector3(vehs.pos.x,vehs.pos.y,vehs.pos.z)
	let veh = mp.vehicles.new(vehs.model,pos,{
		heading:vehs.rot.z,
		color:vehs.color? vehs.color:[0,0]
	})
	LoadVehModel(veh,vehs)
	return veh;
}
exports.createVehModel = createVehModel;