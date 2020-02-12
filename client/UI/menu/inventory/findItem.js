global.haveSelectedItemById = function(id){
	for(let i = 0; i < 30; i++){
		if(i == 30) return false;
		if(player.items[i].id == id && player.items[i].activated) return true;
	}
}

global.returnActivatedItem = function (itemId) {
	for(let i = 0; i < 30; i++){
		if(!mp.players.exists(player)) return 0;
		if( i == 30 ) return null;
		if(player.items[i].activated && player.items[i].id == itemId){
			return i;
		}
	}
}