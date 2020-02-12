require('./taxi.js');
require('./bus.js');
require('./pizzeria.js')
require('./farm.js')
require('./collector.js')
require('./evacuator.js')
require('./garbage.js')
require('./trucker.js')
require('./loader.js')
let jobs = {
    farm: { 
        name: 'Ферма',
        pos: require('./farm').position,
    },
    bus: { 
        name: 'Автобусник',
        pos: require('./bus').position,
    },
    collector: { 
        name: 'Инкассатор',
        pos: require('./collector').position,
    },
    evacuator: { 
        name: 'Эвакуаторщик',
        pos: require('./evacuator').position,
    },
    garbage: {
        name: 'Мусоровоз',
         pos: require('./garbage').position,
    },
    pizzeria: {
        name: 'Пиццерия',
         pos: require('./pizzeria').position,
    },
    taxi: { 
        name: 'Таксист',
        pos: require('./taxi').position,
    },
    trucker: {
        name: 'Дальнобойщик',
        pos: require('./trucker').position,
    },
    loader: {
        name: 'Грузчик',
        pos: require('./loader').position,
    }
};
exports.jobs = jobs