let incasatorMission = mp.debag ? 0 : 1;
let atms = [
    {
        atmPos: new mp.Vector3( 1703.13, 6426.783, 32.730),
        parkingPos:new mp.Vector3(1705.833740234375,6420.41943359375,31.63671875),
    },
    {
        atmPos:  new mp.Vector3( 174.672, 6637.218, 30.784),
        parkingPos:new mp.Vector3(181.14453125,6632.44482421875,30.575613021850586),
    },
    {
        atmPos:  new mp.Vector3(155.430, 6641.991, 30.784),
        parkingPos:new mp.Vector3(150.85333251953125,6627.53173828125,30.745464324951172),
    },
    { 
        atmPos: new mp.Vector3(285.66619873046875,143.78782653808594,103.17134857177734),
        parkingPos:new mp.Vector3(288.65350341796875,150.28460693359375,103.02014923095703), 
    },

    { 
        atmPos: new mp.Vector3(155.3655242919922,6642.4599609375,30.61435317993164),
        parkingPos:new mp.Vector3(147.4958038330078,6638.4208984375,30.599374771118164), 
    },

    { 
        atmPos: new mp.Vector3(174.46066284179688,6637.408203125,30.57307243347168),
        parkingPos:new mp.Vector3(181.6173553466797,6632.08740234375,30.57823944091797), 
    },

    { 
        atmPos: new mp.Vector3(1701.6121826171875,6426.27685546875,31.637767791748047),
        parkingPos:new mp.Vector3(1692.9215087890625,6424.51904296875,31.617650985717773),
    },

    { 
        atmPos: new mp.Vector3(1735.3687744140625,6410.9052734375,34.0372428894043),
        parkingPos:new mp.Vector3(1730.8270263671875,6402.46826171875,33.64369583129883),
    },

    { 
        atmPos: new mp.Vector3(1702.8731689453125,4933.2802734375,41.063655853271484),
        parkingPos:new mp.Vector3(1697.3546142578125,4935.89208984375,41.078121185302734),
    },

    { 
        atmPos: new mp.Vector3(1967.9840087890625,3743.828369140625,31.343761444091797),
        parkingPos:new mp.Vector3(1972.27587890625,3746.7109375,31.298233032226562),
    },

    { 
        atmPos: new mp.Vector3(2564.90625,2584.911376953125,37.083126068115234),
        parkingPos:new mp.Vector3(2550.2685546875,2614.273193359375,36.94485092163086),
    },

    { 
        atmPos: new mp.Vector3(2559.14794921875,351.0193176269531,107.62150573730469),
        parkingPos:new mp.Vector3(2555.374755859375,344.08978271484375,107.46857452392578),
    },

    { 
        atmPos: new mp.Vector3(2557.994384765625,389.4826354980469,107.62298583984375),
        parkingPos:new mp.Vector3(2565.631591796875,385.6259765625,107.46327209472656),
    },

    { 
        atmPos: new mp.Vector3(1077.7425537109375,-775.7781372070312,57.215110778808594),
        parkingPos:new mp.Vector3(1067.5504150390625,-781.5221557617188,57.26271438598633),
    },

    { 
        atmPos: new mp.Vector3(1138.676025390625,-468.99072265625,65.73181915283203),
        parkingPos:new mp.Vector3(1144.8050537109375,-471.1997375488281,65.55899047851562),
    },

    { 
        atmPos: new mp.Vector3(1166.9481201171875,-456.48040771484375,65.78499603271484),
        parkingPos:new mp.Vector3(1162.9111328125,-463.27740478515625,65.63517761230469),
    },

    { 
        atmPos: new mp.Vector3(1154.0697021484375,-326.716064453125,68.2051010131836),
        parkingPos:new mp.Vector3(1157.2589111328125,-331.8667297363281,67.84144592285156),
    },

    { 
        atmPos: new mp.Vector3(-164.74256896972656,232.73193359375,93.9269027709961),
        parkingPos:new mp.Vector3(-143.45343017578125,232.0895538330078,93.96138763427734),
    },

    { 
        atmPos: new mp.Vector3(-1826.8922119140625,785.210693359375,137.29434204101562),
        parkingPos:new mp.Vector3(-1822.18359375,783.3963623046875,136.9742431640625),
    },

    { 
        atmPos: new mp.Vector3(-2072.852294921875,-317.1029357910156,12.315975189208984),
        parkingPos:new mp.Vector3(-2076.484375,-316.1280212402344,12.149273872375488),
    },

    { 
        atmPos: new mp.Vector3(-2975.39013671875,380.0945129394531,13.998079299926758),
        parkingPos:new mp.Vector3(-2982.98876953125,380.69720458984375,13.819669723510742),
    },

    { 
        atmPos: new mp.Vector3(-3144.181640625,1127.5228271484375,19.855201721191406),
        parkingPos:new mp.Vector3(-3141.405517578125,1117.3740234375,19.702037811279297),
    },

    { 
        atmPos: new mp.Vector3(-1305.171142578125,-706.1846923828125,24.322437286376953),
        parkingPos:new mp.Vector3(-1297.162353515625,-698.010009765625,23.696266174316406),
    },

    { 
        atmPos: new mp.Vector3(-717.3629760742188,-915.6527099609375,18.215599060058594),
        parkingPos:new mp.Vector3(-715.0775756835938,-920.0628051757812,18.01390838623047),
    },

    { 
        atmPos: new mp.Vector3(-526.5576782226562,-1222.6968994140625,17.459980010986328),
        parkingPos:new mp.Vector3(-525.091552734375,-1219.576171875,17.253263473510742),
    },

    { 
        atmPos: new mp.Vector3(-845.8694458007812,-341.0317077636719,37.68025588989258),
        parkingPos:new mp.Vector3(-828.4656982421875,-333.7313537597656,36.338138580322266),
    },

    { 
        atmPos: new mp.Vector3(-56.554534912109375,-1752.32373046875,28.421005249023438),
        parkingPos:new mp.Vector3(-51.860755920410156,-1761.76708984375,28.09754180908203),
    },

    { 
        atmPos: new mp.Vector3(-1571.389892578125,-546.86376953125,33.960044860839844),
        parkingPos:new mp.Vector3(-1572.637451171875,-542.131591796875,34.2505989074707),
    },
    { 
        atmPos: new mp.Vector3(288.7394714355469,-1256.924560546875,28.440767288208008),
        parkingPos:new mp.Vector3(284.5204162597656,-1256.6707763671875,28.263832092285156),
    },

    { 
        atmPos: new mp.Vector3(1686.4945068359375,4815.79150390625,41.009483337402344),
        parkingPos:new mp.Vector3(1678.626708984375,4816.49072265625,41.00288772583008),
    },

    { 
        atmPos: new mp.Vector3(-301.7518310546875,-830.4111328125,31.207162857055664),
        parkingPos:new mp.Vector3(-303.1999206542969,-840.0094604492188,30.539608001708984),
    },

    { 
        atmPos: new mp.Vector3(4.552569389343262,-919.5533447265625,28.558523178100586),
        parkingPos:new mp.Vector3(-4.4607744216918945,-923.2587890625,28.43665885925293),
    },

    { 
        atmPos: new mp.Vector3(-283.2929992675781,6225.8525390625,30.49358367919922),
        parkingPos:new mp.Vector3(-284.19952392578125,6217.8642578125,30.369396209716797),
    },

    { 
        atmPos: new mp.Vector3(-133.1897430419922,6366.32421875,30.475473403930664),
        parkingPos:new mp.Vector3(-140.7103729248047,6365.04052734375,30.490619659423828),
    },

    { 
        atmPos: new mp.Vector3(-95.14324951171875,6456.814453125,30.45767593383789),
        parkingPos:new mp.Vector3(-89.26421356201172,6450.8564453125,30.348094940185547),
    },

    { 
        atmPos: new mp.Vector3(1822.4053955078125,3683.401611328125,33.276763916015625),
        parkingPos:new mp.Vector3(1818.5960693359375,3688.872314453125,33.22425842285156),
    },

    { 
        atmPos: new mp.Vector3(158.47254943847656,233.8909149169922,105.6260757446289),
        parkingPos:new mp.Vector3(167.42796325683594,222.0635528564453,105.1631851196289),
    },

    { 
        atmPos: new mp.Vector3(-1205.4703369140625,-324.6642150878906,36.85823059082031),
        parkingPos:new mp.Vector3(-1193.1373291015625,-318.1488342285156,36.710750579833984),
    },

    { 
        atmPos: new mp.Vector3(-2956.910888671875,488.0746765136719,14.468912124633789),
        parkingPos:new mp.Vector3(-2959.5009765625,492.8962097167969,14.304267883300781),
    },

    { 
        atmPos: new mp.Vector3(-3044.071044921875,594.9252319335938,6.7367682456970215),
        parkingPos:new mp.Vector3(-3051.00048828125,597.29931640625,6.449463844299316),
    },

    { 
        atmPos: new mp.Vector3(-3240.848388671875,997.2424926757812,11.54176139831543),
        parkingPos:new mp.Vector3(-3241.918701171875,988.4884643554688,11.486929893493652),
    },

    { 
        atmPos: new mp.Vector3(-537.8060913085938,-854.029296875,28.28746795654297),
        parkingPos:new mp.Vector3(-540.5614013671875,-846.66943359375,27.964908599853516),
    },

    { 
        atmPos: new mp.Vector3(-710.1410522460938,-819.3106689453125,22.734540939331055),
        parkingPos:new mp.Vector3(-706.4583129882812,-826.94677734375,22.44357681274414),
    },

    { 
        atmPos: new mp.Vector3(-258.56768798828125,-723.479248046875,32.422306060791016),
        parkingPos:new mp.Vector3(-247.26158142089844,-721.494873046875,32.3153076171875),
    },

    { 
        atmPos: new mp.Vector3(-203.50755310058594,-861.84033203125,29.272615432739258),
        parkingPos:new mp.Vector3(-187.9304656982422,-860.2008666992188,28.215044021606445),
    },

    { 
        atmPos: new mp.Vector3(111.12841796875,-775.783203125,30.4378662109375),
        parkingPos:new mp.Vector3(106.57315826416016,-781.3972778320312,30.363840103149414),
    },

    { 
        atmPos: new mp.Vector3(119.6353988647461,-883.8477172851562,30.128067016601562),
        parkingPos:new mp.Vector3(134.03131103515625,-887.565673828125,29.29308319091797),
    },

    { 
        atmPos: new mp.Vector3(-1416.1453857421875,-211.72079467773438,45.50039291381836),
        parkingPos:new mp.Vector3(-1410.39306640625,-201.9567413330078,46.18571853637695),
    },

    { 
        atmPos: new mp.Vector3(288.63421630859375,-1282.36181640625,28.654207229614258),
        parkingPos:new mp.Vector3(283.9069519042969,-1273.494873046875,28.25607681274414),
    },

    { 
        atmPos: new mp.Vector3(295.43109130859375,-895.9524536132812,28.20982551574707),
        parkingPos:new mp.Vector3(287.45880126953125,-895.1460571289062,27.89529037475586),
    },

    { 
        atmPos: new mp.Vector3(-1316.120361328125,-835.1016845703125,15.961827278137207),
        parkingPos:new mp.Vector3(-1318.809814453125,-840.0347290039062,15.815313339233398),
    },

    { 
        atmPos: new mp.Vector3(89.6077880859375,2.0107855796813965,67.32662200927734),
        parkingPos:new mp.Vector3(89.65863800048828,-6.928515434265137,67.19186401367188),
    },

    { 
        atmPos: new mp.Vector3(147.71783447265625,-1035.3897705078125,28.343114852905273),
        parkingPos:new mp.Vector3(149.2848663330078,-1027.6185302734375,28.25824737548828),
    },
    { 
        atmPos: new mp.Vector3(-1305.1185302734375,-706.2366333007812,24.322437286376953),
        parkingPos:new mp.Vector3(-1296.3831787109375,-699.2750244140625,23.59794807434082),
    },

    { 
        atmPos: new mp.Vector3(526.9996337890625,-160.7351531982422,56.08400344848633),
        parkingPos:new mp.Vector3(516.3132934570312,-153.6599578857422,55.9906005859375),
    },

    { 
        atmPos: new mp.Vector3(-387.0465087890625,6045.845703125,30.500118255615234),
        parkingPos:new mp.Vector3(-395.68121337890625,6050.203125,30.499740600585938),
    },

    { 
        atmPos: new mp.Vector3(1171.4530029296875,2702.2802734375,37.18050765991211),
        parkingPos:new mp.Vector3(1173.320068359375,2695.5478515625,36.884765625),
    },
]
let salary = 400;
let lobbyClass = class lobby{
    constructor(id,vehConfig){
        this.players = [];
        this.isstart = false;
        this.id = id;
        this.vehConfig = vehConfig;
        this.createVehicle();
        this.isOpenVehicleOne = false;
        this.curentAtm = null;
        this.checkMarkerDriver = false;
    }
    addMember(player){
        if(player.collectorLobby)player.collectorLobby.removeMember(player);
        player.collectorMission = this.players.length;
        this.players.push(player);
        player.collectorLobby = this;
        this.update();
        player.call('COLLECTOR::ACTIVE_LOBBY',[this.id,player.collectorMission])
    }
    removeMember(player){
        player.collectorMission = null;
        player.collectorLobby = null;
        player.collectorMoney = null;
        this.players.splice(this.players.indexOf(player),1);
        this.players.forEach((pl,i)=>{
            pl.collectorMission = i;
            pl.call('COLLECTOR::ACTIVE_LOBBY',[this.id,pl.collectorMission]);
        })
        player.call("COLLECTOR::VEH",[null]);
        this.update();
    }
    update(){
        mp.players.forEach(player => {
            try{
                if(player.collectorShow){
                    player.call('COLLECTOR::MENU_UPDATE',[JSON.stringify(lobbyInfo())]);
                }
            }catch(e){
				console.error(e)
			}
        });
    }
    start(){
        this.isstart = true;
        this.players.forEach((player)=>{
            player.alert(`Вы ${missions[player.collectorMission]}`);
            if(player.collectorMission == 0){
                player.alert('Сядьте за водительское сиденье и откройте задние двери',0,5000);
                player.alert('Чтобы открыть задние двери используйте J',0,10000)
            }
            if(player.collectorMission == 1){
                player.alert('Ожидайте пока водитель откроет задние двери',0,10000)
            }
            if(player.collectorMission > 1){
                player.giveWeaponAttachment(mp.joaat("weapon_pistol50"),45);
                player.giveWeaponAttachment(mp.joaat("weapon_stungun"),45);
                player.armour = 100;
            }
            player.setNewWaypoint(this.vehicle.position);
            player.call("COLLECTOR::VEH",[this.vehicle]);
            player.call('COLLECTOR::START',[player.collectorMission]);
            player.collectorShow = false;
        })
    }
    stop(){
        this.isstart = false;
        this.isOpenVehicleOne = false;
        this.curentAtm = null;
        this.checkMarkerDriver = false;
        this.players.forEach((player)=>{
            player.removeFromVehicle();
            player.collectorMission = null;
            player.call('COLLECTOR::STOP')
            player.collectorLobby = null;
            if(player.collectorMission > 1){
                player.armour = 0;
                player.removeAllWeapons();
                player.inventory.refetchItems();
            }
        })
        this.update();
        // this.vehicle.destroy();
        this.createVehicle();
        this.players = [];
    }
    nextATM(){
        if(!this.isstart) return;
        let atmsRadus = atms.filter((item)=>{
            if(item.atmPos.dist(this.vehicle.position) < 2000)return true;
        });
        let atm = atmsRadus[Math.floor(Math.random()*atmsRadus.length)];
        if(this.curentAtm && this.curentAtm == atm){
            this.nextATM();
            return;
        }

        let driver = this.players[0];
        driver.setNewWaypoint(atm.parkingPos);
        this.curentAtm = atm;
        this.checkMarkerDriver = false;
        driver.call('COLLECTOR::CREATE_MARKER_DRIVER_ATM',[JSON.stringify(atm.parkingPos)]);
    }
    createVehicle(){
        let configPos = JSON.parse(JSON.stringify(vehicles[this.id].pos))
        let pos = new mp.Vector3(configPos.x,configPos.y,configPos.z);
        if(!this.vehicle){
            this.vehicle = mp.vehicles.new('stockade',pos,{
                heading: this.vehConfig.heading,
                locked: false
            });
        }else {
            this.vehicle.rotation = new mp.Vector3(0,0,this.vehConfig.heading);
            this.vehicle.position = pos;
            this.vehicle.petrol = this.vehicle.data.MAX_PETROL;
        }
        this.vehicle.pos = pos;
        this.vehicle.collectorLobby = this;
    }
}
let lobbyInfo = ()=>{
    return lobbys.map((lobby)=>{
        let players = lobby.players.filter((player)=>{
            if(mp.players.exists(player))return true;
            else player.collectorLobby.removeMember(player);
        })
        return {
            players: players.map((player)=>{
                return {
                    name: player.name,
                    mission: missions[player.collectorMission]
                }
            })
        }
    })
}
let vehicles = [
    {
        pos:{"x":242.8040008544922,"y":193.80581665039062,"z":104.05269622802734},
        heading: 70
    },
    {
        pos: {"x":253.2333526611328,"y":189.81607055664062,"z":103.86587524414062},
        heading: 70
    },
    {
        pos: {"x":261.3458557128906,"y":186.81996154785156,"z":103.71735382080078},
        heading: 70
    },
    {
        pos: {"x":298.5981140136719,"y":173.48626708984375,"z":102.99192810058594},
        heading: 70,
    },
    {
        pos: {"x":287.5019226074219,"y":177.55955505371094,"z":103.21175384521484},
        heading: 70,
    }
    
]
let lobbys = [];
for(let i=0;i<vehicles.length;i++){
    lobbys.push( new lobbyClass(i,vehicles[i]))
}
let missions = ['Водитель','Инкассатор','Охранник','Охранник 2']
mp.events.push({
    "COLLECTOR::MENU_SHOW":(player)=>{
        if(!player.isWorkUp()) return;
        if(!player.testRightDrive())return ;
        let freeLobbys = lobbys.filter((lobby)=>{
            if(lobby.players.length < 4 && !lobby.isstart){
                return true
            }
        })
        if(!freeLobbys.length) return player.alert('Все лобби заполнены')
        freeLobbys[0].addMember(player);
        let ret = lobbyInfo();
        player.call('COLLECTOR::MENU_SHOW',[JSON.stringify(ret)])
        player.collectorShow = true;
    },
    "COLLECTOR::MENU_HIDE":(player)=>{
        player.collectorShow = false;
        if(player.collectorLobby)player.collectorLobby.removeMember(player);
    }
})
mp.events.add({
    "playerQuit":(player)=>{
        if(player.collectorLobby){
            let lobby = player.collectorLobby
            lobby.removeMember(player);
            if(lobby.isstart){
                lobby.players.forEach((pl)=>{
                    pl.alert(`${player.name} вышел. Работа закончена`)
                })
                lobby.stop();
            }
        }
    },
    "COLLECTOR::OPEN_DORS":(player)=>{
        if(!player.collectorLobby || player.collectorMission != 0 || !player.vehicle) return;
        let lobby = player.collectorLobby;
        player.vehicle.toggledor(2);
        player.vehicle.toggledor(3);
        if(lobby.isOpenVehicleOne == false){
            lobby.isOpenVehicleOne = true;
            let incasator = lobby.players[incasatorMission];
            if(incasator){
                incasator.alert('Заходите в банк и идите к сейфу',0,10000);
                incasator.call('COLLECTOR::CREATE_MARKER_BAG')
            } 
            if(lobby.players[2]) lobby.players[2].alert('Стойте возле машины и охраняйте ее');
            if(lobby.players[3]) lobby.players[3].alert('Ходите за переносчиком денег и охраняйте его');
        }
    },
    "COLLECTOR::TAKE_BAG":(player)=>{
        if(!player.collectorLobby || player.collectorMission != incasatorMission) return;
        if(player.inventory.isEmptySlotPlayer("bag"))player.setClothes(5,44,0,0);
        player.alert('Вы взяли в сумку 250.000$');
        player.alert('Теперь отнесите их к машине');
        player.collectorMoneyBag = 250000;
        player.call('COLLECTOR::CREATE_MARKER_VEHICLE');
    },
    "COLLECTOR::PUT_VEHICLE_BAG":(player)=>{
        if(!player.collectorLobby || player.collectorMission != incasatorMission) return;
        if(!player.collectorMoneyBag)return player.alert('Возьмите сумку')
        let lobby = player.collectorLobby;
        if(!lobby.vehicle.isOpenDoor(2))return player.alert('Попросите водителя что бы он открыл двери');
        player.call("COLLECTOR::MARKER_VEHICLE_DESTROY")
        lobby.vehicle.collectorMoney = player.collectorMoneyBag;
        player.collectorMoneyBag = 0;
        if(player.inventory.isEmptySlotPlayer("bag"))player.setClothes(5,0,0,0);
        lobby.players.forEach((pl)=>{
            if(!pl.vehicle || pl.vehicle != pl.collectorLobby.vehicle){
                pl.alert('Садитесь в машину');
            }
        })
    },
    "COLLECTOR::CHECK_MARKER_DRIVER_ATM":(player)=>{
        if(!player.collectorLobby) return;
        let lobby = player.collectorLobby;
        lobby.checkMarkerDriver = true;
        let incasator = lobby.players[incasatorMission];
        incasator.alert('Выйдите из машины и подойдите к банкомату',0,10000)
        if(lobby.vehicle.collectorMoney > 0){
            let atm = lobby.curentAtm;
            incasator.call("COLLECTOR::CREATE_MARKER_ATM",[JSON.stringify(atm.atmPos)]);
            incasator.alert('Подойдите к банкомату и положите туда деньги');
            lobby.players[0].alert('Ждите пока разносчик денег положит деньги в банкомат');
            if(lobby.players[2]) lobby.players[2].alert(`Охраняйте машину и ${incasator.name}`);
            if(lobby.players[3]) lobby.players[3].alert(`Охраняйте машину и ${incasator.name}`);
        }
    },
    "COLLECTOR::CHECK_MARKER_INCASATOR_ATM":(player)=>{
        if(!player.collectorLobby) return;
        let lobby = player.collectorLobby;
        if(lobby.checkMarkerDriver){
            let incasator = lobby.players[incasatorMission];
            let driver = lobby.players[0];
            incasator.alert('Вы отнесли 25.000$');
            if(lobby.vehicle.collectorMoney <= 25000){
                driver.alert('Вы развезли все сумки, едьте в банк и получите свою зарплату');
                driver.call("COLLECTOR::END_JOB",[JSON.stringify(lobby.vehicle.pos)])
                driver.setNewWaypoint(lobby.vehicle.pos);
                incasator.alert('Вы развезли все сумки, едьте в банк и получите свою зарплату');
            }else{
                lobby.vehicle.collectorMoney -= 25000
                incasator.alert(`В машине осталось ${lobby.vehicle.collectorMoney}`);
                lobby.curentAtm = null;
                lobby.checkMarkerDriver = false;
                player.alert("Сядте в машину что бы выдали новою точку")
            }
        }
    },
    "COLLECTOR::END_JOB":(player)=>{
        if(!player.collectorLobby) return;
        let lobby = player.collectorLobby;
        lobby.players.forEach((pl)=>{
            pl.alert('Работа закончилась');
            pl.editMoney(salary,'Работа инксатаром')
            pl.alert('Вам заплатили '+salary)
        })
        lobby.stop();
    },
    "playerEnterVehicle":(player,vehicle)=>{
        if(vehicle.collectorLobby){
            if(player.collectorLobby && vehicle.collectorLobby.id == player.collectorLobby.id){
                //когда содится либо Инкассатор который не сел или игрок который тоже не сел в машину
                let lobby = player.collectorLobby;
                if(!lobby.curentAtm && lobby.vehicle.collectorMoney > 0){
                    let notPlayerSeatVehicle = lobby.players.filter((pl)=>{
                        if(!pl.vehicle || pl.vehicle != pl.collectorLobby.vehicle){
                            return true;
                        }
                    })
                    if(!notPlayerSeatVehicle.length){
                        lobby.nextATM();
                    }
                }
			}
		}
    },
    "playerStartEnterVehicle":(player, vehicle,seat)=>{
        if(vehicle.collectorLobby){
			if(player.collectorLobby && vehicle.collectorLobby.id === player.collectorLobby.id){
				/* 0.4 if(seat == 0){
					if(player.collectorMission === 0)vehicle.locked = false;
					else vehicle.locked = true;
				}else*/ vehicle.locked = false;
			}else vehicle.locked = true;
		}
    },
    "COLLECTOR::FINISH_JOB":(player)=>{
        if(!player.collectorLobby) return;
        let lobby = player.collectorLobby;
        lobby.players.forEach((pl)=>{
            if(pl != player){
                pl.alert(`${player.name} закончил работу`)
            }
        })
        player.alert('Вы закончили работу')
        lobby.stop();
    },
})
mp.events.add({
    "COLLECTOR::JOIN_LOBBY":(player,id)=>{
        let lobby = lobbys[id]
        if(lobby.players.length > 3) return player.alert('Мест больше нет')
        if(lobby.isstart)return player.alert('Лобби уже запущенно')
        lobby.addMember(player,id);
    },
    "COLLECTOR::KICK_LOBBY":(player,id)=>{
        let lobby = player.collectorLobby;
        if(!lobby)return;
        if(player.collectorMission != 0)return;
        let pl = lobby.players[id]
        pl.alert('Вас исключили из лобби')
        lobby.removeMember(pl);
        // mp.events.call("COLLECTOR::MENU_SHOW",pl);
    },
    "COLLECTOR::START_MISION":(player)=>{
        let lobby = player.collectorLobby;
        if(!lobby)return;
        if(player.collectorMission != 0)return;
        if(!mp.debag && lobby.players.length < 2)return player.alert('Не хватает ещё одного человека')
        lobby.start();
    }
})