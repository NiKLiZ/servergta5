let parking = require('../parking/class.js');

let park = new parking(mp.configs.pizzeria.vehs,{
		pizzaria: true,
})
let GET_HOME = (player,array)=>{
	if(!player.pizza) return player.alert('Вы не работает в пиццерии')
	let homes = mp.homes.filter((item)=>{
		try{
			if(item.pos.dist(player.position) < 4000)return true;
		}catch(e){
			console.error(e)
		}
	});
	if(!homes.length)homes = mp.homes;
	let home = homes[Math.floor(Math.random()*homes.length)];
	player.call("PIZZA::CREATE_BLIP",[JSON.stringify(home.pos)])
	player.homePizza = home;
	player.alert('Отвезите пиццу');
	player.damagePizza = false;
	player.prizePizza = parseInt(player.dist(home.pos)/30);
}

mp.calbackmenuv('PIZZA::GET_HOME',GET_HOME)
mp.calbackmenuv('PIZZA::START',(player,array)=>{
	if(!player.isWorkUp()) return;
	if(player.pizza == true) return player.alert('Вы уже начали работу развозчика пиццы')
	let veh = park.targetVeh(player);
	if(veh){
		player.alert('Сядьте на скутер');
		player.pizza = true;
		player.countPizza = 0;
		player.call('PIZZA::START')
		GET_HOME(player);
	}	
	else player.alert('Все скутеры заняты')
})
mp.calbackmenuv('PIZZA::STOP',(player,array)=>{
	player.damagePizza = null;
	player.prizePizza = null;
	player.pizza = false;
	player.alert('Вы закончили рабочий день')
	player.homePizza = null;
	player.clearParking(true);
	player.call('PIZZA::STOP', [player.countPizza])
	player.countPizza = null;
})
mp.calbackmenuv('PIZZA::DELIVERED',(player,array)=>{
	let tip = player.damagePizza === false ? mp.getRandomInRange(0,15) : 0;
	player.alert(`Вы получили ${player.prizePizza}. ${tip === 0 ? '' : 'Чаевые '+tip} `)
	player.editmoneyCash(player.prizePizza+tip,'Работа в пиццерии');
	player.alert('Возьмите в пиццерии заказ')
	player.call("PIZZA::DESTROY_BLIP");
	player.homePizza = null;
	player.damagePizza = null;
	player.prizePizza = null;
	player.countPizza++;
})