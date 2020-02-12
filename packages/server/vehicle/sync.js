mp.events.push({
	"setIndicatorLights_one": (player, state) => {
		if(!player.vehicle) return;
		player.vehicle.data.IndicatorLights_one = state;
	},
	"setIndicatorLights_two": (player, state) => {
		if(!player.vehicle) return;
		player.vehicle.data.IndicatorLights_two = state;
	},
	"setIndicatorLightsAll": (player, state) => {
		if(!player.vehicle) return;
		player.vehicle.data.IndicatorLights_one = state;
		player.vehicle.data.IndicatorLights_two = state;
	},
	"setSirenSound": (player, state) => {
		if(!player.vehicle) return;
		player.vehicle.data.SirenSound = state;
	},
	"radiochange": (player, state) => {
		if(!player.vehicle) return;
		player.vehicle.data.radio = state;
	},

})

mp.events.add({
	"waypoint": (player, way) => {
		if(!player.vehicle) return;
		if(way){
			way = JSON.parse(way);
			player.vehicle.getPlayers().forEach((pl)=>{
				pl.setNewWaypoint(way)
			})
		}
	},
	'NITRO_START': (player) => {
		if (player.vehicle)
		player.vehicle.setVariable('nitro',true)
	},
	'NITRO_STOP': (player) => {
		if (player.vehicle)
		player.vehicle.setVariable('nitro',false)
	}
});

mp.events.addCommand('rtune', (player, text) => {
	player.call("VEHICLE::RESET_TUNE");
	player.alert('Тюнинг перезагружен')
})
