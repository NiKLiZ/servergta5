let tatto = mp.configs.tatto.tattos;

mp.calbackmenuv({
    "TATU::BUY": (player,array)=>{
        array = array[0].split(',')
        let price = parseInt(array[2]);
        if(!player.editMoney(-price,'Тату салон '))return;
        if(player.mongoUser.tattoos[array[3]] ){
            let tatusCurent = player.mongoUser.tattoos[array[3]];
            player.removeDecoration(mp.joaat(tatusCurent.collection),mp.joaat(tatusCurent.hash))
        }
        player.mongoUser.tattoos[array[3]] = {collection: array[0],hash:array[1],price};
        player.setDecoration(mp.joaat(array[0]),mp.joaat(array[1]));
        let tattoos = player.mongoUser.tattoos;
        player.call("TATTOOS::SET",[JSON.stringify(tattoos)]);
        player.mongoUser.markModified('tattoos');
        if(!player.mongoUser.$__.saving)player.mongoUser.save().catch((e)=>{
            player.alert('Произошла ошибка')
            console.error(e);
        })
    },
    "TATU::CLEAR": (player,array)=>{
        let collection = array;
        let price = 20;
        if(!player.editMoney(-price,'Cтарение татуировки'))return;
        if(player.mongoUser.tattoos[collection] ){
            let tatusCurent = player.mongoUser.tattoos[collection];
            player.removeDecoration(mp.joaat(tatusCurent.collection),mp.joaat(tatusCurent.hash))
            delete player.mongoUser.tattoos[collection];
        }else return player.alert('У вас нет татуировки')
        player.alert('Татуировка стёрлась')
        let tattoos = player.mongoUser.tattoos;
        player.call("TATTOOS::SET",[JSON.stringify(tattoos)]);
        player.mongoUser.markModified('tattoos');
        player.call('TATU::CURENT_TATUS')
        if(!player.mongoUser.$__.saving)player.mongoUser.save().catch((e)=>{
            player.alert('Произошла ошибка')
            console.error(e);
        })
    },
})