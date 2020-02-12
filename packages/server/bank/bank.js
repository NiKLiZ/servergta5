mp.events.add({
	"BANK::MENU":(player)=>{
		let cards = mp.cards.atPlayer(player);
		if(cards.length){
			let cards_info = JSON.stringify(cards.map((card)=>{
				return {
					money: card.money,
					transactions: card.model.transactions,
					card_number: card.card_number
				}
			}));
			player.call('BANK::CARD_MENU',[cards_info])
		}else player.call('BANK::ADD_CARD_MENU');
	},
	'BANK::ADD_CARD':(player,card)=>{
		if(!player.inventory.isEmptySlot(15))return player.alert('Нет свободного места в инвентаре');
		card = mp.cards.atNumber(parseInt(card));
		player.inventory.addItem(15,null,{card_number: card.card_number,card_id: card.model._id});
		player.alert(`Вы оформили карту за 5$`)
	},
	'BANK::ADD_NEW_CARD':(player,array)=>{
		let cards = mp.cards.atPlayer(player);
		if(cards.length > 5) return player.alert('Максимум счетов 5');
		if(player.editMoney(-5,`Оформления карты`)){
			if(mp.cards.add(player)){
				mp.events.call('BANK::MENU',player);
				player.alert(`Вы оформили карту за 5$`)
			}
		}
	},
	'BANK::ADD_ACCOUNT':(player)=>{
		if(!player.inventory.isEmptySlot(15))return player.alert('Нет свободного места в инвентаре');
		let cards = mp.cards.atPlayer(player);
		if(cards.length > 5) return player.alert('Максимум счетов 5');
		if(player.editMoney(-5,`Оформления карты`)){
			if(mp.cards.add(player)){
				mp.events.call('BANK::MENU',player);
				player.alert(`Вы оформили счёт за 5$`)
			}
		}
	},
	"BANK::MENU_BANK_SHOOT":(player,card,money,isatm)=>{
		card = mp.cards.atNumber(card);
		money = parseInt(money)
		if(money < 1 )return;
		if(card.money - money >= 0){
			player.editmoneyCash(money,'Снял деньги с '+card.card_number)
			card.editMoney(-money,`Снял деньги`);
			player.alert('Вы сняли деньги')
		}else player.alert('У вас не хватает денег')
		if(!isatm)mp.events.call('BANK::MENU',player);
		else mp.events.call('BANK::ATM_MENU',player);
	},
	"BANK::MENU_BANK_REPLENISH":(player,card,money,isatm)=>{
		card = mp.cards.atNumber(card);
		money = parseInt(money)
		if(!card) return;
		if(money < 1 )return;
		if(player.money - money >= 0){
			player.editmoneyCash(-money,'Пополнил деньги на '+card.card_number)
			card.editMoney(money,`Пополнение наличными`);
			player.alert('Вы пополнили карту')
		}else player.alert('У вас не хватает денег')
		if(!isatm)mp.events.call('BANK::MENU',player);
		else mp.events.call('BANK::ATM_MENU',player); 
	},
	"BANK::MENU_BANK_LEAD":(player,card,card_to,money,isatm)=>{
		card = mp.cards.atNumber(card);
		card_to = mp.cards.atNumber(card_to);
		if(card == card_to)return player.alert('Нельзя перевести деньги на ту же карту')
		if(!card_to) return player.alert('Карта не найдена');
		money = parseInt(money)
		if(money < 1 )return;
		if(card.money - money >= 0){
			card.editMoney(-money,'Перевод денег на '+card_to.card_number)
			card_to.editMoney(money,`Перевод на карту `+card.card_number);
			player.alert('Вы перевели на карту деньги')
		}else player.alert('У вас не хватает денег')
		if(!isatm)mp.events.call('BANK::MENU',player);
		else mp.events.call('BANK::ATM_MENU',player);
	},
	"BANK::ATM_MENU":(player)=>{
		let cards = [];
		player.inventory.forEach(15,(item)=>{
			if(item.id === 15){
				cards.push(mp.cards[item.card_id]);
			}
		});
		
		if(cards.length){
			let cards_info = JSON.stringify(cards.map((card)=>{
				return {
					money: card.money,
					card_number: card.card_number
				}
			}));
			player.call('BANK::ATM_MENU',[cards_info])
		}else{
			player.call('BANK::ATM_MENU',[])
		}
	}
});