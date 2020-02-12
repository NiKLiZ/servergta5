let businessList = [];

let model = require('../mongodb/busines.js').busines;
let User = require('../mongodb/user').User;
class Business {
	constructor(conf) {
		this.bizType = conf.bizType;
		this.id = conf.id;
		this.title = conf.title;
		this.coord = conf.pos;
		this.price = conf.price;
		this.stockCoord = conf.stockCoord;
		this.stockOffers = {};
		this.sellPrice = null;
        this.ordersExecuted = [];
        model.findOne({id: conf.id},(err,done)=>{
            try{
                if(err)console.error(err)
                if(done == null){
                    let infoModel = {
                        id: conf.id
                    }
                    let businesModel = new model(infoModel);
                    this.model = businesModel;
                    businesModel.save().catch((err)=>{
                        console.error(err);
                    });
                }else{
                    this.model = done;
                }
            }catch(e){
                console.error(e);
            }
            this.balance = this.model.balance;
            if(this.loadBusines)this.loadBusines();
            if(this.model.owner){
                User.findById(this.model.owner).where('name surname').exec((err,user)=>{
                    this.updateOwner(user.name+" "+user.surname);
                })
            }else{
                this.updateOwner();
            }
        });
		this.blipId = conf.blipId;
		this.blipColor = conf.blipColor;

		businessList.push(this);
		this.createMainShape();

	}

	createMainShape() {
		const players = mp.players.toArray();
        for (const p of players) {
            p.call("bizMainColshapeCreate", [this.coord, this.stockCoord, this.id, this.blipId, this.blipColor, this.title, this.price, this.owner]);
        }
	}

	async updateOwner(name) {
		if (this.model.owner) {
			// устанавливаем хозяина в бд и достаем его ник из бд
			this.ownerName = `${name}`;
		}
		else {
			this.ownerName = `Отсутствует`;
		}
		const players = mp.players.toArray();

        for (const pl of players) {
            if(pl.loggined)pl.call("BUSINESS::UPDATE_OWNER", [this.id,!!this.model.owner ,this.ownerName]);
        }
	}

	isPlayerHasBusiness(id) {
		for (let i = 0; i < businessList.length; i++) {
			if (businessList[i].model.owner === id) {
				return true;
			}
		}
		return false;
	}

	async buyBusiness(player) {
		if (this.model.owner) return;
		if (this.isPlayerHasBusiness(player._id)) return player.notify(`У вас уже имеется бизнес!`);
		player.editMoney(-this.price, `Покупка бизнеса `+this.title);
		this.model.owner = player._id;
        if(!this.model.$__.saving)this.model.save().catch((e)=>{
            player.alert('Произошла ошибка')
            console.error(e);
        })
        player.call("BUSINESS::UPDATE_MY",[this.id])
        player.busines = this;
		await this.updateOwner(player.name);
		player.alert(`Вы успешно приобрели бизнес!`);
	}
	
	async sellBusiness(owner) {
		if (this.model.owner.toString() !== owner._id.toString()) return;
		const newPrice = parseInt(this.price * 0.7);
        owner.call("BUSINESS::SELF",[this.id])
        delete owner.busines;
        this.model.owner = null;
        if(!this.model.$__.saving)this.model.save().catch((e)=>{
            player.alert('Произошла ошибка')
            console.error(e);
        })

		owner.editMoney(newPrice, `Продажа бизнеса в гос`);
		await this.updateOwner();
	}

	async sellBusinessToPlayer(owner, newOwner, price) {
		if (this.model.owner.toString() !== owner._id.toString()) return;

		if (this.isPlayerHasBusiness(newOwner._id)) return newOwner.alert(`У вас уже имеется бизнес!`);
		this.model.owner = newOwner._id;
        if(!this.model.$__.saving)this.model.save().catch((e)=>{
            owner.alert('Произошла ошибка')
            console.error(e);
        })
		newOwner.editMoney(-price, `Купил бизнес у игрокa  ${owner.name}`);
		owner.editMoney(price, `Продажа бизнеса игроку  ${newOwner.name}`);

        owner.call("BUSINESS::SELF",[this.id])
        delete owner.busines;

        newOwner.call("BUSINESS::UPDATE_MY",[this.id])
        newOwner.busines = this;

		await this.updateOwner(newOwner.name);
	}

