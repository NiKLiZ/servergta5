mp.events.add('ShowPlayersList',(player,fn)=>{
	if(!player.loggined)return;
	let ret = [];
	mp.players.forEach((pl)=>{
		try{
			if(pl.loggined){

				let info = {
					id: pl.id,
					name: pl.name,
				}
				if(player.permision['PLAYER_LIST::SHOW_FRACTION']){
					info.fractions =  pl.fraction ? pl.fraction.name : 'Нет';
				}
				info.ping = pl.ping;
				ret.push(info)
			}
		}catch(e){
			console.error(e)
		}
	})
	player.call('LIST_PLAYERS::LOAD',[JSON.stringify(ret)]);
})