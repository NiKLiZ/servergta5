<template>
<div v-if="show" class="list_players" id="list_players">
		<div class="title">
			<h1>{{title}}</h1>
			<p class="players">Игроков <span>{{players.length}}/800</span></p>
			 <div class="input">
			 		<i class="fas fa-search"></i>
			 		<input v-model="search" type="text" placeholder="Поиск игрока...">
			 </div>
		</div>
		<div class="list">
			<table>
      	<thead>
          <tr>
            <th v-for="(column,i) in columns" :key="i">
            	<span  @click="sortBy(column)">
	            	{{ column }} 
	            	<span :class="{ active: sortKey == columns_sort[columns.indexOf(column)] }">
                        <i v-if="sortKey ==  columns_sort[columns.indexOf(column)] && reverse"   class="fas fa-sort-amount-up"></i>
                        <i v-else  class="fa fa-sort-amount-down"></i>
	            	</span>
            	</span>
          	</th>
          </tr>
          </thead>
          <tbody>
            <tr v-for="(player,i) in filteredPlayers" :key="i">
              <td>{{player.id}}</td>
              <td>{{player.name}}</td>
              <td v-if="hasShowFraction">{{player.fractions}}</td>
              <td>{{player.ping}}</td>
            </tr>
          </tbody>
        </table>
		</div>
	</div>

</template>
<style src="../../styles/list_players.scss"></style>

<script>
import { constants } from 'fs';
export default {
    data() {
        return {
            show: false,
            title: 'West RolePlay',
            reverse: false,
            sortKey: 'id',
            columnsInfo: ['id', 'Имя','Фракция','Пинг'],
            columns_sortInfo: ['id', 'name','fractions','ping'],
            search: '',
            hasShowFraction: false,
            players: []
        };
    },
    methods: {
        sortBy(key) {
            try{
                let sortKey = this.columns_sort[this.columns.indexOf(key)];
                this.reverse = (this.sortKey == sortKey) ? !this.reverse : false;
                this.sortKey = sortKey;
            }catch(e){
                console.error(e)
            }
        },
        hide(){
            this.show = false;
            mp.trigger("guitoggle", this.show);
        },
    },
    computed: {
        sortedPlayers() {
            const k = this.sortKey;
            return this.players.sort((a, b) => (a[k] < b[k] ? -1 : a[k] > b[k] ? 1 : 0) * [1, -1][+this.reverse]);
        },
        filteredPlayers() {
            const s = this.search.toLowerCase();
            let columns_sort = this.columns_sort;
            let sortedPlayers = this.sortedPlayers;
            let sort = sortedPlayers.map((item)=>{
                let info = {};
                return columns_sort.forEach((key)=>{
                    info[key] = item[key];
                })
                return info
            })
            let t = sortedPlayers.filter(n => Object.values(n).some(m => m.toString().toLowerCase().includes(s)));
            return t;
        },
        columns(){
            if(this.hasShowFraction) return this.columnsInfo;
            else return ['id', 'Имя','Пинг'];
        },
        columns_sort(){
            if(this.hasShowFraction) return this.columns_sortInfo;
            else return ['id', 'name','ping'];
        }
    },
    created(){
        window.list_players = this;
        window.TogglewPlayersList =  (toggle)=>{
            list_players.show = toggle;
            mp.trigger("guitoggle", toggle);
            if(!toggle){
                list_players.search = '';
            }else{
                mp.trigger('CallRemote',"ShowPlayersList")
            }
        }
        mp.on('ShowPlayersList',(ret)=>{
            list_players.players = ret;
        })
        $("body").keyup(function(event){
            if(event.which == 27 && list_players.show){
                list_players.hide();
            }
        })
    },
};
</script>