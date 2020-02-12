<template>
    <div id="help" v-if="show">
        <div class="bg"></div>
        <div class="close-button">
            <svg viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg">
                <path d="M1.707.293c-.391-.391-1.024-.391-1.414 0-.391.391-.391 1.024 0 1.414l1.414-1.414zm10.586 13.414c.391.39 1.024.39 1.414 0 .39-.391.39-1.024 0-1.414l-1.414 1.414zm1.414-12c.39-.391.39-1.024 0-1.414-.391-.391-1.024-.391-1.414 0l1.414 1.414zm-13.414 10.586c-.391.391-.391 1.024 0 1.414.391.39 1.024.39 1.414 0l-1.414-1.414zm0-10.586l12 12 1.414-1.414-12-12-1.414 1.414zm12-1.414l-12 12 1.414 1.414 12-12-1.414-1.414z"/>
            </svg>
        </div>
        <div class="container">
            <div class="top">
                <ul class="menu">
                    <li class="item"  :class="{active: table == 'news'}" @click="table = 'news'">Новости</li>
                    <li class="item" :class="{active: table == 'help'}" @click="table = 'help'">Помощь</li>
                    <li class="item"  :class="{active: table == 'regulation'}" @click="table = 'regulation'">Правила</li>
                </ul>
            </div>
            <div class="main">
                <div class="sidebar scrollbar">
                    <ul class="menu">
                        <li class="item" v-for="(bar,i) in sidebar[table]" :key="i" :class="{active: activeBar == i}" >
                            <div class="item-title" >
                                <label for="menuItemCollapse1" class="label-toggle" @click="changeSideBar(i)">{{bar.name}}</label>
                                <ul class="menu submenu">
                                    <li class="item" v-for="(item,j) in bar.items" :key="j" :class="{active:activeSubBar == j }" >
                                        <div class="item-title" @click="activeSubBar = j">
                                            <label for="menuItemCollapse6" class="label-toggle">{{item.name}}</label>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="content">
                    <helpTab v-if="table == 'news'"></helpTab>
                    <helpTab :bar="activeBar" :subBar="activeSubBar" v-if="table == 'help'"></helpTab>
                    <helpTab v-if="table == 'regulation'"></helpTab>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" src="../../styles/helpMenu.scss"></style>

<script>
import helpTab from './helpTab/index.vue';
export default {
    data() {
        return {
            show: false,
            table: 'help',
            sidebar: {
                'help': [
                    {
                        name: 'Начальные работы',
                        items: [
                            {
                                name: 'Ферма'
                            },
                            {
                                name: 'Грузчик'
                            },
                            {
                                name: 'Развозчик пиццы'
                            },
                        ]
                    },
                    {
                        name: 'Работы',
                        items: [
                            {
                                name: 'Дальнобойщик'
                            },
                            {
                                name: 'Мусорщик'
                            },
                            {
                                name: 'Эвакуаторщик'
                            },
                            {
                                name: 'Инкассатор'
                            },
                            {
                                name: 'Таксист'
                            },
                            {
                                name: 'Водитель автобуса'
                            },
                        ]
                    },
                    {
                        name: 'Дом',
                        items: []
                    },
                    {
                        name: 'Инвентарь',
                        items: []
                    },
                    {
                        name: 'Телефон',
                        items: []
                    },
                    {
                        name: 'Автомобиль',
                        items: []
                    },
                    {
                        name: 'Магазин одежды',
                        items: []
                    },
                ]
            },
            activeBar: 0,
            activeSubBar: 0 
        }
    },
    components: {helpTab},
    methods: {
        toggle(toggle){
            this.show = toggle;
            mp.trigger("guitoggle", this.show);
        },
        changeSideBar(index){
            this.activeBar = index;
            this.activeSubBar = 0;
        }
    },
    created() {
        window.helpMenu = this;
        $("body").keyup(function(event){
            if(event.which == 27 && helpMenu.show){
                helpMenu.toggle(false);
            }
        })
    },
}
</script>