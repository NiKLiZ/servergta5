mp.calbackmenuv({
    'LOADER::START':(player,array)=>{
        if(!player.isWorkUp()) return;
        player.loader = true;
        player.loaderBox = 0;
        player.alert('Возьмите ящик')
        player.call("LOADER::START")
    },
    'LOADER::STOP':(player,array)=>{
        player.inventory.liesItem({id:58},false)
        if(player.loaderBox != 0){
            player.editmoneyCash(player.loaderBox*5,'Работа грузчиком')
            player.alert(`Вам заплатили ${player.loaderBox*5}$`)
            player.loaderBox = 0; 
        }
        player.loader = false; 
        player.call("LOADER::STOP")
    }
})
mp.events.push({
    "LOADER::TAKE_BOX":(player)=>{
        player.inventory.liesItem({id:58},true)
        player.alert(`Отнесите в вагон`)
        player.call("LOADER::LAY_TAKE_BOX")
    },
    "LOADER::LAY_BOX":(player)=>{
        if(!player.isBox)return;
        player.inventory.liesItem({id:58},false)
        player.isBox = false;
        player.loaderBox++;
        player.alert(`Вы положили коробку`)
        player.call("LOADER::CREATE_TAKE_BOX")
    }
})