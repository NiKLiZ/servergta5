let menuv = {};
mp.calbackmenuv = function(name,calback){
	if(typeof name == "string"){
		menuv[name] = {calback: calback};
	}else{	
		let keys = Object.keys(name)
		for(let i =0;i< keys.length;i++){
			menuv[keys[i]] = {calback: name[keys[i]]};
		}
	}
}


mp.events.push('menuvcalback', (player,cal,array) => {
	let menu = menuv[cal];
	if(menu!=undefined){
		array = JSON.parse(array);
		try{
			menu.calback(player,array);
		}catch(e){
			player.alert('Произошла ошибка, админы в скором времени её исправят',1,5000)
			console.error(e)
		}
	}
});