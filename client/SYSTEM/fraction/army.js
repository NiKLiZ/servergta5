let army = {};
let show = false;
let {browserFractions} = require('./browser');
mp.blips.new(455, new mp.Vector3(3040.802978515625, -4691.63427734375, 5.077291488647461),{
	name: 'Крейсер',
	color: 65,
	dimension: 0,
	shortRange: true,
	alpha: 255
 })
mp.blips.new(181, new mp.Vector3(-2345.7705078125,3232.37841796875,33.7479133605957),{
	name: 'Army',
	color: 31,
	dimension: 0,
	shortRange: true,
	alpha: 255
 })

let lift1Pos = new mp.Vector3(-2360.9267578125,3249.27880859375,31.810739517211914);
let lift2Pos = new mp.Vector3(-2360.914794921875,3249.324462890625,91.90370178222656);


function createMarkersWarehouse(){
	let mar = {
		type: 1,
		color:  [0,0,255,60],
		position: new mp.Vector3(-2349.9619140625,3266.303466796875,31.810739517211914), 
		scale: 1.5
	}
	mar.position = new mp.Vector3(3040.802978515625, -4691.63427734375, 5.077291488647461);
	army.weapon = createMarker(mar,(m)=>{
		mp.events.callRemote('ARMY::GET_WEAPON');
	});
	mar.position = new mp.Vector3(3037.185302734375,-4687.77392578125,5.077291488647461);
	army.ammo = createMarker(mar,(m)=>{
		mp.events.callRemote('ARMY::GET_AMMO');
	});
}
function desetroyMarkersWarehouse(){
	army.weapon.marker.del();
	army.ammo.marker.del();
}
mp.events.add({
	"FRACTION::SET":(fraction,rang,underRang,infoRangs)=>{
		if(player.fraction != fraction){
			if(fraction == 'ARMY'){
				browserFractions.execute(`army_menu.rangs = ${infoRangs}`)
				let mar = {
					type: 1,
					color:  [0,0,255,60],
					position: new mp.Vector3(-2349.9619140625,3266.303466796875,31.810739517211914), 
					scale: 1.5
				}
				army.locker = createMarker(mar,(m)=>{
					mp.events.callRemote('ARMY::CLOTHES');
				});
				mar.position = new mp.Vector3(-2345.7705078125,3232.37841796875,33.7479133605957)
				army.warehouse = createMarker(mar,(m)=>{
					mp.events.callRemote('ARMY::WAREHOUSE');
				});
				mar.position = lift1Pos;
				army.lift1 = createMarker(mar,(m)=>{
					player.position = lift2Pos;
				}); 
				mar.position = lift2Pos;
				army.lift2 = createMarker(mar,(m)=>{
					player.position = lift1Pos;
				}); 
				
				createMarkersWarehouse();
			}  
			else{
				if(player.fraction == 'ARMY'){
					army.locker.marker.del();
					army.warehouse.marker.del();
					army.lift2.marker.del();
					army.lift2.marker.del();
					desetroyMarkersWarehouse();
				}
			}
		}
    },
    "ARMY::CLOSE":()=>{
		if (show) {
			toggle();
		}
	},
	"ARMY::WAREHOUSE_MENU":(menu)=>{
		menu = JSON.parse(menu);
		
		menu.exit_mar = army.warehouse.marker;
		createmenuv(menu)
	},
	"ARMY::CLOTHES":(isLocker)=>{
		let menu;
		if(!isLocker){
			 menu = {
				name: 'Армия',
				exit_mar: army.locker.marker,
				items: [
					{
						type: 1,
						name: 'Форма для силовых тренировок',
						callback: 'ARMY::LOCKER',
						callpointenct: 1
					},
					{
						type: 1,
						name: 'Форма для службы на базе',
						callback: 'ARMY::LOCKER',
						callpointenct: 2
					},
					{
						type: 1,
						name: 'Форма для спец. операций',
						callback: 'ARMY::LOCKER',
						callpointenct: 3
					},
				]
			};
		}else{
			menu = {
				name: 'Армия',
				exit_mar: army.locker.marker,
				items: [
					{
						type: 1,
						name: 'Переодется',
						callback: 'ARMY::LOCKER',
					},
				]
			};
		}
		createmenuv(menu);
	}
})
let toggle = function() {
	if(!isGUIOpen() && !show) return;
	if(player.fraction === 'ARMY'){
		show = !show;
		guitoggle(show)
		if(show){
            mp.events.callRemote("ARMY::MENU")
            browserFractions.execute(`army_menu.show = true;`);
		}else{
			browserFractions.execute(`army_menu.show = false;`);
		}
	}
}
mp.keys.bind(0x74, true,toggle)
module.exports = {createMarkersWarehouse,desetroyMarkersWarehouse}
