let model = require('../mongodb/fraction.js').fraction;
let user = require('../mongodb/user.js').User;

let captTime = 900000;
let getZonesColor = ()=>{
    let zones = [];
    for(let i=0;i<21;i++){
        let indexGang;
        if(mp.fractions.BALLAS.model.zones.indexOf(i) != -1)indexGang = 0;
        if(mp.fractions.VAGOS.model.zones.indexOf(i) != -1)indexGang = 1;
        if(mp.fractions.FAMILIES.model.zones.indexOf(i) != -1)indexGang = 2;
        zones.push(indexGang)
    }
    return zones;
}

    
mp.events.add("playerQuit", (player)=>{
    if(player.fraction){
        let index = player.fraction.templeaders.indexOf(player);
        if(index !== -1)player.fraction.templeaders.splice(index,1);
    }
});
module.exports = class Fraction {
    constructor(name,color,rank,vehs,spawn,type = "",infoFraction) {
        this.name = name;
        this.members = [];
        let fraction = this;
        if(type == "gang"){
            this.hasGang = true;
            this.colorZone = infoFraction.colorZone;
            this.dimension = infoFraction.dimension;
            this.interiror = infoFraction.interiror;  
            this.menuName = "GANG";
        }
        else if(type == "mafia"){
            this.hasMafia = true;
            this.dimension = infoFraction.dimension;
            this.menuName = "MAFIA";
            this.interiror = infoFraction.interiror;  
        }else{
            this.menuName = this.name;
        }
        model.find({name: name},(err,done)=>{
            try{
                if(err)console.error(err)
                if(done.length === 0){
                    let infoModel = {
                        name: name
                    }
                    if(this.hasGang && infoFraction.defaultZones)infoModel.zones = infoFraction.defaultZones;
                    let frac = new model(infoModel);
                    this.model = frac;
                    frac.save().catch((err)=>{
                        console.error(err);
                    }).then((data)=>{
                    
                    });
                }else{
                    this.model = done[0];
                    // if(this.hasGang && infoFraction.defaultZones)this.model.zones = infoFraction.defaultZones;
                    // if(!this.model.$__.saving)this.model.save().catch((err)=>{console.error(err)});
                }
                fraction.members = this.model.members;
            }catch(e){
                console.error(e);
            }
        });
        this.color = color;
        this.rank = rank;
        this.vehs = [];
        for(let i=0;i<vehs.length;i++){
            let veh = this.createveh(vehs[i])
            this.vehs.push(veh);
        }
        this.templeaders = [];
        this.spawn = spawn;
        this.lockedWarehouse = true;
    }
    addMember(player,isleader){
        this.model.members.push(player.mongoUser);
        if(!this.model.$__.saving)this.model.save().catch((err)=>{console.error(err)});
        player.mongoUser.fraction.name = this.name;
        player.fraction = this;
        if(isleader){
            player.rank = this.rank.length-1;
            player.mongoUser.fraction.rank = this.rank.length-1;
        }
        else{
            player.rank = 0;
            player.mongoUser.fraction.rank = 0;
        } 
        player.mongoUser.fraction.warn = 0;
        player.mongoUser.fraction.underRang = 0;
        if(!player.mongoUser.$__.saving)player.mongoUser.save().catch((err)=>{console.error(err)});
        player.fraction = this;
        this.updateInfo(player);
        player.updateInfoMenu();
    }
    updateInfo(player){
        player.call('FRACTION::SET',[this.name,player.rank,0,JSON.stringify(this.rank)])
        player.setVariable('fraction',this.name);
        if(this.hasGang){
            player.call('GANG::SET',[this.name,JSON.stringify(getZonesColor())]);
            if(this.hasCapt){
                this.updateCaptPlayer(player);
            }
        }
    }
    removeMember(player){
        this.model.members.pull(player.mongoUser);
        player.call(this.menuName+"::CLOSE")
        if(!this.model.$__.saving)this.model.save().catch((err)=>{console.error(err)});
        player.mongoUser.fraction = null;
        player.fraction = null;
        if(!player.mongoUser.$__.saving)player.mongoUser.save().catch((err)=>{console.error(err)});
        player.call('FRACTION::SET',['',0])
        if(this.hasGang)player.call('GANG::STOP');
        player.updateInfoMenu();
    }
    getOnlineMembers(){
        let players = [];
        for(let i=0;i<this.members.length;i++){
            let player = mp.players.atMongoId(this.members[i]._id);
            if(player) players.push(player);
        }
        return players;
    }
    log(args){
        model.findByIdAndUpdate(this.model._id,{$push: {logs: args} }).catch((err)=>{console.error(err)});
    }
    broadcastPlayer(message,player){
        let players = this.getOnlineMembers();
        players.push(...this.templeaders)
        for(let i=0;i<players.length;i++){
            players[i].outputChatBox(`<span style='color:rgba(31, 107, 167,255)'>[R] ${player.nameTag}: ${message}</span>`);
        }
    }
    broadcast(message){
        let players = this.getOnlineMembers();
        players.push(...this.templeaders)
        for(let i=0;i<players.length;i++){
            players[i].outputChatBox(`<span style='color:rgba(31, 107, 167,255)'>${message}</span>`);
        }
    }
    createveh(veh){
        let heading = veh.z ? veh.z : veh.heading;
        let model = typeof veh.model === "string" ? mp.joaat(veh.model) : veh.model;
        let color = veh.colors ? veh.colors : veh.color;
        let vehs = mp.vehicles.new(model,veh.pos ,{
            heading: heading,
        })
        if(color && typeof color[0] == 'object' )vehs.setColorRGB(...color[0],...color[1])
        vehs.colors = color;
        vehs.fraction = this;
        vehs.pos = veh.pos;
        vehs.z = heading;
        vehs.rank = veh.rank;
        if(!this.hasGang && !this.hasMafia)vehs.setVariable('gosFraction', true)
        return vehs;
    }
    downrank(player,rank = 1){
        player.mongoUser.fraction.rank -= rank;
        player.mongoUser.fraction.underRang = 0;
        player.rank -= rank;
        return new Promise( (resolve,reject) => {
            user.findByIdAndUpdate(player._id,{$set: {'fraction.rank': player.rank,'fraction.underRang':0}}).catch((err)=>{
                if(err)console.error(err)
                player.mongoUser.fraction.rank += rank;
                player.rank += rank;
                reject(err);
            }).then(()=>{
                player.call('FRACTION::SET',[this.name,player.rank,0,JSON.stringify(this.rank)])
                resolve();
            });
        })
    }
    uprank(player,rank = 1){
        player.mongoUser.fraction.rank += rank;
        player.mongoUser.fraction.underRang = 0;
        player.rank += rank;
        return new Promise( (resolve,reject) => {
            user.findByIdAndUpdate(player._id,{$set: {'fraction.rank': player.rank,'fraction.underRang':0}}).catch((err)=>{
                if(err)console.error(err)
                player.mongoUser.fraction.rank -= rank;
                player.rank -= rank;
                reject(err);
            }).then(()=>{
                player.call('FRACTION::SET',[this.name,player.rank,0,JSON.stringify(this.rank)])
                resolve();
            });
        })
    }
    spawncar(){
        let vehs = [];
        this.vehs.forEach((veh,i)=>{
            let vehRespawn = this.createveh(veh);
            vehs.push(vehRespawn);
            veh.destroy();
        })
        this.vehs = vehs;
    }
    addTempleader(player){
        if(this.templeaders.indexOf(player) !== -1) return;
        this.templeaders.push(player);
    }
    captStart(gang,indexZone){
        this.hasCapt = true;
        gang.hasCapt = true;
        this.captPoints = 0;
        gang.captPoints = 0;
        let timestap = Date.now();
        this.indexZone = indexZone;
        gang.indexZone = indexZone;
        this.timeStartCapt = timestap;
        gang.timeStartCapt = timestap;
        this.protectingGang = gang;
        gang.forwardGang = this;
        setTimeout(()=>{
            this.hasCapt = false;
            gang.hasCapt = false;
            if(this.captPoints > gang.captPoints || this.captPoints == 0 && gang.captPoints == 0){
                this.model.zones.push(indexZone);
                gang.model.zones.pull(indexZone);
                if(!this.model.$__.saving)this.model.save().catch((err)=>{console.error(err)});
                if(!gang.model.$__.saving)gang.model.save().catch((err)=>{console.error(err)});
                this.getOnlineMembers().forEach((pl)=>{
                    pl.call("GANG::STOP_TIME");
                    pl.call("GANG::UPDATE_BLIP",[indexZone,this.colorZone]);
                    pl.alert('Ваша банда захватила территорию '+gang.name);
                })
                gang.getOnlineMembers().forEach((pl)=>{
                    pl.call("GANG::UPDATE_BLIP",[indexZone,this.colorZone]);
                    pl.alert('Ваша банды не смогла защитить свою территорию');
                })
            }else{
                this.getOnlineMembers().forEach((pl)=>{
                    pl.call("GANG::STOP_TIME");
                    pl.alert('Ваша банда не смогла завоевать территорию');
                })
                gang.getOnlineMembers().forEach((pl)=>{
                    pl.call("GANG::STOP_TIME")
                    pl.alert('Вы защитили свою территорию');
                })
            }
        },captTime)
        gang.getOnlineMembers().forEach((pl)=>{
            pl.call("GANG::START_TIME",[this.name,gang.name,indexZone]);
            pl.alert('Вашу территорию пытается захватить'+gang.name);
        })
        this.getOnlineMembers().forEach((pl)=>{
            pl.call("GANG::START_TIME",[this.name,gang.name,indexZone]);
            pl.alert('Вы патаетесь захватить территорию'+gang.name)
        })
    }
    updatesPoints(){
        let gang = this.protectingGang ? this.protectingGang  : this.forwardGang;
        this.getOnlineMembers().forEach((pl)=>{
            if(this.protectingGang) pl.call("GANG::UPDATE_PROTECTING_POINTS",[this.captPoints]);
            else pl.call("GANG::UPDATE_FORWARD_POINTS",[this.captPoints]);
        })
        gang.getOnlineMembers().forEach((pl)=>{
            if(this.protectingGang) pl.call("GANG::UPDATE_PROTECTING_POINTS",[gang.captPoints]);
            else pl.call("GANG::UPDATE_FORWARD_POINTS",[gang.captPoints]);
        })
    }
    updateCaptPlayer(player){
        let protectingGang = this.protectingGang ? this.protectingGang : this;
        let forwardGang = this.forwardGang ? this.forwardGang : this;
        let timeCapt = parseInt(((this.timeStartCapt+captTime)-Date.now())/1000);
        player.call("GANG::START_TIME",[forwardGang.name,protectingGang.name,this.indexZone,timeCapt,forwardGang.captPoints,protectingGang.captPoints]);
    }
};
