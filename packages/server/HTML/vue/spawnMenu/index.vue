<template>
    <div class="spawnMenu" v-if="show">
        <div class="main">
            <h1>Выбор спавна</h1>
            <div class="items">
                <div class="item" v-for="(item,i) in items" :class="{disable: item.locked}" :key="i" @click="clickItem(i)">
                    <div class="icon">
                        <div class="iw" :class="item.icon"></div>
                        <div class="iw bottom" :class="item.icon"></div>
                    </div>
                    <div class="title">{{item.name}}</div>
                    <div class="placeholder">{{item.locked ? item.placeholderLocked : item.placeholder}}</div>
                    <i class="bottom fas" v-if="item.locked" :class="{'fa-times': item.locked,'fa-check': activeItem == i}" ></i>
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="scss" src="../../styles/spawnMenu.scss"></style>

<script>
export default {
    data() {
        return {
            show: false,
            activeItem: 0,
            items: [
                {
                    name: 'Точка выхода',
                    icon: 'circular-wall-clock',                    
                    placeholder: 'Появиться на последней точке',
                    locked: false
                },
                {
                    name: 'Фракция',
                    icon: 'messenger-user-avatar',                    
                    placeholder: 'Появиться на спавне организации',
                    placeholderLocked: 'Вы не состоите во фракции',
                    locked: true
                },
                {
                    name: 'Дом',
                    icon: 'web-page-home',                    
                    placeholder: 'Появиться в доме',
                    placeholderLocked: 'У Вас нет собственного дома',
                    locked: false
                },
            ]
        };
    },
    methods: {
        clickItem(id){
            if(this.items[id].locked)return;
            mp.trigger('CallRemote',"AUTH::SPAWN_CLICK",id)
        },
    },
    computed: {
    },
    created(){
        window.startSpawnMenu = (items)=>{
            this.show = true;
            for (let i = 0; i < 3; i++) {
                this.items[i].locked = items[i];
            }
        }
        window.stopSpawnMenu = ()=>{
            this.show = false;
        }
    },
};
</script>