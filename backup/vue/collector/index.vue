<template>
    <div class="collector" v-if="show">
        <div class="collector-menu">
            <div @click="hide" class="exit"><i class="fas fa-times"></i></div>
            <h1>РАБОТА ИНКАССАТОРОВ</h1>
            <div class="select">
                <h2>ВЫБОР ЛОББИ</h2>
                <div class="lobbys">
                    <div class="lobby" v-for="(lobby,i) in lobbys" :class="{active:active != -1 && active == i}" @click="joinLobby(i)" :key="i">
                        <div class="name" >
                            ЛОББИ #{{i+1}}
                        </div>
                        <div class="players">
                            <i class="fas fa-users"></i>
                            <span>{{lobby.players.length}}/4</span>
                        </div>  
                    </div>
                 </div>
            </div>
            <div class="infoLobby">
                <h2>ЛОББИ #{{active+1}}</h2>
                <div class="info">
                    <h3>{{lobbys[active].players.length}}/4</h3>
                    <div class="players">
                        <div class="player" v-for="(player,i) in lobbys[active].players" :key="i">
                            <div class="nick">{{player.name}}</div>
                            <div class="mission">{{player.mission}}</div>
                            <div class="del" v-if="mission == 0 && i != 0" @click="kickLobby(i)"><i class="fas fa-times"></i></div>
                        </div>
                    </div>  
                    <div class="start" v-if="mission == 0"  @click="startMisson">НАЧАТЬ РАБОТУ</div>
                </div>
            </div>
        </div>

    </div>    
</template>

<style lang="scss" src="../../styles/collector.scss"></style>
<script>
    export default {
    data() {
        return {
            show: false,
            active: 0,
            lobbys: [
                {
                    players: [
                        {
                            name: 'Test test',
                            mission: 'Водитель'
                        }
                    ]
                },
                 {
                    players: [
                        {
                            name: 'Test test',
                            mission: 'Водитель'
                        }
                    ]
                }
            ],
            mission: -1,
        };
    },
    methods: {
        hide(){
            this.show = false;
            mp.trigger('COLLECTOR::MENU_HIDE');
        },
        joinLobby(id){
            if(id == this.active) return;
            mp.trigger('CallRemote',"COLLECTOR::JOIN_LOBBY",id);
        },
        kickLobby(id){
            mp.trigger('CallRemote','COLLECTOR::KICK_LOBBY',id)
        },
        startMisson(){
            mp.trigger('CallRemote','COLLECTOR::START_MISION')

        }
    },
    computed: {

    },
    created(){
        window.collector = this;
        mp.on("COLLECTOR::MENU_UPDATE",(lobbys)=>{
            this.lobbys = lobbys;
        })
        mp.on("COLLECTOR::ACTIVE_LOBBY",(lobby,mission)=>{
            this.active = lobby;
            this.mission = mission;
        })
        $("body").keyup(function(event){
            if(event.which == 27 && collector.show){
                collector.hide();
            }
        })
    },
};
</script>