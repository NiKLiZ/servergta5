let ems = {};
let show = false;
let wait_parking = 0;
let maxendwait = 5;
let sec = 300;
let isDead = false;
let regen = false;

mp.game.gameplay.setFadeOutAfterDeath(false);
mp.game.gameplay.setFadeOutAfterArrest(false);
mp.game.gameplay.setFadeInAfterLoad(false);
mp.game.gameplay.setFadeInAfterDeathArrest(false);
mp.game.streaming.requestAnimDict("combat@death@from_writhe");
let {browserFractions} = require('./browser');
let menuDeat = {
    name: "Умер",
    exitmenu: 'DEAD::MENU',
    items: [
        {
            type: 1,
            name: 'Умереть',
            callback_remote: 'DEAT::TIME_END'
        },
    ]
}

let posEmsJoin = new mp.Vector3(343.1822509765625,-1398.550537109375,31.50925064086914);
let posEmsExit = new mp.Vector3(275.2696533203125,-1361.2288818359375,23.537796020507812);

mp.blips.new(153, posEmsJoin,{
    name: 'EMS',
    color: 75,
    dimension: 0,
    shortRange: true,
    alpha: 255
})

let mar = {
    type: 1,
    color:  [0,255,0,60],
    position: posEmsJoin,
    scale: 1.5
}

let marRegistries = {
	type: 1,
	color:  [0,0,255,60],
	position: new mp.Vector3(260.6723327636719,-1358.481689453125,23.537796020507812), 
	scale: 1.5
}

createMarker(marRegistries,(m)=>{
	let menu = {
		name: 'Больница',
		exit_mar: m,
		items: [
			{
				type: 1,
				name: 'Вылечится',
				placeholder: 'Вылечится за 15$',
				callback: 'EMS::CURE',
			},
		]
    }
    createmenuv(menu);
});
createMarker(mar,(m)=>{
    player.setRotation(0, 0, 51, 0, true);
    player.position = posEmsExit;
});
mar.position = posEmsExit;
createMarker(mar,(m)=>{
    if(regen)return alert('Подождите пока у вас восстановиться здоровье')
    player.setRotation(0, 0, 60, 0, true);
    player.position = posEmsJoin;
});
mp.peds.new(mp.game.joaat('s_m_m_doctor_01'), new mp.Vector3(262.1446,-1359.6630,24.537), 57);
mp.events.add({
	"FRACTION::SET":(fraction,rang,underRang,infoRangs)=>{
		if(player.fraction != fraction){
			if(fraction == 'EMS'){
                browserFractions.execute(`ems_menu.rangs = ${infoRangs}`)
                mar.position = new mp.Vector3(270.0950927734375,-1363.409423828125,23.537796020507812);
                ems.locker = createMarker(mar,()=>{
                    mp.events.callRemote("EMS::LOCKER")
                })
			}
			else{
				if(player.fraction == 'EMS'){
					ems.locker.marker.del();
				}
			}
		}
    },
    "EMS::CLOSE":()=>{
		if (show) {
			toggle();
		}
    },
    "DEAT::START_TIME":()=>{
        sec = 300;
        isDead = true;
        player.hasDead = true;
        player.clearTasks();
        if(player.permision['DEAD::MENU'])createmenuv(menuDeat);
        player.taskPlayAnim("combat@death@from_writhe","death_b",100, 10000, 10000, 2, 10000, true, true, true);
    },
    "DEAT::STOP_TIME":()=>{
        isDead = false;
        player.hasDead = false;
        player.resetRagdollTimer();
    },
    "DEAT::REGEN":()=>{
        regen = true;
        player.setHealth(100);
    },
	"EMS::TREAT_ANIM_ACCEPT":(id)=>{
		let pl = mp.players.atRemoteId(parseInt(id));
		if(mp.Vector3.Distance(player.position,pl.position) > 3) return alert('Игрок слишком далеко отошёл');
		set_player_pos_at_position(pl.position,0.6)
		mp.events.callRemote('EMS::TREAT_ANIM',id)
		setTimeout(()=>{
			mp.events.callRemote('EMS::TREAT',id);
		},5000)
	},
    "render":()=>{
        try{
            if(regen){
                mp.game.player.setHealthRechargeMultiplier(0.0);
            }
            if(isDead){
                mp.game.player.setHealthRechargeMultiplier(0.0);
                // player.setToRagdoll(50,50*1000,0,false,false,false)
                let h = sec/3600 ^ 0 ;
                let m = (sec-h*3600)/60 ^ 0 ;
                let s = sec-h*3600-m*60 ;
                mp.game.graphics.drawText(`Осталось до смерти ${(m<10?"0"+m:m)}:${(s<10?"0"+s:s)}`,  [0.5, 0.95], {scale:0.15, color:[255, 255, 255, 255], font: 0});
            }
        }catch(e){}
    }
})
let toggle = function() {
	if(!isGUIOpen() && !show) return;
	if(player.fraction === 'EMS'){
		show = !show;
		guitoggle(show)
		if(show){
            mp.events.callRemote("EMS::MENU")
            browserFractions.execute(`ems_menu.show = true;`);
		}else{
			browserFractions.execute(`ems_menu.show = false;`);
		}
	}
}
mp.keys.bind(0x74, true,toggle)
setInterval(()=>{
    if(isDead){
        if(sec != 0)sec--;
        else{
            mp.events.callRemote("DEAT::TIME_END");
            closemenuv('DEAD::MENU');
        }
        player.taskPlayAnim("combat@death@from_writhe","death_b",100, 10000, 10000, 2, 10000, true, true, true);
    }
    if(regen){
        if(player.getHealth() < 80) player.setHealth(99+player.getHealth()+3);
        else {
            mp.events.callRemote("EMS::REGEN");
            regen = false;
            alert('Вас вылечили вы можете выйти из больницы')
        }
    }
},1000)