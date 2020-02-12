const movementClipSet = "move_ped_crouched";
const strafeClipSet = "move_ped_crouched_strafing";

const clipSetSwitchTime = 0.4;
let walkingStyles = [
    {Name: "Normal", AnimSet: null},
    {Name: "Brave", AnimSet: "move_m@brave"},
    {Name: "Confident", AnimSet: "move_m@confident"},
    {Name: "Drunk", AnimSet: "move_m@drunk@verydrunk"},
    {Name: "Fat", AnimSet: "move_m@fat@a"},
    {Name: "Gangster", AnimSet: "move_m@shadyped@a"},
    {Name: "Hurry", AnimSet: "move_m@hurry@a"},
    {Name: "Injured", AnimSet: "move_m@injured"},
    {Name: "Intimidated", AnimSet: "move_m@intimidation@1h"},
    {Name: "Quick", AnimSet: "move_m@quick"},
    {Name: "Sad", AnimSet: "move_m@sad@a"},
    {Name: "Tough", AnimSet: "move_m@tool_belt@a"}
];
const loadClipSet = (clipSetName) => {
    mp.game.streaming.requestClipSet(clipSetName);
    while (!mp.game.streaming.hasClipSetLoaded(clipSetName)) mp.game.wait(0);
};

// load clip sets
loadClipSet(movementClipSet);
loadClipSet(strafeClipSet);

function setWalkingStyle(pl, style) {
    if (!style) {
        pl.resetMovementClipset(0.0);
    } else {
       loadClipSet(style)

        pl.setMovementClipset(style, 0.0);
    }
}

