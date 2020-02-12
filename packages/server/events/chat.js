let striptags = require('striptags');
mp.events.add('playerChat', (player, message) => {
	if(player.mute)return player.alert(`Вы замучены`,1);
	if(!message.trim().length) return player.alert('Вы ничего не написали')
	message = striptags(message);
	player.broadcastInRange(60,`${player.nameChatTag} говорит: ${message}`,'#ffffff',message);
});
