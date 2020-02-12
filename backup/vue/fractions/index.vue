<template>
    <div>
        <lspd></lspd>
        <ems></ems>
        <cityHall></cityHall>
        <army></army>
        <gang></gang>
        <mafia></mafia>
    </div>
</template>
<style src="../../styles/menu_fraction.scss" lang="scss"></style>

<script>

import LSPD from './lspd.vue'
import EMS from './ems.vue'
import cityHall from './cityHall.vue'
import army from './army.vue'
import gang from './gang.vue'
import mafia from './mafia.vue'

export default {
    data() {
        return {
        };
    },

    props: {
    },
    created(){
    },
    components:{
        'lspd': LSPD,
        'ems': EMS,
        cityHall,
        army,
        gang,
        mafia
    }   
  };

  // Well, hu, you have no module so just keep your component somewhere.
</script>