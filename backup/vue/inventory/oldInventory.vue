<template>
    <div class="inventory" v-if="show">
        <div class="out" @click="outClick"></div>
        <div class="left"  :style="`width: ${18 + ( interactionsInventory.length ? 0 : 6)}%`" >
            <div class="weaponsInventory">
                <titleInventory :text="'Оружие'"></titleInventory>
                <div class="items">
                    <itemWeapon 
                    @mousedown="clickItemPlayer('weapon1')" 
                     @mouseupLeft="mouseupPlayer('weapon1')"
                     @clickRightItem="clickRightItem($event,'weapon1')"
                      v-bind="playerItems.weapon1"></itemWeapon>
                    <itemWeapon 
                    @mousedown="clickItemPlayer('weapon2')" 
                     @mouseupLeft="mouseupPlayer('weapon2')"
                     @clickRightItem="clickRightItem($event,'weapon2')"
                      v-bind="playerItems.weapon2"></itemWeapon>
                    <itemWeapon 
                    @mousedown="clickItemPlayer('weapon3')" 
                     @mouseupLeft="mouseupPlayer('weapon3')"
                     @clickRightItem="clickRightItem($event,'weapon3')"
                     
                      v-bind="playerItems.weapon3"></itemWeapon>
                    <div class="slot ammo">
                        
                    </div>
                    <div class="slot ammo">

                    </div>
                </div>
            </div>
            <div class="stats">
                <div class="hunger stat">
                    <div class="background">
                        <div class="line" :style="`width: ${hunger}%`"></div>
                    </div>
                    <div class="icon">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19.4854 17.0049L2.47038 0H1.7539L1.6076 0.371523C1.22147 1.35215 1.05649 2.35511 1.13056 3.27187C1.21498 4.31687 1.61221 5.22159 2.27937 5.88835L9.43637 13.0411L10.3804 12.0976L16.997 19.4919C17.6552 20.1497 18.7881 20.1888 19.4854 19.4919C20.1715 18.8062 20.1715 17.6906 19.4854 17.0049Z" fill="url(#paint0_linear)"/>
                            <path d="M6.11986 11.3844L0.514526 16.9864C-0.171509 17.672 -0.171509 18.7877 0.514526 19.4733C1.16624 20.1247 2.29367 20.1822 3.00292 19.4733L8.6083 13.8713L6.11986 11.3844Z" fill="url(#paint1_linear)"/>
                            <path d="M19.156 3.33003L15.9763 6.50776L15.1468 5.67878L18.3264 2.50101L17.497 1.67203L14.3173 4.84976L13.4879 4.02078L16.6675 0.843046L15.8381 0.0141015L11.6907 4.15902C11.1833 4.66609 10.8804 5.33937 10.8375 6.05491C10.8267 6.2362 10.7856 6.41452 10.7174 6.58413L13.4115 9.27667C13.5812 9.20842 13.7597 9.16737 13.9411 9.15655C14.657 9.11385 15.3307 8.811 15.8381 8.30393L19.9855 4.15906L19.156 3.33003Z" fill="url(#paint2_linear)"/>
                            <defs>
                            <linearGradient id="paint0_linear" x1="-0.330578" y1="-0.000180271" x2="20" y2="-0.000180081" gradientUnits="userSpaceOnUse">
                                <stop stop-color="#FE9800"/>
                                <stop offset="1" stop-color="#FF4D00"/>
                            </linearGradient>
                            <linearGradient id="paint1_linear" x1="-0.330578" y1="-0.000180271" x2="20" y2="-0.000180081" gradientUnits="userSpaceOnUse">
                                <stop stop-color="#FE9800"/>
                                <stop offset="1" stop-color="#FF4D00"/>
                            </linearGradient>
                            <linearGradient id="paint2_linear" x1="-0.330578" y1="-0.000180271" x2="20" y2="-0.000180081" gradientUnits="userSpaceOnUse">
                                <stop stop-color="#FE9800"/>
                                <stop offset="1" stop-color="#FF4D00"/>
                            </linearGradient>
                            </defs>
                        </svg>
                    </div>
                </div>
                <div class="water stat">
                    <div class="background">
                        <div class="line" :style="`width: ${water}%`"></div>
                    </div>
                    <div class="icon">
                        <svg width="15" height="19" viewBox="0 0 15 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11.5417 5.29831C10.1945 3.07469 8.69606 1.15018 7.92272 0.200882C7.81923 0.0737508 7.66395 -4.95388e-05 7.50004 2.4949e-08C7.33608 2.4949e-08 7.18085 0.0738004 7.07731 0.200931C6.30401 1.15052 4.8056 3.07568 3.45841 5.2995C1.72228 8.16542 0.84198 10.5349 0.84198 12.342C0.84198 16.0132 3.82875 19 7.49999 19C11.1712 19 14.158 16.0132 14.158 12.342C14.158 10.5337 13.2778 8.16389 11.5417 5.29831ZM8.41365 16.5477C8.02487 16.6472 7.62132 16.6975 7.21396 16.6975C4.72655 16.6975 2.7029 14.8176 2.7029 12.5069C2.7029 11.9491 2.85011 11.2973 3.1403 10.5698C3.18932 10.4469 3.32899 10.3768 3.46668 10.4065C3.60427 10.4361 3.69666 10.5561 3.68248 10.6865C3.66553 10.8426 3.65691 10.995 3.65691 11.1393C3.65691 13.654 5.68313 15.7597 8.37008 16.0373C8.50381 16.0511 8.60814 16.1511 8.61879 16.2758C8.6295 16.4004 8.54336 16.5145 8.41365 16.5477Z" fill="url(#paint4_linear)"/>
                            <defs>
                            <linearGradient id="paint4_linear" x1="0.621881" y1="-0.000171257" x2="14.158" y2="-0.000171169" gradientUnits="userSpaceOnUse">
                            <stop stop-color="#00B2FE"/>
                            <stop offset="1" stop-color="#0047FF"/>
                            </linearGradient>
                            </defs>
                        </svg>

                    </div>
                </div>
            </div>
        </div>
        <div class="interactions" v-if="interactionsInventory.length">
            <titleInventory :text="interactionsInventory[interactionsInventoryIndex].title"></titleInventory>
            
            <div class="items" :style="`display: grid;grid-template-columns: repeat(${interactionsInventory.width}, 1fr);grid-template-rows: repeat(${interactionsInventory.height}, 1fr);`">
                    
                    <div v-for="(i) in ((interactionsInventory[interactionsInventoryIndex].width)*(interactionsInventory[interactionsInventoryIndex].height))" :key="i" 
                    :style="getCssItemInventory(interactionsInventory[interactionsInventoryIndex].items[i-1],i-1,interactionsInventory[interactionsInventoryIndex])" class="item"
                
                    >
                        <slotItem v-on:mouseover="mouseoverRight(interactionsInventory[interactionsInventoryIndex],i-1)" 
                        v-on:mouseupLeft="mouseupRight(interactionsInventory[interactionsInventoryIndex],i-1)"
                        v-on:mousedown="clickItemRight(interactionsInventory[interactionsInventoryIndex],i-1)" 
                        :padding="hasShowSlot(interactionsInventory[interactionsInventoryIndex].items[i-1],interactionsInventory[interactionsInventoryIndex].nameInventory,i-1) && typeof interactionsInventory[interactionsInventoryIndex].items[i-1] == 'object' && interactionsInventory[interactionsInventoryIndex].items[i-1].id  ? `calc( ${ (100/interactionsInventory[interactionsInventoryIndex].items[i-1].width)*interactionsInventory[interactionsInventoryIndex].items[i-1].height }%  +  ${ interactionsInventory[interactionsInventoryIndex].items[i-1].width > interactionsInventory[interactionsInventoryIndex].items[i-1].height ? '1px' : '0px' }) ` : '100%'"
                        :style="`width:100%`"
                        :item="hasShowSlot(interactionsInventory[interactionsInventoryIndex].items[i-1],interactionsInventory[interactionsInventoryIndex].nameInventory,i-1) ? interactionsInventory[interactionsInventoryIndex].items[i-1] : {}" 

                        @clickRightItem="clickRightItem($event,i-1,c)"
                        >
                        </slotItem>
                    </div>
                </div>
        </div>
        <div class="player" :class="{'interactions': interactionsInventory.length}" :style="`width: ${24.3768 + (interactionsInventory.length ? 0 : 6)}%`" >
            <h1>Инвентарь {{nickName}}</h1>
            <div class="inventoriesPlayer">
                <div class="leftItems">
                    <slotItem :item="playerItems.glasses" 
                    v-on:mousedown="clickItemPlayer('glasses')" 
                     v-on:mouseupLeft="mouseupPlayer('glasses')"
                     @clickRightItem="clickRightItem($event,'glasses')"></slotItem>
                    <slotItem :item="playerItems.accessories" 
                    v-on:mousedown="clickItemPlayer('accessories')" 
                     v-on:mouseupLeft="mouseupPlayer('accessories')"
                     @clickRightItem="clickRightItem($event,'accessories')"></slotItem>
                    <slotItem :item="playerItems.watches" 
                    v-on:mousedown="clickItemPlayer('watches')" 
                     v-on:mouseupLeft="mouseupPlayer('watches')"
                     @clickRightItem="clickRightItem($event,'watches')"></slotItem>
                    <slotItem :item="playerItems.license" 
                    v-on:mousedown="clickItemPlayer('license')" 
                     v-on:mouseupLeft="mouseupPlayer('license')"
                     @clickRightItem="clickRightItem($event,'license')"></slotItem>
                    <slotItem :item="playerItems.card" 
                    v-on:mousedown="clickItemPlayer('card')" 
                     v-on:mouseupLeft="mouseupPlayer('card')"
                     @clickRightItem="clickRightItem($event,'card')"></slotItem>
                    <slotItem :item="playerItems.armor" 
                    v-on:mousedown="clickItemPlayer('armor')" 
                     v-on:mouseupLeft="mouseupPlayer('armor')"
                     @clickRightItem="clickRightItem($event,'armor')"></slotItem>
                </div>
                <div class="rightItems">
                    <slotItem :item="playerItems.ears"
                    v-on:mousedown="clickItemPlayer('ears')" 
                     v-on:mouseupLeft="mouseupPlayer('ears')"
                     @clickRightItem="clickRightItem($event,'ears')"></slotItem>
                    <slotItem :item="playerItems.masks"
                    v-on:mousedown="clickItemPlayer('masks')" 
                     v-on:mouseupLeft="mouseupPlayer('masks')"
                     @clickRightItem="clickRightItem($event,'masks')"></slotItem>
                    <slotItem :item="playerItems.bracelets"
                    v-on:mousedown="clickItemPlayer('bracelets')" 
                     v-on:mouseupLeft="mouseupPlayer('bracelets')"
                     @clickRightItem="clickRightItem($event,'bracelets')"></slotItem>
                    <slotItem :item="playerItems.gloves"
                    v-on:mousedown="clickItemPlayer('gloves')" 
                     v-on:mouseupLeft="mouseupPlayer('gloves')"
                     @clickRightItem="clickRightItem($event,'gloves')"></slotItem>
                    <slotItem :item="playerItems.phone"
                    v-on:mousedown="clickItemPlayer('phone')" 
                     v-on:mouseupLeft="mouseupPlayer('phone')"
                     @clickRightItem="clickRightItem($event,'phone')"></slotItem>
                    <slotItem :item="playerItems.bag"
                    v-on:mousedown="clickItemPlayer('bag')" 
                     v-on:mouseupLeft="mouseupPlayer('bag')"
                     @clickRightItem="clickRightItem($event,'bag')"></slotItem>
                </div>
                <div class="clothesItems">
                    <div class="hat item">
                        <slotItem :item="playerItems.hat"
                        v-on:mousedown="clickItemPlayer('hat')" 
                        v-on:mouseupLeft="mouseupPlayer('hat')"
                        @clickRightItem="clickRightItem($event,'hat')"></slotItem>
                        <svg width="40" height="25" viewBox="0 0 40 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g v-if="!playerItems.hat" opacity="0.3">
                                <path d="M34.3935 12.8526L35.3408 16.6895L33.0256 17.628C28.8623 19.3125 24.4792 20.1664 20 20.1664C15.5208 20.1664 11.1377 19.3125 6.97547 17.628L4.65922 16.6895L5.60648 12.8526C2.0418 14.1258 0 15.8555 0 17.8817C0 22.5554 10.0997 25 20 25C29.9003 25 40 22.5554 40 17.8817C40 15.8555 37.9579 14.1258 34.3935 12.8526Z" fill="white"/>
                                <path d="M31.3583 10.3438L29.7081 3.66008C29.2858 1.95121 28.0327 0.650059 26.3561 0.180882C24.6773 -0.290667 22.9446 0.172736 21.7132 1.41939C20.7977 2.34628 19.2023 2.34628 18.2869 1.41939C17.0578 0.172736 15.3229 -0.290667 13.644 0.180882C11.9674 0.650138 10.7143 1.95121 10.292 3.66127L8.64352 10.3377C12.1995 12.1052 16.021 13.0481 20 13.0481C23.9682 13.0481 27.7974 12.1129 31.3583 10.3438Z" fill="white"/>
                                <path d="M32.5713 15.2552L31.9373 12.6869C28.1868 14.4705 24.1678 15.4209 20 15.4209C15.821 15.4209 11.8069 14.472 8.06179 12.6907L7.42866 15.2552C15.4439 18.501 23.9791 18.7442 32.5713 15.2552Z" fill="white"/>
                            </g>
                        </svg>
                    </div>
                    <div class="top item">
                        <slotItem :item="playerItems.top"
                    v-on:mousedown="clickItemPlayer('top')" 
                     v-on:mouseupLeft="mouseupPlayer('top')"
                     @clickRightItem="clickRightItem($event,'top')"></slotItem>
                        <svg v-if="!playerItems.top || !playerItems.top.id" width="40" height="32" viewBox="0 0 40 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path opacity="0.3" d="M39.6842 19.2958L29.8303 5.59352C29.1468 4.64307 28.0476 4.07967 26.8768 4.07967H25.2206V1.7971C25.2206 0.870361 24.4693 0.119019 23.5425 0.119019H22.7639L20.6107 5.94775C20.5162 6.20339 20.2726 6.37313 20 6.37313C19.7275 6.37313 19.4837 6.20339 19.3893 5.94775L17.236 0.119019H16.4574C15.5307 0.119019 14.7793 0.870361 14.7793 1.7971V4.07967H13.1233C11.9525 4.07967 10.8533 4.64307 10.1698 5.59352L0.315726 19.2958C-0.195556 20.0069 -0.0740783 20.9916 0.59467 21.557L2.4065 23.0889C3.07249 23.6521 4.05879 23.6111 4.67583 22.9948L9.98556 17.6919L9.24469 25.6141C9.20071 26.0843 9.35693 26.5513 9.6749 26.9003C9.90186 27.1494 10.1967 27.3203 10.5182 27.3987C9.96529 27.6733 9.58445 28.2419 9.58445 28.901V30.2028C9.58445 31.1295 10.3358 31.8809 11.2625 31.8809H28.7375C29.6643 31.8809 30.4156 31.1295 30.4156 30.2028V28.901C30.4156 28.2419 30.0346 27.6731 29.4819 27.3987C29.8034 27.3203 30.0982 27.1493 30.3252 26.9003C30.6431 26.5511 30.7994 26.0843 30.7554 25.6141L30.0145 17.6919L35.3242 22.9948C35.9413 23.6111 36.9276 23.6519 37.5936 23.0889L39.4054 21.557C40.0742 20.9916 40.1956 20.0069 39.6842 19.2958ZM16.5128 20.5277L14.1031 24.6424C13.9106 24.971 13.5649 25.1541 13.2098 25.1541C13.0322 25.1541 12.8524 25.1084 12.6881 25.0122C12.1953 24.7236 12.0297 24.09 12.3183 23.5972L14.728 19.4825C15.0168 18.9897 15.6502 18.8241 16.143 19.1127C16.6358 19.4013 16.8014 20.0349 16.5128 20.5277ZM27.3118 25.0122C27.1476 25.1083 26.9678 25.1541 26.7902 25.1541C26.4351 25.1541 26.0893 24.971 25.8968 24.6424L23.4871 20.5277C23.1984 20.0349 23.364 19.4013 23.8569 19.1127C24.3496 18.824 24.9832 18.9896 25.2719 19.4825L27.6816 23.5972C27.9702 24.09 27.8046 24.7236 27.3118 25.0122Z" fill="white"/>
                        </svg>
                    </div>
                    <div class="leg item">
                        <slotItem :item="playerItems.leg"
                    v-on:mousedown="clickItemPlayer('leg')" 
                     v-on:mouseupLeft="mouseupPlayer('leg')"
                     @clickRightItem="clickRightItem($event,'leg')"></slotItem>
                        <svg v-if="!playerItems.leg || !playerItems.leg.id" width="22" height="48" viewBox="0 0 22 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g opacity="0.3">
                                <path d="M21.9924 8.47876L21.9992 7.61296C22.0056 6.80242 21.9726 5.99302 21.9034 5.187H19.0644C19.4538 6.70671 20.5598 7.93556 21.9924 8.47876Z" fill="white"/>
                                <path d="M21.5795 2.77C21.5022 2.34491 21.4168 1.92127 21.3182 1.50021L21.1803 0.910441C21.0554 0.376745 20.5858 0 20.0455 0H1.95487C1.41453 0 0.944991 0.376745 0.820225 0.91028L0.682126 1.5007C0.583551 1.92159 0.498151 2.34507 0.420847 2.77H21.5795Z" fill="white"/>
                                <path d="M16.633 5.18721H12.1907V9.55136C12.1907 10.219 11.6579 10.7599 11.0002 10.7599C10.3426 10.7599 9.80971 10.219 9.80971 9.55136V5.18721H5.36432C4.88922 8.03584 2.76565 10.3214 0.0271417 10.9945L0.3062 46.8254C0.311279 47.4756 0.831933 48 1.47243 48H7.68297C8.30125 48 8.81222 47.5101 8.8473 46.8835L10.6936 14.0362C10.7028 13.872 10.8366 13.7437 10.9985 13.7437C11.1604 13.7437 11.2942 13.872 11.3034 14.0362L13.1497 46.8835C13.1849 47.5101 13.6957 48 14.3142 48H20.5245C21.165 48 21.6857 47.4756 21.6908 46.8254L21.9725 10.995C19.2329 10.3227 17.1082 8.03681 16.633 5.18721Z" fill="white"/>
                                <path d="M2.93293 5.18721H0.096804C0.0274366 5.99307 -0.00557974 6.80231 0.000769677 7.61253L0.00759519 8.47769C1.43891 7.934 2.54371 6.70579 2.93293 5.18721Z" fill="white"/>
                            </g>
                        </svg>
                    </div>
                    <div class="foot item">
                        <slotItem :item="playerItems.foot"
                    v-on:mousedown="clickItemPlayer('foot')" 
                     v-on:mouseupLeft="mouseupPlayer('foot')"
                     @clickRightItem="clickRightItem($event,'foot')"></slotItem>
                        <svg v-if="!playerItems.foot || !playerItems.foot.id" width="43" height="23" viewBox="0 0 43 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path opacity="0.3" d="M38.3799 11.1495C36.8617 10.8591 35.141 10.5299 33.7544 9.72496C30.2309 7.67559 17.079 0.45665 16.566 0.175143C16.4121 0.0605127 16.2402 0 16.0677 0C15.7913 0 15.5255 0.145526 15.3566 0.38984L13.462 3.14067C13.3535 3.25589 13.3093 3.40279 13.3376 3.55698C13.4268 4.04413 14.4362 4.66539 16.3388 5.40483C15.5606 5.82439 13.0282 6.69233 10.3323 6.69233C5.39139 6.69233 3.62857 4.34138 2.78129 3.21161C2.45751 2.77985 2.26214 2.5192 1.99734 2.5192C1.86576 2.5192 1.7479 2.58719 1.64467 2.72446C-0.952801 6.29934 0.114121 11.6977 0.893071 15.6394C0.929874 15.8255 0.966041 16.0084 1.00112 16.1877C1.51609 18.819 2.51231 19.1888 4.0952 19.5742C4.3311 19.6316 4.87333 19.6823 5.65555 19.7272L5.88082 22.0693C5.93098 22.591 6.34972 22.9997 6.83416 22.9997H8.25302C8.73746 22.9997 9.15619 22.5911 9.20636 22.0694L9.41845 19.8648C9.856 19.8758 10.313 19.8861 10.7864 19.8958L10.9955 22.0695C11.0458 22.5912 11.4645 22.9998 11.9489 22.9998H13.3676C13.8521 22.9998 14.2708 22.5912 14.321 22.0695L14.5241 19.958C18.5738 20.0121 23.1912 20.0387 27.2372 20.0512L27.4314 22.0696C27.4816 22.5913 27.9003 22.9999 28.3847 22.9999H29.8034C30.2879 22.9999 30.7065 22.5912 30.7566 22.0696L30.95 20.0595C31.4361 20.0602 31.9046 20.0606 32.3527 20.0609L32.5459 22.0697C32.5961 22.5914 33.0149 23 33.4992 23H34.9179C35.4022 23 35.821 22.5914 35.8712 22.0697L36.083 19.8697C37.4559 19.624 38.8154 19.1516 39.9502 18.5048C41.9169 17.3839 43 15.8765 43 14.2602C43.0002 12.0334 40.8591 11.6238 38.3799 11.1495ZM27.617 9.17955L20.6646 16.0703C20.6573 16.0762 20.6531 16.0784 20.6535 16.0788L17.4408 16.0763C17.4372 16.0721 17.4357 16.0657 17.4359 16.0657L25.1833 8.46481C25.1862 8.46432 25.1915 8.46432 25.1959 8.46501L27.6181 9.16647C27.62 9.16912 27.6222 9.17434 27.617 9.17955ZM14.351 16.0224L10.9739 16.0692C10.9694 16.0692 10.9667 16.0692 10.9634 16.06C10.9602 16.0514 10.9617 16.0476 10.9614 16.0476C10.9617 16.0473 10.9613 16.0476 10.9614 16.0476L21.2261 6.12311C21.2301 6.11937 21.2343 6.11839 21.2423 6.11987L23.6503 6.82073C23.6574 6.8229 23.6584 6.82516 23.6592 6.8287C23.6606 6.8348 23.6586 6.84002 23.6549 6.84366L14.364 16.0139C14.3555 16.0205 14.351 16.0224 14.351 16.0224Z" fill="white"/>
                        </svg>
                    </div>
                </div>
                
            </div>
            <div class="hands">
                <h1>В РУКАХ</h1>
                <div class="hand slot" :class="{'allHand': getHandAllSlot('hand1')}" v-if="!getHandAllSlot('hand2')">
                    <slotItem :item="playerItems.hand1"
                        v-on:mousedown="clickItemPlayer('hand1')" 
                        v-on:mouseupLeft="mouseupPlayer('hand1')"
                        @clickRightItem="clickRightItem($event,'hand1')"></slotItem>
                    <svg v-if="!playerItems.hand1 || !playerItems.hand1.id" width="30" height="38" viewBox="0 0 30 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g opacity="0.3">
                            <path d="M2.19894 10.2308C0.984499 10.2308 1.90735e-06 9.24924 1.90735e-06 8.03846C1.90735e-06 6.82768 0.984499 5.84615 2.19894 5.84615C3.41338 5.84615 4.39787 6.82768 4.39787 8.03846C4.39787 9.24924 3.41338 10.2308 2.19894 10.2308Z" fill="white"/>
                            <path d="M8.06277 5.84615C6.84833 5.84615 5.86383 4.86462 5.86383 3.65385C5.86383 2.44307 6.84833 1.46154 8.06277 1.46154C9.27721 1.46154 10.2617 2.44307 10.2617 3.65385C10.2617 4.86462 9.27721 5.84615 8.06277 5.84615Z" fill="white"/>
                            <path d="M13.9266 4.38462C12.7122 4.38462 11.7277 3.40309 11.7277 2.19231C11.7277 0.98153 12.7122 0 13.9266 0C15.141 0 16.1255 0.98153 16.1255 2.19231C16.1255 3.40309 15.141 4.38462 13.9266 4.38462Z" fill="white"/>
                            <path d="M19.7904 7.30769C18.576 7.30769 17.5915 6.32616 17.5915 5.11538C17.5915 3.90461 18.576 2.92308 19.7904 2.92308C21.0049 2.92308 21.9894 3.90461 21.9894 5.11538C21.9894 6.32616 21.0049 7.30769 19.7904 7.30769Z" fill="white"/>
                            <path d="M4.39787 8.03846V17.5385C4.39787 17.9418 4.72625 18.2692 5.13085 18.2692C5.53546 18.2692 5.86383 17.9418 5.86383 17.5385V3.65385H10.2617V16.0769C10.2617 16.4803 10.5901 16.8077 10.9947 16.8077C11.3993 16.8077 11.7277 16.4803 11.7277 16.0769V2.19231H16.1255V16.0769C16.1255 16.4803 16.4539 16.8077 16.8585 16.8077C17.2631 16.8077 17.5915 16.4803 17.5915 16.0769V5.11538H21.9894V23.3846L24.9579 19.3347C25.8375 17.9828 27.5541 17.5297 28.8119 18.3043C30.0653 19.0965 30.3761 20.824 29.5083 22.1715C29.5083 22.1715 24.7204 29.3959 22.6798 32.4885C20.6392 35.5812 17.3335 38 11.1515 38C0.916225 38 1.90735e-06 30.1194 1.90735e-06 27.7692C1.90735e-06 25.4191 1.90735e-06 8.03846 1.90735e-06 8.03846H4.39787Z" fill="white"/>
                            </g>
                    </svg>
                </div>
                <div class="hand slot"  :class="{'allHand': getHandAllSlot('hand2')}" v-if="!getHandAllSlot('hand1')">
                    <slotItem 
                        
                         :item="playerItems.hand2"
                        v-on:mousedown="clickItemPlayer('hand2')" 
                        v-on:mouseupLeft="mouseupPlayer('hand2')"
                        @clickRightItem="clickRightItem($event,'hand2')"></slotItem>
                    <svg v-if="!playerItems.hand2 || !playerItems.hand2.id" width="30" height="38" viewBox="0 0 30 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g opacity="0.3">
                            <path d="M2.19894 10.2308C0.984499 10.2308 1.90735e-06 9.24924 1.90735e-06 8.03846C1.90735e-06 6.82768 0.984499 5.84615 2.19894 5.84615C3.41338 5.84615 4.39787 6.82768 4.39787 8.03846C4.39787 9.24924 3.41338 10.2308 2.19894 10.2308Z" fill="white"/>
                            <path d="M8.06277 5.84615C6.84833 5.84615 5.86383 4.86462 5.86383 3.65385C5.86383 2.44307 6.84833 1.46154 8.06277 1.46154C9.27721 1.46154 10.2617 2.44307 10.2617 3.65385C10.2617 4.86462 9.27721 5.84615 8.06277 5.84615Z" fill="white"/>
                            <path d="M13.9266 4.38462C12.7122 4.38462 11.7277 3.40309 11.7277 2.19231C11.7277 0.98153 12.7122 0 13.9266 0C15.141 0 16.1255 0.98153 16.1255 2.19231C16.1255 3.40309 15.141 4.38462 13.9266 4.38462Z" fill="white"/>
                            <path d="M19.7904 7.30769C18.576 7.30769 17.5915 6.32616 17.5915 5.11538C17.5915 3.90461 18.576 2.92308 19.7904 2.92308C21.0049 2.92308 21.9894 3.90461 21.9894 5.11538C21.9894 6.32616 21.0049 7.30769 19.7904 7.30769Z" fill="white"/>
                            <path d="M4.39787 8.03846V17.5385C4.39787 17.9418 4.72625 18.2692 5.13085 18.2692C5.53546 18.2692 5.86383 17.9418 5.86383 17.5385V3.65385H10.2617V16.0769C10.2617 16.4803 10.5901 16.8077 10.9947 16.8077C11.3993 16.8077 11.7277 16.4803 11.7277 16.0769V2.19231H16.1255V16.0769C16.1255 16.4803 16.4539 16.8077 16.8585 16.8077C17.2631 16.8077 17.5915 16.4803 17.5915 16.0769V5.11538H21.9894V23.3846L24.9579 19.3347C25.8375 17.9828 27.5541 17.5297 28.8119 18.3043C30.0653 19.0965 30.3761 20.824 29.5083 22.1715C29.5083 22.1715 24.7204 29.3959 22.6798 32.4885C20.6392 35.5812 17.3335 38 11.1515 38C0.916225 38 1.90735e-06 30.1194 1.90735e-06 27.7692C1.90735e-06 25.4191 1.90735e-06 8.03846 1.90735e-06 8.03846H4.39787Z" fill="white"/>
                            </g>
                    </svg>
                </div>
            </div>
        </div>
        <div class="inventories" :style="`width: calc(${40 + (interactionsInventory.length ? 0 : 6)}% - 78px)`">
            <div class="inventor" v-for="(rightInventorie,c) in  rightInventories" :key="c">
                <div :style="`${rightInventorie.show ? '' : 'opacity: 0.2'}`">
                    <titleInventory :text="rightInventorie.name" ></titleInventory>
                    <div class="items" :style="`display: grid;grid-template-columns: repeat(${rightInventorie.width}, 1fr);grid-template-rows: repeat(${rightInventorie.height}, 1fr);`">
                        
                        <div 
                        v-for="(i) in ((rightInventorie.width)*(rightInventorie.height))" :key="i" 
                        :style="getCssItemInventory(rightInventorie.items[i-1],i-1,rightInventorie)" class="item"
                    
                        >
                            <slotItem 
                            v-on:mouseover="mouseoverRight(rightInventorie,i-1)" 
                            v-on:mousedown="clickItemRight(rightInventorie,i-1)" 
                            v-on:mouseupLeft="mouseupRight(rightInventorie,i-1)"
                            :padding="hasShowSlot(rightInventorie.items[i-1],rightInventorie.nameInventory,i-1) && typeof rightInventorie.items[i-1] == 'object' && rightInventorie.items[i-1].id  ? `calc( ${ (100/rightInventorie.items[i-1].width)*rightInventorie.items[i-1].height }%  +  ${ rightInventorie.items[i-1].width > rightInventorie.items[i-1].height ? '1px' : '0px' }) ` : '100%'"
                            :style="`width:100%`"
                            :item="hasShowSlot(rightInventorie.items[i-1],rightInventorie.nameInventory,i-1) ? rightInventorie.items[i-1] : {}" 
                            @clickRightItem="clickRightItem($event,i-1,c)"
                            >
                            </slotItem>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="interactive"  v-if="interactive.show"
            :style="{
                'left': interactive.x+'px',
                'top': interactive.y+'px',
            }"
        >
            <div class="but" v-if="interactive.use" @click="useInteractive">Использовать</div>
            <div class="but"  v-for="(weapon,i) in interactive.weaponsAmmo" :key="i" @click="rchargeInteractive(weapon.weaponSlot)">Зарядить {{weapon.name}}</div>
            <div class="but" @click="dropInteractive">Выкинуть</div>
        </div>
        <div class="itemdrag"></div>
    </div >
