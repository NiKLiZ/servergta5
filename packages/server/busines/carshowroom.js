const Business = require('./class').class;
const getCountOfBusinesses = require('./class').getCountOfBusinesses;
let modelBusines = require('../mongodb/busines.js').busines;
class CarShop extends Business {
    constructor(conf) {
        super(conf);
        this.stock = conf.stock;

        this.coordsVehicle = conf.buyVehicle; 
        this.trunckerPos = conf.trunckerPos;
    }
    loadBusines(){
        let busines = this;
        if(!this.model.stock)this.model.stock = {}
        this.stock.forEach((veh)=>{
            try{
                if(!busines.model.stock[veh.model]){
                    busines.model.stock[veh.model] = {
                        count: 0,
                        price: veh.price
                    }
                }
            }catch(e){
                console.error(e)
            }
        })
        this.model.markModified('stock');
        this.model.save().catch((err)=>{
            console.error(err);
        });
    }
    openMenu(player) {
        // Если нет владельнаца то все машины покажится 
        let stock = !this.model.owner ? this.stock : this.model.stock;
        if(!this.model.owner){
            stock = stock.map((veh)=>{
                return {
                    model: veh.model,
                    price: veh.price
                }
            })
        }else{
            stock = []; 
            Object.keys(this.model.stock).forEach((veh)=>{
                if(this.model.stock[veh] && this.model.stock[veh].count)stock.push({
                    model: veh,
                    price: this.model.stock[veh].price
                })
            })
        }
        if(!stock.length)stock = this.stock;
        player.call('showroomcars', [JSON.stringify(stock),this.id]);
    }
    getStockVeh(vehId){
        let vehStoke = this.stock[vehId];
        if(!this.model.owner)return vehStoke;
        if(!this.model.stock[vehStoke.model] || !this.model.stock[vehStoke.model].count)return false;
        else return vehStoke;
    }
    editStoke(model,count){
        if(!this.model.owner)return true;
        this.model.stock[model].count += count;
        this.model.markModified('stock');
        if(!this.model.$__.saving)this.model.save().catch((e)=>{
            console.error(e);
        }) 
    }
    
    deleteOrder(id){
        this.model.orders.splice(id,1);
        this.model.markModified('orders');
        if(!this.model.$__.saving)this.model.save().catch((e)=>{
            console.error(e);
        }) 
    }
    orderVeh(veh,count,price){
        for(let i = 0;i < count;i++){
            this.model.orders.push({
                model: veh.model,
                price: price
            })
        }
        this.model.markModified('orders');
        if(!this.model.$__.saving)this.model.save().catch((e)=>{
            console.error(e);
        }) 
    }
    openOwnerMenu(menu){
        let menuStoke = {
            name: 'Склад',
            items: [

            ]
        }
        this.stock.forEach((veh,i)=>{
            let count = this.model.stock[veh.model] ?  this.model.stock[veh.model].count : 0;
            menuStoke.items.push({
                type: 2,
                name: `${veh.model}`,
                placeholder: `На складе ${veh.model} ${count}`,
                infomenu: {
                    name: 'Склад',
                    items: [
                        {
                            type: 5,
                            name: 'Количество',
                            placeholder:  `На складе ${veh.model} ${count}`,
                            type_input: 'number'
                        },
                        {
                            type: 5,
                            name: 'Цена ',
                            placeholder:  `Минимальная цена на ${veh.model} ${veh.price}$`,
                            type_input: 'number'
                        },
                        {
                            type: 1,
                            name: `Заказать ${veh.model} `,
                            placeholder: `На складе ${veh.model} ${count}`,
                            callback: 'BUSINES::ORDER_VEH',
                            value: i
                        },
                    ]
                }
            })
        })
        let menuOrder = {
            name: 'Заказы',
            items: [

            ]
        }
        this.model.orders.forEach((veh,i)=>{
            menuOrder.items.push({
                type: 2,
                name: `${veh.model}`,
                placeholder: `Отменить заказ ${veh.model} на ${veh.price}`,
                infomenu: {
                    name: `${veh.model}`,
                    items: [
                        {
                            type: 1,
                            name: `Отменить заказ`,
                            placeholder: `Отменить заказ ${veh.model} `,
                            callback: 'BUSINES::ORDER_VEH_CANCEL',
                            value: i
                        },
                        {
                            type: 1,
                            name: `Не отменять заказ`,
                            placeholder: `Не отменять заказ ${veh.model}`,
                        },
                    ]
                }
            })
        })
        menu.items.push({
            type: 2,
            name: 'Склад',
            infomenu: menuStoke
        })
        menu.items.push({
            type: 2,
            name: 'Заказы',
            infomenu: menuOrder
        })
    }
}

mp.events.add({
    'lowAutoRoomAdd' : (bizModel) => {
        const stock = generateStock(0);

        createCarShop(bizModel, 'Low Autoroom', 0, stock);
    },

    'premiumAutoRoomAdd' : (bizModel) => {
        const stock = generateStock(1);

        createCarShop(bizModel, 'Premium Autoroom', 1, stock);
    },

    'luxAutoRoomAdd' : (bizModel) => {
        const stock = generateStock(2);

        createCarShop(bizModel, 'Lux Autoroom', 2, stock);
    },
});



function createCarShop(bizModel, title, carShopType, stock) {
    const model = JSON.parse(bizModel);

    model.title = title;
    model.carShopType = carShopType;
    model.stock = stock;

    new CarShop(model);
}

function generateStock(vehicles) {
    const stock = {};
        
    vehicles.forEach(vehicle => {
        stock[vehicle.model] = {
            count: 0,
            price: vehicles.price
        };  
    });

    return stock;
}

let carshowroomConf = require('../../configs/business/carshowroom.json');

carshowroomConf.forEach((carshowroom)=>{
    carshowroom.id = getCountOfBusinesses()
    carshowroom.bizType = 0;
    new CarShop(carshowroom)
})
mp.calbackmenuv({
    "BUSINES::ORDER_VEH":(player,array)=>{
        let count = parseInt(array[0])
        if(count < 0)return player.alert('Количество не может быть 0')
        let price = parseInt(array[1])
        if(isNaN(count))return player.alert('Не верное значение количества')
        if(isNaN(price))return player.alert('Не верное значение цены')
        let allPrice = price*count;
        let busines = player.busines;
        if(!busines)return;
        let veh = busines.stock[array[2]];
        if(veh.price > price)return player.alert(`Минимальная цена за авто ${veh.price}`)
        if(busines.model.balance - allPrice < 0)return player.alert('На балансе бизнеса не хватает денег')
        busines.editBalance(-allPrice,`Заказ ${veh.model} ${count}`)
        busines.orderVeh(veh,count,price)
        player.alert(`Вы заказали ${count} ${veh.model}`)
    },
    "BUSINES::ORDER_VEH_CANCEL":(player,array)=>{
        let id = parseInt(array[0]);
        let busines = player.busines;
        if(!busines)return;
        let order = busines.model.orders[id]
        player.alert(`Вы удалили заказ ${order.model} за ${order.price}$`)
        busines.deleteOrder(id);
    }
})