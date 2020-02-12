mp.game.object.doorControl(mp.game.joaat('apa_p_mp_door_apart_door_black'), -1295.17017, -567.76886,31.8912582, false, 0.0, 0.0, 0.0); 
mp.game.object.doorControl(mp.game.joaat('apa_p_mp_door_apart_door_black'), -1297.1676, -569.433777,31.8912582, false, 0.0, 0.0, 0.0); 
mp.game.object.doorControl(mp.game.joaat('apa_p_mp_door_apart_door_black'), -1288.03882, -576.335876,31.8912582, false, 0.0, 0.0, 0.0); 
mp.game.object.doorControl(mp.game.joaat('apa_p_mp_door_apart_door_black'), -1290.03601, -578.000793,31.8912582, false, 0.0, 0.0, 0.0); 
mp.game.object.doorControl(mp.game.joaat('apa_p_mp_door_apart_door_black'), -1293.56787, -580.972046,31.8834629, false, 0.0, 0.0, 0.0); 
mp.game.object.doorControl(mp.game.joaat('apa_p_mp_door_apart_door_black'), -1300.01587, -571.779663,35.8715363, false, 0.0, 0.0, 0.0); 
let markerj = {
	type: 1,
	color:  [0,255,0,60],
    position:new mp.Vector3(-544.876708984375,-204.37889099121094,37.22012710571289),
	scale: 1.5,
	dimension: 0
} 
let markere = {
    type: 1,
	color:  [0,255,0,60],
    position: new mp.Vector3(-534.5842895507812,-197.85028076171875,-197.6041),
	scale: 1.5,
	dimension: 0
} 
let marker = {
    type: 27,
	color:  [200, 100, 0, 255],
    position: new mp.Vector3(-556.7034301757812,-197.86231994628906,-197.6041), 
	scale: 1.5,
	dimension: 0
}
let browserMayoralty = mp.browsers.new('package://HTML/mayoralty/index.html');  
exports.mayoraltyPosition = marker.position;
global.togglemarker(markerj,markere,(is)=>{
	setClockEdit(is);
	if(!is)mp.game.time.setClockTime(12,12,12);
	mp.game.gameplay.setOverrideWeather('clear');
});	
mp.blips.new(419, marker.position,{
	name: 'Мэрия',
	color: 0,
	dimension: 0,
	alpha: 255,
	shortRange: true,
})
createMarker(marker,(m)=>{
	browserMayoralty.execute('mayoralty.menuOpen()');
	guitoggle(true);
});