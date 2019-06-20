<template>
    <div class="glp-detail">
        <Header v-show="!this.parameter.isReferenced"></Header>
        <div class="middle" :class="{change:change}">
            <!-- <RightSilde></RightSilde> -->
            <MasMain></MasMain>
            <div class="base-msg">
                <!-- <div class="base-msg-inner" :class="{fixed:fixed}">
                                    <msg-nav :list="list" :level="level" :fixed="fixed" :navWidth="navWidth"></msg-nav>
                                    <router-view></router-view>
                                </div> -->
                <div class="base-msg-inner" :class="{fixed:fixed}">
                    <div class="msg-nav" v-bind:style="{width:widthF+'px'}" :class="{['tab-list-level' + level] :true,isfixed:fixed}">
                        <ul class="base-nav clearfix">
                            <li v-for="(item,index) in navList" @click="changeModule(index,item.view)" :class="{active:active==index}" :key="item.id">{{item.title}}
                                <!-- <span v-if="item.fixed">{{listNum[item.fixed]}}</span> -->
                            </li>
                        </ul>
                    </div>
                    <component :is="currentView"></component>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import debounce from "lodash/debounce";
import network from "@/libs/network";
import Header from '@/components/Header.vue';
import MasMain from '@/components/detail/masMain.vue';
import RightSilde from '@/components/detail/rightSilde.vue';
import riskData from '@/components/detail/riskData.vue';
import basicData from '@/components/detail/basicData.vue';
import customsData from '@/components/detail/customsData.vue';
import riskConduction from '@/components/detail/riskConduction.vue';
import { getItem, removeItem } from "@/libs/storage";
export default {
    name: "detail",
    data() {
        return {
            fixed: false,
            widthF: null,
            parameter: getItem('parameter') || {},
            navList: [
                { title: '基础信息', view: 'basicData' },
                { title: '风险信息', view: 'riskData' },
                { title: '海关信息', view: 'customsData' },
                { title: '风险事件传导', view: 'riskConduction' },                
            ],
            level: 1,
            active: 0,
            currentView: 'basicData',
            change: false,
        }
    },
    methods: {
        changeModule: function(i, v) {
            this.active = i;
            this.currentView = v;
        }
    },
    mounted: function() {
        if(this.parameter.isReferenced){
            this.change = true;
        }
    },
    components: {
        Header,
        MasMain,
        RightSilde,
        basicData,
        riskData,
        customsData,
        riskConduction
    }
}
</script>

<style>
ul {
    margin: 0px;
    padding: 0px;
}

li {
    list-style: none;
}

.glp-detail {
    width: 100%;
    min-width: 1366px;
    background: #e8e8e8;
    padding-top: 78px;
    overflow-y: hidden;
}

.middle {
    padding: 76px 46px 20px;
}

.glp-detail .base-msg {
    width: 100%;
    min-height: 500px;
    margin-top: 30px;
    padding: 0 10px;
    background: url("../assets/images/glp/content-Left.png") repeat-y left top,
    url("../assets/images/glp/content-right.png") repeat-y right top;
}

.glp-detail .base-msg-inner {
    width: 100%;
    min-height: 500px;
    padding: 0 24px 92px;
    background: #fff;
}

.glp-detail .base-msg-inner .fixed {
    padding-top: 60px;
}

.msg-nav.tab-list-level1 {
    width: 100%;
    overflow: hidden;
}

.msg-nav.tab-list-level1.isfixed {
    position: fixed;
    top: 60px;
    z-index: 1000;
}

.msg-nav.tab-list-level1 .base-nav {
    width: 100%;
    height: 55px;
    border-bottom: 1px solid #ddd;
}

.msg-nav.tab-list-level1 .base-nav li:hover {
    color: #4babef;
}

.msg-nav.tab-list-level1 .base-nav li.active {
    color: #fff;
    background: #72cdfd url(../assets/images/glp/focused_bg.png) repeat-x left bottom;
}

.msg-nav.tab-list-level1 .base-nav li {
    float: left;
    width: 102px;
    height: 50px;
    margin-right: 64px;
    margin-left: 10px;
    line-height: 57px;
    text-align: center;
    font-size: 16px;
    color: #666;
    transform: translateY(-2px);
    cursor: pointer;
}

.glp-detail .change {
    padding: 0px 46px 20px !important;
}
</style>
