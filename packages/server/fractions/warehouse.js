mp.calbackmenuv({
	"FRACTION_WAREHOUSE::GET_WAREHOUSE_WEAPON":(player,array)=>{
		let weapon = player.inventory.getItemWeapon(array[0]);
		if(!player.fraction.model.data.weapons[array[0]])return player.alert(weapon.name+' нет')
		if(!player.inventory.addItemData(weapon,{
			warehouse: true
		}))return player.alert('Не хватает места в инвентаре');;
		player.alert('Вы взяли '+weapon.name)
		player.fraction.model.data.weapons[array[0]] -= 1;
		if(!player.fraction.model.$__.saving)player.fraction.model.save().catch((err)=>{console.error(err)});
		player.fraction.broadcast(`<span style='color:rgba(218, 165, 32,255)'> [Склад] ${player.nameTag} - взял ${weapon.name} со склада</span>`)
	},
	"FRACTION_WAREHOUSE::GET_WAREHOUSE_AMMO":(player,array)=>{
		if(!player.fraction.model.data.ammo)return player.alert('Патронов нет')
		if(!player.inventory.addItem(19,1,{
			warehouse: true
		}))return player.alert('Не хватает места в инвентаре');
		player.alert('Вы взяли патроны')
		player.fraction.model.data.ammo -= 1;
		if(!player.fraction.model.$__.saving)player.fraction.model.save().catch((err)=>{console.error(err)});
		player.fraction.broadcast(`<span style='color:rgba(218, 165, 32,255)'>[Склад] ${player.nameTag} - взял магазин со склада</span>`)
	},
	"FRACTION_WAREHOUSE::WAREHOUSE_LAY_BOX":(player)=>{
		let slot = player.inventory.findGloveIdItem(58);
		if(!slot)return player.alert('У вас нет коробки')
		let item = player.inventory.items[slot];
		if(item.weapon){
			if(!player.fraction.model.data.weapons) player.fraction.model.data.weapons = {};
			if(!player.fraction.model.data.weapons[item.weapon])player.fraction.model.data.weapons[item.weapon] = 1;
			else player.fraction.model.data.weapons[item.weapon] += 1;
			player.alert('Вы положили оружие на склад')
		}else{
			player.fraction.model.data.ammo += 3;
			player.alert('Вы положили патроны на склад')
		}
		player.inventory.removeSlot(slot);
		if(!player.fraction.model.$__.saving)player.fraction.model.save().catch((err)=>{console.error(err)});
	},
	"FRACTION_WAREHOUSE::WAREHOUSE_TOGGLE":(player)=>{
		let hasWarehouse = player.fraction.rank[player.mongoUser.fraction.rank].warehouse;
		if(player.mongoUser.fraction.rank != player.fraction.rank.length-1 && !hasWarehouse) return player.alert('Вы не лидер фракции');
		player.fraction.lockedWarehouse = !player.fraction.lockedWarehouse;
		player.alert(`Вы ${!player.fraction.lockedWarehouse  ? 'открыли' : 'закрыли' } склад`)
	},
	"FRACTION_WAREHOUSE::LAY_MONEY":(player,array)=>{
		let money = parseInt(array[0]);
		if(!player.editmoneyCash(-money,'Склад '+player.fraction.name))return;
		player.fraction.model.data.money += money;
        player.alert('Вы положили '+money)
		if(!player.fraction.model.$__.saving)player.fraction.model.save().catch((err)=>{console.error(err)});
	},
	"FRACTION_WAREHOUSE::TAKE_MONEY":(player,array)=>{
		let money = parseInt(array[0]);
        if(player.fraction.model.data.money-money < 0 )return player.alert('На складе не хватает денег');
        player.editmoneyCash(money,'Склад '+player.fraction.name)
        player.fraction.model.data.money -= money;
        player.alert('Вы взяли '+money)
		if(!player.fraction.model.$__.saving)player.fraction.model.save().catch((err)=>{console.error(err)});
	}
})

mp.events.push({
	"FRACTION::WAREHOUSE_MENU":(player,idMarker)=>{
		if(!player.fraction)return;
		let hasWarehouse = player.fraction.rank[player.mongoUser.fraction.rank].warehouse;
		if(!player.isBox && player.fraction.lockedWarehouse && (player.mongoUser.fraction.rank != player.fraction.rank.length-1 && !hasWarehouse))return player.alert('Склад закрыт')
		let menu = {
			name: 'Склад',
			items: [

			]
		}
		if(player.mongoUser.fraction.rank == player.fraction.rank.length-1 || hasWarehouse){
			menu.items.push({
				type: 1,
				name: `${player.fraction.lockedWarehouse ? 'Открыть' : 'Закрыть' } склад`,
				callback: "FRACTION_WAREHOUSE::WAREHOUSE_TOGGLE",
			})
		}
		if(!player.fraction.lockedWarehouse){
			let weapons = [];
			for(weapon in player.fraction.model.data.weapons){
				let nameWeapon = player.inventory.getItemWeapon(weapon).name;
				weapons.push({
					type: 1,
					name: 'Взять '+nameWeapon,
					placeholder: 'Количество '+player.fraction.model.data.weapons[weapon],
					callback: 'FRACTION_WAREHOUSE::GET_WAREHOUSE_WEAPON',
					value: weapon
				})
			}
			menu.items.push({
				type: 2,
				name: 'Взять оружие',
				infomenu: {
						name: 'Оружие',
						items: weapons
					}
				},
				{
					type: 2,
					name: 'Взять патроны',
					callback: 'FRACTION_WAREHOUSE::GET_WAREHOUSE_AMMO',
					placeholder: 'Патрон '+player.fraction.model.data.ammo
				},
				{
					name: 'Положить деньги',
					placeholder: 'Денег на складе '+player.fraction.model.data.money,
					type: 2,
					infomenu: {
						name: 'Банда',
						items: [
							{
								type: 5,
								name: 'Количество денег',
								type_input: 'number'
							},
							{
								type: 1,
								name: 'Положить',
								callback: 'FRACTION_WAREHOUSE::LAY_MONEY',
							},
						]
					}
				}
				)
        }
        if(!player.fraction.lockedWarehouse && player.mongoUser.fraction.rank == player.fraction.rank.length-1){
            menu.items.push(
                {
					name: 'Взять деньги',
					placeholder: 'Денег на складе '+player.fraction.model.data.money,
					type: 2,
					infomenu: {
                        name: 'Банда ',
						items: [
                            {
                                type: 5,
								name: 'Количество денег',
								type_input: 'number'
							},
							{
                                type: 1,
								name: 'Положить',
								callback: 'FRACTION_WAREHOUSE::TAKE_MONEY',
                                placeholder: 'Денег на складе '+player.fraction.model.data.money,
							},
						]
					}
				}
            )
        }
		if(player.isBox){
			menu.items.unshift({
				type: 1,
				name: 'Положить ящик',
				callback: 'FRACTION_WAREHOUSE::WAREHOUSE_LAY_BOX',
			})
		}
		player.call("GANG::WAREHOUSE_MENU",[JSON.stringify(menu),idMarker])
    },
})