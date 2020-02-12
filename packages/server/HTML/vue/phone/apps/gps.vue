<template>
    <div class="gps" >
        <div>
            <div class="title">
                <div class="back" @click="back">
                    <i class="fal fa-angle-left" ></i>
                </div>
                <h1>GPS</h1>
            </div>
            <div class="main" >
                <div class="points" >
                    <div class="character" v-for="char in filteredCharacter"  :key="char">
                        <div class="point" v-if="filteredPoints && filteredPoints[char]">
                            <div class="padding">
                                {{char}}
                            </div>
                            <div class="name" :class="{active:i==active}" v-for="(point, key) in filteredPoints[char]" @click="active = key" :key="key">
                                <div class="padding" @click="clickPoint(point)">
                                    {{point.name}} <div class="right"><i class="fas fa-map-marker-alt"></i></div>
                                </div>
                                
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style src="../../../styles/phone/gps.scss" lang="scss"></style>

<script>


export default {
    data() {
        const character = ['#',"А","Б","В","Г","Д","Е","Ж","З","И","Й","К","Л","М","Н","О","П","Р","С","Т","У","Ф","Х","Ц","Ч","Ш","Щ","Ъ","Ы","Ь","Э","Ю","Я" ,'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
        return {
            character,
            showNewpoint: false,
            filter: '',
            group: undefined,
            active: -1,
        };
    },
    props: ['points'],
    created(){
    },
    computed: {
        filteredPoints: function () {
            try{
                const vm = this
                const result = {};
                let points = this.group ? this.group : this.points;
                points.forEach(function (c) {
                    const char = ""+c.name[0].toUpperCase();
                    if (vm.character.indexOf(char) > -1) {
                        if (!result[char]) {
                            result[char] = []
                        }
                        result[char].push(c)
                    } else {
                        if (!result['#']) {
                            result['#'] = []
                        }
                        result['#'].push(c)
                    }
                })
                return result
            }catch(e){
                console.log(e)
            }
        },
        filteredCharacter(){
            if(!this.filteredPoints) return [];
            return this.character.filter((char)=>{
                if(this.filteredPoints[char])return true;
            })
        }
    },
    components:{
    },
    methods: {
        back(){
            if(this.group)return this.group = undefined;
            this.$emit('back')
        },
        clickPoint(point){
            if(point.group) this.group = point.group;
            else if(point.type == 'job') mp.trigger('PHONE::GPS_SET',point.type, point.job)
            else  mp.trigger('PHONE::GPS_SET',point.type)
        },
    },
  };
  // Well, hu, you have no module so just keep your component somewhere.
</script>