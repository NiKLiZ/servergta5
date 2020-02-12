<template>
    <div class="contacts" >
        <div class="title">
            <div class="back" @click="back">
                <i class="fal fa-angle-left" ></i>
            </div>
            <h1>Контакты</h1>
            <div class="right" >
                <i class="fal fa-plus" v-if="!showNewContact" @click="openNewContacts"></i>
                <i class="fal fa-times exit" v-else @click="showNewContact = false"></i>
            </div>
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
        <div class="contacts" >
            <div class="character" v-for="char in filteredCharacter"  :key="char">
                <div class="contact">
                    <div class="padding">
                        {{char}}
                    </div>
                    <div class="name" v-for="(contact, key) in filteredContacts[char]" :key="key" @click="contact.callRemote ? callDefault(contact.callRemote) : call(contact.number)">
                        {{contact.name}}<div class="right" v-if="!contact.callRemote"><i class="fal fa-times" @click="delContact(contact)"></i></div>
                    </div>
                </div>
            </div>
        </div>
        <div class="newContacts" v-if="showNewContact">
            <div class="padding">
                <h1 >Новый контакт</h1>
                <input type="text" placeholder="Имя" v-model="name">
                <input type="number" placeholder="Номер" v-model="number">
                <div class="but" @click="addContact">Добавить</div>
            </div>
        </div>
    </div>
</template>
<style src="../../../styles/phone/contacts.scss" lang="scss"></style>

<script>


export default {
    data() {
        const character = ['#',"А","Б","В","Г","Д","Е","Ж","З","И","Й","К","Л","М","Н","О","П","Р","С","Т","У","Ф","Х","Ц","Ч","Ш","Щ","Ъ","Ы","Ь","Э","Ю","Я" ,'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
        return {
            character,
            showNewContact: false,
            filter: '',
        };
    },
    props: {
        'phone': Number,
        contacts: Array
    },
    created(){
        mp.on("PHONE::ADD_CONTACT_CALLBACK",(name,number)=>{
            this.contacts.push({
                name:name+"",
                number
            })
        })
        mp.on("PHONE::DEL_CONTACT_CALLBACK",(contact)=>{
            let idx = this.contacts.findIndex((cont)=>{
                if(contact.name == cont.name && contact.number == cont.number)return true;
            });
            if(idx != -1)this.contacts.splice(idx,1)
        })
    },
    computed: {
        filteredContacts: function () {
            try{
                const vm = this
                const result = {}
                const filter = this.filter.length > 0 ? this.filter.toLowerCase() : false
                let contacts = this.contacts;
                
                contacts.forEach(function (c) {
                    if (filter) {
                        if (c.name.toLowerCase().indexOf(filter) === -1 && (!c.remark || c.remark.toLowerCase().indexOf(filter) === -1)) {
                            return
                        }
                    }
                    const char = ""+c.name[0].toUpperCase();
                    if (vm.character.indexOf(char) > -1) {
                        if (!result[char]) {
                            result[char] = []
                        }
                        result[char].push(c)
                    } else {
                        if (!result['#']) {
                            result['#'] = []
                        }
                        result['#'].push(c)
                    }
                })
                return result
            }catch(e){
                console.log(e)
            }
        },
        filteredCharacter(){
            if(!this.filteredContacts) return [];
            return this.character.filter((char)=>{
                if(this.filteredContacts[char])return true;
            })
        }
    },
    components:{
    },
    methods: {
        back(){
            if(this.showNewContact)return this.showNewContact = false;
            this.$emit('back')
        },
        openNewContacts(){
            this.showNewContact = true;
        },
        addContact(){
            let name = this.name;
            let number = parseInt(this.number);
            this.showNewContact = false;
            mp.trigger('CallRemote','PHONE::ADD_CONTACT',name,number);
        },
        delContact(contact){
            mp.trigger('CallRemote','PHONE::DEL_CONTACT',JSON.stringify(contact));
        },
        call(number){
            mp.trigger('CallRemote','PHONE::CALL',number);
        },
        callDefault(call){
            mp.trigger('CallRemote',call);

        }
    },
  };
  // Well, hu, you have no module so just keep your component somewhere.
</script>