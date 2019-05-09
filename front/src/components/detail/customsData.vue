<template lang="html">
    <div class="customs-data">
            
                <div class="title">
                    <span class="collapse-title">年报情况</span>
                    <span class="collapse-title">经济区划</span>
                    <span class="collapse-title">海关注销状态</span>
                    <span class="collapse-title" title="跨境贸易电子商务类型">跨境贸易电子商务类型</span>
                    <span class="collapse-title">海关注册编码</span>
                    <span class="collapse-title">行业种类</span>
                    <span class="collapse-title">注册日期</span>
                    <span class="collapse-title">注册海关</span>
                    <span class="collapse-title">特殊贸易区域</span>
                    <span class="collapse-title">经营类别</span>
                    <span class="collapse-title">报关有效期</span>     
                </div>
                <p v-show="customsShow" class="customs-show">暂无数据</p>
                <el-collapse accordion>
                    <el-collapse-item v-for="info in customsDate" :key="info.id">
                        <template slot="title">
                            <span class="collapse-title">{{info.annreport || '--'}}</span>
                            <span class="collapse-title">{{info.apanage || '--'}}</span>
                            <span class="collapse-title">{{info.canstatuscn || '--'}}</span>
                            <span class="collapse-title">{{info.crossflag || '--'}}</span>
                            <span class="collapse-title">{{info.gaccid || '--'}}</span>
                            <span class="collapse-title">{{info.industry || '--'}}</span>
                            <span class="collapse-title">{{info.regdate || '--'}}</span>
                            <span class="collapse-title">{{info.reggacc || '--'}}</span>
                            <span class="collapse-title">{{info.spetxzonecn || '--'}}</span>
                            <span class="collapse-title">{{info.tradetypecn || '--'}}</span>
                            <span class="collapse-title">{{info.validdate || '--'}}</span>                        
                        </template>
                        <p class="collapse-punish">
                            <span>案件性质</span>
                            <span>处罚日期</span>
                            <span>行政处罚决定书编号</span>
                            <span>当事人</span>
                        </p>
                        <p v-for="li in info.punish" class="collapse-punish-span" :key="li.id">
                            <span v-bind:title="li.penchar">{{li.penchar || '--'}}</span>
                            <span v-bind:title="li.pendate">{{li.pendate || '--'}}</span>
                            <span v-bind:title="li.pendecno">{{li.pendecno || '--'}}</span>
                            <span v-bind:title="li.penparty">{{li.penparty || '--'}}</span>
                        </p>
                        <p class="collapse-credinf">
                            <span>认定证书编码</span>
                            <span>认定时间</span>
                            <span>信用等级中文名称</span>
                        </p>
                        <p v-for="li in info.credinf" class="collapse-credinf-span" :key="li.id">
                            <span v-bind:title="li.creauthno">{{li.creauthno || '--'}}</span>
                            <span v-bind:title="li.credate">{{li.credate || '--'}}</span>
                            <span v-bind:title="li.creratingcn">{{li.creratingcn || '--'}}</span>
                        </p>
                    </el-collapse-item>
                </el-collapse>
            
    </div>
</template>

<script>
import network from "@/libs/network"
import { getToken, getItem, removeItem } from "@/libs/storage";

export default {
    name: "CustomsData",
    data() {
        return {
            parameter: getItem('parameter') || {},
            page: 1,
            size: 100,
            customsDate: [],
            customsShow: false,
        }
    },
    methods: {
        customsData: function() {
            var condition = {
                id: this.parameter.id,
                page: this.page,
                size: this.size
            };
            network.post('/api/portraits/gacc', condition)
                .then(res => {
                    if (res.data.data == null) {
                        this.customsShow = true;
                    } else {
                        this.customsDate = res.data.data.list[0].gacc;
                    }
                })
        }
    },
    mounted: function() {
        this.customsData()
    },
}
</script>

<style lang="less">
p {
    text-align: left;
    margin: 0px;
    padding: 0px;
}

.customs-data .collapse-title {
    width: 8.9%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: block;
    float: left;
}

.customs-data .title {
    padding-bottom: 10px;
    height: 60px;
    line-height: 60px;
}

.customs-data .collapse-punish {
    border-bottom: 1px solid #ebeef5;
    background: #ebeef5;
    height: 50px;
    line-height: 50px;
}

.customs-data .collapse-punish>span {
    width: 25%;
    float: left;
    padding-left: 30px;
}

.customs-data .collapse-punish-span {
    width: 100%;
    height: 50px;
}

.customs-data .collapse-punish-span>span {
    width: 25%;
    float: left;
    text-align: left;
    display: block;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    line-height: 50px;
    padding-left: 30px;
}

.customs-data .collapse-credinf {
    border-bottom: 1px solid #ebeef5;
    background: #ebeef5;
    height: 50px;
    line-height: 50px;
}

.customs-data .collapse-credinf>span {
    width: 33%;
    float: left;
    padding-left: 30px;
}

.customs-data .collapse-credinf-span {
    width: 100%;
    height: 50px;
}

.customs-data .collapse-credinf-span>span {
    width: 33%;
    padding-left: 30px;
    float: left;
    text-align: left;
    display: block;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    line-height: 50px;
}
.customs-data .customs-show{
    height: 50px;
    line-height: 50px;
    text-align: center;
    border-top: 1px solid #ebeef5;
}
.customs-data .el-collapse-item__content{
    padding-bottom: 0px;
}
</style>
