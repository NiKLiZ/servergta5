<template>
    <div class="titleInventory">
        <div class="arrow">
            <svg width="11" preserveAspectRatio="none" height="22" viewBox="0 0 14 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.5 21L0.5 1"></path>
            </svg>
        </div>
        {{text}}
    </div>
</template>


<script>


export default {
    data() {
        return {

        };
    },
    props: {
        'text': String
    },
    methods: {
    }
}
</script>