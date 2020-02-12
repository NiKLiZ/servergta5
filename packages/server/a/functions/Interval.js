const readline = require('readline');
const moment = require('moment');
const randomCloundInterval = require('./../../weather/index').randomCloundInterval;
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});
let {processPayday} = require('../../player/payday');

let saveAll = ()=>{
	try{
		mp.players.forEach((player)=>{
			try{
				if(!player.loggined)return;
				player.savepos();
				if(!player.mongoUser.$__.saving)player.mongoUser.save().catch((e)=>{
					player.alert('Произошла ошибка')
					console.error(e);
				})
			}catch(e){
				console.error(e)
			}

		})
		mp.vehicles.forEach((veh)=>{
			if(veh._id){
				veh.savepos();
			}
		})
	}catch(e){
		console.error(e)
	}
}

rl.on('line', (input) => {
	if(input == 'restart_notification'){
		saveAll();
		let massage = `[SERVER] Сервер перезагрузится через 1 минуту. Не волнуйтесь, все сохранилось`;
		mp.players.forEach((pl)=>{
			try{
				pl.outputChatBox(massage)
				if(pl.inventory){
					pl.inventory.saveAllItems();
				}
			}catch(e){
				console.error(e)
			}
		})
	}
});

// Переменная, куда будет сохраняться setTimeout, чтобы мы могли его очистить по завершению
let timer = 0;

// ﻿Непосредственный callback, который будет выполняться в 00 секунд каждой минуты
const changeTime = (currentDate, isFirstRunning) => {
	// Меняем часы и минуты на сервере
	
	// mp.world.time.hour = currentDate.getHours();
	// mp.world.time.minute = currentDate.getMinutes();

	if (!isFirstRunning) {
		mp.players.forEach((player)=>{
			try{
				if(!player._id) return;
				player.updatetimeGame();
				player.testJail();
				player.testMute();
				processPayday(player);
				
			}catch(e){
				console.error(e)
			}
		})
	}
	if(currentDate.getHours() === 0 && currentDate.getMinutes() == 0){
		for(fraction in mp.fractions){
			if(mp.fractions[fraction].hasGang){
				mp.fractions[fraction].model.data.money += 200 * mp.fractions[fraction].model.zones.length;
				if(!mp.fractions[fraction].model.$__.saving)mp.fractions[fraction].model.save().catch((err)=>{console.error(err)});
			}
		}
	}
};

// Каждые 15 минут
setInterval(()=>{
	saveAll();
},15*60*1000)

// Функция запуска таймера, которая будет отрабатывать в каждые 00 секунд каждой минуты
const runTimer = (isFirstRunning) => {
  // Получаем текущее время
  // (при каком-то рассинхроне времени в ноде, например, при мелком подвисании сервера, мы синхронизируем время в следующую минуту)
  const currentDate = new Date();
  // Высчитываем оставшееся количество миллисекунд до следующей минуты
  const remainingMilliseconds = (60 - currentDate.getSeconds()) * 1000 + (1000 - currentDate.getMilliseconds());

  // Вызываем callback, который должен выполняться у нас в 00 секунд каждой минуты
  // (первый запуск будет не в 00 секунд, поэтому мы передаём переменную `isFirstRunning` в callback,
  // если нам требуется какая-то дополнительная логика на вызов именно в 00 секунд)
  changeTime(currentDate, !!isFirstRunning);

	
  clearTimeout(timer);
  timer = setTimeout(() => {
    runTimer();
  }, remainingMilliseconds);
};

// Запускаем таймер в первый раз
runTimer(true);

//каждый час
setInterval(function(){
	randomCloundInterval();
	mp.players.forEach((player)=>{
		try{
			if(!player._id) return;
			if(player.mongoUser.benefit){
				let hours = moment.duration(player.mongoUser.time_game).asHours()
				if(hours <= 9){
					let cards = mp.cards.atPlayer(player);
					if(!cards.length)return player.alert('У вас нет ни одной банковской карты')
					player.alert('Вам отправили пособие на карту '+cards[0].card_number);
					cards[0].editMoney(50,'Пособие');
				}
			}
		}catch(e){
			console.error(e)
		}
	})
},60*60*1000);