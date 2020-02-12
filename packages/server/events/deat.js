let jail = require('../fractions/lspd/jail.js').jail;
let respPos = new mp.Vector3(283.9716796875,-1343.6676025390625,23.537796020507812);
let respArmy = new mp.Vector3(-2348.053955078125,3269.17822265625,31.810739517211914);
let {dropWeapons} = require('../inventory/playerInventory');
let {alertEms} = require('../fractions/ems/alert');

function playerDeathHandler(player, reason, killer) {
   player.call("DEAT::START_TIME");
   player.deat = true;
   let text = `${player.name} ранен ему нужна медицинская помощь`;
   alertEms(text);
   player.spawn(player.position);
   player.health = 100;
   player.playAnimation("combat@death@from_writhe","death_b",1000,2)
}

mp.events.add({
   "playerDeath": (player, reason, killer)=>{
      if(player.testJail()){
         player.spawn(player.position);
         return;
      }
      if(!player.deat){
         playerDeathHandler(player, reason, killer);
         player.mongoUser.deat = true;
         mp.events.call("playerAtDeat",player, reason, killer)
         dropWeapons(player);
         if(!player.mongoUser.$__.saving)player.mongoUser.save().catch((e)=>{
            console.error(e);
         })
      }else{
         mp.events.call('DEAT::TIME_END',player)
      }
      if(killer && killer.loggined && killer != player){
         killer.mongoUser.kills++;
         if(!killer.mongoUser.$__.saving)player.mongoUser.save().catch((e)=>{
            console.error(e);
         })
         killer.updateInfoMenu();
      }
   },
   "DEAT::TIME_END":(player)=>{
      let pos = respPos;
      let hasReger = true;
      if(player.fraction){
         if(player.fraction.name == 'ARMY'){
            pos = respArmy;
            hasReger = false;
         }
         if(player.fraction.hasGang){
            pos = player.fraction.spawn;
            hasReger = false;
         }
      }
      if(player.testJail()){
         pos = player.position;
         hasReger = false;
      }
      respawnPlayer(player,pos);
      if(hasReger)player.call("DEAT::REGEN");
      else player.health = 100;
      player.stopAnimation();
      if(player.getVariable('LSPD::CUFF')){
         jail(player,30)
      }else{
         player.heading = 130
      }
   }
});
let respawnPlayer = (player,pos)=>{
   player.deat = false;
   player.mongoUser.deat = false;
   player.mongoUser.deaths++;
   player.spawn(pos)
   player.mongoUser.satiety = 100;
   player.mongoUser.thirst = 100;
   player.updateInfoMenu();
   player.call('INVENTORY::UPDATE_HUNGER', [player.mongoUser.satiety, player.mongoUser.thirst])
   player.call("DEAT::STOP_TIME")
   if(!player.mongoUser.$__.saving)player.mongoUser.save().catch((e)=>{
      console.error(e);
   })
}
exports.respawnPlayer = respawnPlayer;
exports.playerDeathHandler = playerDeathHandler;