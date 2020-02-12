<template>
<div v-if="show" class="menu_fraction" id="lspd">
    <div @click="hide()" class="exit"><i class="fas fa-times"></i></div>
    <div class="toolbar">
      <ul>
        <li v-bind:class="[menu == 'battue' ? 'active' : '']" @click="menu = 'battue'">
          <div class="icon"><div class="wanted iw"></div></div>
          <div class="title">Объявить<br> в розыск</div>
        </li>
        <li v-bind:class="[menu == 'fine' ? 'active' : '']" @click="menu = 'fine'">
          <div class="icon"><div class="fine iw"></div></div>
          <div class="title">Выдать<br> штраф</div>
        </li>
        <li v-bind:class="[menu == 'challenges' ? 'active' : '']" @click="menu = 'challenges'">
          <div class="icon"><div class="challenges iw"></div></div>
          <div class="title">Экстр. <br> вызовы</div>
          <div class="notification">{{challenges_max}}</div>
        </li>
        <li v-bind:class="[menu == 'search' ? 'active' : '']" @click="menu = 'search'">
          <div class="icon"><div class="search iw"></div></div>
          <div class="title">Розыск<br> онлайн</div>
        </li>
        <li v-bind:class="[menu == 'employees' ? 'active' : '']" @click="menu = 'employees'">
          <div class="icon"><div class="cooperate iw"></div></div>
          <div class="title">Сотрудн.<br> на дежурстве</div>
        </li>
      </ul>
    </div>
    <div class="main">
      <div class="window" v-if="menu == 'battue'">
        <div class="two">
          <div  class="title">Имя игрока</div>                   
          <input placeholder="John Wood" v-model="battue_player" type="text">
          <div class="title">Причина</div>                   
          <input  type="text" id="discription">
          <div class="title">Статья</div>                   
          <input  type="text" v-model="article">
          <div class="title">Уровень розыска</div>                   
          <div class="stars">
            <div class="star" v-for="n in 5" :key="n" @click="stars = n">
              <i v-if="n <= stars" class="fas fa-star active"></i>
              <i v-else class="far fa-star"></i>
            </div>
          </div>
          <div class="but" @click="battue()">Отправить данные</div>
          
        </div>
        <list-of-players v-on:change="battue_player = $event" v-bind:players="players" ></list-of-players>
      </div>
      <div class="window fine" v-if="menu == 'fine'">
        <div class="two">
          <div  class="title">Имя игрока</div>                   
          <input v-model="fine_player" placeholder="John Wood" type="text">
          <div class="title">Причина</div>                   
          <input id="discription"  type="text">
          <div class="title">Сумма штрафа</div>                   
          <input id="amount" type="number" >

          <div class="but" @click="fine()">Оштрафовать</div>
          
        </div>
        <list-of-players  v-on:change="fine_player = $event" v-bind:players="players"></list-of-players>
      </div>
      <div class="window" id="challenges" v-if="menu == 'challenges'" >
        <div class="title">Список вызовов</div>
        <ul>
          <li v-for="(player,index) in challenges" :key="index">
            <div id="main">
              <div id="left">
                <div class="name"><i class="fas fa-phone fa-flip-horizontal"></i>{{player.name}}</div>
                <div id="actions">
                  <div @click="trigger('CallRemote','LSPD::CHALLEGES_ACCEPT',player.name)" class="action green">ПРИНЯТЬ</div> 
                  <div @click="trigger('CallRemote','LSPD::CHALLEGES_CANCEL',player.name)" class="action white">ОТКЛОНИТЬ</div>
                </div>
              </div>
              <div id="discription">{{player.discription}}</div>
            </div>
          </li>
        </ul>
      </div>
      <div class="window search_online" v-if="menu == 'search'">
        <div class="title">Список разыскиваемых игроков</div>
         <ul>
          <li v-for="(player,index) in search_online" :key="index"> <div id="text">{{player.name}} ({{player.stars}} зв.) </div><div id="actions"><div @click="trigger('CallRemote','LSPD::search_online_find',player.name)" class="action blue">Найти</div> <div @click="trigger('CallRemote','LSPD::search_online_clear',player.name)"  class="action red">CLEAR</div></div></li>
        </ul>
      </div>
      <div class="window" id="employees" v-if="menu == 'employees'" >
        <table>
        <thead>
          <tr>
            <th ><span>Ник</span></th>
            <th ><span>Звание</span></th>
            <th ><span>Ранг</span></th>
          </tr>
          </thead>
          <tbody>
            <tr  v-for="(player,index) in online_staff" :key="index">
              <td >{{player.name}}</td>
              <td >{{player.rank+1}}</td>
              <td >{{rangs[player.rank] ? rangs[player.rank].name : '' }} <div id="actions"><div @click="EmployeesUp(player.name)" class="action blue"><i class="fas fa-arrow-up"></i></div><div @click="EmployeesDown(player.name)" class="action blue"><i class="fas fa-arrow-down"></i></div><div @click="EmployeesFind(player.name) " class="action blue">Найти</div><div @click="EmployeesClear(player.name) " class="action red">CLEAR</div></div></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>

import listOfPlayers from './listOfPlayers.vue'

export default {
    data() {
        return {
            show: false,
            title: 'ПРОДАЖА ТРАНСПОРТА',
            stars: 2,
            menu: 'battue',
            article: '',
            players: [

            ],
            battue_player: '',
            fine_player: '',
            search_online: [
            ],
            rangs: [
            'Офицер',
            'Сержант',
            'Лейтенант',
            'Капитан',
            "Заместитель инспектора",
            'Инспектор',
            "Заместитель шефа",
            "Помощник Шефа",
            "Начальник бюро",
            "Шеф департамента",
            ],
            online_staff:[
            ],
            numerals: [ 
                'I', 
                'II', 
                'III', 
                'IV', 
                'V', 
                'VI', 
                'VII', 
                'VIII', 
                'IX', 
                'X', 
                'XI', 
                'XII', 
                'XIII', 
                'XIV', 
                'XV', 
                'XVI', 
                'XVII', 
                'XVIII', 
                'XIX', 
                'XX', 
                'XXI', 
            ],
            challenges: [
            ]
        };
    },
    methods: {
        hide(){
            this.show = false;
            mp.trigger('guitoggle', false);
        },
        battue(){
            mp.trigger('CallRemote', 'LSPD::battue',this.battue_player,this.article,$('.menu_fraction .phone #discription').val(),this.stars);
        },
        fine(){
            mp.trigger('CallRemote', 'LSPD::fine',this.fine_player,$('.menu_fraction .fine #discription').val(),$('.menu_fraction .fine #amount').val());
        },
        EmployeesUp(name){
            mp.trigger('CallRemote','FRACTION::EMPLOYEES_UP',name)
        },
        EmployeesDown(name){
            mp.trigger('CallRemote','FRACTION::EMPLOYEES_DOWN',name)
        },
        EmployeesFind(name){
            mp.trigger('CallRemote','FRACTION::EMPLOYEES_FIND',name)
        },
        EmployeesClear(name){
            mp.trigger('CallRemote','FRACTION::EMPLOYEES_CLEAR',name)
        },
        trigger(...args){
            mp.trigger(...args);
        }
    },
    computed: {
        challenges_max() {
            return this.challenges.length > 99 ? 99 : this.challenges.length; 
        },
    },
    created(){
        window.lspd_menu = this;
    },
    components:{
      'list-of-players': listOfPlayers,
    }   
};
</script>