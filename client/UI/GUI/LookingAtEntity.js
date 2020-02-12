let res = mp.game.graphics.getScreenActiveResolution(1, 1);

global.LookingEntity = null;
global.Looking = null;
global.getLookingAtEntity = (flag = -1,ignor)=>{
    try{

        if(!ignor) ignor = player;
        let startPosition = player.getBoneCoords(12844, 0.3, 0, 0);
        let secondPoint = mp.game.graphics.screen2dToWorld3d([res.x / 2, res.y / 2]);
        if (secondPoint == undefined) return null;
    
        startPosition.z -= 0.3;
        const result = mp.raycasting.testPointToPoint(startPosition, secondPoint, ignor, flag);
        if(player.permision && player.permision['ADMIN::MENU'] ) mp.game.graphics.drawLine(startPosition.x,startPosition.y,startPosition.z,secondPoint.x,secondPoint.y,secondPoint.z,255,0,0,170)
        if (typeof result !== 'undefined') {
            // let entPos = result.entity.position;
            // let lPos = player.position;
            // if(mp.game.gameplay.getDistanceBetweenCoords(entPos.x, entPos.y, entPos.z, lPos.x, lPos.y, lPos.z, true) > 4) return null;
            return result;
        }
        return null;
    }catch(e){

    }
}
let lastLoking = new Date().getTime();
mp.events.add('render',() => {
    try{
        if(!loggined)return;
        if (!player.vehicle && !player.isDead()) {
            let date = new Date().getTime()
            if(date-lastLoking > 350){
                lastLoking = date;
                let lock = getLookingAtEntity();
                if(lock && lock.entity && lock.entity.model == mp.game.joaat("bkr_prop_fakeid_binbag_01"))lock = null;
                Looking =  lock
                if(Looking)LookingEntity = Looking.entity;
                else LookingEntity = null;
            }
        }
        else {
            LookingEntity = null;
        }
        if (LookingEntity){
            if(LookingEntity.type == 'vehicle' && player.permision['ADMIN::MENU'] && LookingEntity.remoteId != null){
                mp.game.graphics.drawText("id: "+LookingEntity.remoteId, [LookingEntity.position.x, LookingEntity.position.y, LookingEntity.position.z+1], {
                    font: 0,
                    color: [255, 255, 255, 255],
                    scale: [0.4, 0.4],
                    outline: true
                });
            }
        }
    }catch(e){}
});