let maxDistance = 25;
let width = 0.031;
let height = 0.006;
let border = 0.002;
mp.nametags.enabled = false;
mp.game.graphics.requestStreamedTextureDict("mpleaderboard", true);
let {hasFriend} = require('./chat.js');
let masksIgnor = [0,27,73,109,114,120,121,122,146];
mp.events.add('render', function (nametags) {
    try{
        if(!loggined)return;
        // Add local pl nametag render
        // let localPosition = player.position;
        // localPosition.z += 1;

        // let localScreen2dPosition = mp.game.graphics.world3dToScreen2d(localPosition) || {x: 0, y: -10};
        // nametags.push([player,
        //     localScreen2dPosition.x,
        //     localScreen2dPosition.y,
        //     0
        // ]);
        if(mp.storage.data.setting.hud == false)return;
        let graphics = mp.game.graphics;
        let screenRes = graphics.getScreenResolution(0, 0);
        if(!mp.storage.data.setting.nameTagShow)return;
        nametags.forEach(function (nametag) {
            try{
                let [pl, x, y] = nametag;
                // Если отключили на f6 именна
                if(!pl.getVariable('visible')) return;
                let distance = mp.Vector3.Distance(pl.position,player.position)
                if (distance <= maxDistance) {
                    let scale = (distance / maxDistance);
                    if (scale < 0.6)
                        scale = 0.6;
                    y -= scale * (0.003 * (screenRes.y / 1080));
                    if(pl.chat){
                        graphics.drawText(pl.chat.text,[x, y-0.04],{
                            font:4,
                            color: [...pl.chat.color,255],
                            scale: [0.5, 0.5],
                            outline: true,
                            centre: true
                        });
                    }
                    if(pl.getVariable('colorNametag')){
                        let hasMask = masksIgnor.indexOf(pl.getDrawableVariation(1)) != -1;
                        graphics.drawText(`${ (player.fraction && player.fraction === pl.getVariable('fraction') || hasFriend(pl)) && hasMask || player.permision['CHAT::FRIENDS_ALL'] ? pl.name : 'ID:' } [${pl.remoteId}]`,[x, y],{
                            font:4,
                            color: JSON.parse(pl.getVariable('colorNametag')),
                            scale: [0.4, 0.4],
                            outline: true,
                            centre: true
                        });
                    }
                    // voice
                    if(mp.storage.data.setting.voiceSprite == 0 && distance<15){
                        let scale = 1.0 - (0.05*distance);
                        if(pl.isVoiceActive){
                            mp.game.graphics.drawSprite("mpleaderboard", "leaderboard_audio_3", x, y-0.02, 0.01*scale, 0.018*scale, 0, 255, 255, 255, 150);
                        }
                    }
                    if(mp.storage.data.setting.voiceSprite == 1 && !pl.vehicle && pl.isVoiceActive){
                        let pos = pl.position;
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

                    y += 0.04;
                    if(mp.game.player.isFreeAimingAtEntity(pl.handle)){
                        let armour = (pl.getArmour() || 0) / 100;
                        if (armour > 0) {
                            drawBar(armour, x, y, 40, 40, 40, 69, 230, 167);
                            y += 0.017;
                        }
                        let health = pl.getHealth() / 100;
                        drawBar(health, x, y, 40, 40, 40, 220, 50, 20);
                    }
                    
                }
            }catch(e){}
        });
    }catch(e){}
});
function drawBar(value, x, y, r1, g1, b1, r2, b2, g2) {
    mp.game.graphics.drawRect(x, y, width + border * 2, height + border * 2, r1, g1, b1, 200);
    mp.game.graphics.drawRect(x - width / 2 * (1 - value), y, width * value, height, r2, g2, b2, 255);
}
