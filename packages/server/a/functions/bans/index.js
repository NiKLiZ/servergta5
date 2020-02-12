const ban = require("../../..//mongodb/ban.js").ban;
const moment = require('moment');
mp.bans = {
    banTypes: {
        Name: 0,
        SocialClub: 1,
        IP: 2,
        HWID: 3,
        ALL: 4
    },
    getUnixTimestamp: () => {
        return Math.round(Date.now() / 1000);
    },

    formatUnixTimestamp: (unixTimestamp) => {
        return moment(unixTimestamp*1000).format('DD/MM/YYYY HH:mm:ss');
    },
    add: (name,banType, value,  reason, endUnixTimestamp) => {
        let info = new ban({
            name: name,
            Type: banType,
            value: value,
            Reason: reason,
            LiftTimestamp: endUnixTimestamp
        });
        return new Promise((resolve, reject) => {
            info.save((err,done)=>{
                if(err) {
                    console.error(`[BanAPI Add Error] ${err}`);
                    reject(err);
                }
                else{
                    resolve(info.id);
                }
            });
        })
    },
    banPlayer: (playerID, banType, reason, endUnixTimestamp,callback) => {
        return new Promise((resolve, reject) => {
            let player = mp.players.at(playerID);
            if (player) {
                let valueToBan;
                switch (Number(banType)) {
                    case 0:
                        valueToBan = player.name;
                    break;

                    case 1:
                        valueToBan = player.socialClub;
                    break;

                    case 2:
                        valueToBan = player.ip;
                    break;

                    case 3:
                        valueToBan = player.serial;
                    break;
                }
                if(banType == 4){
                    mp.bans.add(player.name,1, player.socialClub,reason, endUnixTimestamp);
                    mp.bans.add(player.name,2, player.ip,reason, endUnixTimestamp);
                    mp.bans.add(player.name,3,player.serial,reason, endUnixTimestamp).then((info) => {
                        if (endUnixTimestamp == -1) {
                            player.alert(`Вы были забанены. \nПричина: ${reason}`,1);
                        } else {
                            player.alert(`Вы были забанены. \nПричина: ${reason}\nКонец бана: ${mp.bans.formatUnixTimestamp(endUnixTimestamp)}`,1);
                        }
                        player.kick("Banned from server.");
                        resolve(info);
                    })
                }
                else{
                    mp.bans.add(banType,valueToBan, reason, endUnixTimestamp).then((info) => {
                        if (endUnixTimestamp == -1) {
                            player.alert(`Вы были забанены. \nПричина: ${reason}`,1);
                        } else {
                            player.alert(`Вы были забанены. \nПричина: ${reason}\nКонец бана: ${mp.bans.formatUnixTimestamp(endUnixTimestamp)}`,1);
                        }
                        player.kick("Banned from server.");
                        resolve(info);
                    })
                }
            } else {
                reject("Игрок не найден");
            }
        })
    },
    remove: (banName) => {
        return new Promise((resolve, reject) => {
            ban.remove({name:banName},(err,done)=>{
                if(err){
                    console.error(`BAN API ERR `,err)
                    reject(err);
                }
                resolve(done)
            })
        })
    },
    getInfo: (banName) => {
        return new Promise((resolve, reject) => {
            ban.findOne({name:banName},(err,done)=>{
                if(err){
                    console.error(`BAN API ERR `,err)
                    reject(err);
                }
                if(done)resolve(done)
                else reject(new Error('Игрок не найден'))
            })
        })
    }
}