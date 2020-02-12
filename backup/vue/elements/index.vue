<template>
    <div>
        <input-call></input-call>
        <table-call></table-call>
        <document></document>
    </div>
</template>


<script>

import InputCall from './inputCall.vue'
import Table from './table.vue'
import document from './document.vue'

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
        'input-call': InputCall,
        'table-call': Table,
        document
    }   
  };

  // Well, hu, you have no module so just keep your component somewhere.
</script>