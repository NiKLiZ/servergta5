
let xmas = false;
let clounds = [
	{
		name: "EXTRASUNNY",
		prob: 1
	},
	{
		name: "CLEAR",
		prob: 1
	},
	{
		name: "RAIN",
		prob: 1
	},
	{
		name: "CLOUDS",
		prob: 1
	},
	{
		name: "SMOG",
		prob: 1
	},
	{
		name: "FOGGY",
		prob: 1
	},
	{
		name: "OVERCAST",
		prob: 1
	},
	{
		name: "THUNDER",
		prob: 1
	},
	{
		name: "CLEARING",
		prob: 1
	},
	{
		name: "CLEARING",
		prob: 1
	},
]


let prob = [1.6, 1.2, 5/7, 5/7, 5/7, 5/7, 5/7, 5/7, 5/7, 5/7];

function RandomP(p) {
    let sump = 0;
    for (let i = 0; i < p.length; i++) {
        sump += p[i];
    }
    let r = Math.random() * sump;
    let num = p.length;
    for (let i = 0; i < p.length; i++) {
        if (r > p[i]) {
            r -= p[i];
        } else {
            num = i;
            break;
        }
    }
    return num;
}

function randomClound() {
	let c =clounds[RandomP(prob)].name;
	mp.world.setWeatherTransition(c);
}
randomCloundInterval = ()=>{
	if(xmas)return;
	randomClound();
}
if(xmas){
	mp.world.setWeatherTransition("XMAS");
}else{
	randomClound();
}

mp.events.addCommand('setweather',(player,_,id)=>{
	if(!player.permision['COMMAND::SET_WEATHER']) return player.alert(`У вас нет прав`,1);
	if(!id || !id.length) return player.alert('Вы не написали id');
	if(isNaN(parseInt(id))) return player.alert('id введён неверно');
	let clound = clounds[parseInt(id)];
	if(!clound) return player.alert('Такой погоды нет')
	player.alert('Погода сменена на '+clound.name)
	mp.world.setWeatherTransition(clound.name);
})
module.exports.randomCloundInterval = randomCloundInterval;