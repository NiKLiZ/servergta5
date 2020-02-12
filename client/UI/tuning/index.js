let castoms = [new mp.Vector3(-1155.724609375,-2005.92431640625,12.180256843566895),
new mp.Vector3(730.818603515625,-1088.645263671875,21.169031143188477),
new mp.Vector3(-338.80706787109375,-136.58346557617188,38.0096435546875),
new mp.Vector3(1174.8616943359375,2640.18115234375,36.75379943847656),
new mp.Vector3(110.20440673828125,6627.20654296875,30.78724479675293),
new mp.Vector3(-211.15887451171875,-1323.72119140625,29.89039421081543),];
exports.tunings = castoms;
mp.game.object.doorControl(-550347177, -356.0905, -134.7714, 40.01295, false, 0, 0, 0);
mp.game.object.doorControl(-550347177, -1145.898, -1991.144, 14.18357, false, 0, 0, 0);
mp.game.object.doorControl(270330101, 723.116, -1088.831, 23.23201, false, 0, 0, 0);
mp.game.object.doorControl(-822900180, 1174.656, 2644.159, 40.50673, false, 0, 0, 0);
mp.game.object.doorControl(-822900180, 1182.307, 2644.166, 40.50784, false, 0, 0, 0);
mp.game.object.doorControl(-822900180, 114.3135, 6623.233, 32.67305, false, 0, 0, 0);
mp.game.object.doorControl(-822900180, 108.8502, 6617.877, 32.67305, false, 0, 0, 0);
mp.game.object.doorControl(486670049, -107.5373, -9.018099, 70.67085, false, 0, 0, 0);
mp.game.object.doorControl(3472067116, 1174.654 ,2645.222, 38.63961, false, 0, 0, 0);
let { infoTuning,neonColor } = require('../../../packages/server/vehicle/tunningInfo.js');
let { browserHud } = require('../GUI/gui')
let preef_tune = [];
let menuOpen = false;
let is_castom = false;
castoms.forEach((castom)=>{
	let cols = mp.colshapes.newSphere(castom.x,castom.y,castom.z, 7);
	cols.tuning = true;
	mp.blips.new(72, castom,{
	    name: '',
	    color: 0,
	    dimension: 0,
	    shortRange: true,
	    alpha: 255
	})
})
let colorPrimary = 0;
let colorSecondary = 0;
let vehicleColorID = [
	[0,147,1,11,2,3,4,5,6,7,8,9,10,27,28,29,150,30,31,32,33,34,143,35,135,137,136,36,38,138,99,90,88,89,91,49,50,51,52,53,54,92,141,61,62,63,64,65,66,67,68,69,73,70,74,96,101,95,94,97,103,104,98,100,102,99,105,106,71,72,142,145,107,111,112], 
	[12,13,14,131,83,82,84,149,148,39,40,41,42,55,128,151,155,152,153], 
	[15,16,17,18,19,20,43,44,45,56,57,75,76,77,78,79,80,81,108,109,110,122],
	[117,118,119,158,159],
	[0,120]
];
var vehicleColorTypes = ["Металлик", "Матовый", "Металл", "Хромированный","Хром"];
var vehicleColorsClassicMetallic = ["Черный", "Карбоновый черный", "Графит", "Антрацит", "Черная сталь", "Темная сталь", "Серебро", "Синеватое серебро", "Катаная сталь",
"Темное серебро", "Серебристо-каменный", "Полуночное серебро", "Серебристо-литой", "Красный", "Красный Torino", "Красный Formula", "Лилово-красный", "Огненно-красный", "Красный Grace",
"Гранатовый", "Закатно-красный", "Каберне", "Винно-красный", "Яблочно-красный", "Ярко-розовый", "Розовый Pfister", "Лососево-розовый", "Рассветно-оранжевый",
"Оранжевый", "Ярко-оранжевый", "Золотой", "Бронзовый", "Желтый", "Гоночный желтый", "Желтый Dew", "Темно-зеленый", "Гоночный зеленый", "Морской зеленый",
"Оливково-зеленый", "Ярко-зеленый", "Зеленый", "Лаймово-зеленый", "Полуночный синий", "Космический синий", "Темно-синий", "Саксонский синий", "Синий",
"Синий Mariner", "Синий Harbour", "Бриллиантовый синий", "Синий Surf", "Морской синий", "Гоночный синий", "Ультра-синий", "Светло-синий", "Шоколадно-коричневый",
"Коричневый Bison", "Коричневый Creek", "Коричневый Feltzer", "Кленовый", "Буковый", "Охра", "Светло-коричневый", "Хаки", "Светло-бежевый", "Соломенный", "Песочный",
"Выцветший коричневый", "Пурпурный Schafter", "Пурпурный Spinnaker", "Полуночно-фиолетовый", "Ярко-пурпурный", "Кремовый", "Ледяной белый", "Белый иней"];
var vehicleColorsMatte = ["Черный", "Серый", "Светло-серый", "Ледяной белый", "Синий", "Темно-синий", "Полуночный синий", "Полуночно-фиолетовый", "Пурпурный Schafter", "Красный", "Темно-красный", "Оранжевый", "Желтый", "Лаймово-зеленый", "Зеленый", "Лесной зеленый", "Зеленая листва", "Оливковый", "Бежевый"];
var vehicleColorsMetals = ["Сталь", "Темная сталь", "Алюминий", "Чистое золото", "Начищенное золото"];
let vehicleColorsMetall = ["Черный","Карбоновый черный", "Графит","Серебрянный","Темно-серый","Светло-серый","Темно-красный","Красный","Глиняно-коричневый","Темно-зелёный","Зелёный","Темно-синий","Цвет морсокой пены","Светло-синий","Тускло-синий","Синий","Голубой","Ярко-cиний","Коричневый","Бронзово-коричневый","Светло-коричневый","Кремовый"]
var vehicleColors = [vehicleColorsClassicMetallic, vehicleColorsMatte,vehicleColorsMetall, vehicleColorsMetals, ['Без хрома',"Хром"]];
var vehiclePlates = ["Обычный","Желтый на черном", "Желтый на синем", "Cиний на белом 2", "Cиний на белом 3","Янктон"];
let WindowTints = [4,0,3,5,2,1];

