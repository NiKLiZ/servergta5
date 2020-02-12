let card_model = require('../mongodb/card.js').card;
mp.cards = {};

let card = class card{
		constructor(model) {
			this.model = model;
			this.money = model.money;
			this.card_number = model.card_number;
		}
		editMoney(money,title){
			if(this.model.money + money < 0) return false; 
			this.setMoney(this.money+money,title);
			return true;
		}
		setMoney(money,title,test){
			let taken = money<0 ? true :  false;
			let transaction = {money:(this.money - money)*-1,title:title || 'Нет описания',taken:taken,date:new Date().getTime()};
			this.model.money = money;
			this.money = money;
			if(this.money < 0)return;
			this.model.transactions.push(transaction)
			card_model.findByIdAndUpdate(this.model._id, { $set: {money: this.money},$push: {transactions:transaction}}, function(err, doc){
				if (err) console.error(err);
			});
			this.updateTextMoney();
		}
		player(){
			return mp.players.atMongoId(this.model.player._id);
		}
		updateTextMoney(){
			 let players = mp.players.toArray();
			 players.find((pl)=>{
				if(pl.inventory && pl.card && pl.card.model._id.toString() ==  this.model._id.toString()){
					pl.call('HUD::UPDATE_BANK_MONEY',[this.model.money])
					pl.updateInfoMenu();
					return true;
				}
			})
		}
		user(){
			return this.model.player;
		}

}
card_model.find({},(err,docs)=>{
	if(err) return console.error(err);
	for (let i = 0; i < docs.length; i++) {
		mp.cards[docs[i]._id.toString()] = new card(docs[i]);
	}
})
mp.cards.add = (player)=>{
	let card_number = `${mp.getRandomInRange(400000,999999)}`;
	let schema = new card_model({
		player: player._id,
		money: 0,
		card_number: card_number
	}) 
	schema.save().catch(err=>console.error(err))
	mp.cards[schema._id.toString()] = new card(schema);
	player.inventory.addItem(15,null,{card_number: card_number,card_id: schema._id},true);
	return card;
}
mp.cards.atNumber = (number) =>{
	let card;
	for(car in mp.cards){
		car = mp.cards[car];
		//В строку перевожу на всякий случай вдруг это будет цифра
		if(typeof car != "function" && car.card_number.toString() == number.toString()) card = car;
	}		
	return card;
}
mp.cards.atPlayer = (player) =>{
	let cards = [];
	let id = player._id.toString();
	for(car in mp.cards){
		car = mp.cards[car];
		//В строку перевожу на всякий случай вдруг это будет цифра
		if(typeof car != "function" && car.model.player._id.toString() == id) cards.push(car);
	}		
	return cards;
}
