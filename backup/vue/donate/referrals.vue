<template>
<div>
    <div class="main">
        <div class="left">
            <div class="playtime">
                <span>Время в игре:</span>
                <div class="time">{{ getHours(refData.inGame) }} ч</div>
            </div>
            <span>Ваш реферальный код:</span>
            <div class="input">
                <input type="text" :value="refcode" readonly />
                <svg width="15" height="18" viewBox="0 0 15 18" fill="none" xmlns="http://www.w3.org/2000/svg" v-on:click="copyCode">
                    <path opacity="0.5" fill-rule="evenodd" clip-rule="evenodd" d="M10.2632 0.315674H1.57895C0.710526 0.315674 0 1.0262 0 1.89462V12.1578C0 12.592 0.355263 12.9473 0.789474 12.9473C1.22368 12.9473 1.57895 12.592 1.57895 12.1578V2.68409C1.57895 2.24988 1.93421 1.89462 2.36842 1.89462H10.2632C10.6974 1.89462 11.0526 1.53936 11.0526 1.10515C11.0526 0.670937 10.6974 0.315674 10.2632 0.315674ZM10.7289 3.93936L14.5421 7.75252C14.8342 8.04462 15 8.44725 15 8.86567V16.1051C15 16.9736 14.2895 17.6841 13.4211 17.6841H4.72895C3.86053 17.6841 3.15789 16.9736 3.15789 16.1051L3.16579 5.05252C3.16579 4.18409 3.86842 3.47357 4.73684 3.47357H9.60789C10.0263 3.47357 10.4289 3.63936 10.7289 3.93936ZM10.2632 8.99988H13.8158L9.47368 4.65778V8.21041C9.47368 8.64462 9.82895 8.99988 10.2632 8.99988Z" fill="white"/>
                </svg>
            </div>
            <p>Ваш реферал должен ввести промокод при регистрации или в этом меню. Не забудь рассказать ему про меню F4 и куда нужно вводить код.</p>
            <span>Активировать реферальный код:</span>
            <div class="input">
                <input type="text" v-model="referral" v-on:input="e => onInputReferral(e.target.value)" >
                <div class="but" v-if="referral.length > 0" v-on:click="submitReferral">Подтвердить</div>
            </div>
            <div class="error" v-if="errorMsg.length">{{ errorMsg }}</div>
        </div>
        <div class="right">
            <div class="invited">
                <span>вас пригласил:</span>
                <div v-if="refData.referral != null">
                    <div class="gameTime">({{ getHours(refData.referral.inGame) }} ч)</div>
                    <div class="name">{{ refData.referral.name }}</div>
                </div>
                <div class="empty" v-else>отсутствует</div>
            </div>
            <div class="reward">
                <div class="invites">
                    <span>вы пригласили:</span>
                    <div class="invite" v-for="(ref, i) in refData.invitedRefs" :key="i">
                        <div class="gameTime">({{ getHours(ref.inGame) }} ч)</div>
                        <div class="name">{{ ref.name }}</div>
                    </div>
                </div>
                <div class="got">
                    <span>вы заработали:</span>
                    <div class="money">
                        <img :src="`img/donate/dollars.png`" alt="">
                        <span>{{ refData.refsIncome }}</span>
                    </div>
                    <div class="but" v-if="refData.refsIncome > 0" v-on:click="takeReward">Забрать</div>
                </div>
            </div>
        </div>
    </div>
    <div class="bottom">
        <div class="info">
            <img :src="`img/donate/user.png`" alt="">
            <div class="title">Пригласи друга</div>
            <i class="fal fa-chevron-down"></i>
        </div>
        <div class="info">
            <div class="circle">40</div>
            <div class="title">Друг должен отыграть 40 ч.</div>
            <i class="fal fa-chevron-down"></i>
        </div>
        <div class="info">
            <div class="circle">$</div>
            <div class="title">После того как ваш друг отыграет 40 ч. <br>вы оба получите по 2000$ в игре</div>
        </div>
    </div>
</div>
</template>

<script>

export default {
    props: ['refData', 'errorMsg'],
    data() {
        return {
            referral: ''
        }
    },
    methods: {
        copyCode() {
            window.copy(this.refcode);
            mp.trigger('alert','Реферальный код скопирован');
        },

        onInputReferral(value) {
            this.referral = value;
            this.errorMsg = '';
            donate.refsErrorMsg = '';
        },

        submitReferral() {
            if (this.refData.referral) {
                this.errorMsg = 'Вы уже активировали реферальный код';
                return;
            }
            mp.trigger('CallRemote','REFERRALS::ADD_REFERRAL', this.referral.trim());
            this.referral = ''
        },

        takeReward() {
            mp.trigger('CallRemote', 'REFERRALS::TAKE_REWARD', this.refData.refsIncome);
            this.refData.refsIncome = 0;
        },

        getHours(ms) {
            return  Math.floor((ms / (1000 * 60 * 60)))
        }
    },
    watch: {
        errorMsg: function(value, oldVal) {
            if (value.length > 0) this.referral = '';
        }
    },
    computed: {
        refcode() { return this.refData.refCode; }
    }
}
</script>
