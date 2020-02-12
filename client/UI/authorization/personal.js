let StartPersonal = false;
let gender=0;
let heredity=[0,21,0,0];
let features=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
let appearance=[2,0,0,0];
let overlay = [{"draw":255,"opacity":1,"color_one":0,"color_two":0},{"draw":255,"opacity":1,"color_one":0,"color_two":0},{"draw":255,"opacity":1,"color_one":0,"color_two":0},{"draw":255,"opacity":1,"color_one":0,"color_two":0},{"draw":255,"opacity":1,"color_one":0,"color_two":0},{"draw":255,"opacity":1,"color_one":0,"color_two":0},{"draw":255,"opacity":1,"color_one":0,"color_two":0},{"draw":255,"opacity":1,"color_one":0,"color_two":0},{"draw":255,"opacity":1,"color_one":0,"color_two":0},{"draw":255,"opacity":1,"color_one":0,"color_two":0},{"draw":255,"opacity":1,"color_one":0,"color_two":0},{"draw":255,"opacity":1,"color_one":0,"color_two":0},{"draw":255,"opacity":1,"color_one":0,"color_two":0}];
let tors = [0,0,0,0];
let legs = [0,0];
let foot = [0,0];
let logins;
let skins=[mp.game.joaat("MP_M_Freemode_01"),mp.game.joaat("MP_F_Freemode_01")];
let posCostum = new mp.Vector3(402.9, -996.6, -99)
let cameraIndex = 0;
let age = 25;
let browserAuth = require('./authorization').browser;
let browserPersonal = mp.browsers.new('package://HTML/personal/index.html'); 
browserPersonal.active = false;
mp.events.add({
	"Personal_Start": (n) => {
			browserPersonal.active = true;
			browserAuth.execute(`try{window.auth.hide()}catch(e){}`);
			browserPersonal.execute('try{personal.start()}catch(e){}');
			player.setComponentVariation(3,1,0,0);
			logins = JSON.parse(n);
			mp.game.streaming.requestIpl("hw1_int_placement_interior_v_mugshot_milo_");
			let interiorId = mp.game.interior.getInteriorAtCoords(posCostum.x,posCostum.y,posCostum.z); 
			mp.game.streaming.setHdArea(posCostum.x,posCostum.y,posCostum.z, false);
			player.clearTasksImmediately();
			mp.game.interior.refreshInterior(interiorId);
			player.position = posCostum;
			player.setRotation(0, 0, 190, 0, true);
			player.model = skins[0];
			defaultclothes();
			clearClothes();
			StartPersonal = true;
			mp.events.call('Personal_Skin',0)
			mp.events.call("setCameraPosition",402.9,-997,-98.4,0,0,-30,50);
			mp.events.call('Personal_camera',0)
	},
	"PERSONAL::CHANGE_AGE":(_age)=>{
		age = _age;
	},
	"Personal_Appearance_OK": () => {
		StartPersonal = false;
		let clothes = {
			top: tors,
			legs: legs,
			foot: foot
		}
		let personage = JSON.stringify({
				gender: gender,
				heredity: heredity,
				features: features,
				appearance: appearance,
				overlay: overlay
			}
		);
		mp.events.callRemote('AUTHORIZETE::REG',...logins,personage,JSON.stringify(clothes),age);
		browserPersonal.active = false;
	},
	"Personal_Skin": (i) => {
		gender = i;
		if(gender == 0){
			browserPersonal.execute(`
			try{

				personal.editSector(3,0,'start');
				personal.showItem(10);
				personal.showItem(11);
				personal.showItem(12);
			}catch(e){}
			`);
		} 
		else{
			browserPersonal.execute(`
				try{
					personal.editSector(3,10,'start');
					personal.hideItem(10);
					personal.hideItem(11);
					personal.hideItem(12);
				}catch(e){}
			`);
		} 
		player.model = skins[i];
		defaultclothes();
		for(let i=0;i<features.length;i++){
			player.setFaceFeature(i,features[i]);
		}
		mp.events.call('Personal_Tors',0,true)
		mp.events.call('Personal_Footwear',0)
		mp.events.call('Personal_Pants',0)
		mp.events.call('Personal_camera',0)
		player.setHeadBlendData(heredity[0],heredity[1],0,heredity[0],heredity[1],0,heredity[2],heredity[3],0,false);
	},
	"Personal_Dad": (i) => {
		heredity[0] = i;
		player.setHeadBlendData(heredity[0],heredity[1],0,heredity[0],heredity[1],0,heredity[2],heredity[3],0,false);
	},
	"Personal_Mam": (i) => {
		heredity[1] = i;
		player.setHeadBlendData(heredity[0],heredity[1],0,heredity[0],heredity[1],0,heredity[2],heredity[3],0,false);
	},
	"Personal_SkinMix": (i) => {
		heredity[2] = i/10;
		player.setHeadBlendData(heredity[0],heredity[1],0,heredity[0],heredity[1],0,heredity[2],heredity[3],0,false);
	},
	"Personal_ShapeMix": (i) => {
		copyJSON(heredity)
		heredity[3] = i/10;
		player.setHeadBlendData(heredity[0],heredity[1],0,heredity[0],heredity[1],0,heredity[2],heredity[3],0,false);
	},
	"Personal_Appearance": (i,t) => {
		appearance[t] = i;
		if(gender==0 && appearance[0] >= 23)appearance[0] = i+1;
		if(gender==1 && appearance[0] >= 24)appearance[0] = i+1;
		player.setComponentVariation(2,appearance[0],0,0);
		player.setHairColor(appearance[1],appearance[2]);
		player.setEyeColor(appearance[3]);
	},
	"Personal_Tors": (i,notcamera = false) => {
		let variabel = clothes_shop.tors[gender][i];
		if(variabel.Colors.length > 1){
			browserPersonal.execute(`
			try{
				personal.showItem(5);
				personal.editSectorMax(5,${variabel.Colors.length-1});
			}catch(e){}
			`);
		}else browserPersonal.execute(`personal.hideItem(5)`)
		player.setComponentVariation(11,variabel.Variation,variabel.Colors[0],0);
		let gloves = clothes_shop.gloves[gender][0].Variations[variabel.gloves];
		player.setComponentVariation(3,gloves,0,0);
		tors[0] = i;
		tors[1] = 0;
		tors[2] = 0;
		tors[3] = 0;
		if(variabel.first){
			browserPersonal.execute(`personal.showItem(6)`)
			browserPersonal.execute(`personal.showItem(7)`)
			let additionally = clothes_shop.additionally[gender].filter((item)=>{
				if(variabel.type === item.type) return true;
			})
			browserPersonal.execute(`
			try{
				personal.editSectorMax(6,${additionally.length<5?additionally.length-1:4})
			}catch(e){}
			`)
			
			browserPersonal.execute(`
			try{
				personal.editSectorMax(7,${clothes_shop.additionally[gender][0].Colors.length-1})
			}catch(e){}
			`)
			player.setComponentVariation(8,additionally[0].Variation,additionally[0].Colors[0],0);
		}else{
			browserPersonal.execute(`personal.hideItem(6)`)
			browserPersonal.execute(`personal.hideItem(7)`)
			player.setComponentVariation(8,gender == 0  ? 15 : 14,0,0);
		}
	},
	"Personal_Tors_Color": (i) => {
		// i = clothes_shop.tors[tors[gender]][2][i];
		tors[1] = i;
		let variabel = clothes_shop.tors[gender][tors[0]]
		player.setComponentVariation(11,variabel.Variation,variabel.Colors[i],0);
	},
	"Personal_Down": (i) => {
		let additionally = clothes_shop.additionally[gender].filter((item)=>{
			if(clothes_shop.tors[gender][tors[0]].type === item.type) return true;
		})
		player.setComponentVariation(8,additionally[i].Variation,additionally[i].Colors[0],0);
		browserPersonal.execute(`
		try{
			personal.editSectorMax(7,${additionally[i].Colors.length-1})
		}catch(e){}
		`)
		tors[2] = i;
		tors[3] = 0;
	},
	"Personal_Down_Color": (i) => {
		let additionally = clothes_shop.additionally[gender].filter((item)=>{
			if(clothes_shop.tors[gender][tors[0]].type === item.type) return true;
		})
		player.setComponentVariation(8,additionally[tors[2]].Variation,additionally[tors[2]].Colors[i],0);
		tors[3] = i;
	},
	"Personal_Pants": (i) => {
		legs[0] = i;
		let c = clothes_shop.legs[gender][i];
		player.setComponentVariation(4,c.Variation,c.Colors[0],0);
	},
	"Personal_Footwear": (i) => {
		foot[0] = i;
		let c = clothes_shop.foot[gender][i];
		player.setComponentVariation(6,c.Variation,c.Colors[0],0);
	},
	"Personal_camera": (i) => {
		if(cameraIndex == i )return;
		cameraIndex = i;
		if(i==0) cameraInterp(402.9,-997,-98.4,0,0,0,90);
		if(i==1) cameraInterp(402.9,-998.4,-99,0,0,0,90);
		if(i==2) cameraInterp(402.9,-997.1,-99.8,0,0,0,90,800);
		if(i==3) cameraInterp(402.9,-997.3,-99.5,0,0,0,90,800);
		if(i==4) cameraInterp(402.9,-997,-98.75,0,0,0,90,800);
	},
	"Personal_Features": (t,i) => {
		features[t]=parseFloat(i);
		mp.players.local.setFaceFeature(t,parseFloat(i));
	},
	"Personal_facial_hair": (i) => {
		overlay[1].draw = parseInt(i)-1;
		player.setHeadOverlay(1, overlay[1].draw, overlay[1].opacity, overlay[1].color_one,overlay[1].color_two);
		if(parseInt(i) == 0) browserPersonal.execute(`
		try{

			personal.hideItem(11);
			personal.$nextTick(function () {
				try{
					personal.hideItem(12)
				}catch(e){}
			});
		}catch(e){}
		`)
		else browserPersonal.execute(`
		try{
			personal.showItem(11);
			personal.$nextTick(function () {
				try{
					personal.showItem(12);
				}catch(e){}
			});
		}catch(e){}
		`)
	},
	"Personal_facial_hair_color": (i) => {
		
		overlay[1].color_one = parseInt(i);
		player.setHeadOverlay(1, overlay[1].draw, overlay[1].opacity, overlay[1].color_one,overlay[1].color_two);
	},
	"Personal_facial_hair_opacity": (i) => {
		overlay[1].opacity = 1/25*parseInt(i);
		player.setHeadOverlay(1, overlay[1].draw, overlay[1].opacity, overlay[1].color_one,overlay[1].color_two);
	},
	"Personal_EyeBrows":(i)=>{
		if(i === 0) i = 255;
		else i--;
		overlay[2].draw = i;
		player.setHeadOverlay(2, overlay[2].draw, overlay[2].opacity, overlay[2].color_one,overlay[2].color_two);
	},
	"Personal_EyeBrows_Color": (i) => {
		overlay[2].color_one = parseInt(i);
		player.setHeadOverlayColor(2, 1, overlay[2].color_one, overlay[2].color_one);
	},
	"PLAYER::LOAD_PERSONAGE":(personageInfo)=>{
		personageInfo = JSON.parse(personageInfo);
		mp.events.call("APPEARANCE::COLOR",personageInfo.appearance[1]);
		mp.events.call("APPEARANCE::HIGHLIGHTS",personageInfo.appearance[2]);
		mp.events.call("APPEARANCE::LENSE",personageInfo.appearance[3]);
		mp.events.call("OVERLAYS::SET",personageInfo.overlay,true);
		mp.events.call("TATTOOS::SET",personageInfo.tattoos,true);
	}
});
function defaultclothes() {
	player.setHeadBlendData(heredity[0],heredity[1],0,heredity[0],heredity[1],0,heredity[2],heredity[3],0,false);
	player.setComponentVariation(2,appearance[0],0,0);
	player.setHairColor(appearance[1],appearance[2]);
	player.setEyeColor(appearance[3]);
	player.setComponentVariation(11,15,0,0);
	player.setComponentVariation(8,15,0,0);
	player.setComponentVariation(3,15,0,0);
}
let rot = 190;
mp.keys.bind(0x45, true, function() {
	if(!StartPersonal) return;
	if(rot < 250) {
		rot += 10;
		player.setRotation(0, 0, rot, 0, true);
		player.position = new mp.Vector3(402.9, -996.6, -99);
	}
})
mp.keys.bind(0x51, true, function() {
	if(!StartPersonal) return;
	if(rot > 130){
		rot -= 10;
		player.setRotation(0, 0, rot, 0, true);
		player.position = new mp.Vector3(402.9, -996.6, -99);
	} 
})