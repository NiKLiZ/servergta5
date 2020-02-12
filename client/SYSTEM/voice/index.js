const Use3d = true;
const UseAutoVolume = false;
const keyActiveVoice = 78;
const keyVisualActiveVoice = 0x4E;
const MaxRange = 13;
let phoneCall = false;
let caller;
let mute = false;
let {browserHud} = require('../../UI/GUI/gui')
mp.events.add({
  "render":()=>{
    try{
      if(!loggined) return;
      if(!mp.voiceChat.muted){
        if(mp.storage.data.setting.voiceSprite == 0){
          let pos = player.position;
          pos.z += 1;
          pos = mp.game.graphics.world3dToScreen2d(pos)
          let scale = 1.0;
          mp.game.graphics.drawSprite("mpleaderboard", "leaderboard_audio_3", pos.x, pos.y, 0.01*scale, 0.018*scale, 0, 255, 255, 255, 150);  
        }
        else{
          let pos = player.position;
          mp.game.graphics.drawMarker(
                25,
                pos.x, pos.y, pos.z -0.95,
                0, 0, 0,
                0, 0, 0,
                1.3, 1.3, 1.3,
                200, 100, 0, 255,
                false, false, 2,
                false, "", "",false
              );
        }
      }
      
    }catch(e){}
  },
  "PHONE::CALL_ACCEPT":()=>{
    phoneCall = true;
    mp.voiceChat.muted = false;
    if(caller){
      caller.voiceVolume = 1.0;
      caller.voice3d = false;
    }
  },
  "PHONE::SET_CALLER":(cal)=>{
    caller = cal;
  },
  "PHONE::CALL_REJECT":()=>{
    if(mp.keys.isDown(keyActiveVoice))mp.voiceChat.muted = true;
    phoneCall = false;
  },
  "VOICE::MUTE":(toggle)=>{
    mute = toggle;
    mp.voiceChat.muted = true;
  },
});



let g_voiceMgr = {
  listeners: [],
  
  add: function(pl){
    this.listeners.push(pl);
    pl.playFacialAnim("mic_chatter", "mp_facial")
    pl.isListening = true;    
    mp.events.callRemote("add_voice_listener", pl);
    
    if(UseAutoVolume){
      pl.voiceAutoVolume = true;
    }
    else{
      pl.voiceVolume = 1.0;
    }
    
    if(Use3d){
      if(caller != pl)pl.voice3d = true;
    }
  },
  
  remove: function(pl, nt){
    let idx = this.listeners.indexOf(pl);
    
    if(idx != -1) this.listeners.splice(idx, 1);
    pl.playFacialAnim("mood_normal_1", "facials@gen_male@variations@normal")
    pl.isListening = false;   
    
    if(nt){
      mp.events.callRemote("remove_voice_listener", pl);
    }
  }
};

mp.events.add("playerQuit", (pl) =>{
  if(pl.isListening){
    g_voiceMgr.remove(pl, false);
  }
});

setInterval(() => {
  let localPlayer = mp.players.local;
  let localPos = localPlayer.position;
  
  mp.players.forEachInStreamRange(pl =>{
    if(pl != localPlayer){
      if(!pl.isListening){
        const playerPos = pl.position;    
        let dist = mp.game.system.vdist(playerPos.x, playerPos.y, playerPos.z, localPos.x, localPos.y, localPos.z);
        
        if(dist <= MaxRange){
          if(caller != pl)g_voiceMgr.add(pl);
        }
      }
    }
  });
  
  g_voiceMgr.listeners.forEach((pl) => {
      if(mp.players.exists(pl) && pl.handle != 0){
        const playerPos = pl.position;    
        let dist = mp.game.system.vdist(playerPos.x, playerPos.y, playerPos.z, localPos.x, localPos.y, localPos.z);
        
        if(dist > MaxRange){
          if(caller != pl)g_voiceMgr.remove(pl, true);
        }
        else if(!UseAutoVolume){
          if(caller != pl)pl.voiceVolume = 1 - (dist / MaxRange);
        }
      }
      else{
        if(caller != pl)g_voiceMgr.remove(pl, true);
      }
  });
}, 500);


mp.keys.bind(keyVisualActiveVoice, false, function() {
  if(mp.voiceChat.muted == false){
    if(mute)return alert('Вы не можете говорить из-за мута')
    if(!phoneCall)mp.voiceChat.muted = true;
    browserHud.execute(`hud.voice = ${mp.voiceChat.muted}`)
    player.playFacialAnim("mood_normal_1", "facials@gen_male@variations@normal")
  }
})

mp.keys.bind(keyVisualActiveVoice, true, function() {
  if(mp.voiceChat.muted == true && chatActive == false){
    if(mute)return alert('Вы не можете говорить из-за мута')
    mp.voiceChat.muted = false;
    browserHud.execute(`hud.voice = ${mp.voiceChat.muted}`)
    player.playFacialAnim("mic_chatter", "mp_facial")
  }
});