mp.events.add({
	"PressE":()=>{
		if(!player.vehicle || mp.gui.cursor.visible || !isSeatVehicle(-1) || !is_castom) return;
		mp.events.callRemote('TUNING:OPEN')
	},
	'render': () => {
		try{

			if(menuOpen){
				for (let i = 59; i < 139; i++) {
					mp.game.controls.disableControlAction(2, i, true);
				}
			}
		}catch(e){}
	},
	'playerEnterColshape': (shape) => {
		if(shape.tuning === true){
			is_castom = true;
			if(isSeatVehicle(-1)) browserHud.execute('keyTip(true)');
		}
	},
	'playerExitColshape': (shape) => {
		if(shape.tuning === true){
			is_castom = false;
		}
	},
	'playerLeaveVehicle':()=>{
		if(is_castom) browserHud.execute('keyTip(false)');
	},
	'playerEnterVehicle':()=>{
		if(is_castom) browserHud.execute('keyTip(true)');
	},
	"TUNING::PREEF":()=>{
		if(preef_tune.length){
			if(preef_tune[0] == 62) player.vehicle.setNumberPlateTextIndex(preef_tune[1]);
			else if(preef_tune[0] == 46) player.vehicle.setWindowTint(preef_tune[1]);
			else if(preef_tune[0] == 'headlightColor'){
				player.vehicle.setLights(0);
				setHeadlightsColor(player.vehicle,preef_tune[1]);
			} 
			else if(preef_tune[0] == 'extra') player.vehicle.setExtraColours(preef_tune[1],player.vehicle.getExtraColours(0,0).wheelColor);
			else if(preef_tune[0] == 'extraWheel') player.vehicle.setExtraColours(player.vehicle.getExtraColours(0,0).pearlescentColor,preef_tune[1]);
			else if(preef_tune[0] == 'neon') player.vehicle.setNeonLightsColour(...preef_tune[1]);
			else player.vehicle.setMod(preef_tune[0],preef_tune[1]);
		}
	},
	"TUNING:EXIT":()=>{
		guitoggle(false);
		mp.events.callRemote('TUNING:EXIT')
		mp.events.call('TUNING::PREEF')
		menuOpen = false;
	},
	"TUNING::COLOR_CURENT":()=>{
		player.vehicle.setColours(colorPrimary, colorSecondary);
	},
	"TUNING:OPEN":()=>{
		menuOpen = true;
		let menu_customs = infoTuning;
		let veh = player.vehicle;
		let priceRepair = parseInt((1000 - player.vehicle.getBodyHealth() )/ 50  * 8) || 15;
		let menu = {
			name: 'Тюнинг',
			exitmenu: 'tuning',
			exitmenu_callback: 'TUNING:EXIT',
			items: [
				{
					type: 0,
					name: 'Починить машину',
					callback: 'TUNING::REPAIR',
					placeholder: `Цена починки ${priceRepair }$`
				}
			]
		}
		colorPrimary = veh.getColours(0,0).colorPrimary;
		colorSecondary = veh.getColours(0,0).colorSecondary;
		let model = veh.model;
		if(!veh.getVariable('gosFraction')){

			menu_customs.forEach((tuning,tuningIndex)=>{
				let mod =  typeof tuning.modtype == 'number' ? player.vehicle.getNumMods(tuning.modtype) : 0;
				// TOROS
				if(model == 3126015148){
					if(tuning.modtype == 0) tuning.nameMenu = 'Передний бампер'
					if(tuning.modtype == 1) tuning.nameMenu = 'Спойлеры'
					if(tuning.modtype == 2) tuning.nameMenu = 'Нижние cпойлеры'
				}
				if(mod>0  || tuning.modtype == 66 || tuning.modtype == 67 || tuning.modtype == 46 || typeof tuning.modtype == 'string'){
					let menu_tuning = { 
						name: tuning.nameMenu ? tuning.nameMenu : tuning.name,
						items: [
							
						]
					}
					if(tuning.modtype != 66 || tuning.modtype != 67) menu_tuning.backmenu_callback = 'TUNING::PREEF';
					// для тюнинга номера
					
					if(tuning.modtype == 62){
						mod = vehiclePlates.length;
						for(let i=0;i<mod;i++){
							let price = tuning.startPrice+(tuning.nextPrice*i);
							menu_tuning.items.push({
								type: 0,
								name: vehiclePlates[i],
								placeholder: 'Цена тюнинга '+price,
								callback: 'TUNING::BUY',
								callpointenct: [tuning.modtype,i,tuningIndex],
							});
						}
					}
					else if(tuning.modtype == 46){
						WindowTints.forEach((windowTint,i)=>{
							let price = tuning.startPrice+(tuning.nextPrice*i);
							menu_tuning.items.push({
								type: 0,
								name: `${tuning.name} ${i+1}`,
								placeholder: 'Цена тюнинга '+price,
								callback: 'TUNING::BUY',
								callpointenct: [tuning.modtype,windowTint,tuningIndex],
							});
						})
					} 
					// Цвет фар
					else if(tuning.modtype == 'headlightColor'){
						mod = 12;
						for(let i = -1;i<mod;i++){
							let price = i == -1 ? 0 : tuning.startPrice+(tuning.nextPrice*i);
							menu_tuning.items.push({
								type: 0,
								name: `${tuning.name} ${i+2}`,
								placeholder: 'Цена тюнинга '+price,
								callback: 'TUNING::BUY',
								callpointenct: [tuning.modtype,i,tuningIndex],
							});
						}
					}
					// неон
					else if(tuning.modtype == 'neon'){
						menu_tuning.items.push({
							type: 0,
							name: `Снять неон`,
							placeholder: 'Цена тюнинга 0',
							callback: 'TUNING::BUY',
							callpointenct: [tuning.modtype,-1,tuningIndex],
						});
						for(let i=0;i<neonColor.length;i++){
							let price = i == 0 ? 0 : tuning.startPrice+(tuning.nextPrice*i);
							menu_tuning.items.push({
								type: 0,
								name: `${neonColor[i].name}`,
								placeholder: 'Цена тюнинга '+price,
								callback: 'TUNING::BUY',
								callpointenct: [tuning.modtype,i,tuningIndex],
							});
						}
					}
					else if(tuning.modtype == 'extra' || tuning.modtype == 'extraWheel'){
						mod = 159;
						for(let i=0;i<mod;i++){
							let price = i == 0 ? 0 : tuning.startPrice+(tuning.nextPrice*i);
							menu_tuning.items.push({
								type: 0,
								name: `${tuning.name} ${i+1}`,
								placeholder: 'Цена тюнинга '+price,
								callback: 'TUNING::BUY',
								callpointenct: [tuning.modtype,i,tuningIndex],
							});
						}
					} 
					else if(tuning.modtype == 66 || tuning.modtype == 67){
						vehicleColorTypes.forEach((typeColor,i)=>{
							let menu_color = { 
								name: 'Цвет',
								backmenu_callback: 'TUNING::COLOR_CURENT',
								items: [
									
								]
							}
							vehicleColors[i].forEach((color,v)=>{
	
								let price = v == 0 ? 0 : tuning.startPrice+(tuning.nextPrice*i);
								
								menu_color.items.push({
									type: 0,
									name: color,
									placeholder: 'Цена тюнинга '+70,
									callback:  tuning.modtype == 66 ? 'TUNING::COLOR_PRIMARY_BUY' :  'TUNING::COLOR_SECONDARY_BUY',
									callpointenct: [i,v,v],
								});
							})
							menu_tuning.items.push({
								type: 2,
								name: typeColor,
								infomenu: menu_color
							})
						})
					}
					else{
						for(let i=-1;i<mod;i++){
							let price = i == -1 ? 0 : tuning.startPrice+(tuning.nextPrice*(i+1));
							menu_tuning.items.push({
								type: 0,
								name: `${tuning.name} ${i+1}`,
								placeholder: 'Цена тюнинга '+price,
								callback: 'TUNING::BUY',
								callpointenct: [tuning.modtype,i,tuningIndex],
							});
						}
					}
					menu.items.push({
						type: 2,
						name: `${tuning.name}`,
						callback: 'TUNING::SELECT',
						callpointenct: tuning.modtype,
						infomenu: menu_tuning
					})
				}
			})
		}
		createmenuv(menu);
		guitoggle(true,true);
		cursor(false);
	},
	"TUNING::COLOR_PRIMARY_CHANGE":(color)=>{
		colorPrimary = color
	},
	"TUNING::COLOR_SECONDARY_CHANGE":(color)=>{
		colorSecondary = color
	},
	"TUNING::BUY_SUCCESS":(typeMod,index)=>{
		preef_tune[0] = typeMod; 
		if(typeMod == 'neon')preef_tune[1] = neonColor[index].color;
		else preef_tune[1] = index;
	}
})
calpointect('TUNING::COLOR_PRIMARY_BUY',(array)=>{
	let veh = player.vehicle;
	array = array.split(',');
	veh.setColours(vehicleColorID[parseInt(array[0])][parseInt(array[1])], veh.getColours(0,0).colorSecondary);
})
calpointect('TUNING::BUY',(array,t)=>{
	let veh = player.vehicle;
	array = array.split(',');
	let modtype = isNaN(parseInt(array[0])) ? array[0] : parseInt(array[0]);
	let index = parseInt(array[1]);
	if(modtype == 62) return player.vehicle.setNumberPlateTextIndex(index);
	else if(modtype == 46) return player.vehicle.setWindowTint(index);
	else if(modtype == 'headlightColor'){
		player.vehicle.setLights(2);
		setHeadlightsColor(player.vehicle,index);
	}
	else if(modtype == 'extra')return player.vehicle.setExtraColours(index,player.vehicle.getExtraColours(0,0).wheelColor);
	else if(modtype == 'extraWheel')return player.vehicle.setExtraColours(player.vehicle.getExtraColours(0,0).pearlescentColor,index);
	else if(modtype == 'neon'){
		if(index != -1){
			for(let i=0;i<4;i++){
				player.vehicle.setNeonLightEnabled(i,true);
			}
			player.vehicle.setNeonLightsColour(...neonColor[index].color);
		}
		else{
			for(let i=0;i<4;i++){
				player.vehicle.setNeonLightEnabled(i,false)
			}
		}
		return 
	}
	else veh.setMod(modtype,index);
})
calpointect('TUNING::COLOR_SECONDARY_BUY',(array)=>{
	let veh = player.vehicle;
	array = array.split(',');
	veh.setColours(veh.getColours(0,0).colorPrimary, vehicleColorID[parseInt(array[0])][parseInt(array[1])]);

})
callback('TUNING::SELECT',(array,t)=>{
	preef_tune[0] = isNaN(parseInt(t)) ? t : parseInt(t);
	if(preef_tune[0] == 62)preef_tune[1] = player.vehicle.getNumberPlateTextIndex();
 	else if(preef_tune[0] == 46)preef_tune[1] = player.vehicle.getWindowTint();
	else if(preef_tune[0] == 'headlightColor'){
		preef_tune[1] = player.vehicle.getVariable('headlightColor');
	}
	else if(preef_tune[0] == 'extra')preef_tune[1] = player.vehicle.getExtraColours(0,0).pearlescentColor;
	else if(preef_tune[0] == 'extraWheel')preef_tune[1] = player.vehicle.getExtraColours(0,0).wheelColor;
	else if(preef_tune[0] == 'neon'){
		let neon = player.vehicle.getNeonLightsColour(0,0,0);
		let curentNeon = Object.values(neon);
		preef_tune[1] = curentNeon;
	}
	else preef_tune[1] = player.vehicle.getMod(preef_tune[0]);
})