const greenZones = [];

class Green {
    constructor(d) {
        this.id = greenZones.length + 1;
        this.radius = d.radius;
        this.position = d.pos;

        greenZones.push(this);

    }
}

mp.events.add({
    'shootInGreenZoneKick' : (player) => {
        player.kick()
    },
    
    'loadGreenZones' : (player) => {
        let admin;

        if (player.permision['WATCH::GREENZONE']) admin = 1;
        player.call('zonesCreate', [admin]);
    }
});

mp.events.addCommand({
    'createzz' : (player, fulltext, radius) => {
        if (!player.permision || !player.permision['COMMAND::CREATEZZ']) return;
        if (typeof radius == 'undefined') return player.outputChatBox('Необходимо ввести радиус зз!')

        +radius;
        const position = player.position;

        const model = {
            id: greenZones.length + 1,
            pos: position, 
            radius
        }

        new Green(model)

        const m = JSON.stringify(model);

        mp.players.forEach((p) => {
            p.call('zoneCreate', [m]);
        });

    },
    
    'removezz' : (player, fullText, id) => {
        if (!player.permision || !player.permision['COMMAND::REMOVEZZ']) return;
        if (typeof id == 'undefined') return player.outputChatBox('Необходимо ввести id зз!');
        +id;
        let success = false;

        for (let i = 0; i < greenZones.length; i++) {
            if (!greenZones[i]) continue;

            if (greenZones[i].id == id) {
                delete greenZones[i];
                success = true;
                break;  
            }
        }

        if(!success) return player.outputChatBox(`ЗЗ с id ${id} отсутствует на сервере`);

        mp.players.forEach((p) => {
            p.call('removeZone', [id])
        });
    }
});