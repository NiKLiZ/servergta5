// types
// 0 - checkbox
// 1 - aray
// 2 - menu
// 3 - swith int
let sizing_spidometr = ['200','250','300','350']
let speed_type = ['KM/H','MP/H']
let {browserHud} = require('../../UI/GUI/gui');
let settings_info = [
	{
		name: 'Автовход',
		name_setting: 'authauto',
		type: 0,
		default: false,
	},
	{
		name: 'Hud',
		name_setting: 'hud',
		type: 0,
		default: true,
		action: (is)=>{
			if(is){
				browser.execute(`
					${mp.storage.data.setting.spedometr.type == 1 && player.vehicle ? 'speed.show();':''}
				`);
				browserHud.execute(`hud.show = true;`)
				mp.game.ui.displayRadar(is);
				mp.gui.chat.show(is)
			}else{
				browserHud.execute(`hud.show = false;`)
				browser.execute(`speed.hide();`);
				mp.game.ui.displayRadar(is);
				mp.gui.chat.show(is)
			}

		}
	},
	{
		name: 'Fps',
		name_setting: 'fps',
		type: 0,
		default: false,
	},
	{
		name: 'Показывать кто говорит',
		name_setting: 'voiceSprite',
		type: 1,
		default: 0,
		swith: ['Иконкой','Кругом'],
		default: false,
	},
	{
		name: 'Размытие',
		name_setting: 'blur',
		type: 0,
		default: false,
		placeholder: 'Отключение или включение размытие при открытие меню'
	},
	{
		name: 'Чат',
		name_title: 'Чат',
		name_setting: 'chat',
		type: 2,
		items: [
			{
				name: 'Показывать время',
				name_setting: 'showTime',
				type: 0,
				default: false,
				action: (is)=>{
					browser.execute(`chatAPI.showTime = ${is}`)
				},
				init: (is)=>{
					browser.execute(`chatAPI.showTime = ${is}`)
				}
			},
			{
				name: 'Размер',
				name_setting: 'showTime',
				type: 1,
				swith: ["Малый размер","Средний размер", "Большой размер"],
				default: 1,
				action: (id)=>{
					browser.execute(`chatAPI.sizeText = ${id}`)
				},
				init: (id)=>{
					browser.execute(`chatAPI.sizeText = ${id}`)
				}
			},
		]
	},
	{
		name: 'Спидометр',
		name_title: 'Cпидометр',
		name_setting: 'spedometr',
		type: 2,
		items: [
			{
				name: 'Включить',
				name_setting: 'active',
				type: 0,
				default: true,
				action: (is)=>{
					if(!is) browser.execute('speed.hide();');
					if(is){
						browser.execute('speed.hide();');
					}
					if(mp.storage.data.setting.spedometr.type == 1 && is && player.vehicle){
						browser.execute('speed.show();');
					}
				}
			},
			{
				name: 'Тип',
				name_setting: 'type',
				type: 1,
				default: 0,
				swith: ['Цифры','Круглый'],
				action: (id)=>{
					if(id == 0){
						browser.execute('speed.hide();');
						if(player.vehicle){
							browserHud.execute('hud.showSpeed = true;');
							
						}
					}
					if(id == 1 &&  mp.storage.data.setting.spedometr.active == true){
						if(player.vehicle)browser.execute(`speed.show(); ${player.vehicle.getVariable('systemPetrol') ? 'speed.showFuel()' : 'speed.hideFuel()'};`);
						browserHud.execute('hud.showSpeed = false;');
						
					}
				},
			},
			{
				name: 'Секций',
				name_setting: 'sections',
				type: 3,
				default: 15,
				max: 18,
				placeholder: 'Количество секции для круглого спидометра',
				action: (id)=>{
					browser.execute(`speedometr.lngsizi = ${id};speed.destroy();var speed = new speedometr_gui(speedometr);`);
					if(player.vehicle && mp.storage.data.setting.spedometr.type == 1){
						browser.execute('speed.show();');
					}
				},
				init: (id)=>{
					browser.execute(`speedometr.lngsizi = ${id};speed.destroy();var speed = new speedometr_gui(speedometr);`);
					if(player.vehicle && mp.storage.data.setting.spedometr.type == 1){
						browser.execute('speed.show();');
					}
				}
			},
			{
				name: 'Размер',
				name_setting: 'size',
				type: 1,
				default: 1,
				swith: sizing_spidometr,
				placeholder: 'Размер круглого спидометра',
				action: (id)=>{
					browser.execute(`speedometr.size = ${sizing_spidometr[parseInt(id)]};speed.destroy();var speed = new speedometr_gui(speedometr);`);
					if(player.vehicle && mp.storage.data.setting.spedometr.type == 1){
						browser.execute('speed.show();');
					}
				},
				init: (id)=>{
					browser.execute(`speedometr.size = ${sizing_spidometr[parseInt(id)]};speed.destroy();var speed = new speedometr_gui(speedometr);`);
					if(player.vehicle && mp.storage.data.setting.spedometr.type == 1){
						browser.execute('speed.show();');
					}
				}
			},
			{
				name: 'Скорость в ',
				name_setting: 'type_speed',
				type: 1,
				default: 0,
				swith: speed_type,
				action: (id)=>{
					if(mp.storage.data.setting.spedometr.type == 1)browser.execute(`speedometr.type_speed = '${speed_type[id]}';speed.destroy();var speed = new speedometr_gui(speedometr);`);
					else browserHud.execute(`hud.speedType = "${speed_type[id]}"`)
					if(player.vehicle && mp.storage.data.setting.spedometr.type == 1){
						browser.execute('speed.show();');
					}
				},
				init: (id)=>{
					if(mp.storage.data.setting.spedometr.type == 1)browser.execute(`speedometr.type_speed = '${speed_type[id]}';speed.destroy();var speed = new speedometr_gui(speedometr);`);
					else browserHud.execute(`hud.speedType = "${speed_type[id]}"`)
					if(player.vehicle && mp.storage.data.setting.spedometr.type == 1){
						browser.execute('speed.show();');
					}
				}
			},
			],
	},

]

