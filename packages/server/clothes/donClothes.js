let clothes = require('../../configs/clothes.json');
let infoitems = require('../inventory/itemsinfo.js');
let donClothes = (player,item,hasActive = false)=>{
    let inventory = player.inventory; 
    let type = infoitems[item.id].type;
    if(type == "clothes" || type == "bag"){
        if(item.id == 2){
            let glove = inventory.items.gloves;
            let gloveid = 15;
            let glovecolor = 0;
            let glovetype = item.glove;
            if(hasActive){
                if(typeof item.top_color != 'number')return console.error('Баг с верхней одеждой',item);
                player.setClothes(11,item.top_variation,item.top_color,0)
                if(item.first) player.setClothes(8,item.down_variation,item.down_color,0)
                else player.setClothes(8,player.gender == 0  ? 15 : 14,0,0)
                gloveid = clothes.gloves[player.gender][0].Variations[glovetype];
            }else{
                player.setClothes(11,15,0,0)
                player.setClothes(8,15,0,0)
                glovetype = 10;
            }
            if(!inventory.isEmptySlotPlayer('glove')){
                gloveid = clothes.gloves[player.gender][glove.glove_variation].Variations[glovetype];
                glovecolor = glove.glove_color;
            }
            player.setClothes(3,gloveid,glovecolor,0)
        }
        if(item.id == 3){
            if(hasActive){
                player.setClothes(4,item.leg_variation,item.leg_color,0)
            }else{
                player.setClothes(4,clothes.clearclothes[player.gender][4],0,0)
            }
        }
        if(item.id == 4){
            if(hasActive){
                player.setClothes(6,item.foot_variation,item.foot_color,0)
            }else{
                player.setClothes(6,clothes.clearclothes[player.gender][6],0,0)
            }
        }
        if(item.id == 5){
            let tors = inventory.items.top;
            let glove = 10;
            if(!inventory.isEmptySlotPlayer('top')) glove = tors.glove;
            if(hasActive){
                player.setClothes(3,clothes.gloves[player.gender][item.glove_variation].Variations[glove],item.glove_color,0)
            }else{
                player.setClothes(3,clothes.gloves[player.gender][0].Variations[glove],0,0)
            }
        }
        if(item.id == 8){
            if(hasActive){
                player.setProp(0,item.hat_variation,item.hat_color)
            }else{
                player.setProp(0,-1,0);
            }
        }
        if(item.id == 9){
            if(hasActive){
                player.setProp(1,item.glasses_variation,item.glasses_color)
            }else{
                player.setProp(1,-1,0);
            }
        }
        if(item.id == 10){
            if(hasActive){
                player.setProp(2,item.ears_variation,item.ears_color)
            }else{
                player.setProp(2,-1,0);
            }
        }
        if(item.id == 11){
            if(hasActive){
                player.setClothes(1,item.masks_variation,item.masks_color,0)
            }else{
                player.setClothes(1,0,0,0)
            }
        }
        if(item.id == 12){
            if(hasActive){
                player.setClothes(7,item.accessories_variation,item.accessories_color,0)
            }else{
                player.setClothes(7,0,0,0)
            }
        }
        if(item.id == 13){
            if(hasActive){
                player.setProp(6,item.watches_variation,item.watches_color)
            }else{
                player.setProp(6,-1,0);
            }
        }
        if(item.id == 14){
            if(hasActive){
                player.setProp(7,item.bracelets_variation,item.bracelets_color)
            }else{
                player.setProp(7,-1,0);
            }
        }
        if(item.id == 63){
            if(hasActive){
                player.setClothes(5,item.bag_variation,item.bag_color,0)
            }else{
                player.setClothes(5,0,0,0)
            }
        }
    }
}  
module.exports = donClothes;