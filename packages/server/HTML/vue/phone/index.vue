<template>
    <div class="phone" v-if="isShow">
        <div class="main">
            <div class="container" :style="styleBackground">
                <div class="status" :style="'background-color:'+ statusBarColor">
                    <div class="left"><i class="iw network"></i>WESTRP</div>
                    <div class="center">{{time}}</div>
                    <div class="right">100%<i class="iw battery"></i></div>
                </div>
                <div class="app">
                    <keep-alive>
                        <component 
                        v-on:back="homeButton" 
                        v-on:sleeping="changeCleeping($event)" 
                        v-on:callStop="callStop" 
                        @open="open($event)" :is="app" 
                        v-bind:sleeping="apps.call.sleeping" 
                        v-bind:phone="phone" 
                        v-bind:contacts="apps.contacts.contacts" 
                        v-bind="apps[app]"
                         ></component>
                    </keep-alive>
                </div>
            </div>
            <div class="homeButton" @click="homeButton">

            </div>
        </div>
        <div class="background"></div>
    </div>
</template>
<style src="../../styles/phone/phone.scss" lang="scss"></style>

<script>

import homePage from './apps/homePage.vue';
import profile from './apps/profile.vue';
import sms from './apps/sms.vue';
import contacts from './apps/contacts.vue';
import gps from './apps/gps.vue';
import call from './apps/call.vue';
import browser from './apps/browser.vue';

export default {
    data() {
        return {
            isShow: false,
            app: 'homePage',
            statusBarColor: 'transparent',
            phone: 45045,
            time: '',
            background: 'img/phone/background.jpg',
            apps: {
                sms: {
                    dialogs: [{number:45,messages:[{text:5}]}]
                },
                contacts:{
                    contacts: [
                        
                    ]
                },
                gps:{
                    points: []
                },
                call:{
                    window: 'phone',
                    numberCalling: 45045,
                    placeholder: '',
                    playerId: -1,
                    calls: [{number:45045}],
                },
            }
        };
    },

    props: {
    },
    computed: {
        styleBackground: function(){
            let bgImg = this.background;
            if(!bgImg)return '';
            return {
                "background-image": 'url('+this.$root.cdn+bgImg+')',
            }
        },
    },
    methods: {
        defaultBackground(){
            this.background = 'img/phone/background.jpg';
        },
        homeButton(){
            this.app = 'homePage';
            this.statusBarColor = 'transparent';
            this.defaultBackground();
        },
        open(app){
            this.app = app.nameApp;
            if(app.nameApp == 'call' && this.apps.call.window != 'phone'){
                this.statusBarColor = 'transparent';
                this.defaultBackground();
            }else{
                this.statusBarColor = app.statusBarColor || 'transparent';
                this.background = app.background;
            }
        },
        hide(){
            this.show = false;
            mp.trigger("guitoggle", this.show);
        },
        show(){
            this.homeButton(); 
            this.isShow = true;
        },
        changeCleeping(toggle){
            this.apps.call.sleeping = toggle;
        },
        getTextContact(number){
            let contact = this.apps.contacts.contacts.find((contact)=>{
                return contact.number == number
            })
            if(contact)return contact.name;
            else return number;
        },
        callStart(number){
            this.apps.call.numberCalling = number;
            this.app = 'call';
            this.statusBarColor = 'transparent';
            this.defaultBackground();
        },
        callStop(){
             this.apps.call.window = 'phone';
             this.background = '';
        }
    },
    created(){
        window.phone = this;
        let timer = setInterval(updateTime, 1000); 
        updateTime(); 

        function updateTime() { 
            let cd = new Date(); 
            window.phone.time = zeroPadding(cd.getUTCHours()+3, 2) + ':' + zeroPadding(cd.getUTCMinutes(), 2);
        }; 

        function zeroPadding(num, digit) { 
            let zero = Array(digit).fill('0').join('');
            return (zero + num).slice(-digit); 
        }
        mp.on('PHONE::MESSAGE_CAME',(number,messageInfo)=>{
            let index;
            let dialog = this.apps.sms.dialogs.find((d,i)=>{
                 if(d.number.toString() == number.toString()){
                     index = i;
                     return true
                 };
            })
            if(!dialog){
                this.apps.sms.dialogs.push({
                    number: number,
                    messages: [messageInfo] 
                })
            }else{
                this.apps.sms.dialogs[index].messages.push(messageInfo)
            }
            if(this.app != 'sms')mp.trigger('alert','Вам пришло сообщение от '+this.getTextContact(number))
        }) 
        mp.on('PHONE::DEL_MESSAGE_SUCCESS',(number,message)=>{
            let index = this.apps.sms.dialogs.findIndex((d)=>{
                if(d.number == number)return true;
            })
            if(index == -1)return;
            let idx = this.apps.sms.dialogs[index].messages.findIndex((d)=>{
                if(d.time == message.time)return true;
            });
            if(idx != -1){
                this.apps.sms.dialogs[index].messages.splice(idx,1);
            }
        })
        mp.on('PHONE::CALLING',(number)=>{
            this.callStart(number);
            this.apps.call.window = 'CALLING';
        })
        mp.on('PHONE::CALL',(number,date)=>{
            if(!this.apps.call.sleeping){
                if(!this.isShow)mp.trigger('PHONE::TOGGLE')
            }else mp.trigger('alert','Вам звонит '+this.getTextContact(number))
            this.callStart(number);
            this.apps.call.window = 'CALL';
            this.apps.call.calls.push({
                number,
                date: date
            })
        })
        mp.on('PHONE::CALL_BUSY',(number)=>{
            this.callStart(number);
            this.apps.call.window = 'CALL_BUSY';
        })
        mp.on('PHONE::CALL_SIGNAL',(number,date)=>{
            this.callStart(number);
            this.apps.call.window = 'CALL_SIGNAL';
            this.apps.call.calls.push({
                number,
                date: date
            })
        })
        mp.on('PHONE::CALL_START',(number)=>{
            this.callStart(number);
            this.apps.call.window = 'CALLING';
        })
        mp.on('PHONE::CALL_STOP',(number)=>{
            this.callStop(number);
        })
        $("body").keyup(function(event){
            if(event.which == 27 && phone.isShow){
                phone.hide();
            }
        })
    },
    components:{
        homePage,
        profile,
        sms,
        contacts,
        gps,
        call,
        browser
    }   
  };

  // Well, hu, you have no module so just keep your component somewhere.
</script>