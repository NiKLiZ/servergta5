let garag = false;
let garagPositions = require('../../../packages/server/home/garagesConfig.js');
let homesBlip = [];
// let obj = mp.objects.new(mp.game.joaat("apa_mp_h_stn_chairarm_02"),player.position);
// mp.events.add({
//     "render":()=>{
//         try{
//             let lok = getLookingAtEntity(5,obj.handle)
//             if(!lok)return;
//             obj.setRotation(0, 0, get_heading_2d(player.position,obj.position)-180, 0, true);
//             if(lok.entity == obj)return;
//             obj.position = lok.position;
//             obj.placeOnGroundProperly();
//         }catch(e){
//             console.log(e)
//         }

//     }
// })
// Загрузка трелера 
mp.game.streaming.requestIpl("trevorstrailertrash");
mp.game.object.doorControl(mp.game.joaat("v_ilev_trevtraildr"),1972.769 ,3815.366 ,33.66326, true, 0.0, 0.0, 0.0); 
// Закрывет дверь дома лестера
mp.game.object.doorControl(mp.game.joaat('v_ilev_lester_doorfront'), 1273.815, -1720.697, 54.92143, true, 0.0, 50.0, 0); 
let {browserMenu} = require('../../UI/menu/menu.js');

mp.events.addDataHandler({
	"garagPosition":(entity,value)=>{
        try{
            if(value){
                let posInfo = value.split('|');
                let garageConfig =  garagPositions[parseInt(posInfo[0])].positions[parseInt(posInfo[1])]
                let pos = garageConfig.pos;
                entity.setRotation(0, 0, garageConfig.heading, 1, true);
                entity.position = pos;
            }
            entity.setOnGroundProperly()
            entity.setForwardSpeed(0);
        }catch(e){

        }
	}
})
setInterval(()=>{
	if(player.vehicle){
		if(player.vehicle.getVariable('garag') == true) garag = true;
	}
},50)
mp.events.add({
    "render":()=>{
        try{
            //Если машина в гараже
            if(player.vehicle && player.vehicle.getVariable('garag') == true ){
                if(mp.keys.isDown(87) || mp.keys.isDown(83)){
                    let velocity = player.vehicle.getVelocity();
                    let speed = (Math.abs(velocity.x)+Math.abs(velocity.y))*3.846276;
                    if(speed > 1){
                        garag = false;
                        mp.events.callRemote('HOME::EXIT_GARAG_VEH');
                    } 
                }
            }else{
                garag = false;
            }
        }catch(e){}
    },
    "HOME::LOAD_BLIPS":(blips)=>{
        blips = JSON.parse(blips);
        blips.forEach(blip => {
            homesBlip.push(mp.blips.new(40, blip.pos,{
            	name: '',
            	color: blip.owner ? 1:2,
            	shortRange: true,
                scale: 0.5
            }));
        });
    },
    "HOME::ADD_BLIP":(blip)=>{
        blip = JSON.parse(blip);
        homesBlip.push(mp.blips.new(40, blip.pos,{
            name: '',
            color: 2,
            shortRange: true,
        }));
    },
    'HOME::REMOVE_BLIP':(id)=>{
        if(homesBlip[id] && mp.blips.exists(homesBlip[id]))homesBlip[id].destroy();
        homesBlip[id] = undefined;
    },
    "HOME::BUY":(id)=>{
        if(homesBlip[id] && mp.blips.exists(homesBlip[id]))homesBlip[id].setColour(1);
    },
    "HOME::MY_HOME":(id,hasGarag,price)=>{
        if(homesBlip[id] && mp.blips.exists(homesBlip[id]))homesBlip[id].setColour(0);
        player.hasHome = true;
        player.home = id;
        player.hasGarag = hasGarag;
        let home = {
            name: 'Дом '+id,
            price
        }
        browserMenu.execute(`menu.homes = [${JSON.stringify(home)}]`)
    },
    "HOME::SELF":(id)=>{
        if(homesBlip[id] && mp.blips.exists(homesBlip[id]))homesBlip[id].setColour(2);
        if(player.home == id){
            delete player.home;
            player.hasHome = false;
            player.hasGarag = false;
        }
    },
    "HOME::SET_ROTATION_VEH":(heading)=>{
        if(player.vehicle)player.vehicle.setRotation(0, 0, heading, 1, true);
    }
})