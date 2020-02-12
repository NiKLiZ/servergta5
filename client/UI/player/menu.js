let currentStyle = 0;
let getSettingsMenu = require('../../SYSTEM/settings/index.js').getSettingsMenu;
let {getNickName,hasFriend} = require('../GUI/chat.js');
let mooods = [
    { Name: "Normal", AnimName: null },
    { Name: "Aiming", AnimName: "mood_aiming_1" },
    { Name: "Angry", AnimName: "mood_angry_1" },
    { Name: "Drunk", AnimName: "mood_drunk_1" },
    { Name: "Happy", AnimName: "mood_happy_1" },
    { Name: "Injured", AnimName: "mood_injured_1" },
    { Name: "Stressed", AnimName: "mood_stressed_1" },
    { Name: "Sulking", AnimName: "mood_sulk_1" },
]
const walkingStyles = [
    {Name: "Нормальная", AnimSet: null},
    {Name: "Смелая", AnimSet: "move_m@brave"},
    {Name: "Уверенная", AnimSet: "move_m@confident"},
    {Name: "Широкая", AnimSet: "move_m@fat@a"},
    {Name: "Бандитская", AnimSet: "move_m@shadyped@a"},
    {Name: "Спешая", AnimSet: "move_m@hurry@a"},
    {Name: "Хромая", AnimSet: "move_m@injured"},
    {Name: "Запуганная", AnimSet: "move_m@intimidation@1h"},
    {Name: "Быстрая", AnimSet: "move_m@quick"},
    {Name: "Грустная", AnimSet: "move_m@sad@a"},
    {Name: "Грубая", AnimSet: "move_m@tool_belt@a"}
];

mp.keys.bind(0x4D,true,function(){
	if(!isGUIOpen())return;
	let findVehicles = {
		name: 'Найти машину',
		items: [
		]
	};
	mp.vehicles.forEach(
		(vehicle, id) => {
			let veh = isOwnerVehicle(vehicle);
			if(!veh) return;
			findVehicles.items.push({
				type: 1,
				name: mp.game.ui.getLabelText(mp.game.vehicle.getDisplayNameFromVehicleModel(veh.model)),
				callback: 'findveh',
				callpointenct: veh.remoteId
			})
		}
	)
	
	let veh = {
		name: 'Меню машины',
		items: [
			{
				type: 2,
				name: 'Найти машину',
				infomenu: findVehicles,
			},
			
			{
				type: 5,
				name: 'Ограничение скорости',
				placeholder: 'Максимальная скорость с которой может ехать машина в км/ч. Меньше 60 отключить лимит',
				inputValue: mp.storage.data.setting.maxSpeedVehicle || 0,
				type_input: 'number'
			},
			{
				type: 1,
				name: 'Сохранить ограничение по скорости',
				callback: 'PLAYER::SAVE_MAX_VEHICLE_SPEED'
			}
		]
	};
	if(player.hasHome && player.hasGarag){
		let evacuateVehicles = {
			name: 'Эвакуировать машину',
			items: [
			]
		};
		mp.vehicles.forEach(
			(vehicle, id) => {
				let veh = isOwnerVehicle(vehicle);
				if(!veh) return;
				evacuateVehicles.items.push({
					type: 1,
					name: mp.game.ui.getLabelText(mp.game.vehicle.getDisplayNameFromVehicleModel(veh.model)),
					callback: 'PLAYER::EVACUTE_VEHICLE',
					callpointenct: veh.remoteId,
					placeholder: 'Эвакуировать машину домой'
				})
			}
		)
		veh.items.push({
			type: 2,
			name: 'Эвакуировать машину',
			infomenu: evacuateVehicles,
		})
	}

	let moods_menu = {
		name: 'Выражения лица',
		items: mooods.map((item)=>{
				return {
					type: 1,
					name: item.Name,
					callpointenct: item.AnimName,
					callback: 'PLAYER::EDIT_MOODS'
				};
			})
	};
	let styles_menu = {
		name: 'Походка',
		items: walkingStyles.map((item,i)=>{
				return {
					type: 1,
					name: item.Name,
					callpointenct: i,
					callback: 'PLAYER::EDIT_STYLE'
				};
			})
	};
	let menu = {
		name: 'Меню персонажа',
		items: [
			{
				type: 2,
				name: 'Машина',
				infomenu: veh
			},
			{
				type: 2,
				name: 'Настройки',
				infomenu: getSettingsMenu()
			},
			{
				type: 2,
				name: 'Выражения лица',
				infomenu: moods_menu
			},
			{
				type: 2,
				name: 'Походка',
				infomenu: styles_menu
			},
		]
	};
	if(player.bisnines)menu.items.push({
		type: 0,
		name: 'Бизнес',
		callback: 'BUSINES::OPEN_MENU'
	})
	if(player.hasGang && player.rank >= 5){
		menu.items.push({
			type: 1,
			name: 'Захватить точку',
			callback: 'GANG::START_CAPT'
		})
	}
	createmenuv(menu);
});


