<template>
    <div>
        <trucker v-if="subBar == 0"/>
        <scavenger v-else-if="subBar == 1"/>
        <evacuator v-else-if="subBar == 2"/>
        <collector v-else-if="subBar == 3"/>
        <taxi v-else-if="subBar == 4"/>
        <busman v-else-if="subBar == 5"/>
    </div>
</template>

<script>

import trucker from './trucker.vue';
import scavenger from './scavenger.vue';
import evacuator from './evacuator.vue';
import collector from './collector.vue';
import taxi from './taxi.vue';
import busman from './busman.vue';

export default {
    props: ['subBar'],
    components: {trucker,scavenger,evacuator,collector,taxi,busman}
}
</script>