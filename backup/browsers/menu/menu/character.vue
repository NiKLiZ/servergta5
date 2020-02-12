<template>
    <div class="content" id="character">
        <div class="basic-info">
            <div class="avatar-wrapper">
                <div class="avatar">
                    <img :src="`img/menu/avatars/avatar1.png`" alt="">
                </div>
                <div class="lvl">{{data.level}}</div>
            </div>
            <div class="info">
                <div class="row">
                    <div class="name">{{name}}</div>
                    <div class="gender">
                        <div class="icon" :style=" data.gender == 0 ? 'transform: rotate(135deg);' : ''">
                            <svg viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" >
                                <path d="M16.87 0h-4.843c-.624 0-1.13.506-1.13 1.13 0 .624.506 1.13 1.13 1.13h2.114l-2.742 2.742c-1.185-.862-2.642-1.371-4.215-1.371-3.961 0-7.184 3.223-7.184 7.184 0 3.961 3.223 7.184 7.184 7.184 3.961 0 7.184-3.223 7.184-7.184 0-1.573-.509-3.03-1.37-4.215l2.742-2.742v2.114c0 .624.506 1.13 1.13 1.13.624 0 1.13-.506 1.13-1.13v-4.843c0-.624-.506-1.13-1.13-1.13zm-9.686 15.739c-2.715 0-4.923-2.209-4.923-4.923 0-2.715 2.209-4.923 4.923-4.923 2.715 0 4.923 2.209 4.923 4.923 0 2.715-2.209 4.923-4.923 4.923z"/>
                            </svg>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="title">Номер телефона:</div>
                    <div class="value" :class="{empty:!data.numberPhone}">{{data.numberPhone || 'Отсутствует'}}</div>
                </div>
                <div class="row">
                    <div class="title">Работа:</div>
                    <div class="value" :class="{empty:!data.job}">{{data.job || 'Отсутствует'}}</div>
                </div>
                <div class="row">
                    <div class="title">Организация:</div>
                    <div class="value" :class="{empty:!data.fraction}">{{data.fraction || 'Отсутствует'}}</div>
                </div>
                <div class="row">
                    <div class="title">Бизнес:</div>
                    <div class="value" :class="{empty:!data.busines}">{{data.busines || 'Отсутствует' }}</div>
                </div>
                <div class="row">
                    <div class="title">Лицензии:</div>
                    <ul class="licenses">
                        <li class="driving" :class="{active: licenses['driving']}">
                            <div class="icon">
                                <svg viewBox="0 0 18 16" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M15.92 1.01c-.2-.59-.76-1.01-1.42-1.01h-11c-.66 0-1.21.42-1.42 1.01l-1.97 5.67c-.07.21-.11.43-.11.66v7.16c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-.5h12v.5c0 .82.67 1.5 1.5 1.5.82 0 1.5-.67 1.5-1.5v-7.16c0-.22-.04-.45-.11-.66l-1.97-5.67zm-12.42 9.99c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm-12.5-5l1.27-3.82c.14-.4.52-.68.95-.68h9.56c.43 0 .81.28.95.68l1.27 3.82h-14z"/>
                                </svg>
                            </div>
                        </li>
                        <li class="boating" :class="{active: licenses['rightBoat']}">
                            <div class="icon">
                                <svg viewBox="0 0 19 16" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10.991 0v11.313h5.725l-5.725-11.313zM9.07 11.313v-11.179c-5.698 2.204-8.252 10.613-8.205 11.179h8.205zM0 12.556l4.246 3.444h10.507l4.246-3.444h-19z"/>
                                </svg>
                            </div>
                        </li>
                        <li class="flighting" :class="{active: licenses['rightPlane']}">
                            <div class="icon">
                                <svg viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M17.491.509c-.688-.688-1.807-.676-2.481.026l-3.687 3.842-8.999-2.978-1.889 1.889 7.501 4.618-3.795 3.955-2.434-.399-1.707 1.707 3.578 1.253 1.253 3.578 1.707-1.707-.4-2.434 3.955-3.795 4.618 7.501 1.889-1.889-2.978-8.999 3.842-3.687c.702-.674.713-1.793.026-2.481z"/>
                                </svg>
                            </div>
                        </li>
                        <li class="gun" :class="{active: licenses['gun']}">
                            <div class="icon">
                                <svg viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M.14 15.619l1.657 1.947s.585.821 1.005.206c.421-.614 2.941-5.686 2.941-5.686s.253-.414.43.325 1.632 4.317 1.632 4.317.22.302.484.079l1.323-1.107s.357-.112-.013-.813c-.371-.703-1.729-3.899-1.729-3.899s-.199-.41.089-.65c.287-.239.657-.514.657-.514s.165-.338.62.018c.454.356 1.756 1.664 3.762 2.157 2.005.494 3.76.56 3.76.56s.43.016.49-.713c.063-.725.026-1.744.026-1.744s.041-.486-.389-.5c-.429-.015-1.158.148-2.076-.133-.919-.28-2.994-1.787-2.994-1.787s-.333-.259-.024-.519l2.47-2.068s.371-.275.147-.537l-.335-.393 3.925-3.289-.746-.876-3.925 3.288-.322-.289s-.287-.248-.529-.044l-2.775 2.285s-.714-.749-1.242-.306l-3.747 3.142s-.14.191-.03.586c.11.396.311.676.112.842l-1.234 1.035s-.29.28-.253.813c.037.531-.259 1.114-.832 1.596-.572.48-2.224 1.826-2.224 1.826s-.485.407-.113.845zM14.997 2.229l-1.545-1.816c-.231-.271-.901-.51-.983.441-.092 1.095-.194 2.569-.194 2.569l1.146.037s-.056-.604-.139-.907c-.104-.377.076-.562.282-.319l.592.691.84-.698zM7.904 11.5l.655-.549c.291-.244.573-.791.33-1.515-.242-.724.712.104.712.104s.5 1.138-.353 1.852c-.857.72-1.235 1.005-1.235 1.005l-.109-.897z"/>
                                </svg>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="money">
                <div class="row cash">
                    <div class="icon">
                        <svg viewBox="0 0 16 13" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15 5.473c0-.367-.309-.665-.691-.665h-3.955c-.381 0-.691.298-.691.665v1.995c0 .367.309.665.691.665h3.955c.381 0 .691-.298.691-.665v-1.995zm-3.358 1.781c-.445 0-.805-.347-.805-.775 0-.428.36-.775.805-.775.445 0 .805.347.805.775 0 .428-.36.775-.805.775zM8.754 3.901h5.116v-1.995c0-.5-.401-.907-.921-.907h-10.987c-.519 0-.963.407-.963.907v9.187c0 .5.443.907.963.907h10.987c.519 0 .921-.407.921-.907v-2.055h-5.107l-.009-5.137z"/>
                        </svg>
                    </div>
                    <div class="value">{{getMoney(data.money)}}</div>
                </div>
                <div class="row bank">
                    <div class="icon">
                        <svg viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2.485 10.477h9.03v-7.89h-9.03v7.89zm3.057-5.188c.567 0 1.044.399 1.178.937h2.655v.612h-2.655c-.134.538-.611.937-1.178.937-.67 0-1.215-.558-1.215-1.243s.545-1.243 1.215-1.243zM1 1v11.065h.875v.935h1.047v-.935h8.155v.935h1.047v-.935h.875v-11.065h-12zm.886 10.09v-9.114h10.227v9.114h-10.227z"/>
                        </svg>
                    </div>
                    <div class="value">{{getMoney(data.moneyBank)}}</div>
                </div>
            </div>
        </div>
        <div class="additional-info">
            <div class="tabs-container">
                <ul class="tabs">
                    <div class="tab" :class="{active: menu == 'home'}">
                        <a @click="changeMenu('home')">
                            <div class="property icon">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17 15">
                                    <path d="M8.5 0c-.399 0-.799.147-1.104.439l-7.396 7.107 1.104 1.061 1.152-1.109v6.002c0 .828.699 1.5 1.561 1.5h9.367c.862 0 1.561-.672 1.561-1.5v-6.002l1.152 1.109 1.104-1.061-7.396-7.107c-.304-.292-.704-.439-1.104-.439z"/>
                                </svg>
                            </div>
                            <div class="title">Недвижимость</div>
                        </a>
                    </div>
                    <div class="tab" :class="{active: menu != 'home'}">
                        <a @click="changeMenu('vehicle')">
                            <div class="vehicles icon">
                                <svg viewBox="0 0 21 16" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10 0h-7c-1.66 0-3 1.34-3 3v8c0 1.66 1.34 3 3 3l-.77.77c-.28.28-.28.72 0 1s.72.28 1 0l1.77-1.77h2v-5h-4.5c-.28 0-.5-.22-.5-.5v-6c0-.28.22-.5.5-.5h8c.28 0 .5.22.5.5v1.5h2v-1c0-1.66-1.34-3-3-3zm-7 10c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm15.57-4.34c-.14-.4-.52-.66-.97-.66h-7.19c-.46 0-.83.26-.98.66l-1.42 4.11v5.24c0 .55.45.99 1 .99s1-.45 1-1v-1h8v1c0 .55.45 1 1 1s.99-.44 1-.99l-.01-5.24-1.43-4.11zm-7.8.34h6.48c.21 0 .4.14.47.34l.69 2c.11.32-.13.66-.47.66h-7.85c-.34 0-.58-.34-.47-.66l.69-2c.05-.2.24-.34.46-.34zm-.77 6c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm8 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/>
                                </svg>
                            </div>
                            <div class="title">Транспорт</div>
                        </a>
                    </div>
                </ul>
                <div class="tabs-content" >
                    <div class="tab-content"  :class="{active: menu == 'home'}">
                        <div class="scrollable">
                            <div class="row" v-for="(home,i) in homes" :key="i">
                                <div class="image">
                                    <img alt="">
                                </div>
                                <div class="description">
                                    <div class="title">{{home.name}}</div>
                                    <div class="price">{{home.price}}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="tab-content" :class="{active: menu == 'vehicle'}">
                        <div class="scrollable">
                            <div class="row" v-for="(vehicle,i) in vehicles" :key="i">
                                <div class="image">
                                    <!-- <img :src="`img/menu/vehicles/vehicle1.png`" alt=""> -->
                                    <div class="mileage">
                                        <!-- <div class="value">1.9 КМ</div> -->
                                        <!-- <div class="title">Пробег</div> -->
                                    </div>
                                </div>
                                <div class="description">
                                    <div class="title">{{vehicle.model}}</div>
                                    <div class="vehicle-type">Легковой</div>
                                    <div class="plate">
                                        <div class="title">Рег. номер</div>
                                        <div class="value">{{vehicle.numberPlate.toLocaleUpperCase()}}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<script>
import { type } from 'os';
export default {
    data() {
        return {
            menu: 'home',
        }
    },
    methods: {
        changeMenu(menu){
            this.menu = menu;
        },
        getMoney(money){
            if(typeof money == "undefined")return 'Отсутствует'
            let n = money + "";
            n = n.replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');;
            return `${n}`
        }
    },
    computed: {
        transactionsReverse(){
            return this.transactions.reverse();
        },
    },
    props: ['transactions','homes','vehicles','name','data','licenses']
}
</script>