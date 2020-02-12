let alert_parent = '';
let {hasFriendName} = require('./chat');
mp.events.add('alert', (msg = 'Ошибка',type = 0, layout = 10, time = 5000,p) => {
    if(alert_parent == msg) return;
    alert_parent = msg;
    let names = msg.match(/%playerName\[(.+?)\]?%/gi);
    if(names !== null){
        for (let i = 0; i < names.length; i++) {
            const name = names[i];
            let replaceName = name.match(/%playerName\[(.+?)\]?%/)[1];
            let nameText = !hasFriendName(replaceName) ?  'Гражданин' : replaceName;
            msg = msg.replace(name,nameText)
        }
    }
    browser.execute(`notify('${msg}',${type}, ${layout},${time},${p});`);
});
setInterval(()=>{
	alert_parent = '';
},1000)

mp.events.add("playerQuit", (player_last, exitType, reason) => {
    if (browser !== null) {
        if (player_last.name === player.name) {
            browser.destroy();
            browser = null;
        }
    }
});