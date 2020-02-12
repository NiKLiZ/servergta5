<template>
    <div class="personal" v-if="show">
        <div class="tabs">
            <div class="title">
                Редактор персонажа
            </div>
             <div class="contentHeritage" v-if="tab == 'start'">
                    <div class="heritage">
                        <div class="sec mother">
                            <div class="contentArrow">
                                <div class="arrows">
                                    <i class="fal fa-angle-left arrow-left" @click="backImage('mother')"></i>
                                    <i class="fal fa-angle-right arrow-right" @click="nextImage('mother')"></i>
                                </div>
                            </div>
                            <div class="contentImg">
                                <div class="img">
                                    <img :src="$root.cdn+`img/personal/face/${this.faces[1][this.motherIndex]}.png`" alt="">
                                </div>
                            </div>
                        </div>
                        <div class="sec dad">
                            <div class="contentArrow">
                                <div class="arrows">
                                    <i class="fal fa-angle-left arrow-left" @click="backImage('dad')"></i>
                                    <i class="fal fa-angle-right arrow-right" @click="nextImage('dad')"></i>
                                </div>
                            </div>
                            <div class="contentImg">
                                <div class="img">
                                    <img :src="$root.cdn+`img/personal/face/${this.faces[0][this.dadIndex]}.png`" alt="">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            <div class="items" ref="items">
               <div class="back" v-if="tab != 'start'" @click="back"><i class="fal fa-arrow-left"></i> Назад</div>
                <div class="itemsBlock" :style="tab != 'start' ? 'margin-top: 10px' :''">
                    <div class="item" v-for="(item,i) in getItems()" :key="i" :class="{active: index == i}">
                        <div class="content" >
                            <div class="left">{{item.name}}</div>
                            <div class="right vari" v-if="item.type != 2">
                                <i class="fas fa-angle-left arrow-left" @click="backItem(item)"></i>
                                    <span>{{item.type == 0 ? item.array[item.index] : item.index }}</span>
                                <i class="fas fa-angle-right arrow-right" @click="nextItem(item)"></i>
                            </div>
                            <div v-else>
                                <RangeSlider
                                    class="slider"
                                    min="0"
                                    :max="item.max"
                                    :step="1"
                                    v-model="item.index"
                                    @input="changeSector(i,$event,tab);"
                                    >
                                </RangeSlider>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="but" @click="next">
                {{ tab != 'features' ? 'Продолжить'  : 'Закончить' }}
            </div>
        </div>
    </div>
</template>
<style lang="scss" src="../../styles/personal.scss"></style>

<script>
import RangeSlider from 'vue-range-slider';


