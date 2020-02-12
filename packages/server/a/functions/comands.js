let striptags = require('striptags');
let commands = {};
let command_add = (call,func)=>{
	commands[call.toLowerCase()] = func;
}
mp.events.addCommand = (call,func)=>{
	if(typeof call == "string"){
		command_add(call.toLowerCase(),func)
	}else{	
		let keys = Object.keys(call)
		for(let i =0;i< keys.length;i++){
			command_add(keys[i].toLowerCase(),call[keys[i]])
		}
	}
}
mp.events.add("playerCommand", (player, command) => {
	if(!player.loggined)return player.notify('Вы не вошли в игру')
	command = striptags(command)
	const args = command.split(/[ ]+/);
	const commandName = args.splice(0, 1)[0].toLowerCase();
	if(commands[commandName]){
		if(!player.permision['COMMAND::IHNOR_SPAM']){
			if(player.lastСommandArgs === args) return player.alert('Не спамьте',1);
			if(player.lastCommandTime &&  Date.now() - player.lastCommandTime <= 1500) return player.alert('Не флудите',1);
			player.last_command_time = Date.now();
			player.last_command_args = args;
		}
		try{
			commands[commandName](player,args.join(' '),...args);
		}catch(e){
			player.alert('Произошла ошибка, админы в скором времени её исправят',1,5000)
			console.error(e)
		}
	}else player.alert('Команда не найдена',1)
});
mp.events.callCommand = (command,...args)=>{
	try{
		commands[command](...args);
	}catch(e){
		player.alert('Произошла ошибка, админы в скором времени её исправят',1,5000)
		console.error(e)
	}
}
mp.events.addCommand('commands',(player)=>{
	let comms = Object.keys(commands);
	player.outputChatBox(`Команд: ${comms.length}<br /> ${comms.join(', ')}`)
})