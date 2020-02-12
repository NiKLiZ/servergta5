<template>
    <div class="sms" >
        <div class="newSms" v-if="showNewSms">
            <div class="title">
                <div class="back" @click="back">
                    <i class="fal fa-angle-left" ></i>
                </div>
                <h1>Сообщения</h1>
            </div>
            <div class="main" >
                <div class="padding">
                    <input placeholder="Номер телефона" type="number" v-model="numberSend">
                    <textarea placeholder="Сообщение" v-model="messageSend"></textarea>
                    <div class="but" @click="sendNewMessage">Отправить</div>
                </div>
            </div>
        </div>
        <div class="messages" v-if="!showNewSms && !dialog">
            <div class="title">
                <div class="back">
                    <i class="fal fa-angle-left" @click="back"></i>
                </div>
                <h1>Сообщения</h1>
                <div class="right" @click="openNewSMS">
                    <i class="iw send_msg" ></i>
                </div>
            </div>
            <div class="items" >
                <div class="padding">
                    <div class="item" v-for="(mesage,i) in dialogs" :key="i" @click="openDialog(mesage) ">
                        <div class="icon">
                            <i class="iw contact_avatar"></i>
                        </div>
                        <div class="right">
                            <div class="top">
                                <div class="name">{{getTextContact(mesage.number)}}</div>
                                <div class="time">{{mesage.time}}</div>
                            </div>
                            <div class="bottom">
                                <div class="discription">{{getLastText(mesage)}}</div>
                                <div class="arrow"><i class="fal fa-angle-right"></i></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="dialog" v-else-if="!showNewSms">
            <div class="title">
                <div class="back">
                    <i class="fal fa-angle-left" @click="back"></i>
                </div>
                <h1>{{getTextContact(dialog.number)}}</h1>
                <div class="right" >
                    <div class="gpsSend" @click="gpsSend"><i class="fas fa-map-marker-alt"></i></div>
                </div>
            </div>
            <div class="messages" ref="messages">
                <div class="message" v-for="(message,i) in dialog.messages" :key="i" :class="{'my-message':message.phone==phone}">
                    <div class="del" @click="delMessage(message)">
                        <i class="fal fa-times"></i>
                    </div>
                    <div v-if="message.textStreeet">
                        <div class="text">{{message.textStreeet}}</div>
                        <div class="time">
                            <div class="but" @click="setGPS(message)">Поставить метку <i class="fas fa-map-marker-alt"></i></div>
                            <div>{{getTime(message.time)}}</div>
                        </div>
                        
                    </div>
                    <div v-else>
                        <div class="text">{{message.text}}</div>
                        <div class="time">{{getTime(message.time)}}</div>
                    </div>
                </div>
            </div>
            <div class="textarea">
                <textarea placeholder="Напишите что-нибудь" v-model="messageText" v-on:keydown.enter="sendMessage" cols="30" rows="10" ></textarea>
                <div class="send" @click="sendMessage"><i class="iw gps"></i></div>
            </div>
        </div>
    </div>
</template>
<style src="../../../styles/phone/sms.scss" lang="scss"></style>

<script>


let sms = {
    data() {
        return {
            showNewSms: false,
            dialog: undefined,
            numberSend: '',
            messageSend: '',
            messageText: ''
        };
    },
    props: {
        'phone': Number,
        dialogs: Array,
        contacts: Array
    },
    beforeMount() {
        
    },
    components:{
    },
    created() {
        mp.on("PHONE::SEND_MESSAGE_CALLBACK",(number,messageInfo)=>{
            this.addSMS(number,messageInfo)
        })
        mp.on('PHONE::MESSAGE_CAME',(number,messageInfo)=>{
            if(this.dialog && number != this.dialog.number && !this.sleeping) mp.trigger('alert','Вам пришло сообщение от '+this.getTextContact(number))
        })
    },
    methods: {
        back(){
            if(this.showNewSms)return this.showNewSms = false;
            if(this.dialog)return this.dialog = undefined;
            this.$emit('back')
        },
        openDialog(mesage){
            this.dialog = mesage;
            this.$nextTick(function () {
                this.scrollBottom();
            })
        },
        openNewSMS(){
            this.showNewSms = true;
        },
        addSMS(number,messageInfo){
            let index;
            let dialog = this.dialogs.find((d,i)=>{
                 if(d.number.toString() == number.toString()){
                     index = i;
                     return true
                 };
            })
            if(!dialog){
                this.dialogs.push({
                    number: number,
                    messages: [messageInfo] 
                })
            }else{
                this.dialogs[index].messages.push(messageInfo)
            }
        },
        sendNewMessage(){
            let message = this.messageSend;
            let number = parseInt(this.numberSend);
            this.showNewSms = false;
            mp.trigger('CallRemote','PHONE::SEND_MESSAGE',number,message);
        },
        sendMessage(){
            let message = this.messageText;
            let number = parseInt(this.dialog.number);
            this.showNewSms = false;
            mp.trigger('CallRemote','PHONE::SEND_MESSAGE',number,message,(messageInfo)=>{
                this.messageText = '';
                this.addSMS(number,messageInfo)
                this.$nextTick(function () {
                    this.scrollBottom();
                })
            });
        },
        getTime(time){
            let date = new Date(time);
            return `${date.getHours()}:${date.getMinutes()}`
        },
        scrollBottom(){
            this.$refs.messages.scrollTo(0,this.$refs.messages.scrollHeight)
        },
        getTextContact(number){
            let contact = this.contacts.find((contact)=>{
                return contact.number == number
            })
            if(contact)return contact.name;
            else return number;
        },
        gpsSend(){
            let number = parseInt(this.dialog.number);
            mp.trigger("PHONE::GPS_SEND",number);
        },
        setGPS(message){
            mp.trigger("PHONE::SET_GPS",JSON.stringify(message.position));
        },
        delMessage(message){
             mp.trigger('CallRemote','PHONE::DEL_MESSAGE',this.dialog.number,message);
        },
        getLastText(mesage){
            let last = mesage.messages[mesage.messages.length-1];
            return last.text ? last.text : last.textStreeet;
        }
    },
  };

export default sms;
</script>