let facial_hair = ["Нет", "Света", "Бальбо", "Круг Борода", "Гоате", "Чин", "Чин Фудз", "Ремень карандашом", "Скраффы", "Мушкетер", "Усы", "Борода", "Стержень", "Тонкая круглая", "Подкова", "Карандаш и отбивные", "Чин-ремешок-борода", "Бальбо и бадберны", "Отбивные из баранины", "Скраппи", "Усы", "Кудрявый", "Кудрявый глубокий незнакомец", "Руль", "Фаустик", "Отто и патч", "Отто и полный незнакомец", "Свет Франц", "Хэмпстед", "Амброуз", "Занавес Линкольна"]
let facial_hair_color = ["Тёмно красный","Светло красный","Красный","Тёмно оранжевый","Оранжевый","Светло Оранжевый","1","2","3","4","5","6","7","8","9",'10','11','12','13','14','15','16']
export default {
    data() {
        return {
            show: false,
            index: 0,
            sliderValue: 50,
            motherIndex: 0,
            dadIndex: 0,
            faces: [
                [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 42, 43, 44], 
                [21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 45]
            ],
            items: {
                'start': [
                    {
                        type: 0,
                        name: 'Пол',
                        array: ["Мужской","Женский"],
                        call: 'Personal_Skin',
                        camera: 0,
                        index: 0,
                    },
                    {
                        type: 1,
                        name: 'Возраст',
                        min: 18,
                        max: 99,
                        index: 25,
                        call: "PERSONAL::CHANGE_AGE"
                    },
                    {
                        type: 2,
                        name: 'Цвет кожи',
                        camera: 1,
                        index: 0,
                        call: 'Personal_ShapeMix',
                        max: 10,
                    },
                    {
                        type: 2,
                        name: 'Сходство',
                        camera: 0,
                        index: 0,
                        call: 'Personal_SkinMix',
                        max: 10,
                    },
                ],
                'exterior': [
                    
                    {
                        type: 2,
                        name: 'Волосы',
                        camera: 0,
                        index: 0,
                        call: 'Personal_Appearance',
                        data: 0,
                        max: 36,
                    },
                    {
                        type: 2,
                        name: 'Цвет волос',
                        camera: 0,
                        index: 0,
                        data: 1,
                        call: 'Personal_Appearance',
                        max: 63,
                    },
                    {
                        type: 2,
                        name: 'Цвет кончиков волос',
                        camera: 0,
                        index: 0,
                        data: 2,
                        call: 'Personal_Appearance',
                        max: 63,
                    },
                    {
                        type: 2,
                        name: 'Глаза',
                        camera: 0,
                        index: 0,
                        data: 3,
                        call: 'Personal_Appearance',
                        max: 6,
                    },
                    {
                        type: 1,
                        name: 'Торс',
                        index: 0,
                        call: 'Personal_Tors',
                        camera: 4,
                        max: 7,
                        min: 0,
                    },
                    {
                        type: 1,
                        name: 'Цвет торса',
                        index: 0,
                        call: 'Personal_Tors_Color',
                        camera: 4,
                        max: 8,
                        min: 0,
                    },
                    {
                        type: 1,
                        name: 'Нижняя одежда',
                        index: 0,
                        call: 'Personal_Down',
                        camera: 4,
                        max: 13,
                        min: 0,
                    },
                    {
                       type: 1,
                        name: 'Цвет нижней одежда',
                        index: 0,
                        call: 'Personal_Down_Color',
                        camera: 4,
                        max: 0,
                        min: 0,
                    },
                    {
                        type: 2,
                        name: 'Штаны',
                        camera: 3,
                        index: 0,
                        call: 'Personal_Pants',
                        max: 6,
                    },
                    {
                        type: 2,
                        name: 'Обувь',
                        camera: 2,
                        index: 0,
                        call: 'Personal_Footwear',
                        max: 5,
                    },
                    {
                        type: 0,
                        name: 'Борода',
                        array: facial_hair,
                        call: 'Personal_facial_hair',
                        index: 0,
                        camera: 0,
                    },
                    {
                        type: 2,
                        name: 'Цвет бороды',
                        camera: 0,
                        index: 0,
                        call: 'Personal_facial_hair_color',
                        max: 12,
                        hide: true,
                    },
                    {
                        type: 2,
                        name: 'Насыщеность бороды',
                        index: 25,
                        call: 'Personal_facial_hair_opacity',
                        max: 25,
                        hide: true,
                        camera: 0,
                    },
                    {
                        type: 2,
                        name: 'Брови',
                        camera: 0,
                        index: 0,
                        call: 'Personal_EyeBrows',
                        max: 34,
                    },
                    {
                        type: 2,
                        name: 'Цвет бровей',
                        camera: 0,
                        index: 0,
                        call: 'Personal_EyeBrows_Color',
                        max: 63,
                    },
                ],
                'features':[
                    {
                        "type": 2,
                        "name": "Ширина носа",
                        "data": 0,
                        "max": 20,
                        "index": 10,
                        "camera": 0,
                        "call": "Personal_Features"
                    },
                    {
                        "type": 2,
                        "name": "Высота носа",
                        "data": 1,
                        "max": 20,
                        "index": 10,
                        "camera": 0,
                        "call": "Personal_Features"
                    },
                    {
                        "type": 2,
                        "name": "Длина носа",
                        "data": 2,
                        "max": 20,
                        "index": 10,
                        "camera": 0,
                        "call": "Personal_Features"
                    },
                    {
                        "type": 2,
                        "name": "Профиль носа",
                        "data": 3,
                        "max": 20,
                        "index": 10,
                        "camera": 0,
                        "call": "Personal_Features"
                    },
                    {
                        "type": 2,
                        "name": "Направление носа",
                        "data": 4,
                        "max": 20,
                        "index": 10,
                        "camera": 0,
                        "call": "Personal_Features"
                    },
                    {
                        "type": 2,
                        "name": "Переносится носа",
                        "data": 5,
                        "max": 20,
                        "index": 10,
                        "camera": 0,
                        "call": "Personal_Features"
                    },
                    {
                        "type": 2,
                        "name": "Высота лба",
                        "data": 6,
                        "max": 20,
                        "index": 10,
                        "camera": 0,
                        "call": "Personal_Features"
                    },
                    {
                        "type": 2,
                        "name": "Выпуклость лба",
                        "data": 7,
                        "max": 20,
                        "index": 10,
                        "camera": 0,
                        "call": "Personal_Features"
                    },
                    {
                        "type": 2,
                        "name": "Высота щек",
                        "data": 8,
                        "max": 20,
                        "index": 10,
                        "camera": 0,
                        "call": "Personal_Features"
                    },
                    {
                        "type": 2,
                        "name": "Размер щек",
                        "data": 9,
                        "max": 20,
                        "index": 10,
                        "camera": 0,
                        "call": "Personal_Features"
                    },
                    {
                        "type": 2,
                        "name": "Размер скул",
                        "data": 10,
                        "max": 20,
                        "index": 10,
                        "camera": 0,
                        "call": "Personal_Features"
                    },
                    {
                        "type": 2,
                        "name": "Размер глаз",
                        "data": 11,
                        "max": 20,
                        "index": 10,
                        "camera": 0,
                        "call": "Personal_Features"
                    },
                    {
                        "type": 2,
                        "name": "Размер губ",
                        "data": 12,
                        "max": 20,
                        "index": 10,
                        "camera": 0,
                        "call": "Personal_Features"
                    },
                    {
                        "type": 2,
                        "name": "Ширина челюсти",
                        "data": 13,
                        "max": 20,
                        "index": 10,
                        "camera": 0,
                        "call": "Personal_Features"
                    },
                    {
                        "type": 2,
                        "name": "Длина подбородка",
                        "data": 14,
                        "max": 20,
                        "index": 10,
                        "camera": 0,
                        "call": "Personal_Features"
                    },
                    {
                        "type": 2,
                        "name": "Высотка подбородка",
                        "data": 15,
                        "max": 20,
                        "index": 10,
                        "camera": 0,
                        "call": "Personal_Features"
                    },
                    {
                        "type": 2,
                        "name": "Форма подборока",
                        "data": 16,
                        "max": 20,
                        "index": 10,
                        "camera": 0,
                        "call": "Personal_Features"
                    },
                    {
                        "type": 2,
                        "name": "Ширина подбородке",
                        "data": 17,
                        "max": 20,
                        "index": 10,
                        "camera": 0,
                        "call": "Personal_Features"
                    },
                    {
                        "type": 2,
                        "name": "Ямочка на подбородке",
                        "data": 18,
                        "max": 10,
                        "index": 5,
                        "camera": 0,
                        "call": "Personal_Features"
                    },
                    {
                        "type": 2,
                        "name": "Размер шеи",
                        "data": 19,
                        "max": 10,
                        "index": 5,
                        "camera": 0,
                        "call": "Personal_Features"
                    }
                ],
            },
            
            tab: 'start'
        };
    },
    watch: {
        index: function (val, oldVal) {
            try{

                let h = this.index*60;
                this.$refs.items.scrollTop = h;
                let item = this.getItems()[this.index];
                if(typeof item.camera != "undefined")mp.trigger('Personal_camera',item.camera)
            }catch(e){}
        },
    },
    methods: {
        start(){
            try{
                this.show = true;
                this.index = 0;
                this.tab = 'start';
            }catch(e){}
        },
        back(){
            try{
                if(this.tab == 'features')this.tab = 'exterior';
                else if(this.tab == 'exterior')this.tab = 'start';
                this.index = 0;
            }catch(e){}
        },
        next(){
            try{
                if(this.tab == 'exterior')this.tab = 'features';
                else if(this.tab == 'start')this.tab = 'exterior';
                else if(this.tab == 'features'){
                    mp.trigger('Personal_Appearance_OK');
                    this.show = false;
                }
                this.index = 0;
            }catch(e){}
        },
        backImage(type){
            try{
                if(type == 'mother'){
                    this.motherIndex = 0 != this.motherIndex ? this.motherIndex - 1  : this.faces[1].length - 1;
                    mp.trigger('Personal_Mam',this.motherIndex);
                }
                else{
                    this.dadIndex =  0 != this.dadIndex ? this.dadIndex - 1  : this.faces[0].length - 1;
                    mp.trigger('Personal_Dad',this.dadIndex);
                } 
            }catch(e){}
        },
        nextImage(type){
            try{
                if(type == 'mother'){
                    this.motherIndex = this.faces[1].length-1 > this.motherIndex ? this.motherIndex + 1  : 0;
                    mp.trigger('Personal_Mam',this.motherIndex);
                }
                else{
                    this.dadIndex = this.faces[0].length-1 > this.dadIndex ? this.dadIndex + 1  : 0;
                    mp.trigger('Personal_Dad',this.dadIndex);
                } 
            }catch(e){}
        },
        editSector(id,index,tab = 'exterior'){
            try{
                this.items[tab][id].index = index;
                let item = this.getItems()[id];
                if(item.call){
                    if(this.tab != 'features')mp.trigger(item.call,item.index,item.data)
                    else{
                        index = item.max == 20 ?  index/10-1 :  index/10;
                        mp.trigger(item.call,item.data,index)
                    }
                }
                if(typeof item.camera != "undefined")mp.trigger('Personal_camera',item.camera)
            }catch(e){}
        },
        changeSector(id,index,tab = 'exterior'){
            try{
                let item = this.getItems()[id];
                item.index = index;
                if(item.call){
                    if(this.tab != 'features')mp.trigger(item.call,item.index,item.data)
                    else{
                        index = item.max == 20 ?  index/10-1 :  index/10;
                        mp.trigger(item.call,item.data,index)
                    }
                }
                if(typeof item.camera != "undefined")mp.trigger('Personal_camera',item.camera)
            }catch(e){}
        },
        editSectorMax(id,max,tab = 'exterior'){
            try{   
                this.items[tab][id].max = max;
                this.items[tab][id].index = 0;
                let item = this.items[tab][id];
                if(item.call)mp.trigger(item.call,item.index,item.data)
            }catch(e){}
        },
        showItem(id,tab = 'exterior'){
            try{
                this.items[tab][id].hide = false;
                let index = this.index;
                this.index = 0;
                this.$nextTick(function () {
                    try{
                        this.index = index;
                   }catch(e){}
                });
            }catch(e){}
        },
        hideItem(id,tab = 'exterior'){
            try{    
                this.items[tab][id].hide = true;
                let length = this.getItems().length;
                let index = this.index;
                this.index = 0;
                this.$nextTick(function () {
                    try{
                        if(index > length-1)this.index = length-1;
                        else this.index = index;
                    }catch(e){}
                });
            }catch(e){}
        },
        getItems() {
            try{
                let items = [];
                    for(let i =0;i<this.items[this.tab].length;i++){
                        if(!this.items[this.tab][i].hide){
                            items.push(this.items[this.tab][i]);
                        }
                }
                return items;
            }catch(e){}
        },
        nextItem(item){
            try{
                if(item.hide)return;
                if(item.type == 0 ){
                    item.index = item.array.length-1 > item.index ? item.index + 1  : 0;
                    if(item.call)mp.trigger(item.call,item.index,item.data)
                    if(typeof item.camera != "undefined")mp.trigger('Personal_camera',item.camera)
                }
                if(item.type == 1 ){
                    item.index = item.max > item.index ? item.index + 1  : item.min;
                    if(item.call)mp.trigger(item.call,item.index,item.data)
                    if(typeof item.camera != "undefined")mp.trigger('Personal_camera',item.camera)
                }
            }catch(e){}
        },
        backItem(item){
            try{
                if(item.hide)return;
                if(item.type == 0 ){
                    item.index = 0 != item.index ? item.index - 1  : item.array.length-1;
                    if(item.call)mp.trigger(item.call,item.index,item.data)
                }
                if(item.type == 1 ){
                    item.index = item.min != item.index ? item.index - 1  : item.max;
                    if(item.call)mp.trigger(item.call,item.index,item.data)
                }
            }catch(e){}
        }
    },
    computed: {
        
    },
    created(){
        let personal = this;
        window.personal = this;
        $("body").keydown(function(event){
            try{
                if(!personal.show) return; 
                let items = personal.getItems();
                let item = items[personal.index];
                if(event.which == 8){
                    personal.back();
                }
                if(event.which == 40){
                    if(personal.index < items.length-1) personal.index++;
                    else personal.index = 0;
                }
                if(event.which == 38){
                    if(personal.index != 0) personal.index--;
                    else personal.index = items.length-1;
                }
                if(event.which == 39){
                    if(item.type == 2 ){
                        let index = item.max > item.index ? item.index + 1  : 0;
                        personal.changeSector(personal.index,index,personal.tab);
                    }else personal.nextItem(item);
                }
                if(event.which == 37){
                    if(item.type == 2){
                        let index = 0 != item.index ? item.index - 1  : item.max;
                        personal.changeSector(personal.index,index,personal.tab);
                    }else personal.backItem(item);
                }
            }catch(e){}
        });
    },
    components: {
        RangeSlider
    }
};
</script>