	editBalance(money,title) {
		if (typeof money !== "number") throw new Error('Не верное значение');
        // обновляем баланс биза
        if(this.balance + money < 0)return false;
        this.balance += money;
        this.model.balance += money;
        this.model.transactions.push({
            money,
            title,
            date: Date.now()
        })
        if(!this.model.$__.saving)this.model.save().catch((e)=>{
            owner.alert('Произошла ошибка')
            console.error(e);
        })
        return true;
	}
}

function getBusnessInfo(){
    return businessList.map(business => {
        return [business.coord, business.stockCoord, business.id, !!business.model.owner, business.blipId, business.blipColor, business.title, business.price, business.ownerName]
    })
}

function getCountOfBusinesses() {
    return businessList.length;
}
function getBusinessByOwner(id) {
    return businessList.find(biz => {
        if (biz.model.owner && biz.model.owner.toString() === id.toString())return true;
    }); 
}
function getBusinessByType(type) {
    return businessList.filter(biz => {
        if (biz.bizType == type)return true;
    }); 
}

function getBusiness(buyBizId) {
    return businessList.find(biz => {
        if (biz.id == buyBizId) return true;
    });
}






mp.events.addCommand({
    'sellbiz' : (player, fullText, type) => {
        const business = getBusinessByOwner(player._id);

        switch (type) {
            case '0':
                if (business) return business.sellBusiness(player);
                break;
            case '1':
                if (business) return player.call('sellBizMenu');
                break;
        }
    },

    'buyproduct' : (player, fullText, product, productCount) => {
        if (productCount <= 0) return;
        const business = getBusinessByOwner(player._id);

        if (!business) return;
        const canOrder = business.canOrderProduct(player.money, product, productCount);

        if(!canOrder) return player.alert("У вас недостаточно денег на данный товар!");

        business.orderProduct(product, productCount)
    }

});

mp.events.add({
    

    'BUSINESS::MENU' : (player, id) => {
        const business = getBusiness(id);
        if (business) return business.openMenu(player);
    },

    'BUSINESS::SELL' : (player, id, price) => {
        const players = mp.players.toArray();
        let newOwner = null;

        const sellBusiness = getBusinessByOwner(player._id);
        
        if (!sellBusiness) return;
        
        for (const player of players) {
            if (player.id === id) newOwner = player;
        }

        if (!newOwner) return player.alert("Игрока с таким id нет на сервере!");
        if (player.id === newOwner.id) return player.alert("Вы не можете продать бизнес себе!");

        sellBusiness.sellPrice = price;

        newOwner.call('newOwnerOffer', [sellBusiness.title, sellBusiness.sellPrice]);
    },

    'successOffer' : (newOwner) => {
        let sellBusiness = getBusiness(newOwner._id);

        const player = mp.players.atMongoId(sellBusiness.model.owner);

        if (newOwner.money < sellBusiness.sellPrice) {
                newOwner.alert("У вас недостаточно средств!");
            return player.alert("У игрока недостаточно средств!");
        } 
        sellBusiness.sellBusinessToPlayer(player, newOwner, sellBusiness.sellPrice)			
    },

    'buyProduct' : (player, product, price, buyBizId, event) => {
        let business,
            productValue;

            business = getBusiness(buyBizId);

            for (let key in business.stock) {
                if (key == product) productValue = business.stock[key];
            }

            if (!business) return;	
            // проверяем достаточно ли деннег у игрока
            if (productValue === 0) return player.alert('К сожалению данный товар отсутствует на складе.');
            // снимаем деньги
            
            business.balance += price;

            for (let key in business.stock) {
                if (key == product) business.stock[key]--;
            }

            mp.events.call(event, product)
    }
})

mp.calbackmenuv({
    "BUSINESS::OPEN_MENU": (player,array)=>{
        const busines = businessList[parseInt(array[0])];
        if(busines)busines.openMenu(player);
    },
    'BUSINESS::BUY': (player, array) => {
        const busines = getBusiness(array[0]);
        if (busines) return busines.buyBusiness(player);
    },
    "BUSINESS::SELF":(player,array)=>{
        const busines = businessList[parseInt(array[0])];
        if (busines) return busines.sellBusiness(player);
    }
})

module.exports.class = Business;
exports.getBusnessInfo = getBusnessInfo;
exports.getCountOfBusinesses = getCountOfBusinesses;
exports.getBusinessByOwner = getBusinessByOwner;
exports.getBusiness = getBusiness;
exports.getBusinessByType = getBusinessByType;