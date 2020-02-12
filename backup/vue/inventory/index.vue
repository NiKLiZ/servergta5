<template>
    <div class="inventory" v-if="show">
        <div class="out" @click="outClick"></div>
        <div class="container" >
            <div class="out" @click="outClick"></div>
            <div class="container_top">
                <div class="container_top__weapon-item">
                    <div class="container_top__weapon-item-headline">
                        <h2>Оружие</h2>
                    </div>
                    <table>
                        <tbody>
                            <itemWeapon 
                            v-for="(weapon,i) in weaponSlots"
                            :key="i"
                            @mousedown="clickItemPlayer(weapon)" 
                            @mouseupLeft="mouseupPlayer(weapon)"
                            @clickRightItem="clickRightItem($event,weapon)"
                            v-bind:item="playerItems[weapon]"
                            ></itemWeapon>
                            <tr>
                                <td colspan="1"></td>
                                <td colspan="1">
                                    <!-- <img src="img/inventory/icons/items/weapons/Bz-gas-icon.png" alt=""> -->
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="container_top__my-item">
                    <div class="container_top__my-item-headline">
                        <h2>{{nickName}}</h2>
                        <ul>
                            <li>
                                <i></i>
                                {{hunger.toFixed()}}%
                            </li>
                            <li>
                                <i></i>
                                {{water.toFixed()}}%
                            </li>
                        </ul>
                    </div>
                    <table cellpadding="4" cellspacing="0">
                        <tbody>
                            <tr>
                                <slotPlayer 
                                :item="playerItems.glasses" 
                                :icon="'020-vision.svg'"
                                v-on:mousedown="clickItemPlayer('glasses')" 
                                v-on:mouseupLeft="mouseupPlayer('glasses')"
                                @clickRightItem="clickRightItem($event,'glasses')"
                                ></slotPlayer>
                                <slotPlayer 
                                :item="playerItems.ears" 
                                :icon="'005-earrings.svg'"
                                v-on:mousedown="clickItemPlayer('ears')" 
                                v-on:mouseupLeft="mouseupPlayer('ears')"
                                @clickRightItem="clickRightItem($event,'ears')"
                                ></slotPlayer>
                                <slotPlayer 
                                :item="playerItems.hat" 
                                :icon="'001-baseball-cap.svg'"
                                v-on:mousedown="clickItemPlayer('hat')" 
                                v-on:mouseupLeft="mouseupPlayer('hat')"
                                @clickRightItem="clickRightItem($event,'hat')"
                                ></slotPlayer>
                                <slotPlayer 
                                :item="playerItems.card" 
                                :icon="'015-credit-card.svg'"
                                v-on:mousedown="clickItemPlayer('card')" 
                                v-on:mouseupLeft="mouseupPlayer('card')"
                                @clickRightItem="clickRightItem($event,'card')"
                                ></slotPlayer>
                                <slotPlayer 
                                :icon="'018-purse.svg'"
                                :item="playerItems.money" 
                                ></slotPlayer>
                            </tr>
                            <tr>
                                <slotPlayer 
                                :item="playerItems.license" 
                                :icon="'011-identity-card.svg'"
                                v-on:mousedown="clickItemPlayer('license')" 
                                v-on:mouseupLeft="mouseupPlayer('license')"
                                @clickRightItem="clickRightItem($event,'license')"
                                ></slotPlayer>
                                <slotPlayer 
                                :item="playerItems.armor" 
                                :icon="'007-kevlar.svg'"
                                v-on:mousedown="clickItemPlayer('armor')" 
                                v-on:mouseupLeft="mouseupPlayer('armor')"
                                @clickRightItem="clickRightItem($event,'armor')"
                                ></slotPlayer>
                                <slotPlayer 
                                :item="playerItems.accessories" 
                                :icon="'008-bracelet.svg'"
                                v-on:mousedown="clickItemPlayer('accessories')" 
                                v-on:mouseupLeft="mouseupPlayer('accessories')"
                                @clickRightItem="clickRightItem($event,'accessories')"
                                ></slotPlayer>
                                <slotPlayer 
                                :item="playerItems.bracelets" 
                                :icon="'006-link.svg'"
                                v-on:mousedown="clickItemPlayer('bracelets')" 
                                v-on:mouseupLeft="mouseupPlayer('bracelets')"
                                @clickRightItem="clickRightItem($event,'bracelets')"
                                ></slotPlayer>
                                <slotPlayer 
                                :item="playerItems.watches" 
                                :icon="'012-watch-with-blank-face.svg'"
                                v-on:mousedown="clickItemPlayer('watches')" 
                                v-on:mouseupLeft="mouseupPlayer('watches')"
                                @clickRightItem="clickRightItem($event,'watches')"
                                ></slotPlayer>
                            </tr>
                            <tr>
                                <slotPlayer 
                                :item="playerItems.gloves" 
                                :icon="'016-glove.svg'"
                                v-on:mousedown="clickItemPlayer('gloves')" 
                                v-on:mouseupLeft="mouseupPlayer('gloves')"
                                @clickRightItem="clickRightItem($event,'gloves')"
                                ></slotPlayer>
                                <slotPlayer 
                                :icon="'hockey-mask_1.svg'"
                                :item="playerItems.masks" 
                                v-on:mousedown="clickItemPlayer('masks')" 
                                v-on:mouseupLeft="mouseupPlayer('masks')"
                                @clickRightItem="clickRightItem($event,'masks')"
                                ></slotPlayer>
                                <slotPlayer 
                                :item="playerItems.top" 
                                :icon="'002-winter.svg'"
                                v-on:mousedown="clickItemPlayer('top')" 
                                v-on:mouseupLeft="mouseupPlayer('top')"
                                @clickRightItem="clickRightItem($event,'top')"
                                ></slotPlayer>
                                <slotPlayer 
                                :item="playerItems.bag" 
                                :icon="'013-portfolio.svg'"
                                v-on:mousedown="clickItemPlayer('bag')" 
                                v-on:mouseupLeft="mouseupPlayer('bag')"
                                @clickRightItem="clickRightItem($event,'bag')"
                                ></slotPlayer>
                                <slotPlayer 
                                :item="playerItems.phone" 
                                :icon="'010-smartphone.svg'"
                                v-on:mousedown="clickItemPlayer('phone')" 
                                v-on:mouseupLeft="mouseupPlayer('phone')"
                                @clickRightItem="clickRightItem($event,'phone')"
                                ></slotPlayer>
                            </tr>
                            <tr class="last">
                                <slotPlayer 
                                v-show="!getHandAllSlot('hand2')"
                                :icon="'009-palm-of-hand.svg'"
                                :item="playerItems.hand1"
                                v-on:mousedown="clickItemPlayer('hand1')" 
                                v-on:mouseupLeft="mouseupPlayer('hand1')"
                                @clickRightItem="clickRightItem($event,'hand1')"
                                :class="{'allHand': getHandAllSlot('hand1')}"
                                ></slotPlayer>
                                <slotPlayer 
                                v-show="!getHandAllSlot('hand1')"
                                :icon="'009-palm-of-hand.svg'"
                                :item="playerItems.hand2"
                                v-on:mousedown="clickItemPlayer('hand2')" 
                                v-on:mouseupLeft="mouseupPlayer('hand2')"
                                @clickRightItem="clickRightItem($event,'hand2')"
                                :class="{'allHand': getHandAllSlot('hand2')}"
                                ></slotPlayer>
                                <slotPlayer 
                                :item="playerItems.leg" 
                                :icon="'003-pants.svg'"
                                v-on:mousedown="clickItemPlayer('leg')" 
                                v-on:mouseupLeft="mouseupPlayer('leg')"
                                @clickRightItem="clickRightItem($event,'leg')"
                                ></slotPlayer>
                                <td rowspan="2"><img :src="`img/inventory/icons/017-back.svg`" style="transform:rotate(180deg)" alt=""></td>
                                <td rowspan="2"><img :src="`img/inventory/icons/017-back.svg`" alt=""></td>
                            </tr>
                            <tr>
                                <slotPlayer 
                                :item="playerItems.foot" 
                                :icon="'004-sports-and-competition.svg'"
                                v-on:mousedown="clickItemPlayer('foot')" 
                                v-on:mouseupLeft="mouseupPlayer('foot')"
                                @clickRightItem="clickRightItem($event,'foot')"
                                ></slotPlayer>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="container_top__backpack-item">
                    <div class="container_top__backpack-item-headline">
                        <h2>Сумка</h2>
                    </div>
                    <table>
                        <tbody>
                            <tr>
                            <slotItem 
                                v-for="(i) in ((rightInventories[2].width)*(rightInventories[2].height))" :key="i" 
                                :style="getCssItemInventory(rightInventories[2].items[i-1],i-1,rightInventories[2])" class="item"
                                v-on:mouseover="mouseoverRight(rightInventories[2],i-1)" 
                                v-on:mousedown="clickItemRight(rightInventories[2],i-1)" 
                                v-on:mouseupLeft="mouseupRight(rightInventories[2],i-1)"
                                :padding="hasShowSlot(rightInventories[2].items[i-1],rightInventories[2].nameInventory,i-1) && typeof rightInventories[2].items[i-1] == 'object' && rightInventories[2].items[i-1].id  ? `calc( ${ (100/rightInventories[2].items[i-1].width)*rightInventories[2].items[i-1].height }%  +  ${ rightInventories[2].items[i-1].width > rightInventories[2].items[i-1].height ? '1px' : '0px' }) ` : '100%'"
                                :item="hasShowSlot(rightInventories[2].items[i-1],rightInventories[2].nameInventory,i-1) ? rightInventories[2].items[i-1] : {}" 
                                @clickRightItem="clickRightItem($event,i-1,2)"
                                :class="{disabled:!rightInventories[2].show}"
                                >
                            </slotItem>
                            </tr>
                        </tbody>
                    </table>
                </div>
                
            </div>
            <div class="container_middle">
                <div class="container_middle__topclothes-item">
                    <div class="container_middle__topclothes-item-headline">
                        <h2>Верхняя одежда</h2>
                    </div>
                    <table>
                        <tbody>
                            <tr>
                                <slotItem 
                                v-for="(i) in ((rightInventories[0].width)*(rightInventories[0].height))" :key="i" 
                                :style="getCssItemInventory(rightInventories[0].items[i-1],i-1,rightInventories[0])" class="item"
                                v-on:mouseover="mouseoverRight(rightInventories[0],i-1)" 
                                v-on:mousedown="clickItemRight(rightInventories[0],i-1)" 
                                v-on:mouseupLeft="mouseupRight(rightInventories[0],i-1)"
                                :padding="hasShowSlot(rightInventories[0].items[i-1],rightInventories[0].nameInventory,i-1) && typeof rightInventories[0].items[i-1] == 'object' && rightInventories[0].items[i-1].id  ? `calc( ${ (100/rightInventories[0].items[i-1].width)*rightInventories[0].items[i-1].height }%  +  ${ rightInventories[0].items[i-1].width > rightInventories[0].items[i-1].height ? '1px' : '0px' }) ` : '100%'"
                                :item="hasShowSlot(rightInventories[0].items[i-1],rightInventories[0].nameInventory,i-1) ? rightInventories[0].items[i-1] : {}" 
                                @clickRightItem="clickRightItem($event,i-1,0)"
                                :class="{disabled:!rightInventories[0].show}"
                                >
                                </slotItem>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="container_middle__bottomclothes-item">
                    <div class="container_middle__bottomclothes-item-headline">
                        <h2>Нижняя одежда</h2>
                    </div>
                    <table>
                        <tbody>
                            <tr>
                                <slotItem 
                                v-for="(i) in ((rightInventories[1].width)*(rightInventories[1].height))" :key="i" 
                                :style="getCssItemInventory(rightInventories[1].items[i-1],i-1,rightInventories[1])" class="item"
                                v-on:mouseover="mouseoverRight(rightInventories[1],i-1)" 
                                v-on:mousedown="clickItemRight(rightInventories[1],i-1)" 
                                v-on:mouseupLeft="mouseupRight(rightInventories[1],i-1)"
                                :padding="hasShowSlot(rightInventories[1].items[i-1],rightInventories[1].nameInventory,i-1) && typeof rightInventories[1].items[i-1] == 'object' && rightInventories[1].items[i-1].id  ? `calc( ${ (100/rightInventories[1].items[i-1].width)*rightInventories[1].items[i-1].height }%  +  ${ rightInventories[1].items[i-1].width > rightInventories[1].items[i-1].height ? '1px' : '0px' }) ` : '100%'"
                                :item="hasShowSlot(rightInventories[1].items[i-1],rightInventories[1].nameInventory,i-1) ? rightInventories[1].items[i-1] : {}" 
                                @clickRightItem="clickRightItem($event,i-1,1)"
                                :class="{disabled:!rightInventories[1].show}"
                                >
                                </slotItem>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="container_bottom" v-if="interactionsInventory.length">
                <div class="container_bottom__trunk-item">
                    <div class="container_bottom__trunk-item-headline">
                        <h2>{{interactionsInventory[interactionsInventoryIndex].title}}</h2>
                    </div>
                    <table>
                        <tbody>
                            <tr >
                                <slotItem 
                                    v-for="(i) in ((interactionsInventory[interactionsInventoryIndex].width)*(interactionsInventory[interactionsInventoryIndex].height))" :key="i" 
                                    :style="getCssItemInventory(interactionsInventory[interactionsInventoryIndex].items[i-1],i-1,interactionsInventory[interactionsInventoryIndex])" class="item"
                                    v-on:mouseover="mouseoverRight(interactionsInventory[interactionsInventoryIndex],i-1)" 
                                    v-on:mousedown="clickItemRight(interactionsInventory[interactionsInventoryIndex],i-1)" 
                                    v-on:mouseupLeft="mouseupRight(interactionsInventory[interactionsInventoryIndex],i-1)"
                                    :padding="hasShowSlot(interactionsInventory[interactionsInventoryIndex].items[i-1],interactionsInventory[interactionsInventoryIndex].nameInventory,i-1) && typeof interactionsInventory[interactionsInventoryIndex].items[i-1] == 'object' && interactionsInventory[interactionsInventoryIndex].items[i-1].id  ? `calc( ${ (100/interactionsInventory[interactionsInventoryIndex].items[i-1].width)*interactionsInventory[interactionsInventoryIndex].items[i-1].height }%  +  ${ interactionsInventory[interactionsInventoryIndex].items[i-1].width > interactionsInventory[interactionsInventoryIndex].items[i-1].height ? '1px' : '0px' }) ` : '100%'"
                                    :item="hasShowSlot(interactionsInventory[interactionsInventoryIndex].items[i-1],interactionsInventory[interactionsInventoryIndex].nameInventory,i-1) ? interactionsInventory[interactionsInventoryIndex].items[i-1] : {}" 
                                    @clickRightItem="clickRightItem($event,i-1,interactionsInventoryIndex)"
                                    >
                                </slotItem>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <div class="modal-item"
            v-if="interactive.show"
            :style="{
                'left': interactive.x+'px',
                'top': interactive.y+'px',
            }"
        >
            <h3 class="modal-item__headline">
                {{interactive.name}}
            </h3>
            <ul>
                <li v-if="interactive.use" @click="useInteractive"><a >Использовать</a></li>
                <li v-for="(weapon,i) in interactive.weaponsAmmo" :key="i" @click="rchargeInteractive(weapon.weaponSlot)"><a>Зарядить {{weapon.name}}</a></li>
                <li @click="dropInteractive"><a>Выкинуть</a></li>
            </ul>
        </div>
        <div class="itemdrag"></div>
    </div>
