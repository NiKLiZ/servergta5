require('./carshowroom')
mp.calbackmenuv({
    "BUSINES::OPEN_MENU":(player)=>{
        let busines = player.busines;
        if(!busines)return;
        let menu = {
            name: 'Бизнес',
            items: [
                {
                    type: 2,
                    name: 'Снять с баланса',
                    placeholder: 'У вас на балнсе '+busines.model.balance,
                    infomenu: {
                        name: 'Бизнес',
                        items: [
                            {
                                type: 5,
                                name: 'Деньги',
                                placeholder: 'У вас на балнсе '+busines.model.balance,
                                type_input: 'number'
                            },
                            {
                                type: 1,
                                name: 'Снять',
                                placeholder: 'У вас на балнсе '+busines.model.balance,
                                callback: 'BUSINES::TAKE_BALANCE'
                            },
                        ]
                    }
                },
                {
                    type: 2,
                    name: 'Положить на баланс',
                    placeholder: 'У вас на балнсе '+busines.model.balance,
                    infomenu: {
                        name: 'Бизнес',
                        items: [
                            {
                                type: 5,
                                name: 'Деньги',
                                placeholder: 'У вас на балнсе '+busines.model.balance,
                                type_input: 'number'
                            },
                            {
                                type: 1,
                                name: 'Положить',
                                placeholder: 'У вас на балнсе '+busines.model.balance,
                                callback: 'BUSINES::LAY_BALANCE'
                            },
                        ]
                    }
                },
            ]
        };
        busines.openOwnerMenu(menu);
        player.createmenuv(menu);
    },
    "BUSINES::TAKE_BALANCE":(player,array)=>{
        let balance = parseInt(array[0]);
        let busines = player.busines;
        if(!busines)return;
        if(isNaN(balance))return player.alert('Не верное значение ')
        if(balance < 0)return player.alert('Нельзя писать меньше 1$')
        if(!busines.editBalance(-balance,`${player.name} снял с баланса`))return player.alert('На балансе бизнеса не хватает денег');
        player.editMoney(balance,'Снял с бизнеса');
        player.alert(`Вы сняли со счёта ${balance}`);
    },
    "BUSINES::LAY_BALANCE":(player,array)=>{
        let balance = parseInt(array[0]);
        let busines = player.busines;
        if(!busines)return;
        if(isNaN(balance))return player.alert('Не верное значение ')
        if(balance < 0)return player.alert('Нельзя писать меньше 1$')
        if(!player.editMoney(-balance,'Положил на бизнес'))return;
        busines.editBalance(balance,`${player.name} положил на баланс`);
        player.alert(`Вы положили на счёта ${balance}`);
    }
})