let styleGain = mp.storage.data.setting.styleGain;
mp.events.add('AUTHORIZETE::SUCCESS',()=>{
	if(typeof styleGain == "undefined"){
		mp.storage.data.setting.styleGain = 0;
		styleGain = 0;
	}else{
		mp.events.callRemote('PLAYER::EDIT_STYLE',styleGain);
	
	}
})


callback('PLAYER::EDIT_STYLE',(t,array)=>{
	styleGain = parseInt(array[0])
	mp.storage.data.setting.styleGain = styleGain;
	mp.events.callRemote('PLAYER::EDIT_STYLE',styleGain);
})

let {hasCuff} = require('../../SYSTEM/fraction/lspd');

mp.keys.bind(0x11, false, () => {
	if(!isGUIOpen() || player.vehicle || hasCuff || player.isDead) return;
	mp.events.callRemote("toggleCrouch");
});

mp.events.add({
	"DownG":()=>{
		if(!loggined || player.vehicle) return;
		let entity = LookingEntity;
		if (entity){
			if(entity.type == 'player' && entity.remoteId != null){
				if(!entity.getVariable('visible')) return;
				createRadialPlayer(entity);
			}
		}
		if(typeof debag !== 'undefined') createRadialPlayer(player);
	},
	"RADIAL::GIVE_MONEY":(data)=>{
	 	let pl = mp.players.atRemoteId(parseInt(data));
			Input_call('Передать деньги '+getNickName(pl),'Укажите сумму','сумма',(value)=>{
				if(mp.Vector3.Distance(player.position,pl.position) > 5) return alert('Игрок слишком далеко отошёл');
				mp.events.callRemote("RADIAL::GIVE_MONEY",pl.remoteId,value);
		});
	},
	"RADIAL::SELF_VEHICLE_TABLE":(id,ret)=>{
		let pl = mp.players.atRemoteId(parseInt(id));
		ret = JSON.parse(ret);
		for (let i = 0; i < ret.length; i++) {
			ret[i].model = mp.game.ui.getLabelText(mp.game.vehicle.getDisplayNameFromVehicleModel(ret[i].model));
			ret[i].data = [ret[i].data,ret[i].model];
		}
	 	Create_table('Продажа машины',['№','name'],ret,(veh_id,model)=>{
	 		if(mp.Vector3.Distance(player.position,pl.position) > 5) return alert('Игрок слишком далеко отошёл');
			Input_call('Продажа машины '+getNickName(pl),'Укажите сумму','сумма',(value)=>{
				if(mp.Vector3.Distance(player.position,pl.position) > 5) return alert('Игрок слишком далеко отошёл');
				mp.events.callRemote("RADIAL::SELF_VEHICLE_MENU",pl.remoteId,model,veh_id,value);
			});
		})
	},
	"RADIAL::SELF_VEHICLE_BUYER":(id,model,veh_id,price)=>{
	 	let pl = mp.players.atRemoteId(parseInt(id));
	 	if(mp.Vector3.Distance(player.position,pl.position) > 5) return alert('Игрок слишком далеко отошёл');
	 	let menu = {
			name: 'Продажа машины',
			items: [
				{
					type: 1,
					name: 'Купить',
					callback: 'RADIAL::SELF_VEHICLE_SUCCESS',
					placeholder: `${hasFriend(pl) ? pl.name : 'Гружданин' }[${pl.remoteId}] продаёт ${model} за ${price}$`,
					callpointenct: [id,model,veh_id,price],
				},
				{
					type: 1,
					name: 'Отмена',
				},
			]
		};
		createmenuv(menu);
	},
	"RADIAL::CUFF":(id)=>{
		let pl = mp.players.atRemoteId(parseInt(id));
	 	if(mp.Vector3.Distance(player.position,pl.position) > 5) return alert('Игрок слишком далеко отошёл');
		mp.events.callRemote("LSPD::CUFF",id);
	},
	"RADIAL::ATACH":(id)=>{
		let pl = mp.players.atRemoteId(parseInt(id));
	 	if(mp.Vector3.Distance(player.position,pl.position) > 5) return alert('Игрок слишком далеко отошёл');
		if(!pl.getVariable('LSPD::ATACH')) mp.events.callRemote("LSPD::ATACH",id);
		else mp.events.callRemote("LSPD::UNTACH",id);
	},
	"RADIAL::TREAT":(id)=>{
		if(!player.getVariable('locker_fraction')) return alert('Вы не надели униформу')
		let pl = mp.players.atRemoteId(parseInt(id));
		if(mp.Vector3.Distance(player.position,pl.position) > 3) return alert('Игрок слишком далеко отошёл');
		mp.events.callRemote('EMS::TREAT_ANIM',id)
	},
	"RADIAL::PILL":(id)=>{
		let pl = mp.players.atRemoteId(parseInt(id));
		if(mp.Vector3.Distance(player.position,pl.position) > 3) return alert('Игрок слишком далеко отошёл');
		mp.events.callRemote('EMS::PILL',id) 
	},
	"RADIAL::VIEW_ARTICLE":(id)=>{
		let pl = mp.players.atRemoteId(parseInt(id));
		if(mp.Vector3.Distance(player.position,pl.position) > 3) return alert('Игрок слишком далеко отошёл');
		mp.events.callRemote('CH::VIEW_ARTICLE',id) 
	},
	"RADIAL::CHECK_DIST":(array)=>{
		array = JSON.parse(array);
		let id = parseInt(array[1])
		let pl = mp.players.atRemoteId(parseInt(id));
		if(!pl)return alert('Игрок не найден')
		if(mp.Vector3.Distance(player.position,pl.position) > 3) return alert('Игрок слишком далеко отошёл');
		mp.events.callRemote(array[0],id) 
	},
	"render":()=>{
		try{
			if(!loggined || player.vehicle) return;
			let entity = LookingEntity;
				if(entity){
					if(entity.type == 'player' && entity.remoteId != null){
						if(!entity.getVariable('visible')) return;
						let pos = entity.position;
						mp.game.graphics.drawText(`G`, [pos.x, pos.y,pos.z], {scale:[0.5, 0.5], color:[255, 255, 255, 255], font: 0});
					}
			}
		}catch(e){
			
		}
	},
	"RADIAL::CHECK_SHOW_DOCUMENT":(array)=>{
		array = JSON.parse(array);
		let id = parseInt(array[1])
		let name = array[2];
		let callback = array[3];
		let pl = mp.players.atRemoteId(parseInt(id));
		if(!pl)return alert('Игрок не найден')
		if(mp.Vector3.Distance(player.position,pl.position) > 3) return alert('Игрок слишком далеко отошёл');
		mp.events.callRemote("RADIAL::SHOW_DOCUMENT",array[0],id,name) 
	},
	"RADIAL::SHOW_DOCUMENT":(id,callback,name)=>{
		let pl = mp.players.atRemoteId(id);
		let menu = {
			name: 'Документ',
			items: [
				{
					type: 1,
					name: 'Принять',
					placeholder: `Посмотреть ${name} ${hasFriend(pl) ? pl.name : 'гружданина' }[${pl.remoteId}]`,
					callback_remote: callback,
					callpointenct: id
				},
				{
					type: 1,
					name: 'Отклонить',
				}
			]
		}
		createmenuv(menu)
	}
});

