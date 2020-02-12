let {sendWindowData, giveReward} = require('./referrals');

/*
** Логика обновления данных для окна донатов
*/

const REWARD_HOURS = 40;
const REFRESH_DELAY = 3600000 // 60 min.

setInterval(refreshDonateData, REFRESH_DELAY);

// Обновляет данные окна доната каждого игрока
function refreshDonateData() {
    mp.players.forEach((player) => {
        try{   
            if (!(player.loggined && player.populated)) return;
            player.mongoUser.referrals.forEach(r => {
                if (isOnline(r._id))
                    r.time_game += REFRESH_DELAY;
            });
            if (isRewardTime(player)) {
                giveReward(player);
                player.alert('Получена награда реф. системы');
            }
            sendWindowData(player);
        }catch(e){
            console.error(e)
        }
    });
}

// Проверяет, находится ли игрок онлайн
function isOnline(id) {
    return mp.players.atMongoId(id) !== undefined;
}

// Проверяет, наиграл ли игрок положенное время
function isRewardTime(player) {
    var hoursPlayed = Math.floor((player.mongoUser.time_game / (1000 * 60 * 60)) % 24)
    return hoursPlayed === REWARD_HOURS;
}