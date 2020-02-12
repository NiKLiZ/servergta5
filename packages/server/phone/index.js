let modelPhone = require('../mongodb/phone').phone;
let MaxVoice = 20;
mp.events.add({
    "PHONE::TOGGLE":(player,toggle)=>{
        player.setVariable('phoneShow',toggle);
    },
    "PHONE::ADD_CONTACT":(player,name,number)=>{
        if(!player.phone)return player.alert('У вас нет телефона');
        player.phone.apps.contact.contacts.push({
            name,
            number
        });
        player.callBrowserPhone('PHONE::ADD_CONTACT_CALLBACK',name,number)
        player.alert(`Вы добивили ${name}`);
        if(!player.phone.$__.saving)player.phone.save().then(()=>{
        }).catch((e)=>{
            player.alert('Произошла ошибка')
            console.error(e);
        })
    },
    "PHONE::DEL_CONTACT":(player,contact)=>{
        if(!player.phone)return player.alert('У вас нет телефона');
        contact = JSON.parse(contact)
        player.phone.apps.contact.contacts.pull(contact)
        if(!player.phone.$__.saving)player.phone.save().then(()=>{
            player.alert(`Вы удалили контакт`);
            player.callBrowserPhone('PHONE::DEL_CONTACT_CALLBACK',JSON.stringify(contact))
        }).catch((e)=>{
            player.alert('Произошла ошибка')
            console.error(e);
        })
    },
    "PHONE::TOGGLE_SLEEPING":(player,toggle,callback)=>{
        if(!player.phone)return player.alert('У вас нет телефона');
        player.phone.apps.sms.sleeping = toggle;
        player.callBrowserPhone('PHONE::TOGGLE_SLEEPING_CALLBACK',toggle)
        player.alert(`Вы поставили ${ toggle ? 'Спящий режим' : 'Обычный режим' }`);
        if(!player.phone.$__.saving)player.phone.save().then(()=>{
        }).catch((e)=>{
            player.alert('Произошла ошибка')
            console.error(e);
        })
    },
    "PHONE::SEND_MESSAGE":(player,number,message)=>{
        if(!player.phone)return player.alert('У вас нет телефона');
        if(message.trim() == '')return player.alert('Вы ничего не написали')
        if(player.phone.number.toString() == number.toString())return player.alert('Нельзя написать самому себе')
        let pl = findPlayerNumberPhone(number);
        if(pl == player)return player.alert('Нельзя написать самому себе')
        let messageInfo = {
            text: message,
            phone: player.phone.number,
            time: Date.now()
        }
        if(pl){
            messageSend(player.phone,number,messageInfo,(err)=>{
                try{
                    if(err){
                        player.alert('Произошла ошибка')
                        console.error(err);
                        return
                    }
                    player.callBrowserPhone('PHONE::SEND_MESSAGE_CALLBACK',number,messageInfo)
                }catch(e){
                    console.log(e)
                }
            });
            messageSend(pl.phone,player.phone.number,messageInfo,(err)=>{
                if(err){
                    player.alert('Произошла ошибка')
                    console.error(err);
                    return
                }
                pl.callBrowserPhone('PHONE::MESSAGE_CAME',player.phone.number,messageInfo);
            });
        }else{
            modelPhone.findOne({number: number},(err,phone)=>{
                if(err){
                    player.alert('Произошла ошибка')
                    return console.error(err)
                }
                if(phone){
                    messageSend(phone,number,messageInfo,(err)=>{
                        if(err){
                            player.alert('Произошла ошибка')
                            console.error(e);
                            return
                        }
                    });
                    messageSend(player.phone,number,messageInfo,(err)=>{
                        if(err){
                            player.alert('Произошла ошибка')
                            console.error(e);
                            return
                        }
                        player.alert(`Вы отправили сообщение на номер ${number}`);
                        player.callBrowserPhone('PHONE::SEND_MESSAGE_CALLBACK',number,JSON.stringify(messageInfo))
                    });
                }else{
                    player.alert('Телефон не найден')
                }
            })
        }
    },
    "PHONE::CALL":(player,number)=>{
        if(!player.phone)return player.alert('У вас нет телефона');
        let pl = findPlayerNumberPhone(number);
        if(!pl)return player.alert('Номер не найден');
        if(pl == player)return player.alert('Нельзя позвонить самому себе');
        if(pl.caller)return pl.callBrowserPhone("PHONE::CALL_BUSY",number);
        let date = Date.now();
        player.callBrowserPhone("PHONE::CALL_SIGNAL",number,date);
        pl.callBrowserPhone("PHONE::CALL",player.phone.number,date);
        player.caller = pl;
        pl.caller = player;
        player.phone.apps.call.calls.push({
            number,
            date: date
        });
        if(!player.phone.$__.saving)player.phone.save().catch((e)=>{
            player.alert('Произошла ошибка')
            console.error(e);
        })
        pl.phone.apps.call.calls.push({
            number: player.phone.number,
            date: date
        });
        if(!pl.phone.$__.saving)pl.phone.save().catch((e)=>{
            pl.alert('Произошла ошибка')
            console.error(e);
        })
        
    },
    "PHONE::CALL_ACCEPT":(player)=>{
        if(!player.phone)return player.alert('У вас нет телефона');
        if(player.caller){
            player.enableVoiceTo(player.caller);
            player.caller.enableVoiceTo(player);
            player.caller.callBrowserPhone('PHONE::CALL_START',player.phone.number);
            player.callBrowserPhone('PHONE::CALL_START', player.caller.phone.number);
            player.call('PHONE::SET_CALLER',[player.caller])
            player.caller.call('PHONE::SET_CALLER',[player])
            player.call('PHONE::CALL_ACCEPT')
            player.caller.call('PHONE::CALL_ACCEPT')
        }
    },
    "PHONE::CALL_REJECT":(player)=>{
        if(!player.phone)return player.alert('У вас нет телефона');
        if(player.caller){
            if(player.dist(player.caller.position) > MaxVoice){
                player.disableVoiceTo(player.caller);
                player.caller.disableVoiceTo(player);
            }
            player.caller.callBrowserPhone('PHONE::CALL_STOP')
            player.callBrowserPhone('PHONE::CALL_STOP')
            player.caller.alert('Звонок завершен')
            player.call('PHONE::CALL_REJECT')
            player.caller.call('PHONE::CALL_REJECT')
            player.call('PHONE::SET_CALLER',[undefined])
            player.caller.call('PHONE::SET_CALLER',[undefined])
            player.caller.caller = undefined;
            player.caller = undefined;
        }
    },
    "PHONE::DEL_MESSAGE":(player,number,message)=>{
        if(!player.phone)return player.alert('У вас нет телефона');
        let index = player.phone.apps.sms.dialogs.findIndex((d)=>{
            if(d.number == number)return true;
        })
        if(index == -1)return;
        let idx = player.phone.apps.sms.dialogs[index].messages.findIndex((d)=>{
            if(d.time == message.time)return true;
        });
        if(idx == -1)return;
        player.phone.apps.sms.dialogs[index].messages.splice(idx,1);
        player.phone.markModified('apps.sms.dialogs');
        if(!player.phone.$__.saving)player.phone.save().catch((err)=>{
            player.alert('Произошла ошибка')
            console.error(err);
        })
        player.callBrowserPhone("PHONE::DEL_MESSAGE_SUCCESS",number,message);
    }
})
mp.events.add({
    "PHONE::HOME_GPS":(player)=>{
        let homes = mp.homes.filter((home)=>{
            if(home.owner && home.owner.toString() === player._id.toString())return true;
        })
        if(!homes.length)return player.alert('У вас нет дома')
        player.alert('Маркер установлен')
        player.setNewWaypoint(homes[0].pos);
    },
    "playerQuit":(player)=>{
        if(player.loggined != true) return;
        if(player.caller){

        }
    },
    "PHONE::GPS_SEND":(player,number,textStreeet)=>{
        if(!player.phone)return player.alert('У вас нет телефона');
        if(player.phone.number.toString() == number.toString())return player.alert('Нельзя написать самому себе')
        let pl = findPlayerNumberPhone(number);
        if(pl == player)return player.alert('Нельзя написать самому себе')
        let messageInfo = {
            textStreeet: textStreeet,
            phone: player.phone.number,
            time: Date.now(),
            position: player.position
        }
        if(pl){
            messageSend(player.phone,number,messageInfo,(err)=>{
                try{
                    if(err){
                        player.alert('Произошла ошибка')
                        console.error(err);
                        return
                    }
                    player.callBrowserPhone('PHONE::MESSAGE_CAME',player.phone.number,messageInfo);
                }catch(e){
                    console.log(e)
                }
            });
            messageSend(pl.phone,player.phone.number,messageInfo,(err)=>{
                if(err){
                    player.alert('Произошла ошибка')
                    console.error(err);
                    return
                }
                pl.callBrowserPhone('PHONE::MESSAGE_CAME',player.phone.number,messageInfo);
            });
        }else{
            modelPhone.findOne({number: number},(err,phone)=>{
                if(err){
                    player.alert('Произошла ошибка')
                    return console.error(err)
                }
                if(phone){
                    messageSend(phone,number,messageInfo,(err)=>{
                        if(err){
                            player.alert('Произошла ошибка')
                            console.error(e);
                            return
                        }
                    });
                    messageSend(player.phone,number,messageInfo,(err)=>{
                        if(err){
                            player.alert('Произошла ошибка')
                            console.error(e);
                            return
                        }
                        player.alert(`Вы отправили сообщение на номер ${number}`);
                        player.callBrowserPhone('PHONE::MESSAGE_CAME',player.phone.number,messageInfo);
                    });
                }else{
                    player.alert('Телефон не найден')
                }
            })
        }
    }
})
let findPlayerNumberPhone = (number)=>{
    let players = mp.players.toArray();
    let player = players.find((pl)=>{
        if(pl.phone && pl.phone.number.toString() == number.toString()){
            return true;
        }
    })
    return player;
}
let messageSend = (phone,number,messageInfo,callback)=>{
    let index;
    let dialogs = phone.apps.sms.dialogs.filter((dialog,i)=>{
        if(dialog.number.toString() == number.toString()){
            index = i
            return true;
        }
    })
    if(!dialogs.length){
        let dialog = {
            number: number,
            messages: [messageInfo]
        }
        phone.apps.sms.dialogs.push(dialog)

    }else{
        phone.apps.sms.dialogs[index].messages.push(messageInfo)
        phone.markModified(`apps.sms.dialogs`);
    }
    if(!phone.$__.saving) phone.save((err)=>{
    });
    callback()
}
