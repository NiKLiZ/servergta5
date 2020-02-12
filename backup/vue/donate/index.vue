<template>
    <div class="donate" v-if="show">
        <img class="character" :class="getCharacter()" :src="`''${getCharacter()}'.png'  `"/>
        <div class="overlay" v-if="overlay == 'warn'">
            <div class="content">
                <div class="exit" @click="overlay = ''"><i class="fal fa-times"></i></div>
                <h1>Вы действительно хотите <br>снять варн?</h1>
                 <div class="coin">
                    <span>{{coins}}</span>
                    <img :src="`img/donate/coin.png`" alt="">
                </div>
                <div class="buttons">
                    <div class="but"><div class="bgcActive"></div>Да</div>
                    <div class="but" @click="overlay = ''"><div class="bgcActive"></div>Нет</div>
                </div>
            </div>
            <div class="alert">Ошибка! Вы ввели недопустимый никнейм</div>
        </div>
        <div class="content">
            <div class="toolbar">
                <div class="left">
                    <!-- <div class="coin">
                        <span>{{coins}}</span>
                        <img :src="`img/donate/coin.png`" alt="">

                    </div>
                    <div class="money">
                        {{textMoney}} $
                    </div> -->
                </div>
                <div class="center">
                    <!-- <div class="item" :class="{active: tab == 'replenish'}" @click="tab = 'replenish'">
                        <span>Пополнить</span>
                    </div>
                    <div class="item premium" :class="{active: tab == 'premium'}" @click="tab = 'premium'">
                        <img :src="`img/donate/flash.png`" alt="">
                        <span>Премиум</span>
                    </div>
                    <div class="item" :class="{active: tab == 'amenities'}" @click="tab = 'amenities'">
                        <span>Услуги</span>
                    </div> -->
                    <div class="item" :class="{active: tab == 'referral'}" @click="tab = 'referral'">
                        <span>Реферал</span>
                    </div>
                </div>
                <!-- <div class="right">
                    <div v-if="premium == null" >Премиум не активен</div>
                    <div v-else class="premium active">
                        <img :src="`img/donate/flash.png`" alt="">
                        <span>Премиум: {{premium}} день</span>
                    </div>
                </div> -->
            </div>
            <div class="tabs">          
                <div class="tab replenish" v-if="tab == 'replenish'">
                    <div class="items">
                        <div class="item" :class="{'bigCoin':item.background}" v-for="(item,i) in itemsReplenish" :key="i" >
                            <div class="bgcActive"></div>
                            <div class="coins">
                                 <img :src="`''${item.coinsIcon}`" alt="" >
                            </div>
                            <div class="info">
                                <div class="bottom">
                                    <div class="coin">
                                         <span>{{item.coins}}</span>
                                        <img :src="`img/donate/coin.png`" alt="">
                                    </div>
                                    <div class="bonus" :style="`opacity: ${!item.bonus ? 0 : 100}`">{{item.bonus || '324234'}}</div>
                                    <div class="name">{{item.name}}</div>
                                    <div class="placeholder">{{item.placeholder}}</div>
                                    <div class="buy">
                                        <div class="price">{{item.price}} ₽</div>
                                        <div class="point">
                                            <img :src="`img/donate/point.png`" alt="">
                                            <span>Купить</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="interaction replenish">
                        <div class="block">
                            <span>Пополнить счет на любую сумму:</span>
                            <div class="elements replenish">
                                <input type="number" v-model.number="replenishInput">
                                <div class="but">Пополнить</div>
                            </div>
                        </div>
                        <div class="block exchange">
                            <span>Обмен валюты:</span>
                            <div class="elements exchange">
                                <input type="number" class="yellow"   :value="exchangeCoinInput" @input="setExchangeCoinInput($event)">
                                <span class="equally">=</span>
                                <input type="number" class="green "  :value="exchangeMoneyInput" @input="setExchangeMoneyInput($event)">
                                <div class="but">Обменять</div>
                            </div>   
                        </div>
                        <span class="transactions">История пополнений</span>
                    </div>
                </div>
                <div class="tab premium" v-if="tab == 'premium'">
                    <div class="items">
                        <div class="item" v-for="(item,i) in itemsPremium" :key="i" >
                            <div class="bgcActive"></div>
                            <div class="coins">
                                 <img :src="`''${item.coinsIcon}`" alt="" >
                            </div>
                            <div class="info">
                                <div class="bottom">
                                    <div class="days" >{{item.days}} дней</div>
                                    <div class="name">{{item.name}}</div>
                                    <div class="placeholder">{{item.placeholder}}</div>
                                    <div class="buy">
                                        <div class="price">
                                            <div class="coin">
                                                <span>{{item.coins}}</span>
                                                <img :src="`img/donate/coin.png`" alt="">
                                            </div>
                                        </div>
                                        <div class="point">
                                            <img :src="`img/donate/point.png`" alt="">
                                            <span>Купить</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="advantages">
                            <div class="items">
                                <h1>Преимущества</h1>
                                <div class="advantage" v-for="(item, i) in advantagePremium" :key="i">
                                    <div class="">
                                        <div class="icon"><img :src="`img/donate/check.png`" alt=""></div>
                                        <span v-html="item"></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="times">
                        <h1>Ваш текущий премиум:</h1>
                        <div class="premium">

                            <div class="premium clock">
                                <div class="time">
                                    <div class="number">
                                        00
                                    </div>
                                    <div class="name">
                                        День
                                    </div>
                                </div>
                                <div class="time">
                                    <div class="number">
                                        00
                                    </div>
                                    <div class="name">
                                        Часов
                                    </div>
                                </div>
                                <div class="time">
                                    <div class="number">
                                        00
                                    </div>
                                    <div class="name">
                                        Минут
                                    </div>
                                </div>
                                <div class="time">
                                    <div class="number">
                                        00
                                    </div>
                                    <div class="name">
                                        Секунд
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="bonus clock">
                            <div class="button">
                                Забрать набор бандита
                            </div>
                            <div class="time">
                                <div class="number">
                                    00
                                </div>
                                <div class="name">
                                    Часов
                                </div>
                            </div>
                            <div class="time active">
                                <div class="number">
                                    00
                                </div>
                                <div class="name">
                                    Минут
                                </div>
                            </div>
                            <div class="time">
                                <div class="number">
                                    00
                                </div>
                                <div class="name">
                                    Секунд
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="tab amenities" v-if="tab == 'amenities'">
                    <div class="items">
                        <div class="item" v-for="(item,i) in amenitieItems" :key="i" >
                            <div class="bgcActive"></div>
                            <div class="coins">
                                 <img :src="`''${item.coinsIcon}`" alt="" >
                            </div>
                            <div class="info">
                                <div class="bottom">
                                    <div class="name">{{item.name}}</div>
                                    <div class="amenitiesText" >Услуга</div>
                                    <div class="placeholder">{{item.placeholder}}</div>
                                    <div class="buy">
                                        <div class="price">
                                            <div class="coin">
                                                <span>{{item.coins}}</span>
                                                <img :src="`img/donate/coin.png`" alt="">
                                            </div>
                                        </div>
                                        <div class="point">
                                            <img :src="`img/donate/point.png`" alt="">
                                            <span>Купить</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="vertically">
                            <div class="item" v-for="(item,i) in amenitieVerticallyItems" :key="i" @click="overlay = item.overlay">
                                <div class="bgcActive"></div>
                                <div class="coins">
                                    <img :src="`''${item.coinsIcon}`" alt="" >
                                </div>
                                <div class="buy">
                                    <div class="price">
                                        <div class="coin">
                                            <span>{{item.coins}}</span>
                                            <img :src="`img/donate/coin.png`" alt="">
                                        </div>
                                    </div>
                                    
                                </div>
                                <div class="info">
                                    <div class="bottom">
                                        <div class="name">{{item.name}}</div>
                                        <div class="amenitiesText" >Услуга</div>
                                        <div class="placeholder">{{item.placeholder}}</div>
                                        <div class="buy">
                                            <div class="point">
                                                <img :src="`img/donate/point.png`" alt="">
                                                <span>Купить</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="referral" v-if="tab == 'referral'">
                    <referrals :refData="referralData" :errorMsg="refsErrorMsg" />
                </div>
            </div>
        </div>
    </div>
