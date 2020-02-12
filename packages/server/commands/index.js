require('./chat.js');


let secondsReport = 30;
let secondsAsk = 30;
function report(player, message)  {
    if (!message || !(message.trim().length > 0)) return player.alert(`Вы ничего не написали`,1);
    // если первый репор
    let time = Date.now()
    if(player.reportTime){
        if(player.reportTime+(secondsReport*1000) > time)return player.alert(`Можно писать в репорт каждые ${secondsReport} секунд`)
    }
    player.reportTime = time;
    let text = `<span style='color:#ecb306'>[Репорт] ${player.nameTag}: ${message}</span>`
    mp.players.forEach((pl)=>{
        try{
            if(pl.loggined && pl.permision.level > 1) pl.outputChatBox(text);
        }catch(e){
            console.error(e)
        }
    })
    player.alert('Вы отправили репорт');
    addMessageReport(player,`Вы: ${message}`,false);
};

function ask(player, message) {
    if (!message || !(message.trim().length > 0)) return player.alert(`Вы ничего не написали`,1);
   
    // если первый репор
    let time = Date.now()
    if(player.reportTime){
        if(player.reportTime+(secondsAsk*1000) > time)return player.alert(`Можно писать в ask каждые ${secondsAsk} секунд`)
    }
    player.reportTime = time;
    let text = `<span style='color:#ecb306'>[Вопрос] ${player.nameTag}: ${message}</span>`
    let hasHelpers = false;
    mp.players.forEach((pl)=>{
        try{
            if(pl.loggined && pl.permision.name == 'Helper'){
                pl.outputChatBox(text);
                hasHelpers = true;
            }
        }catch(e){
            console.error(e)
        }
    })
    if(!hasHelpers){
        mp.players.forEach((pl)=>{
            try{
                if(pl.loggined && pl.permision.level > 1) pl.outputChatBox(text);
            }catch(e){
                console.error(e)
            }
        })
    }
    addMessageReport(player,`Вы: ${message}`,false);
    player.alert('Вы отправили вопрос');
}

mp.events.addCommand({
    'report': (player,message)=>{
        report(player, message)
    },
    'ask': (player,message)=>{
        ask(player,message)
    },
    'q':(player)=>{
        player.kick();
    }
});

mp.events.push({
    "MENU::REPORT_SEND":(player,message)=>{
        report(player, message);
    },
    "MENU::ASK_SEND":(player,message)=>{
        ask(player,message);
    },
})

function addMessageReport(player,message,answered){
    let info = {
        text: message,
        answered: answered
    };
    player.mongoUser.reportsMessage.push(info);
    player.call('MENU::ADD_MESSAGE_REPORT',[JSON.stringify(info)]);
    if(!player.mongoUser.$__.saving)player.mongoUser.save().catch((e)=>{
        player.alert('Произошла ошибка')
        console.error(e);
    })
}

module.exports.addMessageReport = addMessageReport;
