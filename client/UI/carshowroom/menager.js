let mar = {
	type: 1,
	color:  [0,255,0,60],
	position: new mp.Vector3(-30.107669830322266,-1104.5250244140625,25.422344207763672), 
	scale: 1.5
} 
let marker = createMarker(mar,()=>{
   mp.events.callRemote("CARSHOWROOM::MENAGER_MENU")
})
mp.events.add({
    "CARSHOWROOM::MENAGER_MENU":(vehicles)=>{
        vehicles = JSON.parse(vehicles);
        let menu_buy_key = {
            name: 'Вост. ключей',
            exitmenu: 'MAR_EXIT'+marker.marker.id,
            items: vehicles.map((veh)=>{
                return {
                    type: 1,
                    name: `${mp.game.ui.getLabelText(mp.game.vehicle.getDisplayNameFromVehicleModel(veh.model))}`,
                    placeholder: `Стоимость ключей 50$ \nНомер ${veh.numberPlate.toUpperCase()}`,
                    callback: 'CARSHOWROOM::MENAGER_BUY_KEY',
                    callpointenct: veh.id
                }
            })
        }
        let menu_self_key = {
            name: 'Продажа машины',
            exitmenu: 'MAR_EXIT'+marker.marker.id,
            items: vehicles.map((veh)=>{
                return {
                    type: 1,
                    name: `${mp.game.ui.getLabelText(mp.game.vehicle.getDisplayNameFromVehicleModel(veh.model))} ${veh.numberPlate.toUpperCase()}`,
                    placeholder: `Продать машину за ${veh.price} \nНомер ${veh.numberPlate.toUpperCase()}`,
                    callback: 'CARSHOWROOM::MENAGER_SELF_VEH',
                    callpointenct: veh.id
                }
            })
        }
        let menu = {
            name: 'Менеджер',
            exit_mar:marker.marker,
            items: [
                {
                    type: 2,
                    name: 'Купить ключи от машины',
                    placeholder: 'Купить ключи от вашей машины',
                    infomenu: menu_buy_key
                },
                {
                    type: 2,
                    name: 'Продать машину',
                    placeholder: 'Продать ваши машины',
                    infomenu: menu_self_key
                }
            ]
        }
        createmenuv(menu);
    },
})