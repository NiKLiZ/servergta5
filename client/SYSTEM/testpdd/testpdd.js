const educationTasksList = require('../../UI/education/index');
let complete = false;
let mar = {
	type: 27,
	color:  [200, 100, 0, 255],
	position: new mp.Vector3(-710.3994750976562,-1399.3253173828125,-46.676), 
	scale: 1.5
}
let error = 0;
let prover = false;
let checkproiden = 0;
let checks = [
	new mp.Vector3(-751.6740112304688,-1288.6793212890625,5.000382900238037),
	new mp.Vector3(-708.5042724609375,-1250.57421875,9.826883316040039),
	new mp.Vector3(-674.5262451171875,-1264.5103759765625,10.678184509277344),
	new mp.Vector3(-649.3740234375,-1292.41650390625,10.66957950592041),
	new mp.Vector3(-616.6433715820312,-1280.9501953125,10.7562255859375),
	new mp.Vector3(-560.5931396484375,-1209.580078125,17.597848892211914),
	new mp.Vector3(-532.5680541992188,-1107.522216796875,22.248546600341797),
	new mp.Vector3(-533.1875,-1048.6771240234375,22.675500869750977),
	new mp.Vector3(-534.1552734375,-984.2791137695312,23.280094146728516),
	new mp.Vector3(-516.1112670898438,-927.7530517578125,24.56847381591797),
	new mp.Vector3(-492.41302490234375,-863.8316040039062,30.145572662353516),
	new mp.Vector3(-474.1501159667969,-846.1954956054688,30.39978790283203),
	new mp.Vector3(-350.7286376953125,-856.7124633789062,31.58264923095703),
	new mp.Vector3(-278.41326904296875,-872.05126953125,31.65404510498047),
	new mp.Vector3(-213.3936004638672,-888.5016479492188,29.485774993896484),
	new mp.Vector3(-154.14639282226562,-910.711181640625,29.32669448852539),
	new mp.Vector3(-94.37255859375,-932.7035522460938,29.31175422668457),
	new mp.Vector3(-9.863832473754883,-963.3732299804688,29.333669662475586),
	new mp.Vector3(74.95829010009766,-994.0923461914062,29.407386779785156),
	new mp.Vector3(138.39373779296875,-1017.9771728515625,29.40335464477539),
	new mp.Vector3(193.2410888671875,-1041.5250244140625,29.244022369384766),
	new mp.Vector3(203.1134796142578,-1060.29443359375,29.195768356323242),
	new mp.Vector3(205.38966369628906,-1113.6553955078125,29.341310501098633),
	new mp.Vector3(206.1759033203125,-1148.2489013671875,29.35333824157715),
	new mp.Vector3(215.0763702392578,-1266.0400390625,29.3514347076416),
	new mp.Vector3(163.40127563476562,-1366.28515625,29.29395294189453),
	new mp.Vector3(118.24329376220703,-1366.524658203125,29.34149742126465),
	new mp.Vector3(61.52948760986328,-1363.8004150390625,29.345279693603516),
	new mp.Vector3(-69.58294677734375,-1364.3526611328125,29.40310287475586),
	new mp.Vector3(-144.25399780273438,-1380.9910888671875,29.667804718017578),
	new mp.Vector3(-211.17843627929688,-1414.470947265625,31.29966926574707),
	new mp.Vector3(-251.42686462402344,-1419.999267578125,31.23738670349121),
	new mp.Vector3(-354.7695617675781,-1420.7567138671875,29.377168655395508),
	new mp.Vector3(-437.7884521484375,-1412.2489013671875,29.239839553833008),
	new mp.Vector3(-486.4128723144531,-1399.5101318359375,29.419065475463867),
	new mp.Vector3(-490.40350341796875,-1274.2481689453125,26.090017318725586),
	new mp.Vector3(-481.0368347167969,-1236.311767578125,23.19059181213379),
	new mp.Vector3(-552.4630126953125,-1176.833740234375,18.843307495117188),
	new mp.Vector3(-612.4598999023438,-1255.356689453125,11.546187400817871),
	new mp.Vector3(-677.5023803710938,-1233.8892822265625,10.663501739501953),
	new mp.Vector3(-707.5326538085938,-1240.5220947265625,10.364459991455078),
	new mp.Vector3(-749.8126831054688,-1280.574462890625,5.331334114074707),
	new mp.Vector3(-751.06, -1303.4, 5),
]
let browserTestPDD = mp.browsers.new('package://HTML/testPDD/index.html'); 
createMarker(mar,()=>{
	if(prover) return;
	if(player.vehicle) return;
	guitoggle(true);
	browserTestPDD.execute('testpdd.show = true');
})
let markerj = {
	type: 1,
	color:  [0,255,0,60],
	position: new mp.Vector3(-712.756591796875,-1298.6959228515625,4.101922512054443),
	scale: 1.5,
	dimension: 0
} 
mp.blips.new(498, markerj.position,{
    name: 'Автошкола',
    color: 38,
    dimension: 0,
    shortRange: true,
    alpha: 255
})

let markere = {
	type: 1,
	color:  [0,255,0,60],
	position: new mp.Vector3(-712.158447265625,-1394.9405517578125,-46.676),
	scale: 1.5,
	dimension: 0
} 
global.togglemarker(markerj,markere,(is)=>{
	setClockEdit(is);
	if(!is)mp.game.time.setClockTime(12,12,12);
	mp.game.gameplay.setOverrideWeather('clear');
});	

mp.events.add({
	"testpddpassed":()=>{
		guitoggle(false);
		prover = true;
		checkproiden = 0;
		alert('Теория пройдена, сядьте в машину',2);
		mp.events.callRemote("TEST_PDD:START")
	},
	"testpddexit":()=>{
		guitoggle(false);
		prover = false;
	},
	"startTestPdd":()=>{
		let parking = player.parking
		seatparking(()=>{
			checks.push(parking.position)
			alert('Езжайте не превышая 60 км/ч')
			testpdd_practice();
		})
		parkingexit(()=>{
			alert('Практика провалена ',1)
			endrace();
			prover = false;
		})
	},
	"LSMYC::HIDE":()=>{
		browserTestPDD.execute(`testpdd.hide()`)
	},
	"TEST_PDD::START":()=>{
		browserTestPDD.execute(`testpdd.start()`)
	}
});

mp.events.add('pdd:complete', () => {
	if (educationTasksList.getTask('getRules')) {
		if (!complete) {
			complete = true;
			return educationTasksList.setFirstComplete();
		}
		educationTasksList.setTask('getRules');
	}
})
let testpdd_practice = ()=>{
	let parking = player.parking
	startrace(checks,parking,()=>{
		alert('Практика пройдена',2)
		alert('Вам выдали права в инвентарь',2)
		mp.events.callRemote("TEST_PDD:FINISH")
		prover = false;
		checks.pop(checks.length)

		if (educationTasksList.getTask('getRules')) {
			if (!complete) {
				complete = true;
				return educationTasksList.setFirstComplete();
			}
			educationTasksList.setTask('getRules');
		}
	})
	//когда игрок проезжает чекпоинт от гонки
	race_checked(()=>{
		if(player.vehicle.getSpeed()*3.6>60){
			if(error<3){
				error++;
				alert(`Езжайте не больше 60 км / час.Штрафных баллов ${error}/3`)
			}
			//если ошибок больше 3
			else{
				endrace();
				alert(`Придётся проходить всё заново`)
				mp.game.ui.setNewWaypoint(checks[0].x,checks[0].y)
				error = 0;
				testpdd_practice()
			}
		}
	})
}