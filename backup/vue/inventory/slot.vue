<template>
    <td
        v-on:mouseover="mouseover"
        v-on:mouseout="mouseout" 
        v-on:mouseup.left="mouseupLeft"
        v-on:mousedown.left="mousedown" 
    >
        <item 
        v-on:clickRightItem="clickRightItem($event)"
        v-if="item && item.id" v-bind="item" 
        ></item>
       
    </td>
</template>


<script>

import item from './item.vue';
export default {
    data() {
        return {

        };
    },
    props: {
        item: Object,
        padding: String,
    },
    methods: {
        mousedown(){
            this.$emit('mousedown')
        },
        mouseupLeft(){
            this.$emit('mouseupLeft')
        },
        mouseover(){
            this.$emit('mouseover')
        },
        mouseout(){
            this.$emit('mouseout')
        },
        mousedownLeft(){
            this.$emit('click')
        },
        clickRightItem(event){
            this.$emit('clickRightItem',event)
        }
    },
    components:{
        item
    }
}
</script>