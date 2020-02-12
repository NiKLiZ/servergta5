let show = false;
let atms = require('../../SYSTEM/bank/atm').atmsPositions;
let banks = require('../../SYSTEM/bank/bank').bankPositions;
// require('./test')
let tunings = require('../tuning').tunings;
let clothes = require('../clothes/interaction').clothes.map((clothe)=>clothe.position);;
let tatus = require('../tatu').tatus.map((tatu)=>tatu.posMarker);
let barbershops = require('../barbershop/index').barbershop.map((barbershop)=>barbershop.posMarker);
let mayoralty = require('../../SYSTEM/mayoralty').mayoraltyPosition;
let jobs = require('../../SYSTEM/jobs').jobs;
let points = require('./points').points;
let aps = require('../../../packages/configs/fillings').map((item)=>item.pos);
let browserPhone = mp.browsers.new('package://HTML/phone/index.html'); 
let phoneInfo;
let defaultContacts = [
    {
        "name":"Такси",
        "callRemote": 'TAXI::CALL',
    },
    {
        "name": 'Скорая помощь',
        "callRemote": 'EMS::CALL',
    },
    {
        "name": 'Полиция',
        "callRemote": 'LSPD::CALL',
    },
]


browserPhone.execute(`phone.apps.gps.points = ${JSON.stringify(points)};`);
let findPos = (info)=>{
    let pos = player.position;
    let arr = info.map(item=>mp.game.pathfind.calculateTravelDistanceBetweenPoints(item.x,item.y,item.z,pos.x,pos.y,pos.z));
	let min = arr[0];
	let index = 0;
	for (let i = 1; i < arr.length; i++) {
		if (arr[i] < min){
			min = arr[i];
			index = i;
		} 
    }
    return info[index];
}

function toggle(){
    try{
        if(!loggined)return;
        if(!phoneInfo)return alert("У вас в инвентаре нету телефона")
        if(!isGUIOpen() && !show) return;
        if(!show && player.hasDead)return alert('Нельзя использовать телефон когда вы в отключке')
        show = !show;
        guitoggle(show,true);
        if(show){
            closemenuv();
            browserPhone.execute(`
                phone.show();
            `);
            browser.execute(`
                speed.hide();
            `);
        }else{
            browserPhone.execute(`phone.isShow = false;`)
            if(player.vehicle && mp.storage.data.setting.spedometr.type == 1)browser.execute('speed.show();');
        }
        mp.events.callRemote("PHONE::TOGGLE",show)
    }catch(e){
        console.error(e)
    }
}

mp.events.add({
    "PHONE::GPS_SET":(type,job)=>{
        let pos;
        if(type == 'atm'){
            pos = findPos(atms);
        }
        if(type == 'bank'){
            pos = findPos(banks);
        }
        if(type == 'tuning'){
            pos = findPos(tunings);
        }
        if(type == 'clothes'){
            pos = findPos(clothes);
        }
        if(type == 'tatu'){
            pos = findPos(tatus);
        }
        if(type == 'barbershop'){
            pos = findPos(barbershops);
        }
        if(type == 'aps'){
            pos = findPos(aps);
        }
        if(type == 'mayoralty'){
            pos = mayoralty;
        }
        if(type == 'home'){
            mp.events.callRemote('PHONE::HOME_GPS');
            return
        }
        if(type == 'job'){
            pos = jobs[job].pos;
        }
        if(!pos)return alert('GPS не найден')
        alert('Маркер установлен')
        mp.game.ui.setNewWaypoint(pos.x,pos.y);
    },
    "PHONE::TOGGLE": toggle,
    "PHONE::GPS_SEND":(number)=>{
        let street = mp.game.pathfind.getStreetNameAtCoord(player.position.x, player.position.y, player.position.z, 0, 0);
        let textStreeet = `${mp.game.ui.getStreetNameFromHashKey(street.streetName)} ${mp.game.ui.getStreetNameFromHashKey(street.crossingRoad)}`
        mp.events.callRemote("PHONE::GPS_SEND",number,textStreeet);
    },
    "PHONE::SET_GPS":(pos)=>{
        pos = JSON.parse(pos);
        alert('Маркер установлен')
        mp.game.ui.setNewWaypoint(pos.x,pos.y);
    },
    "PHONE::DATA_UPDATE":(info)=>{
        if(info){
            info = JSON.parse(info);
            phoneInfo = info;
            info.apps.contact.contacts.push(...defaultContacts)
            if(info)browserPhone.execute(`
            phone.phone = ${info.number};
            phone.apps.call.sleeping = ${info.apps.sms.sleeping};
            phone.apps.sms.dialogs = ${JSON.stringify(info.apps.sms.dialogs)};
            phone.apps.contacts.contacts = ${JSON.stringify(info.apps.contact.contacts)};
            phone.apps.call.calls = ${JSON.stringify(info.apps.call.calls)};
            `)
        }else{
            phoneInfo = undefined;
        }
    },
    "PHONE::CALL_BROWSER":(cal,...args)=>{
        chat(5)
		browserPhone.execute(`mp.call('${cal}',${args.join(',')})`)
	}
})
mp.keys.bind(0x12, false,()=>{
    if(!mp.keys.isDown(16))toggle();
})


let ip =  typeof debag != "undefined" ? '127_0_0_1_22005' : '145_239_149_95_22005';

mp.gui.execute(`
try{

    window.getScreenBase64 = (ip)=>{
            toDataURL(\`mp://screenshots/$\{ip}/screen.jpg\`,(result)=>{
                mp.trigger('GET_SCREENBASE64',result)
        })
    }
    function toDataURL(src, callback) {
        var img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = function() {
          var canvas = document.createElement('CANVAS');
          var ctx = canvas.getContext('2d');
          var dataURL;
          canvas.height = this.naturalHeight;
          canvas.width = this.naturalWidth;
          ctx.drawImage(this, 0, 0);
          dataURL = canvas.toDataURL();
          callback(dataURL);
        };
        img.src = src;
        if (img.complete || img.complete === undefined) {
          img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
          img.src = src;
        }
      }
}catch(e){
    console.error(e);
}

  `)

function getScreenBase64(){
    return new Promise((resolve,reject)=>{
        try{
            mp.gui.takeScreenshot("screen.jpg", 0, 0, 100);
            mp.gui.execute(`getScreenBase64(${ip})`)
            mp.events.add("GET_SCREENBASE64",(...base64)=>{
                try{
                    mp.events.remove("GET_SCREENBASE64");
                    resolve(base64);
                }catch(e){
                    reject(e);
                }
            })
        }catch(e){reject(e)}
    })
}
// getScreenBase64();
global.getScreenBase64 = getScreenBase64;
