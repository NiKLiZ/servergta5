let zonesPosition = require('../../../packages/configs/gangs/zones.json');
let markers = {};
let blips = [];
let posWarehouseBallas = require('../../../packages/configs/gangs/ballas.json').posWarehouse;
let posWarehouseFamilles = require('../../../packages/configs/gangs/familles.json').posWarehouse;
let posWarehouseVagos = require('../../../packages/configs/gangs/vagos.json').posWarehouse;
let {createMarkersWarehouse,desetroyMarkersWarehouse} = require('../fraction/army');
let {browserFractions} = require('../fraction/browser');
let grassObjFind = false;
let startTime = false;
let zoneStartSeconds = 900;
let secCapt = zoneStartSeconds;
let captInfo = {
    indexZone: 0,
    forwardGang:{
        name: '',
        points: 0
    },
    protectingGang:{
        name: '',
        points: 0
    },
}

let positionsWarehouse = {
    BALLAS: posWarehouseBallas,
    FAMILLES: posWarehouseFamilles,
    VAGOS: posWarehouseVagos
};
let npcGrass = new mp.Vector3(1445.332275390625,1132.007568359375,114.33397674560547);
mp.peds.new(mp.game.joaat('s_m_y_dealer_01'), npcGrass, 178);

let colorsZones = [
    27,
    66,
    2
];

let posInterior = new mp.Vector3(102.74342346191406,-1950.5487060546875,-43.82);
let posWarehouse = new mp.Vector3(109.46080780029297,-1948.0748291015625,-43.82);

let dimensionGang = {
    BALLAS: 16,
    VAGOS: 17,
    FAMILIES: 18,
}

let posJoin = {
    BALLAS: {
        "x": 114.1811294555664,
        "y": -1960.87255859375,
        "z": 20.339187622070312
    },
    VAGOS: {
        "x": 457.0668640136719,
        "y": -1498.446044921875,
        "z": 27.188167572021484
    },

    FAMILIES: {
        "x": -206.35379028320312,
        "y": -1585.5672607421875,
        "z": 37.059486389160156
    },

}

let colorBlip = {
    BALLAS: 83,
    VAGOS: 46,
    FAMILIES: 25,
}
let namesGang = {
    BALLAS: 'East Side Ballas Gang',
    VAGOS: 'Los Santos Vagos Gang ',
    FAMILIES: 'The Families Gang',
}

let gangs = ['BALLAS', 'VAGOS', 'FAMILIES']
module.exports.gangs = gangs;
Object.keys(colorBlip).forEach((gang)=>{
    mp.blips.new(436, posJoin[gang],{
        name: namesGang[gang],
        color: colorBlip[gang],
        dimension: 0,
        alpha: 255,
        shortRange: true,
    })
});

