<template>
    <div class="carshowroom">
        <div class="container" v-if="show">
            <div class="headline">
                <h2>{{nameType}}</h2>
            </div>

            <div class="carroom_item">
                <div class="carroom_item-top">
                    <div class="carroom_item-top__slide">
                        <div class="button" @click="move(-1)"></div>
                        <p>{{ vehicles[currentSlide].name }}</p>
                        <div class="button" @click="move(1)"></div>
                    </div>
                    <div class="carroom_item-top__price">
                        <i></i>
                        {{ vehicles[currentSlide].price }}
                    </div>
                    <div class="carroom_item-top__colors">
                        <p>Основной цвет</p>
                        <ul>
                            <li v-for="(color,i) in colors" :key="i" 
                            :class="{active: colorActive == i}" 
                            :style="{'backgroundColor': color.color}"
                            @click="changeColor(i)"></li>
                        </ul>
                    </div>
                </div>
                <div class="carroom_item-bottom">
                    <ul class="carroom_item-bottom__info">
                        <li>
                            <i class="speed"></i>
                            {{ carSpeed }} км/ч
                        </li>
                        <li>
                            <i class="condition"></i>
                            {{ carBrake }}%
                        </li>
                        <li>
                            <i class="fuel"></i>
                            {{ carFuel }}л/10км.
                        </li>
                        <li>
                            <i class="wheel"></i>
                            {{ carClutch }}%
                        </li>
                    </ul>
                    <div class="carroom_item-bottom__buttons">
                        <a class="carroom_item-bottom__buttons-buy" @click="modal = true">
                            Купить
                        </a>
                        <i></i>
                        <a class="carroom_item-bottom__buttons-exit" @click="hide()">
                            Выйти
                        </a>
                    </div>
                </div>
            </div>
        </div>

        <div id="manager" class="modal-buy" v-if="modal">
            <div class="modal-buy_content">
                <div class="modal-buy_content__header">
                    <img :src="$root.cdn+'img/carshowroom/manager.jpg'" alt="Manager">
                    Manager
                    <div class="close" @click="modal = false"></div>
                </div>
                <p>Ты точно хочешь приобрести автомобиль
                {{ vehicles[currentSlide].name }} за {{ vehicles[currentSlide].price }}$?
                </p>
                <div class="modal-buy_content__buttons">
                    <a class="accept" @click="buy">
                        Да, давай
                    </a>
                    <a class="cancel" @click="modal = false">
                        Нет, спасибо
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="scss" src="../../styles/carshowroom.scss" scoped>
</style>

<script>
export default {
    data() {
        return {
            show: false,
            carName: '',
            carPrice: 0,
            carColor: 0,
            carSpeed: 0,
            carBrake: 0,
            carFuel: 0,
            carClutch: 0,
            colorActive: 0,
            nameType: '',
            modal:false,
            vehicles: [
                {
                    name: '3',

                }
            ], 
            currentSlide: 0,
            colors: [
                {
                    colorId: 0, 
                    color: '#232323'
                },
                {
                    colorId: 73, 
                    color: '#fff'
                },
                {
                    colorId: 28, 
                    color: '#ed8f4a'
                },
                {
                    colorId: 40,
                    color: '#7ad573'
                },
                {
                    colorId: 46, 
                    color: '#64b4d9'
                },
                {
                    colorId: 13, 
                    color: '#ef4f4f'
                },
                {
                    colorId: 32, 
                    color: '#fae44d'
                },
            ]
        }
    },
    methods:{
        move(value) {
            let newCurrent;
            const newIndex = this.currentSlide + value
            if (newIndex > this.vehicles.length - 1) { this.currentSlide = 0;return;}
            if (newIndex <= 0) newCurrent = this.vehicles.length - 1
            this.currentSlide = newCurrent || newIndex;
            mp.trigger('selectAuto', this.currentSlide)
        },
        
        changeColor(id) {
            let colorId = this.colors[id].colorId;
            this.colorActive = id;
            mp.trigger('selectColor', colorId)
        },

        hide() {
            mp.trigger('clearroomcars');
            this.modal = false;
        },
        start(nameType,vehs){
            this.nameType = nameType;
            this.currentSlide = 0;
            this.colorActive = 0;
            this.modal = false;
            this.show = true;
            this.vehicles = vehs;
        },
        buy(){
            this.modal = false;
            let veh = this.vehicles[this.currentSlide];
            mp.trigger('CARSHOWROOM::BUY',veh.vehicleId)
        }
    },
    created() {
        window.carshowroom = this;
        $("body").keyup(function(event){
            if(carshowroom.show){
                if((event.which == 27 || event.which == 8) ){
                    carshowroom.hide();
                }
                if(event.which == 39)carshowroom.move(1);
                if(event.which == 37)carshowroom.move(-1);
            }
        })
    },
}
</script>
