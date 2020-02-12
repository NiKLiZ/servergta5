const greenZonesStatic = require('../../../packages/configs/greenZones.json').positions;
const greenZones = [];
const player = mp.players.local;
let warnings = 0,
    clearWarningsTimer,
    hasCuff,
    admin;

class Green {
    constructor(d) {
        this.id = greenZones.length + 1;
        this.radius = d.radius;
        this.position = d.pos;

        this.createColshape();

        if (admin === 1) this.createBlip();
        greenZones.push(this);
    }

    createColshape() {
        const { x, y, z } = this.position;

        this.colshape = mp.colshapes.newSphere(x, y, z, this.radius);
        this.colshape.green = true;
    }

    removeColshape() {
        this.colshape.green = false;
    }

    createBlip() {
        const { x, y, z } = this.position;

        this.blip = mp.game.ui.addBlipForRadius(x, y, z, this.radius);
        mp.game.invoke('0xDF735600A4696DAF', this.blip, 5);
        mp.game.invoke('0x45FF974EEE1C8734', this.blip, 175);
        mp.game.invoke('0x03D7FB09E75D6B7E', this.blip, 2);
    }

    setRotation() {
        mp.game.invoke('0xF87683CDF73C3F6E', this.blip, 0);
    }
}

mp.events.add({
    'zonesCreate' : (adminLevel = 0) => {
        admin = adminLevel;

        greenZonesStatic.forEach(zone => {
            if (!zone) return;

            addZone(zone);
        });
    },

    'zoneCreate' : (greenZone) => {
        const zone = JSON.parse(greenZone);

        addZone(zone);
    },

    'removeZone' : (id) => {
        for (let i = 0; i < greenZones.length; i++) {
            if (!greenZones[i]) continue;

            if (greenZones[i].id == id) {
                
                greenZones[i].removeColshape()
                delete greenZones[i];
            }
            
        }
    },
    
    'playerWeaponShot' : (targetPosition, targetEntity) => {
        if (admin === 1) return;
        if (clearWarningsTimer) clearTimeout(clearWarningsTimer);
        greenZones.forEach(zone => {
            if (inShape(targetPosition, zone.position, zone.radius)) { 
                ++warnings;
                mp.game.graphics.notify(`${warnings}/3 Запрещено проявлять агрессию в зеленой зоне.`);

                if (warnings >= 3) {
                    mp.events.callRemote('shootInGreenZoneKick');
                } else {
                    player.freezePosition(true);
                    mp.gui.cursor.show(true, false);

                    setTimeout(() => {
                        player.freezePosition(false)
                        mp.gui.cursor.show(false, false);
                    }, 5000)            
                }
            }            
        });

        clearWarningsTimer = setTimeout(() => {
            warnings = 0;
        }, 120000)
    },

    'playerEnterColshape' : (shape) => {
        if (shape.green) {
            hasCuff = true;
            mp.game.graphics.notify('Вы зашли в ЗЗ'); 
        }
    },

    'playerExitColshape' : (shape) => {
        if (shape.green) {
            hasCuff = false;
            mp.game.graphics.notify('Вы покинули ЗЗ');
        }
    },

    'render' : () => {
        if (hasCuff && !(admin === 1)) {
            mp.game.controls.disableControlAction(2, 257, hasCuff); 
            mp.game.controls.disableControlAction(2, 263, hasCuff); 
            mp.game.controls.disableControlAction(2, 264, hasCuff);

            mp.game.controls.disableControlAction(2, 12, hasCuff); 
            mp.game.controls.disableControlAction(2, 13, hasCuff); 
            mp.game.controls.disableControlAction(2, 14, hasCuff); 
            mp.game.controls.disableControlAction(2, 15, hasCuff); 
            mp.game.controls.disableControlAction(2, 16, hasCuff); 
            mp.game.controls.disableControlAction(2, 37, hasCuff); 
            mp.game.controls.disableControlAction(2, 44, hasCuff); 
            mp.game.controls.disableControlAction(2, 24, hasCuff); 
            mp.game.controls.disableControlAction(2, 25, hasCuff); 
            mp.game.controls.disableControlAction(2, 140, hasCuff); 
            mp.game.controls.disableControlAction(2, 141, hasCuff); 
            mp.game.controls.disableControlAction(2, 142, hasCuff);            
        }

        if (greenZones.length > 0) {
            greenZones.forEach(zone => {
                zone.setRotation();
            })
        }
    }
})

function inShape(coord, shapeCoord, shapeRange) {
    const { x, y } = shapeCoord;

    const bX = x - shapeRange;
    const tX = x + shapeRange;

    const bY = y - shapeRange;
    const tY = y + shapeRange;

    if (bX <= coord.x && tX >= coord.x && bY <= coord.y && tY >= coord.y) { return true; } else { return false; }
}

function addZone(zone) {
    const { pos, radius} = zone;

    const model = {
        pos,
        radius: +radius
    }

    new Green(model)
}