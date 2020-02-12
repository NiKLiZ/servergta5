<template>
    <div v-if="hasShow">
        <div id="chat" class="ui_element">
            <ul id="chat_messages" :class="{'active': showInput}" ref="container">
                <li v-for="(chat,i) in  chatText" :key="i" v-html="getTextChat(chat)"></li>
            </ul>
            <div class="inputs">
                <input v-if="showInput" id="chat_msg" type="text" spellcheck="true" ref="input" v-model="textInput" @keydown.tab="nextMode($event)"  @keydown.enter="chatEnter" />
            </div>
            <div class="buttons" v-if="showInput">
                <div class="but" v-for="(chat,i) in chats" :key="i" :class="{'active': i == mode}" @click="changeType(i)">{{chat}}</div>
            </div>
        </div>
    </div>
</template>
<style lang="scss" src="../../styles/chat.scss"></style>

<script>

let keyE_down = false;
let keyG_down = false;
export default {
    data() {
        return {
            chats: ['RP','NONRP','РАЦИЯ','ME'],
            mode: 0,
            indexHistory: 0,
            history: [],
            chatText: [],
            showInput: false,
            size: 0,
            timeOutChatFade: null,
            toggle: false,
            textInput: '',
            active: false,
            hasShow: true,
            friends: [],
            
        }
    },
    methods: {
        getTextChat(textInfo){
            let text = textInfo.text
            let names = text.match(/%playerName\[(.+?)\]?%/gi);
            if(names !== null){
                for (let i = 0; i < names.length; i++) {
                    const name = names[i];
                    let replaceName = name.match(/%playerName\[(.+?)\]?%/)[1];
                    let nameText = this.friends.indexOf(replaceName) == -1 ?  'Гражданин' : replaceName;
                    text = text.replace(name,nameText)
                }
            }
            return text;
        },
        addFriend(name){
            this.friends.push(name);
        },
        nextMode(event){
            if(this.mode != this.chats.length-1)this.mode++;
            else this.mode = 0;
            this.$refs.input.focus();
            event.preventDefault();
        },
        changeType(chat){
            this.mode = chat;
            this.$refs.input.focus();
        },
        startTimeOut(){
            this.timeOutChatFade = setTimeout(()=>{
                $('#chat').fadeTo(500, 0.4);
            },60000)
        },
        push(text,type,name,id){
            this.chatText.unshift({
                text,
                type,
                name,
                id
            })
            this.size++;
            if(this.size > 50){
                chat.chatText.splice(0,1);
            }
            $('#chat').fadeTo(500, 1);
            if(this.timeOutChatFade)clearTimeout(this.timeOutChatFade)
            this.startTimeOut();
        },
        clear(){
            this.chatText = [];
        },
        activate(toggle){
            if (toggle == false)
                this.enableChatInput(false);
                
            this.active = toggle;
        },
        
        show(toggle){
            this.hasShow = toggle;
            this.active = toggle;
        },
        enableChatInput(toggle){
            this.indexHistory = this.history.length;
            if(this.active == false
                && toggle == true)
                return;
                if(toggle != this.showInput)mp.invoke("focus", toggle);
                this.showInput = toggle;
                mp.trigger("changeState",toggle);
                if (toggle){
                    $('#chat').fadeTo(500, 1);
                    this.$nextTick(function () {
                        this.$refs.input.focus();
                    });
                    if(this.timeOutChatFade)clearTimeout(this.timeOutChatFade)
                } 
                else{
                    let chat = this;
                    $(this.$refs.input).fadeOut('fast', function(){
                        chat.textInput = "";
                        chat.$refs.container.scrollTop = 0;
                        chat.startTimeOut();
                    });
                }
        },
        chatEnter(){
            let value = this.textInput;
            this.textInput = "";
            if (value.length > 0) {
                this.history.push(value)
                if (value[0] == "/"){
                    value = value.substr(1);
                    if (value.length > 0)
                        mp.invoke("command", value);
                }
                else{
                    if(this.chats[this.mode] == 'RP')mp.invoke("chatMessage", value);
                    else if(this.chats[this.mode] == 'NONRP')mp.invoke("command", "b "+value);
                    else if(this.chats[this.mode] == 'РАЦИЯ')mp.invoke("command", "f "+value);
                    else if(this.chats[this.mode] == 'ME')mp.invoke("command", "me "+value);
                }
            }
            this.enableChatInput(false);
        }
    },
    created(){
        window.chatAPI = this;
        let chat = this;
        

        $("body").keydown(function(event){
	    	if( event.which == 69  && chat.showInput === false && keyE_down == false){
	    		mp.trigger("DownE");
	    		keyE_down = true;
	    	} 
	    	if( event.which == 71  && chat.showInput === false && keyG_down == false){
	    		mp.trigger("DownG");
	    		keyG_down = true;
	    	}
        })
        $("body").keyup(function(event){
            if( event.which == 69  && chat.showInput === false) {
                mp.trigger("PressE");
                keyE_down = !keyE_down;
            }
            if( event.which == 71  && chat.showInput === false) {
                mp.trigger("PressG");
                keyG_down = !keyG_down;
            }
            if (event.which == 84 && chat.active == true && !chat.showInput){
                chat.enableChatInput(true);
                event.preventDefault();
            } 
            else if (event.which == 13 && chat.showInput){
                chat.enableChatInput(false);
            }
            else if (event.which == 38 && chat.showInput ){
                if(chat.indexHistory != 0)chat.indexHistory--;
                else chat.indexHistory = chat.history.length;
                chat.textInput = chat.history[chat.indexHistory];
            }
            else if (event.which == 40 && chat.showInput ){
                if(chat.indexHistory != chat.history.length)chat.indexHistory++;
                else chat.indexHistory = 0;
                chat.textInput = chat.history[chat.indexHistory];
            }else if(event.which == 27 && chat.showInput){
                chat.enableChatInput(false);
            }
        });
    }
}
</script>
