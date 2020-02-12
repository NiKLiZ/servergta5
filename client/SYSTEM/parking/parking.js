let wait_parking = 0;
let maxendwait = 60;
let callbackseat;
let callbackexit;
mp.events.add({
  'render': async () => {
    try{
      let parking = player.parking;
      if(!parking) return;
      if(wait_parking > 0)mp.game.graphics.drawText(`Вернитесь в транспорт: ~o~${''+wait_parking} ~w~сек.`, [0.5, 0.95], {
              font: 0,
              color: [255, 255, 255, 255],
              scale: [0.6, 0.6],
              outline: true
      });
      let dist = mp.Vector3.Distance(player.position, parking.position);
      if(dist <= 100 && parking != player.vehicle){
        let pos = parking.position;
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
    }catch(e){}
  },
  'playerEnterVehicle': (vehicle)=>{
    let parking = player.parking;//|Доделать| 0.4
    if(callbackseat != null && parking === vehicle){
      callbackseat(parking);
      callbackseat = null;
    }
  },
  "PARKING::SET":(isNotclienSide)=>{
    if(typeof isNotclienSide == "object"){
      player.parking = isNotclienSide;
      wait_parking = 60;
    }
    else player.parking = undefined;
    if(isNotclienSide){
      callbackexit = null;
      callbackseat = null;
    }else{
      if(callbackexit != null) callbackexit()
      callbackexit = null;
      callbackseat = null
    }
  }
});

global.seatparking = (call)=>{
  callbackseat = call;
}
global.parkingexit = (call)=>{
  callbackexit = call;
}

setInterval(function() {
	let veh = player.vehicle;
	let parking = player.parking;
  if (parking && parking !== veh && wait_parking === 0) {
      wait_parking = maxendwait;
  }
  if (parking === veh && wait_parking !== 0) {
      wait_parking = 0;
  }
  if (player.parking && wait_parking > 0) {
      if (wait_parking <= 10 && wait_parking !== 0) mp.game.audio.playSoundFrontend(-1, "TIMER", "HUD_FRONTEND_DEFAULT_SOUNDSET", false);
      wait_parking--;
  }
  if ( parking&& parking !== veh && wait_parking === 0) {
      mp.events.callRemote("parkingCancle");
  }
}, 1000);
