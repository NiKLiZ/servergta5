const parking = require('../parking/class.js');

// Данные автобусов каждого из маршрутов
const firstRouteVehs = mp.configs.bus.route_one;
const secondRouteVehs = mp.configs.bus.route_two;
const thirdRouteVehs = mp.configs.bus.route_three;

// Созданные автобусы
const buses = [
	new parking(firstRouteVehs, {
		bus: true,
		lock: false,
		bus_price: 2
	}),
	new parking(secondRouteVehs, {
		bus: true,
		lock: false,
		bus_price: 2
	}),
	// new parking(thirdRouteVehs, {
	// 	bus: true,
	// 	lock: false,
	// 	bus_price: 2
	// })
];

// Меню выбора в конце маршрута
const routeEndMenu = {
	name: 'Автобус',
	exitmenu_callback: 'BUS::END_JOB',
	items: [
		{
			type: 1,
			name: 'Продолжить путь',
			callback: 'BUS::RELOAD',
			placeholder: 'Нажмите [Еnter] для продолжения работы'
		},
		{
			type: 1,
			name: 'Закончить работу',
			callback: 'BUS::END_JOB',
			placeholder: 'Закончить работу'
		}
	]
}

const routeRewards = [150, 150, 150]

mp.events.add({
	'BUS::PARKING_EXIT': onBusExit,
	'BUS::END_JOB': onEndJob
})

mp.events.push({
	"BUS::STOP": onBusStop,
	"BUS::FINISH": onRouteFinish
})

// Обработчики выбора игрока в меню
mp.calbackmenuv('BUS::START', onStartJob)
mp.calbackmenuv('BUS::RELOAD', onContinueWork)

// Выход игрока из автобуса
function onBusExit(player) {
	mp.events.call('BUS::STOP', player);
	player.clearParking();
}

// Завершение работы
function onEndJob(player) {
	mp.events.call('BUS::STOP', player);
	player.clearParking(true);
}

function onBusStop(player) {
	player.bus = false;
	player.bus_route = player.bus_cassa = null;
	player.call('BUS::CLOSE')
}

// Обработчик завершения маршрута
function onRouteFinish(player) {
	if (!player.bus) return player.alert('Вы не работаете водителем автобуса');
	giveRouteReward(player);
	player.createmenuv(routeEndMenu);
}

// Выдает награду за завершение маршрута
function giveRouteReward(player) {
	let money = routeRewards[player.bus_route];
	player.alert(`Вы заработали ${money + player.bus_cassa}`)
	player.editmoneyCash(money, 'Автобусник');
}

// Обработчик начала работы
function onStartJob(player, args) {
	if (!(player.isWorkUp() && player.testRightDrive())) return;
	if (player.bus) {
		return player.alert('Вы уже работаете водителем автобуса');
	}
	let route = parseInt(args[0]);
	let freeBus = buses[route].targetVeh(player);
	if (freeBus) {
		setupForWork(player, route);
		player.setNewWaypoint(freeBus.position)
		player.alert('Сядьте в автобус');		
		player.call('BUS::START', [route])
	}
	else
		player.alert('Все машины заняты')
}

// Устанавливает данные игрока для работы
function setupForWork(player, route) {
	player.bus = true;
	player.bus_route = route;
	player.bus_cassa = 0;
}

// Обработчик продолжения маршрута
function onContinueWork(player) {
	player.call('BUS::RELOAD', [player.bus_route])
	player.alert('Вы продолжили работу')
}