
let addEventMp = mp.events.add;
mp.events.adds = (call,func)=>{
	if(typeof call == "string"){
		try{
			let functionTry = (...args)=>{
				try{
					func(...args);
				}catch(e){
					console.error(e)
				}
			}
			addEventMp(call,functionTry)
		}catch(e){
			console.error(e);
		}
	}else{	
		let keys = Object.keys(call)
		for(let i =0;i< keys.length;i++){
			try{

				let functionTry = (...args)=>{
					try{
						call[keys[i]](...args);
					}catch(e){
						console.error(e)
					}
				}
				addEventMp(keys[i],functionTry)
			}catch(e){
				console.error(e);
			}
		}
	}
}
let events = {};
let event_add = (call,func)=>{
	if(events[call])return console.error(`${call} уже существует`)
	events[call] = true;
	mp.events.add(call,(player,...args)=>{
		if(!player.permision['EVENTS::IHNOR_SPAM']){
			if(player.last_event &&  new Date().getTime() - player.last_event <= 300) return player.alert('Не флудите',1)
			player.last_event = new Date().getTime();
		}
		try{
			func(player,...args);
		}catch(e){
			player.alert('Произошла ошибка, админы в скором времени её исправят',1,5000);
			console.error(e)
		}
	})
}
mp.events.push = (call,func)=>{
	if(typeof call == "string"){
		event_add(call,func)
	}else{	
		let keys = Object.keys(call)
		for(let i =0;i< keys.length;i++){
			event_add(keys[i],call[keys[i]])
		}
	}
}
