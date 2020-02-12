let phoneModel = require('../mongodb/phone').phone;
let itemsinfo = require('../inventory/itemsinfo')
let items = {
      "Напитки": [
        {
          image: './img/items/food/water.png',
          name: 'Воду',
          price: 2,
          itemId: 64
        },
        {
          image: './img/items/food/milk.png',
          name: 'Молоко',
          price: 5,
          itemId: 65
        },
        {
          image: './img/items/food/can.png',
          name: 'Энергетик',
          price: 4,
          itemId: 66
        },
        {
          image: './img/items/food/tea.png',
          name: 'Холодный чай',
          price: 2,
          itemId: 16
        },
        {
          image: './img/items/food/sprunk.png',
          name: 'Sprunk',
          price: 4,
          itemId: 16
        },
        {
          image: './img/items/food/coffie.png',
          name: 'Кофе',
          price: 3,
          itemId: 17
        }
      ],
      "Еда": [
        {
          image: './img/items/food/food.png',
          name: 'Чизбургер',
          price: 5,
          itemId: 68
        },
        {
          image: './img/items/food/hotdog.png',
          name: 'Хот-дог',
          price: 4,
          itemId: 71
        },
        {
          image: './img/items/food/pizza.png',
          name: 'Пиццу',
          price: 6,
          itemId: 69
        },
        {
          image: './img/items/food/snack.png',
          name: 'Чипсы',
          price: 2,
          itemId: 70
        },
      ],
      "Техника": [
        {
          image: './img/items/phone.png',
          name: 'Телефон',
          price: 100,
          itemId: 18
        }
      ]
    }
mp.events.push({
  'SHOP::MENU': (player)=>{
    player.call('SHOP::MENU',[JSON.stringify(items)])
  },
  "SHOP::BUY_ITEM":(player,menu,item)=>{
    item = items[Object.keys(items)[parseInt(menu)]][parseInt(item)];
    if(!player.inventory.isEmptySlot(itemsinfo[item.itemId]))return player.alert('Нет свободного места в инвентаре');
    if(!player.editMoney(-item.price,item.name))return;
    if(item.itemId == 18){
      let phone = new phoneModel({
        number: mp.getRandomInRange(100000,999999),
      });
      createPhone(phone,player)
    }
    else player.inventory.addItem(item.itemId) 
    player.alert('Вы купили '+item.name)
  }
})

let createPhone = (phone,player)=>{
  phone.save((err)=>{
    try{
      if(err){
         //если номер не укальный
        if(err.code == 11000){
          phone.number = mp.getRandomInRange(100000,999999)
          createPhone(phone,player)
        }else {
          console.error(err);
          player.alert('Произошла ошибка')
        }
      }else{
        player.inventory.addItem(18,null,{phone:phone._id},true);
        player.alert('Вы купили телефон с номером ' + phone.number)
      }
    }catch(e){
      console.error(e)
      player.alert('Произошла ошибка')
    }
  })
}