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
                    <el-table-column label="案件编号">
                        <template slot-scope="scope">
                            <a v-if="!scope.row.urlcpws" style="color: rgb(95, 98, 101);cursor: pointer;text-decoration: underline;">{{scope.row.caseno}}</a>
                            <a v-else target="_blank" v-bind:href="scope.row.urlcpws" style="color: rgb(95, 98, 101);cursor: pointer;text-decoration: underline;">{{scope.row.caseno}}</a>                            
                        </template>
                    </el-table-column>
                    <el-table-column prop="casefildate" label="立案时间">
                    </el-table-column>
                    <el-table-column prop="excourt" label="执行法院">
                    </el-table-column>
                    <el-table-column prop="province" label="省份">
                    </el-table-column>
                    <el-table-column label="履行情况">
                        <template slot-scope="scope">
                                <el-popover
                                    ref="popover"
                                    placement="top-start"
                                    width="400"
                                    trigger="click">
                                    <span v-html="scope.row.duty">{{scope.row.duty}}</span>
                                    <span slot="reference" style="cursor: pointer;text-decoration: underline;">{{scope.row.performance}}</span>
                                </el-popover>
                        </template>
                    </el-table-column>
                    <el-table-column prop="performedpart" label="已履行部分">
                    </el-table-column>
                    <el-table-column prop="umperformoart" label="未履行部分">
                    </el-table-column>
                    <el-table-column prop="gistid" label="执行依据文号">
                    </el-table-column>
                    <el-table-column prop="gistunit" label="执行依据单位">
                    </el-table-column>
                    <el-table-column prop="pubdate" label="发布时间">
                    </el-table-column>
                    <el-table-column prop="illegality" label="失信被执行人行为">
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
            visible: false
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
            network.post("/api/portraits/excutinf", condition)
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

.el-table__empty-text {
    width: 5% !important;
}
</style>
