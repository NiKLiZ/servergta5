mp.events.add('save_tors',(player,tops,gloves,first,colors,type = 0)=>{
	if(!player.permision['CLOTHES::ADD']) return player.alert(`У вас нет прав`,1);
	let col = [];
	for(let i =0;i<colors;i++){
		col.push(i)
	}
	let info = {
		"Variation":parseInt(tops),
		"first":parseInt(first) === 1 ? false : true,
		"gloves":parseInt(gloves),
		Colors: col,
		price: 20,
		type: parseInt(type)
	}
	mp.configs.clothes.tors[player.gender].push(info)
	mp.configs.clothes.save()
	player.alert('Верхняя одежда добавлена')
})
mp.calbackmenuv('save_tors',(player,array)=>{

});
let delclothe = (conf,call)=>{
	mp.calbackmenuv(call,(player,array)=>{
		if(!player.permision['CLOTHES::DEL']) return player.alert(`У вас нет прав`,1);
		let cloth = conf[player.gender];
		for(let i =0 ;i<cloth.length;i++ ){
			if(i == parseInt(array[0])){
				let del = cloth.splice(parseInt(array[0]),1)
				player.alert('Одежда удалена ' +del[0])
				mp.configs.clothes.save();
				console.log(del)
				return;
			}
		}
		player.alert('Одежды не существует ')
	})
}
let delclothe_color = (conf,call)=>{
	mp.calbackmenuv(call,(player,array)=>{
		if(!player.permision['CLOTHES::DEL_COLOR']) return player.alert(`У вас нет прав`,1);
		let colors = conf[player.gender][parseInt(array[0])].Colors;
		console.log(colors,array)
		for(let i =0 ;i<colors.length;i++ ){
			if(colors[i] == parseInt(array[1])){
				let del = colors.splice(parseInt(array[1]),1)
				player.alert('Цвет одежды удалён '+del.toString())
				return mp.configs.clothes.save();
			}
		}
		player.alert('Цвет одежды не существует ')
	})
}
let delclothe_colors = (conf,call)=>{
	mp.calbackmenuv(call,(player,array)=>{
	if(!player.permision['CLOTHES::DEL']) return player.alert(`У вас нет прав`,1);
		let colors = conf[player.gender][parseInt(array[0])].Colors;
		console.log(colors,array)
		for(let i =0 ;i<colors.length;i++ ){
			if(colors[i] == parseInt(array[1])){
				let del = colors.splice(parseInt(array[1]),colors.length)
				player.alert('Цвета одежды удалены '+del.toString())
				return mp.configs.clothes.save();
			}
		}
		player.alert('Цвет одежды не существует ')
	})
}
let editprice = (conf,call,id = 2)=>{
	mp.calbackmenuv(call,(player,array)=>{
		if(!player.permision['CLOTHES::EDIT_PRICE']) return player.alert(`У вас нет прав`,1);
		let cloth = conf[player.gender];
		cloth[parseInt(array[0])].price = parseInt(array[id]);
		player.alert('Цена изменена на '+parseInt(array[id]));
		mp.configs.clothes.save();
	})
}
delclothe(mp.configs.clothes.tors,'remove_top')
delclothe_color(mp.configs.clothes.tors,'remove_top_color')
delclothe_colors(mp.configs.clothes.tors,'remove_top_colors')
editprice(mp.configs.clothes.tors,'editprice_top',4)
function addedit_clothes(vari) {
 	delclothe(mp.configs.clothes[vari],'remove_'+vari)
	delclothe_color(mp.configs.clothes[vari],`remove_${vari}_color`)
	delclothe_colors(mp.configs.clothes[vari],`remove_${vari}_colors`)
	editprice(mp.configs.clothes[vari],`editprice_${vari}`)
 } 



addedit_clothes('legs')
addedit_clothes('foot')
addedit_clothes('hats')
addedit_clothes('glasses')
addedit_clothes('ears')
addedit_clothes('additionally')
addedit_clothes('masks')
addedit_clothes('accessories')
addedit_clothes('watches')
addedit_clothes('bracelets')


mp.events.add("ColorsSet", (player,name,vari,colors)=>{
	if(!player.permision['CLOTHES::COLOR_SET']) return player.alert(`У вас нет прав`,1);
	for(let i = 0;i<mp.configs.clothes[name][player.gender].length;i++){
		if(mp.configs.clothes[name][player.gender][i].Variation == vari){
			let col = [];
			for(let i =0;i<colors;i++){
				col.push(i)
			}
			console.log(i,mp.configs.clothes[name][player.gender][i],col)
			mp.configs.clothes[name][player.gender][i].Colors = col;
		}
	}

})

mp.events.add("CLOTHES:ADD", (player,vari,compo,colors,type)=>{
	if(!player.permision['CLOTHES::ADD']) return player.alert(`У вас нет прав`,1);
	let col = [];
	for(let i =0;i<colors;i++){
		col.push(i)
	}
	if(!mp.configs.clothes[compo])return
	let saveClothe = {
		Variation: vari,
		Colors: col,
		price: 20
	}
	if(type != undefined){
		saveClothe.type = type
	}
	mp.configs.clothes[compo][player.gender].push(saveClothe)
	mp.configs.clothes.save()
})