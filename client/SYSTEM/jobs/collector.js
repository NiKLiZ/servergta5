let start = false;
let mission;
let incasatorMission = typeof debag != 'undefined' ? 0 : 1 ;
let markerVehicle;
let markerDriverATM;
let markerIncasatorAtm;
let maxSpeedMarkerPut = 2;
global.collectorVeh = undefined; 
let browserCollector = mp.browsers.new('package://HTML/collector/index.html'); 
let mar = {
	type: 1,
	color:  [0,255,0,60],
	position: new mp.Vector3(254.88055419921875,211.56300354003906,105.28683471679688),
	scale: 1.5
}
exports.position = mar.position;
mp.blips.new(586, mar.position,{
	name: 'Инкассатор (Работа)',
	color: 58,
	dimension: 0,
	shortRange: true,
    alpha: 255
})
createMarker(mar,(m)=>{
    if(start){
        let menu = {
            name: 'Инкассатор',
            exit_mar:m,
            items: [
                {
                    type: 1,
                    name: 'Закончить работу',
                    callback_remote: 'COLLECTOR::FINISH_JOB',
                    placeholder: 'Закончить работу'
                }
            ]
        }
        createmenuv(menu);
    }
    else{
        mp.events.callRemote("COLLECTOR::MENU_SHOW");
    } 
});
function setDoorCloset(toggle){
    mp.game.object.setStateOfClosestDoorOfType(mp.game.joaat('v_ilev_bk_vaultdoor'), 255.2283, 223.976, 102.3932, false, toggle ? 0 : -1, true);
}
setDoorCloset(true)
mp.events.add({
    "COLLECTOR::MENU_SHOW":(ret)=>{
        browserCollector.execute(`
        collector.show = true;
        collector.lobbys = ${ret}
        `);
        guitoggle(true);
    },
    "COLLECTOR::MENU_HIDE":()=>{
        guitoggle(false);
        mp.events.callRemote("COLLECTOR::MENU_HIDE");
    },
    "COLLECTOR::START":(miss)=>{
        guitoggle(false);
        browserCollector.execute(`collector.show = false`)
        mission = miss; 
        start = true;
        if(mission === incasatorMission){
            let marjoin = {
                type: 27,
                color:  [255, 140, 0,255],
                position: new mp.Vector3(254.06202697753906,225.57131958007812,100.89574005126953),
                scale: 1.5
            };
            setDoorCloset(false);
        }
    },
    "render":()=>{
        try{
            if(start){
                let veh = collectorVeh;
                if(veh){
                    if(player.vehicle != veh){
                        let pos = veh.position;
                        mp.game.graphics.drawMarker(
                            2,
                            pos.x, pos.y, pos.z + 2.7,
                            0, 0, 0,
                            0, 180, 0,
                            1.0, 1.0, 1.0,
                            200, 100, 0, 255,
                            false, false, 2,
                            true, "", "",false
                        );
                    }
                    if( markerVehicle && mp.markers.exists(markerVehicle.marker) && markerVehicle.marker && markerVehicle.marker.position){
                        if(veh.getSpeed() * 3.6 > maxSpeedMarkerPut){
                            markerVehicle.marker.visible = false
                        }
                        else{
                            markerVehicle.marker.position = veh.getOffsetFromInWorldCoords(0,-4,0.5);
                            markerVehicle.marker.visible = true
                        }
                    }
                }
            }
        }catch(e){}
    },
    "COLLECTOR::MENU_UPDATE":(...args)=>{
        browserCollector.execute(`mp.call('COLLECTOR::MENU_UPDATE',${args.join(',')})`)
    },
    "COLLECTOR::ACTIVE_LOBBY":(...args)=>{
        browserCollector.execute(`mp.call('COLLECTOR::ACTIVE_LOBBY',${args.join(',')})`)
    },
    "COLLECTOR::CREATE_MARKER_BAG":()=>{
        mar.position = new mp.Vector3(265.79925537109375,213.27706909179688,100.68340301513672);
        let blip = mp.blips.new(586, mar.position,{
            name: 'Взять телефон',
            color: 0,
            dimension: 0,
            shortRange: true,
            alpha: 255
        })
        createMarker(mar,(m)=>{
            blip.destroy();
            m.del();
            mp.events.callRemote('COLLECTOR::TAKE_BAG');
        });
    },
    "COLLECTOR::CREATE_MARKER_VEHICLE":()=>{
        let veh = collectorVeh;
        let marjoin  ={
            type: 30,
            color:  [255, 140, 0,255],
            position: veh.getOffsetFromInWorldCoords(0,-4,0.5),
            scale: 1
        };
        markerVehicle = createMarker(marjoin,(m)=>{
            if(veh.getSpeed() * 3.6 > maxSpeedMarkerPut)return;
            mp.events.callRemote("COLLECTOR::PUT_VEHICLE_BAG");
        })
    },
    "COLLECTOR::MARKER_VEHICLE_DESTROY":()=>{
        if(markerVehicle){
            markerVehicle.marker.del();
            markerVehicle = null;
        }
    },
    "COLLECTOR::CREATE_MARKER_DRIVER_ATM":(atm)=>{
        atm = JSON.parse(atm);
        let marjoin = {
            type: 0,
            color:  [255, 140, 0,0],
            position: atm,
            scale: 20
        };
        markerDriverATM = createCheckpoint(marjoin,(m)=>{
            markerDriverATM = null;
            mp.events.callRemote("COLLECTOR::CHECK_MARKER_DRIVER_ATM");
            m.del();
        })
    },
    "COLLECTOR::CREATE_MARKER_ATM":(atm)=>{
        atm = JSON.parse(atm);
        let marjoin  ={
            type: 1,
            color:  [255, 140, 0,255],
            position: atm,
            scale: 1.5
        };
        let blip = mp.blips.new(586, marjoin.position,{
            name: 'ATM',
            color: 0,
            dimension: 0,
            shortRange: true,
            alpha: 255
        })
        markerIncasatorAtm = createMarker(marjoin,(m)=>{
            markerIncasatorAtm = null;
            mp.events.callRemote("COLLECTOR::CHECK_MARKER_INCASATOR_ATM");
            blip.destroy();
            m.del();
        })
    },
    "COLLECTOR::END_JOB":(endPos)=>{
        endPos = JSON.parse(endPos)
        let marjoin = {
            type: 0,
            color:  [255, 140, 0,20],
            position: endPos,
            scale: 20
        };
        createCheckpoint(marjoin,(m)=>{
            if(collectorVeh == player.vehicle){
                m.del();
                collectorVeh.setForwardSpeed(0);
                mp.events.callRemote("COLLECTOR::END_JOB");
            }
        })
    },
    "COLLECTOR::VEH":(veh)=>{
        collectorVeh = veh;
    },
    "COLLECTOR::STOP":()=>{
        collectorVeh = undefined;
        start = false;
        setDoorCloset(true);
        if(markerVehicle && markerVehicle.marker){
            markerVehicle.marker.del();
            markerVehicle = null;
        }
        if(markerDriverATM && markerDriverATM.marker){
            markerDriverATM.marker.del();
            markerDriverATM = null;
        }
        if(markerIncasatorAtm && markerIncasatorAtm.marker){
            markerIncasatorAtm.marker.del();
            markerIncasatorAtm = null;
        }
    }
})
mp.keys.bind(0x4A,false,function(){
    if(start && mission == 0 && player.vehicle ==  collectorVeh && chatActive == false){
        mp.events.callRemote('COLLECTOR::OPEN_DORS')
    }
})