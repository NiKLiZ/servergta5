<template>
    <div class="carshowroom">
        <div class="container" v-if="show">
        <Popup>
            <template v-slot:nameper>
                Обучение {{ id }}/21
            </template>

            <template v-slot:description>
                <p>{{ description }}</p>
            </template>
            
            <template v-slot:popup-btn v-if="variableShow">                    
                <a class="accept" @click="start()">Пиццерия</a>
                <a class="cancel" @click="variable(0)">Конверт</a>     
            </template>
            <template v-slot:popup-btn v-else-if="carDelivery">                    
                <a class="accept" @click="variable(1)">Да, давай</a>
                <a class="cancel" @click="hide()">Нет, спасибо</a>     
            </template>
            <template v-slot:popup-btn v-else-if="freezeWait">                    
                <a class="cancel" @click="hide()">Закрыть</a>     
            </template>
            <template v-slot:popup-btn v-else>                    
                <a class="accept" @click="start()">Да, давай</a>
                <a class="cancel" @click="hide()">Нет, спасибо</a>    
            </template>
        </Popup>
        </div>
    </div>
</template>
<style lang="scss" src="../../styles/carshowroom.scss" scoped>
</style>

<script>

import Popup from '../elements/popup.vue'
export default {
    components: {
        Popup
    },
    data() {
        return {
            show: false,
            id: 0,
            description: '',
            variableShow: false,
            carDelivery: false,
            freezeWait: false
           
        }
    },
    methods:{
        hide() {
            this.show = false;

            mp.trigger('EDUCATION::HIDE')
        },

        start() {
            this.hide();

            mp.trigger('EDUCATION::START')
        },

        variable(type) {
            this.hide();

            if (type == 0) return mp.trigger('EDDUCATION::MAIL');
            mp.trigger('EDDUCATION::CAR');
        }
    },
    created() {
        window.education = this;
        $("body").keyup(function(event){
            if(education.show){
                if((event.which == 27 || event.which == 8) ){
                    education.hide();
                }
            }
        })
    },
}
</script>