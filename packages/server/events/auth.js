var User = require('../mongodb/user.js').User;
const initplayer = require('../player/init/player.js');
let addClothes = require('../clothes/addClothes.js');
const itemsinfo = require('../inventory/itemsinfo.js');
let moment = require("moment");
let {addReferral,findRefByCode} = require('../donate/referrals.js')
let tips = "";
let tips_model = require('../mongodb/tips.js').tips;
tips_model.find({},(err,docs)=>{
  if(err)console.error(err);
  tips = JSON.stringify(docs);
})


mp.events.add('AUTHORIZETE::REG', (player,name,surname,pass,email,regPromo,personage,clothes,age) => {

  personage = JSON.parse(personage);
  clothes_per = JSON.parse(clothes);
  let authpass = mp.randomString(20);
  if(name.length<1)return player.call('AUTHORIZETE::NOTIFICATION',[`Имя должно быть больше 3 символов`,1]);
  if(surname.length<1)return player.call('AUTHORIZETE::NOTIFICATION',[`Фамилия должна быть больше 3 символов`,1]);
  if(email.length<1)return player.call('AUTHORIZETE::NOTIFICATION',[`Вы не ввели E-mail`,1]);
  let serial = player.serial
  let ip = player.ip;
  let social = player.socialClub;
  name.firstLetterCaps();
  surname.firstLetterCaps();
  User.createUser(name,surname, pass,email, ip,social,authpass,personage, serial, function(err,user){
     if(err){
      if(err === 'userError') return player.call('AUTHORIZETE::NOTIFICATION',[`Неверное Имя или Фамилия`,1]);
      if(err === 'passwordError') return player.call('AUTHORIZETE::NOTIFICATION',[`Пароль должен состоять из английских букв и должен быть больше 5`,1]);
      if(err === 'doubleUser') return player.call('AUTHORIZETE::NOTIFICATION',[`Пользователь уже зарегистрирован`,1]);
      if(err === 'emailError') return player.call('AUTHORIZETE::NOTIFICATION',[`Неверный E-mail`,1]);
      if(err === 'doubleEmail') return player.call('AUTHORIZETE::NOTIFICATION',[`E-mail уже занят`,1]);
     }else{
        let vars = varsofuser(user,player);
        user.dateBirth = moment().subtract(age, 'years').valueOf();
        player.call('AUTHORIZETE::REG_SUCCESS',[authpass,JSON.stringify(vars),tips]);
        initplayer(player,user).then(()=>{
          if(regPromo != '')addReferral(player,regPromo);
          //Добавить предмет одежды играку
          addClothes(player,1,clothes_per.top);
          addClothes(player,2,clothes_per.legs);
          addClothes(player,3,clothes_per.foot);
          player.outputChatBox(`Добро пожаловать, ${user.name} ${user.surname}! Приятной игры на WESTRP!`)
          player.outputChatBox(`Используйте: /report - подать жалобу,  /ask - задать вопрос`)
          player.outputChatBox(`Ознакомиться с правилами и узнать информацию - F7`)
        }).catch((err)=>{
          console.error(err);
        });
     }
  });
});
mp.events.add('AUTHORIZETE::CHECK_REG', (player,name,surname,pass,email,regPromo) => {
  if(name.length<1)return player.call('AUTHORIZETE::NOTIFICATION',[`Имя должно быть больше 3 символов`,1]);
  if(surname.length<1)return player.call('AUTHORIZETE::NOTIFICATION',[`Фамилия должна быть больше 3 символов`,1]);
  if(email.length<1)return player.call('AUTHORIZETE::NOTIFICATION',[`Вы не ввели E-mail`,1]);
  player.alert('Проверка данных');
  let ip = player.ip;
  if(regPromo != ''){
    findRefByCode(regPromo,(referral)=>{
      if (!referral){
        player.call('AUTHORIZETE::NOTIFICATION', ['Указанный реферальный код не найден!']);
      }else{
        checkCreateUser(player,name,surname,pass,email,ip,regPromo)
      }
    })
  }else{
    checkCreateUser(player,name,surname,pass,email,ip,regPromo)
  }
});
mp.events.add('AUTHORIZETE::CHECK_AUTH', (player,email,pass) => {
  if(email.length<1)return player.call('AUTHORIZETE::NOTIFICATION',[`Email не написан`,1]);
  if(pass.length<1)return player.call('AUTHORIZETE::NOTIFICATION',[`Пароль не написан`,1]);
  User.authorize(email, pass, function(err, user){
    if(!mp.players.exists(player)) return;
      if (err){
          if (err === 403){
              player.call('AUTHORIZETE::NOTIFICATION',[`Пароль или логин введен неверно`,1]);
          }else{
              console.error(err);
              player.call('AUTHORIZETE::NOTIFICATION',[`У сервера произошла ошибка`,1]);
          }
      } else {
        authorization(player,user,user.authpass);
      }
  });
});