</template>
<style src="../../styles/inventory.scss" lang="scss"></style>

<script>

import slotItem from './slot.vue';
import item from './item.vue';
import itemWeapon from './itemWeapon.vue';
import titleInventory from './title.vue'
import infoItems from '../../../inventory/itemsinfo.js';
import slotPlayer from './slotPlayer.vue';

export default {
    data() {
        return {
            show: false,
            hunger: 0,
            water: 0,
            items: [],
            dragSLotInfo: {item: {},inventorydrag:"",dragslot:-1},
            infoItems: infoItems,
            interactionInventory: 0,
            weaponSlots:[
                'weapon1',
                'weapon2',
                'weapon3',
                'weapon4',
            ],
            interactive: {show:false,slot: 0,inventory: 0,use:false,weaponsAmmo: [],name: ''},
            playerItems: {
                // glasses: infoItems[9],
                // hat: infoItems[8],
                // top: infoItems[2],
                // leg: infoItems[3],
                // foot: infoItems[4],
                weapon1: infoItems[0],
                weapon2: infoItems[0],
                weapon3: infoItems[0],
                weapon4: infoItems[0],
                // ammo1: infoItems[21],
                // ammo2: infoItems[21],
            },
            interactionsInventoryIndex: 0,
            interactionsInventory: [
                
            ],
            rightInventories: [
                {
                    show: false,
                    width: infoItems[2].inventoryWidth,
                    height: infoItems[2].inventoryHeight,
                    name: 'Верхняя одежда',
                    nameInventory: 'top',
                    items: [
                        ]
                },
                {
                    show: false,
                    "width": infoItems[3].inventoryWidth,
                    "height": infoItems[3].inventoryHeight,
                    name: 'Штаны',
                    nameInventory: 'leg',
                    items: [
                        
                    ]
                },
                {
                    show: false,
                    width: infoItems[63].inventoryWidth,
                    nameInventory: 'bag',
                    height: infoItems[63].inventoryHeight,
                    name: 'Сумка',
                    items: [
                        
                    ]
                },
            ],
            
        };
    },
    methods: {
        clickRightItem(event,slot,inventory = "player"){
            let item = inventory == "player" ? this.playerItems[slot] : this.rightInventories[inventory].items[slot];
            if(!item || !item.id) return;
            this.interactive.show = true;
            this.interactive.slot = slot;
            this.interactive.x = event.pageX;
            this.interactive.y = event.pageY;
            this.interactive.use = inventory != "player" || infoItems[item.id].isUse;
            // Если предмет патроны
            if(inventory != "player")inventory = this.rightInventories[inventory].nameInventory
            this.interactive.inventory = inventory;
            this.interactive.weaponsAmmo = [];
            this.interactive.name = this.getNameItem(item);
            if(item.id == 19){
                let weaponSlots = this.weaponSlots;
                for (let i = 0; i < weaponSlots.length; i++) {
                    const weaponSlot = weaponSlots[i];
                    let itemWeapon = this.playerItems[weaponSlot];
                    if(itemWeapon && itemWeapon.id){
                        let itemInfo = infoItems[itemWeapon.id];
                        if(itemInfo.type == "weapon" && itemInfo.id != 7){
                            this.interactive.weaponsAmmo.push({
                                name: itemInfo.name,
                                weaponSlot
                            })
                        }
                    }
                }
            }
        },
        getNameItem(item){
            if(item.id == 1)return `${item.name} ${item.name_cart} ${item.surname}`;
            else return item.name;
        },
        hide(){
            this.show = false;
            mp.trigger("guitoggle", this.show);
            this.offDraggableItem();
        },
        clickItemRight(inventory,index){
            let item = inventory.items[index];
            this.dragSLotInfo.inventorydrag = inventory.nameInventory;
            this.dragSLotInfo.dragslot = index;
            this.dragItem(item);
        },
        dragItem(item){
            this.interactive.show = false;  
            $(".itemdrag").css("background-image",`url(img/items/${item.image})`)
            this.dragSLotInfo.item = item;
            inventory.interactive.show = false;
        },
        rchargeInteractive(weaponSlot){
            this.interactive.show = false;
            mp.trigger('CallRemote',"INVENTORY::RCHARGE_ITEM",this.interactive.slot,this.interactive.inventory,weaponSlot);
        },
        mouseupRight(inventory,index){
            if(!this.dragSLotInfo.item.id)return;
            if(!inventory.show && !inventory.interactive)return;
            let free = this.isFreeItem(inventory,this.dragSLotInfo.item,index);
            if(free && this.dragSLotInfo.dragslot !== -1){
                mp.trigger("CallRemote","INVENTORY::DRAG_SLOT",this.dragSLotInfo.inventorydrag,this.dragSLotInfo.dragslot,inventory.nameInventory,index)
            }
            this.offDraggableItem()
        },
        mouseoverRight(inventory,index){
            if(!this.dragSLotInfo.item || !this.dragSLotInfo.item.id)return;
            let free = this.isFreeItem(inventory,this.dragSLotInfo.item,index);
            if(free){
                
            }
        },
        isFreeItem(inventory,item,index){
            let hasSize = this.isSizeItem(inventory,item,index);
            if(hasSize){
                let infoitem = infoItems[item.id]
                let inventoryWidth = inventory.width
                let x = index%inventoryWidth;
                let y = (index-x)/inventoryWidth;
                for(let xFor = x;xFor < infoitem.width+x;xFor++){
                    for(let yFor = y;yFor < infoitem.height+y;yFor++){
                        if(!(x == xFor && y == yFor)){
                            let index = yFor * inventoryWidth + xFor;
                            if(inventory.items[index] && inventory.items[index].id  && this.dragSLotInfo.dragslot != index || inventory.items[index] &&  typeof inventory.items[index].linkId != "undefined" && inventory.items[index].linkId != this.dragSLotInfo.dragslot)
                            return false;
                        }
                    }
                }
            }
            return hasSize;
        },
        mouseupPlayer(index){
            let free = !this.playerItems[index] ||  !this.playerItems[index].id  ||  this.playerItems[index].id == this.dragSLotInfo.item.id;
            if(free || index.indexOf('weapon') != -1){
                mp.trigger("CallRemote","INVENTORY::DRAG_SLOT",this.dragSLotInfo.inventorydrag,this.dragSLotInfo.dragslot,"player",index)
            }
            this.offDraggableItem();
        },
        mouseoverPlayer(index){
            if(!this.dragSLotInfo || !this.dragSLotInfo.id)return;
            inventory = this.rightInventories[inventory];
            let free = this.playerItems;
            if(free){
                
            }
        },
        clickItemPlayer(index){
            let item = this.playerItems[index];
            if(typeof item != 'object' || !item.id )return;
            this.dragItem(item);
            this.dragSLotInfo.item = item;
            this.dragSLotInfo.inventorydrag = "player";
            this.dragSLotInfo.dragslot = index;
        },
        getCoordsIndex(inventory,index){
            let x = index%inventory.width;
            let y = (index-x)/inventory.width;
            return {
                x,y
            }
        },
        isSizeItem(inventory,item,index){
            let {x,y} = this.getCoordsIndex(inventory,index);
            return !(x+item.width > inventory.width || y+item.height > inventory.height)
        },
        addInteractionInventory(name,title){
            this.interactionsInventory.push({
                nameInventory:name,
                title:title,
                items: [],
                width: 13,
                height: 2,
                interactive: true
            })
        },
        removeInteractionInventory(name){
            for(let i=0;i<this.interactionsInventory.length;i++){
                if(this.interactionsInventory[i].nameInventory == name)
                    this.interactionsInventory.splice(i, 1);
            }
            if(!this.interactionsInventory.length) this.interactionInventory = 0;
        },
        removeInteractionItem(nameInventory,id){
            let inventory = this.interactionsInventory.find((inventory)=>{
                if(inventory.nameInventory == nameInventory)return true;
            })
            let inventoryWidth = inventory.width;
            let infoitem = infoItems[inventory.items[id].id];
            let x = id%inventoryWidth;
            let y = (id-x)/inventoryWidth;
            for(let xFor = x;xFor < infoitem.width+x;xFor++){
                for(let yFor = y;yFor < infoitem.height+y;yFor++){
                    if(!(x == xFor && y == yFor)){
                        let index = yFor * inventoryWidth + xFor;
                        delete inventory.items[index].linkId
                    }
                }
            }
            this.$set(inventory.items,id,JSON.parse(JSON.stringify(infoItems[0])));
        },
        setInteractionItem(nameInventory,id,item){
            let inventory = this.interactionsInventory.find((inventory)=>{
                if(inventory.nameInventory == nameInventory)return true;
            })
            this.$set(inventory.items,id,item);
            let infoitem = item;
            let width = inventory.width;
            let x = id%width;
            let y = (id-x)/width;
            for(let xFor = x;xFor < infoitem.width+x;xFor++){
                for(let yFor = y;yFor < infoitem.height+y;yFor++){
                    if(!(x == xFor && y == yFor)){
                        let index = yFor * width + xFor;
                       inventory.items[index].linkId = id;
                        this.$set(inventory.items,index,inventory.items[index]);
                    }
                }
            }
        },
        setIteractiveItems(nameInventory,items){
            let inventory = this.interactionsInventory.find((inventory)=>{
                if(inventory.nameInventory == nameInventory)return true;
            })
            items.forEach((item,i)=>{
                this.$set(inventory.items,i,item);
            })
        },
        dropInteractive(){
            this.interactive.show = false;
            mp.trigger('INVENTORY::DROP_ITEM', this.interactive.slot,this.interactive.inventory);
        },
        useInteractive(){
            this.interactive.show = false;
            mp.trigger('CallRemote','INVENTORY::USE_ITEM', this.interactive.slot,this.interactive.inventory);
        },
        setRightItems(id,items){
            items.forEach((item,i)=>{
                this.$set(this.rightInventories[id].items,i,item);
            })
        },
        
        hideRightItems(id){
            this.rightInventories[id].show = false;
            for (let i = 0; i < this.rightInventories[id].width*this.rightInventories[id].height; i++) {
                this.$set(this.rightInventories[id].items,i,JSON.parse(JSON.stringify(infoItems[0])));   
            }
        },
        isDragCurentItem(item,nameInventory,index){
            let hasItemDrag = (this.dragSLotInfo.inventorydrag != "player" && !!this.dragSLotInfo.item.id)
            return (!!item && hasItemDrag && nameInventory == this.dragSLotInfo.inventorydrag && (this.dragSLotInfo.dragslot == index || item.linkId == this.dragSLotInfo.dragslot));
        },
        hasShowSlot(item,nameInventory,index){
            if(this.isDragCurentItem(item,nameInventory,index)){
                return false
            }else{
                return typeof item != 'object' || item.id  || typeof item.linkId == 'undefined'
            }
        },
        getCssItemInventory(item,index,inventory){
            let {x,y} = this.getCoordsIndex(inventory,index);
            let nameInventory = inventory.nameInventory;
            return `${!this.isDragCurentItem(item,nameInventory,index)   ? `grid-column-end: ${!!item ? item.width : ''} span;  grid-row-end: ${!!item ? item.height : ''} span ;` : ''} 
            ${ this.isDragCurentItem(item,nameInventory,index) || (typeof item != 'object' || item.id  || typeof item.linkId == 'undefined')  ?  'display: flex;' : 'display:none'} ;
            gridColumnStart: ${x+1};
            gridRowStart: ${y+1};
            `
        },
        setRightItem(inventory,id,item){
            this.$set(this.rightInventories[inventory].items,id,item);
            let infoitem = item;
            let width = this.rightInventories[inventory].width;
            let x = id%width;
            let y = (id-x)/width;
            for(let xFor = x;xFor < infoitem.width+x;xFor++){
                for(let yFor = y;yFor < infoitem.height+y;yFor++){
                    if(!(x == xFor && y == yFor)){
                        let index = yFor * width + xFor;
                        this.rightInventories[inventory].items[index].linkId = id;
                        this.$set(this.rightInventories[inventory].items,index,this.rightInventories[inventory].items[index]);
                    }
                }
            }
        },
        updateItemPlayer(id,item){
            this.$set(this.playerItems,id,item);
        },
        removeRightItem(inventory,id){
            let inventoryWidth = this.rightInventories[inventory].width;
            let infoitem = infoItems[this.rightInventories[inventory].items[id].id];
            let x = id%inventoryWidth;
            let y = (id-x)/inventoryWidth;
            for(let xFor = x;xFor < infoitem.width+x;xFor++){
                for(let yFor = y;yFor < infoitem.height+y;yFor++){
                    if(!(x == xFor && y == yFor)){
                        let index = yFor * inventoryWidth + xFor;
                        delete this.rightInventories[inventory].items[index].linkId
                    }
                }
            }
            this.$set(this.rightInventories[inventory].items,id,JSON.parse(JSON.stringify(infoItems[0])));
        },
        getHandAllSlot(hand){
            return typeof this.playerItems[hand] == 'object'  && this.playerItems[hand].id != 0 && this.playerItems[hand].allHandSlot;
        },
        outClick(){
            this.offDraggableItem()
        },
        offDraggableItem(){
            $(".itemdrag").css("background-image",'none');
            inventory.dragSLotInfo.inventorydrag = 0;
            inventory.dragSLotInfo.dragslot = -1;
            inventory.dragSLotInfo.item = {};
            inventory.interactive.show = false;
        }
    },
    components:{
        slotItem,
        titleInventory,
        item,
        itemWeapon,
        slotPlayer
    },
    created(){
        window.inventory = this;
        $(document).mousemove(function(e){
            if(!window.inventory.show)return;
            $(".itemdrag").css({ "left": e.pageX - 25, "top": e.pageY - 25 });
        }); 
        $("body").keyup(function(event){
            if(event.which == 27 && inventory.show){
                inventory.hide();
            }
        })
    },
    computed: {
        nickName(){
            let names = window.nickName.split(' ')
            return `${names[0]} ${names[1][0]}.`;
        }
    },
}
</script>