let show = false;
mp.events.add({
    "GANG::SET":(gang,zones)=>{
        zones = JSON.parse(zones);
        let mar = {
            position: posWarehouse,
            type: 1,
            color: [0,0,255,60],
            scale: 1.5,
            dimension: dimensionGang[gang]
        }
        if(markers.warehouse)markers.warehouse.marker.del();
        markers.warehouse = createMarker(mar,(m)=>{
            mp.events.callRemote("FRACTION::WAREHOUSE_MENU",m.id);
        });
        mar.dimension = 0;
        mar.position = posJoin[gang];
        markers.join = createMarker(mar,(m)=>{
            mp.events.callRemote("GANG::JOIN");
            player.position = posInterior;
        });
        mar.position = posInterior;
        mar.dimension = dimensionGang[gang];
        markers.exit = createMarker(mar,(m)=>{
            mp.events.callRemote("GANG::EXIT");
            player.position = posJoin[gang];
        });
        let grassColshape = {
            position: npcGrass,
            scale: 2
        }
        markers.hireGrass = createColshapeRadius(grassColshape,(m)=>{
            let menu = {
                name: 'Аренда земли',
                exit_cols: m,
                items: [
                    {
                        type: 1,
                        name: 'Арендовать землю',
                        placeholder: 'Арендовать землю 500$',
                        callback: 'GANG::HIRE_GRASS'
                    }
                ],
            }
            createmenuv(menu);
        })
        zonesPosition.forEach((zone,i)=>{
            const blip = mp.game.ui.addBlipForRadius(zone.position.x, zone.position.y, zone.position.z, 50);
            mp.game.invoke(getNative("SET_BLIP_SPRITE"), blip, 5);
            mp.game.invoke(getNative("SET_BLIP_ALPHA"), blip, 175);
            mp.game.invoke(getNative("SET_BLIP_COLOUR"), blip, colorsZones[zones[i]]);
            blips.push(blip);
        })  
        createMarkersWarehouse();
    },
    "GANG::STOP":()=>{
        markers.warehouse.marker.del();
        markers.hireGrass.colshape.del();
        desetroyMarkersWarehouse();
        markers.warehouse = null;
        blips.forEach(blip => {
            mp.game.invoke(getNative("SET_BLIP_ALPHA"), blip, 0);
        });
        blips = [];
        if(markers.exit && markers.exit.marker)markers.exit.marker.del();
        if(markers.join && markers.join.marker)markers.join.marker.del();
    },
    "GANG::WAREHOUSE_MENU":(menu,idMarker)=>{
        menu = JSON.parse(menu);
        menu.exitmenu = 'MAR_EXIT'+idMarker;
		createmenuv(menu);
    },
    "GANG::CLOSE":()=>{
		if (show) {
			toggle();
		}
    },
    "render":()=>{
        try{
            if(player.hasGang && startTime){
                let h = secCapt/3600 ^ 0 ;
                let m = (secCapt-h*3600)/60 ^ 0 ;
                let s = secCapt-h*3600-m*60 ;
                mp.game.graphics.drawText(`Время ${(m<10?"0"+m:m)}:${(s<10?"0"+s:s)}`,  [0.95, 0.5], {
                    scale:0.15,
                    color:[255, 255, 255, 255], 
                    font: 0
                });
                mp.game.graphics.drawText(`${captInfo.forwardGang.name}: ${captInfo.forwardGang.points}`,  [0.95, 0.45], {
                    scale:0.15,
                    color:[255, 255, 255, 255], 
                    font: 0
                });
                mp.game.graphics.drawText(`${captInfo.protectingGang.name}: ${captInfo.protectingGang.points}`,  [0.95, 0.55], {
                    scale:0.15,
                    color:[255, 255, 255, 255], 
                    font: 0
                });
                let pos = zonesPosition[captInfo.indexZone];
                let radius = 80;
                mp.game.graphics.drawMarker(
                    28,
                    pos.x, pos.y, pos.z,
                    0, 0, 0,
                    0, 0, 0,
                    radius, radius, radius,
                    234, 197, 7, 40,
                    false, false, 2,
                    false, "", "",false
                );
            }
            if(player.hasGang && !player.vehicle){
                let pos = player.position;
                let objects = mp.objects.toArray();
                let obj = objects.find((obj)=>{
                    if(obj.getVariable('grass') && mp.Vector3.Distance(obj.position,pos) < 2){
                        return true
                    }
                })
                if(obj){
                    if(!grassObjFind){
                        browserFractions.execute('keyTip(true)');
                        grassObjFind = true
                    }
                } 
                else if(grassObjFind){
                    grassObjFind = false;
                    browserFractions.execute('keyTip(false)');
                }
            }
            if (blips.length !== 0) {
                blips.forEach(blip => {
                    mp.game.invoke(getNative("SET_BLIP_ROTATION"), blip, 0);
                })
            }
        }catch(e){}
    },
    "PressE":()=>{
        if(player.hasGang && !player.vehicle){
            let pos = player.position;
            let objects = mp.objects.toArray();
            let obj = objects.find((obj)=>{
                if(obj.getVariable('grass') && mp.Vector3.Distance(obj.position,pos) < 2){
                    return true
                }
            })
            if(obj)mp.events.callRemote("GANG::DELVE_GRASS",obj)
        }
    },
    "GANG::START_TIME":(forwardGang,protectingGang,indexZone,timeCapt,forwardGangPoints,protectingGangPoints)=>{
        secCapt = zoneStartSeconds;
        captInfo.forwardGang.name = forwardGang;
        captInfo.protectingGang.name = protectingGang;
        if(timeCapt){
            secCapt = timeCapt;
            captInfo.forwardGang.points = forwardGangPoints;
            captInfo.protectingGang.points = protectingGangPoints;
        }else{
            captInfo.forwardGang.points = 0;
            captInfo.protectingGang.points = 0;
        }
        startTime = true;
        captInfo.indexZone = indexZone;
        let blip = blips[indexZone];
        mp.game.invoke(getNative("SET_BLIP_FLASH_TIMER"), blip, 5000);
        mp.game.invoke(getNative("SET_BLIP_FLASHES"), blip, true);
    },
    "GANG::STOP_TIME":()=>{
        startTime = false;
        let blip = blips[captInfo.indexZone];
        mp.game.invoke(getNative("SET_BLIP_FLASHES"), blip, false);
    },
    "GANG::UPDATE_BLIP":(indexZone,zoneGang)=>{
        blips[indexZone].setColour(colorsZones[zoneGang]);
    },
    "GANG::UPDATE_PROTECTING_POINTS":(points)=>{
        captInfo.protectingGang.points = points;
    },
    "GANG::UPDATE_FORWARD_POINTS":(points)=>{
        captInfo.forwardGang.points = points;
    },
    "GANG::DELVE_GRASS":(obj)=>{
        set_player_pos_at_position(obj.position,0.6)
        setTimeout(()=>{
            mp.events.callRemote("GANG::GIVE_GRASS",obj)
        },3000)
    },
    "GANG::START_SMOKE":()=>{
        setTimeout(()=>{
            mp.events.callRemote("GANG::STOP_SMOKE")
        },10000)
    }
})

