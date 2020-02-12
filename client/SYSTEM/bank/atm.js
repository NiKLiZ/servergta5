const atms = [506770882,-1364697528,3424098598,3168729781,2930269768,506770882,-870868698,-1126237515]
let show = false;
let lastLoking = new Date().getTime();
let {browserBank} = require('./bank');
mp.events.add("render", () => {
	try{

		if(!loggined || player.vehicle || player.getVariable('COLLECTOR_VEH')) return;
		let date = new Date().getTime();
		if(date-lastLoking < 350)return;
		let atm = getLookingAtEntity(16)
		if(atm){
			let model = mp.game.invoke("9F47B058362C84B5", atm.entity);
			if(atms.indexOf(model) != -1 && mp.Vector3.Distance(atm.position,player.position) < 2){
				let pos = atm.position;
					mp.game.graphics.drawText('E', [pos.x, pos.y,pos.z], { 
					  font: 0, 
					  color: [255, 255, 255, 255], 
					  scale: [0.65, 0.65], 
					  outline: true
				});
			}
		}
	}catch(e){}
})

mp.keys.bind(0x45,true,function(){
	if(collectorVeh) return;
	let atm = getLookingAtEntity(16)
	if(atm ){
		let model = mp.game.invoke("9F47B058362C84B5", atm.entity);
		if(atms.indexOf(model) != -1 && mp.Vector3.Distance(atm.position,player.position) < 2){
			mp.events.callRemote('BANK::ATM_MENU')
		}
	}
});
mp.events.add({
	"BANK::ATM_MENU":(accounts)=>{
			if(accounts){
				show = !show;
				browserBank.execute(`
						bank.show = true;
						bank.menu = 'ATM';
						bank.accounts = ${accounts};
						bank.account = 0;
						bank.hideOverlay();
					`)
				guitoggle(true);
			}else{
				browserBank.execute(`
					bank.show = true;
					bank.menu = 'no_card';
				`)
				guitoggle(true);
			}

	}
})

const atmsPositions = [
	new mp.Vector3( 155.430, 6641.991, 31.784),
	new mp.Vector3( 174.672, 6637.218, 31.784),
	new mp.Vector3( 1703.13, 6426.783, 32.730),
	new mp.Vector3( 1735.11, 6411.035, 35.164),
	new mp.Vector3( 1702.84, 4933.593, 42.051),
	new mp.Vector3( 1967.33, 3744.293, 32.272),
	new mp.Vector3( 2564.39, 2585.100, 38.016),
	new mp.Vector3( 2558.68, 349.6010, 108.050),
	new mp.Vector3( 2558.05, 389.4817, 108.660),
	new mp.Vector3( 1077.69, -775.796, 58.218),
	new mp.Vector3( 1139.01, -469.886, 66.789),
	new mp.Vector3( 1168.97, -457.241, 66.641),
	new mp.Vector3( 1153.88, -326.540, 69.245),
	new mp.Vector3( 236.463, 217.4718, 106.840),
	new mp.Vector3( 265.004, 212.1717, 106.780),
	new mp.Vector3( -164.56, 233.5066, 94.919),
	new mp.Vector3( -1827.0, 785.5159, 138.020),
	new mp.Vector3( -1409.3, -99.2603, 52.473),
	new mp.Vector3( -2072.4, -316.959, 13.345),
	new mp.Vector3( -2975.7, 379.7737, 14.992),
	new mp.Vector3( -3144.1, 1127.415, 20.868),
	new mp.Vector3( -1305.4, -706.240, 25.352),
	new mp.Vector3( -717.61, -915.880, 19.268),
	new mp.Vector3( -526.56, -1222.90, 18.434),
	new mp.Vector3( -846.30, -340.402, 38.687),
	new mp.Vector3( -56.193, -1752.53, 29.452),
	new mp.Vector3( -273.00, -2025.60, 30.197),
	new mp.Vector3( -1570.19, -546.651, 34.955),
	new mp.Vector3( 33.23, -1347.849, 29.497),
	new mp.Vector3( 129.21, -1292.347, 29.269),
	new mp.Vector3( 289.01, -1256.545, 29.440),
	new mp.Vector3( 1686.75, 4815.809, 42.008),
	new mp.Vector3( -302.40, -829.945, 32.417),
	new mp.Vector3( 5.13, -919.949, 29.557),
	new mp.Vector3( -284.03, 6224.385, 31.187),
	new mp.Vector3( -135.16, 6365.738, 31.101),
	new mp.Vector3( -94.969, 6455.301, 31.784),
	new mp.Vector3( 1821.91, 3683.483, 34.244),
	new mp.Vector3( 540.042, 2671.007, 42.177),
	new mp.Vector3( 381.282, 323.2518, 103.270),
	new mp.Vector3( 285.202, 143.5690, 104.970),
	new mp.Vector3( 157.769, 233.5450, 106.450),
	new mp.Vector3( -1205.3, -325.579, 37.870),
	new mp.Vector3( -2955.7, 488.7218, 15.486),
	new mp.Vector3( -3044.2, 595.2429, 7.595),
	new mp.Vector3( -3241.1, 996.6881, 12.500),
	new mp.Vector3( -3241.1, 1009.152, 12.877),
	new mp.Vector3( -538.22, -854.423, 29.234),
	new mp.Vector3( -711.15, -818.958, 23.768),
	new mp.Vector3( -256.83, -719.646, 33.444),
	new mp.Vector3( -203.54, -861.588, 30.205),
	new mp.Vector3( 112.410, -776.162, 31.427),
	new mp.Vector3( 112.929, -818.710, 31.386),
	new mp.Vector3( 119.900, -883.826, 31.191),
	new mp.Vector3( -261.69, -2012.64, 30.121),
	new mp.Vector3( -254.11, -692.483, 33.616),
	new mp.Vector3( -1415.90, -211.825, 46.500),
	new mp.Vector3( -1430.12, -211.014, 46.500),
	new mp.Vector3( 287.64, -1282.646, 29.659),
	new mp.Vector3( 295.83, -895.640, 29.217),
	new mp.Vector3( -1315.7, -834.89, 16.96),
	new mp.Vector3( 89.7, 2.35, 68.31),
	new mp.Vector3( -2957.852783203, 488.10736083984, 14.463928222656),
	new mp.Vector3( 146.4098358154, -1035.1512451172, 28.344469070435),
	new mp.Vector3( -1305.255249023, -706.42889404297, 24.322429656982),
	new mp.Vector3( 527.2432861328, -160.16487121582, 56.101497650146),
	new mp.Vector3( -387.0555725097, 6046.373046875, 30.500118255615),
	new mp.Vector3( 1171.999755859, 2702.5283203125, 37.175086975098),]
exports.atmsPositions = atmsPositions;