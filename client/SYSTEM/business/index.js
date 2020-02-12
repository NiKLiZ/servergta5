const businessMarkers = [];
let inShape = false;

class BizMarker {
	constructor(conf) {
		this.coord = conf.coord;
		this.stockCoord = conf.stockCoord;
		this.id = conf.id;
		this.hasOwner = conf.hasOwner;
		this.owner = conf.owner;

		this.blipId = conf.blipId;
		this.title = conf.title;
		this.price = conf.price;

		this.createMainShape();
		this.createBusinessLabel();

		businessMarkers.push(this);
	}

	createMainShape() {
        let mar = {
            type: 1,
            color:  [0,255,0,60],
            position: this.coord,
            scale: 1.5
        }
        let bisnines = this;
        createMarker(mar,(m)=>{
            let menu = {
                name:  bisnines.title,
                exit_mar: m,
                items: [
                    {
                        type: 1,
                        name: 'Взаимодействовать',
                        callback: 'BUSINESS::OPEN_MENU',
                        placeholder: 'Взаимодействовать',
                        callpointenct: bisnines.id

                    },
                ]
            };
            if(!bisnines.hasOwner){
                menu.items.push({
                    type: 1,
                    name: 'Купить',
                    callback: 'BUSINESS::BUY',
                    placeholder: `Купить бизнес за ${bisnines.price}`,
                    callpointenct: bisnines.id
                })
            }
            if(bisnines.hasMyOwner){
                menu.items.push({
                    type: 1,
                    name: 'Продать',
                    callback: 'BUSINESS::SELF',
                    placeholder: `Продать бизнес за ${(bisnines.price*0.7)}$`,
                    callpointenct: bisnines.id
                })
            }
            createmenuv(menu);
        })
		this.blip = mp.blips.new(this.blipId, this.coord,{
			name: `${this.title}`,
			color: this.blipColor,
			dimension: 0,
			shortRange: true,
			alpha: 255
		})
	}

	createBusinessLabel() {
		this.label = mp.labels.new(`Бизнес: ${this.title.slice(0,8)}\nВладелец: ${this.owner}\nСтоимость: ${this.price}$`, new mp.Vector3(this.coord.x, this.coord.y, this.coord.z+1),
        {
            los: true,
            font: 0,
            drawDistance: 7,
        });
    }

	updateLabel() {
		this.label.text = `Бизнес: ${this.title.slice(0,8)}\nВладелец: ${this.owner}\nСтоимость: ${this.price}$`;
        
    }
}

mp.events.add({
    "BUSINESS::CREATE":(business)=>{
        business = JSON.parse(business);
        business.forEach((busines)=>{
            let [coord, stockCoord, id, hasOwner, blipId, blipColor, title, price, owner] = busines;
            const conf = { 
                coord,
                stockCoord,
                id,
                hasOwner,
                blipId,
                blipColor,
                title,
                price,
                owner
            }
            new BizMarker(conf);
        })
    },
    'BUSINESS::UPDATE_MY':(id)=>{
        let busines = businessMarkers[id];
        busines.hasMyOwner = true;
        player.bisnines = busines;
        busines.blip.setColour(5);
    },
    "BUSINESS::SELF":(id)=>{
        let busines = businessMarkers[id];
        busines.blip.setColour(0);
        delete busines.hasMyOwner;
        delete player.bisnines;
    },
    'BUSINESS::UPDATE_OWNER' : (id,hasOwner, owner) => {
        businessMarkers.forEach(marker => {
            if (marker.id === id) {
                marker.hasOwner = hasOwner;
                marker.owner = owner;
                marker.updateLabel();
            }
        });
    },

    'pressEnter' : () => {
        if (inShape) {
            mp.events.callRemote('buyBusiness', inShape)
        }
    },

    'pressE' : () => {
        if (inShape) {
            mp.events.callRemote('openBizMenu', inShape)
        }
    },

    'sellBizMenu' : () => {
        cef.createCef('package://RP/Browsers/BusinessS/index.html');

        cef.cefUpdate('app.sellBizSet();');
    },

    'sellBizMenuClose' : () => {
        cef.removeCef();
    },

    'sellBusiness' : (id, price) => {
        cef.removeCef();

        mp.events.callRemote('sellBusiness', id, price)
    },

    'newOwnerOffer' : (name, price) => {
        cef.createCef('package://RP/Browsers/BusinessS/index.html');

        cef.cefUpdate(`app.buyBizSet('${name}', '${price}');`);
    },

    'buyBusiness' : () => {
        cef.removeCef();

        mp.events.callRemote('successOffer')
    }
})

function getBusinessById(id) {
    return businessMarkers[id];
}

module.exports.getBusinessById = getBusinessById;