</template>

<style src="../../styles/donate.scss" lang="scss"></style>

<script>
import referrals from './referrals.vue'

export default {
    components: {
        // todo: вынести остальные табы
        referrals
    },
    data() {
        return {
            show: false,
            coins: 10,
            money: 1600,
            tab: 'referral',
            replenishInput: undefined,
            exchangeMoneyInput: undefined,
            exchangeCoinInput: undefined,
            premium: 3,
            overlay: '',
            itemsReplenish: [
                {
                    coinsIcon: 'img/donate/coin2.png',
                    coins: 10,
                    price: 299,
                    bonus: 'Бонус +2',
                    name: 'Монеты Хард',
                    placeholder: 'Базовый набор'
                },
                {
                    coinsIcon: 'img/donate/coin3.png',
                    coins: 50,
                    price: 999,
                    bonus: 'Бонус Премиум 1 день',
                    name: 'Монеты Хард',
                    placeholder: 'Малый набор'
                },
                {
                    coinsIcon: 'img/donate/coin4.png',
                    coins: 100,
                    price: 2999,
                    bonus: '',
                    name: 'Монеты Хард',
                    placeholder: 'средний набор'
                },
                {
                    coinsIcon: 'img/donate/coin5.png',
                    coins: 200,
                    price: 4999,
                    bonus: 'Бонус VIP 30 дней',
                    name: 'Монеты Хард',
                    placeholder: 'большой набор'
                },
                {
                    coinsIcon: 'img/donate/coin5.png',
                    coins: 500,
                    price: 6999,
                    bonus: '',
                    name: 'Монеты Хард',
                    placeholder: 'огромный набор',
                    background: true
                },
            ],
            itemsPremium: [
                {
                    coinsIcon: 'img/donate/premium1.png',
                    coins: 10,
                    price: 299,
                    days: 1,
                    name: 'Монеты Хард',
                    placeholder: 'Базовый набор'
                },
                {
                    coinsIcon: 'img/donate/premium2.png',
                    coins: 50,
                    price: 999,
                    days: 7,
                    name: 'Монеты Хард',
                    placeholder: 'Малый набор'
                },
                {
                    coinsIcon: 'img/donate/premium3.png',
                    coins: 100,
                    price: 2999,
                    days: 30,
                    name: 'Монеты Хард',
                    placeholder: 'средний набор'
                },
            ],
            advantagePremium: [
                "Особая иконка над ником в виде премиума",
                `Филосовский камень:<br/>
Позволяет возродиться на месте смерти без таймера`,
                `Набор бандита 1 раз в сутки:<br/>
АК-47 (30пт), Макаров (7пт), Снайперская-винт (1пт).`,
                `Связи в правительстве:<br/>
+20% к заработной плате на всех работах, -15% при первой покупки автомобиля, -25% от времени в тюрьме`,
                `Крыша:<br/>
Ваше имущество не слетает (действует только при наличии премиума)`,
            ],
            amenitieItems: [
                {
                    coinsIcon: 'img/donate/exterior.png',
                    coins: 599,
                    name: 'внешность',
                    placeholder: 'смена внешности'
                },
                {
                    coinsIcon: 'img/donate/changeNickname.png',
                    coins: 299,
                    name: 'никнейм',
                    placeholder: 'смена никнейма'
                },
                {
                    coinsIcon: 'img/donate/pledge.png',
                    coins: 399,
                    name: 'залог',
                    placeholder: 'выход из тюрьмы'
                },
            ],
            amenitieVerticallyItems: [
                {
                    coinsIcon: 'img/donate/changeGender.png',
                    coins: 199,
                    name: 'пол',
                    overlay: 'changeGender',
                    placeholder: 'смена пола'
                },
                {
                    coinsIcon: 'img/donate/changeAge.png',
                    coins: 149,
                    name: 'возраст',
                    overlay: 'changeAge',
                    placeholder: 'смена возраста'
                },
                {
                    coinsIcon: 'img/donate/warn.png',
                    coins: 199,
                    overlay: 'warn',
                    name: 'варн',
                    placeholder: 'выход из тюрьмы'
                },
            ],
            referralData: {},
            refsErrorMsg: ''
        };
    },
    methods: {
        hide(){
            this.show = false;
            mp.trigger('guitoggle', false);
        },

        setExchangeCoinInput(event){
            let value = parseInt(event.target.value.replace(/[^\d]/g, ''));
            this.exchangeCoinInput = value;
            if(isNaN(value))return this.exchangeMoneyInput = undefined;
            this.exchangeMoneyInput = value*10;
        },

        setExchangeMoneyInput(event){
            let value = (event.target.value.replace(/[^\d]/g, ''));
            if(value == '1'){
                this.$set(this.exchangeCoinInput,1);
                this.$set(this.exchangeMoneyInput,10);
                return;
            }
            if(isNaN(parseInt(value)))return this.exchangeCoinInput = undefined;
            if(value.length > 1 && value[value.length-1] != '0' ){
                value = value.substring(0, value.length-1) + "0"
            }
            if(value.length < 2)value = '10'
            value = parseInt(value);
            this.exchangeMoneyInput = value;
            if(isNaN(value)) return;
            this.exchangeCoinInput = parseInt(value/10);
        },

        getCharacter(){
            if(this.tab == 'amenities')return 'character3';
            if(this.tab == 'premium')return 'character2';
            return 'character1';
        },

        onRefsError(message) {
            this.refsErrorMsg = message;
        }
    },
    watch: {
        exchangeCoinInput: function (value, oldVal) {
            // value = parseInt(value);
            // this.exchangeMoneyInput = value*10;
        },
        exchangeMoneyInput: function (value, oldVal) {
            // this.exchangeCoinInput = parseInt(value/10);
        },
        refsErrorMsg: function(val, oldVal) {}
    },
    computed: {
        textMoney() {
            if(!this.money) return `0`;
            let n = this.money + "";
            n = n.replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');;
            return `${n}`
        },
        exchangeCoinText(){

        },
        exchangeMoneyText(){
            return '';
        },
    },
    created(){
        window.donate = this;
        mp.on("HUD::CHANGE_MONEY",(money)=>{
            donate.money = money;
        })
        $("body").keyup(function(event){
            if(event.which == 27 && donate.show){
                donate.hide();
            }
        })
    }
};
</script>