let callback;
global.Input_call = (title,placeholder,placeholder_input = 'Цифра',call,type_input = 'number', success = 'Подтвердить',close = 'Отмена')=>{
	 browser.execute(`Create_Input_call('${title}','${placeholder}','${placeholder_input}','${type_input}','${success}','${close}')`);
	 callback = call;
}
mp.events.add("INPUT_CALL::calback",(data)=>{
	if(callback) callback(data);
	callback = null;
})