let vehicles = require('./config.js').vehicles;
let colors = require('./config.js').colors;
let genNumberPlate = require('../a/functions/vehicle/getvariabels').generationPlate;
mp.events.push("showroomcars", (player) => {
	player.call('showroomcars')
});

let {getBusiness} = require('../busines/class')

mp.events.add('CARSHOWROOM::BUY',(player,businesId,vehicleId,color)=>{
	if(!player.hasAddVehicle())return player.alert('У вас не хватает места для автомобиля',1);
	if(!player.inventory.isEmptySlot(6))return player.alert('Нет свободного места в инвентаре');
	let busines = getBusiness(businesId);
	let confVeh = busines.getStockVeh(vehicleId);
	if(!confVeh)return player.alert('Этой машины нет в продаже')
	if(!player.editMoney(-confVeh.price,'Автомобиль '+confVeh.model))return 
	busines.editStoke(confVeh.model,-1);
	if(busines.model.owner)busines.editBalance(confVeh.price,`${player.name} купил ${confVeh.model}`)
	let numberPlate = genNumberPlate();
	let veh = mp.vehicles.add(player,mp.joaat(confVeh.model), busines.coordsVehicle.pos,{
		heading: 72,
		numberPlate: numberPlate,
		color: [color,0],
		price: confVeh.price,
		heading: busines.coordsVehicle.heading
	});
	veh.setColor(color,0)
	veh.numberPlate = numberPlate;
	player.call('clearroomcars',[false]);
	player.vehicles.push(veh)
	player.updateVehiclesMenu();
	let info = {
		vehid: veh._id,
		model: confVeh.model,
		numberPlate
	}
	player.alert('Вы купили автомобиль '+confVeh.model,2)
	player.inventory.addItem(6,null,info,true);
	setTimeout(()=>{
		player.putIntoVehicle(veh, -1);
		
	},200)
});