const AnimList = require('./animations');
class AnimPlayer{
	constructor(){
		this.allList = AnimList;
		this.currentList = [];
		this.dist = 0;
		this.name = 0;
		this.launched = false;
		this.flag = 1;
		this.request = '';
		this.autoPlay = true;
	}
	toggle(subString = ''){
		if(!this.launched){
			this.createCurrentList(subString);
			this.flag = 1;
			this.launched = true;
		} else {
			this.play(false);
			this.launched = false;
		}
	}
	createCurrentList(subString = ''){
		this.currentList = [];
		this.dist = 0;
		this.name = 0;
		this.request = subString;
		for(let idx in this.allList){
			let list = [];
			if(this.allList[idx][0].indexOf(subString)!=-1){
				list = this.allList[idx];
				list[2] = idx;
				this.currentList.push(list);
			}else{
				list[0] = this.allList[idx][0];
				list[1] = [];
				for(let i=0; i < this.allList[idx][1].length; i++){
					if(this.allList[idx][1][i].indexOf(subString)!=-1){
						list[1].push(this.allList[idx][1][i]);
						list[2] = idx;
					}
				}
				if(list.length==3 && list[1].length) this.currentList.push(list);
			}
		}
		if(this.currentList.length){
			if(this.launched && this.autoPlay) this.play();
		} else mp.gui.chat.push(`Nothing found on request '${subString}'`);
	}
	setFlag(value){
		if(this.launched){
			if(Number.isInteger(value)) this.flag = value;
			else if(value==='up') this.flag += 1;
			else if(value==='down' && (this.flag-1)!==0) this.flag -= 1;
			else mp.gui.chat.push('Flag is not valid!');
			if(this.autoPlay) this.play();
		} else mp.gui.chat.push('You can\'t set flag. First open AnimPlayer');
	}
	change(dist=false, name=false){
		if(dist!==false && this.currentList.length>1){
			if(dist > (this.currentList.length - 1)) this.dist = dist - this.currentList.length;
			else if(dist < 0) this.dist = dist + this.currentList.length;
			else this.dist = dist;
			this.name = 0;
		}
		if(name!==false && this.currentList[this.dist][1].length>1){
			if(name > (this.currentList[this.dist][1].length - 1)) this.name = name - this.currentList[this.dist][1].length;
			else if(name < 0) this.name = name + this.currentList[this.dist][1].length;
			else this.name = name;
		}
		if(this.autoPlay) this.play();
	}
	play(toggle=true){
		if(this.launched){
			mp.events.callRemote("animationEvent", toggle, this.currentList[this.dist][0],this.currentList[this.dist][1][this.name], this.flag);
		}
	}
}

let AP = new AnimPlayer();

