require('./ems.js');
require('./army.js');
require('./ch.js');
require('./lspd.js');
let gangs = require('../gang/index').gangs;
let mafias = require('../mafia/index').mafias;
let {browserFractions} = require('./browser');
mp.events.add("FRACTION::SET",(fraction,rank,underRang,infoRangs)=>{
	if(fraction != ''){
		infoRangs = JSON.parse(infoRangs);
		player.fraction = fraction;
		player.rank = rank;
		player.infoRang = infoRangs[rank];
		if(gangs.indexOf(fraction) != -1)player.hasGang = true
		else player.hasGang = false;
		if(mafias.indexOf(fraction) != -1){
			mp.events.call("MAFIA::SET",fraction);
            player.hasMafia = true
        }
		else player.hasMafia = false;
	}else{
        if(player.hasMafia)mp.events.call("MAFIA::STOP");
        player.fraction = undefined;
		player.rank = undefined;
		player.infoRang = undefined;
		player.hasGang = false;
		player.hasMafia = false;
	}
})