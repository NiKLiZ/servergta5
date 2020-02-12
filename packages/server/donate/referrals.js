let User = require('../mongodb/user').User

/*
** Обработчики вкладки рефералов
*/

const COMMON_INCOME = 2000;
const YOUTUBER_INCOME = 6000;
const FAN_INCOME = 3000;

mp.events.add({
    'REFERRALS::ADD_REFERRAL': addReferral,
    'REFERRALS::TAKE_REWARD': takeReward,
    'REFERRALS::GET_DATA': sendWindowData
})

// Обработчик добавление реферала
function addReferral(player, refCode) {
    if(player.mongoUser.name == refCode || player.mongoUser.surname == refCode)return player.alert('Нельзя использовать свой реферальный код!');
    if (player.name === refCode) {
        return player.call('REFERRALS::ON_ERROR', ['Нельзя использовать свой реферальный код!']);
    }
    findRefByCode(refCode, referral => {
        if (!referral)
            return player.call('REFERRALS::ON_ERROR', ['Указанный реферальный код не найден!']);
        try {
            player.mongoUser.referral = referral._id;
            updateReferralUser(referral, player);
            sendWindowData(player);
        } catch(e) {
            console.error(e.message);
        }
    });
}

// Находит аккаунт по введенному реф. коду
function findRefByCode(refCode, callback) {
    const isEmail = isEmailCode(refCode);
    let referral = isEmail ? mp.players.findByEmail(refCode) : mp.players.findName(refCode);
    if (referral) return callback(referral.mongoUser)
    // если указанный игрок не в сети, то ищем в монге
    User.findOne(getFilter(refCode, isEmail), (err, user) => {
        if (err) console.error(err);
        callback(user)
    });
}

// Проверяет, в каком виде пришел реферальный код
function isEmailCode(code) {
    return code.includes('@');
}

// Возвращает фильтр для поиска реферала в монге
function getFilter(refCode, isEmail) {
    if (isEmail)
        return {'email': refCode};
    else {
        const namePair = refCode.split(' ');
        return {name: new RegExp(namePair[0], "i") ,surname: new RegExp(namePair[1], "i")};
    }
}

// Обновляет данные выбранного игрока-реферала
function updateReferralUser(referral, player) {
    try{

        const refPlayer = mp.players.atMongoId(referral._id);
        if (refPlayer === undefined) {
            referral.referrals.push(player._id);
            if(!referral.$__.saving)
                referral.save().catch(err => console.error(err));
        }
        else
            refPlayer.mongoUser.referrals.push({
                name: player.mongoUser.name,
                surname: player.mongoUser.surname,
                inGame: player.time_game
            });
    }catch(e){
        console.error(e)
    }
}

// Обработчик получения награды с рефералов
function takeReward(player, income) {
    player.mongoUser.refsIncome = 0;
    player.editMoney(income, 'Реф. система');
}

// Обновляет данные игрока в окне доната
function sendWindowData(player) {
    try{

        const data = {
            refCode: player.name,
            inGame: player.mongoUser.time_game,
            refsIncome: player.mongoUser.refsIncome,
            invitedRefs: player.mongoUser.referrals.map(p => {
                return  {
                        name: getFullname(p),
                        inGame: p ? p.time_game : 0
                    }
            })
        }
        if (!player.mongoUser.referral) return sendData(player, data);
        // если у игрока указан реферал, ищем его
        getRefById(player.mongoUser.referral, (referral, isOnline) => {
            try{
                if(referral == null)return;
                data.referral = {
                    name: isOnline ? referral.name : getFullname(referral),
                    inGame: referral.time_game
                }
                sendData(player, data);
            }catch(e){
                console.error(e)
            }
        });
    }catch(e){
        console.error(e)
    }
}

// Отправляет данные в UI
function sendData(player, data) {
    player.call('REFERRALS::REFRESH_DATA', [JSON.stringify(data)]);
}

// Возвращает реферала по идентификатору или его данные из монги
function getRefById(id, callback) {
    let referral = mp.players.atMongoId(id);
    if (referral) return callback(referral, true);
    User.findById(id, (err, user) => {
        if (err) console.error(err);
        callback(user, false);
    });
}

// Выдаёт награду игроку и его рефералу
function giveReward(player) {
    if (!player.mongoUser.referral) return
    const isPlayerYoutuber = player.mongoUser.isYoutuber;
    getRefById(player.mongoUser.referral, (referral, isOnline) => {
        try{
            const isRefYoutuber = giveRewardToRef(referral, isOnline, isPlayerYoutuber);
            player.mongoUser.refsIncome += getIncome(isPlayerYoutuber, isRefYoutuber);
        }catch(e){
            console.error(e)
        }
    })
}

// Выдает награду рефералу и определяет, является ли он ютубером
function giveRewardToRef(referral, isOnline, isPlayerYoutuber) {
    let isYoutuber;
    if (isOnline) {
        isYoutuber = referral.mongoUser.isYoutuber;
        referral.mongoUser.refsIncome += getIncome(isYoutuber, isPlayerYoutuber);
    }
    else {
        isYoutuber = referral.isYoutuber;
        referral.refsIncome += getIncome(isYoutuber, isPlayerYoutuber);
        if(!referral.$__.saving) referral.save().catch(err => console.error(err));
    }
    return isYoutuber;
}

// Возвращает вознаграждение игрока
function getIncome(isYoutuber, isFan) {
    if (isYoutuber) return YOUTUBER_INCOME;
    if (isFan) return FAN_INCOME;
    return COMMON_INCOME;
}

// Собирает полное имя
function getFullname(user) {
    if(user === null)return 'Игрок не найден'
    return `${user.name} ${user.surname}`;
}

exports.sendWindowData = sendWindowData;
exports.giveReward = giveReward;
exports.findRefByCode  = findRefByCode;
exports.addReferral  = addReferral;