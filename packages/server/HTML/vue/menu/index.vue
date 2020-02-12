<template>
    <div class="menu" v-if="show">
        <div class="toolbar">
            <div class="icons">
                    <div class="icon user" :class="{active: menu == 'user'}" @click="menu = 'user'"><div class="iw user-silhouette" alt=""></div></div>
                    <div class="icon inventoryIcon" :class="{active: menu == 'inventory'}" @click="menu = 'inventory'"><div class="iw tr" alt=""></div></div>
                    <div class="icon question" :class="{active: menu == 'question'}" @click="menu = 'question'"><div class="iw info" alt=""></div></div>
                    <div class="icon job" :class="{active: menu == 'job'}" @click="menu = 'job'"><div class="iw backpack" alt=""></div></div>
                    <div class="icon donateIcon" :class="{active: menu == 'donate'}" @click="menu = 'donate'"><div class="iw wallettool" alt=""></div></div>
                </div>
        </div>
        <div class="windows">
            <div class="window user active" v-if="menu == 'user'">
                <div class="three">
                <div class="title-top">Статистика</div>
                <div class="content">
                        <div class="info">
                            <p>
                                Пол: {{gender == 0 ? 'Мужчина' : 'Женщина'}} <br>
                                Деньги: {{money}}$ <br> 
                                Номер телефона: {{phone ? phone : 'отсутствует' }}<br>
                                Деньги в банке: {{bankMoney? bankMoney+'$' : 'отсутствуют'}}<br>
                                Работа: отсутствует <br>
                                Организация: {{fraction || 'отсутствует'}} <br> 
                                Уровень розыска: {{stars}}  <br>
                                Законопослушность: {{lawAbidance}}/100 <br>
                                Имя: {{name}} <br>
                                Фамилия: {{surname}} <br>
                                Уровень: {{level}} <br>
                                Предупреждения: {{warn}} <br>
                                Наркозависимость: {{addiction}}<br>
                                Банковская карта: {{banCard || 'отсутствует'}}<br>
                                Статус: {{permision != null && permision != 'default' ? permision : 'отсутствует'}}<br>
                            </p>
                        </div>
                    </div>
                </div>
                <div class="three">
                <div class="title-top center">Транзакции</div>
                    <div class="content">
                        <div class="transactions">
                            <div class="items">
                                    <div class="item" v-for="(transaction,index) in transactionsReverse" :key="index">
                                        <h1><div class="title">{{transaction.title}}</div></h1>
                                        <div class="money " :class="transaction.money > 0 ? 'plusmoney' : 'minusmoney'">{{transaction.money}}$</div>
                                    </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="three">
                    <div class="title-top right">Персонаж</div>
                    <div class="content">

                    </div>
                </div>
            </div>
            <div class="window " v-show="menu == 'inventory'">
                
            </div>
            <div class="window job" v-if="menu == 'job'">
                
            </div>
            <div class="window question" v-if="menu == 'question'">
                <div class="two">
                <div class="title-top">Помощь по игре</div>
                    <div class="content">
                    <div class="items">
                        <div v-for="(question,i) in questions" :key="i" :class="{active: i == questionActive}" @click="questionActive = i" class="item">
                            <span>{{question.title}}</span>
                        </div>
                    </div>
                    </div>
            </div>
            <div class="two">
                <div class="title-top"> </div>
                <div class="content">
                    <div v-html="ContextQuestion"></div> 
                </div>
            </div>
        </div>
            <div class="window donateItem"  v-if="menu == 'donate'">
                
            </div>
        </div>
    </div>
</template>
<style src="../../styles/menu.scss" scoped></style>

<script>
export default {
    data() {
        return {
            name: 'Belong',
            surname: 'Merano',
            level: 0,
            money: 25,
            show: false,
            rightInventory: [],
            mainInventory: [{title:'Мой инвентарь',name:'mainInventory'}],
            selectRight: 0,
            selectMain: 0,
            maxRightItems: 20,
            maxLeftItems: 30,
            transactions: [],
            lawAbidance: 0,
            menu: 'user',
            questions: [],
            questionActive: -1,
            warn: 0,
            addiction: 0,
            banCard: null,
            stars: 0,
            fraction: null,
            bankMoney: null,
            items:[],
            phone: null,
        };
    },
    methods: {
        togleMenu(){
            this.show = !this.show;
            $('.interactive_slot').hide();
            closemenuv();
        },
        addtransaction(info,money){
            this.transactions.push(info);
            this.money = money;
        },
        startMenu(tips){
            this.questions = tips;
        },
        setInfo(info){
            Object.assign(this,info)
        },
        editItem(id,item){
            this.$set(this.items, id, item)
        },
        addRightInventory(name,title){
            this.rightInventory.push({name:name,title:title})
        },
        removeRightInventory(name){
            for(let i=0;i<this.rightInventory.length;i++){
                if(this.rightInventory[i].name == name)
                    this.rightInventory.splice(i, 1);
            }
            if(!this.rightInventory.length) this.selectMain = 0;
        },
        addMainInventory(name,title){
            this.mainInventory.push({name:name,title:title})
        },
        removeMainInventory(name){
            for(let i=0;i<this.rightInventory.length;i++){
                if(this.rightInventory[i].name == name)
                    this.mainInventory.splice(i, 1);
            }
            if(!this.rightInventory.length) this.selectRight = 0;
        },
        trigger(...args){
            mp.trigger(...args)
        },
        getNameItem(item){
            return item.count != false ? item.count : item.name ? item.name : '' 
        }
    },
    computed: {
        transactionsReverse(){
            return this.transactions.reverse();
        },
        ContextQuestion(){
            if(this.questionActive == -1) return '';
            return this.questions[this.questionActive].text.replace(/(<img.{1,}src="\/)(.{1,})(".{1,}>)/gm,'$1https:/westrp.ru/$2$3');
        }
    },
    created(){
        window.menu = this;
    },
};
</script>