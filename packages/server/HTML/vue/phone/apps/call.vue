<template>
    <div class="call">
        <div v-if="window == 'CALL'">
            <div class="header">
                <div class="name">{{getTextContact(numberCalling)}}</div>
                <div class="number">{{numberCalling}}</div>
            </div>
            <div class="center"></div>
            <div class="buttons">
                <div class="but cancel" @click="complete">
                    <div class="main">
                        <div class="radius">
                            <i class="iw icon-phone"></i>
                        </div>
                    </div>
                    <div class="name">Завершить</div>
                </div>
                <div class="but access" @click="accept">
                    <div class="main">
                        <div class="radius">
                            <i class="iw icon-phone"></i>
                        </div>
                    </div>
                    <div class="name">Принять</div>
                </div>
            </div>
        </div>
        <div v-if="window == 'CALLING'" >
            <div class="header">
                <div class="name">{{getTextContact(numberCalling)}}</div>
                <div class="number">{{numberCalling}}</div>
            </div>
            <div class="center">{{getTime}}</div>
            <div class="buttons">
                <div class="but cancel center" @click="reject()">
                    <div class="main">
                        <div class="radius">
                            <i class="iw icon-phone"></i>
                        </div>
                    </div>
                    <div class="name" >Завершить</div>
                </div>
            </div>
        </div>
        <div v-if="window == 'CALL_BUSY'" >
            <div class="header">
                <div class="name">{{getTextContact(numberCalling)}}</div>
                <div class="number">{{numberCalling}}</div>
            </div>
            <div class="center">Абонент занят</div>
            <div class="buttons">
                <div class="but cancel center"  @click="complete()">
                    <div class="main">
                        <div class="radius">
                            <i class="iw icon-phone"></i>
                        </div>
                    </div>
                    <div class="name">Завершить</div>
                </div>
            </div>
        </div>
        <div v-if="window == 'CALL_SIGNAL'" >
            <div class="header">
                <div class="name">{{getTextContact(numberCalling)}}</div>
                <div class="number">{{numberCalling}}</div>
            </div>
            <div class="center">Вызов...</div>
            <div class="buttons">
                <div class="but cancel center" @click="complete()">
                    <div class="main">
                        <div class="radius">
                            <i class="iw icon-phone"></i>
                        </div>
                    </div>
                    <div class="name">Завершить</div>
                </div>
            </div>
        </div>
        <div v-if="window == 'phone'" class="contacts callApp">
            <div v-if="!isDealNumber">
                <div class="title">
                    <div class="back" @click="back">
                        <i class="fal fa-angle-left" ></i>
                    </div>
                    <h1>Вызовы</h1>
                </div>
                <div class="padding">
                    <div class="myPhone">
                        <div class="icon">
                            <i class="iw contact_avatar"></i>
                        </div>
                        <div class="right">
                            <h3>
                                Ваш номер
                            </h3>
                            <span>{{phone}}</span>
                        </div>
                    </div>
                </div>
                <div class="calls" >
                    <div class="name" v-for="(cal, key) in calls" :key="key" @click="call(cal.number)">
                        {{getTextContact(cal.number)}}<div class="right"></div>
                    </div>
                </div>
                <div class="buttons">
                    <div class="but access" @click="isDealNumber = true">
                        <div class="main">
                            <div class="radius">
                                <i class="iw icon-phone"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else>
                <div class="numberCall">
                    <input type="number" v-model="numberCall">
                </div>
                 <div class="buttons">
                     <div class="butNumber"  v-for="i in 9" :key="i" @click="numberCall += ''+i">
                        <div class="butCall" >
                            <div class="number" >
                                <span> {{i}}</span>
                            </div>
                        </div>
                     </div>
                     <div class="butNumber cancel" @click="isDealNumber = false">
                        <div class="butCall" >
                            <div class="number" >
                                <span> <i class="fal fa-times"></i></span>
                            </div>
                        </div>
                     </div>
                     <div class="butNumber" @click="numberCall += '0'">
                        <div class="butCall" >
                            <div class="number" >
                                <span> 0</span>
                            </div>
                        </div>
                     </div>
                    <div class="butNumber access" @click="call(numberCall)">
                        <div class="butCall" >
                            <div class="number" >
                                <span> <i class="iw icon-phone"></i></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
</template>
<style src="../../../styles/phone/call.scss" lang="scss"></style>

<script>


let call = {
    data() {
        return {
            number: 830575,
            time: 0,
            isDealNumber: false,
            numberCall: ''
        };
    },
    props: {
        'phone': Number,
        dialogs: Array,
        contacts: Array,
        window: {
            type:String,
            default: 'CALL',
        },
        placeholder: {
            type:String,
            default: '',
        },
        playerId: {
            type: Number,
            default: -1,
        },
        numberCalling: Number,
        calls: {
            type: Array,
            default: []
        }
    },
    computed:{
        getTime: function() {
            let date = new Date(this.time);
            return `${date.getUTCMinutes()}:${date.getSeconds()}`
        }
    },
    created() {
        setInterval(()=>{
            if(this.window == 'CALLING'){
                this.time += 1000;
            }
        },1000)
    },
    components:{
    },
    methods: {
        complete(){
            mp.trigger('CallRemote','PHONE::CALL_REJECT')
            this.$emit('callStop');
            if(this.window == 'CALL_BUSY'){
                // this.$emit('back');
            }
            
        },
        accept(){
            mp.trigger('CallRemote','PHONE::CALL_ACCEPT')
        },
        reject(){
            mp.trigger('CallRemote','PHONE::CALL_REJECT')
            this.time = 0;
        },
        call(number){
            mp.trigger('CallRemote','PHONE::CALL',number);
        },
        back(){
            this.$emit('back')
        },
        getTextContact(number){
            let contact = this.contacts.find((contact)=>{
                return contact.number == number
            })
            if(contact)return contact.name;
            else return 'Незвестный';
        }
    },
  };
  export default call;
  // Well, hu, you have no module so just keep your component somewhere.
</script>