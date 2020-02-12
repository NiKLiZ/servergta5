const moment = require('moment');
let jobs = {
    bus: {
        pos: new mp.Vector3(435.5993957519531,-644.4629516601562,27.7366943359375),
    },
    collector: {
        pos: new mp.Vector3(254.88055419921875,211.56300354003906,105.28683471679688),
    },
    evacuator: {
        pos:  new mp.Vector3(409.539794921875,-1623.2257080078125,28.291940689086914),
    },
    farm: {
        pos: new mp.Vector3(2016.5711669921875,4987.4697265625,41.10325241088867),
    },
    garbage: {
        pos: new mp.Vector3(960.0184936523438,-2449.107177734375,30.2315616607666),
    },
    pizzeria: {
        pos: new mp.Vector3(90.81661987304688,298.2567138671875,109.21023559570312),
    },
    taxi: {
        pos: new mp.Vector3(895.3720092773438,-179.44007873535156,73.7052993774414),
    },
}
mp.events.push({
    "MAYORALTY::LICENSES":(player,name)=>{
        if(name == 'deliveryPassengers'){
            if(player.testLicense('deliveryPassengers'))return player.alert('У вас уже есть лицензия')
            if(!player.editMoney(-50,'Лицензия '))return player.alert('У вас не хватает 50$');
            let date = moment().add(2, 'months');
            player.mongoUser.licenses.deliveryPassengers.is = true;
            player.mongoUser.licenses.deliveryPassengers.date = date.valueOf();
            if(!player.mongoUser.$__.saving)player.mongoUser.save().catch((e)=>{
                player.alert('Произошла ошибка')
                console.error(e);
            })
            player.alert(`Вы купили лицензию. Она будет действительна до ${date.format('DD.MM.YYYY HH:mm:ss')}`);
        }
        if(name == 'fishing'){
            player.alert('Пока нельзя оформить')
        }
    },
    "MAYORALTY::REGISTRATION":(player)=>{
        if(player.testLicense('registration',false))return player.alert('У вас уже есть прописка в штате')
        if(!player.editMoney(-5,'Прописка в штате'))return player.alert('У вас не хватает 50$');
        player.mongoUser.licenses.registration.is = true;
        if(!player.mongoUser.$__.saving)player.mongoUser.save().catch((e)=>{
            player.alert('Произошла ошибка')
            console.error(e);
        })
        player.alert(`Вы купили прописку в штате.`);
    },
    "MAYORALTY::BENEFIT":(player)=>{
        let cards = mp.cards.atPlayer(player);
        if(!cards.length)return player.alert('У вас нет не одной банковской карты')
        if(player.mongoUser.benefit)return player.alert('Вы уже оформили пособие');
        player.mongoUser.benefit = true; 
        if(!player.mongoUser.$__.saving)player.mongoUser.save().catch((e)=>{
            player.alert('Произошла ошибка')
            console.error(e);
        })
        player.alert('Вы получили пособие. Вам будет его начислять пока вы не наиграете больше 9 часов',0,5000)
    },
    "MAYORALTY::JOB":(player,job)=>{
        if(player.fraction)return player.alert('Вы не можете работать так как вы состоите во фракции '+player.fraction.name)
        if(job == 'bus' || job == 'taxi' || job == 'garbage' || job == 'evacuator' || job == 'evacuator' || job == 'pizzeria' || job == 'collector'){
            if(!player.testRightDrive())return;
        }
        if(job == 'taxi' && !player.testLicense('deliveryPassengers'))
                return player.alert('Для работы нужна лицензия таксиста, получите её в мэрии')
        let jobConf = jobs[job];
        if(!jobConf)return player.alert('Ошибка метка не найдена',1)
        player.setNewWaypoint(jobConf.pos);
        player.alert('Метка на работу выставлена')
    },
})