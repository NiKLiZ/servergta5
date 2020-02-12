<template>
    <div>
        <startJobs :subBar="subBar" v-if="bar === 0"/>
        <jobs :subBar="subBar" v-else-if="bar == 1"/>
        <home v-else-if="bar == 2"/>
        <inventory v-else-if="bar == 3"/>
        <phone v-else-if="bar == 4"/>
        <vehicle v-else-if="bar == 5"/>
        <inventory v-else-if="bar == 6"/>
    </div>
</template>

<script>

import startJobs from './startJobs/index.vue'
import jobs from './jobs/index.vue'
import home from './inventory/index.vue'
import inventory from './inventory/index.vue'
import phone from './phone/index.vue'
import vehicle from './vehicle/index.vue'
import clothesShop from './clothesShop/index.vue'

export default {
    props: ['bar','subBar'],
    components: {startJobs,jobs,home,inventory,phone,vehicle,clothesShop}
}
</script>