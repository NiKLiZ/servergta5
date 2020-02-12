<template>
    <div class="" 
    v-on:mousedown.left="click"
    v-on:mouseup.right="clickRightItem"
    >
         <img :src="`img/items/${image}`" alt="">
    </div>
</template>


<script>


export default {
    data() {
        return {

        };
    },
    props: {
        name: String,
        image: String,
        text: String,
        numberPlate: [String],
        count: [Number,Boolean]
    },
    methods: {
        click(){
            this.$emit('mousedown');
        },
        clickRightItem(event){
            this.$emit('clickRightItem',event)
        },
        getText(){
            if(this.numberPlate)return this.numberPlate.toUpperCase();
            if(this.count != false)return this.count;
            return '';
        }
    },
    
}
</script>