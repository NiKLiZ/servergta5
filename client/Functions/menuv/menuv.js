global.menuvlocked = false;
//Создание меню
global.createmenuv = (info,lock) =>{
	if(loggined === false || menuvlocked === true || chatActive === true) return;
	if(lock) global.menuvlocked = lock;
	// Если передан маркер то если он выйдет из маркера то меню закроется
	if(info.exit_mar){
		info.exit_mar.colshape.exitmenu = 'MAR_EXIT'+info.exit_mar.id;
		info.exitmenu = 'MAR_EXIT'+info.exit_mar.id;
		delete info.exit_mar;
	}
	if(info.exit_cols){
		info.exit_cols.exitmenu = 'COLS_EXIT'+info.exit_cols.id;
		info.exitmenu = 'COLS_EXIT'+info.exit_cols.id;
		delete info.exit_cols;
	}
	browser.execute(`createMenuv(${JSON.stringify(info)})`);
}
//Закрытие меню
global.closemenuv = (name)=>{
	global.menuvlocked = false;
	if(name) browser.execute(`closemenuv('${name}')`);
	else browser.execute(`closemenuv()`);
}
//удаление item в menuv
global.delitemsMenuv = (id)=>{
	browser.execute(`delitemsMenuv(${id})`);
}
//изменения максимального значение в item в menuv
global.editmaxMenuv = (id,max)=>{
	browser.execute(`editmaxMenuv(${id},${max})`);
}
global.editPlaceholderMenuv = (id,placeholer)=>{
	browser.execute(`editPlaceholderMenuv(${id},'${placeholer}')`);
}
//Остоновить меню меню
global.locked_menuv_tog = (is)=>{
	browser.execute(`locked_menuv_tog(${''+is})`);
}
//добавление item
global.additemMenuv = (item)=>{
	browser.execute(`additem(${JSON.stringify(item)})`);
}
//Показать item
global.showitemsMenuv = (id) =>{
	browser.execute(`showitemsMenuv(${id})`);
}
//скрыть item
global.hideitemsMenuv = (id)=>{
	browser.execute(`hideitemsMenuv(${id})`);
}
let menuvcalpointect = {};
let menuvcallback = {};
let menuvswith = {};

mp.events.add({
	"MENUV::CREATE": (info) => {
		if(loggined === false || menuvlocked === true || chatActive === true) return;
		browser.execute(`createMenuv(${info})`);
	},
	"menuvcallback": (cal,json) =>{
		let menu = menuvcallback[cal];
		json = JSON.parse(json)
		let array = jsontoarray(json);
		if(menu!=undefined){
			menu.callback(json,array);
		}
		else mp.events.callRemote('menuvcalback',cal,JSON.stringify(array));
	},
	"menuv_callback_remote": (cal,json) =>{
		
		mp.events.callRemote(cal,json);
	},
	"menuvswitch": (cal,json) =>{
		let menu = menuvswith[cal];
		if(menu!=undefined){
			let t = JSON.parse(json);
			let c = t[0][Object.keys(t[0])[0]]
			menu.callback(parseInt(c));
		}
		else mp.events.callRemote('menuvswitch',cal,json);
	},
	"MENUV::CLOSE": (cal) =>{
		global.menuvlocked = false;
		browser.execute(`closemenuv('${cal}')`);
	},
	"menuvpointect": (cal,callpoint) =>{
		let menu = menuvcalpointect[cal];
		if(menu!=undefined){
			menu.callback(callpoint,jsontoarray(callpoint)[0]);
		}
	}
});


//функция при выборе item
global.calpointect = (name,callback)=>{
	menuvcalpointect[name] = {callback: callback};
}
//функция callback при нажатии на enter
global.callback = (name,callback)=>{
	menuvcallback[name] = {callback: callback};
}
//функция callback изменение карусели 
global.mswith = (name,callback)=>{
	menuvswith[name] = {callback: callback};
}
let jsontoarray = (json)=>{
	let arr = [];
	for(let i=0;i<json.length;i++){
		for (let elem in json[i]) {
		    arr.push(json[i][elem]);
		}
	}
	return arr;
}