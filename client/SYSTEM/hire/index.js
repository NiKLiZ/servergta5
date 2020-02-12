let markers = require('../../../packages/configs/hire.json').hires;
const educationTasksList = require('../../UI/education/index');
let msTimeHire = 10*60;
let waitTime = msTimeHire;
markers.forEach((hire,i)=>{
  let hireColshape = {
		position: hire.pos,
		scale: 2
	}
	mp.blips.new(255, hire.pos,{
		name: 'Прокат транспорта',
		color: 4,
		shortRange: true,
	});

	let vehs = hire.vehs;
	mp.peds.new(mp.game.joaat(hire.npc.model), hire.npc.pos, hire.npc.heading);
	let menu = {
		name: 'Аренда',
		items: vehs.map((veh,idVeh)=>{
			return {
				type: 1,
				name: 'Арендовать '+veh.model,
				placeholder: `Арендовать за ${veh.price}$`,
				callback: 'HIRE::RENT',
				callpointenct: [idVeh,i]
			}
		}) 
	}
	createColshapeRadius(hireColshape,(m)=>{
		menu.exit_cols = m;
		createmenuv(menu);
  	})
});

mp.events.add({
	"HIRE::SET":(veh)=>{
		if(veh){
			waitTime = msTimeHire;
			player.hire = veh;
		}else{
			player.hire = false;
		}

		if (educationTasksList.getTask('rentCar')) {
			educationTasksList.setTask('rentCar');
		}

	},
	'render': async () => {
		try{
			let hire = player.hire;
			if(!hire) return;
			if(waitTime > 0){
				let h = waitTime/3600 ^ 0;
				let m = (waitTime-h*3600)/60 ^ 0;
				let s = waitTime-h*3600-m*60 ;
				mp.game.graphics.drawText(`До конца аренды: ~o~${m}:${s}~w~`, [0.5, 0.95], {
					font: 0,
					color: [255, 255, 255, 255],
					scale: [0.6, 0.6],
					outline: true
				});
			}
			let pos =  hire.position;
			let dist = mp.Vector3.Distance(player.position, pos);
			if(dist <= 100 && hire != player.vehicle){
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
		}catch(e){chat(e)}
	  },
})

setInterval(function() {
	let hire = player.hire;
	let veh = player.vehicle;
	if (hire && hire !== veh && waitTime === 0) {
		waitTime = msTimeHire;
	}
	if (hire === veh && waitTime !== 0) {
		waitTime = 0;
	}
	if (hire && waitTime > 0) {
		if (waitTime <= 10 && waitTime !== 0) mp.game.audio.playSoundFrontend(-1, "TIMER", "HUD_FRONTEND_DEFAULT_SOUNDSET", false);
		waitTime--;
		let h = waitTime/3600 ^ 0;
		let m = (waitTime-h*3600)/60 ^ 0;
		let s = waitTime-h*3600-m*60 ;
		if((m % 2) === 0 && s == 0){
			alert(`Ваша аренда закончится через ${m}:${s}`)
		}
	}
	if ( hire&& hire !== veh && waitTime === 0) {
		mp.events.callRemote('HIRE::STOP')
	}
}, 1000);
