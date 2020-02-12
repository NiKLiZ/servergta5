let getRandom = function(min, max){
  return Math.random() * (max - min) + min;
}
let parking = class parking{
	constructor(vehs,data) {
		this.vehs = [];
		this.data = data;
		for(let i = 0;i<vehs.length;i++){
			let veh = this.createveh(vehs[i])
				// color: colorrandom == true ? [[getRandom(0,255),getRandom(0,255),getRandom(0,255)],[getRandom(0,255),getRandom(0,255),getRandom(0,255)]] : [[0, 0, 0],[0,0,0]]
			let color = vehs[i].color;
			if(vehs[i].color) veh.setColorRGB(color[0][0],color[0][1],color[0][2])
			this.vehs.push(veh);
		}
	}
	createveh(veh){
		let heading = typeof veh.model === "string" ? veh.heading : veh.z;
		let vehs = mp.vehicles.new(typeof veh.model === "string" ? mp.joaat(veh.model) : veh.model,veh.pos ,{
			heading: heading,
			locked: true
		})
		vehs.target = null;
		vehs.parking = this;
		vehs.pos = veh.pos;
		vehs.z = heading;
		if(veh.target)veh.target.parking = null;
		if(this.data){
			Object.assign(vehs,this.data);
			if(this.data.colorrandom) veh.setColorRGB(getRandom(0,255),getRandom(0,255),getRandom(0,255))
		}
		return vehs;
	}
	isveh(){
		let veh = this.findfree();
		if(veh != null) return true;
		return false;
	}
	findfree(){
		for(let i=0;i<this.vehs.length;i++){
			let veh = this.vehs[i];
			if(veh.target === null || veh.target === false){
				return veh;
			}
		}
		return null;
	}
	targetVeh(player){
		player.clearParking();
		let veh = this.findfree();
		if(veh != null ){
			veh.target = player;	
			player.call("PARKING::SET",[veh])
			player.parking = veh;
			veh.locked = false;
			return veh;
		} 
		return null;
	}
	respawn(veh){
		for(let i=0;i<this.vehs.length;i++){
    	let vehicle = this.vehs[i];
    	if(veh == vehicle){
				let vehs = this.createveh(vehicle);
				let primaryColor  = vehicle.getColorRGB(0);
				let secondaryColor  = vehicle.getColorRGB(1);
				if(primaryColor && secondaryColor)vehs.setColorRGB(...primaryColor,...secondaryColor);
				else if(primaryColor)vehs.setColorRGB(...primaryColor);
				this.vehs[i] = vehs;
				vehicle.destroy();
    	}
    }
	}
}

module.exports = parking;