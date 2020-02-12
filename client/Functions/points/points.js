let markers = [];
let colshape_radius = [];
let checkpoint_curent = null;
let togglecheckpoints = [];
let {browserHud} = require('../../UI/GUI/gui')
mp.events.add({
	"createMarker":  (info) =>{
		info = JSON.parse(info);
		if( info.type == 1) info.position.z-=1.12;
		let m = mp.markers.new(info.type, info.position, info.scale,
			{
				visible: info.visible || true,
				dimension: info.dimension || 0,
				color: info.color || [255,255,255,255]
			});
		m.function = info.function;
		m.data = info.data;
		if(info.blip !== undefined) createBlip(info, m.id);
		if(info.label !== undefined) createLabel(info, m.id);
	},
	"createCheckpoint":  (info) =>{
		info = JSON.parse(info);
		info.position.z-=1.2;
		let c = mp.checkpoints.new(info.type, info.position, info.scale,
			{
				direction: info.direction || info.position,
				visible: true,
				dimension: info.dimension || 0,
				color: info.color || [255,255,255,255]
			});

		c.function = info.function;
		c.data = info.data;

		if(info.blip !== undefined) createBlip(info, c.id);
		if(info.label !== undefined) createLabel(info, c.id);
	},

	'playerEnterColshape': (shape) => {
		if(!loggined) return;
		let pos = player.position;
		if(!player.vehicle){
			mp.markers.forEach((mark)=>{
				if(player.dimension == mark.dimension && mark.callback &&
					mp.Vector3.Distance(pos,mark.position) < mark.scale &&
					mark.visible){
						browserHud.execute('keyTip(true)');
				}
			})
			mp.colshapes.forEach(
				(cols, id) => {
					if(cols.scale && player.dimension == cols.dimension && mp.Vector3.Distance(pos,cols.position) < cols.scale){
						browserHud.execute('keyTip(true)');
					}
				}
			);
		}
		if (shape.checkpoint && shape.callback) shape.callback(shape,shape.marker)
	},

	"playerEnterCheckpoint":(checkpoint)=>{
		if(checkpoint.callback){
			if(mp.checkpoints.exists(checkpoint)&& checkpoint.dimension == player.dimension){
				if(checkpoint.vehicle_stop){
					if(player.vehicle){
						checkpoint_curent = checkpoint;
					}
				}else checkpoint.callback(checkpoint);
			}
		}
	},
	"playerExitCheckpoint":(checkpoint)=>{
		if(mp.checkpoints.exists(checkpoint)){
			if(checkpoint.exitcallback){
				checkpoint.exitcallback(checkpoint);
			}
			if(checkpoint === checkpoint_curent){
				checkpoint_curent = null;
			}
			browserHud.execute('keyTip(false)');
		}
	},
	"playerExitColshape":(shape)=>{
		if(mp.colshapes.exists(shape)){
			browserHud.execute('keyTip(false)');
			if(shape.exitmenu){
				closemenuv(shape.exitmenu);
			}
		}
		if (shape.exitcallback) shape.exitcallback(shape)
	},
	"render": ()=>{
		try{

			if(!loggined) return;
			if(menuvlocked) return;
			if(checkpoint_curent){
				if(player.vehicle && player.vehicle.getSpeed() < 1){
					checkpoint_curent.callback(checkpoint_curent);
					checkpoint_curent = null
				}
			}
		}catch(e){}
	},
	"PressE":()=>{
		if(!loggined) return;
		if(menuvlocked) return;
		let pos = player.position;
		if(!player.vehicle){
			mp.markers.forEach((mark)=>{
				if(player.dimension == mark.dimension && mark.callback &&
					 mp.Vector3.Distance(pos,mark.position) < mark.scale){
					if(mark.callremote != undefined){
						mp.events.callRemote("POINT:EVENT",mark.callremote)
					}
					else mark.callback(mark);
					return;
				}
			})
			mp.colshapes.forEach(
				(cols, id) => {
					if(cols.scale && player.dimension == cols.dimension && mp.Vector3.Distance(pos,cols.position) < cols.scale){
						cols.callback(cols);
						return;
					}
				}
			);
		}
	}
});

mp.events.add("deleteWayPoint", function (id, type) {
	if(type == "marker") mp.markers.at(id).destroy();
	if(type == "checkpoint") mp.checkpoints.at(id).destroy();
	mp.labels.forEach(_ => {
		if(_.ownerId == id) _.destroy();
	});
	mp.blips.forEach(_ => {
		if(_.ownerId == id) _.destroy();
	});
});

