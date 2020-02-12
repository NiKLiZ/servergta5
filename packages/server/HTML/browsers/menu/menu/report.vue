<template>
    <div class="content" id="report">
        <div class="report-basic">
            <div class="report-basic-info">
                <div class="info-block">
                    <div class="title">Администраторов в сети:</div>
                    <div class="value">{{admins  || 'Нет'}}</div>
                </div>
                <div class="info-block">
                    <div class="title">Хелперов в сети:</div>
                    <div class="value">{{helpers || 'Нет'}}</div>
                </div>
            </div>
            <div class="report-forms">
                <div class="report-form complaint">
                    <div class="title-block">
                        <div class="title">Отправить жалобу</div>
                        <div class="icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 21">
                                <path d="M15.668 7.453l-1.608-1.166.059-.079c.268-.357.19-.86-.173-1.123l-1.608-1.166.13-.173c.268-.357.19-.86-.173-1.123l-2.265-1.643c-.174-.126-.392-.18-.607-.148-.214.032-.407.146-.535.318l-.13.173-1.608-1.166c-.363-.263-.874-.187-1.142.17l-1.944 2.593-.562-.296c-.202-.106-.441-.124-.657-.049-.216.075-.39.236-.48.444l-2.301 5.332c-.109.252-.079.541.078.767l4.217 6.066-.669 4.895c-.06.44.254.844.701.903l.11.007c.403 0 .753-.293.808-.696l.711-5.201c.027-.197-.021-.396-.135-.56l-4.141-5.958 1.777-4.118 4.581 2.41-.579.772-1.608-1.166c-.363-.263-.874-.187-1.142.17-.268.357-.19.86.173 1.123l2.266 1.643 2.265 1.643 2.266 1.643c.146.106.316.157.484.157.135 0 .269-.034.389-.098l-.11.899-1.567 1.672c-.149.159-.227.371-.215.588l.238 4.331c.023.428.384.76.815.76l.045-.001c.45-.024.796-.403.771-.846l-.219-3.993 1.512-1.613c.116-.124.19-.281.21-.448l.469-3.819 1.278-1.705c.268-.357.19-.86-.173-1.123zm-8.829-5.527l.95.689-1.217 1.624-1.053-.554zm1.189 3.078l1.691-2.256.951.689-1.589 2.12zm2.017 1.974l.121-.161 1.203-1.606.95.689-.056.075-.004.005-2.473 3.299-.951-.689zm2.008 3.944l-.951-.689 1.988-2.653.951.69-.929 1.24z"/>
                            </svg>
                        </div>
                    </div>
                    <div class="form-input">
                        <input type="text" placeholder="Введите текст" v-model="reportText">
                    </div>
                    <div class="form-btn">
                        <div class="btn" @click="reportSend">Отправить</div>
                    </div>
                </div>
                <div class="report-form question">
                    <div class="title-block">
                        <div class="title">Задать вопрос</div>
                        <div class="icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17 20">
                                <path d="M15.111 0h-13.222c-1.039 0-1.889.857-1.889 1.905v13.333c0 1.048.85 1.905 1.889 1.905h3.778l2.833 2.857 2.833-2.857h3.778c1.039 0 1.889-.857 1.889-1.905v-13.333c0-1.048-.85-1.905-1.889-1.905zm-5.667 15.238h-1.889v-1.905h1.889zm1.983-7.333l-.85.857c-.756.667-1.133 1.238-1.133 2.667h-1.889v-.476c0-1.048.378-2 1.133-2.667l1.133-1.238c.378-.286.567-.762.567-1.333 0-1.048-.85-1.905-1.889-1.905-1.039 0-1.889.857-1.889 1.905h-1.889c0-2.095 1.7-3.81 3.778-3.81 2.078 0 3.778 1.714 3.778 3.81 0 .857-.378 1.619-.85 2.19z"/>
                            </svg>
                        </div>
                    </div>
                    <div class="form-input">
                        <input type="text" placeholder="Введите текст" v-model="askText">
                    </div>
                    <div class="form-btn">
                        <div class="btn"  @click="askSend">Отправить</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="report-history">
            <div class="title">История ваших репортов/вопросов</div>
            <div class="scrollable">
                <div class="report-history-row" v-for="(report, i) in reportReverse" :key="i" :class="{answered: report.answered}">
                    <div class="row-content">
                        <!-- <div class="number">111</div> -->
                        <div class="text">{{report.text}}</div>
                        <div class="status">{{report.answered ? "Ответ" : 'Вопрос' }}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            reportText: '',
            askText: '',
        }
    },
    methods:{
        reportSend(){
            mp.trigger('CallRemote','MENU::REPORT_SEND',this.reportText)
            this.reportText = '';
        },
        askSend(){
            mp.trigger('CallRemote','MENU::ASK_SEND',this.askText)
            this.askText = '';
        }
    },
    computed: {
        reportReverse(){
            return this.reports.reverse();
        },
    },
    props: ['reports','admins','helpers']
}
</script>