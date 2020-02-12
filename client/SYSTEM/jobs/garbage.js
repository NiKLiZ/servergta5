let start = false;
let markerGarbagePoint;
let markerVehicle;
let markerWarehouse;
let objects = [];
let markers = [];
let mar = {
	type: 1,
	color:  [0,255,0,60],
	position: new mp.Vector3(960.0184936523438,-2449.107177734375,30.2315616607666),
	scale: 1.5
}
exports.position = mar.position;

let posGarbageStart;
let posGarbageStopMarker;
mp.blips.new(67, mar.position,{
	name: 'Мусоровоз (Работа)',
    color: 52,
    dimension: 0,
	alpha: 255,
	shortRange: true,
})
createMarker(mar,(m)=>{
	let menu = {
		name: 'Мусоровоз',
		exit_mar:m,
		items: [

		]
	}
	if(!start){
        menu.items.push({
			type: 1,
			name: 'Начать работу',
			callback_remote: 'GARBAGE::START',
			placeholder: 'Начать работу'
		})
    }else{
        menu.items.push({
			type: 1,
			name: 'Закончить работу',
			callback_remote: 'GARBAGE::FINISH_JOB',
			placeholder: 'Закончить работу'
		})
    }
    createmenuv(menu);
});
let garbagePointCreate = (garbage)=>{
	garbage = JSON.parse(garbage)
	mp.game.ui.setNewWaypoint(garbage.markerPos.x,garbage.markerPos.y);
	garbage.garbagePos.forEach((pos)=>{
		let obj = mp.objects.new(mp.game.joaat("bkr_prop_fakeid_binbag_01"), pos,{
			dimension: 0
		});
		objects.push(obj);
		obj.placeOnGroundProperly();
	})
	let check = {
		type: 4,
		color:  [198, 22, 22,175],
		scale: 4,
		position: new mp.Vector3(garbage.markerPos.x,garbage.markerPos.y,garbage.markerPos.z)
	}
	markerGarbagePoint = createCheckpoint(check,(checkx)=>{
		alert('Нажмите J чтобы открыть мусорный бак мусоровоза');
		garbage.garbagePos.forEach((pos,i)=>{
			mar.position = pos;
			markers.push(createMarker(mar,(m)=>{
				//когда маркеров больше нет
				mp.events.callRemote("GARBAGE::PICKED_GARBAGE",i,!(markers.length-1))
			}).marker)
		});
		markerGarbagePoint = null;
		checkx.del();
	})
}
mp.events.add({
    "GARBAGE::START":(garbage)=>{
		start = true;
		seatparking(()=>{
			if(!start)return;
			alert('Нажмите J чтобы открыть мусорный бак мусоровоза');
			garbagePointCreate(garbage);
			posGarbageStart = player.parking.position;
		})
		parkingexit(()=>{
			alert('Вы не успели сесть в мусоровоз');
			mp.events.callRemote('GARBAGE::STOP')
			mp.events.call("GARBAGE::STOP")
		})
    },
    "GARBAGE::STOP":()=>{
		start = false;
		if(markerGarbagePoint)markerGarbagePoint.del();
		markers.forEach((marker)=>{
			marker.del();
		})
		objects.forEach((object)=>{
			object.destroy();
		})
		markers = [];
		objects = [];
		if(markerVehicle && markerVehicle.marker){
            markerVehicle.marker.del();
            markerVehicle = null;
        }
		if(markerWarehouse){
            markerWarehouse.del();
            markerWarehouse = null;
		}
		if(posGarbageStopMarker){
            posGarbageStopMarker.del();
            posGarbageStopMarker = null;
		}
	},
	"render":()=>{
		try{
			if(!start)return;
			let veh = player.parking;
			if(!veh)return;
			if(markerVehicle && mp.markers.exists(markerVehicle.marker)){
				markerVehicle.marker.position = veh.getOffsetFromInWorldCoords(0,-5.4,0.5);
			}
		}catch(e){}
	},
	"GARBAGE::CREATE_MARKER_TANK":()=>{
		if(markerVehicle)return;
		let veh = player.parking;
		let marjoin  ={
			type: 30,
			color:  [255, 140, 0,255],
			position: veh.getOffsetFromInWorldCoords(0,-5.4,0.5),
			scale: 1
		};
		markerVehicle = createMarker(marjoin,(m)=>{
			mp.events.callRemote("GARBAGE::TANK_PUT_GARBAGE");
		})
	},
	"GARBAGE::DESTROY_MARKER_TANK":()=>{
		if(markerVehicle){
            markerVehicle.marker.del();
            markerVehicle = null;
        }
	},
	"GARBAGE::DESTROY_GARBAGE_BAG":(id)=>{
		let obj = objects[id];
		let marker = markers[id];
		marker.del();
		obj.destroy();
		objects.splice(id,1)
		markers.splice(id,1)
	},
	"GARBAGE::CREATE_MARKER_WAREHOUSE":(pos)=>{
		pos = JSON.parse(pos);
		let check = {
			type: 4,
			color:  [198, 22, 22,175],
			scale: 4,
			position: pos
		}
		mp.game.ui.setNewWaypoint(pos.x,pos.y);
		markerWarehouse = createCheckpoint(check,(checkx)=>{
			alert('Посигнальте чтобы разгрузить машину')
		})
	},
	"GARBAGE::DESTROY_MARKER_WAREHOUSE":()=>{
		if(markerWarehouse){
            markerWarehouse.del();
            markerWarehouse = null;
        }
	},
	"GARBAGE::POINT_CREATE":garbagePointCreate,
	
})
mp.keys.bind(0x4A,false,function(){
    if(start && player.vehicle == player.parking && chatActive == false){
        mp.events.callRemote('GARBAGE::OPEN_TANK')
    }
})
callback("GARBAGE::CREATE_MARKER_STOP",()=>{
	alert('Поставте машину туда где она ранее стояла')
	let check = {
		type: 4,
		color:  [198, 22, 22,175],
		scale: 4,
		position: posGarbageStart,
		vehicle_stop: true
	}
	mp.game.ui.setNewWaypoint(posGarbageStart.x,posGarbageStart.y)
	posGarbageStopMarker = createCheckpoint(check,(checkx)=>{
		checkx.del();
		mp.events.callRemote('GARBAGE::FINISH_JOB')
		start = false;
	})
})