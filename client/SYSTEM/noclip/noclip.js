let playerCamera = mp.cameras.new("gameplay");
let speed = 1;
mp.events.add({
    "ADMIN::CHANGE_SPEED_NOCLIP": (sp) => {
        if(!player.permision|| !player.permision['ADMIN::NOCLIP']) return;
        speed = sp;     
    },
    "render": () => {
        try{
            if(!player.permision|| !player.permision['ADMIN::NOCLIP']) return;
            if(mp.gui.cursor.visible) return;
            //f5 enable
            if(player && player._noclip){
                let crot = playerCamera.getRot(2)
                let heading = crot.z;
                if(mp.game.invoke(getNative("GET_FOLLOW_PED_CAM_VIEW_MODE") != 4))heading += 180;
                player.setHeading(heading)
                let pos = player.position
                let realspeed = speed;

                if(mp.keys.isDown(16)){ //shift
                    realspeed *= 2;
                }
                if(mp.keys.isDown(87)){ //W
                    let ax = -Math.sin(crot.z * Math.PI / 180)
                    let ay = Math.cos(crot.z * Math.PI / 180)
                    let az = Math.sin(crot.x * Math.PI / 180)

                    pos.x += realspeed * ax;
                    pos.y += realspeed * ay;
                    pos.z += realspeed * az;
                }
                if(mp.keys.isDown(65)){ //A
                    crot.z-=90
                    let ax = Math.sin(crot.z * Math.PI / 180)
                    let ay = -Math.cos(crot.z * Math.PI / 180)

                    pos.x += realspeed * ax;
                    pos.y += realspeed * ay;
                }
                if(mp.keys.isDown(83)){ //S
                    let ax = Math.sin(crot.z * Math.PI / 180)
                    let ay = -Math.cos(crot.z * Math.PI / 180)
                    let az = -Math.sin(crot.x * Math.PI / 180)

                    pos.x += realspeed * ax;
                    pos.y += realspeed * ay;
                    pos.z += realspeed * az;
                }
                if(mp.keys.isDown(68)){ //D
                    crot.z+=90
                    let ax = Math.sin(crot.z * Math.PI / 180)
                    let ay = -Math.cos(crot.z * Math.PI / 180)

                    pos.x += realspeed * ax;
                    pos.y += realspeed * ay;
                }
                if(mp.keys.isDown(32)){ //space
                    pos.z += 0.5 * realspeed;
                }
                if(mp.keys.isDown(17)){ //ctrl
                    pos.z -= 0.5 * realspeed;
                }

                player.position = pos;
            }
        }catch(e){}
    },
})

mp.keys.bind(0x7A, true, function() {
    if(!player.permision|| !player.permision['ADMIN::NOCLIP']) return;
    if(!player._noclip){
        notify(`noclip вкл ${5}`)
        player.freezePosition(true)
        player._noclip = true;
    }else{
        player.freezePosition(false)
        notify(`noclip выкл`)
        player._noclip = false
        let position = player.position;
        position.z = mp.game.gameplay.getGroundZFor3dCoord(position.x, position.y, position.z, 0.0, false)+1;
        player.position = position;
    }        
})