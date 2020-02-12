/*
** Обновление сытости и жажды игроков
*/

const SATIETY_CONSUMPTION = 0.001;
const PASSIVE_CONSUMPTION = 0.035;

setInterval(() => updateSatiety(), 10000)

// Обновляет сытость и жажду
function updateSatiety() {
    mp.players.forEach(player => {
        try{
            if (!player.loggined) return;
            applyHealthDecrease(player);
            const dist = player.dist(player.mongoUser.pos);
            updateStats(player, dist);
        }catch(e){
            console.error(e)
        }
    })
}

// Применяет расход здоровья, если игрок голоден или хочет пить
function applyHealthDecrease(player) {
    let healthDecrease = 2;
    healthDecrease -= player.mongoUser.satiety > 0 ? 1 : 0;
    healthDecrease -= player.mongoUser.thirst > 0 ? 1 : 0;
    player.health -= healthDecrease;
}

// Обновляет значения сытости и жажды
function updateStats(player, dist) {
    applyConsumption(player, PASSIVE_CONSUMPTION);
    if (!player.vehicle && dist < 75) {
        const consumption = (dist / 0.5) * SATIETY_CONSUMPTION;
        applyConsumption(player, consumption);
    }
    player.call('INVENTORY::UPDATE_HUNGER', [parseInt(player.mongoUser.satiety),parseInt(player.mongoUser.thirst)])
}

// Применяет значение расхода сытости и жажды
function applyConsumption(player, value) {
    if(player.mongoUser.satiety > value)player.mongoUser.satiety -= value;
    if(player.mongoUser.thirst > value*2)player.mongoUser.thirst -= value * 2;
}