setInterval(()=>{
    if(startTime){
        secCapt--;    
    }
},1000)

let toggle = function() {
	if(!isGUIOpen() && !show) return;
	if(player.fraction === 'BALLAS' || player.fraction === 'VAGOS' || player.fraction === 'FAMILIES'){
		show = !show;
		guitoggle(show)
		if(show){
            mp.events.callRemote("GANG::MENU")
            browserFractions.execute(`gang_menu.show = true;`);
		}else{
			browserFractions.execute(`gang_menu.show = false;`);
		}
	}
}
mp.keys.bind(0x74, true,toggle)

callback("GANG::START_CAPT",()=>{
    if(player.hasGang && player.rank >= 5){
        let indexZone = zonesPosition.findIndex((zone)=>{
            if(mp.Vector3.Distance(zone.position,player.position) < 30)return true;
        })
        if(indexZone === -1)return alert('Территория не найдена')
        mp.events.callRemote('GANG::START_CAPT',indexZone)
        
    }
})

const interator = mp.game.invoke("0x186E5D252FA50E7D");
let blipHandle = mp.game.invoke("0x1BEDE233E6CD2A1F", 5);
do {
    if (typeof mp.blips.atHandle(blipHandle) === 'null' || mp.blips.atHandle(blipHandle) == null) {
        mp.game.ui.removeBlip(blipHandle);
    }
    blipHandle = mp.game.invoke("0x14F96AA50D6FBEA7", 5);
} while (mp.game.invoke("0x86A652570E5F25DD", blipHandle));

mp.events.add("playerQuit", (player_last, exitType, reason) => {
    if (player_last.name === player.name) {
        blips.forEach(blip => {
            mp.game.invoke(getNative("SET_BLIP_ALPHA"), blip, 0);
        });
    }
});