</template>
<style src="../../styles/inventory.scss" lang="scss"></style>

<script>

import slotItem from './slot.vue';
import item from './item.vue';
import itemWeapon from './itemWeapon.vue';
import titleInventory from './title.vue'
import infoItems from '../../../inventory/itemsinfo.js';

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
            interactive: {show:false,slot: 0,inventory: 0,use:false,weaponsAmmo: []},
            playerItems: {
                // glasses: infoItems[9],
                // hat: infoItems[8],
                // top: infoItems[2],
                // leg: infoItems[3],
                // foot: infoItems[4],
                // weapon1: infoItems[21],
                // weapon2: infoItems[21],
                // weapon3: infoItems[21],
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
                    width: 10,
                    nameInventory: 'bag',
                    height: 4,
                    name: 'Сумка',
                    items: [
                        
                    ]
                },
            ],
            
        };
    },
    methods: {
        clickRightItem(event,slot,inventory = "player"){
            this.interactive.show = true;
            this.interactive.slot = slot;
            this.interactive.x = event.pageX;
            this.interactive.y = event.pageY;
            let item = inventory == "player" ? this.playerItems[slot] : this.rightInventories[inventory].items[slot];
            this.interactive.use = inventory != "player" || infoItems[item.id].isUse;
            // Если предмет патроны
            if(inventory != "player")inventory = this.rightInventories[inventory].nameInventory
            this.interactive.inventory = inventory;
            this.interactive.weaponsAmmo = [];
            if(item.id == 19){
                let weaponSlots = ['weapon1','weapon2','weapon3']
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
            $(".itemdrag").css("background-image",'none');
            let free = this.isFreeItem(inventory,this.dragSLotInfo.item,index);
            if(free && this.dragSLotInfo.dragslot !== -1){
                mp.trigger("CallRemote","INVENTORY::DRAG_SLOT",this.dragSLotInfo.inventorydrag,this.dragSLotInfo.dragslot,inventory.nameInventory,index)
            }
            this.dragSLotInfo.inventorydrag = 0;
            this.dragSLotInfo.dragslot = -1;
            this.dragSLotInfo.item = {};
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
            $(".itemdrag").css("background-image",'none');
            let free = !this.playerItems[index] ||  !this.playerItems[index].id  ||  this.playerItems[index].id == this.dragSLotInfo.item.id;
            if(free || index.indexOf('weapon') != -1){
                mp.trigger("CallRemote","INVENTORY::DRAG_SLOT",this.dragSLotInfo.inventorydrag,this.dragSLotInfo.dragslot,"player",index)
            }
            this.dragSLotInfo.inventorydrag = 0;
            this.dragSLotInfo.dragslot = -1;
            this.dragSLotInfo.item = {};
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
                width: 4,
                height: 7,
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
        itemWeapon
    },
    created(){
        window.inventory = this;
        $(document).mousemove(function(e){
            if(!window.inventory.show)return;
            $(".itemdrag").css({ "left": e.pageX - 25, "top": e.pageY - 25 });
        }); 
    },
    computed: {
        nickName(){
            return window.nickName;
        }
    },
}
</script>