<template>
        <div id="manager" class="modal-buy" style="display: flex;">
            <div class="modal-buy_content">
                <div class="modal-buy_content__header">
                    <img :src="`img/carshowroom/manager.jpg`" alt="Manager">
                        <slot name="nameper"></slot>    
                    <div class="close"></div>
                </div>

                <slot name="description"></slot>
                
                <div class="modal-buy_content__buttons">
                    <slot name="popup-btn"></slot>
                </div>
            </div>
        </div>
</template>
<style lang="scss" src="../../styles/carshowroom.scss" scoped>