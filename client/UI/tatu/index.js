let tatto = require('../../../packages/configs/tatto.json').tattos; 
let curent_clothes;
mp.game.object.doorControl(543652229, -1155.454, -1424.008, 5.046147, false, 0.0, 50.0, 0); 
let tattoos;
let tattoSalon = [
    {
        posMarker: new mp.Vector3(-1153.7213134765625,-1424.9027099609375,3.9544625282287598),
        posTatu: new mp.Vector3(-1155.3511962890625,-1426.6893310546875,4.954462766647339),
        heading: 336,
    },
    {
        posMarker: new mp.Vector3(1322.818115234375,-1651.691162109375,51.27509307861328),
        posTatu: new mp.Vector3(1321.466796875,-1653.370361328125,52.27521514892578),
        heading: 351,
    },
    {
        posMarker: new mp.Vector3(-3169.70947265625,1074.8521728515625,19.829172134399414),
        posTatu: new mp.Vector3(-3169.5986328125,1077.1939697265625,20.829172134399414),
        heading: 185,
    },
    {
        posMarker: new mp.Vector3(321.49371337890625,180.5518341064453,102.58654022216797),
        posTatu: new mp.Vector3(324.3706359863281,180.12481689453125,103.58654022216797),
        heading: 146,
    },
    {
        posMarker: new mp.Vector3(-290.84686279296875,6198.62744140625,30.487106323242188),
        posTatu: new mp.Vector3(-294.8183288574219,6200.22802734375,31.488283157348633),
        heading: 249
    },
    {
        posMarker: new mp.Vector3(1861.5887451171875,3750.1767578125,32.03186798095703),
        posTatu: new mp.Vector3(1865.0101318359375,3747.16162109375,33.03186798095703),
        heading: 48
    },
]
exports.tatus = tattoSalon;
tattoSalon.forEach((tato)=>{
    let tatu_shop = {
		type: 1,
		color:  [0,255,0,60],
		position: tato.posMarker,
		scale: 1.5
	}
	mp.blips.new(75, tato.posMarker,{
		name: 'Тату салон',
		color: 0,
		dimension: 0,
		shortRange: true,
		alpha: 255
	})
	createMarker(tatu_shop,()=>{
        player.position = tato.posTatu;
        player.setRotation(0, 0, tato.heading, 0, true);
        player.taskStartScenarioInPlace("WORLD_HUMAN_GUARD_STAND", 0, true);
        mp.events.call('TATU::OPEN');
    })
});
mp.events.add({
    "TATU::END":()=>{
        player.clearTasksImmediately();
		guitoggle(false);
		setClothes(curent_clothes);
		mp.events.call('cameradefault');
		mp.events.callRemote("PLAYER::CHANGE_MY_DIMENSION",false)
        mp.events.call("TATU::CURENT_TATUS");
    },
    "TATU::OPEN":()=>{
        let menu = {
			name: 'Тату салон',
			exitmenu_callback: 'TATU::END',
			items: [
				{
					type: 2,
					name: 'Голова',
					infomenu: getMenuvTatu('Голова','головы','head'),
                },
				{
					type: 2,
					name: 'Торс',
					infomenu: getMenuvTatu('Торс','торса','torso'),
                },
                {
					type: 2,
					name: 'Левая рука',
					infomenu: getMenuvTatu('Левая рука','левой руки','left_arm'),
                },
                {
					type: 2,
					name: 'Правая рука',
					infomenu: getMenuvTatu('Правая рука','правой руки','right_arm'),
                },
                {
					type: 2,
					name: 'Правая нога',
					infomenu: getMenuvTatu('Правая нога','правой ногм','right_leg'),
                },
                {
					type: 2,
					name: 'Левая нога',
					infomenu: getMenuvTatu('Левая нога','левой ноги','left_leg'),
                },
            ]
        }
        curent_clothes = getClothes();
		clearClothes();
		createmenuv(menu);
		guitoggle(true,true);
		cursor(false);
		mp.events.callRemote("PLAYER::CHANGE_MY_DIMENSION",true)
        mp.events.call('TATU::CURENT_TATUS')
    },
    "TATU::CURENT_TATUS":(ignor = '')=>{
        player.clearDecorations();
        for(tat in tattoos){
            if(ignor != tat){
                let item = tattoos[tat];
                player.setDecoration(mp.game.joaat(item.collection),mp.game.joaat(item.hash))
            }
        }
    },
    "TATTOOS::SET":(json,notParse)=>{
        if(!notParse)tattoos = JSON.parse(json);
        else tattoos = json;
    }
})


let getMenuvTatu = (name,title,tato)=>{
    let gender = mp.game.joaat("MP_M_Freemode_01") === player.model ? 0 : 1;
    let tattus = tatto[tato];
    let items = [
        {
            type: 0,
            name: 'Стереть тату с '+title,
            placeholder: 'Степеть тату с '+title+' за 20$',
            callback: 'TATU::CLEAR',
            callpointenct: tato
        }
    ];
    tattus.forEach((item)=>{
        if((gender == 0 && item.HashNameMale) || (gender == 1 && item.HashNameFemale)){
            let hash = gender == 0 ? item.HashNameMale : item.HashNameFemale;
            let nameTatto = mp.game.ui.getLabelText(item.Name)
            let price = parseInt(item.Price/100)
            items.push({
                type: 0,
                name: `${nameTatto != 'NULL' ? nameTatto.replace(/'/g,"") : item.LocalizedName}`,
                placeholder: `Цена тату ${price}`,
                callback: 'TATU::BUY',
                callpointenct: [item.collection,hash,price,tato],
            })
        }
    })
    let menu = {
        name: name,
        backmenu_callback: "TATU::CURENT_TATUS",
        items: items
    }
    return menu;
}
calpointect("TATU::BUY",(array)=>{
    array = array.split(',');
    mp.events.call('TATU::CURENT_TATUS',array[3])
    player.setDecoration(mp.game.joaat(array[0]),mp.game.joaat(array[1]));
})
calpointect("TATU::CLEAR",(array)=>{
    mp.events.call('TATU::CURENT_TATUS',array)
})