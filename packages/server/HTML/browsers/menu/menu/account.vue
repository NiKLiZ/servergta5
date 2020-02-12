<template>
    <div class="content" id="account">
        <div class="basic-info">
            <div class="info">
                <div class="row">
                    <div class="title">Статус:</div>
                    <div class="value">{{date.permision != 'default' ? date.permision : 'Отсутствует'}}</div>
                </div>
                <div class="row">
                    <div class="title">Предупреждения:</div>
                    <div class="value">{{date.warn}} / 3</div>
                </div>
                <div class="row">
                    <div class="title">Баны:</div>
                    <div class="value">{{date.bans}}</div>
                </div>
                <div class="row">
                    <div class="title">Убийств:</div>
                    <div class="value">{{date.kills}}</div>
                </div>
                <div class="row">
                    <div class="title">Смертей:</div>
                    <div class="value">{{date.deaths}}</div>
                </div>
            </div>
            <div class="info align-end text-right">
                <div class="row">
                    <div class="title">IP:</div>
                    <div class="value">{{date.regIp}}</div>
                </div>
                <div class="row">
                    <div class="title">Последний IP:</div>
                    <div class="value">{{date.lastIp}}</div>
                </div>
                <div class="row">
                    <div class="title">Время в игре:</div>
                    <div class="value">{{gameDate}}</div>
                </div>
                <div class="row">
                    <div class="title">Последний вход:</div>
                    <div class="value">{{getDate(date.lastJoinDate)}}</div>
                </div>
                <div class="row">
                    <div class="title">Дата регистрации:</div>
                    <div class="value">{{getDate(date.regDate)}}</div>
                </div>
            </div>
        </div>
        <div class="additional-info">
            <div class="title">Последние транзакции</div>
            <div class="transactions">
                <div class="scrollable">
                    <div class="row" v-for="(transaction,index) in transactionsReverse" :key="index">
                        <div class="row-content">
                            <div class="title">{{transaction.title}}</div>
                            <div class="value green" v-if="transaction.money > 0">+ $ {{transaction.money}}</div>
                            <div class="value red" v-else>- $ {{getTransactionMoney(transaction.money)}}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import moment from 'moment';
import 'moment/locale/ru.js';
export default {
    data() {
        return {
        }
    },
    methods: {
        getDate(date){
            return moment(date).locale("ru").format('YYYY-MM-DD H:m:s')
        },
        getTransactionMoney(money){
           return Math.abs(money);
        }
    },
    computed: {
        transactionsReverse(){
            return this.transactions.reverse();
        },
        gameDate(){
            return moment.duration(this.date.gameTime).locale("ru").humanize()
        },
    },
    props: ['date','transactions']
}
</script>