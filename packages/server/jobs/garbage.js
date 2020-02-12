let parking = require('../parking/class.js');
let garbage = [
    {
        markerPos: new mp.Vector3(736.2964477539062,-2017.3184814453125,28.287431716918945),
        garbagePos: [
            new mp.Vector3(741.1227416992188,-2031.68896484375,28.29204559326172),
        ]
    },
    {
        markerPos: new mp.Vector3(843.3663940429688,-1979.011474609375,28.293710708618164),
        garbagePos: [
            new mp.Vector3(851.5335693359375,-1975.6051025390625,28.301340103149414),
        ]
    },
    {
        markerPos: new mp.Vector3(891.046630859375,-1570.5931396484375,29.852298736572266),
        garbagePos: [
            new mp.Vector3(897.1201782226562,-1578.47021484375,29.789188385009766), 
        ]
    },
    {
        markerPos:new mp.Vector3(86.23018646240234,-1310.283935546875,28.221864700317383),
        garbagePos: [
            new mp.Vector3(93.90751647949219,-1307.4449462890625,28.29584312438965),
        ]
    },
    {
        markerPos: new mp.Vector3(-29.736019134521484,-1024.552490234375,27.85028648376465),
        garbagePos: [
            new mp.Vector3(-25.70853614807129,-1033.7183837890625,27.803403854370117),
        ]
    },
    {
        markerPos: new mp.Vector3(-29.736019134521484,-1024.552490234375,27.85028648376465),
        garbagePos: [
            new mp.Vector3(-25.70853614807129,-1033.7183837890625,27.803403854370117),
        ]
    },
    {
        markerPos: new mp.Vector3(34.88857650756836,-1015.260986328125,28.46513557434082),
        garbagePos: [
            new mp.Vector3(41.07157897949219,-1017.7679443359375,28.502967834472656),
        ]
    },
    {
        markerPos: new mp.Vector3(162.9535675048828,-1075.845458984375,28.19236183166504),
        garbagePos: [
            new mp.Vector3(173.24778747558594,-1078.2342529296875,28.195859909057617),
        ]
    },
    {
        markerPos: new mp.Vector3(335.7336730957031,-1062.5106201171875,28.319297790527344),
        garbagePos: [
            new mp.Vector3(335.7886657714844,-1073.2728271484375,28.551551818847656),
        ]
    },
    {
        markerPos: new mp.Vector3(285.8965148925781,-902.439453125,27.786684036254883),
        garbagePos: [
            new mp.Vector3(295.7863464355469,-905.6842651367188,28.292875289916992),
        ]
    },
    {
        markerPos: new mp.Vector3(-552.104248046875,-703.8549194335938,32.166236877441406),
        garbagePos: [
            new mp.Vector3(-561.27783203125,-703.9243774414062,32.01763153076172),
        ]
    },
    {
        markerPos: new mp.Vector3(-1360.9066162109375,-664.6776733398438,25.448928833007812),
        garbagePos: [
            new mp.Vector3(-1367.032470703125,-666.892578125,25.68109703063965),
        ]
    },
]
let posWarehouse = new mp.Vector3(1513.7003173828125,-2146.2490234375,76.15031433105469);
mp.events.addCommand('savegarbage', (player, _, vehName) => {
	if(!player.permision['PIZA::SAVE_VEH']) return player.alert(`У вас нет прав`,1);
	let veh = {
				"model": "trash2",
				"pos": player.vehicle.position,
				"heading": player.vehicle.rotation.z,
				"color": [[0, 0, 0],[0, 0, 0]]
			}
	mp.configs.garbage.vehs.push(veh);
	mp.configs.garbage.save();
})

