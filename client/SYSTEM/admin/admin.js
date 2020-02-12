let id = null;
let InSpectatorMode = false;
let LastPosition;
let player_spectet;
let radius = 2;
let polarAngleDeg = 0;
let azimuthAngleDeg = 0;
let scenarias = require('./scenaries').scenarias;
let posSpectet;

function polar3DToWorld3D(entityPosition, radius, polarAngleDeg, azimuthAngleDeg) {
	let polarAngleRad = polarAngleDeg * Math.PI / 180.0;
	let azimuthAngleRad = azimuthAngleDeg * Math.PI /180.0;
	let pos = new mp.Vector3(
		entityPosition.x + radius * (Math.sin(azimuthAngleRad) * Math.cos(polarAngleRad)),
		entityPosition.y - radius * (Math.sin(azimuthAngleRad) * Math.sin(polarAngleRad)),
		entityPosition.z - radius * Math.cos(azimuthAngleRad)
	)
	return pos;
}	
function reset_spectet() {
	player.position = LastPosition;
	LastPosition = undefined;
	player.alpha = 255;
	InSpectatorMode = false;
	mp.events.call('cameradefault');
	player.detach(false,false);
	player.setCollision(true,true);
}

mp.events.add({
	"remotecamera": (id,posSpect) => {
		if(id != -1){
			player_spectet = mp.players.atRemoteId(id);
			if(!LastPosition)LastPosition = player.position;
			InSpectatorMode = true;
			posSpectet = JSON.parse(posSpect);
			if(id != player.remoteId) player.setCollision(false,false);
			player.alpha = 0;
			let pos = player_spectet.position;
			mp.events.call('setCameraPosition',pos.x,pos.y,pos.z,0,0,0,0,0);

		}else{
			reset_spectet();
		}
	},
	"render": () => {
		try{
			if(InSpectatorMode){
				let coords =  player_spectet.vehicle ? player_spectet.vehicle.position : player_spectet.position;
				if(player_spectet.vehicle) cam.pointAt(player_spectet.vehicle.handle,0,0,0,false);
				else cam.pointAt(player_spectet.handle,0,0,0,false);
				if(coords.x === 0) coords = new mp.Vector3(posSpectet.x,posSpectet.y,posSpectet.z);
				if(radius < 10 && radius > 0.5){
					if(mp.game.controls.isControlPressed(2, 241)){
						radius += 0.5;
					}
					if(mp.game.controls.isControlPressed(2, 242)){
						radius -= 0.5;
					}
				}else{ 
					radius = 1;
				}
				let xMagnitude = mp.game.controls.getDisabledControlNormal(0,1)
				let yMagnitude = mp.game.controls.getDisabledControlNormal(0,2)
				polarAngleDeg = polarAngleDeg + xMagnitude * 10;
				if(polarAngleDeg >= 360 ){
					polarAngleDeg = 0;
				}
				azimuthAngleDeg = azimuthAngleDeg + yMagnitude * 10;
				if(azimuthAngleDeg >= 360 ){
					azimuthAngleDeg = 0;
				}
				let nextCamLocation = polar3DToWorld3D(coords, radius, polarAngleDeg, azimuthAngleDeg);
				cam.setCoord(nextCamLocation.x,  nextCamLocation.y,  nextCamLocation.z)
				player.position = new mp.Vector3(coords.x,coords.y,coords.z - 3);
			}
		}catch(e){}
	},
	"ADMIN::TIME":(hours,minutes)=>{
		if(hours != false){
			setClockEdit(false);
			mp.game.time.setClockTime(hours,minutes,0);
		}else setClockEdit(true);
	}
});
let home = {
	name: 'Создание дома',
	items: [
		{
			type: 4,
			name: 'Тип дома',
			swith: ['Обычный','Средний','Элитный','Особняк','Эконом','Трейлер']
		},
		{
			type: 5,
			name: 'Цена',
			placeholder: 'Цена дома',
		},
		{
			type: 0,
			name: 'Создать дом',
			placeholder: 'Создание дома',
			callback: 'createhome'
		}
	]
}
function getScent(scens){
	let scen = {
		name: 'Сцена',
		items: [
		]
	}
	for(let i=0;i<scens.length;i++){
			scen.items.push(
			{
				type: 0,
				name:  scens[i],
				callback: 'scens',
				callpointenct: scens[i]
			})
	}
	return{
			type: 2,
			name: 'Анимации в виде сценариев',
			infomenu: scen
		}
}
function getclothees(id,name){
	let clot = {
		name: name,
		items: [
		]
	}
	let len = player.getNumberOfDrawableVariations(id);
	for(let i=0;i<len;i++){
			clot.items.push(
			{
				type: 0,
				name:  name+i,
				callback: 'clothes',
				callpointenct: ''+id+'|'+i
			})
	}
	return{
			type: 2,
			name: name,
			infomenu: clot
		}
}
// key ;
mp.keys.bind(0xBA,true,function(){
	if(!isGUIOpen())return;
	if(!loggined|| !player.permision || !player.permision['ADMIN::MENU']) return;
	let ban = {
		name: 'Бан',
		items: [
			{
				type: 4,
				name: 'Тип бана',
				swith: ['Забанить','Забанить игрока','Забанить аккаунт игрока']
			},
			{
				type: 5,
				name: 'id игрока',
				placeholder: 'id игрока',
				type_input: 'number'
			},
			{
				type: 5,
				name: 'Причина бана',
				placeholder: 'Причина бана',
			},
			{
				type: 5,
				name: 'Время бана',
				placeholder: 'В менутах если указать 0 то бан навсегда',
				type_input: 'number'
			},
			{
				type: 0,
				name: 'Забанить',
				callback: 'ban'
			},
		]
	}
	let admin = {
		name: 'Админка',
		items: [
			{
				type: 2,
				name: 'Создать дом',
				placeholder: 'Создание дома',
				infomenu: home
			},
			{
				type: 1,
				name: 'Добавить для дома гараж',
				callback: 'ADMIN::CREATE_GARAG'
			},
			{
				type: 2,
				name: 'Забанить игрока',
				infomenu: ban
			},
		]
	}
	
	admin.items.push({
		type: 2,
		name: 'DEBAG',
		infomenu: get_debag()
	})
	createmenuv(admin);
});
callback('scens',(t)=>{
	let c = t[0][Object.keys(t[0])[0]]
	player.taskStartScenarioInPlace(c, 0, true);
})
callback('clothes',(t)=>{
	let c = t[0][Object.keys(t[0])[0]]
	c = c.split('|')
	player.setComponentVariation(parseInt(c[0]),parseInt(c[1]),0,0);
});
callback('SetColor',(t)=>{
	for(i=0;i<=player.getNumberOfPropDrawableVariations(7);i++){
		mp.events.callRemote('ColorsSet','bracelets',i,player.getNumberOfPropTextureVariations(7,i));		
	}
	
})
callback('copy_pos',(t)=>{
	let pos = player.position;
	copy(`new mp.Vector3(${pos.x},${pos.y},${getGroundZFor3dCoord(pos)}),`)
	alert('Координаты скопированы')
})
callback('copy_veh',(t)=>{
	if(!player.vehicle)return alert('Вы не сидите в машине')
	copyJSON({
		"model": player.vehicle.model,
		"pos": player.vehicle.position,
		"heading": player.vehicle.getHeading(),
	})
	alert('Конфиг машины скопирован')
})
callback('tp_waipoint',(t)=>{
	let pos = getWaypointPosition();
	mp.game.streaming.requestCollisionAtCoord(pos.x, pos.y, pos.z);
	if(pos){
		if(player.vehicle) player.vehicle.position = pos;
		else player.position = pos;
	}
	else alert('Вы непоставили waipoint',1)
})
mswith('first',(t)=>{
	player.setComponentVariation(8,t,0,0);
})
mswith('tops',(t)=>{
	player.setComponentVariation(11,t,0,0);
})
mswith('CLOTHES:TYPE_DOWN',(t)=>{
	let gender = skins[0] == player.model ? 0 :1;
	let types = [
		[0,6,36],
		[39,24,1]
	];
	player.setComponentVariation(8,types[gender][t],0,0);
})
mswith('gloves',(t)=>{
	let gender = skins[0] == player.model ? 0 :1;
	let types = clothes_shop.gloves[gender][0].Variations;
	t = types[t] 
	player.setComponentVariation(3,t,0,0);
})
mswith('ADMIN::DEBAG_TP_MARKER',(t)=>{
	let mar = mp.markers.at(t);
	player.position = mar.position;
})
let skins=[mp.game.joaat("MP_M_Freemode_01"),mp.game.joaat("MP_F_Freemode_01")];
mswith('floor',(t)=>{
	player.model = skins[t];
	mp.events.callRemote('ADMIN::CHANGE_GENDER',t)
})
function get_debag() {
	let debag = {
	name: 'DEBAG',
	items: [
		{
			type: 4,
			name: 'Пол',
			callpointenct: 'floor',
			swith: ['Мужской','Женский'],
		},
		{
			type: 1,
			name: 'Скопировать координаты',
			callback: 'copy_pos',
		},
		{
			type: 1,
			name: 'Скопировать конфиг машины',
			callback: 'copy_veh',
		},
		{
			type: 1,
			name: 'Телепортироватся на waipoin',
			callback: 'tp_waipoint',
		},
		{
			type: 1,
			name: 'Сохранить позицию',
			callback: 'ADMIN::DEBAG_SAVEPOS',
		},
		{
			type: 3,
			name: 'ТП по маркерам',
			callpointenct: 'ADMIN::DEBAG_TP_MARKER',
			max: mp.markers.length-1
		},
	]
}
	let tors = {
		name: 'Добавление торса',
		items: [
			{
				type: 3,
				name: 'Торс',
				placeholder: 'Торс',
				callpointenct: 'tops',
				max: player.getNumberOfDrawableVariations(11)
			},
			{
				type: 3,
				name: 'Перчатки',
				placeholder: 'Перчатки',
				callpointenct: 'gloves',
				max: 11
			},
			// {
			// 	type: 3,
			// 	name: 'Перед',
			// 	placeholder: 'Перед',
			// 	callpointenct: 'first',
			// 	max: 1 //player.getNumberOfDrawableVariations(8)
			// },
			{
				type: 4,
				name: 'Будет ли низ?',
				placeholder: 'test',
				swith: ['Да','Нет'],
			},
			{
				type: 3,
				name: 'type одежды',
				placeholder: 'type одежды',
				callpointenct: 'CLOTHES:TYPE_DOWN',
				max: 2
			},
			{
				type: 0,
				name:  'Добавить',
				callback: 'save_tors'
			},
		]
	}
	debag.items.push(getclothees(0,'0 '))
	debag.items.push(getclothees(1,'1 '))
	debag.items.push(getclothees(2,'2 '))
	debag.items.push(getclothees(3,'3 '))
	debag.items.push(getclothees(4,'4 '))
	debag.items.push(getclothees(5,'5 '))
	debag.items.push(getclothees(6,'6 '))
	debag.items.push(getclothees(7,'Аксессуары '))
	debag.items.push(getclothees(8,'8 '))
	debag.items.push(getclothees(9,'9 '))
	debag.items.push(getclothees(10,'10 '))
	debag.items.push(getclothees(11,'11 '))
	debag.items.push(getScent(scenarias))
	debag.items.push({
			type: 2,
			name: 'Добавление торса',
			infomenu: tors
		})
	let add_cloth = {
		name: 'Добавление одежда',
		items: [
			{
				type: 3,
				name: 'Компонент',
				placeholder: 'Компонент',
				callpointenct: 'CLOTHES:COMPONENT',
				max: 11
			},
			{
				type: 3,
				name: 'Вариация',
				placeholder: 'Вариация',
				callpointenct: 'CLOTHES:VARIATION',
				max: 11
			},
			{
				type: 5,
				name: 'Название в config',
			},
			{
				type: 5,
				name: 'type одежды',
				type_input: 'number'
			},
			{
				type: 0,
				name:  'Добавить',
				callback: 'CLOTHES:ADD'
			},
		]
	}
	let add_props = {
		name: 'Добавление props',
		items: [
			{
				type: 3,
				name: 'Компонент',
				placeholder: 'Компонент',
				callpointenct: 'PROPS:COMPONENT',
				max: 7
			},
			{
				type: 3,
				name: 'Вариация',
				placeholder: 'Вариация',
				callpointenct: 'PROPS:VARIATION',
				max: 11
			},
			{
				type: 5,
				name: 'Название в config',
			},
			{
				type: 0,
				name:  'Добавить',
				callback: 'PROPS:ADD'
			},
		]
	}
	debag.items.push({
			type: 2,
			name: 'Добавление одежды',
			infomenu: add_cloth
		})
	debag.items.push({
			type: 2,
			name: 'Добавление PROPS',
			infomenu: add_props
		})
	// debag.items.push({
	// 		type: 0,
	// 		name: 'Цвет',
	// 		callback: 'SetColor'
	// 	})
	return debag;
}
mswith('CLOTHES:COMPONENT',(t)=>{
	editmaxMenuv(1,player.getNumberOfDrawableVariations(t))
})
callback('CLOTHES:ADD',(t,c)=>{
	// for(i=0;i<=player.getNumberOfDrawableVariations(7);i++){
	// 	mp.events.callRemote('ColorsSet','accessories',i,player.getNumberOfTextureVariations(7,i));		
	// }
	c[0] = parseInt(c[0])
	c[1] = parseInt(c[1])
	chat(''+player.getNumberOfTextureVariations(c[0],c[1]))
	mp.events.callRemote('CLOTHES:ADD',c[1],c[2],player.getNumberOfTextureVariations(c[0],c[1]),parseInt(c[3]));
})
callback('save_tors',(t,c)=>{
	// for(i=0;i<=player.getNumberOfDrawableVariations(7);i++){
	// 	mp.events.callRemote('ColorsSet','accessories',i,player.getNumberOfTextureVariations(7,i));		
	// }
	c[0] = parseInt(c[0])
	c[1] = parseInt(c[1])
	let colors = player.getNumberOfTextureVariations(11,c[0])
	chat(''+colors)
	mp.events.callRemote('save_tors',c[0],c[1],c[2],colors,parseInt(c[3]));
})
mswith('PROPS:COMPONENT',(t)=>{
	editmaxMenuv(1,player.getNumberOfPropDrawableVariations(t))
})
callback('PROPS:ADD',(t,c)=>{
	// for(i=0;i<=player.getNumberOfDrawableVariations(7);i++){
	// 	mp.events.callRemote('ColorsSet','accessories',i,player.getNumberOfTextureVariations(7,i));		
	// }
	c[0] = parseInt(c[0])
	c[1] = parseInt(c[1])
	chat(''+player.getNumberOfPropTextureVariations(c[0],c[1]))
	mp.events.callRemote('CLOTHES:ADD',c[1],c[2],player.getNumberOfPropTextureVariations(c[0],c[1]));
})