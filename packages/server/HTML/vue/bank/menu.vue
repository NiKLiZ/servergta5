<template>
    <div v-if="show" class="bank">
    <div  v-if="menu == 'bank'" class="bank-menu">
      <div class="toolbar">
          <div class="user">
            <div class="icon">
              <i class="fas fa-user"></i>
            </div>
            <span>{{nick}}</span>
          </div>
        <div class="accounts">
          <p>Ваши счета:</p>
          <div v-for="(acc,i) in accounts" class="account" :key="i" :class=" account == i ? 'active' : '' " @click="changeCart(i)">{{acc.card_number}} <span><i style="font-size: 0.7em;" class="fas fa-copy" @click="copy(acc.card_number);"></i></span></div>
        </div>
        <div class="addAccount" @click="addAccount">
          <i class="fas fa-plus"></i>
          Создать счёт 5$
        </div>
      </div>
        <div class="main">
          <div class="window">
            <div @click="hide()" class="exit"><i class="fas fa-times"></i></div>
            <div class="money">
              <span>У вас на счету:</span>
              <h1>{{textMoney}}</h1>
              <span>Неоплаченные счета: <b>{{outstanding_accounts}}</b></span>
            </div>
            <div class="create_cart" @click="addCard">
                <div class="create_account">
                <div id="add">
                  <i class="fas fa-plus"></i>
                </div> 
                <span >Оформить <br> карту за <b>5$</b></span>  
              </div>
            </div>
          <div class="buttons">
            <div class="but" @click="overlay = 'shoot'">Снять</div>
            <div class="but" @click="overlay = 'replenish'">Пополнить счёт</div>
            <div class="but" @click="overlay = 'lead'" >Перевести</div>
            <div class="but" @click="overlay = 'pay'">Оплатить</div>
          </div>
          <div class="transactions">
          <span>История операций:</span>
            <div v-for="(transaction,i) in accounts[account].transactions.slice().reverse()" :key="i" class="transaction">
              <div class="price">{{transaction.money > 0? '+'+transaction.money:transaction.money}}</div>
              <div class="discription">{{transaction.title }}</div>
            </div>
          </div>
          </div>
        </div>
      </div>
      <div class="overlay" v-if="overlay == 'shoot'">
        <div  class="bank-input">
          <div @click="hideOverlay()" class="exit"><i class="fas fa-times"></i></div>
          <h2>Снять деньги</h2>
          <input type="number" min="1" class="shoot">
          <div class="but" @click="shoot">Снять</div>
        </div>
      </div>
      <div class="overlay" v-if="overlay == 'replenish'">
        <div class="bank-input">
          <div @click="hideOverlay()" class="exit"><i class="fas fa-times"></i></div>
          <h2>Пополнить счет</h2>
          <input type="number" min="1" class="replenish" placeholder="Сумма" >
          <div class="but" @click="replenish">Пополнить</div>
        </div>
      </div>
      <div class="overlay" v-if="overlay == 'lead'">
        <div  class="bank-input">
          <div @click="hideOverlay()" class="exit"><i class="fas fa-times"></i></div>
          <h2>Перевод</h2>
          <input type="number" class="card" placeholder="Номер счёта" >
          <input type="number" min="0" class="lead" placeholder="Сумма">
          <div class="but" @click="lead ">Перевести</div>
        </div>
      </div>
      <div class="overlay" v-if="overlay == 'pay'">
        <div  class="bank-input">
          <div @click="hideOverlay()" class="exit"><i class="fas fa-times"></i></div>
          <h2>Оплатить имущество</h2>
          <div class="icons">
            <div class="icon" v-for="pay in Object.keys(payments)" :key="pay" :class=" pay == payment ? 'active' : '' " @click="payment = pay">{{pay}}</div>
          </div>
          <h3><span>До оплаты осталось: </span> <b>{{payments[payment].payment_left}}</b></h3>
          <h2>1д = {{payments[payment].payment_day}}$</h2>
          <input type="number" placeholder="Сумма">
          <div class="but">Перевести</div>
        </div>
      </div>
      <div v-if="menu == 'no_card'" class="bank-input">
        <div @click="hide()" class="exit"><i class="fas fa-times"></i></div>
        <h3><b>У вас нет карты!</b></h3>
        <h3><span>Оформите её в ближайшем банке</span></h3>
        <div class="but" @click="hide()">Понял</div>
      </div>
      <div  v-if="menu == 'ATM'" class="bank-menu atm">
        <div class="toolbar">
          <div class="logo">
            ATM
          </div>
          <div class="accounts">
            <p>Ваши счета:</p>
            <div v-for="(acc,i) in accounts" class="account" :key="i" :class=" account == i ? 'active' : '' " @click="changeCart(i)">{{acc.card_number}} </div>
          </div>
        </div>
        <div class="main">
          <div class="window">
            <div @click="hide()" class="exit"><i class="fas fa-times"></i></div>
            <div class="money">
              <span>У вас на карте: </span>
              <h1>{{textMoney}}</h1>
            </div>
          <div class="buttons">
            <div class="but" @click="overlay = 'shoot'">Снять</div>
            <div class="but" @click="overlay = 'replenish'">Пополнить счёт</div>
            <div class="but" @click="overlay = 'payment_phone'" >Оплата телефона</div>
          </div>
          </div>
        </div>
      </div>
    </div>
