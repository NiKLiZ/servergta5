<template>
    <div class="authorization" v-if="show">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-sm-7">
                <div class="authorization-head">
                    <img :src="$root.cdn+'img/authorization/logo.png'"   alt="">
                </div>
            </div>
                <div class="col-sm-7" v-if="hasLog">
                    <div class="auth">
                        <h2>Вход в аккаунт</h2>
                        <input v-model="login" type="text" placeholder="Логин/E-mail" @keyup.enter="focus('passwordInput')">
                        <input v-model="password" type="password" placeholder="Пароль" ref="passwordInput" @keyup.enter="auth">
                        <div class="password">
                            <div class="password-checkpoint" @click="hasRememberMe = !hasRememberMe" :class="{active: hasRememberMe}">
                            </div>
                            <p>Запомнить меня</p>
                            <a >Восстановить пароль</a>
                        </div>
                        <div class="button" @click="auth">Вход</div>
                        <div class="registration" @click="hasLog = false">
                            <a >Регистрация</a>
                        </div>
                    </div>
                </div>
                <div class="col-sm-7" v-else>
                    <div class="registration">
                    <h2>Регистрация</h2>
                    <div class="form">
                        <input v-model="regName" type="text" placeholder="Имя" @keyup.enter="focus('regSurnameInput')">
                        <input v-model="regSurname" type="text" placeholder="Фамилия" ref="regSurnameInput" @keyup.enter="focus('regEmailInput')">
                        <input v-model="regEmail" type="text" placeholder="E-mail" ref="regEmailInput" @keyup.enter="focus('regPasswordInput')">
                        <input v-model="regPassword" type="password" placeholder="Пароль" ref="regPasswordInput" @keyup.enter="focus('regPasswordTestInput')">
                        <input v-model="regPasswordTest" type="password" placeholder="Повторите пароль" ref="regPasswordTestInput" @keyup.enter="focus('regPeomoInput')">
                        <input v-model="regPromo" type="text" placeholder="Реферальный код (необязательно)" ref="regPeomoInput" @keyup.enter="auth">
                    </div>
                    <div class="button" @click="auth">Зарегистрироваться</div>
                    <div class="checkReg">
                        <div class="password-checkpoint" @click="hasRememberMe = !hasRememberMe" :class="{active: hasRememberMe}">
                        </div>
                        <p>Запомнить меня</p>
                    </div>
                    <p class="hasReg">Уже зарегистрированы?</p>
                    <a @click="hasLog = true">Вход</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style src="../../styles/authorization.scss" lang="scss"></style>

<script>
import { connect } from 'net';
export default {
    data() {
        return {
            hasLog: true,
            show: false,
            password: '',
            login: '',
            hasRememberMe: false,
            regName: '',
            regSurname: '',
            regPassword: '',
            regPasswordTest: '',
            regEmail: '',
            regPromo: '',
        };
    },
    methods: {
        hide(){
            this.show = false;
        },
        start(login,hasReg = false){
            try{

                this.hasLog = !hasReg;
                this.login = login;
                this.show = true;
            }catch(e){}
        },
        auth(){
            try{

                let emailFilter = /^\b[-._0-9a-zA-Z]+@[-._0-9a-zA-Z]+[\.]{1}[0-9a-zA-Z]+[\.]?[0-9a-zA-Z]\b$/;
                if(this.hasLog){
                    let email = this.login;
                    let pass = this.password;
                    let check = this.hasRememberMe;
                    if(email.length<1)return mp.trigger('alert',`Вы не ввели E-mail`,1);
                    if(pass.length<1)return mp.trigger('alert',`Вы не ввели пароль`,1);
                    if(!emailFilter.test(email) && !/([A-z]{1,})_([A-z]{1,})/.test(email) && !/([A-z]{1,}) ([A-z]{1,})/.test(email))return mp.trigger('alert',`Неверный логин`,1);
                    mp.trigger('AUTHORIZETE::CHECK_AUTH',email,pass,check);
                }else{
                    let name = this.regName;
                    let surname = this.regSurname;
                    let pass = this.regPassword;
                    let pass_test = this.regPasswordTest;
                    let email = this.regEmail;
                    let regPromo = this.regPromo;
                    let check = false;
                    let userFilter = /^([a-zA-Z0-9_\-])+$/;
                    let passFilter = /^[a-zA-Z0-9,!,%,&,@,#,$,\^,*,?,_,~,+]*$/;
                    if(name.length<1)return mp.trigger('alert',`Имя должно быть больше 3 символов`,1);
                    if(surname.length<1)return mp.trigger('alert',`Фамилия должно быть больше 3 символов`,1);
                    if(email.length<1)return mp.trigger('alert',`Вы не ввели E-mail`,1);
                    if(pass.length<1)return mp.trigger('alert',`Вы не ввели пароль`,1);
                    if(!userFilter.test(name))return mp.trigger('alert',`Имя должно состоять из английских букв`,1);
                    if(!userFilter.test(surname))return mp.trigger('alert',`Фамилия должно состоять из английских букв`,1);
                    if(!emailFilter.test(email))return mp.trigger('alert',`Неверный E-mail`,1);
                    if(!passFilter.test(pass))return mp.trigger('alert',`Пароль должен состоять из англиских букв и должен быть больше 5`,1);
                    if(pass != pass_test) return mp.trigger('alert','Пароли не совпадает');
                    mp.trigger('AUTHORIZETE::CHECK_REG',name,surname,pass,email,check,regPromo);
                }
            }catch(e){
                console.error(e)
            }
        },
        focus(ref){
            try{

                this.$refs[ref].focus();
            }catch(e){
                console.error(e)
            }
        }
    },
    computed: {
    },
    created(){
        window.auth = this;
    },
};
</script>