let  createRadialPlayer = (pl)=>{
	let menu = [
		{
			icon: 'driver-license',
			name: `Показать вод. права ${getNickName(pl)}`,
			callback: 'RADIAL::CHECK_SHOW_DOCUMENT',
			data: ['RADIAL::SHOW_DRIVER_LICENSE',pl.remoteId,'вод. права']
		},
		{
			icon: 'id-card',
			name: `Показать паспорт<br />  ${getNickName(pl)}`,
			callback: 'RADIAL::CHECK_SHOW_DOCUMENT',
			data: ['RADIAL::SHOW_PASSPORT',pl.remoteId,'паспорт']
		},
		{
			icon: 'money',
			name: `Передать деньги <br /> ${getNickName(pl)}`,
			callback: 'RADIAL::GIVE_MONEY',
			data: ''+pl.remoteId,
		},
		{
			icon: 'sell-a-car',
			name: `Продать машину <br /> ${getNickName(pl)}`,
			callback: 'RADIAL::CHECK_DIST',
			data: ['RADIAL::SELF_VEHICLE',''+pl.remoteId]
		},
	];
	if(!pl.getVariable('LSPD::CUFF')){
		menu.push({
			icon: 'handshake',
			name: `Пожать руку <br /> ${getNickName(pl)}`,
			callremote: 'RADIAL::HELLO_PLAYER',
			data: ''+pl.remoteId,
		})
		
	}
	let groupFraction = [];
	if(player.fraction){
		if(player.infoRang.cuff){
			groupFraction.push({
				icon: 'cuff',
				name: `${pl.getVariable('LSPD::CUFF') ? 'Снять наручники  <br /> c' : 'Надеть наручники  <br /> на'}  ${hasFriend(pl) ? pl.name : 'гружданина' }[${pl.remoteId}]`,
				callback: 'RADIAL::CUFF',
				data: pl.remoteId,
			})
		}
		if(player.infoRang.atach){
			if(pl.getVariable('LSPD::CUFF') === true || pl.getVariable('LSPD::CUFF_PLAYER') === player ) groupFraction.push({
				icon: 'sell-a-car',
				name: `${pl.getVariable('LSPD::ATACH') ? 'Не вести'  :'Вести'} за собой <br /> ${hasFriend(pl) ? pl.name : 'гружданина' }[${pl.remoteId}]`,
				callback: 'RADIAL::ATACH',
				data: pl.remoteId,
			})
		}
		if(player.infoRang.treat){
			groupFraction.push({
				name: 'Вылечить игрока',
				icon: 'handshake',
				callback: 'RADIAL::TREAT',
				data: pl.remoteId
			})
		}
		if(player.infoRang.pill){
			groupFraction.push({
				name: 'Выдать таблетку',
				icon: 'handshake',
				callback: 'RADIAL::PILL',
				data: pl.remoteId
			})
		}
		if(player.infoRang.viewArticle){
			groupFraction.push({
				name: `Показать за что сидит игрок ${getNickName(pl)}`,
				icon: 'id-card',
				callback: 'RADIAL::VIEW_ARTICLE',
				data: pl.remoteId
			})
		}
		if(player.infoRang.giveAward){
			groupFraction.push({
				name: `Выдать премию ${getNickName(pl)}`,
				icon: 'money',
				callback: 'RADIAL::CHECK_DIST',
				data: ['FRACTION::GIVE_AWARD',pl.remoteId]
			})
		}
		if(player.infoRang.unJail){
			groupFraction.push({
				name: `Освободить игрока ${getNickName(pl)} за 1000$`,
				icon: 'cuff',
				callback: 'RADIAL::CHECK_DIST',
				data: ['CH::UN_JAIL',pl.remoteId]
			})
		}
		if(!player.hasGang && !player.hasMafia){
			groupFraction.push({
				name: `Показать удостоверение ${getNickName(pl)}`,
				icon: 'id-card',
				callback: 'RADIAL::CHECK_SHOW_DOCUMENT',
				data: ['FRACTION::SHOW_DOCUMENT',pl.remoteId,'удостоверение']
			})
		}
		if(groupFraction.length){
			if(groupFraction.length == 1){
				menu.push(groupFraction[0])
			}else{
				menu.push({
					icon: 'sell-a-car',
					name: `Фракция`,
					group: groupFraction
				})
			}
		}
	}
	updateRadialGUI(menu)
	showRadialGUI()
}
callback("PLAYER::SAVE_MAX_VEHICLE_SPEED",(t,array)=>{
	let speed = parseInt(array[0]);
	if(speed < 60){
		if(player.vehicle){
			let maxSpeed = mp.game.vehicle.getVehicleModelMaxSpeed(player.vehicle.model);
			player.vehicle.setMaxSpeed(maxSpeed);
		}
		mp.storage.data.setting.maxSpeedVehicle = 0;
		return alert('Лимит отключен');	
	}
	else if(player.vehicle){
		try{
			mp.storage.data.setting.maxSpeedVehicle = speed;
			let maxSpeed = mp.game.vehicle.getVehicleModelMaxSpeed(player.vehicle.model);
			if(maxSpeed > speed/3.6)player.vehicle.setMaxSpeed(speed/3.6);
			else alert('Этот транспорт не может ехать больше '+(maxSpeed*3.6).toFixed(0))
		}catch(e){
			alert('Ошибка '+e.toString())
		}
	}
})