let ch = {};
let show = false;

let {browserFractions} = require('./browser');
mp.events.add({
	"FRACTION::SET":(fraction,rang,underRang,infoRangs)=>{
		if(player.fraction != fraction){
			if(fraction == 'CH'){
                browserFractions.execute(`ch_menu.rangs = ${infoRangs}`)
                let mar = {
                    type: 1,
                    color:  [0,0,255,60],
                    position:  new mp.Vector3(-551.8147583007812,-207.9415283203125,-195.13),
                    scale: 1.5
                }
                ch.arms = createMarker(mar,(m)=>{
                    mp.events.callRemote('CH::ARMS');
                });
                mar.position = new mp.Vector3(-555.8403930664062,-207.79571533203125,-195.13), 
                ch.locker = createMarker(mar,(m)=>{
                    mp.events.callRemote('CH::LOCKER');
                });
            }  
			else{
				if(player.fraction == 'CH'){
					ch.arms.marker.del();
					ch.locker.marker.del();
				}
			}
		}
    },
    "CH::CLOSE":()=>{
		if (show) {
			toggle();
		}
	},
})
let toggle = function() {
	if(!isGUIOpen() && !show) return;
	if(player.fraction === 'CH'){
		show = !show;
		guitoggle(show)
		if(show){
            mp.events.callRemote("CH::MENU")
            browserFractions.execute(`ch_menu.show = true;`);
		}else{
			browserFractions.execute(`ch_menu.show = false;`);
		}
	}
}
mp.keys.bind(0x74, true,toggle)