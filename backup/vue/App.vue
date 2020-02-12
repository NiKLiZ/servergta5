<template>
    <div>
        <!-- <bank-menu></bank-menu>
        <hud></hud>-->
        <elements></elements> 
        <!-- <fractions></fractions>
        <menuf2></menuf2>
        <shop24></shop24>
        <list-players></list-players>
        <collector></collector>
        <MenuSpawn></MenuSpawn>
        <MenuMayoralty></MenuMayoralty>
        <phone></phone> -->
        <!-- <authorization></authorization> -->
        <!-- <testpdd></testpdd> -->
        <!-- <inventory></inventory> -->
        <!-- <personal></personal> -->
        <!-- <donate></donate>-->
        <chat></chat> 
        <!-- <carshowroom></carshowroom>
        <helpMenu></helpMenu> -->
        <education></education>
    </div>
</template>



<script>

// import BankMenu from './bank/menu.vue'
// import Hud from './hud/index.vue'
// import ListPlayers from './listPlayers/index.vue'
// import Fractions from './fractions/index.vue'
// import Menu from './menu/index.vue'
import elements from './elements/index.vue'
// import shop from './shop/index.vue'
// import collector from './collector/index.vue'
// import MenuSpawn from './spawnMenu/index.vue'
// import MenuMayoralty from './mayoralty/index.vue'
// import Phone from './phone/index.vue'
// // import authorization from './authorization/index.vue'
// import testpdd from './testPDD/index.vue'
// import inventory from './inventory/index.vue'
// // import personal from './personal/index.vue'
// import donate from './donate/index.vue'
import chat from './chat/index.vue'
// import carshowroom from './carshowroom/index.vue'
// import helpMenu from './helpMenu/index.vue'
import education from './education/index.vue'

export default {
    data() {
        return {
        };
    },
    created(){
    },
    components:{
        // 'bank-menu': BankMenu,
        // 'hud': Hud,
        // 'list-players': ListPlayers,
        // 'fractions': Fractions,
        // 'menuf2': Menu,
        'elements': elements,
        // 'shop24': shop,
        // 'collector': collector,
        // 'MenuSpawn': MenuSpawn,
        // 'MenuMayoralty': MenuMayoralty,
        // 'phone': Phone,
        // authorization,
        // testpdd,
        // inventory,
        // personal,
        // donate,
        chat,
        // carshowroom,
        // helpMenu,
        education
    }   
  };

  // Well, hu, you have no module so just keep your component somewhere.
</script>