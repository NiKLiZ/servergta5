mp.points = {}
mp.points.mar = [];

mp.points.add = (marker,callback)=>{
	mp.points.mar.push({
		id: mp.points.mar.length,
		marker: marker,
		callback: callback
	})
}
mp.points.client = ()=>{
	let ret = []
	for(let i=0;i<mp.points.mar.length;i++){
		let m =  mp.points.mar[i].marker;
		m.callremote = i;
		try{
			ret.push(m)
		}catch(e){
			console.error(e)
		}
	}
	return ret;
}
mp.events.push("POINT:EVENT",(player,id)=>{
	let point = mp.points.mar[id];
	if(point) point.callback(player,point.marker);
})