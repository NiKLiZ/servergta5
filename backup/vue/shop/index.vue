<template>
   <div class="shop" v-if="show">
    <div class="title">
        <h1>Магазин</h1>
       <div @click="hide" class="exit"><i class="fas fa-times"></i></div>
    </div>
    <div class="main">
      <div class="categories">
        <div v-for="(item,i) in Object.keys(items)"  :key="i" class="categorie" :class="menu == i ?'active' : ''" @click="menu = i" >{{item}}</div>
      </div>
      <div class="items">
        <div class="item" v-for="(item,i) in items[Object.keys(items)[menu]]" :key="i" @click="trigger('CallRemote','SHOP::BUY_ITEM',menu,i);">
          <img :src="''+item.image" alt="">
          <div class="price">{{item.price}}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<style src="../../styles/shop.scss"></style>

<script>
export default {
    data() {
        return {
            show: false,
            items: {
            },
            menu: 0
        };
    },
    methods: {
        hide(){
            this.menu = 0;
            this.show = false;
            mp.trigger('guitoggle', false);
        },
        
        trigger(...args){
            mp.trigger(...args)
        }
    },
    computed: {
    },
    created(){
        window.shop = this;
        $("body").keyup(function(event){
            if(event.which == 27 && shop.show){
                shop.hide();
            }
        })
    },
};
</script>