mp.players.atMongoId = (id)  =>{
	let pl;
	mp.players.forEach((player)=>{
		try{
			if(player._id &&  player._id.toString() === id.toString()){
				pl = player
			} 
		}catch(e){
			console.error(e)
		}
	})
	return pl;
}
mp.players.findName = (name) => {
	let pl;
	let idFind = name.match(/.*\[(.*)\]/i);
	if(idFind !== null)pl = mp.players.at(parseInt(idFind[1]));
	if(pl)return pl;
	mp.players.forEach((player)=>{
		try{
			if(player.name === name){
				pl = player;
			}
		}catch(e){
			console.error(e)
		}
	})
	return pl;
}

mp.players.findByEmail = email => {
	let player;
	mp.players.forEach(pl=> {
		try{
			if (pl.loggined && pl.mongoUser.emal === email) {
				player = p;
			}
		}catch(e){
			console.error(e)
		}
	})
	return player;
}