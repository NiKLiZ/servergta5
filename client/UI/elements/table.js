module.exports = (browserElements)=>{
	let callback;
	global.Create_table = (title,colums,data,call) =>{
		browserElements.execute(`Create_table('${title}',${JSON.stringify(colums)},${JSON.stringify(data)})`);
		callback = call;
	}
	mp.events.add("Table::calback",(...data)=>{
		if(callback) callback(...data);
		callback = null;
	})
}