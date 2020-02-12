<template>
    <div class="homePage">
        <div class="appIcon" @click="open(app)"  v-for="(app,i) in apps" :key="i" > 
            <div class="iconContent" >
                <div class="icon"  :style="'background-color:'+app.color">
                    <i class="iw" :class="app.icon"></i>
                </div>
            </div>
            <div class="name">{{app.name}}</div>
        </div>
    </div>
</template>
<style src="../../../styles/phone/homePage.scss" lang="scss"></style>

<script>


export default {
    data() {
        return {
            apps: [
                {
                    icon: 'sms',
                    name: 'Сообщения',
                    color: '#65609f',
                    nameApp: 'sms',
                    statusBarColor: '#141414',
                },
                {
                    icon: 'contacts',
                    name: 'Контакты',
                    color: '#cf9949',
                    nameApp: 'contacts',
                    statusBarColor: '#141414',
                },
                {
                    icon: 'gps',
                    name: 'GPS',
                    color: '#ba4a40',
                    nameApp: 'gps',
                    statusBarColor: '#141414',
                },
                {
                    icon: 'icon-phone',
                    name: 'Вызовы',
                    color: '#52ac62',
                    nameApp: 'call',
                },
                {
                    icon: 'internet',
                    name: 'Интернет',
                    color: '#5380be',
                    nameApp: 'browser',
                    statusBarColor: '#141414',
                },
                {
                    icon: 'settings',
                    name: 'Профиль',
                    color: '#817f7f',
                    nameApp: 'profile',
                    statusBarColor: '#141414',
                },
            ]
        };
    },

    props: {
    },
    created(){
    },
    components:{
    },
    methods: {
        open(app){
            this.$emit('open',app)
        }
    },
  };

  // Well, hu, you have no module so just keep your component somewhere.
</script>