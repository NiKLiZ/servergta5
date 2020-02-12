let model = require('../mongodb/home.js').home
let modelUser = require('../mongodb/user.js').User
let types = [
	new mp.Vector3(151.50820922851562, -1007.64892578125, -99.99994659423828),
	new mp.Vector3(265.86, -1007.12, -101.98),
	new mp.Vector3(347.2686, -999.2955, -100.19622),
	new mp.Vector3(-174.18971252441406,497.3450012207031,136.6720733642578),
	new mp.Vector3(1273.9, -1719.305, 53.77141),
	new mp.Vector3(1973.012939453125,3816.180908203125,32.428707122802734),
];
let types_name = ['Обычный','Средний','Элитный','Особняк','Эконом','Трейлер']
let garages = require('./garagesConfig');
let home = class home{
	constructor(id,pos,type,price,owner,mongodb) {
		this.id = id;
		this.pos = pos;
		this.type = type;
		this.price = price;
		this.owner = owner;
		// this.blip = mp.blips.new(40, pos,{
		// 	name: 'Дом',
		// 	color: owner? 1:2,
		// 	shortRange: true,
		// });
		pos.z  -= 1;
		this.colshape = mp.colshapes.newSphere(pos.x, pos.y, pos.z, 1.5);
		this.colshape.home = this; 
		this.mongodb = mongodb;
		this.dimension = 235*this.type*this.id+100;
		//Гараж
		if(mongodb.garagePos){
			this.createGarage(mongodb.garagePos,mongodb.garageHeading,mongodb.garageType)
			this.garage = mongodb.garage;
		}
		pos.z++;
		this.label = mp.labels.new("", pos,{
			los: true,
			font: 0,
			drawDistance: 7,
		});
		this.updateLabelText();
		if(!mongodb.$__.saving)mongodb.save().catch((err)=>console.error(err));
		let blip = {
			pos: this.pos,
		}
		blip = JSON.stringify(blip);
		mp.players.forEach((player)=>{
			try{
				if(player.loggined){
					player.call("HOME::ADD_BLIP",[blip])
				}
			}catch(e){
				console.error(e)
			}
		})
	}
	deleteGarage(){
		this.mongodb.garagePos = null;
		this.colshape_garage.destroy();
		if(!this.mongodb.$__.saving)this.mongodb.save().catch((e)=>{
			console.error(e);
		})
		if(home.markerexit_garage){
			home.colshapeexit_garage.destroy();
			home.markerexit_garage.destroy();
		}
	}
	updateData(player){
		player.call("HOME::MY_HOME",[this.id,!!this.colshape_garage,this.price])
	}
	buy(player){
		if(this.owner != null) return;
		if(!player.editMoney(-this.price, 'Дом '))return 
		// this.blip.color = 1;
		let home = this
		mp.players.forEach((pl)=>{
			try{
				if(pl.loggined && pl != player){
					pl.call("HOME::BUY",[home.id])
				}
			}catch(e){
				console.error(e)
			}
		})
		this.updateData(player);
		this.mongodb.owner = player._id;
		this.join(player);
		this.updateLabelText();
		if(!this.mongodb.$__.saving)this.mongodb.save().catch((e)=>{
			console.error(e);
		})
		this.owner = player._id;
		player.mongoUser.home = this.mongodb._id;
		if(!player.mongoUser.$__.saving)player.mongoUser.save().catch((e)=>{
			player.alert('Произошла ошибка')
			console.error(e);
		})
		player.home = this;
	}
	self(player){
		if(this.owner == null || player._id.toString() != this.owner.toString()) return;
		player.alert(`Вы продали дом за ${this.price}`,2);
		player.editMoney(this.price,'Дом');
		// this.blip.color = 2;
		mp.players.forEach((player)=>{
			try{
				if(player.loggined){
					player.call("HOME::SELF",[this.id])
				}
			}catch(e){
				console.error(e)
			}
		})
		this.owner = null;
		if(player.joinhome) this.exit(player);
		this.mongodb.owner = undefined;
		if(!this.mongodb.$__.saving)this.mongodb.save().catch((e)=>{
			console.error(e);
		})
		this.updateLabelText();
		player.mongoUser.home = undefined;
		if(!player.mongoUser.$__.saving)player.mongoUser.save().catch((e)=>{
			player.alert('Произошла ошибка')
			console.error(e);
		})
		player.home = undefined;
	}
	join(player){
		if(this.owner==null&&!player.permision['HOME::JOIN']) return;
		let pos = types[this.type];
		player.dimension = this.dimension;
		player.position = pos;
		if(!this.colshapeexit){
			this.markerexit = mp.markers.new(1, pos, 1.5,{color: [0,255,0,60],dimension: this.dimension});
			this.markerexit.position.z -= 1;
			this.colshapeexit = mp.colshapes.newSphere(pos.x, pos.y, pos.z, 1.5);
			this.colshapeexit.dimension = this.dimension;
			this.colshapeexit.exithome = this;
		}
		player.joinhome = true;
		player.joinhome_class = this;
	}
	exit(player){
		player.dimension = 0;
		player.position = this.pos;
		player.joinhome = false;
	}
	delete(player){
		if(!player.permision['HOME::DELETE']) return player.alert(`У вас нет прав`,1);
		if(player.joinhome) this.exit(player);
		if(this.markerexit){
			this.markerexit.destroy();
			this.colshapeexit.destroy();
		}
		if(this.markerexit_garage){
			this.colshapeexit_garage.destroy();
			this.markerexit_garage.destroy();
		}
		this.label.destroy();
		// this.blip.destroy();
		this.colshape.destroy();
		model.findOneAndRemove({_id:this.mongodb._id}).catch((e)=>console.error(e));
		player.closemenuv('home')
		mp.players.forEach((player)=>{
			try{
				if(player.loggined){
					player.call("HOME::REMOVE_BLIP",[this.id])
				}
			}catch(e){
				console.error(e)
			}
		})
		player.alert(`Дом под id: ${this.id} был удалён`,1);
	}
	garageJoinVeh(veh,player){
		for(let i=0;i<this.garage.length;i++){
			if(!this.garage[i]){
				veh.mongodb.garage = this.mongodb._id;
				veh.mongodb.garagePos = i;
				if(!veh.mongodb.$__.saving)veh.mongodb.save().catch((err)=>{
					if(err)console.error(err)
				})
				
				this.vehGarag(veh,i);
				this.saveGarag();
				if(player){
					this.createJoinGaragPlayer();
					player.joinhome = true;
					player.joinhome_class = this;
					player.dimension = this.dimension;
				}
				veh.savepos();
				return true;
			}
		}
		return false;
	}
	garageJoinPlayer(player){
		if(this.owner==null&&!player.permision['HOME::JOIN']) return;
		let pos = garages[this.garageType].join_pos;
		player.position = pos;
		player.position.z += 1;
		player.dimension = this.dimension;
		this.createJoinGaragPlayer();
		player.joinhome = true;
		player.joinhome_class = this;
	}
	createJoinGaragPlayer(){
		let pos = garages[this.garageType].join_pos;
		if(!this.colshapeexit_garage){
			this.markerexit_garage = mp.markers.new(1, pos, 1.5,{color: [0,255,0,60],dimension: this.dimension});
			this.colshapeexit_garage = mp.colshapes.newSphere(pos.x, pos.y, pos.z, 1.5);
			this.colshapeexit_garage.dimension = this.dimension;
			this.colshapeexit_garage.exitgarage = this;
		}
	}
	vehGarag(veh,i){
		// на всякий случай что бы сервер не крашнулся
		if(!garages[this.garageType])return;
		let rot = veh.rotation;
		rot.z = garages[this.garageType].positions[i].heading;
		veh.rotation = rot;
		veh.position = garages[this.garageType].positions[i].pos;
		veh.dimension = this.dimension;
		this.garage[i] = veh._id;
		veh.home = this;
		veh.garage = this;
		veh.setVariable('garagPosition',this.garageType+"|"+i);
		veh.setVariable('garag',true);
	}
	garageExitVeh(veh){
		for(let i=0;i<this.garage.length;i++){
			if(this.garage[i] && this.garage[i].toString() == veh._id.toString()){
				veh.mongodb.garage = null;
				veh.dimension = 0;
				veh.position = this.garage_pos;
				let rot = veh.rotation;
				rot.z = this.garageHeading;
				veh.rotation = rot;
				let player = veh.getPlayers(-1);
				// if(player)player.call("HOME::SET_ROTATION_VEH",[this.garageHeading])
				veh.garage = undefined;
				veh.home = null;
				veh.setVariable('garagPosition',undefined)
				veh.setVariable('garag',false);
				this.garage[i] = null;
				this.saveGarag();
				veh.savepos();
				return true;
			}
		}
		return false;
		
	}
	garageExitPlayer(player){
		player.dimension = 0;
		player.position = this.garage_pos;
		player.joinhome = false;
		player.joinhome_class = null;
	}
	createGarage(pos,heading,garageType){
		this.colshape_garage = mp.colshapes.newSphere(pos.x, pos.y, pos.z, 3);
		this.garage_pos = pos;
		this.colshape_garage.garage_home = this; 
		this.garageType = garageType;
		this.garageConfig = garages[garageType];
		this.garage = [null,null,null,null,null,null,null,null,null,null];
		this.garageHeading = heading;
	}
	saveGarag(){
		model.findOneAndUpdate({_id:this.mongodb._id},{ $set: {garage: this.garage}}).catch((err)=>{
			if(err) console.error(err)
		})
	}
	updateLabelText(){
		
		if(this.mongodb.owner){
			modelUser.findById(this.mongodb.owner).exec().then((user)=>{
				if(!user){
					return;
				}
				let name = `${user.name} ${user.surname}`
				this.label.text = `Тип: ${types_name[this.type]}\nЦена: ${this.price}$\nВладелец ${name}\nГараж: ${!this.colshape_garage?'Нет':'на '+garages[this.garageType].positions.length+' мест'}`;
			}).catch((err)=>{
				console.error(err)
			});
		}
		else this.label.text = `Тип: ${types_name[this.type]}\nЦена: ${this.price}$\nВладельца нет\nГараж: ${!this.colshape_garage?'Нет':'на '+garages[this.garageType].positions.length+' мест'}`;
	}
}
module.exports = home;