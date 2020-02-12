const radius = 15;
mp.events.addCommand('me', (player, message) => {
	if(player.testMute())return player.alert(`Вы замучены`,1);
	if (!message || !(message.trim().length > 0)) return player.alert(`Вы ничего не написали`,1);
	player.broadcastInRange(radius, `<span style='color:#ab73e0'>${player.nameChatTag}: ${message}</span> `,'#ab73e0',message);
});

mp.events.addCommand('do', (player, message) => {
	if(player.testMute())return player.alert(`Вы замучены`,1);
	if (!message || !(message.trim().length > 0)) return player.alert(`Вы ничего не написали`,1);
	player.broadcastInRange(radius,`<span style='color:#90c0cf'>${message}: ${player.nameChatTag}</span>`,'#90c0cf',`${message}.`);
});
mp.events.addCommand('todo', (player, message) => {
	if(player.testMute())return player.alert(`Вы замучены`,1);
	if (!message || !(message.trim().length > 0)) return player.alert(`Вы ничего не написали`,1);
	let todo = message.split('*');
	if(todo.length == 1) return player.alert(`Вы неправильно написали /todo</b> Пример /todo Слова*действие`);
	player.broadcastInRange(radius,`${player.nameChatTag}:<span style='color:#ab73e0'> <span style='color:#fff'>${todo[0]}</span>*${todo[1]}</span>`,'#fff',`${todo[0]}*${todo[1]}`);
});
mp.events.addCommand('try', (player, message) => {
	if(player.testMute())return player.alert(`Вы замучены`,1);
	if (!message || !(message.trim().length > 0)) return player.alert(`Вы ничего не написали`,1);
	let is  = Math.random();
	let tr = `<span style='color:red'>Неудачно</span>`;
	if(is>0.5) tr = `<span style='color:green'>Удачно</span>`;
	player.broadcastInRange(radius,`<span style='color:#ab73e0'>${player.name}: ${message} | ${tr}</span>`,'#fff',`~p~${message} ~w~| ${is>0.5?'~g~Удачно':'~r~Неудачно'}`);
});

mp.events.addCommand('b', (player, message) => {
	if(player.testMute())return player.alert(`Вы замучены`,1);
	if (!message || !(message.trim().length > 0)) return player.alert(`Вы ничего не написали`,1);
	player.broadcastInRange(radius,`(( ${player.nameChatTag}:<span style='color:#fff'> ${message} </span> ))`,'#fff',`(( ${message} ))`);
});
//прошепать 
mp.events.addCommand('w', (player, message) => {
	if(player.testMute())return player.alert(`Вы замучены`,1);
	if (!message || !(message.trim().length > 0)) return player.alert(`Вы ничего не написали`,1);
	player.broadcastInRange(radius/1.5,`${player.nameChatTag}<span style='color:#e4e4e4'> Прошептал: ${message} </span>`,'#e4e4e4',` ${message}`);
});
//крикнуть
mp.events.addCommand('s', (player, message) => {
	if(player.testMute())return player.alert(`Вы замучены`,1);
	if (!message || !(message.trim().length > 0)) return player.alert(`Вы ничего не написали`,1);
	player.broadcastInRange(radius*2,`${player.nameChatTag}<span style='color:#fff'> Крикнул: ${message} </span>`,'#fff',` ${message}`);
});