</template>
<style  src="../../styles/bank_menu.scss" lang="scss"></style>
<script>


export default {
  data() {
    return{
      show: false,
      name: 'S S',
      accounts:  [{money: 0,transactions: [],card_number:"456"}],
      account: 0,
      money: 454654,
      outstanding_accounts: 4,
      overlay: '',
      menu: 'bank',
      payments: {
        car:{
          icon: 'car',
          payment_left: 15,
          payment_day: 2,
        },
        home:{
          icon: 'car',
          payment_left: 654,
          payment_day: 654,
        },
        business:{
          icon: 'business',
          payment_left: 15,
          payment_day: 543,
        },
        filling:{
          icon: 'filling',
          payment_left: 6,
          payment_day: 54,
        }
      },
      payment: 'car',
      $
    }
  },
  computed: {
    nick() {
      let name = this.name.split(' ')[0];
      let surname = this.name.split(' ')[1];
      return `${name} ${surname[0].toLocaleUpperCase()}.`
    },
    textMoney() {
      let n = this.accounts[this.account].money + "";
      n = n.replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1,');;
      return `$${n}`
    },
  },
  methods: {
    changeCart(acc){
      this.account = acc;
    },
    hide(){
      this.show = false;
      mp.trigger('guitoggle', false);
      this.menu = 'bank';
      this.overlay = '';
    },
    battue(){
      mp.trigger('CallRemote', 'LSPD::battue',this.battue_player,$('.menu_fraction .phone #discription').val(),this.stars);

    },
    fine(){
      mp.trigger('CallRemote', 'LSPD::fine',this.fine_player,$('.menu_fraction .fine #discription').val(),$('.menu_fraction .fine #amount').val());
    },
    addCard(){
      mp.trigger('CallRemote','BANK::ADD_CARD',this.accounts[this.account].card_number);
    },
    addAccount(){
      mp.trigger('CallRemote','BANK::ADD_ACCOUNT')
    },
    hideOverlay(){
      this.overlay = '';
    },
    shoot(){
      mp.trigger('CallRemote','BANK::MENU_BANK_SHOOT',this.accounts[this.account].card_number,$('.bank-input .shoot').val(),this.menu == 'ATM');
    },
    lead(){
      mp.trigger('CallRemote','BANK::MENU_BANK_LEAD',this.accounts[this.account].card_number,$('.bank-input .card').val(),$('.bank-input .lead').val());
    },
    replenish(){
      mp.trigger('CallRemote','BANK::MENU_BANK_REPLENISH',this.accounts[this.account].card_number,$('.bank-input .replenish').val(),this.menu == 'ATM');
    },
    copy(number){
      copy(number)
      mp.trigger('alert','Номер карты скопирован')
    }
  },
  created() {
    window.bank = this;
    $("body").keyup(function(event){
        if(event.which == 27 && bank.show){
            bank.hide();
        }
    })
  }
}
</script>

