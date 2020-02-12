mp.events.add("add_voice_listener", (player, target) =>{
	if(target){
		player.enableVoiceTo(target);
	}
});

mp.events.add("remove_voice_listener", (player, target) =>{
	if(target){
		if(player.caller != target)player.disableVoiceTo(target);
	}
});
