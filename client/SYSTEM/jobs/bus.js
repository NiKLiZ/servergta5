let jobMarker = {
	type: 1,
	color:  [0,255,0,60],
	position: new mp.Vector3(435.5993957519531,-644.4629516601562,27.7366943359375),
	scale: 1.5
}

exports.position = jobMarker.position;

mp.blips.new(513, jobMarker.position,{
	name: 'Автобусный автопарк (Работа)',
	color: 29,
	dimension: 0,
	alpha: 255,
	shortRange: true,
})

let isStarted = false;
let routeType = 0;
let busSpawnPos;

let point = {
	type: 1,
	color: [40, 255, 0, 60],
	scale: 4
}
let pointIndex = 0;

let blip = null;
let busTimeout = null;
let parentCheck = null;

let busRoutes = [
    [
		[306.81201171875,-770.1473999023438,28.280410766601562,true],
		[-107.507568359375,-1688.0025634765625,28.248260498046875,true],
		[-1039.9052734375,-2716.7138671875,12.766273498535156,true],
		[50.888736724853516,-1534.1993408203125,28.2517147064209,true],
		[409.3113708496094,-713.6690673828125,28.221939086914062,true],
		[2087.653076171875,4997.609375,40.008636474609375,true],
		[1941.9544677734375,2540.064697265625,53.573394775390625,true],
		[425.9050598144531,-652.1426391601562,27.500347137451172,true]
	],
	[
		[306.81201171875,-770.1473999023438,28.280410766601562,true],
		[-107.507568359375,-1688.0025634765625,28.248260498046875,true],
		[-1039.9052734375,-2716.7138671875,12.766273498535156,true],
		[-249.0885009765625,-882.8264770507812,29.580425262451172,true],
		[273.7117919921875,178.0317840576172,103.60993194580078,true],
		[82.90989685058594,252.78643798828125,107.79713439941406,true],
		[-523.844482421875,-271.0574035644531,34.260154724121094,true],
		[-476.0216979980469,-387.5730895996094,32.978965759277344,true],
		[425.9050598144531,-652.1426391601562,27.500347137451172,true]
	],
	[
		[308.1558837890625,-766.5863647460938,28.288015365600586,true],
		[1201.238037109375,-689.2779541015625,59.474525451660156,true],
		[986.263671875,-166.7088165283203,71.53777313232422,true],
		[326.0102844238281,163.47610473632812,102.43009948730469,true],
		[90.11627197265625,250.1914520263672,107.49720001220703,true],
		[-525.0914306640625,-268.6077575683594,34.28199005126953,true],
		[-681.9466552734375,-1261.8046875,9.559316635131836,true],
		[425.54248046875,-646.6107788085938,27.50025177001953,true]
	],
];

createMarker(jobMarker,(m)=>{
	let menu = {
		name: 'Автобус',
		exit_mar: m,
		items: []
	}
	if (isStarted) 
		menu.items.push({
			type: 1,
			name: 'Закончить работу',
			callback_remote: 'BUS::END_JOB',
			placeholder: 'Закончить работу',
		})
	else 
		menu.items.push({
			type: 1,
			name: 'Маршрут №1',
			callback: 'BUS::START',
			placeholder: 'Зарплата за поездку 150',
			callpointenct: 0
		},
		{
			type: 1,
			name: 'Маршрут №2',
			callback: 'BUS::START',
			placeholder: 'Зарплата за поездку 150',
			callpointenct: 1
		})
	createmenuv(menu);
});

mp.events.add({
	"BUS::RELOAD": onContinueWork,
	"BUS::START": onStartWork,
	"BUS::CLOSE": onBusClose,
})

let next = () => {
	const route = busRoutes[routeType];
	const isFirstPoint = route[pointIndex][3] !== true

	point.type = isFirstPoint ? 0 : 4;
	if (isFirstPoint) point.direction = route[pointIndex + 1];

	let targetPos = new mp.Vector3(...route[pointIndex]);
	point.position = targetPos;

	showNextBlip(isFirstPoint, targetPos)

	parentCheck = createRouteMarker(point, shape => {
		if (player.vehicle != player.parking) return;
		if (pointIndex !== route.length - 1) {
			if (isFirstPoint) {
				removeTargetPoint(shape);
				showNextPoint();			
			} 
			else
				arriveToPoint(shape);
		} 
		else {
			removeBlip();
			setTimeout(() => removeTargetPoint(shape), 1000);
			mp.events.callRemote('BUS::FINISH')
		}
	}, _ => {
		if (busTimeout) {
			clearTimeout(busTimeout);
			busTimeout = null;
			alert('Вы не подождали нужного времени');
		}
	});
}

// Показывает блип сл. остановки
function showNextBlip(isFirstPoint, position) {
	removeBlip();
	blip = mp.blips.new(isFirstPoint ? 1 : 162, position, {
		name: 'Точка',
		color:  [40,255,0,60],
		shortRange: false,
		dimension: 0
	});
	blip.setRoute(true);
}

// Обработчик прибытия на остановку
function arriveToPoint(shape) {
	alert('Подождите 10 секунд');
	busTimeout = setTimeout(() => {
		busTimeout = null;
		removeTargetPoint(shape);
		alert('Можете ехать дальше');
		showNextPoint();
	}, 10000);
}

// Показывает сл. точку маршрута
function showNextPoint() {
	pointIndex++;
	next();
}

callback('BUS::END_JOB',()=>{
 	alert('Поставте автобус туда где он ранее стоял')
	let check = {
		type: 4,
		color: [40, 255, 0, 60],
		scale: 4,
		position: busSpawnPos,
		vehicle_stop: true
	}
	mp.game.ui.setNewWaypoint(busSpawnPos.x,busSpawnPos.y)
	CARRIER_check = createCheckpoint(check,(checkx)=>{
		checkx.del();
		mp.events.callRemote('BUS::END_JOB');
	})
})

// Обработчик начала работы
function onStartWork(route) {
	isStarted = true;
	seatparking(()=> {
		if (!isStarted) return;
		alert('Доедьте до точки');
		routeType = route;
		busSpawnPos = player.position;
		pointIndex = 0;
		next();
	})
	parkingexit(()=> {
		alert('Вы не успели сесть в автобус');
		mp.events.call('BUS::END_JOB')
		removeBlip();
		if (parentCheck) parentCheck.del();
	})
}

// Обработчик продолжения работы водителем автобуса
function onContinueWork(route) {
	if (!isStarted) return;
	routeType = route;
	pointIndex = 0;
	next();
}

function onBusClose() {
	isStarted = false;
	removeBlip();
	if (mp.checkpoints.exists(parentCheck))
		parentCheck.del();
}

function removeTargetPoint(shape) {
	shape.marker.destroy();
	shape.destroy();
}

function removeBlip() {
	if (blip) {
		blip.destroy();
		blip = null;
	}
}