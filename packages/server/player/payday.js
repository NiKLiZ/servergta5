function changeExp(player) {
	let addExp = 2;
	player.exp++;

	if (player.lvl >= 10) addExp = 3;

	if (player.exp === ((player.lvl + 1)) * addExp) {
		player.lvl++;
		player.exp = 0;
		player.outputChatBox(`Ваш уровень на сервере ${p.lvl}`);
	}
	player.outputChatBox(`Ваши exp на сервере ${player.exp}`);
}

// Обрабатывает пэйдэй каждого игрока онлайн
function processPayday(player) {
    try{
        const reward = getReward(player);
        if (!(player.loggined && isPayTime(player.mongoUser.time_game))) return;

        changeExp(player);
        if (!player.fraction || !reward) return;
        player.editMoney(reward, 'Зарплат за работу во фракции '+player.fraction.name );
        player.alert(`Зарплата фракции: ${reward}$`)    
    }catch(e){
        console.error(e)
    }
}

// Проверяет сыгранное игроком время
function isPayTime(msPlayed) {    
    let data = new Date(msPlayed);
    return data.getHours() > 0 && 
    data.getMinutes() === 0;
}

// Возвращает
function getReward(player) {
    if(!player.fraction || !player.fraction.rank[player.mongoUser.fraction.rank] ||  !player.fraction.rank[player.mongoUser.fraction.rank].salary)return undefined;
    return player.fraction.rank[player.mongoUser.fraction.rank].salary
}
module.exports.processPayday = processPayday;