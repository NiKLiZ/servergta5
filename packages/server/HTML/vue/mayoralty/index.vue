<template>
    <div v-if="show" class="mayoralty">
        <div @click="hide"  class="exit"><i class="fas fa-times"></i></div>
        <div class="header">
            <h1>{{title.toLocaleUpperCase()}}</h1>  
             
        </div>
       <div class="main">
           <div class="window menu-items"  v-if="window == 'main'">
            <div class="items">
                <div class="item" v-for="(item,i) in items" :key="i" @click="toggleMenu(item)">
                    <div class="icon"><i class="iw" :class="item.icon"></i></div>
                    <div class="title">{{item.title}}</div>
                </div>
            </div>
            </div>
            <div class="window list" v-if="window == 'job'">
               <div>
                    <div class="list">
                        <div class="item" v-for="(job,i) in jobs" :key="i" @click="selectJob(job)">
                            <div class="name">{{job.name}} <i class="fas fa-arrow-right"></i></div>
                        </div>
                    </div>
                    <div class="icon"><i class="iw job" ></i></div>
               </div>
            </div>
            <div class="window salary" v-if="window == 'salary'">
               <div>
                    <div class="main-menu">
                        <p>
                            Каждый час вам будут платить 100$. <br>
                            Вы будете получать пособие каждый <br>час пока не проживете год в штате. 
                        </p>
                        <div class="but" @click="clickBenefit" >Получить пособие</div>
                    </div>
                    <div class="icon"><i class="iw salary" ></i></div>
               </div>
           </div>
            <div class="window personal-profile" v-if="window == 'personal-profile'">
               <div>
                    <div class="main-menu">
                        <p>Когда получите прописку в штате, <br>то вы сможете покупать дома.</p>
                        <div class="but" @click="clickRegistration">Получить прописку</div>
                    </div>
                    <div class="icon"><i class="iw personal-profile" ></i></div>
               </div>
           </div>
            <div class="window list" v-if="window == 'approved'">
               <div>
                    <div class="list">
                        <div class="item" v-for="(license,i) in licenses" :key="i" @click="selectLicense(license)">
                            <div class="name">{{license.name}} <i class="fas fa-arrow-right"></i></div>
                        </div>
                    </div>
                    <div class="icon"><i class="iw approved" ></i></div>
               </div>
           </div>
       </div>
    </div>
</template>

<style src="../../styles/mayoralty.scss" lang="scss"></style>

<script>

export default {
    data() {
        return {
            show: false,
            title: 'МЕНЮ',
            window: 'main',
            items: [
                {
                    icon: 'job',
                    title: 'Поиск работы'
                },
                {
                    icon: 'salary',
                    title: 'Пособие по безработице'
                },
                {
                    icon: 'personal-profile',
                    title: 'Прописка в штате'
                },
                {
                    icon: 'approved',
                    title: 'Купить лицензию'
                },
            ],
            jobs: [
                {
                    name: 'Водитель автобуса',
                    job: 'bus'
                },
                {
                    name: 'Таксист',
                    job: 'taxi'
                },
                {
                    name: 'Работа на ферме',
                    job: 'farm'
                },
                {
                    name: 'Служба эвакуации Т/С',
                    job: 'evacuator'
                },
                {
                    name: 'Мусоровоз',
                    job: 'garbage'
                },
                {
                    name: 'Развозчик пиццы',
                    job: 'pizzeria'
                },
                {
                    name: 'Инкассатор',
                    job: 'collector'
                },
            ],
            licenses: [
                {
                    name: 'Лицензия рыболова',
                    type: 'fishing'
                },
                {
                    name: 'Лицензия таксиста',
                    type: 'deliveryPassengers'
                },
            ]
        };
    },

    props: {
    },
    created(){
        window.mayoralty = this;
        $("body").keyup(function(event){
            if(event.which == 27 && mayoralty.show){
                mayoralty.hide();
            }
        })
    },
    methods: {
        toggleMenu(item){
            this.window = item.icon;
            this.title = item.title;
        },
        menuOpen(){
            this.show = true;
            this.window = 'main';
            this.title = 'Меню';
        },
        selectJob(item){
            mp.trigger('CallRemote','MAYORALTY::JOB',item.job)
            this.hide();
        },
        selectLicense(license){
            mp.trigger('CallRemote','MAYORALTY::LICENSES',license.type)
            this.hide();
        },
        clickRegistration(){
            mp.trigger('CallRemote','MAYORALTY::REGISTRATION')
        },
        clickBenefit(){
            mp.trigger('CallRemote','MAYORALTY::BENEFIT')
        },
        hide(){
            this.show = false;
            mp.trigger('guitoggle', false);
        }
    },
    components:{

    }   
  };
</script>