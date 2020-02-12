<template>
    <div>
        <farm v-if="subBar == 0"/>
        <loader v-else-if="subBar == 1"/>
        <pizza v-else-if="subBar == 2"/>
    </div>
</template>

<script>

import farm from './farm.vue';
import loader from './loader.vue';
import pizza from './pizza.vue';

export default {
    props: ['subBar'],
    components: {farm,loader,pizza}
}
</script>