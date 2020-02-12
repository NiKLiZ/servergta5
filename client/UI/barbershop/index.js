mp.game.object.doorControl(145369505, -822.4442, -188.3924, 37.81895, false, 0.0, 50.0, 0); 
mp.game.object.doorControl(-1663512092, -823.2001, -187.0831, 37.81895, false, 0.0, 50.0, 0); 
mp.game.object.doorControl(-1844444717, -29.86917, -148.1571, 57.22648, false, 0.0, 50.0, 0); 
mp.game.object.doorControl(-1844444717, 1932.952, 3725.154, 32.9944, false, 0.0, 50.0, 0); 
mp.game.object.doorControl(2450522579, 132.5569, -1710.996, 29.44157, false, 0.0, 50.0, 0); 
let barbers = [
    {
        posMarker: new mp.Vector3(140.10513305664062,-1706.5247802734375,28.291610717773438),
        posSeat: new mp.Vector3(139.52621459960938,-1707.9526904296875,28.672915267944336),
        headingSeat: 225
    },
    {
        posMarker: new mp.Vector3(-1279.589111328125,-1118.5706787109375,5.990115165710449),
        posSeat: new mp.Vector3(-1281.30859375,-1118.875,6.7625579833984375),
        headingSeat: 178
    },
    {
        posMarker: new mp.Vector3(-816.8778076171875,-183.98509216308594,36.56891632080078),
        posSeat: new mp.Vector3(-816.31865234375,-183.080029296875,37.04500427246094),
        headingSeat: 33
    },
    {
        posMarker: new mp.Vector3(-35.26441955566406,-154.84266662597656,56.07652282714844),
        posSeat: new mp.Vector3(-35.18589630126953,-153.2618927001953,56.5612956237793),
        headingSeat: 57
    },
    {
        posMarker: new mp.Vector3(1215.4534912109375,-474.8625183105469,65.20804595947266),
        posSeat: new mp.Vector3(1213.311767578125,-474.919287109375,65.58460388183594),
        headingSeat: 169
    },
    {
        posMarker: new mp.Vector3(1931.3349609375,3733.87939453125,31.84444236755371),
        posSeat: new mp.Vector3(1932.5636962890625,3732.612548828125,32.321192932128906),
        headingSeat: 302
    },
    {
        posMarker: new mp.Vector3(-276.2193908691406,6224.6943359375,30.695524215698242),
        posSeat: new mp.Vector3(-278.4482421875,6225.7919921875,31.461423873901367),   
        headingSeat: 128
    } 
]
exports.barbershop = barbers;
let hair_color = 0;
let hair_highlights = 0;
let curentHairData = [];
let prices;
let curentOverlayEdit = {};
let propsClothes = [];
let appearanceColor;
let appearanceHighlights;
let appearanceLense;
let appearanceOverlays;
barbers.forEach((barber)=>{
    let barber_shop = {
		type: 1,
		color:  [0,255,0,60],
		position: barber.posMarker,
		scale: 1.5
	}
	mp.blips.new(71, barber.posMarker,{
		name: 'Парикмахерская',
		color: 0,
		dimension: 0,
		shortRange: true,
		alpha: 255
	})
	createMarker(barber_shop,()=>{
        player.position = barber.posSeat;
        player.setRotation(0, 0, barber.headingSeat, 0, true);
        player.taskStartScenarioInPlace('PROP_HUMAN_SEAT_CHAIR_UPRIGHT',0,true)
        mp.events.callRemote('BARBERSHOP::OPEN');
    })
});
mp.events.add({
    "BARBERSHOP::START":(price)=>{
        propsClothes = [];
        for(let i=0;i<3;i++)propsClothes.push({
            drawable:player.getPropIndex(i),
            color: player.getPropTextureIndex(i)
        });
        player.clearAllProps();
        prices = JSON.parse(price);
        let gender = mp.game.joaat("MP_M_Freemode_01") === player.model ? 0 : 1;
        hair_color = 0;
        hair_highlights = 0;
        curentlense = appearanceLense
        curentHairData = [player.getDrawableVariation(2),appearanceColor,appearanceHighlights];
        let hair = {
            name: 'Волосы',
            backmenu_callback: "BARBERSHOP::BACK_HAIR",
			items: [
                {
					type: 3,
					name: 'Причёска',
					callpointenct: 'BARBERSHOP::HAIR',
					max: !gender  ? 36 : 38
                },
                {
					type: 3,
					name: 'Цвет причёски',
					callpointenct: 'BARBERSHOP::HAIR_COLOR',
					max: 63
                },
                {
					type: 3,
					name: 'Милирование',
					callpointenct: 'BARBERSHOP::HIGHLIGHTS',
					max: 63
				},
				{
					type: 0,
                    name: 'Подстричься',
                    placeholder: `Цена ${prices.hair[gender][0]}$`,
					callback: 'BARBERSHOP::BUY_HAIR',
				},
			]
        }
        let lenses = {
            name: 'Линзы',
            backmenu_callback: "BARBERSHOP::BACK_HAIR",
			items: [
                {
					type: 3,
					name: 'Линза',
					callpointenct: 'BARBERSHOP::LENSES_SELECT',
					max: 31
                },
				{
					type: 0,
                    name: 'Купить',
                    placeholder: `Цена ${prices.lenses[0]}$`,
					callback: 'BARBERSHOP::BUY_LENSES',
				},
			]
		}
        let barber = {
			name: 'Парикмахерская',
			exitmenu_callback: 'BARBERSHOP::END',
			items: [
				{
					type: 2,
					name: 'Волосы',
					infomenu: hair,
					callpointenct: '0',
					cswitch: 'BARBERSHOP::HAIR'
                },
                {
					type: 2,
					name: 'Линзы',
					infomenu: lenses,
					callpointenct: '0',
					cswitch: 'BARBERSHOP::LENSES_SELECT'
                },
                {
					type: 2,
					name: 'Брови',
					infomenu: getMenuvOverlay('Брови','Бровь','EYEBROWS',2),
					callback: "BARBERSHOP::EYEBROWS_OPEN"
                },
                {
					type: 2,
					name: 'Помада',
					infomenu: getMenuvOverlay('Помада','Помада','LIPSTICK',8),
					callback: 'BARBERSHOP::LIPSTICK_OPEN'
                },
                {
					type: 2,
					name: 'Борода',
					infomenu: getMenuvOverlay('Борода','Борода','FACIAL_HAIR',1),
					callback: 'BARBERSHOP::FACIAL_HAIR_OPEN'
                },
                {
					type: 2,
					name: 'Макияж',
					infomenu: getMenuvOverlay('Макияж','Макияж','MAKEUP',4),
					callback: 'BARBERSHOP::MAKEUP_OPEN'
                },
                {
					type: 2,
					name: 'Румяна',
					infomenu: getMenuvOverlay('Румяна','Румяна','BLUSH',5),
					callback: 'BARBERSHOP::BLUSH_OPEN'
                },
            ]
        }
        createmenuv(barber)
        guitoggle(true,true);
        cursor(false);
        mp.events.callRemote("PLAYER::CHANGE_MY_DIMENSION",true)
    },
    "APPEARANCE::COLOR":(color)=>{
        appearanceColor = color;
    },
    "APPEARANCE::HIGHLIGHTS":(color)=>{
        appearanceHighlights = color;
    },
    "APPEARANCE::LENSE":(color)=>{
        appearanceLense = color;
    },
    "OVERLAYS::SET":(overlays,notParse)=>{
        if(!notParse)appearanceOverlays = JSON.parse(overlays);
        else appearanceOverlays = overlays;
    },
    "BARBERSHOP::END":()=>{
        player.position = player.getOffsetFromInWorldCoords(0,0.39,0);
        player.clearTasksImmediately();
        guitoggle(false);
        mp.events.callRemote("PLAYER::CHANGE_MY_DIMENSION",false)
        mp.events.call("BARBERSHOP::BACK_HAIR");
        mp.events.call("BARBERSHOP::BACK_OVERLAYS");
        propsClothes.forEach((prop,i)=>{
            player.setPropIndex(i,prop.drawable,prop.color,false)
        })
    },
    "BARBERSHOP::BACK_HAIR":()=>{
        player.setComponentVariation(2,curentHairData[0],0,0);
        player.setHairColor(curentHairData[1],curentHairData[2]);
    },
    "BARBERSHOP::BACK_OVERLAYS":()=>{
        let overlays = appearanceOverlays;
        overlays.forEach((overlay,i)=>{
            player.setHeadOverlay(i, overlay.draw, overlay.opacity, overlay.color_one,overlay.color_two);
        })
    },
    "BARBERSHOP::BUY_SUCCESS_HAIR":(...arr)=>{
        curentHairData = arr;
    },
    "BARBERSHOP::BUY_SUCCESS_LENSES":(lense)=>{
        curentlense = lense;
    }
})
mswith("BARBERSHOP::HAIR",(i)=>{
    let gender = mp.game.joaat("MP_M_Freemode_01") === player.model ? 0 : 1;
    if(gender==0 && i >= 23) i++;
    if(gender==1 && i >= 24) i++;
    player.setComponentVariation(2,i,0,0);
    player.setHairColor(hair_color,hair_highlights);
    editPlaceholderMenuv(3,`Цена ${prices.hair[gender][i]}$`)
});
mswith("BARBERSHOP::HAIR_COLOR",(i)=>{
    hair_color = i;
    player.setHairColor(i,hair_highlights);
});
mswith("BARBERSHOP::HIGHLIGHTS",(i)=>{
    player.setHairColor(hair_color,i);
    hair_highlights = i;
});
mswith("BARBERSHOP::LENSES_SELECT",(i)=>{
    player.setEyeColor(i);
    editPlaceholderMenuv(1,`Цена ${prices.lenses[i]}$`)
})
let getMenuvOverlay = (name,title,mswithCallback,indexOverlay)=>{
    let maxtype = mp.game.ped.getNumHeadOverlayValues(indexOverlay);
    let menu = {
        name: name,
        backmenu_callback: 'BARBERSHOP::BACK_OVERLAYS',
        items: [
            {
                type: 3,
                name: title,
                callpointenct: "BARBERSHOP::"+mswithCallback+"_TYPE",
                max: maxtype
            },
            {
                type: 3,
                name: 'Насыщенность',
                callpointenct: "BARBERSHOP::"+mswithCallback+"_OPACITY",
                max: 10,
                index: 10
            },
            {
                type: 3,
                name: 'Первый цвет',
                callpointenct: "BARBERSHOP::"+mswithCallback+"_COLOR_ONE",
                max: 55
            },
            {
                type: 3,
                name: 'Второй цвет',
                callpointenct: "BARBERSHOP::"+mswithCallback+"_COLOR_TWO",
                max: 55
            },
            {
                type: 0,
                name: 'Сделать',
                callback: "BARBERSHOP::"+mswithCallback+"_BUY",
                placeholder: `Цена ${prices.overlay[indexOverlay][0]}$`,
            },
        ]
    }
    mswith("BARBERSHOP::"+mswithCallback+"_TYPE",(i)=>{
        editPlaceholderMenuv(4,`Цена ${prices.overlay[indexOverlay][i]}$`);
        if(i === 0) i = 255;
        else i--;
        curentOverlayEdit.draw = i;
        player.setHeadOverlay(indexOverlay, curentOverlayEdit.draw, curentOverlayEdit.opacity, curentOverlayEdit.color_one,curentOverlayEdit.color_two);
    })
    mswith("BARBERSHOP::"+mswithCallback+"_OPACITY",(i)=>{
        curentOverlayEdit.opacity = i/10;
        player.setHeadOverlay(indexOverlay, curentOverlayEdit.draw, curentOverlayEdit.opacity, curentOverlayEdit.color_one,curentOverlayEdit.color_two);
    })
    mswith("BARBERSHOP::"+mswithCallback+"_COLOR_ONE",(i)=>{
        curentOverlayEdit.color_one = i;
        player.setHeadOverlay(indexOverlay, curentOverlayEdit.draw, curentOverlayEdit.opacity, curentOverlayEdit.color_one,curentOverlayEdit.color_two);
    })
    mswith("BARBERSHOP::"+mswithCallback+"_COLOR_TWO",(i)=>{
        curentOverlayEdit.color_two = i;
        player.setHeadOverlay(indexOverlay, curentOverlayEdit.draw, curentOverlayEdit.opacity, curentOverlayEdit.color_one,curentOverlayEdit.color_two);
    });
    callback("BARBERSHOP::"+mswithCallback+"_OPEN",()=>{
        curentOverlayEdit = {draw: 255,opacity: 1,color_one: 0,color_two: 0}
        player.setHeadOverlay(indexOverlay, curentOverlayEdit.draw, curentOverlayEdit.opacity, curentOverlayEdit.color_one,curentOverlayEdit.color_two);
    })
    callback("BARBERSHOP::"+mswithCallback+"_BUY",(json,arr)=>{
        arr = arr.map((item)=>{
            return parseInt(item);
        })
        mp.events.callRemote("BARBERSHOP::OVERLAY_BUY",indexOverlay,JSON.stringify(curentOverlayEdit))
    })
    return menu;
}