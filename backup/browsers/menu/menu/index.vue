<template>
    <div class="container-wrapper" v-if="show" >
        <div class="container" :style="scale">
            <div class="menu-wrapper">
                <ul class="menu">
                    <li v-for="(tab,i) in tabs" :key="i" 
                    :class="{active: menu == tab.name}"
                    @click="menu = tab.name">
                        <a>{{tab.title}}</a>
                    </li>
                </ul>
            </div>
            <div class="content-wrapper">
                <keep-alive>
                    <account   v-if="menu == 'account'" :date="data" :transactions="transactions"/>
                    <character 
                    v-if="menu == 'character'"
                    :name="name"
                    :homes='homes' 
                    :data="data"
                    :vehicles='vehicles' 
                    :licenses="licenses"/>
                    <quests v-if="menu == 'quests'" />
                    <report :reports="reports" :admins="admins" :helpers="helpers" v-if="menu == 'report'"/>
                    <achievements v-if="menu == 'achievements'"/>
                </keep-alive>
            </div>
        </div>
    </div>
</template>
<style src="../../../styles/menu.scss" lang="scss"></style>
<script>
import account from './account.vue';
import character from './character.vue';
import quests from './quests.vue';
import report from './report.vue';
import achievements from './achievements.vue';
import { constants } from 'fs';

export default {
    data() {
        return {
            data: {

            },
            name: '',
            show: false,
            homes: [],
            rightInventory: [],
            vehicles: [],
            licenses: [],
            admins: 0,
            helpers: 0,
            tabs: [
                {
                    title: 'Персонаж',
                    name: 'character'
                },
                {
                    title: 'Аккаунт',
                    name: 'account'
                },
                // {
                //     title: 'Квесты',
                //     name: 'quests'
                // },
                {
                    title: 'Репорт',
                    name: 'report'
                },
                // {
                //     title: 'Достижения',
                //     name: 'achievements'
                // },
            ],
            transactions: [],
            menu: 'character',
            scale: '',
            reports: []
        };
    },
    components: {account,character,quests,report,achievements},
    methods: {
        setInfo(info){
            if(info.transactions){
                this.transactions = info.transactions;
                delete info.transactions
            }
            if(info.reportsMessage){
                this.reports = info.reportsMessage;
                delete info.reportsMessage
            }
            if(info.licenses){
                for (let i = 0; i < info.licenses.length; i++) {
                    this.licenses[info.licenses[i]] = true;
                }
                delete info.licenses
            }
            this.data = Object.assign(this.data,info);
        },
        togleMenu(){
            this.show = !this.show;
        },
        addtransaction(info,money){
            this.transactions.push(info);
            this.money = money;
        },
        addReportMessage(message){
            this.reports.push(message)
        }
    },
    computed: {
    },
    created(){
        window.menu = this;
        let defaultHeight = 960;
        let currentHeight = window.innerHeight;
        let scaleCoeff = currentHeight / defaultHeight;

        this.scale = `transform: scale(${scaleCoeff})`;
    },
};
</script>