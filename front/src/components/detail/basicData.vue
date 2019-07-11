<template lang="html">
    <div class="face-info" id="face-info">
        <div class="model">
            <h3 class="title">工商信息</h3>
            <div class="msg-con clearfix">
                <p> 企业名称：<span class="blue">{{information.name || '--'}}</span></p>
                <p> 曾用名：<span class="blue">{{information.onceName || '--'}}</span></p>
                <p> 电话：<span class="blue">{{information.tel || '--'}}</span></p>
                <p> 统一社会信用代码：<span class="blue">{{information.uniscid || '--'}}</span></p>                
                <p> 工商注册号：<span class="blue">{{information.regNo || '--'}}</span></p>
                <p> 组织机构代码：<span class="blue">{{information.licid || '--'}}</span></p>
                <p> 企业状态：<span class="blue">{{information.entstatus || '--'}}</span></p>
                <p> 企业类型：<span class="blue">{{information.entType || '--'}}</span></p>
                <p> 成立日期：<span class="blue">{{information.esDate || '--'}}</span></p>
                <p> 地址：{{information.address || '--'}}<span ></span></p>
                <p> 法定代表人：{{information.legalPerson || '--' }}<span ></span></p>
                <p> 经营期限：{{information.operationDate || '--'}}<span ></span></p>
                <p> 注册资本：{{information.regCapital || '--'}}<span ></span></p>
                <p> 登记机关：{{information.regOrg	 || '--'}}<span ></span></p>
                <p> 认缴资本：{{information.agreePay || '--'}}<span ></span></p>
                <p> 行业门类：{{information.industry || '--'}}<span ></span></p>
                <p> 国别/地区：{{information.region || '--'}}<span ></span></p>
                <p style="width:100%;"> 一般经营范围：{{information.operationScope || '--'}}<span ></span></p>
            </div>
        </div>
        <div class="holder-info" id="holder-info">
            <h3 class="title">股东信息 <span class="info-num">{{totals}}</span> </h3>
        <div class="kg-table">
            <el-table :data="tableData" style="width: 100%" border>
                <el-table-column label="序号" width="80px">
                    <template slot-scope="scope">
                        <span>{{scope.$index+1+10*(page-1)}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="shName" label="股东名称">
                </el-table-column>
                <el-table-column label="持股比例">
                    <template slot-scope="scope">
                        <span class="isListed">{{scope.row.rate}}%</span>
                    </template>
                </el-table-column>
                <el-table-column label="认缴出资额(万元)">
                    <template slot-scope="scope">
                        <span class="isListed">{{scope.row.subscribe}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="认缴出资日期">
                    <template slot-scope="scope">
                        <span>{{scope.row.subscribeDate || '--'}}</span>                        
                    </template>
                </el-table-column>
                <el-table-column label="实缴出资额(万元)">
                    <template slot-scope="scope">
                        <span class="isListed">{{scope.row.realPay}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="实缴出资日期">
                    <template slot-scope="scope">                      
                        <span>{{scope.row.realPayDate || '--'}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="出资方式">
                    <template slot-scope="scope">
                        <span>{{scope.row.payWay || '--'}}</span>
                    </template>
                </el-table-column>
            </el-table>
            <div class="kg-pagination" v-if="isshowpagination">
                <el-pagination background layout="prev, pager, next" :total="totals" @current-change="handleSizeChange">
                </el-pagination>
            </div>
            <div class="invest-info" id="invest-info" style="margin-top:58px;">
                <h3 class="title">对外投资 <span class="info-num">{{investTotals}}</span> </h3>
            </div>
            <div class="kg-table">
                <el-table :data="investData" style="width: 100%" border>
                    <el-table-column label="序号" width="80px">
                        <template slot-scope="scope">
                            <span>{{scope.$index+1+10*(investPage-1)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="name" label="被投资企业名称">
                    </el-table-column>
                    <el-table-column label="被投资法定代表人">
                        <template slot-scope="scope">
                            <span class="isListed">{{scope.row.legalPerson}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="注册资本">
                        <template slot-scope="scope">
                            <span class="isListed">{{scope.row.regCapital}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="出资比例">
                        <template slot-scope="scope">
                            <span v-if="scope.row.rate == null ">--</span>
                            <span v-else >{{scope.row.rate}}%</span>                        
                        </template>
                    </el-table-column>
                    <el-table-column label="成立日期">
                        <template slot-scope="scope">
                            <span class="isListed">{{scope.row.esDate || '--'}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="状态">
                        <template slot-scope="scope">
                            <span>{{scope.row.entstatus || '--'}}</span>                            
                        </template>
                    </el-table-column>
                </el-table>
                <div class="kg-pagination" v-if="investShow">
                    <el-pagination background layout="prev, pager, next" :total="investTotals" @current-change="investChange">
                    </el-pagination>
                </div>
            </div>

            <div class="invest-info" id="invest-info">
                <h3 class="title">分支机构 <span class="info-num">{{branchTotals}}</span> </h3>
            </div>
            <div class="kg-table">
                <el-table :data="branchData" style="width: 100%" border>
                    <el-table-column label="序号" width="80px">
                        <template slot-scope="scope">
                            <span>{{scope.$index+1+10*(branchPage-1)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="sonName" label="分支机构名称">
                    </el-table-column>
                </el-table>
                <div class="kg-pagination" v-if="branchShow">
                    <el-pagination background layout="prev, pager, next" :total="branchTotals" @current-change="branchChange">
                    </el-pagination>
                </div>
            </div>

            <div class="invest-info" id="invest-info">
                <h3 class="title">主要人员 <span class="info-num">{{personTotals}}</span> </h3>
            </div>
            <div class="kg-table">
                <el-table :data="personData" style="width: 100%" border>
                    <el-table-column label="序号" width="80px">
                        <template slot-scope="scope">
                            <span>{{scope.$index+1+10*(personPage-1)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="name" label="名称">
                    </el-table-column>
                    <el-table-column prop="title" label="职位">
                    </el-table-column>
                    <el-table-column prop="isLegal" label="是否法人">
                    </el-table-column>
                </el-table>
                <div class="kg-pagination" v-if="personShow">
                    <el-pagination background layout="prev, pager, next" :total="personTotals" @current-change="personChange">
                    </el-pagination>
                </div>
            </div>

            <div class="invest-info" id="invest-info">
                <h3 class="title">变更记录 <span class="info-num">{{changeTotals}}</span> </h3>
            </div>
            <div class="kg-table">
                <el-table :data="changeData" style="width: 100%" border>
                    <el-table-column label="序号" width="80px">
                        <template slot-scope="scope">
                            <span>{{scope.$index+1+10*(branchPage-1)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="变更日期">
                        <template slot-scope="scope">
                            <span >{{scope.row.altDate}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="变更项目">
                        <template slot-scope="scope">
                            <span>{{scope.row.altName}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="变更前">
                        <template slot-scope="scope">
                            <span v-html="scope.row.altBefore">{{scope.row.altBefore}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="变更后">
                        <template slot-scope="scope">
                            <span v-html="scope.row.altAfter">{{scope.row.altAfter}}</span>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="kg-pagination" v-if="changeShow">
                    <el-pagination background layout="prev, pager, next" :total="changeTotals" @current-change="changeChange">
                    </el-pagination>
                </div>
            </div>
            <div class="controller-info" id="controller-info">
                <div class="model">
                    <h3 class="title">实际控制人
                        <span class="info-num" v-if="actualController !== null">1</span>
                        <span class="info-num" v-else>0</span>
                    </h3>
                    <div class="msg-con clearfix" v-if="actualController !== null">
                        <p> 企业名称：<span class="blue">{{actualController.name || '--'}}</span></p>
                        <p> 法定代表人：<span class="blue">{{actualController.legalPerson || '--'}}</span></p>
                        <p> 注册资本：<span class="blue">{{actualController.regCapital || '--'}}</span></p>
                        <p> 成立日期：<span class="blue">{{actualController.esDate || '--'}}</span></p>
                    </div>
                    <div class="msg-con clearfix" v-else>
                        暂无实际控制人
                    </div>
                </div>
            </div>
             <!-- <div class="benificial-info" id="benificial-info">
                <h3 class="title">受益所有人 
                    <span class="info-num" v-if="information.benefit !== null">1</span>
                    <span class="info-num" v-else>0</span>
                </h3>
                <div class="msg-con clearfix" v-if="information.benefit !== null" v-for="(item,index) in information.benefit">
                    <p> 受益人名称：<span class="blue">{{item.personName || '--'}}</span></p>
                    <p> 企业名称：<span class="blue">{{item.name || '--'}}</span></p>
                    <p> 控股比例：<span class="blue">{{item.weight || '--'}}%</span></p>
                    <p> 职务：<span class="blue">{{item.titles || '--'}}</span></p>
                </div>
                <div class="msg-con clearfix" v-else>
                    <p>暂无受益所有人</p>
                </div>
            </div> -->
            <!-- <div>
                <el-collapse accordion>
                    <el-collapse-item>
                        <template slot="title">
                            <span>aaaaaaaaa</span>
                        </template>
                        <span>bbbbbbb</span>
                    </el-collapse-item>
                </el-collapse>
            </div> -->

        </div>
        </div>
    </div>
</template>

<script>
import network from "@/libs/network"
import { getItem, removeItem } from "@/libs/storage";
export default {
    data() {
        return {
            information: {},
            parameter: getItem('parameter') || {},
            page: 1,
            size: 10,
            showIndex: true,
            tableData: [],
            totals: 0,
            isshowpagination: true,
            investData: [],
            investPage: 1,
            investSize: 10,
            investTotals: 0,
            investShow: true,
            branchData: [],
            branchPage: 1,
            branchSize: 10,
            branchTotals: 0,
            branchShow: true,
            personData: [],
            personPage: 1,
            personSize: 10,
            personTotals: 0,
            personShow: true,
            changeData: [],
            changePage: 1,
            changeSize: 10,
            changeTotals: 0,
            changeShow: true,
            actualController:{}
        }
    },
    methods: {
        handleSizeChange(val) {
            this.page = val
            this.getInvest()
        },
        getInvest() {
            var condition = {
                id: this.parameter.id,
                page: this.page,
                size: this.size
            };
            network.post("/api/portraits/shareholder", condition)
                .then(res => {
                    this.tableData = res.data.data.list;
                    this.totals = res.data.data.totalCount;
                    if(res.data.code == 400){
                        this.isshowpagination = false;                        
                    }
                }).catch(error => {
                    this.isshowpagination = false
                })
        },
        getinfo() {
            var condition = {
                id: this.parameter.id,
                page: this.investPage,
                size: this.investSize
            };
            network.post("/api/portraits/invest", condition)
                .then(res => {
                    this.investData = res.data.data.list;
                    this.investTotals = res.data.data.totalCount
                    if(res.data.code == 400){
                        this.investShow = false;
                    }
                }).catch(error => {
                    this.investShow = false;
                })
        },
        investChange(val) {
            this.investPage = val
            this.getinfo()
        },
        getbranch() {
            var condition = {
                id: this.parameter.id,
                page: this.branchPage,
                size: this.branchSize
            };
            network.post("/api/portraits/branch", condition)
                .then(res => {
                    this.branchData = res.data.data.list;
                    this.branchTotals = res.data.data.totalCount;
                    if(res.data.code == 400){
                        this.branchShow = false;
                    }
                }).catch(error => {
                    this.branchShow = false
                })
        },
        branchChange(val) {
            this.branchPage = val
            this.getbranch()
        },
        getperson() {
            var condition = {
                id: this.parameter.id,
                page: this.personPage,
                size: this.personSize
            };
            network.post("/api/portraits/keyPerson", condition)
                .then(res => {
                    this.personData = res.data.data.list;
                    this.personTotals = res.data.data.totalCount;
                    if(res.data.code == 400){
                        this.personShow = false                        
                    }
                }).catch(error => {
                    this.personShow = false
                })
        },
        personChange(val) {
            this.personPage = val
            this.getperson()
        },
        getchange() {
            var condition = {
                id: this.parameter.id,
                page: this.changePage,
                size: this.changeSize
            };
            network.post("/api/portraits/changes", condition)
                .then(res => {
                    this.changeData = res.data.data.list;
                    this.changeTotals = res.data.data.totalCount;
                    if(res.data.code == 400){
                        this.changeShow = false                        
                    }
                }).catch(error => {
                    this.changeShow = false
                })
        },
        changeChange(val) {
            this.changePage = val
            this.getchange()
        },
    },
    mounted: function() {
        this.getInvest();
        this.getinfo();
        this.getbranch();
        this.getperson();
        this.changeChange();
        network.get("/api/portraits/businessInfo?id=" + this.parameter.id)
            .then(res => {
                this.information = res.data.data;
                if(res.data.code == 400){
                    this.actualController = {};                    
                }else{
                    this.actualController = res.data.data.controller;                    
                }
        })

    },
    components: {
        
    }

}
</script>

<style lang="less">
.face-info {
    .title {
        font-size: 16px;
        color: #222;
        font-weight: 600;
        line-height: 1.8;
        text-align: left;
    }
    .msg-con {
        font-size: 14px;
        margin-top: 2px;
        padding: 0 16px;
        &+.msg-con {
            border-top: 1px solid #ddd;
        }
        p {
            float: left;
            width: 500px;
            min-height: 34px;
            line-height: 28px;
            padding-right: 30px;
        }
    }
}

.holder-info {
    .title {
        font-size: 16px;
        color: #222;
        font-weight: 600;
        line-height: 1.8;
        .info-num {
            font-family: "Microsoft YaHei", Arial;
            font-size: 16px;
            font-weight: 600;
            color: #128bed;
        }
    }
}

.kg-table {
    .kg-pagination {
        margin-top: 20px;
        float: right;
    }
    &::after {
        content: "";
        clear: both;
        display: block;
    }
}

.face-info div {
    text-align: left;
}

.el-pagination.is-background .el-pager li:not(.disabled).active {
    background-color: #409EFF !important;
    color: #fff !important;
}

.invest-info {
    .title {
        font-size: 16px;
        color: #222;
        font-weight: 600;
        line-height: 1.8;
        .info-num {
            font-family: "Microsoft YaHei", Arial;
            font-size: 16px;
            font-weight: 600;
            color: #128bed;
        }
    }
}

.controller-info {
    .title {
        font-size: 16px;
        color: #222;
        font-weight: 600;
        line-height: 1.8;
        .info-num {
            font-family: "Microsoft YaHei", Arial;
            font-size: 16px;
            font-weight: 600;
            color: #128bed;
        }
    }
    .msg-con {
        font-size: 14px;
        margin-top: 2px;
        padding: 0 16px;
        &+.msg-con {
            border-top: 1px solid #ddd;
        }
        p {
            float: left;
            width: 500px;
            min-height: 34px;
            line-height: 28px;
            padding-right: 30px;
        }
    }
}
.benificial-info{
        .title{
            font-size: 16px;color: #222;font-weight: 600;
            line-height: 1.8;
            .info-num{
                font-family: "Microsoft YaHei",Arial;font-size: 16px;font-weight: 600;
                color: #128bed;
            }
        }
        .msg-con{
            font-size:14px;margin-top:2px;padding:6px 16px 20px;
            overflow: hidden;
            & + .msg-con{ border-top:1px solid #ddd; }
            p{
                float: left; width:500px;line-height:28px;padding-right:30px;
            }
        }
    }
    .kg-table span font {
    color: red;
}
</style>
