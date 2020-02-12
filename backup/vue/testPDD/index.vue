<template>
    <div class="testpdd" v-if="show">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-sm-5" v-if="licensesShow">
                    <div class="window" >
                        <img :src="`img/testpdd/ICON.png`" alt="">
                        <h4>Выберите на какие права вы хотите сдать:</h4>
                        <div class="form">
                            <div class="item" v-for="(license,i) in licenses" :key="i" @click="indexLicense = i" :class="{active: indexLicense == i }">
                                <p>{{license.name}} {{license.price}}$  <i v-if="indexLicense == i" class="fas fa-check"></i></p> 
                            </div>
                        </div>  
                    </div>
                    <div class="button" @click="licenseNext">Продолжить</div>
                   <div class="exit" @click="hide">Закрыть окно</div>
                </div>
                <div class="col-sm-5" v-else-if="helpShow">
                    <div class="window help" >
                        <img :src="`img/testpdd/ICON.png`" alt="">
                        <h5>Со скольки лет можно управлять ТС? <br>Ответ: 18</h5> 
                        <h5>Разрешено ли движение задним ходом на магистрали? Ответ: Нет, не разрешено</h5> 
                        <h5>Что необходимо сделать при ДТП? Ответ: Позвонить в службу 911</h5> 
                        <h5>Когда в городе можно включать дальний <br>свет фар? Ответ: Ночью</h5> 
                        <h5>С какой стороны разрешен обгон ТС? <br>Ответ: С левой</h5> 
                        <h5>Какова максимальная скорость ТС по <br> городу? Ответ: 60км/ч</h5> 
                    </div>
                    <div class="button" @click="helpShow = false">Продолжить</div>
                    <div class="exit" @click="hide">Закрыть окно</div>
                </div>
                <div class="col-sm-5" v-else-if="!endTestShow">
                    <div class="window" >
                        <img :src="`img/testpdd/ICON.png`" alt="">
                        <h4>Вопрос {{question+1}} / {{maxQuestions}}</h4>
                        <h5>{{questinoRand.question}}</h5>
                        <div class="form">
                            <div class="item" v-for="(answer,i) in questinoRand.answers" :key="i" @click="indexAnswer = i" :class="{active: indexAnswer == i }">
                                <p>{{answer}} <i v-if="indexAnswer == i" class="fas fa-check"></i></p> 
                            </div>
                        </div>  
                    </div>
                    <div class="button" @click="answerClick">Следующий&nbsp;вопрос</div>
                    <div class="exit" @click="hide">Закрыть окно</div>
                </div>
                <div class="col-sm-5" v-else>
                    <div class="item">
                    <div class="window">
                        <img :src="`img/testpdd/ICON.png`" alt="">
                        <h4>Тест окончен</h4>
                        <div class="answers">
                            <p>Верных&nbsp;ответов:<br><span>{{acceptAnswer}}</span></p>
                            
                            <p>Неверных&nbsp;ответов:<br><span>{{errorAnswer}}</span></p>                        
                        </div>
                    </div>
                    <div class="inline">
                        <div class="button" @click="start(false)">Перезапустить тест</div>
                        <div class="button" @click="helpShow = true">Повторить теорию</div>
                    </div>
                    <div class="exit" @click="hide">Закрыть окно</div>
                    </div>
                </div>
            </div>  
        </div>
    </div>
</template>
<style src="../../styles/testpdd.scss" lang="scss"></style>

<script>
export default {
    data() {
        return {
            show: false,
            indexLicense: 0,
            licensesShow: true,
            endTestShow: false,
            helpShow: false,
            licenses:[
                {
                    name: "легковые",
                    price: 350
                },
                {
                    name: "лодки",
                    price: 550
                },
                {
                    name: "самолёт",
                    price: 1500
                },
            ],
            questions: [
                {
                    question: "Со скольки лет можно управлять машиной?",
                    img: "",
                    answers: ["с 16","с 18","с 25"],
                    answer: 1
                },
                {
                    question: "Какова максимальная скорость ТС по городу?",
                    img: "",
                    answers: ["60 км/ч","20 км/ч" ,"150 км/ч"],
                    answer: 0
                },
                {
                    question: "Когда в городе можно включать дальний свет фар?",
                    img: "", 
                    answers: ["Днём","Утром" ,"Ночью"],
                    answer: 2
                },
                {
                    question: "Разрешено ли движение задним ходом на магистрали?",
                    img: "",
                    answers: ["Нет, не разрешен","Всегда разрешен" ,"Разрешен в случае поворота впереди идущего ТС"],
                    answer: 0
                },
                {
                    question: "С какой стороны разрешен обгон ТС?",
                    img: "",
                    answers: ["С правой","С левой" ,"Запрещен"],
                    answer: 1
                },
                {
                    question: "Что необходимо сделать при ДТП?",
                    img: "",
                    answers: ["Позвонить в службу 911","Уехать с места ДТП" ,"Уступить дорогу и обеспечить беспрепятственный проезд"],
                    answer: 0
                },
            ],
            acceptAnswer: 0,
            errorAnswer: 0,
            questioRand: [],
            question: 0,
            traversed: [],
            indexQuestion: 0,
            indexAnswer: 0,
            maxQuestions: 0,
        };
    },
    methods: {
        start(help = true){
            this.licensesShow = false;
            this.restartTest();
            this.show = true;
            this.newQuestion();
            if(help)this.helpShow = true;
        },
        answerClick(){
            if(this.questinoRand.answer == this.indexAnswer){
                this.acceptAnswer++;
            }else {
                this.errorAnswer++;
            }
            this.indexAnswer = 0;
            this.question++;
            this.newQuestion();
        },
        newQuestion(){
            if (this.traversed.length == this.maxQuestions){
                this.endTest();
            }else{
                let rand =  this.randQuestion();
                this.indexQuestion = rand;
                this.questinoRand = this.questions[rand];
            }
        },
        randQuestion(){
            while(true){
                let result = Math.floor(Math.random() * this.questions.length);
                if (this.traversed.indexOf(result) == -1) {
                    this.traversed.push(result);
                    return result;
                }
            }
        },
        endTest(){
            if(this.errorAnswer!=0){
                this.endTestShow = true;
            }else{
                this.restartTest();
                mp.trigger('testpddpassed');
                this.show = false;
            }
        },
        restartTest(){
            this.traversed = [];
            this.question = 0;
            this.errorAnswer = 0;
            this.acceptAnswer = 0;
            this.indexAnswer = 0;
            this.endTestShow = false;
            this.helpShow = false;
            this.maxQuestions = this.questions.length;
        },
        hide(){
            this.show = false;
            mp.trigger('guitoggle', false);
            this.licensesShow = true;
            this.endTestShow = false;
            this.helpShow = false;
        },
        licenseNext(){
            mp.trigger('CallRemote','LSMYC::CHECK',this.indexLicense);
        }
    },
    computed: {
    },
    created(){
        window.testpdd = this;
        $("body").keyup(function(event){
            if(event.which == 27 && testpdd.show){
                testpdd.hide();
            }
        })
    },
};
</script>
