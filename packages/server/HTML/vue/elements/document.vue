<template>
 <div class="document" v-if="show" >
    <div @click="close" class="exit"><i class="fas fa-times"></i></div>
    <div class="main">
        <div class="title">{{title}}</div>
        <img :src="$root.cdn+'img/documents/photo.png'" id="photo">
        <div class="passport">
            <ul>
                <li v-for="(item,i) in keysItems" :key="i">
                    <div class="value"><span>{{item}}</span><br> {{items[item]}}</div>
                </li>
            </ul>
        </div>
        </div>
    </div>
</template>
<style lang="scss">

.document{
	background-image: url(../img/documents/USA.png);
	background-clip: border-box;
	font-family: "Muller Medium";
	position: absolute;
	width: 39vw;
	background-size: 100%;
	height: 19vw;
	border: 3px solid #000;
	border-radius: 10px;
	z-index: 999;
}
.document .exit{
	position: absolute;
	top: 10px;
	right: 10px;
	color: #fff;
}
.document .passport{
	position: relative;
	padding: 40px 10px;
}
.document .title {
	padding: 10px;
	background-color: #344491;
	color: #fff;
	text-align: center;
}
.document .passport {
	width: 60%;
	position: relative;
}
.document .passport ul li{
	height: 2.5em;
}
.document .passport ul li span{
	font-size: 15px;
	font-family: "Muller Regular";
}
.document .passport ul #avtograp{
	font-family: "Autograf";
	font-size: 1.5em;
}
.document .passport ul .value{
	font-size: 17px;
	font-family: "Muller Medium";
}
.document .passport ul{
    column-count: 2;
    float: left;
    font-size: 1em;
    width: 100%;
    display: inline-block;
    list-style: none;
}
.document #photo{
	width: 30%;
	display: inline-block;
	float: left;
	margin-left: 10px;
	border: 4px solid #acacac;
	margin-top: 10px;	
}
.document .passport{
  display: inline-block;
}
</style>

<script>
export default {
    data() {
        return {
            items: {},
            show: false,
            title: "DRIVER'S LICENSE OF SAN ANDREAS STATE"
        };
    },
    methods: {
        close: function (){
            this.show = false;
            mp.trigger('guitoggle', false);
        }
    },
    computed: {
        keysItems() {
            return Object.keys(this.items)
        },
    },
    created(){
        let document = this;
        window.showItem = function (items) {
            if(items.title){
                document.title = items.title;
                delete items.title
            }
            document.show = true;
            document.items = items;
            document.$nextTick(function () {
                $('.document').draggable({ 
                    scroll: false 
                });
            })
            mp.trigger("guitoggle", true);
        }
        $("body").keyup(function(event){
            if(event.which == 27 && document.show){
                document.close();
            }
        })
    },
};
</script>