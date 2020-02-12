let checkpoints = [];
let start = false;
let checkpoint = 0;
let callfinish;
let racevehicle;
let delcheck;
let checkpoint_checked = null;
let check = {
	type: 0,
	color:  [40,255,0,60],
	scale: 6
}
global.endrace = ()=>{
	checkpoints = [];
	start = false;
	checkpoint = 0;
	callfinish = null;
	racevehicle = null;
	checkpoint_checked = null;
	if(delcheck) delcheck.del();
	delcheck = null;
	check = {
		type: 0,
		color:  [40,255,0,60],
		scale: 6
	}
}
global.startrace = (checks,vehicle,callback)=>{
	racevehicle = vehicle;
	checkpoints = checks;
	check.direction = checks[1];
	check.position = JSON.parse(JSON.stringify(checks[0]));
	callfinish = callback;
	start = true;
	checkpoint = 0;
	mp.game.ui.setNewWaypoint(check.position.x,check.position.y)
	next_race_check();
}

let next_race_check = ()=>{
	 delcheck = createCheckpoint(check,(checkx)=>{
			if(player.vehicle != racevehicle) return;
			checkpoint++;
			if(checkpoints.length!=checkpoint){
				check.position = JSON.parse(JSON.stringify(checkpoints[checkpoint]))
				if(checkpoint!=checkpoints.length -1) check.direction = checkpoints[checkpoint+1];
				else check.type = 4
				mp.game.ui.setNewWaypoint(check.position.x,check.position.y)
				next_race_check();
			}else{
				callfinish();
				endrace();
				return ;
			}
			if(checkx)checkx.del();
	 		if(checkpoint_checked) checkpoint_checked(checkx);
	});
}
global.race_checked = (col)=>{
	checkpoint_checked = col;
}