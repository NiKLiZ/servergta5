import Vue from 'vue'
import App from './App.vue'

if(typeof(mp) == 'undefined'){
    window.mp = {};
    mp.trigger = (...d)=>{console.log(...d)}
}
let events = {};
mp.on = (call,calback)=>{
	events[call] = calback;
}
mp.call = (call,...args)=>{
	let event = events[call];
	if(event)event(...args);
}
new Vue({
    el: '#app',
    data: {
      cdn: process.env.NODE_ENV  == 'production' ? 'https://cdn.westrp.ru/westrp/HTML/' : 'http://localhost:7896'
    },
    render: h => h(App)
    
});
window.copy = (text)=>{
    let temp = $(`<textarea></textarea>`);
    $("body").append(temp);
    temp.html(text).select();
    document.execCommand("copy");
    temp.remove();
}
window.copyJSON = (text)=>{
    text = JSON.parse(text)
    window.copy(JSON.stringify(text,null,4)+',')
}
