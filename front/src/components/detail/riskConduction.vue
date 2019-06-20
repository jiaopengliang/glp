<template lang="html">
    <div class="risk-conduction">
        <div v-show="totaltpathShow">
            <el-table
                :data="totaltpathDate"
                style="width: 100%">
                <el-table-column
                    prop="eventType"
                    label="事件项">
                </el-table-column>
                <el-table-column label="事件链接">
                    <template slot-scope="scope">
                        <a v-bind:href="scope.row.url" style="color: rgb(95, 98, 101);cursor: pointer;text-decoration: underline;">{{scope.row.title}}</a>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="eventtime"
                    label="事件时间">
                </el-table-column>
                <el-table-column
                    prop="source"
                    label="事件源">
                </el-table-column>
                <el-table-column label="风险贡献度">
                    <template slot-scope="scope">
                        <span>{{scope.row.score}}%</span>
                    </template>
                </el-table-column>
                <el-table-column label="传导步数">
                    <template slot-scope="scope">
                        <span class="step" @click="riskStep(scope.row)">{{scope.row.step}}</span>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div v-show="stepRisk">
            <span class="el-icon-arrow-left back" @click="backRisklist">返回</span>            
            <div class="path-graph-icon">
                <span style="background: rgb(249, 75, 75);margin-right: 5px;"></span>风险源企业
                <span style="background: rgb(251, 165, 93);margin-right: 5px;margin-left: 20px;"></span>传导路径企业
                <span style="background: rgb(149, 177, 253);margin-left: 20px;margin-right: 5px;"></span>受影响企业            
            </div>
            <div id="graph-wrapper" class="graph-risk"></div>
        </div>
    </div>
</template>

<script>
import network from "@/libs/network"
import { getToken, getItem, removeItem } from "@/libs/storage";
import graph from "@/libs/graph";
import { graphRiskNode, graphLink, } from "@/libs/constants";

export default {
    name: "RiskConduction",
    data() {
        return {
            parameter: getItem('parameter') || {},
            page: 1,
            size: 100,
            totaltpathDate: [],
            totaltpathShow: true,
            stepRisk: false,
        }
    },
    methods: {
        resultsoreData: function() {
            var condition = {
                ssid: this.parameter.ssid || this.parameter.id,
                page: this.page,
                size: this.size
            };
            network.post('/api/portraits/resultotaltpath', condition)
                .then(res => {
                    this.totaltpathDate = res.data.data.list;
                })
        },
        riskStep: function(id) {
            if (id.step != '0') {
                this.resultpath(id.pathid);
                this.totaltpathShow = false;
                this.stepRisk = true;
            }
        },
        resultpath: function(pathid) {
            network.post('/api/portraits/resultpath', { pathid: pathid })
                .then(res => {
                    this.initializeGraph();
                    this.graphInstance.replaceData(
                        this.formatGraphStyle(res.data.data)
                    );
                    this.graphInstance.replaceSettings({
                        navigation: {
                            mode: "showall"
                        },
                        style: {
                            selection: {
                                enabled: false
                            }
                        }
                    });
                })
        },
        initializeGraph: function() {
            this.graphInstance = graph({
                container: document.getElementById("graph-wrapper"),
                area: {
                    height: document.getElementById("graph-wrapper").offsetHeight + 90,
                }
            });
        },
        formatGraphStyle: function(data) {
            data.nodes.forEach(node => {
                node.loaded = true;
                node.style = {
                    label: node.name
                };
                if (node.tag in graphRiskNode) {
                    Object.assign(node.style, graphRiskNode[node.tag]);
                } else {
                    Object.assign(node.style, graphRiskNode.default);
                }
            });
            data.links.forEach(link => {
                link.from = link.fromid;
                link.to = link.toid;
                link.style = {};
                switch (link.relationtype) {
                    case "Investment":
                        Object.assign(link.style, graphLink[link.relationtype]);
                        break;
                    case "Guarantee":
                        Object.assign(link.style, graphLink[link.relationtype]);
                        break;
                    case "Hide":
                        Object.assign(link.style, graphLink[link.relationtype]);
                        break;
                    default:
                        Object.assign(link.style, graphLink.default);
                }
            });
            return data;
        },
        backRisklist: function() {
            this.totaltpathShow = true;
            this.stepRisk = false;
        }
    },
    mounted: function() {
        this.resultsoreData();
    },
}
</script>

<style lang="less">
.risk-conduction {
    p {
        text-align: left;
        margin: 0px;
        padding: 0px;
    }

    .step {
        cursor: pointer;
        color: rgb(77, 124, 254);
        text-decoration: underline;
    }
    .graph-risk {
        background: rgb(255, 255, 255);
        height: 500px;
        margin-top: 50px;
        position: relative;
    }
    .path-graph-icon {
        position: absolute;
        right: 84px;
        z-index: 1000;
        font-size: 14px;
        background: #fff;
    }
    .path-graph-icon span {
        border-radius: 10px;
        display: inline-block;
        height: 10px;
        width: 10px;
    }
    .back {
        position: absolute;
        left: 95px;
        z-index: 1000;
        font-size: 14px;
        cursor: pointer;
        background: #fff;
    }
}
</style>
