<template>
    <div v-if="show" id="input-call">
        <div class="title">{{title}}</div>
        <div class="main">  
            <div id="placeholder">{{placeholder}}</div>
            <div class="input"> 
                <input v-model.number="value" v-bind:type="type_input">
            </div>
            <div class="buttons"> 
                <div class="button" @click="callback()" id="two">{{success}}</div>
                <div class="button" @click="hide" id="one">{{close}}</div>
            </div>
        </div>
    </div>
</template>
<style src="../../styles/input-call.scss" lang="scss"></style>

<script>
export default {
    data() {
        return {
            title: 'ПРОДАЖА ТРАНСПОРТА',
            placeholder: 'Укажите цену',
            close: 'Отмена',
            success: 'Подтвердить',
            placeholder_input: 'Цифра',
            type_input: 'number',
            value: '',
            show: false,
            callback_close: null
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
        }
    },
    computed: {
        
    },
    created(){
        let input_call = this;
        window.Create_Input_call = function(title,placeholder,placeholder_input = 'Цифра',type_input = 'number', success = 'Подтвердить',close = 'Отмена') {
            input_call.show = true;
            input_call.title = title;
            input_call.placeholder = placeholder;
            input_call.success = success;
            input_call.close = close;
            input_call.placeholder_input = placeholder_input;
            input_call.number = type_input;
            input_call.value = '';
            mp.trigger("guitoggle", true);
        }
        $("body").keyup(function(event){
            if(event.which == 27 && input_call.show){
                input_call.hide();
            }
        })
    },
};
</script>