mp.events.add({
	render:()=>{
		try{
			if(AP.launched&&AP.currentList.length>0){
				const dist = AP.currentList[AP.dist][0];
				const nameList = AP.currentList[AP.dist][1];
				const name = nameList[AP.name];
				const id = AP.currentList[AP.dist][2];
				const flag = AP.flag;

				const fontOptions = {font:4,color:[255,255,255,200],scale:[.5,.5],outline:!0};
				const fontOptionsLittle = {font:4,color:[255,255,255,100],scale:[.45,.45],outline:!0};

				const infoListDist = `(${AP.dist+1}/${AP.currentList.length})`;
				const infoListName = `(${AP.name+1}/${AP.currentList[AP.dist][1].length})`;
				const infoRequest = (AP.request.length) ? `~b~Request : '${AP.request}'` : '~b~All';

				mp.game.graphics.drawText(`Animation: ${infoListDist} ${infoListName} | ${infoRequest}`, [.5,.04], fontOptions);

				//Draw prew name dist
				const namePrev = (AP.name-1>=0) ? nameList[AP.name-1] : false;
				if(namePrev) mp.game.graphics.drawText(`~y~${dist} ~w~| ~b~${namePrev}`, [.5,.08], fontOptionsLittle);
				
				//Draw current name dist
				mp.game.graphics.drawText(`~g~[ ${id} ] ~y~${dist} ~w~| ~b~${name} ~r~( ${flag} )`, [.5,.12], fontOptions);

				//Draw next name dist
				const nameNext = (AP.name+1<nameList.length) ? nameList[AP.name+1] : false;
				if(nameNext) mp.game.graphics.drawText(`~y~${dist} ~w~| ~b~${nameNext}`, [.5,.16], fontOptionsLittle);
				
				if(mp.keys.isDown(72) === true && chatActive === false){ // H
					mp.game.graphics.drawText(`~w~LEFT/RIGHT change anim dist~n~`, [.5,.75], fontOptions);
					mp.game.graphics.drawText(`~w~CTRL + LEFT/RIGHT change anim dist on 100~n~`, [.5,.78], fontOptions);
					mp.game.graphics.drawText(`~w~SHIFT + LEFT/RIGHT change anim dist on 10~n~`, [.5,.81], fontOptions);
					mp.game.graphics.drawText(`~w~UP/DOWN change anim name~n~`, [.5,.84], fontOptions);
					mp.game.graphics.drawText(`~w~CTRL + UP/DOWN change anim flag~n~`, [.5,.87], fontOptions);
					mp.game.graphics.drawText(`~w~/animflag [up/down/number] change anim flag~n~`, [.5,.9], fontOptions);
					mp.game.graphics.drawText(`~w~/animplayer [request/dist/dist+name] create new anim list on request or find anim~n~`, [.5,.93], fontOptions);
				} else mp.game.graphics.drawText(`~w~Hold down H to browse help~n~`, [.5,.93], fontOptionsLittle);
			}
		}catch(e){}
	},
	animFlag:(value)=>{
		if(AP.launched) AP.setFlag(value);
	},
	findAnim:(dist, name=false)=>{
		if(!AP.launched) AP.toggle();
		if(AP.launched){
			AP.createCurrentList();
			AP.dist = dist;
			if(name!==false){
				if(name<AP.currentList[AP.dist][1].length && name>=0) AP.name = name;
				else mp.gui.chat.push(`Name at ${name} is not found`);
			}
		}
	},
	createAnimList:(string)=>{
		if(AP.launched){
			AP.dist = 0;
			AP.name = 0;
			AP.createCurrentList(string);
		}
		else AP.toggle(string);
	},
});

mp.keys.bind(39,1,function(){ //Right
	if(chatActive) return;
	if(AP.launched){
		let dist = AP.dist;
		if(mp.keys.isDown(16) === true && AP.currentList.length > 100) dist+=10;
		else if(mp.keys.isDown(17) === true && AP.currentList.length > 100) dist+=100;
		else dist+=1;
		AP.change(dist);
	}
});
mp.keys.bind(37,1,function(){ //Left
	if(chatActive) return;
	if(AP.launched){
		let dist = AP.dist;
		if(mp.keys.isDown(16) === true && AP.currentList.length > 100) dist-=10;
		else if(mp.keys.isDown(17) === true && AP.currentList.length > 100) dist-=100;
		else dist-=1;
		AP.change(dist);
	}
});
mp.keys.bind(38,1,function(){ //Up
	if(chatActive) return;
	if(AP.launched){
		if(mp.keys.isDown(17) === true) AP.setFlag('up');
		else AP.change(false, AP.name-1);
	}
});
mp.keys.bind(40,1,function(){ //Down
	if(chatActive) return;
	if(AP.launched){
		if(mp.keys.isDown(17) === true) AP.setFlag('down');
		else AP.change(false, AP.name+1);
	}
});
mp.keys.bind(32,1,function(){ //Space
	if(chatActive) return;
	if(AP.launched && !AP.autoPlay){
		AP.play(true);
	}
});
mp.keys.bind(8,1,function(){ //Backspace
	if(!player.permision['ADMIN::MENU']) return;
	if(chatActive) return;
	if(AP.launched && AP.request.length>0){
		AP.createCurrentList();
	}
});
mp.keys.bind(192,1,function(){
	if(!player.permision['ADMIN::MENU']) return;
	if(chatActive) return;
	AP.toggle();
});
mp.keys.bind(0x11,1,function(){
	if(!player.permision['ADMIN::MENU']) return;
	if(chatActive) return;
	if(!AP.launched) return;
	if(mp.keys.isDown(17)) copy(`"${AP.currentList[AP.dist][0]}","${AP.currentList[AP.dist][1][AP.name]}"`)
})