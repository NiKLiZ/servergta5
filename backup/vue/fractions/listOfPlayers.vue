<template>
    <div class="two" >
      <div  class="title">Список игроков рядом</div>   
      <ul id="list_players">
        <li v-for="(player,i) in players" @click="playerChange(player.name)" :key="i">{{player.name}} ({{player.stars}} зв.)</li>
      </ul>
    </div>
</template>


<script>
export default {
    data() {
        return {
            
        }
    },
    props: ['players'],
    methods: {
        playerChange(name){
            this.$emit('change',name)
        }
    },
}
</script>