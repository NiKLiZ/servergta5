global.chatActive = false;
let friends = [];
mp.events.add({
	'chatplayer':(id,text,color)=>{
		let pl = mp.players.atRemoteId(id);
		color = JSON.parse(color);
		if(pl.chat) clearTimeout(pl.chat.interval);
		let names = text.match(/%playerName\[(.+?)\]?%/gi);
		if(names !== null){
			for (let i = 0; i < names.length; i++) {
				const name = names[i];
				let replaceName = name.match(/%playerName\[(.+?)\]?%/)[1];
				let nameText = !hasFriend(pl) ?  'Гражданин' : replaceName;
				text = text.replace(name,nameText)
			}
		}
		pl.chat = {
			text: text,
			color: color,
			interval: setTimeout(()=>{
				pl.chat = null;
			},4000)
		}
	},
	'changeState': (state) => {
		if(state == true)closemenuv();
		chatActive = state;
	},
	'CHAT::CLEAR': ()=>{
		browser.execute('chatAPI.clear()')
	},
	"CHAT::ADD_TEXT_PLAYER":(nameTag,id,text)=>{
		browser.execute(`chatAPI.push("${text}","player","${nameTag}",${id})`)
	},
	"CHAT::ADD_FRIEND":(name)=>{
		browser.execute(`chatAPI.addFriend('${name}')`)
		friends.push(name);
	},
	"CHAT::UPDATE_FRIENDS":(_friends)=>{
		friends = JSON.parse(_friends);
		browser.execute(`chatAPI.friends = ${_friends}`)
		mp.events.call('CHAT::ADD_FRIEND',player.name)
	}
});
function getNickName(pl,hasUpperCase = false,addChar = ''){
	let name =  friends.indexOf(pl.name) != -1 || (player.permision && player.permision['CHAT::FRIENDS_ALL']) ? pl.name : `${hasUpperCase ? 'Г' : 'г'}ражданин${addChar}`;
    return `${name}[${pl.remoteId}]`
}
let hasFriend = (pl)=>{
	return hasFriendName(pl.name);
}
let hasFriendName = (name)=>{
	if(!player.permision)return false;
	return  friends.indexOf(name) != -1 || (player.permision && player.permision['CHAT::FRIENDS_ALL']); 
}
module.exports = {getNickName,hasFriend,hasFriendName}