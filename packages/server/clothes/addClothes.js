let clothes = require('../../configs/clothes.json');
 let addClothes = (player,type,array,updateClothesShop,isActive)=>{
     let inventory = player.inventory;
    let gender = player.gender;
    if(type == 1){
         //Верх
        let top = clothes.tors[player.gender][parseInt(array[0])]
        let additionally = clothes.additionally[player.gender].filter((item)=>{
            if(top.type === item.type) return true;
        })
        let first = additionally[parseInt(array[2])]
        let info = {
            top_variation: top.Variation,
            top_color: top.Colors[parseInt(array[1])],
            first: top.first,
            down_variation: first.Variation,
            down_color: parseInt(array[3]),
            glove: top.gloves,
            gender: gender
        };
        inventory.addItem(2,null,info,isActive);
        let gloveInfo = player.getClothes(3);
        if(updateClothesShop)player.call("CLOTHES::UPDATE_CURENT_TOP",[info.top_variation,info.top_color,info.down_variation,info.down_color,gloveInfo.drawable,gloveInfo.texture])
    }else if(type == 2){
         //Штаны
        let legs = clothes.legs[player.gender][parseInt(array[0])]
        let info = {
            leg_variation: legs.Variation,
            leg_color: legs.Colors[parseInt(array[1])],
            gender: gender
        };
        inventory.addItem(3,null,info,isActive);
        if(updateClothesShop)player.call("CLOTHES::UPDATE_CURENT_CLOTHES",[4,info.leg_variation,info.leg_color])
    }
    else if(type == 3){
         //Обувь
        let foot = clothes.foot[player.gender][parseInt(array[0])]
        let info = {
            foot_variation: foot.Variation,
            foot_color: foot.Colors[parseInt(array[1])],
            gender: gender
        };
        inventory.addItem(4,null,info,isActive);
        if(updateClothesShop)player.call("CLOTHES::UPDATE_CURENT_CLOTHES",[6,info.foot_variation,info.foot_color])
    }
    else if(type == 4){
        //Очень важно для перчаток удаляя 0 id
        let glove = parseInt(array[0])+1
        let info = {
            glove_variation: glove,
            glove_color: clothes.gloves[player.gender][parseInt(array[0])].Colors[parseInt(array[1])],
            gender: gender
        };
        inventory.addItem(5,null,info,isActive);
        if(updateClothesShop)player.call("CLOTHES::UPDATE_CURENT_CLOTHES",[3,info.leg_variation,info.leg_color])
    }
    else if(type == 5){
        let hat = clothes.hats[player.gender][parseInt(array[0])]
        let info = {
            hat_variation: hat.Variation,
            hat_color: hat.Colors[parseInt(array[1])],
            gender: gender
        };
        inventory.addItem(8,null,info,isActive);
        if(updateClothesShop)player.call("CLOTHES::UPDATE_CURENT_CLOTHES",[12,info.hat_variation,info.hat_color]);
    }
    else if(type == 6){
        let glasses = clothes.glasses[player.gender][parseInt(array[0])]
        let info = {
            glasses_variation: glasses.Variation,
            glasses_color: glasses.Colors[parseInt(array[1])],
            gender: gender
        };
        inventory.addItem(9,null,info,isActive);
        if(updateClothesShop)player.call("CLOTHES::UPDATE_CURENT_CLOTHES",[13,info.glasses_variation,info.glasses_color]);
    }
    else if(type == 7){
        // Серьги
        let ears = clothes.ears[player.gender][parseInt(array[0])]
        let info = {
            ears_variation: ears.Variation,
            ears_color: ears.Colors[parseInt(array[1])],
            gender: gender
        };
        inventory.addItem(10,null,info,isActive);
        if(updateClothesShop)player.call("CLOTHES::UPDATE_CURENT_CLOTHES",[14,info.ears_variation,info.ears_color]);
    }
    else if(type == 8){
        // маски
        let masks = clothes.masks[player.gender][parseInt(array[0])]
        let info = {
            masks_variation: masks.Variation,
            masks_color: masks.Colors[parseInt(array[1])],
            gender: gender
        };
        inventory.addItem(11,null,info,isActive);
        if(updateClothesShop)player.call("CLOTHES::UPDATE_CURENT_CLOTHES",[1,info.masks_variation,info.masks_color]);
    }
    else if(type == 9){
        // цепи
        let accessories = clothes.accessories[player.gender][parseInt(array[0])]
        let info = {
            accessories_variation: accessories.Variation,
            accessories_color: accessories.Colors[parseInt(array[1])],
            gender: gender
        };
        inventory.addItem(12,null,info,isActive);
        if(updateClothesShop)player.call("CLOTHES::UPDATE_CURENT_CLOTHES",[7,info.accessories_variation,info.accessories_color]);
    }
    else if(type == 10){
        // часы
        let watches = clothes.watches[player.gender][parseInt(array[0])]
        let info = {
            watches_variation: watches.Variation,
            watches_color: watches.Colors[parseInt(array[1])],
            gender: gender
        };
        inventory.addItem(13,null,info,isActive);
        if(updateClothesShop)player.call("CLOTHES::UPDATE_CURENT_CLOTHES",[17,info.watches_variation,info.watches_color]);
    }
    else if(type == 11){
        // браслет
        let bracelets = clothes.bracelets[player.gender][parseInt(array[0])]
        let info = {
            bracelets_variation: bracelets.Variation,
            bracelets_color: bracelets.Colors[parseInt(array[1])],
            gender: gender
        };
        inventory.addItem(14,null,info,isActive);
        if(updateClothesShop)player.call("CLOTHES::UPDATE_CURENT_CLOTHES",[18,info.bracelets_variation,info.bracelets_color]);
    }else if(type == 12){
        //сумки
        let bags = clothes.bags[player.gender][parseInt(array[0])]
        let info = {
            bag_variation: bags.Variation,
            bag_color: bags.Colors[parseInt(array[1])],
        };
        inventory.addItem(63,null,info,isActive);
        if(updateClothesShop)player.call("CLOTHES::UPDATE_CURENT_CLOTHES",[5,info.bag_variation,info.bag_color])
    }
}
module.exports = addClothes;