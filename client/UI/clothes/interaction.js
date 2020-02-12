require('./clothes_shop.js'); 

mp.game.object.doorControl(868499217, 82.38156 ,-1392.752 ,29.52609, false, 0.0, 50.0, 0); 
mp.game.object.doorControl(3146141106, 82.38156,-1390.476,29.52609, false, 0.0, 50.0, 0); 

mp.game.object.doorControl(868499217, -818.7643, -1079.545, 11.47806, false, 0.0, 50.0, 0); 
mp.game.object.doorControl(3146141106, -816.7932, -1078.406, 11.47806, false, 0.0, 50.0, 0); 	

mp.game.object.doorControl(1780022985, -1201.435, -776.8566, 17.99184, false, 0.0, 50.0, 0); 
mp.game.object.doorControl(0xf0389168, -592.48999, -926.809998, 29.1000004, false, 0.0, 0.0, 0.0);

mp.game.object.doorControl(mp.game.joaat('v_ilev_ch_glassdoor'), -156.439, -304.4294,39.99308, false, 0.0, 50.0, 0); 
mp.game.object.doorControl(mp.game.joaat('v_ilev_ch_glassdoor'), -157.1293, -306.4341, 39.99308, false, 0.0, 0.0, 0.0); 
let tops_var = -1;
let tops_color = -1;
let tops_down = -1;
let tops_down_color = -1;
let legs_variation = -1;
let legs_color = -1;
let foot_variation = -1;
let foot_color = -1;
let glove_variation = -1;
let glove_color = -1;
let gloves_type = -1;
let hats_variation = -1;
let hats_color = -1;
let glasses_variation = -1;
let glasses_color = -1;
let ears_variation = -1;
let ears_color = -1;
let masks_variation = -1;
let masks_color = -1;
let accessories_variation = -1;
let accessories_color = -1;
let	watches_variation = -1;
let	watches_color = -1;
let	bracelets_variation = -1;
let	bracelets_color = -1;
let bags_variation = -1;
let bags_color = -1;
let curent_clothes = null;
let shopsClothes = require('../../../packages/configs/shopsClothes').shops;
exports.clothes = shopsClothes;
for(let i=0;i<shopsClothes.length;i++){
	let shop = shopsClothes[i];
	let marker_shop = {
		type: 1,
		color:  [0,255,0,60],
		position: shop.position,
		scale: 1.5
	}
	mp.blips.new(73, shop.position,{
		name: 'Магазин одежды',
		color: 0,
		dimension: 0,
		shortRange: true,
		alpha: 255
	})
	createMarker(marker_shop,()=>{
		player.setRotation(0, 0, shop.heading, 0, true);
		player.position = shop.posbuy;
		mp.events.call('startclothes');
	})
}
mp.events.add({
	"startclothes":()=>{
		player.taskStartScenarioInPlace("WORLD_HUMAN_GUARD_STAND", 0, true);
		let gender = mp.game.joaat("MP_M_Freemode_01") === player.model ? 0 : 1;
		let tops = {
			name: 'Верхняя одежда',
			items: [
				{
					type: 3,
					name: 'Верхняя одежда',
					callpointenct: 'tops_variation',
					max: clothes_shop.tors[gender].length-1
				},
				{
					type: 3,
					name: 'Цвет одежды',
					callpointenct: 'tops_color',
					max:  2//clothes_shop.tors[gender][0].Colors.length -1
				},
				{
					type: 3,
					name: 'Нижняя одежда',
					callpointenct: 'tops_down',
					max: clothes_shop.additionally[gender].length -1
				},
				{
					type: 3,
					name: 'Цвет одежды',
					callpointenct: 'tops_down_color',
					max:  clothes_shop.additionally[gender][0].Colors.length-1
				},
				{
					type: 0,
					name: 'Купить',
					callback: 'buy_top',
				},
			]
		}
		 if(player.permision['ADMIN::MENU'])
			tops.items.push({
					type: 0,
					name: 'Удалить одежду',
					callback: 'remove_top',
				},
				{
					type: 0,
					name: 'Удалить выбранный цвет одежды',
					callback: 'remove_top_color',
				},
				{
					type: 0,
					name: 'Удалить c выбранного цвета до конца',
					callback: 'remove_top_colors',
				},
				{
						type: 5,
						name: 'Цена',
						placeholder: '',
						type_input: 'number'
				},
				{
					type: 0,
					name: 'Изменить цену',
					callback: 'editprice_top',
				},
				)
		let legs = get_menu_clothes('Штаны','Штаны','legs');
		legs.backmenu_callback = 'camera_clothes_disable';
		let foot = get_menu_clothes('Обувь','Обувь','foot');
		foot.backmenu_callback = 'camera_clothes_disable';
		let gloves = {
			name: 'Перчатки',
			items: [
				{
					type: 3,
					name: 'Перчатка',
					callpointenct: 'glove_variation',
					//Очень важно для перчаток удаляя 0 id
					max: clothes_shop.gloves[gender].length-2
				},
				{
					type: 3,
					name: 'Цвет',
					callpointenct: 'glove_color',
					max: clothes_shop.gloves[gender][0].Colors.length-1 
				},
				{
					type: 0,
					name: 'Купить',
					callback: 'buy_glove',
				}
			]
		}
		let hats = get_menu_clothes('Головные уборы','Головные убор','hats');
		let glasses = get_menu_clothes('Очки','Очки','glasses');
		let ears = get_menu_clothes('Серьги','Серьга','ears');
		let additionally = get_menu_clothes('additionally','additionally','additionally');
		let masks = get_menu_clothes('Маски','Маска','masks');
		let accessories = get_menu_clothes('Аксессуары','Аксессуар','accessories');
		let watches = get_menu_clothes('Часы','Часы','watches');
		let bracelets = get_menu_clothes('Браслеты','Браслет','bracelets');
		let bags = get_menu_clothes('Сумки','Сумка','bags');
		let clothes = {
			name: 'Магазин одежды',
			exitmenu_callback: 'clearshop_clothes',
			items: [
				{
					type: 2,
					name: 'Верхняя одежда',
					infomenu: tops,
					callback: 'clothes_one',
					callpointenct: '0',
					cswitch: 'tops_variation'
				},
				{
					type: 2,
					name: 'Штаны',
					infomenu: legs,
					callback: 'camera_legs_enable',
					callpointenct: '0',
					cswitch: 'legs_variation'
				},
				{
					type: 2,
					name: 'Обувь',
					infomenu: foot,
					callback: 'camera_foot_enable',
					cswitch: 'foot_variation',
					callpointenct: '0',
				},
				{
					type: 2,
					name: 'Перчатки',
					callpointenct: '0',
					infomenu: gloves,
					cswitch: 'glove_variation'
				},
				{
					type: 2,
					name: 'Головные уборы',
					callpointenct: '0',
					infomenu: hats,
					cswitch: 'hats_variation'
				},
				{
					type: 2,
					name: 'Очки',
					infomenu: glasses,
					callpointenct: '0',
					cswitch: 'glasses_variation'
				},
				{
					type: 2,
					name: 'Серьги',
					infomenu: ears,
					callpointenct: '0',
					cswitch: 'ears_variation'
				},
				{
					type: 2,
					name: 'Маски',
					infomenu: masks,
					callpointenct: '0',
					cswitch: 'masks_variation'
				},
				{
					type: 2,
					name: 'Аксессуары',
					infomenu: accessories,
					callpointenct: '0',
					cswitch: 'masks_variation'
				},
				{
					type: 2,
					name: 'Часы',
					infomenu: watches,
					callpointenct: '0',
					cswitch: 'watches_variation'
				},
				{
					type: 2,
					name: 'Браслеты',
					infomenu: bracelets,
					callpointenct: '0',
					cswitch: 'bracelets_variation'
				},
				{
					type: 2,
					name: 'Сумки',
					infomenu: bags,
					callpointenct: '0',
					cswitch: 'bags_variation'
				},
			]
		}
		 if(player.permision['ADMIN::MENU']) clothes.items.push({
			type: 2,
			name: 'additionally',
			infomenu: additionally,
			callpointenct: '0',
			cswitch: 'additionally_variation'
		})
		curent_clothes = getClothes();
		clearClothes();
		createmenuv(clothes);
		setclothesvar(0);
		guitoggle(true,true);
		alert(`Что-бы выйти из меню нажмите Backspace`)
		cursor(false);
		mp.events.callRemote("PLAYER::CHANGE_MY_DIMENSION",true)
	},
	"clearshop_clothes":()=>{
		player.clearTasksImmediately();
		guitoggle(false);
		setClothes(curent_clothes);
		mp.events.call('cameradefault');
		mp.events.callRemote("PLAYER::CHANGE_MY_DIMENSION",false)
	},
	"camera_clothes_disable":()=>{
		mp.events.call('cameradefault');
	},
	"CLOTHES::UPDATE_CURENT_CLOTHES":(vari,draweble,color)=>{
		curent_clothes[vari] = {draweble,color};
	},
	"CLOTHES::UPDATE_CURENT_TOP":(drawebleTop,colorTop,drawebleDown,colorDown,drawebleGlove,drawebleColor)=>{
		curent_clothes[11] = {draweble:drawebleTop,color:colorTop};
		curent_clothes[8] = {draweble:drawebleDown,color:colorDown};
		curent_clothes[3] = {draweble:drawebleGlove,color:drawebleColor};
	}
});
callback('camera_foot_enable',()=>{
	let pos = player.getOffsetFromInWorldCoords(0, 1.3, -0.5);
	mp.events.call("setCameraPosition",pos.x,pos.y,pos.z,0,0,0,90,1300);
	cam.pointAtCoord(player.position.x, player.position.y, player.position.z-0.5);
})
callback('camera_legs_enable',()=>{
	let pos = player.getOffsetFromInWorldCoords(0, 1.3, -0.3);
	mp.events.call("setCameraPosition",pos.x,pos.y,pos.z,0,0,0,90,1300);
	cam.pointAtCoord(player.position.x, player.position.y, player.position.z-0.3);
})
global.clearClothes = ()=>{
	let gender = mp.game.joaat("MP_M_Freemode_01") === player.model ? 0 : 1;
	let clot = clothes_shop.clearclothes[gender]
  player.setComponentVariation(1, -1, 0, 0);
  player.setComponentVariation(3, clot[3], 0, 0);
  player.setComponentVariation(4, clot[4], 0, 0);
  player.setComponentVariation(5, clot[5], 0, 0);
  player.setComponentVariation(6, clot[6], 0, 0);
  player.setComponentVariation(7, clot[7], 0, 0);
  player.setComponentVariation(8, clot[8], 0, 0);
  player.setComponentVariation(9, clot[9], 0, 0);
  player.setComponentVariation(10,clot[10], 0, 0);
  player.setComponentVariation(11,clot[11], 0, 0);

	player.clearAllProps();
}
global.setClothes = (clot)=>{
	for(let i=0;i<=11;i++){
    player.setComponentVariation(i, clot[i].draweble, clot[i].color, 0);
	}
	for(let i=12;i<=14;i++){
		if( clot[i].draweble != -1)player.setPropIndex(i-12, clot[i].draweble == -1 ? 0 : clot[i].draweble , clot[i].color == -1 ? 0 : clot[i].color, true);
		else player.clearProp(i-12);
	}
}
mswith('tops_variation',(i)=>{
	let gender = mp.game.joaat("MP_M_Freemode_01") === player.model ? 0 : 1;
	let variabel = clothes_shop.tors[gender][i];
	editmaxMenuv(1,variabel.Colors.length-1)
	player.setComponentVariation(11,variabel.Variation,variabel.Colors[0],0);
	let gloves = clothes_shop.gloves[gender][0].Variations[variabel.gloves];
	player.setComponentVariation(3,gloves,0,0); 
	tops_var = i;
	tops_color = 0;
	tops_down = 0;
	tops_down_color = 0;
	gloves_type = variabel.gloves;
	if(variabel.first){
		showitemsMenuv(2);
		showitemsMenuv(3);
		let additionally = clothes_shop.additionally[gender].filter((item)=>{
			if(variabel.type === item.type) return true;
		})
		editmaxMenuv(2,additionally.length -1)
		editmaxMenuv(3,additionally[0].Colors.length-1)
		player.setComponentVariation(8,additionally[0].Variation,0,0);
		editPlaceholderMenuv(4,'Цена за одежду '+(variabel.price+additionally[0].price))
		editPlaceholderMenuv(2,'')
	}else{
		hideitemsMenuv(2);
		hideitemsMenuv(3);
		player.setComponentVariation(8,gender == 0  ? 15 : 14,0,0);
		editPlaceholderMenuv(4,'')
		editPlaceholderMenuv(2,'Цена за одежду '+variabel.price)
	}

})
mswith('tops_color',(i)=>{
	let gender = mp.game.joaat("MP_M_Freemode_01") === player.model ? 0 : 1;
	let vari = clothes_shop.tors[gender][tops_var];
	player.setComponentVariation(11,vari.Variation,vari.Colors[i],0);
	tops_color = i;
})
mswith('tops_down',(i)=>{
	let gender = mp.game.joaat("MP_M_Freemode_01") === player.model ? 0 : 1;
	let tors = clothes_shop.tors[gender][tops_var];
	let additionally = clothes_shop.additionally[gender].filter((item)=>{
		if(tors.type == item.type) return true;
	})
	let vari = additionally[i];
	let variabel = clothes_shop.tors[gender][tops_var];
	player.setComponentVariation(8,vari.Variation,vari.Colors[0],0);
	editmaxMenuv(3,vari.Colors.length-1)
	editPlaceholderMenuv(4,'Цена за одежду '+(variabel.price+vari.price))
	tops_down = i;
	tops_down_color = 0;
})
mswith('tops_down_color',(i)=>{
	let gender = mp.game.joaat("MP_M_Freemode_01") === player.model ? 0 : 1;
	let tors = clothes_shop.tors[gender][tops_var];
	let additionally = clothes_shop.additionally[gender].filter((item)=>{
		if(tors.type == item.type) return true;
	})
	let vari = additionally[tops_down];
	player.setComponentVariation(8,vari.Variation,vari.Colors[i],0);
	tops_down_color = i;
});
mswith('legs_variation',(i)=>{
	let gender = mp.game.joaat("MP_M_Freemode_01") === player.model ? 0 : 1;
	let vari = clothes_shop.legs[gender][i];
	player.setComponentVariation(4,vari.Variation,vari.Colors[0],0);
	editmaxMenuv(1,vari.Colors.length-1)
	editPlaceholderMenuv(2,'Цена за одежду '+vari.price)
	legs_variation = i;
	legs_color = 0;
})
mswith('legs_color',(i)=>{
	let gender = mp.game.joaat("MP_M_Freemode_01") === player.model ? 0 : 1;
	let vari = clothes_shop.legs[gender][legs_variation];
	player.setComponentVariation(4,vari.Variation,vari.Colors[i],0);
	legs_color = i;
})
mswith('foot_variation',(i)=>{
	let gender = mp.game.joaat("MP_M_Freemode_01") === player.model ? 0 : 1;
	let vari = clothes_shop.foot[gender][i];
	player.setComponentVariation(6,vari.Variation,vari.Colors[0],0);
	editmaxMenuv(1,vari.Colors.length-1)
	editPlaceholderMenuv(2,'Цена за одежду '+vari.price)
	foot_variation = i;
	foot_color = 0;
})
mswith('foot_color',(i)=>{
	let gender = mp.game.joaat("MP_M_Freemode_01") === player.model ? 0 : 1;
	let vari = clothes_shop.foot[gender][foot_variation];
	player.setComponentVariation(6,vari.Variation,vari.Colors[i],0);
	foot_color = i;
})
mswith('glove_variation',(i)=>{
	let gender = mp.game.joaat("MP_M_Freemode_01") === player.model ? 0 : 1;
	//Очень важно для перчаток удаляя 0 id
	i++;
	let vari = clothes_shop.gloves[gender][i];
	player.setComponentVariation(3,vari.Variations[gloves_type],vari.Colors[0],0);
	editmaxMenuv(1,vari.Colors.length-1)
	editPlaceholderMenuv(2,'Цена за одежду '+vari.price)
	glove_variation = i;
	glove_color = 0;
})
mswith('glove_color',(i)=>{
	let gender = mp.game.joaat("MP_M_Freemode_01") === player.model ? 0 : 1;
	let vari = clothes_shop.gloves[gender][glove_variation];
	player.setComponentVariation(3,vari.Variations[gloves_type],vari.Colors[i],0);
	glove_color = i;
})
mswith('hats_variation',(i)=>{
	let gender = mp.game.joaat("MP_M_Freemode_01") === player.model ? 0 : 1;
	let vari = clothes_shop.hats[gender][i];
	player.setPropIndex(0,vari.Variation,vari.Colors[0],true);
	editmaxMenuv(1,vari.Colors.length-1)
	editPlaceholderMenuv(2,'Цена за одежду '+vari.price)
	hats_variation = i;
	hats_color = 0;
})
mswith('hats_color',(i)=>{
	let gender = mp.game.joaat("MP_M_Freemode_01") === player.model ? 0 : 1;
	let vari = clothes_shop.hats[gender][hats_variation];
	player.setPropIndex(0,vari.Variation,vari.Colors[i],true);
	hats_color = i;
})
mswith('glasses_variation',(i)=>{
	let gender = mp.game.joaat("MP_M_Freemode_01") === player.model ? 0 : 1;
	let vari = clothes_shop.glasses[gender][i];
	player.setPropIndex(1,vari.Variation,vari.Colors[0],true);
	editmaxMenuv(1,vari.Colors.length-1)
	editPlaceholderMenuv(2,'Цена за одежду '+vari.price)
	glasses_variation = i;
	glasses_color = 0;
})
mswith('glasses_color',(i)=>{
	let gender = mp.game.joaat("MP_M_Freemode_01") === player.model ? 0 : 1;
	let vari = clothes_shop.glasses[gender][glasses_variation];
	player.setPropIndex(1,vari.Variation,vari.Colors[i],true);
	glasses_color = i;
})
mswith('ears_variation',(i)=>{
	let gender = mp.game.joaat("MP_M_Freemode_01") === player.model ? 0 : 1;
	let vari = clothes_shop.ears[gender][i];
	player.setPropIndex(2,vari.Variation,vari.Colors[0],true);
	editmaxMenuv(1,vari.Colors.length-1)
	editPlaceholderMenuv(2,'Цена за одежду '+vari.price)
	ears_variation = i;
	ears_color = 0;
})
mswith('ears_color',(i)=>{
	let gender = mp.game.joaat("MP_M_Freemode_01") === player.model ? 0 : 1;
	let vari = clothes_shop.ears[gender][ears_variation];
	player.setPropIndex(2,vari.Variation,vari.Colors[i],true);
	ears_color = i;
})
let additionally = 0;
mswith('additionally_variation',(i)=>{
	let gender = mp.game.joaat("MP_M_Freemode_01") === player.model ? 0 : 1;
	let vari = clothes_shop.additionally[gender][i];
	player.setComponentVariation(8,vari.Variation,vari.Colors[0],0);
	editmaxMenuv(1,vari.Colors.length-1)
	editPlaceholderMenuv(2,'Цена за одежду '+vari.price)
	additionally = i;
})
mswith('additionally_color',(i)=>{
	let gender = mp.game.joaat("MP_M_Freemode_01") === player.model ? 0 : 1;
	let vari = clothes_shop.additionally[gender][additionally];
	player.setComponentVariation(8,vari.Variation,vari.Colors[i],0);
})
mswith('masks_variation',(i)=>{
	let gender = mp.game.joaat("MP_M_Freemode_01") === player.model ? 0 : 1;
	let vari = clothes_shop.masks[gender][i];
	player.setComponentVariation(1,vari.Variation,vari.Colors[0],0);
	editmaxMenuv(1,vari.Colors.length-1)
	editPlaceholderMenuv(2,'Цена за одежду '+vari.price)
	masks_variation = i;
	masks_color = 0;
})
mswith('masks_color',(i)=>{
	let gender = mp.game.joaat("MP_M_Freemode_01") === player.model ? 0 : 1;
	let vari = clothes_shop.masks[gender][masks_variation];
	player.setComponentVariation(1,vari.Variation,vari.Colors[i],0);
	masks_color = i;
})
mswith('accessories_variation',(i)=>{
	let gender = mp.game.joaat("MP_M_Freemode_01") === player.model ? 0 : 1;
	let vari = clothes_shop.accessories[gender][i];
	player.setComponentVariation(7,vari.Variation,vari.Colors[0],0);
	editmaxMenuv(1,vari.Colors.length-1)
	editPlaceholderMenuv(2,'Цена за одежду '+vari.price)
	accessories_variation = i;
	accessories_color = 0;
})
mswith('accessories_color',(i)=>{
	let gender = mp.game.joaat("MP_M_Freemode_01") === player.model ? 0 : 1;
	let vari = clothes_shop.accessories[gender][accessories_variation];
	player.setComponentVariation(7,vari.Variation,vari.Colors[i],0);
	accessories_color = i;
})
mswith('watches_variation',(i)=>{
	let gender = mp.game.joaat("MP_M_Freemode_01") === player.model ? 0 : 1;
	let vari = clothes_shop.watches[gender][i];
	player.setPropIndex(6,vari.Variation,vari.Colors[0],true);
	editmaxMenuv(1,vari.Colors.length-1)
	editPlaceholderMenuv(2,'Цена за одежду '+vari.price)
	watches_variation = i;
	watches_color = 0;
})
mswith('watches_color',(i)=>{
	let gender = mp.game.joaat("MP_M_Freemode_01") === player.model ? 0 : 1;
	let vari = clothes_shop.watches[gender][watches_variation];
	player.setPropIndex(6,vari.Variation,vari.Colors[i],true);
	watches_color = i;
})
mswith('bracelets_variation',(i)=>{
	let gender = mp.game.joaat("MP_M_Freemode_01") === player.model ? 0 : 1;
	let vari = clothes_shop.bracelets[gender][i];
	player.setPropIndex(7,vari.Variation,vari.Colors[0],true);
	editmaxMenuv(1,vari.Colors.length-1)
	editPlaceholderMenuv(2,'Цена за одежду '+vari.price)
	bracelets_variation = i;
	bracelets_color = 0;
})
mswith('bracelets_color',(i)=>{
	let gender = mp.game.joaat("MP_M_Freemode_01") === player.model ? 0 : 1;
	let vari = clothes_shop.bracelets[gender][bracelets_variation];
	player.setPropIndex(7,vari.Variation,vari.Colors[i],true);
	bracelets_color = i;
})
mswith('bags_variation',(i)=>{
	let gender = mp.game.joaat("MP_M_Freemode_01") === player.model ? 0 : 1;
	let vari = clothes_shop.bags[gender][i];
	player.setComponentVariation(5,vari.Variation,vari.Colors[0],0);
	editmaxMenuv(1,vari.Colors.length-1)
	editPlaceholderMenuv(2,'Цена за одежду '+vari.price)
	bags_variation = i;
	bags_color = 0;
})
mswith('bags_color',(i)=>{
	let gender = mp.game.joaat("MP_M_Freemode_01") === player.model ? 0 : 1;
	let vari = clothes_shop.bags[gender][bags_variation];
	player.setComponentVariation(5,vari.Variation,vari.Colors[i],0);
	bags_color = i;
})
function setclothesvar(i) {
	tops_var = i;
	tops_color = i;
	tops_down = i;
	tops_down_color = i;
	legs_variation = i;
	legs_color = i;
	foot_variation = i;
	foot_color = i;
	glove_variation = i;
	glove_color = i;
	gloves_type = i;
	hats_variation = i;
	hats_color = i;
	glasses_variation = i;
	glasses_color = i;
	ears_variation = i;
	ears_color = i;
	masks_variation = i;
	masks_color = i;
	accessories_variation = i;
	accessories_color = i;
	watches_variation = i;
	watches_color = i;
	bracelets_variation = i;
	bracelets_color = i;
	bags_variation = i;
	bags_color = i;
	if(i==0) gloves_type = 10;
	if(i==-1) curent_clothes = null;
}
global.getClothes =()=>{
	let clothes = [];
	for(let i=0;i<=11;i++){
		clothes.push({draweble:player.getDrawableVariation(i),color:player.getTextureVariation(i)})
	}
	for(let i=0;i<=7;i++){
		clothes.push({draweble:player.getPropIndex(i),color:player.getPropTextureIndex(i)})
	}
	return clothes;
}
function get_menu_clothes(name,title,vari) {
	let gender = mp.game.joaat("MP_M_Freemode_01") === player.model ? 0 : 1;
	let ret = {
			name: name,
			items: [
				{
					type: 3,
					name: title,
					callpointenct: `${vari}_variation`,
					max: clothes_shop[vari][gender].length-1
				},
				{
					type: 3,
					name: 'Цвет',
					callpointenct: `${vari}_color`,
					max: clothes_shop[vari][gender][0].Colors.length-1
				},
				{
					type: 0,
					name: 'Купить',
					callback: `buy_${vari}`,
				},
				
			]
		}
		 if(player.permision['ADMIN::MENU']){
			ret.items.push({
					type: 0,
					name: 'Удалить одежду',
					callback: `remove_${vari}`,
				},
				{
					type: 0,
					name: 'Удалить выбранный цвет одежды',
					callback: `remove_${vari}_color`,
				},
				{
					type: 0,
					name: 'Удалить c выбранного цвета до конца',
					callback: `remove_${vari}_colors`,
				},
				{
						type: 5,
						name: 'Цена',
						placeholder: '',
						type_input: 'number'
				},
				{
					type: 0,
					name: 'Изменить цену',
					callback: `editprice_${vari}`,
				},
				)
		}
		return ret;
}