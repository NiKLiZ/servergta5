<template>
  <div v-if="show" class="table" id="table">
    <div @click="show = false;trigger('guitoggle', false);"  class="exit"><i class="fas fa-times"></i></div>
        <div class="title">
        {{title}}
        </div>
        <div class="list">
        <table>
            <thead>
            <tr>
                <th v-for="column in columns" :key="column">
                <span>
                    {{ column }} 
                </span>
                </th>
            </tr>
            </thead>
            <tbody>
                <tr v-for="(dat,index) in data" @click="callback(dat.data)" :key="index">
                    <td v-for="key in keys" :key="key">{{dat[key]}}</td>
                </tr>
            </tbody>
            </table>
        </div>
    </div>
</template>
<style src="../../styles/table.scss"></style>

<script>
export default {
    data() {
        return {
            show: false,
            title: 'ПРОДАЖА ТРАНСПОРТА',
            columns: ['№', 'NAME'],
            data: [{
                name: '353',
                sdasa: '353',
                data: ['353',35],
            }]
        };
    },
    methods: {
        hide: function (){
            this.show = false;
            if(this.callback_close) this.callback_close();
            mp.trigger("guitoggle", this.show);
        },
        callback: function (){
            this.show = false;
            mp.trigger("INPUT_CALL::calback", this.value);
            mp.trigger("guitoggle", this.show);
        },
        trigger(...args){
            mp.trigger(...args)
        },
         callback: function(data) {
            this.show = false;
            mp.trigger("guitoggle",true);
            if(typeof data === "object") mp.trigger("Table::calback",...data);
            else mp.trigger("Table::calback", data);
        },
    },
    computed: {
        keys() {
            let keys = Object.keys(this.data[0]);
            if(keys.indexOf('data') > 0) keys.splice(keys.indexOf('data'),1) 
            return keys;
        }
    },
    created(){
        let table_vue = this;
        window.Create_table = (title,colums,data)=>{
            table_vue.show = true;
            mp.trigger("guitoggle", true);
            table_vue.title = title;
            table_vue.colums = colums;
            table_vue.data = data;
        }
        $("body").keyup(function(event){
            if(event.which == 27 && table_vue.show){
                table_vue.hide();
            }
        })
    },
};
</script>