let guitoggle_is = false;
let ChangeTime = true;
mp.game.graphics.transitionFromBlurred(0);
global.chat = (str)=>{
    mp.gui.chat.push(''+str)
}
global.notify = (text)=>{
    mp.game.graphics.notify(text)
}
global.cursor = (is)=>{
    // if(guitoggle_is) return;
    mp.gui.cursor.visible = is;
}
//рандомизация числа от до 
global.randomInt = (min, max)=>{
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
// возвращает координат по оси z
global.getGroundZFor3dCoord = (pos)=>{
    let z = 0;
    let posz = player.position;
    player.position = pos;
    let i = 0;
    while(z == 0 && z < pos.z) // The chance that ground Z is 0.0 _exactly_ is really small
    {
        mp.game.streaming.requestCollisionAtCoord(pos.x, pos.y, pos.z);
        z = mp.game.gameplay.getGroundZFor3dCoord(pos.x, pos.y,pos.z+1, 0, false)
        i++;
        if(i == 100){
          z = pos.z - 1;  
        } 
    }
    player.position = posz;
    return z;
}
// дать координаты позиции waypoint
global.getWaypointPosition = ()=>{
    const interator = mp.game.invoke("0x186E5D252FA50E7D");
    let blipHandle = mp.game.invoke("0x1BEDE233E6CD2A1F", interator);
    do {
        if(mp.game.invoke('0xBE9B0959FFD0779B', blipHandle)) {
            let position = mp.game.ui.getBlipInfoIdCoord(blipHandle);
            position.z = mp.game.gameplay.getGroundZFor3dCoord(position.x, position.y, 1000.0, 0.0, false);
            return position;
        }
        blipHandle = mp.game.invoke('0x14F96AA50D6FBEA7', interator);
    } while(mp.game.invoke("0x86A652570E5F25DD", blipHandle));
}
mp.Vector3.Distance = function (v1, v2){
    return Math.abs(Math.sqrt(Math.pow((v2.x - v1.x),2) + Math.pow((v2.y - v1.y),2)+Math.pow((v2.z - v1.z),2)));
}
global.guitoggle = (toggle,disableBlur)=>{
    if(!disableBlur && toggle){
        if(!mp.storage.data.setting || mp.storage.data.setting.blur)mp.game.graphics.transitionToBlurred(10);
    }else{
        mp.game.graphics.transitionFromBlurred(10);
    }
    guitoggle_is = toggle;
    global.menuvlocked = toggle;
    mp.gui.chat.activate(!toggle);
    global.menuactive = !toggle;
    displayRadar(!toggle);
    mp.gui.cursor.show(toggle,toggle)
    
}
global.alert = (msg,type = 0,layout = 10,time = 1500)=>{
    mp.events.call('alert',msg,type,layout,time)
}
global.copy = (text)=>{
    browser.execute(`copy('${text}')`)
}
global.copyJSON = (text)=>{
    browser.execute(`copyJSON('${JSON.stringify(text)}')`)
}
//сидишь ли ты в машине за определённым местом
global.isSeatVehicle = (seat)=>{
    if(!player.vehicle) return false;
    if(mp.players.atHandle(player.vehicle.getPedInSeat(seat)) && mp.players.atHandle(player.vehicle.getPedInSeat(seat)).id == player.id) return true;
    return false;
}
global.drawSprite = (distName,textureName,screenX, screenY,scaleX,scaleY,heading = 255,r = 255,g = 255,b = 255,a = 255)=>{
    if(!mp.game.graphics.hasStreamedTextureDictLoaded(distName)){
        mp.game.graphics.requestStreamedTextureDict(distName, false);
    }else{
        mp.game.graphics.drawSprite(distName,textureName,screenX, screenY,scaleX,scaleY,heading,r,g,b,a);
    }
}
global.get_heading_2d = (pos1,pos2)=>{
    let dx = pos1.x - pos2.x;
    let dy = pos1.y - pos2.y;
    return mp.game.gameplay.getHeadingFromVector2d(dx, dy);
}
global.polarToCartesian = function(pos, r, angle){
    angle = (angle - 90) * Math.PI / 180;
    return {
      x: pos.x + r * Math.cos(angle),
      y: pos.y + r * Math.sin(angle),
      z: pos.z
    };
  };
//фунция для того чтобы игрок смотрел в нужное точку на нужном расстоянии
global.set_player_pos_at_position = (pos,radius)=>{
    let heading =  get_heading_2d(pos,player.position);
    player.setRotation(0, 0, heading, 1, true);
    let polarPos = polarToCartesian(pos,radius,heading);
    polarPos.z = player.position.z;
    player.position = polarPos;
}

//между cef и сервером

global.hideRadialGUI = ()=>{
    if(guitoggle_is === true) return ;
    browser.execute(`radial_gui.nav.hide();
        $('.hint_radial').removeClass('active')`)
    global.menuvlocked = false;
    mp.gui.chat.activate(!false);
    global.menuactive = !false;
    displayRadar(!false);
    mp.gui.cursor.visible = false;
    radial_gui_show = false;
}
global.showRadialGUI = ()=>{
    if(guitoggle_is === true) return ;
    browser.execute('radial_gui.nav.show();')
    global.menuvlocked = true;
    mp.gui.chat.activate(!true);
    global.menuactive = !true;
    displayRadar(!true);
    mp.gui.cursor.visible = true;
    radial_gui_show = true;
}
mp.events.add({
    "CallRemote": (cal,...args) => {
        mp.events.callRemote(cal,...args)
    },
    "guitoggle": (t)=>{
        guitoggle(t);
    },
    "guitoggle_radial": hideRadialGUI,
    "hideRadialGui": hideRadialGUI,
    "BROWSER::EXECUTE":(text)=>{
        copy(text)
        browser.execute(`${text}`);
    }
})
global.updateRadialGUI = (items)=>{
    try{
        let execute = JSON.stringify(items);
        browser.execute(`radial_gui.nav.updateButtons(${execute})`);
    }catch(e){
        chat(""+e)
    }
}

let radial_gui_show = false;
global.isOwnerVehicle = (entity)=>{
    if(!entity.remoteId) return;
    if(entity  == player.parking)return entity;
    if(entity  == player.hire)return entity;
    let vehicles = JSON.parse(player.getVariable('vehicles') || '[]');
    let id = vehicles.indexOf(entity.remoteId);
    if(id != -1) return mp.vehicles.atRemoteId(entity.remoteId);
}
global.isGUIOpen = ()=>{
    return !(chatActive || !loggined || menuvlocked || mp.gui.cursor.visible);
}

global.displayRadar = (is)=>{
    if(mp.storage.data.setting.hud != false)mp.game.ui.displayRadar(is);
}
global.setClockEdit = (is)=>{
    ChangeTime = is;
    functChangeTime();
}

let functChangeTime = ()=>{
    if(ChangeTime){
        try{
            let dat = new Date();
            dat.setHours(dat.getHours() + 3, dat.getMinutes() + dat.getTimezoneOffset())
            let hours = dat.getHours();
            mp.game.time.setClockTime(hours, dat.getUTCMinutes(), dat.getUTCSeconds());
        }catch(e){}
    }
}
setInterval(functChangeTime,1000)

function GetMinimapAnchor(){
    let safezone =  mp.game.graphics.getSafeZoneSize();
    let safezone_x =  1.0  /  20.0;
    let safezone_y =  1.0  /  20.0;
    let aspect_ratio =  mp.game.graphics.getScreenAspectRatio( false);
    let {x, y} =  mp.game.graphics.getScreenResolution(0, 0);;
    let xscale =  1.0  /  x;
    let yscale =  1.0  /  y;
    let Minimap = {};
	Minimap.width =  xscale *  (x / (4  *  aspect_ratio));
	Minimap.height =  yscale *  (y /  5.674);
	Minimap.left_x =  xscale *  (x *  (safezone_x * ((Math.abs(safezone - 1.0 )) *  10)));
	Minimap.bottom_y =  1.0 - yscale *  (y *  (safezone_y * ((Math.abs(safezone - 1.0 )) *  10)));
	Minimap.right_x = Minimap.left_x +  Minimap.width;
	Minimap.top_y = Minimap.bottom_y - Minimap.height;
	Minimap.x =  Minimap.left_x;
	Minimap.y = Minimap.top_y;
	Minimap.xunit = xscale;
	Minimap.yunit = yscale;
	return Minimap;
}