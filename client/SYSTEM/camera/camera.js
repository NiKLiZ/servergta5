let Interpcam;
let interpPos;
mp.events.add("setCameraPosition", function(x, y, z, rx, ry, rz, f = 0,time = 1800){
    cam.setCoord( x, y, z );
    cam.setRot( rx, ry, rz, f );
    cam.setActive(true); 
    mp.game.cam.renderScriptCams(true, true, time, false, false);
});
mp.events.add("cameradefault", function(time = 1000){
    cam.setActive(false); 
    cam.stopPointing();
    mp.game.cam.renderScriptCams(false, true, time, true, false);
});

global.cameraInterp = (x, y, z, rx, ry, rz, f = 0,speed = 1300)=> {
	if(interpPos && interpPos.toString() ==  [x,y,z].toString()) return;
	if(Interpcam){
    Interpcam.setActive(false);
    Interpcam.destroy();
    Interpcam = null;
    cam.setCoord();
	}
	Interpcam = mp.cameras.new('default', cam.getCoord(), cam.getRot(2), cam.getFov());
	interpPos = [x,y,z];
  cam.setRot( rx, ry, rz, 2);
	cam.setCoord(x, y, z);
  cam.stopPointing();
	cam.setActiveWithInterp(Interpcam.handle, speed, 0, 0); // 2000ms = 2secs, 0, 0 - idk
	mp.game.cam.renderScriptCams(true, false, 0, false, false);
}
mp.events.add("cameraInterp", cameraInterp);
global.camera = mp.cameras.new("gameplay");