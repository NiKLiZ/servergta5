global.isInSafeZone = false;
mp.events.add({
    "render":()=>{
        try{
            if (isInSafeZone) {
                mp.game.controls.disableControlAction(2, 24, true);
                mp.game.controls.disableControlAction(2, 69, true);
                mp.game.controls.disableControlAction(2, 70, true);
                mp.game.controls.disableControlAction(2, 92, true);
                mp.game.controls.disableControlAction(2, 114, true);
                mp.game.controls.disableControlAction(2, 121, true);
                mp.game.controls.disableControlAction(2, 140, true);
                mp.game.controls.disableControlAction(2, 141, true);
                mp.game.controls.disableControlAction(2, 142, true);
                mp.game.controls.disableControlAction(2, 257, true);
                mp.game.controls.disableControlAction(2, 263, true);
                mp.game.controls.disableControlAction(2, 264, true);
                mp.game.controls.disableControlAction(2, 331, true);


                // weapon wheel
                mp.game.controls.disableControlAction(2, 12, true);
                mp.game.controls.disableControlAction(2, 13, true);
                mp.game.controls.disableControlAction(2, 14, true);
                mp.game.controls.disableControlAction(2, 15, true);
                mp.game.controls.disableControlAction(2, 16, true);
                mp.game.controls.disableControlAction(2, 17, true);


                // hide HUD_WEAPON_WHEEL
                mp.game.ui.hideHudComponentThisFrame(19);
                // HUD_WEAPON_WHEEL_STATS
                mp.game.ui.hideHudComponentThisFrame(20);
                // MAX_HUD_WEAPONS
                mp.game.ui.hideHudComponentThisFrame(22);
            }
        }catch(e){}
    }
})