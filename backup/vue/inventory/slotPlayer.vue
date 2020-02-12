<template>
        <td 
        v-on:mouseover="mouseover"
        v-on:mouseout="mouseout" 
        v-on:mousedown.right="clickRightItem($event)"
        v-on:mousedown.left="mousedown" 
        v-on:mouseup.left="mouseupLeft"
        :class="{active: item && item.name}"
        v-on:clickRightItem="clickRightItem($event)"
        >
            <img :src="  !item || !item.name ? `img/inventory/icons/${icon}`  : `img/items/${item.image}`" alt="">
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
        icon: String
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