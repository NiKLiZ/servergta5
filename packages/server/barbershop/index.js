let mongoUser = require("../mongodb/user").User;
let prices = {
    hair: [
        [20,20,20,20,230,20,20,20,20,20,20,20,20,20,520,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20],
        [20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20]
    ],
    lenses: [20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20],
    overlay: {
        1: [20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20],
        2: [220,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,10,20],
        8: [20,20,20,20,20,20,20,20,20,20,20],
        4: [20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20],
        5: [20,20,20,20,20,20,20],
    }
}
mp.calbackmenuv("BARBERSHOP::BUY_HAIR",(player,array)=>{
    array = [parseInt(array[0]),parseInt(array[1]),parseInt(array[2])];
    //у игрока на компонете волос есть очки начного виденья мы их пропускаем
    if(player.gender==0 && array[0] >= 23) array[0]++;
    if(player.gender==1 && array[0] >= 24) array[0]++;
    let price = prices.hair[player.gender][array[0]];
    player.setClothes(2,array[0],0,0)
    player.setHairColor(array[1],array[2])
    if(!player.editMoney(-price,'Парикмахерская'))return;
    player.alert(`Вы постриглись за ${price}$`)
    player.call("BARBERSHOP::BUY_SUCCESS_HAIR",[array[0],array[1],array[2]])
    player.call("APPEARANCE::COLOR",[array[1]])
    player.call("APPEARANCE::HIGHLIGHTS",[array[2]])
    player.mongoUser.personage.appearance[0] = array[0];
    player.mongoUser.personage.appearance[1] = array[1];
    player.mongoUser.personage.appearance[2] = array[2];
    player.mongoUser.markModified('personage');
    mongoUser.findByIdAndUpdate(player._id,{ $set: {'personage.appearance':player.mongoUser.personage.appearance}}).catch((e)=>{
        player.alert('Произошла ошибка')
        console.error(e);
    })
})
mp.calbackmenuv("BARBERSHOP::BUY_LENSES",(player,array)=>{
    let linse = parseInt(array[0]);
    let price = prices.lenses[array[0]];
    if(!player.editMoney(-price,'Парикмахерская'))return;
    player.call("BARBERSHOP::BUY_SUCCESS_LENSES",[linse])
    player.alert(`Вы купили линзу за ${price}$`)
    player.mongoUser.personage.appearance[3] = linse;
    player.call("APPEARANCE::LENSE",[linse]);
    player.eyeColor = linse;
    player.mongoUser.markModified('personage');
    mongoUser.findByIdAndUpdate(player._id,{ $set: {'personage.appearance[3]':linse}}).catch((e)=>{
        player.alert('Произошла ошибка')
        console.error(e);
    })
})

mp.events.add({
    "BARBERSHOP::OPEN":(player)=>{
        player.call("BARBERSHOP::START",[JSON.stringify(prices)])
    },
    "BARBERSHOP::OVERLAY_BUY":(player,indexOverlay,over)=>{
        over = JSON.parse(over);
        let price = prices.overlay[indexOverlay][over.draw == 255 ? 0 : over.draw];
        if(!player.editMoney(-price,'Парикмахерская'))return;
        player.mongoUser.personage.overlay[indexOverlay] = over;
        let overlay = player.mongoUser.personage.overlay;
        player.call("OVERLAYS::SET",[JSON.stringify(overlay)]);
        player.alert(`Стоимость услуги ${price}$`);
        player.setHeadOverlay(indexOverlay,[over.draw,over.opacity,over.color_one,over.color_two]);
        player.mongoUser.markModified('personage');
        if(!player.mongoUser.$__.saving)player.mongoUser.save().catch((e)=>{
            player.alert('Произошла ошибка')
            console.error(e);
        })
    }
})