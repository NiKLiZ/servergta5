mp.events.add("rightClickSlot", function (id) {
	let item = player.items[id];
	if(item.id == null || item.id == undefined) return browser.execute(`$(".interactive_slot").hide();`);
	if( id >= 30 ){
			if(item.id === undefined) 
				return browser.execute(`$(".interactive_slot").hide();`);
			if( item.count > 1 ) 
				return browser.execute(`$(".interactive_slotFunctions").hide(); $("#splitItem").show(); $("#useItem").hide();`);
		browser.execute(`$(".interactive_slot").hide();`);
		return;
	} 
	let weaponrRcharge = ``;
	if(item.id == 19){
		for(let i = 0; i < 30; i++){
			if(player.items[i].id  && infoitems[player.items[i].id].type == "weapon" && player.items[i].id != 7){
				weaponrRcharge += `$(".interactive_slot .interactiveFuncs").append('<div class="function rcharge" data-weapon-slot="${i}">Зарядить ${infoitems[player.items[i].id].name}</div>');`
			}
		}
	}
	if(item.id)
	browser.execute(`
		$(".interactive_slot").show();
		$("#useItem").html("${ item.id == 61 ? 'Скрутить косяк' : 'Использовать' } ");
		$("#useItem").show();
		$("#dropItem").show();
		$("#splitItem").hide();
		$("#showItem").hide();
		$("#watchItem").hide();
		$(".interactive_slot .rcharge").remove();
		${weaponrRcharge}
		$(".interactive_slot .rcharge").show();
		`);
	// if( infoitems[item.id].isUse && !infoitems[item.id].canShow && !infoitems[item.id].isActivate ) browser.execute(`$("#useItem").hide();`)

	if( infoitems[item.id].isShow ) browser.execute(`$("#showItem").show();`);
	// if( infoitems[item.id].canWatch ) browser.execute(`$("#watchItem").show();`);

	if(item && item.isActivate ){
		if( item.isactive ) browser.execute(`$("#useItem").html("Деактивировать");`)
			else browser.execute(`$("#useItem").html("Активировать");`);
		if( infoitems[item.id].type == "clothes" ){
			if( item.isactive ) browser.execute(`$("#useItem").html("Снять");`)
			else{
				browser.execute(`$("#useItem").html("Надеть");`);
				if(item.id == 4) browser.execute(`$("#useItem").html("Обуть");`);
			} 
		}
	}
	// if(infoitems[item.id].id == 18) browser.execute(`$("#useItem").html("Отметить адрес");`);
	// if(infoitems[item.id].id == 15) browser.execute(`$("#useItem").html("Отметить машину");`);
	
	// if( infoitems[item.id].count > 1 ) browser.execute(`$("#splitItem").show(); $("#useItem").hide();`);
	// if( infoitems[item.id].type == "food" ) browser.execute(`$("#useItem").show();`);

});

mp.events.add("dropItem", function (id) {
	let item = player.items[id];
	if(!infoitems[item.id].id) return;
	mp.events.callRemote('dropItem',id);
})
mp.events.add("rchargeItem",(id,rchargeId)=>{
	mp.events.callRemote('rchargeItem',id,rchargeId);
	browser.execute(`$(".interactive_slot").hide();`);
})
mp.events.add("useItem", function (id) {
	
	let item = player.items[id];
	if(!infoitems[item.id].id) return;

	browser.execute(`$(".interactive_slot").hide();`);

	if( infoitems[item.id].isUse ) return mp.events.callRemote("useItem", id);
	
	if( infoitems[item.id].isActivate ){

		mp.events.callRemote("activateItem", id);
	}

	// let w = playerWeight(player);
	// w = 100/player.maxWeight*w;
	// browser.execute(` $('.playerWeight').children('.weightHover').css('width', '${w}%') `);
	// w = w.toFixed(1);
	// browser.execute(` $('.playerWeight').children('.weightPercent').text('${w}%') `);

});