mp.events.add('AUTHORIZETE::CHECK_AUTH_AUTO', (player,pass) => {
  let serial = player.serial;
  console.log(serial,pass)
  User.findOne({ 'authpass': pass,serial}, (err, user)=> {
    if(!mp.players.exists(player)) return;
    if(err) console.error(err);
    if(user && user.serial === serial){
      authorization(player,user,pass);
    }else{
      player.call('AUTHORIZETE::FORM_AUTH',['']);
    }
  });
});

function varsofuser(user,player){
  let vars ={
    admin: user.admin,
    items: user.items,
    infoitems: itemsinfo,
    money: user.money,
  };
  return vars;
}

let authorization =  function(player,user,pass) {
  if(!mp.players.exists(player)) return;
  if(user.ban == true){
    if (user.LiftTimestamp == -1) {
        player.notify(`Вы были забанены. \nПричина: ${user.Reason}`);
        return player.kick("Banned from server.");
    }else{
      if(user.LiftTimestamp > mp.bans.getUnixTimestamp()) {
          player.notify(`Вы были забанены. \nПричина: ${user.Reason}\nКонец бана: \n${mp.bans.formatUnixTimestamp(user.LiftTimestamp)}`);
          return player.kick("Banned from server.");
      } else {
        user.ban = false;
      }
    }
  }
  let findplayer;
  mp.players.forEach((_player)=>{
    try{
      if(_player._id && _player._id.toString() == user._id.toString()) findplayer = _player
    }catch(e){
      console.error(e)
    }
  })
  if(findplayer)return player.call('AUTHORIZETE::NOTIFICATION',[`Игрок уже вошел в игру`,1]);
  user.serial = player.serial;
  let home = mp.homes.find((home)=>{
    if(home.owner && home.owner.toString() === user._id.toString())return true;
  })
  let items = [false,!user.fraction || !user.fraction.name ? true : false,!home];
  player.call('AUTHORIZETE::SPAWN_START',[JSON.stringify(items)])
  player.mongoUser = user;
  player.pass = pass;
}
mp.events.add("AUTH::SPAWN_CLICK",(player,typePos)=>{
  if(!player.pass)return
  let pos;
  let user = player.mongoUser;
  if(typePos == 0){
    pos = user.pos;
  }
  else if(typePos == 1){
    if(typeof mp.fractions[user.fraction.name].spawn[0] == "object"){
      let spawns =mp.fractions[user.fraction.name].spawn
      pos = spawns[Math.floor(Math.random()*spawns.length)];
    }
    else pos = mp.fractions[user.fraction.name].spawn;
  }
  else if(typePos == 2){
      let home = mp.homes.find((home)=>{
        if(home.owner && home.owner.toString() === user._id.toString())return true;
      })
      pos = home.pos;
  }
  let vars = varsofuser(user,player);
  let authPass = player.pass;
  player.call('AUTHORIZETE::AUTH_SUCCESS',[authPass,JSON.stringify(vars),tips]);
  initplayer(player,user,pos,typePos).then(()=>{
    player.outputChatBox(`Добро пожаловать, ${user.name} ${user.surname}! Приятной игры на WESTRP!`)
  }).catch((err)=>{
    console.error(err);
  });
  player.pass = undefined;
})


function checkCreateUser (player,name,surname, pass,email, ip,regPromo) {
  User.checkUser(name,surname, pass,email, ip, function(err){
    if(err){
      if(err === 'userError') return player.call('AUTHORIZETE::NOTIFICATION',[`Неверное Имя или Фамилия`,1]);
      if(err === 'passwordError') return player.call('AUTHORIZETE::NOTIFICATION',[`Пароль должен состоять из английских букв и должен быть больше 5`,1]);
      if(err === 'doubleUser') return player.call('AUTHORIZETE::NOTIFICATION',[`Пользователь уже зарегистрирован`,1]);
      if(err === 'emailError') return player.call('AUTHORIZETE::NOTIFICATION',[`Неверный E-mail`,1]);
      if(err === 'doubleEmail') return player.call('AUTHORIZETE::NOTIFICATION',[`E-mail уже занят`,1]);
    }else{
      player.call('Personal_Start',[JSON.stringify([name,surname,pass,email,regPromo])])
    }
  });
}