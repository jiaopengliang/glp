<template lang="html">
    <div class="public-info">
        <div class="model">
            <h3 class="title">处罚</h3>
            <el-table :data="punishData" style="width: 100%" border>
                    <el-table-column label="序号" width="80px">
                        <template slot-scope="scope">
                            <span>{{scope.$index+1+10*(punishPage-1)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="unitname" label="当事人名称">
                    </el-table-column>
                    <el-table-column prop="uniscid" label="统一社会信用代码">
                    </el-table-column>
                    <el-table-column prop="regno" label="注册号">
                    </el-table-column>
                    <el-table-column prop="publicdate" label="公示日期">
                    </el-table-column>
                    <el-table-column prop="pentype" label="处罚来源">
                    </el-table-column>
                    <el-table-column prop="pendecno" label="行政处罚决定书文号">
                    </el-table-column>
                    <el-table-column prop="pendecissdate" label="处罚决定书签发日期">
                    </el-table-column>
                    <el-table-column prop="pencontent" label="行政处罚内容">
                    </el-table-column>
                    <el-table-column prop="penauthcn" label="行政处罚机关名称">
                    </el-table-column>
                    <el-table-column prop="lerep" label="法定代表人">
                    </el-table-column>
                    <el-table-column prop="illegacttype" label="违法行为种类">
                    </el-table-column>
                    <el-table-column prop="gtregno" label="个体注册号">
                    </el-table-column>
                    <el-table-column prop="datadate" label="数据日期">
                    </el-table-column>
                    <el-table-column prop="caseid" label="案件基本信息">
                    </el-table-column>
                    <el-table-column prop="altpenauthcn" label="变更处罚机关">
                    </el-table-column>
                    <el-table-column prop="altdate" label="变更日期">
                    </el-table-column>
                    <el-table-column prop="alt" label="变更内容">
                    </el-table-column>
                </el-table>
                <div class="kg-pagination" v-if="punishShow">
                    <el-pagination background layout="prev, pager, next" :total="punishTotals" @current-change="punishChange">
                    </el-pagination>
                </div>
        </div>
        
        <div class="model" style="margin-top:58px;">
            <h3 class="title">执行</h3>
            <el-table :data="implementData" style="width: 100%" border>
                    <el-table-column label="序号" width="80px">
                        <template slot-scope="scope">
                            <span>{{scope.$index+1+10*(implementPage-1)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="abntime" label="列入日期">
                    </el-table-column>
                    <el-table-column prop="decorgcn" label="列入决定机关">
                    </el-table-column>
                    <el-table-column prop="illid" label="严重违法失信">
                    </el-table-column>
                    <el-table-column prop="redecorgcn" label="移出决定机关">
                    </el-table-column>
                    <el-table-column prop="ismove" label="是否移出">
                    </el-table-column>
                    <el-table-column prop="remdate" label="移出日期">
                    </el-table-column>
                    <el-table-column prop="remexcprescn" label="移出原因">
                    </el-table-column>
                    <el-table-column prop="specausecn" label="列入原因">
                    </el-table-column>
                </el-table>
                <div class="kg-pagination" v-if="implementShow">
                    <el-pagination background layout="prev, pager, next" :total="implementTotals" @current-change="implementChange">
                    </el-pagination>
                </div>
        </div>

        <div class="model" style="margin-top:58px;">
            <h3 class="title" style="margin-top:10px;">失信</h3>
            <el-table :data="breakfaithData" style="width: 100%" border>
                    <el-table-column label="序号" width="80px">
                        <template slot-scope="scope">
                            <span>{{scope.$index+1+10*(breakfaithPage-1)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="abnid" label="经营异常">
                    </el-table-column>
                    <el-table-column prop="abntime" label="列入日期">
                    </el-table-column>
                    <el-table-column prop="decorgcn" label="列入决定机关">
                    </el-table-column>
                    <el-table-column prop="redecorgcn" label="移出决定机关">
                    </el-table-column>
                    <el-table-column prop="ismove" label="是否移出">
                    </el-table-column>
                    <el-table-column prop="remdate" label="移出日期">
                    </el-table-column>
                    <el-table-column prop="remexcprescn" label="移出原因">
                    </el-table-column>
                    <el-table-column prop="specausecn" label="列入原因">
                    </el-table-column>
                    <el-table-column prop="lerep" label="法定代表人">
                    </el-table-column>
                </el-table>
                <div class="kg-pagination" v-if="breakfaithShow">
                    <el-pagination background layout="prev, pager, next" :total="breakfaithTotals" @current-change="breakfaithChange">
                    </el-pagination>
                </div>
        </div>
        
       
        </div>
    </div>
</template>

<script>
import network from "@/libs/network"
import { getItem, removeItem } from "@/libs/storage";
export default {
    name: 'RiskData',
    data() {
        return {
            parameter: getItem('parameter') || {},
            punishData: [],
            punishPage: 1,
            punishSize: 10,
            punishTotals: 0,
            punishShow: true,
            breakfaithData: [],
            breakfaithPage: 1,
            breakfaithSize: 10,
            breakfaithTotals: 0,
            breakfaithShow: true,
            implementData: [],
            implementPage: 1,
            implementSize: 10,
            implementTotals: 0,
            implementShow: true,
        }
    },
    methods: {
        punishInfo() {
            var condition = {
                id: this.parameter.id,
                page: this.punishPage,
                size: this.punishSize
            };
            network.post("/api/portraits/punish", condition)
                .then(res => {
                    this.punishData = res.data.data.list;
                    this.punishTotals = res.data.data.totalCount;
                    if (res.code == 0) {
                        this.punishShow = false;
                    }
                }).catch(error => {
                    this.punishShow = false;
                })
        },
        punishChange(val) {
            this.punishPage = val
            this.punishInfo()
        },

        breakfaithInfo() {
            var condition = {
                id: this.parameter.id,
                page: this.breakfaithPage,
                size: this.breakfaithSize
            };
            network.post("/api/portraits/abninf", condition)
                .then(res => {
                    this.breakfaithData = res.data.data.list;
                    this.breakfaithTotals = res.data.data.totalCount;
                    if (res.code == 0) {
                        this.breakfaithShow = false;
                    }
                }).catch(error => {
                    this.breakfaithShow = false;
                })
        },
        breakfaithChange(val) {
            this.breakfaithPage = val
            this.breakfaithInfo()
        },
        implementInfo() {
            var condition = {
                id: this.parameter.id,
                page: this.implementPage,
                size: this.implementSize
            };
            network.post("/api/portraits/breaklaw", condition)
                .then(res => {
                    this.implementData = res.data.data.list;
                    this.implementTotals = res.data.data.totalCount;
                    if (res.code == 0) {
                        this.implementShow = false;
                    }
                }).catch(error => {
                    this.implementShow = false;
                })
        },
        implementChange(val) {
            this.implementPage = val
            this.implementInfo()
        },
    },
    mounted: function() {
        this.punishInfo()
        this.breakfaithInfo();
        this.implementInfo();
    },
    components: {

    }

}
</script>

<style lang="less">
.public-info .title {
    font-size: 16px;
    color: #222;
    font-weight: 600;
    line-height: 1.8;
    float: left;
}

.kg-pagination {
    margin-top: 20px;
    float: right;
}

.cell {
    text-align: left !important;
}

.el-table__empty-text{
    width: 5% !important;
}


</style>
