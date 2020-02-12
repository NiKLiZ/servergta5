mp.events.add({
    "toggleCrouch": (player) => {
        if (player.data.isCrouched === undefined) {
            player.data.isCrouched = true;
        } else {
            player.data.isCrouched = !player.data.isCrouched;
        }
    },
    "pointingUpdate": (player,camPitch,camHeading) => {
        player.data.camPitch = camPitch;
        player.data.camHeading = camHeading;
    },
    "pointingStop": (player) => {
        player.stopAnimation();
    },
    "PLAYER::CHANGE_MY_DIMENSION":(player,toggle,notSavePos = false)=>{
        if(toggle){
            player.dimension = player.id*324+10;
            player.notSavePos = notSavePos;
        }else{
            player.dimension = 0;
            player.notSavePos = false;
        }
    }
});