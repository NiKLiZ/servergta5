const inAnim = "cellphone_text_in"
const outAnim = "cellphone_text_out"
const idleAnim = "cellphone_text_read_base"
let phoneProp = 0
let phoneModel = "prop_npc_phone_02"
// del Phone
mp.game.invoke("0x3BC861DF703E5097");

function creteObjectPhone(entity) {
    mp.game.streaming.requestModel(mp.game.joaat(phoneModel));
    while(!mp.game.streaming.hasModelLoaded(mp.game.joaat(phoneModel)))
        mp.game.wait(0);
    return mp.objects.new(mp.game.joaat(phoneModel), entity.position,
    {
        alpha: 255,
        dimension: -1
    });
}
function animPhone(entity){
    let bone = entity.getBoneIndex(28422);
    let dict = "cellphone@";
    if(entity.vehicle) dict = dict+"in_car@ds";
    mp.game.streaming.requestAnimDict(dict);
    while(!mp.game.streaming.hasAnimDictLoaded(dict))
        mp.game.wait(0);
    
    entity.taskPlayAnim(dict, inAnim, 1.0, -1, -1, 50, 0, false, false, false)
    setTimeout(()=>{
        entity.phoneObject.attachTo(entity.handle,bone, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, true, true, false, false, 2, true)
    },158)

}

function phoneIdleAnim(entity) {
    let dict = "cellphone@";
    if(entity.vehicle) dict = dict+"in_car@ds";
    mp.game.streaming.requestAnimDict(dict);
    while(!mp.game.streaming.hasAnimDictLoaded(dict))
        mp.game.wait(0);

    entity.taskPlayAnim(dict, idleAnim, 1.0, -1, -1, 50, 0, false, false, false)
}

function phoneOutAnim(entity){
    let dict = "cellphone@";
    if(entity.vehicle) dict = dict+"in_car@ds";
    mp.game.streaming.requestAnimDict(dict);
    while(!mp.game.streaming.hasAnimDictLoaded(dict))
        mp.game.wait(0);
    
    // if(entity.weapon)entity.clearSecondaryTask();
    if(entity.hasCall){
        entity.stopAnimTask(dict, callAnim, 1.0)
        entity.taskPlayAnim(dict, idleAnim, 1.0, -1, -1, 50, 0, false, false, false)
    }else{
        entity.stopAnimTask( dict, inAnim, 1.0)
        entity.taskPlayAnim(dict, outAnim, 5.0, -1, -1, 50, 0, false, false, false)
    }
    if(entity.delPhone)clearTimeout(entity.delPhone)
    if(entity.outAnim)clearTimeout(entity.outAnim)
    entity.delPhone = setTimeout(()=>{
        entity.delPhone = undefined;
        if(entity.phoneObject){
            entity.phoneObject.destroy();
            entity.phoneObject = undefined;
        }
        entity.outAnim = setTimeout(() => {
            entity.outAnim = undefined;
            entity.stopAnimTask(dict, outAnim, 1.0)
        }, 500);
    },700)
}
mp.events.addDataHandler({
    "phoneShow":(entity,value)=>{
        if(entity != player){
            if(value){
                if(!entity.phoneObject){
                    entity.phoneObject = creteObjectPhone(entity);
                }
                mp.game.invoke("0xADF692B254977C0C",entity.handle,0xA2719263)
                animPhone(entity);
            }else{
                phoneOutAnim(entity);
            }
        }else{
            if(value){
                mp.game.mobile.createMobilePhone(0);
                mp.game.mobile.setMobilePhoneScale(0);
                mp.game.mobile.scriptIsMovingMobilePhoneOffscreen(false);
                mp.game.mobile.setPhoneLean(false);
            }else{
                mp.game.invoke("0x3BC861DF703E5097");
            }
        }
    }
})