let park = new parking(mp.configs.garbage.vehs,{
    garbage: true,
})
mp.events.add({
    "GARBAGE::START":(player)=>{
        if(!player.isWorkUp()) return;
        if(!player.testRightDrive())return ;
        let veh = park.targetVeh(player);
        if(!veh)return player.alert('Все машины заняты ')
        let garb = getPointGarbage(player)
        player.garb = garb;
        player.call('GARBAGE::START',[JSON.stringify(garb)])
        player.garbage = true;
        player.alert('Садитесь в мусоровоз')
        player.garbageBag = 0;
        player.garbageIsBag = false;

    },
    "GARBAGE::STOP":(player)=>{
        player.call("GARBAGE::STOP");
        player.garbage = false;
        player.pointWarehouse = false;
        let money = player.garbageBag*20;
        if(money){
            player.editMoney(money,'Работа мусоровозом');
            player.alert(`Вам заплатили ${money}`)
        }
        player.removeAttachment('bagTrash');
        player.clearParking(true);
    },
    "GARBAGE::FINISH_JOB":(player)=>{
        player.alert('Вы закончили работу мусоровоза')
        mp.events.call('GARBAGE::STOP',player)
    },
    "GARBAGE::PICKED_GARBAGE":(player,id,markerFinish)=>{
        if(player.garbageIsBag)return player.alert('Отнесите мусор')
        player.call('GARBAGE::DESTROY_GARBAGE_BAG',[id])
        player.alert('Вы взяли мусор')
        player.garbageIsBag = true;
        player.isLastTrash = markerFinish;
        player.call('GARBAGE::CREATE_MARKER_TANK')
        player.addAttachment('bagTrash')
    },
    "GARBAGE::OPEN_TANK":(player)=>{
        let veh = player.parking;
        veh.toggledor(5);
    },
    "GARBAGE::TANK_PUT_GARBAGE":(player,id)=>{
        if(!player.garbageIsBag)return player.alert('Возьмите мусор')
        let veh = player.parking;
        if(!veh.isOpenDoor(5))return player.alert('Сначала откройте у машины бак, а только потом складывайте мусор')
        player.garbageIsBag = false;
        player.removeAttachment('bagTrash');
        player.garbageBag++;
        if(player.garbageBag == 10){
            player.call('GARBAGE::DESTROY_MARKER_TANK')
            player.alert('Машина забита. Езжайте чтобы разгрузить машину');
            player.call('GARBAGE::CREATE_MARKER_WAREHOUSE',[JSON.stringify(posWarehouse)])
            player.pointWarehouse = true;
        }else{
            if(player.isLastTrash){
                player.call('GARBAGE::DESTROY_MARKER_TANK')
                player.alert('Весь муcор собран, отправляйтесь к следующей точке')
                let garb = getPointGarbage(player)
                player.garb = garb;
                player.call('GARBAGE::POINT_CREATE',[JSON.stringify(garb)])
            }
        }
    },
    'GARBAGE::RELOAD':(player)=>{
        let garb = getPointGarbage(player)
        player.garb = garb;
        player.garbageBag = 0;
        player.call('GARBAGE::POINT_CREATE',[JSON.stringify(garb)])
    },
    "vehicleSirenToggle": (vehicle, toggle) => {
        if(vehicle.target){
            let player = vehicle.target;
            if(player.garbage && player.pointWarehouse && player.position.dist(posWarehouse) <= 4){
                player.call('GARBAGE::DESTROY_MARKER_WAREHOUSE')
                player.pointWarehouse = false;
                player.alert('Вы разгрузили машину. Зарплата 200$')
                player.garbageBag = 0;
                player.editMoney(200,'Работа мусоровозом');
                let menu = {
                    name: 'Мусоровоз',
                    exitmenu_callback: 'BUS::END_JOB',
                    items: [
                        {
                            type: 1,
                            name: 'Продолжить путь',
                            callback_remote:  'GARBAGE::RELOAD',
                            placeholder: 'Нажми Enter для продолжения работы'
                        },
                        {
                            type: 1,
                            name: 'Закончить работу',
                            callback: 'GARBAGE::CREATE_MARKER_STOP',
                            placeholder: 'Закончить работу'
                        }
                    ]
                };
                player.createmenuv(menu);
            }
        }
    },
});

let getPointGarbage = (player)=>{
    let garbs = garbage.filter((item)=>{
        if(item.markerPos.dist(player.position) < 3000)return true;
    });
    let garb = garbs[Math.floor(Math.random()*garbs.length)];
    if(garb == player.garb)return getPointGarbage(player);
    return garb;
}