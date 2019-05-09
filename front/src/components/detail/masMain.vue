<template lang="html">
    <div class="ent-msg-main">
        <div class="ent-msg-main-inner">
            <div class="ent-msg-main-left">
                <h3>{{information.name || '--'}}</h3>
                <div class="ent-msg-status">
                    <p class="ent-status">{{information.entstatus || '--'}}</p>
                </div>
                <div class="ent-msg-shi clearfix">
                    <div class="ent-sort">所属集团：{{information.sourceName || '--'}}</div>
                </div>
            </div>
            <div class="ent-msg-main-right">
                <p>邮箱：{{information.email|| '--'}}</p>
                <p>地址：{{information.address|| '--'}}</p>
                <p>法定代表人：<span class="blue">{{information.legalPerson|| '--'}}</span></p>
                <p>电话：{{information.tel|| '--'}}</p>
            </div>
        </div>
    </div>

</template>

<script>
import network from "@/libs/network"
import { getItem, removeItem } from "@/libs/storage";

export default {
    name: "MasMain",
    data() {
        return {
            information:{},
            parameter: getItem('parameter') || {},
        }
    },
    methods: {
        
    },
    mounted: function() {
        network.get("/api/portraits/businessInfo?id="+this.parameter.id)
        .then(res => {
            this.information = res.data.data;
        })
    },
}
</script>

<style lang="less">
p{
    text-align: left;
    margin: 0px;
    padding:0px;
}
.ent-msg-main {
    width: 100%;
    height: 210px;
    padding: 0 10px;
    background: url("../../assets/images/glp/content-Left.png") repeat-y left top,
    url("../../assets/images/glp/content-right.png") repeat-y right top;

    .ent-msg-main-inner {
        width: 100%;
        height: 210px;
        background: #fff;
        position: relative;
    }
    .ent-msg-main-left {
        width: 496px;
        padding-left: 50px;
        float: left;
        h3 {
            width: 420px;
            margin-top: 40px;
            font-weight: bold;
            font-size: 20px;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            text-align: left;
        }
        .ent-msg-status {
            margin-top: -14px;
            text-align: left;
            .ent-status {
                display: inline-block;
                min-width: 84px;
                line-height: 24px;
                padding-left: 9px;
                padding-right: 8px;
                color: #fff;
                font-size: 12px;
                background: #05b992;
            }
            .old-name {
                position: relative;
                display: inline-block;
                line-height: 22px;
                border: 1px solid #e9800f;
                margin-left: 12px;
                padding-left: 7px;
                padding-right: 7px;
                color: #e9800f;
                font-size: 12px;
                cursor: pointer;
                img {
                    position: relative;
                    top: -2px;
                    margin-left: 2px;
                    vertical-align: middle;
                }
                &:hover {
                    ul {
                        display: block;
                    }
                }
                ul {
                    display: none;
                    position: absolute;
                    top: 22px;
                    left: -1px;
                    z-index: 999;
                    border: 1px solid #e9800f;
                    background: #fff;
                    li {
                        max-width: 200px;
                        height: 26px;
                        line-height: 26px;
                        padding: 0 6px;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        overflow: hidden;
                    }
                }
            }
        }
        .ent-msg-shi {
            margin-top: 28px;
            .ent-sort {
                float: left;
                width: 300px;
                height: 38px;
                line-height: 38px;
                padding-left: 50px;
                padding-right: 16px;
                color: #fff;
                font-size: 12px;
                letter-spacing: 1.5px;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
                background: url("../../assets/images/glp/icon-left.png") no-repeat left center, url("/static/_kimg/ent-detail/icon-right.png") no-repeat right center;
                background-color: rgba(120, 235, 168, .9);
            }
        }
    }
    .ent-msg-main-right {
        float: left;
        padding: 36px 0 34px 42px;
        font-size: 14px;
        background: #fff url("../../assets/images/glp/dot.png") no-repeat left;

        p {
            line-height: 28px;
            max-width: 476px;
        }
    }
}
</style>
