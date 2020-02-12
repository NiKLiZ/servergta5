//Fingerpointing
let pointing =
{
    active: false,
    interval: null,
    lastSent: 0,
    start: function () {
        if (!this.active) {
            this.active = true;

            mp.game.streaming.requestAnimDict("anim@mp_point");

            while (!mp.game.streaming.hasAnimDictLoaded("anim@mp_point")) {
                mp.game.wait(0);
            }
            mp.game.invoke(getNative("SET_PED_CURRENT_WEAPON_VISIBLE"), player.handle, 0, 1, 1, 1);
            player.setConfigFlag(36, true)
            player.taskMoveNetwork("task_mp_pointing", 0.5, false, "anim@mp_point", 24);
            mp.game.streaming.removeAnimDict("anim@mp_point");

            this.interval = setInterval(this.process.bind(this), 0);
        }
    },

    stop: function () {
        if (this.active) {
            player.clearTasks()
            clearInterval(this.interval);
            this.interval = null;

            this.active = false;

            mp.game.invoke("0xd01015c7316ae176", player.handle, "Stop");

            if (!player.isInjured()) {
                mp.game.invoke("0x3841422E9C488D8C",player.handle)
            }
            if (!player.isInAnyVehicle(true)) {
                if(!player.getVariable('visible'))mp.game.invoke(getNative("SET_PED_CURRENT_WEAPON_VISIBLE"), player.handle, 1, 1, 1, 1);
            }
            player.setConfigFlag(36, false);
            mp.game.invoke("0x3841422E9C488D8C",player.handle)  
        }

    },

    gameplayCam: global.cam,
    lastSync: 0,

    getRelativePitch: function () {
        let camRot = this.gameplayCam.getRot(2);

        return camRot.x - player.getPitch();
    },

    process: function () {
        if (this.active) {
            mp.game.invoke("0x921ce12c489c4c41", player.handle);

            let camPitch = this.getRelativePitch();

            if (camPitch < -70.0) {
                camPitch = -70.0;
            }
            else if (camPitch > 42.0) {
                camPitch = 42.0;
            }
            camPitch = (camPitch + 70.0) / 112.0;

            let camHeading = mp.game.cam.getGameplayCamRelativeHeading();

            let cosCamHeading = mp.game.system.cos(camHeading);
            let sinCamHeading = mp.game.system.sin(camHeading);

            if (camHeading < -180.0) {
                camHeading = -180.0;
            }
            else if (camHeading > 180.0) {
                camHeading = 180.0;
            }
            camHeading = (camHeading + 180.0) / 360.0;

            let coords = player.getOffsetFromGivenWorldCoords((cosCamHeading * -0.2) - (sinCamHeading * (0.4 * camHeading + 0.3)), (sinCamHeading * -0.2) + (cosCamHeading * (0.4 * camHeading + 0.3)), 0.6);
            let blocked = (typeof mp.raycasting.testPointToPoint([coords.x, coords.y, coords.z - 0.2], [coords.x, coords.y, coords.z + 0.2], player.handle, 7) !== 'undefined');
            mp.game.invoke('0xd5bb4025ae449a4e', player.handle, "Pitch", camPitch)
            mp.game.invoke('0xd5bb4025ae449a4e', player.handle, "Heading", camHeading * -1.0 + 1.0)
            mp.game.invoke('0xb0a6cfd2c69c1088', player.handle, "isBlocked", blocked)
            mp.game.invoke('0xb0a6cfd2c69c1088', player.handle, "isFirstPerson", mp.game.invoke('0xee778f8c7e1142e2', mp.game.invoke('0x19cafa3c87f7c2ff')) == 4)

            if ((Date.now() - this.lastSent) > 100) {
                this.lastSent = Date.now();
                mp.events.callRemote("pointingUpdate", camPitch, camHeading);
            }
        }else{
            player.clearTasks();
        }
    }
}

mp.events.addDataHandler("camHeading", (entity, value) => {
    if (entity.type !== "player" || !entity.handle || entity == player) return; 
    let camPitch = entity.getVariable('camPitch');
    let camHeading = entity.getVariable('camHeading');
    if (entity != null) {
            entity.lastReceivedPointing = Date.now();
            if (!entity.pointingInterval) {
                entity.pointingInterval = setInterval((function () {
                    if ((Date.now() - entity.lastReceivedPointing) > 1000) {
                        clearInterval(entity.pointingInterval);

                        entity.lastReceivedPointing = undefined;
                        entity.pointingInterval = undefined;

                        mp.game.invoke("0xd01015c7316ae176", entity.handle, "Stop");


                        if (!entity.isInAnyVehicle(true)) {
                            if(!entity.getVariable('visible'))mp.game.invoke(getNative("SET_PED_CURRENT_WEAPON_VISIBLE"), entity.handle, 1, 1, 1, 1);
                        }
                        entity.setConfigFlag(36, false);

                    }
                }).bind(entity), 500);

                mp.game.streaming.requestAnimDict("anim@mp_point");

                while (!mp.game.streaming.hasAnimDictLoaded("anim@mp_point")) {
                    mp.game.wait(0);
                }

                mp.game.invoke(getNative("SET_PED_CURRENT_WEAPON_VISIBLE"), entity.handle, 0, 1, 1, 1);
                entity.setConfigFlag(36, true)
                entity.taskMoveNetwork("task_mp_pointing", 0.5, false, "anim@mp_point", 24);
                mp.game.streaming.removeAnimDict("anim@mp_point");
            }

            mp.game.invoke('0xd5bb4025ae449a4e', entity.handle, "Pitch", camPitch)
            mp.game.invoke('0xd5bb4025ae449a4e', entity.handle, "Heading", camHeading * -1.0 + 1.0)
            mp.game.invoke('0xb0a6cfd2c69c1088', entity.handle, "isBlocked", 0);
            mp.game.invoke('0xb0a6cfd2c69c1088', entity.handle, "isFirstPerson", 0);
    }
});
let hasCuff = require('../fraction/lspd').hasCuff;

let timePointing = Date.now();
mp.keys.bind(0x42, true, () => {
    if ( !mp.gui.cursor.visible && !player.vehicle && !hasCuff && !player.hasDead && Date.now()-timePointing > 2*1000 ) {
        pointing.start();
        timePointing = Date.now()
    }
});

mp.keys.bind(0x42, false, () => {
    pointing.stop();
});