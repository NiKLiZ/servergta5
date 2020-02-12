<template>
    <tr
        v-on:mousedown.left="mousedown" 
        v-on:mouseup.left="mouseupLeft"
        v-on:mouseover="mouseover"
        v-on:mousedown.right="clickRightItem($event)"
    >
        <td >
            <div class="ammo" v-if="item && item.name">
                {{item.ammo}}
            </div>
            <img v-if="item && item.name" :src="`${$root.cdn}img/items/${item.image}`" alt="">
        </td>
    </tr>
</template>


<script>


export default {
    data() {
        return {

        };
    },
    props: {
        item: Object,
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
            if(!this.item || !this.item.image)return;
            this.$emit('clickRightItem',event)
        }
    },
}

</script>