global.createMarker = (marker,callback,exitcallback)=>{
	let m = mp.markers.new(marker.type, marker.position, marker.scale, {
		visible: marker.visible || true,
		dimension: marker.dimension || 0,
		color: marker.color || [255,255,255,255]
	});
	m.callback = callback;
	m.exitcallback = exitcallback;
	if(marker.blip !== undefined) createBlip(marker, m.id);
	if(marker.label !== undefined) createLabel(marker, m.id);
	let colshape = mp.colshapes.newSphere(marker.position.x,marker.position.y,marker.position.z, marker.scale,marker.dimension);
	m.colshape = colshape;
	m._id = markers.length;
	m.del = ()=>{
		if(mp.Vector3.Distance(player.position,marker.position) < marker.scale){
			browserHud.execute('keyTip(false)');
		}
		if(mp.markers.exists(m))m.destroy();
		if(mp.colshapes.exists(colshape))colshape.destroy();
		markers.splice(m._id,1)
	}
	let mark = {
		id: m._id,
		marker: m,
		callback: callback,
		exitcallback: exitcallback,
		colshape: colshape
	}
	if(marker.callremote != undefined) mark.callremote = marker.callremote;
	markers.push(mark);
	return mark;
}

global.createRouteMarker = (info, onEnter, onExit) => {
	const marker = mp.checkpoints.new(info.type, info.position, info.scale, {
		visible: info.visible || true,
		dimension: info.dimension || 0,
		color: info.color || [255,255,255,255],
		direction: info.direction || new mp.Vector3()
	});
	let colshape = mp.colshapes.newSphere(info.position.x, info.position.y, info.position.z, info.scale, info.dimension);
	colshape.callback = onEnter;
	colshape.exitcallback = onExit;
	colshape.marker = marker;
	colshape.checkpoint = true;
	marker.del = () => {
		if(mp.colshapes.exists(colshape))colshape.destroy();
		if(mp.checkpoints.exists(marker))marker.destroy();
		
	}
	colshape.del = marker.del;
	return marker;
}

global.createCheckpoint = (checkpoint,callback,exitcallback)=>{
	checkpoint.position.z-=1.2;
	let c = mp.checkpoints.new(checkpoint.type, checkpoint.position, checkpoint.scale,
	{
		visible: true,
		dimension: checkpoint.dimension || 0,
		color: checkpoint.color || [255,255,255,255],
		direction: checkpoint.direction || new mp.Vector3()
	});
	c.vehicle_stop = checkpoint.vehicle_stop
	c.callback = callback;
	c.exitcallback = exitcallback;
	c.scale = checkpoint.scale;
	c.del = ()=>{
		if(mp.checkpoints.exists(c)){
			c.destroy();
		} 
	} 
	return c;
}
global.togglemarker = (enter_marker,exit_marker,callback)=>{
	global.createMarker(enter_marker,(m)=>{
		let position = exit_marker.position;
		player.position = new mp.Vector3(position.x,position.y,position.z+1);
		player.dimension = m.dimension;
		callback(false,enter_marker,exit_marker)
		browserHud.execute('keyTip(true)');
	})
	global.createMarker(exit_marker,(m)=>{
		let position = enter_marker.position;
		player.position = new mp.Vector3(position.x,position.y,position.z+1);
		player.dimension = m.dimension;
		callback(true,enter_marker,exit_marker)
		browserHud.execute('keyTip(true)');
	})
}

global.createColshapeRadius = (colshape,callback,exitcallback)=>{
	let cols = mp.colshapes.newSphere(colshape.position.x,colshape.position.y,colshape.position.z, colshape.scale);
	cols._id = colshape_radius.length;
	cols.position = colshape.position;
	cols.scale = colshape.scale;
	cols.del = ()=>{
		let pos = player.position;
		if(mp.Vector3.Distance(pos,cols.position) < cols.scale){
			browserHud.execute('keyTip(false)');
		}
		cols.destroy();
		colshape_radius.splice(cols._id, 1);
	}
	cols.scale = colshape.scale;
	cols.callback = callback;
	cols.exitcallback = exitcallback;
	let colshInfo = {
		id: cols._id,
		colshape: cols,
		callback: callback,
		scale: colshape.scale
	}
	colshape_radius.push(colshInfo);
	return colshInfo;
}
