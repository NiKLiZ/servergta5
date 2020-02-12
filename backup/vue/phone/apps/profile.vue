<template>
    <div class="profile">
        <div class="title">
            <div class="back"><i class="fal fa-angle-left" @click="back"></i></div><h1>Профиль</h1>
        </div>
        <div class="items" >
            <div class="item" :class="{active: !sleeping}" @click="sleep(false)">
                <span>Обычный режим</span>
                <div class="icon"><i class="iw phone-user"></i></div>
            </div>
            <div class="item" :class="{active: sleeping}" @click="sleep(true)">
                <span>Спящий режим</span>
                <div class="icon"><i class="iw zz"></i></div>
            </div>
        </div>
    </div>
</template>
<style src="../../../styles/phone/profile.scss" lang="scss"></style>

<script>


export default {
    data() {
        return {
        };
    },

    props: ['sleeping'], 
    created(){
        mp.on("PHONE::TOGGLE_SLEEPING_CALLBACK",(toggle)=>{
            this.sleeping = toggle;
            this.$emit('sleeping',toggle);
        })
    },
    components:{
    },
    methods: {
        back(){
            this.$emit('back')
        },
        sleep(toggle){
            if(toggle == this.sleeping) return;
            mp.trigger('CallRemote',"PHONE::TOGGLE_SLEEPING",toggle);
        }
    },
  };

  // Well, hu, you have no module so just keep your component somewhere.
</script>