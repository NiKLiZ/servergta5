<template>
<div v-if="show" class="menu_fraction" id="ems">
    <div @click="hide()" class="exit"><i class="fas fa-times"></i></div>
    <div class="toolbar">
      <ul>
        <li v-bind:class="[menu == 'challenges' ? 'active' : '']" @click="menu = 'challenges'">
          <div class="icon"><div class="challenges iw"></div></div>
          <div class="title">Экстр. <br> вызовы</div>
          <div class="notification">{{deatPlayers_max}}</div>
        </li>
        <li v-bind:class="[menu == 'employees' ? 'active' : '']" @click="menu = 'employees'">
          <div class="icon"><div class="cooperate iw"></div></div>
          <div class="title">Сотрудн.<br> онлайн</div>
        </li>
      </ul>
    </div>
    <div class="main">
      <div class="window" id="challenges" v-if="menu == 'challenges'" >
        <ul>
          <li v-for="(player,index) in deatPlayers" :key="index">
            <div id="main">
              <div id="left">
                <div class="name"><i class="fas fa-phone fa-flip-horizontal"></i>{{player.name}}</div>
                <div id="actions">
                  <div @click="trigger('CallRemote','EMS::CHALLEGES_ACCEPT',player.name)" class="action green">Выехать</div>
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
          <li v-for="(player,index) in search_online" :key="index">
             <div id="text">{{player.name}} ({{player.stars}} зв.) </div>
             <div id="actions">
                <div @click="trigger('CallRemote','LSPD::search_online_find',player.name)" class="action blue">Найти</div>
                <div @click="trigger('CallRemote','LSPD::search_online_clear',player.name)"  class="action red">CLEAR</div>
              </div>
          </li>
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
              <td >{{rangs[player.rank].name}} 
                <div id="actions">
                  <div @click="trigger('CallRemote','FRACTION::EMPLOYEES_UP',player.name)" class="action blue">
                    <i class="fas fa-arrow-up"></i>
                  </div>
                  <div @click="trigger('CallRemote','FRACTION::EMPLOYEES_DOWN',player.name)" class="action blue">
                    <i class="fas fa-arrow-down"></i>
                  </div>
                  <div @click="trigger('CallRemote','FRACTION::EMPLOYEES_FIND',player.name) " class="action blue">Найти</div>
                  <div @click="trigger('CallRemote','FRACTION::EMPLOYEES_CLEAR',player.name) " class="action red">CLEAR</div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
    data() {
        return {
            show: false,
            stars: 2,
            menu: 'challenges',
            search_online: [],
            rangs: [
              'Интерн',
              'Спасатель',
              'Нарколог',
              'Терапевт',
              "Хирург",
              'Заместитель главного врача',
              "Главный врач",
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
            ],
            deatPlayers: []
        };
    },
    methods: {
        hide(){
            this.show = false;
            mp.trigger('guitoggle', false);
        },
        trigger(...args){
            mp.trigger(...args);
        }
    },
    computed: {
        deatPlayers_max() {
            return this.deatPlayers.length > 99 ? 99 : this.deatPlayers.length; 
        },
    },
    created(){
        window.ems_menu = this;
    },
};
</script>