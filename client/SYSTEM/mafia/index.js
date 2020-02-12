let posJoinCM = require('../../../packages/configs/mafias/CM.json').join;
let posJoinLCN = require('../../../packages/configs/mafias/LCN.json').join;
let posJoinRM = require('../../../packages/configs/mafias/RM.json').join;
let {createMarkersWarehouse,desetroyMarkersWarehouse} = require('../fraction/army');
let {browserFractions} = require('../fraction/browser');
let show = false;
let positionsJoin = {
    CM:posJoinCM,
    LCN:posJoinLCN,
    RM:posJoinRM
}
let dimensions = {
    LCN:10,
    CM:11,
    RM:12
}
let namesMafias = {
    LCN: 'Italian Mafia',
    CM: 'Colombian Mafia',
    RM: 'Russian Mafia',

}
let colorBlipMafias = {
    LCN: 25,
    CM: 5,
    RM: 68,
} 
let markers = {};
let mafias = ['CM','LCN','RM']
module.exports.mafias = mafias;
Object.keys(colorBlipMafias).forEach((mafia)=>{
    mp.blips.new(78, positionsJoin[mafia],{
        name: namesMafias[mafia],
        color: colorBlipMafias[mafia],
        dimension: 0,
        alpha: 255,
        shortRange: true,
    })
})
mp.events.add({
    "MAFIA::SET":(mafia)=>{
        if(markers.warehouse)mp.events.call("MAFIA::STOP");
        let mar = {
            position: positionsJoin[mafia],
            type: 1,
            color: [0,0,255,60],
            scale: 1.5,
        }
        markers.join = createMarker(mar,()=>{
            mp.events.callRemote("MAFIA::JOIN")
        });
        mar.dimension = dimensions[mafia]
        mar.position = new mp.Vector3(1398.0931396484375,1164.0560302734375,113.33361053466797);
        markers.exit = createMarker(mar,()=>{
            mp.events.callRemote("MAFIA::EXIT")
        });
        mar.position = new mp.Vector3(1396.6107177734375,1138.40966796875,113.33361053466797);
        markers.warehouse = createMarker(mar,(m)=>{
            mp.events.callRemote("FRACTION::WAREHOUSE_MENU",m.id)
        });
        createMarkersWarehouse();
    },
    "MAFIA::STOP":()=>{
        if(markers.warehouse)markers.warehouse.marker.del();
        if(markers.join)markers.join.marker.del();
        if(markers.exit)markers.exit.marker.del();
        desetroyMarkersWarehouse();
    },
    "MAFIA::CLOSE":()=>{
		if (show) {
			toggle();
		}
    },
});

let toggle = function() {
	if(!isGUIOpen() && !show) return;
	if(player.hasMafia){
		show = !show;
		guitoggle(show)
		if(show){
            mp.events.callRemote("MAFIA::MENU")
            browserFractions.execute(`mafia_menu.show = true;`);
		}else{
			browserFractions.execute(`mafia_menu.show = false;`);
		}
	}
}
mp.keys.bind(0x74, true,toggle)