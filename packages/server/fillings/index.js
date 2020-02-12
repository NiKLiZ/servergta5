let fillings = mp.configs.fillings;
let filling = [];
const educationTasksList = require('../fillings/index');
let pricePetrol = 5;
for(let i = 0;i<fillings.length;i++){
	let pos = new mp.Vector3(fillings[i].pos.x,fillings[i].pos.y,fillings[i].pos.z);
	let labels = [];
	let colshapes = [];
	for(let c = 0;c<fillings[i].pumps.length;c++){
		let pump = new mp.Vector3(fillings[i].pumps[c].x,fillings[i].pumps[c].y,fillings[i].pumps[c].z)
		let label = mp.labels.new('Заправка', pump,{
			los: false,
			drawDistance: 4,
		})
		labels.push(label)
		let colshape = mp.colshapes.newCircle(pump.x, pump.y, 4);
		colshape.setVariable('filling',true)
		colshapes.push(colshape)
	}
	let blip = mp.blips.new(361, pos,{
		shortRange: true,
		color: 17,
		name: 'Заправка'
	});
	filling.push({
		blip: blip,
		labels: labels,
		colshapes: colshapes
	})
}
mp.calbackmenuv('Fills_petrol',(player,array)=>{
	let fuel_change = parseFloat(array[0]);
	let money = parseInt(fuel_change*pricePetrol);
	let veh = player.vehicle;
	if(!veh) return;
	if(!fuel_change || fuel_change < 0) return player.alert('Неверное значение')
	let fuel = veh.getVariable('petrol')+fuel_change;
	if(veh.getVariable('MAX_PETROL') < fuel) return player.alert('Максимум литров в баке '+veh.getVariable('MAX_PETROL'),1)
	
	if(veh.getVariable('gosFraction') || player.editMoney(-money, 'Заправка '+fuel_change+'л.')){
		veh.setVariable('petrol',fuel)
		player.alert('Вы зправили на '+fuel_change+'л.')
		if(veh.getVariable('gosFraction'))player.alert('Вы заправили машину за счет гос. организации');
	}

	if (educationTasksList.getTask('fillCar')) educationTasksList.setTask('fillCar');
})
mp.calbackmenuv('Buy_can',(player,array)=>{
	if(!player.inventory.isEmptySlot(7))return player.alert('Нет свободного места в инвентаре');
	let fuel_change = parseFloat(array[0]);
	let price = fuel_change*pricePetrol+5;
	if(!fuel_change || fuel_change < 0) return player.alert('Неверное значение')
	if(fuel_change > 20) return player.alert('Максимум в канистре 20л.');
	if(player.editMoney(-price, 'Канистра '+fuel_change+'л.')){
		let info = {
		    ammo: fuel_change*5
		  };
		player.inventory.addItem(7,null,info);
		player.alert(`Вы купили канистру на ${fuel_change}л. за ${price}`)
	}
})