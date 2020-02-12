let show = false;

let browserDonate = mp.browsers.new('package://HTML/donate/index.html'); 
mp.keys.bind(0x73, false, function() { // F4
	if(chatActive || !loggined || (mp.gui.cursor.visible && !show)) return;
	show = !show;
	guitoggle(show);
	browserDonate.execute(`donate.show = ${show};`);
});

// Обновляет данные окна доната
mp.events.add('REFERRALS::REFRESH_DATA', data => {
	browserDonate.execute(`donate.referralData = ${data};`);
})

// Обрабатывает различные ошибки
mp.events.add('REFERRALS::ON_ERROR', message => {
	browserDonate.execute(`donate.onRefsError(${JSON.stringify(message)});`);
})