if(!mp.storage.data.setting) mp.storage.data.setting = {}
if(typeof mp.storage.data.setting != "object")mp.storage.data.setting = {}
function settings_load(settings,name) {
	for(let i=0;i<settings.length;i++){
		let setting = settings[i];
		if(setting.type != 2){
			let value;
			let edit_value;
			let ismenu = true;
			if(!name){
				value = mp.storage.data.setting[setting.name_setting] ? mp.storage.data.setting[setting.name_setting] : mp.storage.data.setting[setting.name_setting] = setting.default;
				name = '';
				ismenu = false;
				mp.storage.data.setting[setting.name_setting] = value;
				edit_value = mp.storage.data.setting[setting.name_setting];
				if(setting.init) setting.init(value);
			}else {
				if(mp.storage.data.setting[name] === undefined){
					mp.storage.data.setting[name] = {};
					mp.storage.data.setting[name] = {};
				} 
				if( mp.storage.data.setting[name][setting.name_setting] !== undefined){
					value = mp.storage.data.setting[name][setting.name_setting];
					if(setting.init) setting.init(value);
				}else{
					mp.storage.data.setting[name][setting.name_setting] = setting.default
					mp.storage.data.setting[name][setting.name_setting] = setting.default;
					value = setting.default
					if(setting.init) setting.init(value);
				}
				mp.storage.data.setting[name][setting.name_setting] = value;
				edit_value = mp.storage.data.setting[name][setting.name_setting];
			}
			if(setting.type == 0) callback('SETTINGS::EDIT_'+name+setting.name_setting,(c,t)=>{
				let action = setting.action;
				if(ismenu) mp.storage.data.setting[name][setting.name_setting] = t[0]==true;
				else mp.storage.data.setting[setting.name_setting] = t[0] == true;
				if(action) action(t[0]);
				mp.storage.flush();
			})
			if(setting.type == 1) mswith('SETTINGS::EDIT_'+name+setting.name_setting,(i)=>{
				if(ismenu) mp.storage.data.setting[name][setting.name_setting] = i;
				else mp.storage.data.setting[setting.name_setting] = i;
				if(setting.action) setting.action(i)
				mp.storage.flush();
			})
			if(setting.type == 3) mswith('SETTINGS::EDIT_'+name+setting.name_setting,(i)=>{
				if(ismenu) mp.storage.data.setting[name][setting.name_setting] = i;
				else mp.storage.data.setting[setting.name_setting] = i;
				if(setting.action) setting.action(i)
				mp.storage.flush();
			})
		}
		if(setting.type == 2){
			settings_load(setting.items,setting.name_setting);
		}
	}
}
settings_load(settings_info)
let getSettingsMenu = function(settings,name,title) {
	let value = mp.storage.data.setting;
	if(settings && name){
		value = mp.storage.data.setting[name];
	}
	name = name ? name :  '';
	settings = settings ? settings : settings_info ;
	let menu = {
		name: title? title: 'Настройки',
		items: [],
	}
	for(let i=0;i<settings.length;i++){
		let setting = settings[i];
		if(setting.type == 0) menu.items.push({
			type: 6,
			name: setting.name,
			checked: value[setting.name_setting]==true ? true : false,
			placeholder: setting.placeholder ? setting.placeholder : '',
			callback: 'SETTINGS::EDIT_'+name+setting.name_setting,
			callpointenct: '',
		})
		if(setting.type == 1) menu.items.push({
				type: 4,
				name: setting.name,
				placeholder: setting.placeholder ? setting.placeholder : '',
				index: value[setting.name_setting],
				callpointenct: 'SETTINGS::EDIT_'+name+setting.name_setting,
				swith: setting.swith
		})
		if(setting.type == 2){
			menu.items.push({
				type: 2,
				name: setting.name,
				placeholder: setting.placeholder ? setting.placeholder : '',
				infomenu: getSettingsMenu(setting.items,setting.name_setting,setting.name_title)
			})
		}
		if(setting.type == 3) menu.items.push({
				type: 3,
				name: setting.name,
				placeholder: setting.placeholder ? setting.placeholder : '',
				index: value[setting.name_setting],
				callpointenct: 'SETTINGS::EDIT_'+name+setting.name_setting,
				max: setting.max
		}) 
	}
	return menu;
}
module.exports.getSettingsMenu = getSettingsMenu;