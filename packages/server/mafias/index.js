let fraction = require('../fractions/class.js');
let configLCN = require('../../configs/mafias/LCN.json');
let configCM = require('../../configs/mafias/CM.json');
let configRM = require('../../configs/mafias/RM.json');

let interiror = new mp.Vector3(1398.0931396484375,1164.0560302734375,113.33361053466797);

mp.fractions.LCN = new fraction('LCN',[209, 115, 206,255],configLCN.rank,configLCN.vehs,configLCN.join,"mafia",{
    dimension: 10,
    interiror: interiror
});
// Columbian Mafia
mp.fractions.CM = new fraction('CM',[209, 115, 206,255],configCM.rank,configCM.vehs,configCM.join,"mafia",{
    dimension: 11,
    interiror: interiror
});
// RUSSIA MAFIA
mp.fractions.RM = new fraction('RM',[209, 115, 206,255],configRM.rank,configRM.vehs,configRM.join,"mafia",{
    dimension: 12,
    interiror: interiror
});

mp.events.add({
    "MAFIA::MENU":(player)=>{
        if(!player.fraction)return;
		let online_staff = player.fraction.getOnlineMembers().map((pl)=>{
			return {
				name: pl.name,
				rank: pl.mongoUser.fraction.rank,
				warn: pl.mongoUser.fraction.warn || 0,
			}
		})
		player.fractionEval(`
            mafia_menu.online_staff = ${JSON.stringify(online_staff)};
		`)
    },
});

mp.events.push({
    "MAFIA::JOIN":(player)=>{
        player.position = player.fraction.interiror;
        player.dimension = player.fraction.dimension;
        player.mongoUser.fraction.hasJoinInterior = true;
        if(!player.mongoUser.$__.saving) player.mongoUser.save().catch(err => console.error(err));
    },
    "MAFIA::EXIT":(player)=>{
        player.position = player.fraction.spawn;
        player.dimension = 0;
        player.mongoUser.fraction.hasJoinInterior = false;
        if(!player.mongoUser.$__.saving) player.mongoUser.save().catch(err => console.error(err));
    },
})