function setMood(player, mood) {
    if (!mood) {
        player.clearFacialIdleAnimOverride();
    } else {
        mp.game.invoke("0xFFC24B988B938B38", player.handle, mood, 0);
    }
}
let crouchKey = 26
let proneKey = 36
let crouched = false
let proned = false
mp.events.add({
    "entityStreamIn": (entity) => {
        if (entity.type !== "player") return;
        setWalkingStyle(entity, entity.getVariable("walkingStyle"));
        if(entity.getVariable("isCrouched")){
            entity.setMovementClipset(movementClipSet, clipSetSwitchTime);
            entity.setStrafeClipset(strafeClipSet);
        }else{
            entity.resetMovementClipset(clipSetSwitchTime);
            entity.resetStrafeClipset();
        }
        setMood(entity, entity.getVariable("currentMood"));
        if(entity.getVariable("visible")!= undefined)entity.setVisible(!!entity.getVariable("visible"),!!entity.getVariable("visible"));
        entity.setInvincible(!!entity.getVariable("invincible"));
    },
    "PLAYER::SET_NEW_WAYPOINT": (x,y)=>{
        mp.game.ui.setNewWaypoint(x,y);
    }
    // "render":()=>{
    //     if(!player.isDead()){
    //         prontMoment();
    //         mp.game.controls.disableControlAction(0, crouchKey, true);
    //         mp.game.controls.disableControlAction(0, proneKey, true);
    //         if(!mp.game.ui.isPauseMenuActive()){
    //             // && !crouched && !player.isInAnyVehicle(true) && !player.isFalling() && !player.isFalling() && !player.isInCover && !player.isInParachuteFreeFall() && (player.getParachuteState() == 0 || player.getParachuteState() == -1)
    //            if(mp.game.controls.isDisabledControlJustPressed(0, 26) ){
    //                 if(proned) {
	// 					player.clearTasksImmediately();
	// 					proned = false
    //                 }
    //                 else if(!proned){
    //                     mp.game.streaming.requestAnimDict('move_jump');
	// 					mp.game.streaming.requestAnimSet( "move_crawl" )
	// 					while ( !mp.game.streaming.hasAnimSetLoaded( "move_crawl" ) ){
    //                         mp.game.wait(100);
    //                     } 
	// 					player.clearTasksImmediately();
	// 					proned = true
	// 					if(player.isSprinting() || player.isRunning() || player.getSpeed() > 5) {
    //                         mp.events.callRemote("animationEvent",true,"move_jump", "dive_start_run",0)
	// 						// player.taskPlayAnim("move_jump", "dive_start_run", 8.0, 1.0, -1, 0, 0.0, 0, 0, 0)
	// 						mp.game.wait(1000);
    //                     }
	// 					SetProned()
    //                 }
    //             }
    //         }else{
    //             proned = false;
	// 		    crouched = false;
    //         }
    //     }
    // }
});
let movefwd = false;
let movebwd  = false;
let SetProned = ()=>{
    player.clearTasksImmediately();
    mp.events.callRemote("animationEvent",true,"move_crawl", "onfront_fwd",46)
	// player.taskPlayAnimAdvanced("move_crawl", "onfront_fwd", player.position.x,player.position.y,player.position.z, 0.0, 0.0, player.getHeading(), 1.0, 1.0, 1.0, 46, 1.0, 0, 0)
}
let prontMoment = (entity)=>{
    if(proned == true){
        if(mp.game.controls.isControlPressed(0, 32) || mp.game.controls.isControlPressed(0, 33)){
            // mp.game.player.disablePlayerFiring(false);
        }
        else if(mp.game.controls.isControlJustReleased(0, 32) || mp.game.controls.isControlJustReleased(0, 33)){
            // mp.game.player.disablePlayerFiring(false);
        }
        if(mp.game.controls.isControlJustPressed(0, 32) && !movefwd){
            mp.events.callRemote("animationEvent",true,"move_crawl", "onfront_fwd",47)
            // player.taskPlayAnimAdvanced("move_crawl", "onfront_fwd", player.position.x,player.position.y,player.position.z, 1.0, 0.0, player.getHeading(), 1.0, 1.0, 1.0, 47, 1.0, 0, 0);
            movefwd = true
        }
        if(mp.game.controls.isControlJustReleased(0, 32) && movefwd){
            mp.events.callRemote("animationEvent",true,"move_crawl", "onfront_fwd",46)
            // player.taskPlayAnimAdvanced("move_crawl", "onfront_fwd", player.position.x,player.position.y,player.position.z, 1.0, 0.0, player.getHeading(), 1.0, 1.0, 1.0, 46, 1.0, 0, 0);
            movefwd = false
        }

        if(mp.game.controls.isControlJustPressed(0, 33) && !movebwd){
            mp.events.callRemote("animationEvent",true,"move_crawl", "onfront_bwd",47)
            // player.taskPlayAnimAdvanced("move_crawl", "onfront_bwd", player.position.x,player.position.y,player.position.z, 1.0, 0.0, player.getHeading(), 1.0, 1.0, 1.0, 47, 1.0, 0, 0);
            movebwd = true
        }
        if(mp.game.controls.isControlJustReleased(0, 33) && movebwd){
            mp.events.callRemote("animationEvent",true,"move_crawl", "onfront_bwd",46)
            // player.taskPlayAnimAdvanced("move_crawl", "onfront_bwd", player.position.x,player.position.y,player.position.z, 1.0, 0.0, player.getHeading(), 1.0, 1.0, 1.0, 46, 1.0, 0, 0);
            movebwd = false
        }
        if(mp.game.controls.isControlPressed(0, 34)){
            player.setHeading(player.getHeading()+2);
        }else if(mp.game.controls.isControlPressed(0, 35)){
            player.setHeading(player.getHeading()-2);
        }
    }
}

mp.events.addDataHandler({
    "walkingStyle":(entity,value)=>{
        setWalkingStyle(entity, value);
    },
    "isCrouched":(entity,value)=>{
        if (value) {
            entity.resetMovementClipset(clipSetSwitchTime);
            entity.clearTasks();
            entity.setMovementClipset(movementClipSet, clipSetSwitchTime);
            entity.setStrafeClipset(strafeClipSet);
        } else {
            entity.clearTasks();
            entity.resetMovementClipset(clipSetSwitchTime);
            entity.resetStrafeClipset();
        }
    },
    "currentMood":(entity,value)=>{
        setMood(entity, value);
    },
    "visible":(entity,value)=>{
        mp.game.invoke(getNative("SET_PED_CURRENT_WEAPON_VISIBLE"), entity.handle, value ? 0 :  1, 1, 1, 1);
        entity.setVisible(value,value);
    },
    "invincible":(entity,value)=>{
        entity.setInvincible(value);
    },
})
