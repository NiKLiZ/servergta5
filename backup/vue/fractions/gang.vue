<template>
<div v-if="show" class="menu_fraction" id="GANG">
    <div @click="hide()" class="exit"><i class="fas fa-times"></i></div>
    <div class="toolbar">
      <ul>
        <li v-bind:class="[menu == 'employees' ? 'active' : '']" @click="menu = 'employees'">
          <div class="icon"><div class="cooperate iw"></div></div>
          <div class="title">Сотрудн.<br> онлайн</div>
        </li>
      </ul>
    </div>
    <div class="main">
      <div class="window" id="employees" v-if="menu == 'employees'" >
        <table>
        <thead>
          <tr>
            <th ><span>Ник</span></th>
            <th ><span>Звание</span></th>
            <th ><span>Ранг</span></th>
            <th></th>
          </tr>
          </thead>
          <tbody>
            <tr  v-for="(player,index) in online_staff" :key="index">
              <td >{{player.name}}</td>
              <td >{{player.rank+1}}</td>
              <td >{{rangs[player.rank].name}} </td>
              <td >{{player.warn}}/3</td>
                <td>
                  <div id="actions">
                    <div @click="trigger('CallRemote','FRACTION::EMPLOYEES_UP',player.name)" class="action blue">
                      <i class="fas fa-arrow-up"></i>
                    </div>
                    <div @click="trigger('CallRemote','FRACTION::EMPLOYEES_DOWN',player.name)" class="action blue">
                       <i class="fas fa-arrow-down"></i>
                    </div>
                    <div @click="trigger('CallRemote','FRACTION::WARN_UP',player.name) " class="action red"> 
                      <i class="fas fa-arrow-up"></i>
                    </div>
                    <div @click="trigger('CallRemote','FRACTION::WARN_DOWN',player.name) " class="action red"> 
                      <i class="fas fa-arrow-down"></i>
                    </div>
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
            menu: 'employees',
            search_online: [],
            rangs: [
                "Рядовой",
                "Мл.Сержант",
                "Сержант",
                "Прапорщик",
                "Младший лейтенант",
                "Лейтенант",
                "Старший лейтенант",
                "Капитан",
                "Майор",
                "Подполковник",
                "Полковник",
                "Генерал"
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
            ],
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
    },
    created(){
        window.gang_menu = this;
    },
};
</script>