let fraction = require('../class.js');
let infoitems = require('../../inventory/itemsinfo');
let posSpawn = [
	new mp.Vector3(-1891.446044921875,3247.94091796875,35.854217529296875),
	new mp.Vector3(-1858.60009765625,3305.548095703125,35.85416030883789),
	new mp.Vector3(-2345.7705078125,3232.37841796875,33.7479133605957),
];
let indexWeapon = 0;
let weapons = [
	"weapon_pistol",
	"weapon_pistol_mk2", 
	"weapon_combatpistol", 
	"weapon_smg",
	"weapon_assaultsmg",
	"weapon_pumpshotgun",
	"weapon_assaultrifle",
	"weapon_carbinerifle_mk2",
	"weapon_combatmg",
]

let operationsClothes = [
	[
		[
			{
				"component": 4,
				"drawable": 46
			},
			{
				"component": 11,
				"drawable": 208
			},
			{
				"component": 6,
				"drawable": 27
			},
			{
				"component": 9,
				"drawable": 12
			},
			{
				"prop": 0,
				"drawable": 112
			},
			{
				"component": 3,
				"drawable": 0
			},
		],
		[
			{
				"component": 4,
				"drawable": 46
			},
			{
				"component": 6,
				"drawable": 27
			},
			{
				"component": 11,
				"drawable": 248
			},
			{
				"component": 9,
				"drawable": 12
			},
			,
			{
				"component": 3,
				"drawable": 1
			},
			{
				"prop": 0,
				"drawable": 124
			} 
		],
	],
	[
		{
			"component": 11,
			"drawable": 256
		},
		{
			"component": 4,
			"drawable": 3
		},
		{
			"component": 6,
			"drawable": 63
		},
		{
			"component": 9,
			"drawable": 2
		},
		{
			"prop": 0,
			"drawable": 85
		},
		{
			"component": 3,
			"drawable": 0
		},
	]
]
let trainingClothes = [
	[
		{
			"component": 11,
			"drawable": 15
		},
		{
			"component": 8,
			"drawable": 15
		},
		{
			"component": 3,
			"drawable": 15
		},
		{
			"component": 4,
			"drawable": 88
		},
		{
			"component": 6,
			"drawable": 27
		},
	],
	[
		{
			"component": 11,
			"drawable": 223
		},
		{
			"component": 4,
			"drawable": 91
		},
		{
			"component": 6,
			"drawable": 28
		},
		{
			"component": 8,
			"drawable": 15
		},
		{
			"component": 3,
			"drawable": 15
		},
	]
]
let config = require('../../../configs/fractions/ARMY.json')
mp.fractions.ARMY = new fraction('ARMY',[209, 115, 206,255],config.rank,config.vehs,posSpawn);
mp.calbackmenuv({
	"ARMY::LOCKER": (player,array)=>{
		let typeClothes = array[0];
		if(typeClothes == 1){
			donClothes(player,trainingClothes[player.gender]);
		}
		if(typeClothes == 2){
			donClothes(player,player.fraction.rank[player.rank].clothes.base[player.gender]);
		}
		if(typeClothes == 3){
			if(player.rank == 0)return player.alert('У вас первый ранг вам не разрешенно надевать цпец одежду')
			if(player.gender === 0){
				let rankClothes = player.rank < 5 ? 0 : 1;
				donClothes(player,operationsClothes[0][rankClothes]);
			}else{
				donClothes(player,operationsClothes[1]);
			}
		}
		player.locker_fraction = !player.locker_fraction;
		if(!player.locker_fraction){
			player.removeAllWeapons();
			return player.inventory.refetchItems();
		} 
	},
})
mp.events.push({
	"ARMY::CLOTHES":(player)=>{
		player.call("ARMY::CLOTHES",[player.locker_fraction])
	},
	"ARMY::ARMS":(player)=>{
		let weapons = player.fraction.rank[player.rank].weapons;
		if(!weapons)return player.alert('Вы не можете взять оружие')
		if(player.arms)return player.alert('Вы уже взяли оружие')
		player.arms = !player.arms;
		for (let i = 0; i < weapons.length; i++) {
			player.giveWeaponAttachment(mp.joaat(weapons[i][0]),weapons[i][1]);
		}
	},
	"ARMY::GET_WEAPON":(player)=>{
		if(player.inventory.hasAllNotEmptyGlove())return player.alert('Коробка не помещается в руки')
		if(player.isBox)return player.alert('Вы уже несёте коробку')
		if(indexWeapon === weapons.length-1)indexWeapon = 0;
		let weapon = weapons[indexWeapon];
		indexWeapon++;
		let itemWeapon = player.inventory.getItemWeapon(weapon)
		if(!itemWeapon)return player.alert('Предмет не найден '+weapon)
		let item = JSON.parse(JSON.stringify(infoitems[58]));
		player.inventory.liesItem({id:58},true)
		item.weapon = weapon;
		player.alert(`Вы взяли ящик с ${itemWeapon.name}`)
		player.inventory.updateslot('hand1',item);
		player.inventory.saveItem('hand1');
		player.inventory.liesItem({id:58},true)
	},
	"ARMY::GET_AMMO":(player)=>{
		if(player.inventory.hasAllNotEmptyGlove())return player.alert('Коробка не помещается в руки')
		if(player.isBox)return player.alert('Вы уже несёте коробку')
		let item = JSON.parse(JSON.stringify(infoitems[58]));
		item.ammo = true;
		player.inventory.updateslot('hand1',item);
		player.inventory.saveItem('hand1');
		player.alert(`Вы взяли ящик с патронами`)
		player.inventory.liesItem({id:58},true)
	},
	"ARMY::WAREHOUSE":(player)=>{
		if(!player.isBox && player.fraction.lockedWarehouse && player.mongoUser.fraction.rank != player.fraction.rank.length-1)return player.alert('Склад закрыт')
		let menu = {
			name: 'Склад',
			items: [

			]
		}
		if(player.mongoUser.fraction.rank == player.fraction.rank.length-1){
			menu.items.push({
				type: 1,
				name: `${player.fraction.lockedWarehouse ? 'Открыть' : 'Закрыть' } Склад`,
				callback: "FRACTION_WAREHOUSE::WAREHOUSE_TOGGLE",
			})
		}
		if(!player.fraction.lockedWarehouse){
			let weapons = [];
			for(weapon in mp.fractions.ARMY.model.data.weapons){
				let nameWeapon = player.inventory.getItemWeapon(weapon).name;
				weapons.push({
					type: 1,
					name: 'Взять '+nameWeapon,
					placeholder: 'Количество '+mp.fractions.ARMY.model.data.weapons[weapon],
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
					placeholder: 'Патрон '+mp.fractions.ARMY.model.data.ammo
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
		player.call("ARMY::WAREHOUSE_MENU",[JSON.stringify(menu)])
	}
})
mp.events.add({
    "ARMY::MENU":(player)=>{
		let online_staff = mp.fractions.ARMY.getOnlineMembers().map((pl)=>{
			return {
				name: pl.name,
				rank: pl.mongoUser.fraction.rank,
				underRang: pl.mongoUser.fraction.underRang,
				warn: pl.mongoUser.fraction.warn || 0,
				
			}
		})
		player.fractionEval(`
			army_menu.online_staff = ${JSON.stringify(online_staff)};
		`)
	},
})



let donClothes = (player,conf)=>{
	conf.forEach((clot)=>{
		if(clot.component)player.setClothes(clot.component, clot.drawable, clot.color || 0, 0);
		else player.setProp(clot.prop, clot.drawable, clot.color || 0);
	}) 
}