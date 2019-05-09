<template>
  <div>
    <div class="glp-home" v-show="graphShow">
      <Header v-show="!isReferenced"></Header>
      <div class="glp-logo"></div>
      <div class="glp-search-box">
        <div style="width:560px;float:left;position: relative;">
          <input type="text" v-model="searchname" @keyup="choose_event($event)" @input="changeSearchName" placeholder="请输入要查询的企业名称"></input>
          <div class="input-inner-detail">
            <span class="company-detail" :class="{showDetail:isshowdetailBtnOnly}" @click="godetailEvent()">公司详情</span>
            <span @click="deleteBtn()" class="dele" v-show="searchname.length !== 0 ">x</span>
          </div>
          <slot class="slot" name="searchbtn"></slot>
          <ul class="list">
            <li v-for="(item,index) in searchList" :key="item.id" @click="itemGlp(item,index)">
              {{item.name}}
            </li>
          </ul>
        </div>
        <div class="glp-search" @click="searchGroup">搜索图谱</div>
      </div>

    </div>
    <div class="glp-graph" style="overflow-x: hidden;" v-show="graphAfter">
      <div class="boxLoading" v-show="graphLoading"></div>
      <header class="graph-header">
        <img src="../assets/images/glp/glpLogo.png" alt="" @click="goBack()">
        <div class="title">{{titleName}} -
          <span>{{searchname || "******"}}</span>
        </div>
        <div class="head-right" @click="logoutEve()" v-show="!isReferenced">
          <span class="name">{{this.admin.name}}</span>
          <p class="login-out" @click="logout()" :class="{'active':isshowExc}">退出登录</p>
        </div>
      </header>
      <div id="graph-wrapper" :class="{'graph-wrapper':fullscreen}"></div>

      <div class="legend-wrapper" v-show="legendControl">
        <div style="position:relation">
          <ul class="graph-toolbar">
            <li @click="graphExplainShow=!graphExplainShow" class="graph-explain" title="图例说明"></li>
            <!-- <li @click="shareRatioBut" class="investment-ratio" title="股权比例"></li> -->
            <li @click="exportImg" class="investment-ratio" title="下载图谱">
              <i class="el-icon-download" style="font-size: 18px;"></i>
            </li>
            <li @click="lockGraph" class="graph-lock" :title="alllockgraph? '解锁全部' : '全部锁定'">
              <i></i>
            </li>
            <li @click="graphLinksText" class="graph-text" :title="graphtext? '关闭比例值' : '显示比例值'">
              <i></i>
            </li>
            <li @click="resetLayout" class="graph-refresh" title="刷新"></li>
            <li @click="toggleFullscreen" :class="fullscreen? 'graph-normalscreen' : 'graph-fullscreen'" :title="fullscreen? '退出全屏' : '全屏'"></li>
          </ul>
        </div>
        <div :class="graphExplainShow?'graph-legend-active':'graph-legend'">
          <p class="graph-legend-title unselectable">
            关系
          </p>
          <ul class="graph-legend-content">
            <li v-for="legend in legendData" :key="legend.type" v-show="legend.show">
              <Arrow :arrow-data="legend" :click-event="toggleRelation" v-if="modelReset" />
            </li>
          </ul>
          <p class="graph-legend-title">
            图例
          </p>
          <ul class="graph-legend-content tuli">
            <li>
              <img src="../assets/images/position.png" alt="搜索企业"> 搜索企业
            </li>
            <li>
              <img src="../assets/images/glp/glp_credit.png" alt="授信"> 授信
              <!-- <span style="width:12px;height:12px;display: inline-block;background: #bc2f2f;border-radius: 100px;"></span> 龙头企业 -->
            </li>
            <li>
              <img src="../assets/images/glp/glp_credited.png" alt="非授信"> 非授信
              <!-- <span style="width:12px;height:12px;display: inline-block;background: #0076ff;border-radius: 100px;"></span> 最终受益人 -->

            </li>
            <li>
              <img src="../assets/images/glp/glp_person.png" alt="个人"> 个人
            </li>
            <li>
              <img src="../assets/images/glp/glp_company.png" alt="企业"> 企业
              <!-- <span style="width:12px;height:12px;display: inline-block;background: #ffb648;border-radius: 100px;"></span> 龙骨架企业 -->
            </li>
          </ul>
        </div>
      </div>

      <div class="glp-graph-search" v-show="graphAfter">
        <div style="width:380px;float:left;position: relative;">
          <input type="text" v-model="graphname" @input="graphSearchName" placeholder="请输入节点名称,快速定位"></input>
          <div class="input-inner-detail">
            <span @click="deleteBtnGraph()" class="dele" v-show="graphname.length !== 0 ">x</span>
          </div>
          <slot class="slot" name="searchbtn"></slot>
          <ul class="list">
            <li v-for="(item,index) in NewItems" :key="item.id" @click="graphPoistion(item,index)">
              {{item.name}}
            </li>
          </ul>
        </div>
        <div class="glp-searchEnd" :class="{glpSearchEnd:glpsearchEnd}">
          <input type="text" v-model="searchOrigin" placeholder="请输入起点" class="search-end" style="border-right:none;padding-right:6px;" disabled="true"></input>
          <div class="searchCenter">—</div>
          <input type="text" v-model="searchEnd" @input="graphSearchEnd" placeholder="请输入终点" class="search-end" style="border-left:none;padding-right:30px;"></input>
          <div class="input-inner-detail">
            <span @click="deletesearchEnd()" class="dele" v-show="searchEnd.length !== 0 ">x</span>
          </div>
          <slot class="slot" name="searchbtn"></slot>
          <ul class="list">
            <li v-for="(item,index) in searchListGraphEnd" :key="item.id" @click="itemGlpGraphEnd(item,index)">
              {{item.name}}
            </li>
          </ul>
        </div>
      </div>
      <div class="leftView" v-show="graphAfter">
        <ul>
          <li>
            <div v-show="views == 1">
              <img src="../assets/images/glp/search-puxi.png" alt="">
              <p style="color:#FE7011">企业谱系</p>
            </div>
            <div v-show="views!=1" @click="GlpselectView(1)">
              <img src="../assets/images/glp/search-puxi.png" alt="">
              <p>企业谱系</p>
            </div>
          </li>
          <li>
            <div v-show="views == 2">
              <img src="../assets/images/glp/search-stock.png" alt="">
              <p style="color:#FE7011">股权穿透</p>
            </div>
            <div v-show="views != 2" @click="GlpselectView(2)">
              <img src="../assets/images/glp/search-stock.png" alt="">
              <p>股权穿透</p>
            </div>
          </li>
          <li>
            <div v-show="views ==3">
              <img src="../assets/images/glp/search-actual.png" alt="">
              <p style="color:#FE7011">实际控制人</p>
            </div>
            <div v-show="views !=3" @click="GlpselectView(3)">
              <img src="../assets/images/glp/search-actual.png" alt="">
              <p>实际控制人</p>
            </div>
          </li>
          <li>
            <div v-show="views ==4">
              <img src="../assets/images/glp/search-stock.png" alt="">
              <p style="color:#FE7011">关系探查</p>
            </div>
            <div v-show="views !=4" @click="GlpselectView(4)">
              <img src="../assets/images/glp/search-stock.png" alt="">
              <p>关系探查</p>
            </div>
          </li>
        </ul>
        <!-- <div class="leftInfo" v-show="leftInfoShow">
                                                                    <p class="leftInfo-title">{{leftInfoTitle.deptName}}</p>
                                                                    <p class="leftInfo-li">实际控制人(法人)：
                                                                      <span class="leftInfo-span" v-bind:title="leftInfoTitle.conName">{{leftInfoTitle.conName}}</span>
                                                                    </p>
                                                                    <p class="leftInfo-li">最终受益人：
                                                                      <span class="leftInfo-span" v-bind:title="leftInfoTitle.final">{{leftInfoTitle.final || '--'}}</span>
                                                                    </p>
                                                                  </div> -->
      </div>
      <div v-show="graphPopup" :style="graphPopupStyle" class="graph-popup">
        <ul>
          <li @click="goDetil(graphNodeInfo.id)" style="margin-top:0px;">公司详情</li>
          <li @click="nodesNone(graphNodeInfo.id)">折叠节点</li>
        </ul>
      </div>

      <el-dialog :visible.sync="creditDialogVisible" width="80%" height="80%" center>
        <p class="collapse-span">
          <span>授信方</span>
          <span>授信对象</span>
          <span>类型</span>
          <span>金额</span>
        </p>
        <el-collapse accordion>
          <el-collapse-item v-for="info in CreditData" :key="info.id">
            <template slot="title">
              <span class="collapse-one">{{info.fromname || '--'}}</span>
              <span class="collapse-one">{{info.toname || '--'}}</span>
              <span class="collapse-one">{{info.type || '--'}}</span>
              <span class="collapse-one">{{info.amount || '--'}}</span>
            </template>
            <p class="collapse-spanTwo" v-if="info.bill != null">
              <span>保理金额</span>
              <span>利率</span>
              <span>买方名称</span>
              <span>卖方名称</span>
              <span>计息日</span>
              <span>最晚还款日</span>
              <span>预计应还总额</span>
              <span>预计应还本金</span>
              <span>预计收益</span>
              <span>实际已还本金</span>
              <span>实际已还利息</span>
              <span>实际利息</span>
              <span>状态</span>
              <span>结清日期</span>
            </p>
            <p v-for="li in info.bill" class="collapse-p" :key="li.id" v-if="info.bill != null">
              <span v-bind:title="li.amount">{{li.amount || '--'}}</span>
              <span v-bind:title="li.rate">{{li.rate || '--'}}</span>
              <span v-bind:title="li.buyer">{{li.buyer || '--'}}</span>
              <span v-bind:title="li.seller">{{li.seller || '--'}}</span>
              <span v-bind:title="li.interesttime">{{li.interesttime || '--'}}</span>
              <span v-bind:title="li.endrepaytime">{{li.endrepaytime || '--'}}</span>
              <span v-bind:title="li.estrepamount">{{li.estrepamount || '--'}}</span>
              <span v-bind:title="li.estbal">{{li.estbal || '--'}}</span>
              <span v-bind:title="li.estint">{{li.estint || '--'}}</span>
              <span v-bind:title="li.realbal">{{li.realbal || '--'}}</span>
              <span v-bind:title="li.realint">{{li.realint || '--'}}</span>
              <span v-bind:title="li.realnorint">{{li.realnorint || '--'}}</span>
              <span v-bind:title="li.status">{{li.status || '--'}}</span>
              <span v-bind:title="li.settletime">{{li.settletime || '--'}}</span>
            </p>
            <p class="collapse-spanTwo1" v-if="info.contract != null">
              <span>租赁业务类型</span>
              <span>租赁期开始日</span>
              <span>租赁到期日</span>
              <span>租赁资产总价款</span>
              <span>租赁物售价</span>
              <span>首付比例</span>
              <span>首付金额</span>
              <span>融资额</span>
              <span>净融资额</span>
              <span>租金总额</span>
              <span>利息总额</span>
              <span>其他收入总额</span>
              <span>合同总额</span>
              <span>等额本息租金</span>
              <span>收到租金</span>
              <span>收到本金</span>
              <span>收到利息</span>
            </p>
            <p v-for="li in info.contract" class="collapse-p1" :key="li.id" v-if="info.contract != null">
              <span v-bind:title="li.bustype">{{li.bustype || '--'}}</span>
              <span v-bind:title="li.startdate">{{li.startdate || '--'}}</span>
              <span v-bind:title="li.enddate">{{li.enddate || '--'}}</span>
              <span v-bind:title="li.itemamount">{{li.itemamount || '--'}}</span>
              <span v-bind:title="li.itemcost">{{li.itemcost || '--'}}</span>
              <span v-bind:title="li.payratio">{{li.payratio || '--'}}</span>
              <span v-bind:title="li.payment">{{li.payment || '--'}}</span>
              <span v-bind:title="li.finamount">{{li.finamount || '--'}}</span>
              <span v-bind:title="li.actfinamount">{{li.actfinamount || '--'}}</span>
              <span v-bind:title="li.totalren">{{li.totalren || '--'}}</span>
              <span v-bind:title="li.totalint">{{li.totalint || '--'}}</span>
              <span v-bind:title="li.totalfee">{{li.totalfee || '--'}}</span>
              <span v-bind:title="li.contractamount">{{li.contractamount || '--'}}</span>
              <span v-bind:title="li.pmt">{{li.pmt || '--'}}</span>
              <span v-bind:title="li.recerental">{{li.recerental || '--'}}</span>
              <span v-bind:title="li.receprin">{{li.receprin || '--'}}</span>
              <span v-bind:title="li.receint">{{li.receint || '--'}}</span>
            </p>
          </el-collapse-item>
        </el-collapse>
      </el-dialog>
      <!-- 债权-基础债权来源 -->
      <el-dialog :visible.sync="clalmDialogVisible" width="80%" height="80%" center>
        <el-table :data="ClalmData" style="width: 100%">
          <el-table-column prop="eventname" label="事件名称" width="180">
          </el-table-column>
          <el-table-column prop="fromname" label="应付方" width="250">
          </el-table-column>
          <el-table-column prop="toname" label="应收方" width="250">
          </el-table-column>
          <el-table-column prop="eventamt" label="涉及金额">
          </el-table-column>
          <el-table-column prop="assetstatus" label="资产状态">
          </el-table-column>
        </el-table>
      </el-dialog>
      <!-- 债权-融租-融租供应商 -->
      <el-dialog :visible.sync="clalmDialogleasing" width="80%" height="80%" center>
        <el-table :data="ClalmData" style="width: 100%">
          <el-table-column prop="eventname" label="事件名称" width="180">
          </el-table-column>
          <el-table-column prop="fromname" label="供应商" width="250">
          </el-table-column>
          <el-table-column prop="toname" label="承租人" width="250">
          </el-table-column>
          <el-table-column prop="eventamt" label="涉及金额">
          </el-table-column>
          <el-table-column prop="assetstatus" label="资产状态">
          </el-table-column>
        </el-table>
      </el-dialog>
      <!-- 担保 -->
      <el-dialog :visible.sync="GuaranteeDialogVisible" width="80%" height="80%" center>
        <el-table :data="guaranteeData" style="width: 100%">
          <el-table-column prop="eventname" label="事件名称" width="180">
          </el-table-column>
          <el-table-column prop="fromname" label="担保方" width="250">
          </el-table-column>
          <el-table-column prop="toname" label="担保对象" width="250">
          </el-table-column>
          <el-table-column prop="eventamt" label="涉及金额">
          </el-table-column>
          <el-table-column prop="subtypecn" label="担保场景">
          </el-table-column>
          <el-table-column prop="relstatus" label="担保状态">
            <template slot-scope="scope">
              <span v-if="scope.row.relstatus == 0">已完成</span>
              <span v-if="scope.row.relstatus == 1">仍在进行</span>
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
      <div class="history-data" v-show="historyShow">
        <el-checkbox v-model="checkedData" label="历史数据" border @change="historyData"></el-checkbox>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import debounce from "lodash/debounce";
import random from "lodash/random";
import Header from '@/components/Header.vue';
import graph from "@/libs/graph";
import network from "@/libs/network";
import { setItem, getItem, removeItem, setToken } from "@/libs/storage";
import { graphNode, graphLink, graphNodeIcon, noData, noPath, position, discredit, graphLinkText } from "@/libs/constants";
import {
  isFullscreenEnabled,
  isFullscreen,
  requestFullscreen,
  exitFullscreen
} from "@/libs/tools";
import Arrow from "@/components/Arrow";
import RelationIntroduction from "@/components/RelationIntroduction";

export default {
  name: "home",
  data: function() {
    return {
      searchname: "",
      searchList: [],
      isshowdetailBtnOnly: false,
      admin: getItem('admin') || {},
      detailId: '',
      graphShow: true,
      title: '',
      graphExplainShow: false,
      legendControl: false,
      graphname: '',
      NewItems: [],
      leftInfoTitle: {},
      views: "",
      originalGraphData: {},
      graphPopup: false,
      graphPopupStyle: {},
      glpsearchEnd: false,
      searchOrigin: '',
      searchEnd: '',
      searchListGraphEnd: [],
      leftInfoShow: true,
      creditDialogVisible: false,
      clalmDialogVisible: false,
      fullscreen: false,
      result: [],
      graphLoading: false,
      graphNodeInfo: {},
      name: "",
      isshowExc: false,
      checkedData: false,
      selectType: [],
      isvalidLinks: [],
      historyShow: false,
      titleName: '企业谱系',
      CreditData: [],
      ClalmData: [],
      nullId: '',
      alllockgraph: false,
      GuaranteeDialogVisible: false,
      guaranteeData: [],
      clalmDialogleasing: false,
      NodesSearch: [],
      isReferenced: false,
      // glpApi: getItem('glpApi') || {},
      modelReset: true,
      graphAfter: false,
      graphtext: false,
    };
  },
  computed: {
    legendData: function() {
      let links = this.$data.originalGraphData.links;
      if (links) {
        this.result[0].count = links.filter(
          item => item.relationType == "Investment"
        ).length;
        this.result[1].count = links.filter(item => item.relationType == "Header").length;
        this.result[2].count = links.filter(item => item.relationType == "Senior").length;
        this.result[3].count = links.filter(item => item.relationType == "Credit").length;
        this.result[4].count = links.filter(item => item.relationType == "Hide").length;
        this.result[5].count = links.filter(item => item.relationType == "Guarantee").length;
        this.result[6].count = links.filter(item => item.relationType == "Claim").length;
      }
      return this.result;
    }
  },
  methods: {
    changeSearchName: debounce(function() {
      network.post("/api/search/ent", {
        identification: this.searchname
      }).then(res => {
        if (res.data) {
          this.searchList = res.data.data.list;
          this.nullId = res.data.data.list[0].id;
        }
      });
    }, 500),

    _clear: function() {
      setTimeout(() => {
        this.searchList = [];
      }, 100);
    },

    itemGlp: function(item) {
      this.searchname = item.name;
      this.isshowdetailBtnOnly = true;
      this.detailId = item.id;
      this._clear()
    },
    deleteBtn: function() {
      this.searchname = '';
      this.detailId = "";      
      this.isshowdetailBtnOnly = false;
      this._clear();
    },
    godetailEvent: function() {
      if (this.isReferenced) {
        setItem("parameter", {
          id: this.detailId,
          isReferenced: true
        })
      } else {
        setItem("parameter", {
          id: this.detailId,
        })
      }
      let routeData = this.$router.resolve({ path: '/detail' })
      window.open(routeData.href, '_blank')
    },
    choose_event: function(e) {
      switch (e.keyCode) {
        case 8: //delete
          this.isshowdetailBtnOnly = false;
          this.detailId = "";          
      }
    },

    //图谱初始化
    initializeGraph: function() {
      this.graphInstance = graph({
        container: document.getElementById("graph-wrapper"),
        area: {
          height: document.documentElement.clientHeight,
        }
      });
    },
    searchGroup: function() {
      debugger
      if (this.detailId == '') {
        return false
      } else {
        this.graphShow = false;
        this.graphAfter = true;
        this.graphLoading = true;
        this.views = '1'
        if (this.checkedData == false) {
          network
            .get('/api/graph/group?id=' + this.detailId + '&isvalid=' + 'Y').then(res => {
              if (res.data) {
                this.NodesSearch = res.data.data.nodes;
                if (res.data.code == 400) {
                  this.leftInfoTitle = {};
                  this.originalGraphData = {};
                }
                else {
                  this.leftInfoTitle = res.data.data.other;
                  this.originalGraphData = res.data.data;
                }
                this.graphLoading = false;
                this.legendControl = true;
                this.historyShow = true;
                this.initializeGraph();
                //无数据时展示
                if (res.data.code == 400) {
                  // this.graphView = false;
                  let obj = { id: 1, name: "暂无数据" };
                  let noData = [];
                  noData.push(obj);
                  this.graphInstance.replaceData(this.noDataGraphStyle(noData))
                  this.graphInstance.replaceSettings({
                    navigation: {
                      mode: "showall"
                    },
                    interaction: {
                      selection: {
                        dragSelect: true
                      }
                    },
                    style: {
                      selection: {
                        enabled: false
                      }
                    }
                  });
                  this.graphInstance.on("pointerDrag");
                } else {
                  this.graphInstance.replaceData(this.formatGraphData(res.data.data));
                  this.graphInstance.replaceSettings({
                    navigation: {
                      mode: "focusnodes",
                      focusNodeExpansionRadius: 2,
                      // numberOfFocusNodes: 1,
                      initialNodes: [this.$data.detailId]
                    },
                    // layout:{
                    //   mode:'static'
                    // },
                    style: {
                      selection: {
                        enabled: true
                      }
                    }
                  });
                  // 点击显示/隐藏浮框
                  this.graphInstance.on("rightClick", this.graphClickEvent);
                  // 图谱拖动隐藏浮框
                  this.graphInstance.on("pointerDrag", this.graphDragEvent);
                  this.graphInstance.on("click", this.graphLeftClick);
                  this.graphInstance.on("doubleClick", this.graphDoubleEvent)
                  this.graphInstance.on("hoverChange", this.graphhoverChange)
                }
              }
            })
        } else if (this.checkedData == true) {
          network
            .get('/api/graph/group?id=' + this.detailId + '&isvalid=' + 'N').then(res => {
              if (res.data) {
                this.NodesSearch = res.data.data.nodes;
                if (res.data.code == 400) {
                  this.leftInfoTitle = {};
                  this.originalGraphData = {};
                }
                else {
                  this.leftInfoTitle = res.data.data.other;
                  this.originalGraphData = res.data.data;
                }
                this.graphLoading = false;
                this.legendControl = true;
                this.historyShow = true;
                this.initializeGraph();
                //无数据时展示
                if (res.data.code == 400) {
                  // this.graphView = false;
                  let obj = { id: 1, name: "暂无数据" };
                  let noData = [];
                  noData.push(obj);
                  this.graphInstance.replaceData(this.noDataGraphStyle(noData))
                  this.graphInstance.replaceSettings({
                    navigation: {
                      mode: "showall"
                    },
                    interaction: {
                      selection: {
                        dragSelect: true
                      }
                    },
                    style: {
                      selection: {
                        enabled: false
                      }
                    }
                  });
                  this.graphInstance.on("pointerDrag");
                } else {
                  this.graphInstance.replaceData(this.formatGraphData(res.data.data));
                  this.graphInstance.replaceSettings({
                    navigation: {
                      mode: "focusnodes",
                      focusNodeExpansionRadius: 2,
                      // numberOfFocusNodes: 1,
                      initialNodes: [this.$data.detailId]
                    },
                    // layout:{
                    //   mode:'static'
                    // },
                    style: {
                      selection: {
                        enabled: true
                      }
                    }
                  });
                  // 点击显示/隐藏浮框
                  this.graphInstance.on("rightClick", this.graphClickEvent);
                  // 图谱拖动隐藏浮框
                  this.graphInstance.on("pointerDrag", this.graphDragEvent);
                  this.graphInstance.on("click", this.graphLeftClick);
                  this.graphInstance.on("doubleClick", this.graphDoubleEvent)
                }
              }
            })
        }
      }
    },

    graphSearchName: debounce(function() {
      this.NewItems = [];
      var _this = this;
      this.NodesSearch.map(function(item) {
        if (item.name.search(_this.graphname) != -1) {
          _this.NewItems.push(item);
        }
      });
    }, 500),
    graphSearchEnd: debounce(function() {
      network.post("/api/search/ent", {
        identification: this.searchEnd
      }).then(res => {
        if (res.data) {
          this.$data.searchListGraphEnd = res.data.data.list;
        }
      });
    }, 500),
    deleteBtnGraph: function() {
      this.NewItems = [];
      this.graphname = '';
    },
    deletesearchEnd: function() {
      this.searchListGraphEnd = [];
      this.searchEnd = '';
    },
    GlpselectView: function(i) {
      this.views = i;
      if (i == 1) {
        this.titleName = '企业谱系';
        this.searchGroup();
        this.glpsearchEnd = false;
        this.leftInfoShow = true;
      }
      else if (i == 2) {
        this.titleName = '股权穿透';
        this.leftInfoShow = true;
        this.legendControl = false;
        this.historyShow = false;
        this.glpsearchEnd = false;
        network
          .get("/api/neo4j/equityThrough?nodeid=" + this.detailId + "&direction=" + 'up').then(up => {
            // up.data = this.formatGraphData(up.data, 'up')
            network.get("/api/neo4j/equityThrough?nodeid=" + this.detailId + "&direction=" + 'down').then(down => {
              if (down.data) {
                this.initializeGraph();
                let graphData = {};
                // graphData.updatedata = down.data.updatedata;
                // down.data = this.formatGraphData(down.data, 'down')
                graphData.links = up.data.data.links.concat(down.data.data.links);
                graphData.nodes = up.data.data.nodes.concat(down.data.data.nodes);
                this.$data.originalGraphData = graphData;

                //无数据时展示
                if (!graphData.links.length) {
                  // this.graphView = false;
                  let obj = { id: 1, name: "暂无数据" };
                  let noData = [];
                  noData.push(obj);
                  this.graphInstance.replaceData(this.noDataGraphStyle(noData))
                  this.graphInstance.replaceSettings({
                    navigation: {
                      mode: "showall"
                    },
                    interaction: {
                      selection: {
                        dragSelect: true
                      }
                    },
                    style: {
                      selection: {
                        enabled: false
                      }
                    }
                  });
                  this.graphInstance.on("pointerDrag");
                } else {
                  this.graphInstance.replaceData(this.formatGraphData(graphData));
                  this.graphInstance.replaceSettings({
                    layout: {
                      mode: "hierarchy",
                      nodeSpacing: 80,
                      rowSpacing: 80
                    },
                    navigation: {
                      mode: "showall",
                      // numberOfFocusNodes: 1,
                      // initialNodes: [this.$data.detailId]
                    },
                    style: {
                      selection: {
                        enabled: true
                      },
                      hiddenLinks: {
                        lineColor: 'rgba(100,100,100,0)'
                      }
                    }
                  });
                  // 点击显示/隐藏浮框
                  this.graphInstance.on("rightClick", this.graphClickEvent);
                  // 图谱拖动隐藏浮框
                  this.graphInstance.on("pointerDrag", this.graphDragEvent);
                  this.graphInstance.on("click", this.graphLeftClick);
                  this.graphInstance.on("doubleClick", this.graphDoubleEvent)
                }

              }
            })

          })
      } else if (i == 3) {
        this.titleName = '实际控制人';
        this.legendControl = false;
        this.historyShow = false;
        this.glpsearchEnd = false;
        network
          .get("/api/graph/controller?id=" + this.detailId).then(res => {
            if (res.data) {
              this.initializeGraph()
              //无数据时展示
              if (res.data.code == 400) {
                // this.graphView = false;
                let obj = { id: 1, name: "暂无数据" };
                let noData = [];
                noData.push(obj);
                this.graphInstance.replaceData(this.noDataGraphStyle(noData))
                this.graphInstance.replaceSettings({
                  navigation: {
                    mode: "showall"
                  },
                  interaction: {
                    selection: {
                      dragSelect: true
                    }
                  },
                  style: {
                    selection: {
                      enabled: false
                    }
                  }
                });
                this.graphInstance.on("pointerDrag");
              } else {
                this.graphInstance.replaceData(this.formatGraphData(res.data.data));
                this.graphInstance.replaceSettings({
                  // layout: {
                  //   mode: "hierarchy",
                  //   nodeSpacing: 80,
                  //   rowSpacing: 80
                  // },
                  navigation: {
                    mode: "showall",
                  },
                  style: {
                    selection: {
                      enabled: true
                    }
                  }
                });
                this.graphInstance.off("rightClick", this.graphHotClickEvent);
                // 点击显示/隐藏浮框
                this.graphInstance.on("rightClick", this.graphClickEvent);
                // 图谱拖动隐藏浮框
                this.graphInstance.on("pointerDrag", this.graphDragEvent);
                this.graphInstance.on("click", this.graphLeftClick);
                this.graphInstance.on("doubleClick", this.graphDoubleEvent)
              }
            }
          })
      }
      else if (i == 4) {
        this.titleName = '关系探查';
        this.legendControl = false;
        this.historyShow = false;
        this.glpsearchEnd = true;
        this.searchOrigin = this.searchname;
      }
    },
    formatGraphData: function(data) {
      data.nodes.forEach(node => {
        node.loaded = true;
        if (this.views == 2) {
          node.style = {
            label: node.name.replace(/(.{8})/g, '$1 '),
            labelStyle: {
              linelSpacing: 2,
              margin: 10
            }
          }
        } else {
          node.style = {
            label: node.name
          };
        }

        if (node.tag in graphNode) {
          Object.assign(node.style, graphNode[node.tag]);
        } else {
          Object.assign(node.style, graphNode.default);
        }
        node.style.items = [];
        if (this.views == 1) {
          if (node.id == this.detailId) {
            node.style.items.push({
              image: position,
              px: 1.3,
              py: -0.8,
              scaleWithZoom: true,
              scaleWithSize: true,
              hoverEffect: false,
              backgroundStyle: {
                fillColor: "transparent"
              },
            });
          }
          if (node.hasChild) {
            node.style.items.push({
              text: '≡',
              px: 1.2,
              py: -0.1,
              scaleWithZoom: true,
              backgroundStyle: {
                fillColor: "transparent"
              },
              textStyle: {
                font: "16px Arial",
                fillColor: "#d7d7d7"
              }
            })
          }
        }
        if (this.views == 2) {
          if (node.hasChild) {
            if (node.direction == 'down' && node.hasChild) {
              node.style.items.push({
                text: "+",
                px: 0.0,
                py: .9,
                textStyle: {
                  fillColor: "#fff",
                  font: "12px Arial"
                },
                scaleWithZoom: true,
                scaleWithSize: false,
                hoverEffect: false,
                padding: 0,
                backgroundStyle: {
                  fillColor: "#D3D3D3"
                }
              });
            } else if (node.direction == 'up' && node.hasChild) {
              node.style.items.push({
                text: "+",
                px: 0.0,
                py: -.9,
                textStyle: {
                  fillColor: "#fff",
                  font: "12px Arial"
                },
                scaleWithZoom: true,
                scaleWithSize: false,
                hoverEffect: false,
                padding: 0,
                backgroundStyle: {
                  fillColor: "#D3D3D3"
                }
              });
            }
          }
        }
      });
      data.links.forEach(link => {
        link.from = link.from;
        link.to = link.to;
        link.style = {};
        switch (link.relationType) {
          case "Investment":
            Object.assign(link.style, graphLink[link.relationType]);
            break;
          case "Header":
            Object.assign(link.style, graphLink[link.relationType]);
            break;
          case "Senior":
            Object.assign(link.style, graphLink[link.relationType]);
            break;
          case "Credit":
            Object.assign(link.style, graphLink[link.relationType]);
            break;
          case "Hide":
            Object.assign(link.style, graphLink[link.relationType]);
            break;
          case "Guarantee":
            Object.assign(link.style, graphLink[link.relationType]);
            break;
          case "Claim":
            Object.assign(link.style, graphLink[link.relationType]);
            break;
          default:
            Object.assign(link.style, graphLink.default);
        }

      });
      return data;
    },
    toggleRelation: function(type, bool) {
      let linkData = this.$data.originalGraphData.links;
      let index = 0;
      for (let i = 0; i < this.selectType.length; i++) {
        if (this.selectType[i] == type) {
          break;
        } else {
          index++;
        }
      }
      if (this.selectType.length == index) {
        this.selectType.push(type);
      } else {
        this.selectType.forEach((value, index) => {
          if (value == type) {
            this.selectType.splice(index, 1);
          };
        })
      }
      this.graphInstance.updateSettings({
        filters: {
          linkFilter: (linkData) => {
            for (let i = 0; i < this.selectType.length; i++) {
              if (linkData.relationType == this.selectType[i]) {
                return false;
              }
            }
            return true;
          }
        }
      });


    },

    exportImg: function() {

      var container = document.createElement('div');
      container.style.display = 'none';
      container.style.position = 'absolute';
      container.style.zIndex = -100;
      document.body.appendChild(container);
      var graphDataForExport = this.graphInstance.exportData(true, true);
      var graphZoomSize = this.graphInstance.zoom();
      var boundaryTop = 0, boundaryRight = 0, boundaryBottom = 0, boundaryLeft = 0;
      graphDataForExport.nodes.forEach(function(d) {
        // 上边界
        if (d.y < 0 && d.y < boundaryTop) {
          boundaryTop = d.y;
        }
        // 右边界
        if (d.x > 0 && d.y > boundaryRight) {
          boundaryRight = d.y;
        }
        // 下边界
        if (d.y > 0 && d.y > boundaryBottom) {
          boundaryBottom = d.y;
        }
        // 左边界
        if (d.x < 0 && d.x < boundaryLeft) {
          boundaryLeft = d.x;
        }
      });
      var graphHeight = boundaryBottom - boundaryTop + 240;
      var graphWidth = boundaryRight - boundaryLeft + 240;
      var scale = 2;
      var proportion;
      if (graphDataForExport.nodes.length > 3000) {
        alert('此系节点成员数量过大，不支持图谱下载！')
        return false
      }
      if (graphHeight > graphWidth) {
        proportion = graphHeight;
      }
      else {
        proportion = graphWidth;
      }
      if (proportion * 2 > 16000) {
        scale = 1
        if (proportion * 1.5 < 16000) {
          scale = 1.5
        } else if (proportion * 1.2 < 16000) {
          scale = 1.2
        }
      }

      this.graphInstance.zoom('auto', false);

      this.graphInstance.export('png', { scaling: scale }, false);
      document.body.removeChild(container);


    },

    graphLeftClick: function(e) {
      //测试点击线 Clalm Guarantee
      // this.clalmDialogVisible = true;

      //Credit有下拉
      if (e.clickLink) {
        if (e.clickLink.data.relationType == 'Credit') {
          this.creditDialogVisible = true;
          network.get("/api/graph/eventdetail?fromid=" + e.clickLink.data.from + "&toid=" + e.clickLink.data.to + "&type=" + e.clickLink.data.relationType).then(res => {
            // if (res.data.list[0].bill == null) {
            // this.contractShow = true;
            // this.billShow = false;
            // } else if (res.data.list[0].contract == null) {
            //   this.contractShow = false;
            //   this.billShow = true;
            // }
            // res.data.list.forEach(list => {
            //   if (list.bill == null) {
            //     this.contractShow = true;
            //     this.billShow = false;
            //   } else if (list.contract == null) {
            //     this.contractShow = false;
            //     this.billShow = true;
            //   }
            // })
            this.CreditData = res.data.list;
          })
        } else if (e.clickLink.data.relationType == 'Claim' && e.clickLink.data.tag == '基础债权来源') {
          this.clalmDialogVisible = true;
          network.get("/api/graph/event?fromid=" + e.clickLink.data.from + "&toid=" + e.clickLink.data.to + "&type=" + e.clickLink.data.relationType).then(res => {
            this.ClalmData = res.data.list;
          })
        } else if (e.clickLink.data.relationType == 'Claim' && e.clickLink.data.tag == '融租供应商') {
          this.clalmDialogleasing = true;
          network.get("/api/graph/event?fromid=" + e.clickLink.data.from + "&toid=" + e.clickLink.data.to + "&type=" + e.clickLink.data.relationType).then(res => {
            this.ClalmData = res.data.list;
          })
        }
        else if (e.clickLink.data.relationType == 'Guarantee') {
          this.GuaranteeDialogVisible = true;
          network.get("/api/graph/event?fromid=" + e.clickLink.data.from + "&toid=" + e.clickLink.data.to + "&type=" + e.clickLink.data.relationType).then(res => {
            this.guaranteeData = res.data.list;
          })
        }
      }

      if (!e.clickNode) {
        this.$data.graphPopup = false;
      }
      if (this.views == 1) {
        if (e.clickNode && e.clickNode.data.hasChild) {
          if (e.clickNode.data.hasChild) {
            e.clickNode.items[0].text = ' '
          }
          let isvalid = '';
          if (this.checkedData == true) {
            isvalid = "N"
          } else if (this.checkedData == false) {
            isvalid = "Y"
          }
          network
            .get('/api/graph/group?id=' + e.clickNode.id + '&isvalid=' + isvalid).then(res => {
              if (res) {
                var _this = this;
                if (this.graphtext == false) {
                  this.graphInstance.addData(this.formatGraphData(res.data.data));
                } else {
                  this.graphInstance.addData(this.formatGraphLinks(res.data.data));

                }
                // this.graphInstance.addData(this.formatGraphData(res.data.data));
                let addLinks = {}
                let addNodes = {}
                addLinks = _this.originalGraphData.links.concat(res.data.data.links);
                _this.originalGraphData.links = addLinks
                addNodes = _this.originalGraphData.nodes.concat(res.data.data.nodes);
                _this.originalGraphData.nodes = addNodes
                this.graphInstance.expandNode(e.clickNode.id)
              }
            })
        }
      } else if (this.views == 2) {
        if (e.clickNode) {
          // 展示更多节点和关系
          if (this.views == 2) {
            if (e.clickNode.data.hasChild) {
              this.graphInstance.resetLayout();
              let direction = e.clickNode.data.direction;
              let id = e.clickNode.id;
              e.clickNode.data.hasChild = false;
              network.get("/api/neo4j/equityThrough?nodeid=" + id + "&direction=" + direction).then(res => {
                let addData = {};
                // addData.nodes = this.originalGraphData.nodes.concat(res.data.data.nodes);
                // addData.links = this.originalGraphData.links.concat(res.data.data.links);
                addData.nodes = res.data.data.nodes;
                addData.links = res.data.data.links;
                e.chart.addData(this.formatGraphData(addData))
                e.clickNode.items[0].text = '--';
              })
            } else {
              if (e.clickNode.items.length > 0) {
                if (e.clickNode.items[0].text == '+') {
                  e.clickNode.items[0].text = '--';
                } else if (e.clickNode.items[0].text == '--') {
                  e.clickNode.items[0].text = '+'
                }
                this.graphInstance.resetLayout();
                this.graphInstance.closeNode(e.clickNode.id)
              }
            }
          }
          // if (e.clickNode.focused) return;
          // if (!e.clickNode.data.isReal) return;
          // if (e.clickNode.expanded) {
          //   // 收起
          //   e.chart.closeNode(e.clickNode.id);
          // } else {
          //   // 展开
          //   e.chart.expandNode(e.clickNode.id);
          // }
        }
      }


    },
    graphClickEvent: function(e) {
      this.$data.graphPopup = false;
      if (e.clickNode) {
        // 展示节点信息
        this.$data.graphPopup = true;
        this.$data.graphNodeInfo = e.clickNode.data;
        this.$data.graphPopupStyle.left = e.pageX + "px";
        this.$data.graphPopupStyle.top =
          e.pageY + e.clickNode.radius + 15 + "px";
      } else {
        this.$data.graphPopup = false;
      }

    },
    itemGlpGraphEnd: function(item) {
      this.searchEnd = item.name;
      this.searchListGraphEnd = [];
      this.leftInfoShow = false;
      this.graphLoading = true;
      network.post("/api/neo4j/shortPath", {
        id1: this.detailId,
        id2: item.id
      }).then(res => {
        this.graphLoading = false;
        this.initializeGraph();
        //无数据时展示
        if (res.data.code == 400) {
          // this.graphView = false;
          let obj = { id: 1, name: "暂无数据" };
          let noData = [];
          noData.push(obj);
          this.graphInstance.replaceData(this.noDataGraphStyle(noData))
          this.graphInstance.replaceSettings({
            navigation: {
              mode: "showall"
            },
            interaction: {
              selection: {
                dragSelect: true
              }
            },
            style: {
              selection: {
                enabled: false
              }
            }
          });
          this.graphInstance.on("pointerDrag");
        } else {
          this.graphInstance.replaceData(this.formatGraphData(res.data.data));
          this.graphInstance.replaceSettings({
            navigation: {
              mode: "showall",
              // numberOfFocusNodes: 1,
              // initialNodes: [this.$data.detailId]
            },
            style: {
              selection: {
                enabled: true
              }
            }
          });
          // 点击显示/隐藏浮框
          this.graphInstance.on("rightClick", this.graphClickEvent);
          // 图谱拖动隐藏浮框
          this.graphInstance.on("pointerDrag", this.graphDragEvent);
          this.graphInstance.on("click", this.graphLeftClick);
          this.graphInstance.on("doubleClick", this.graphDoubleEvent)
        }
      });
    },
    goDetil: function(id) {
      this.graphPopup = false;
      if (this.isReferenced) {
        setItem("parameter", {
          id: id,
          isReferenced: true
        })
      } else {
        setItem("parameter", {
          id: id
        })
      }
      let routeData = this.$router.resolve({ path: '/detail' })
      window.open(routeData.href, '_blank')
    },
    noDataGraphStyle: function(data) {
      data.forEach(node => {
        node.style = {
          label: node.name,
          image: noData,
          radius: 50,
          fillColor: "none",
          labelStyle: {
            textStyle: {
              font: "13px Arial",
              fillColor: "#999999"
            }
          }
        };
      });
      return { nodes: data };
    },
    resetLayout: function() {
      this.graphInstance.resetLayout();
    },

    graphDragEvent: function() {
      this.$data.graphPopup = false;
    },
    graphDoubleEvent: function(e) {
      e.preventDefault();
    },

    graphhoverChange: function(e) {
      // if(e.clickLink){
      //   alert('000')
      // }
    },
    logout: function() {
      network.post("/api/login/doLogout").finally(() => {
        removeItem('token')
        this.$router.push("/login")
      })
    },
    logoutEve: function() {
      this.isshowExc = !this.isshowExc
    },
    historyData: function() {
      this.alllockgraph = false
      this.graphtext = false
      this.searchGroup();
      this.modelReset = false
      this.$nextTick(() => {
        this.modelReset = true
      })
      this.selectType = [];
    },
    goBack: function() {
      this.graphShow = true;
      this.legendControl = false;
      this.checkedData = false;
      this.modelReset = false
      this.$nextTick(() => {
        this.modelReset = true
      })
      this.selectType = [];
    },
    lockGraph: function() {
      if (this.alllockgraph == true) {
        this.alllockgraph = false;
        this.graphInstance.replaceSettings({
          layout: {
            mode: 'dynamic'
          },
        })
      } else {
        this.alllockgraph = true;
        this.graphInstance.replaceSettings({
          layout: {
            mode: 'static'
          },
        })
      }
    },
    //系内定位
    graphPoistion: function(nodeName) {
      this.graphname = nodeName.name;
      this.NewItems = [];
      const [nodesArr, selectArr, inputNodes] = [this.graphInstance.nodes(), [], nodeName.name.split("；")]
      for (let i of inputNodes) {
        for (let j of nodesArr) {
          if (i && i == j.data.name) {
            selectArr.push(j.data.id);
          }
        }
      }
      if (selectArr && selectArr.length > 0) {
        // 进行选择
        this.graphInstance.selection(selectArr);
        // 进行快速拉近
        this.graphInstance.zoom(2, false);
        // 进行元素选择
        this.graphInstance.zoomIn(selectArr, false);
      }
    },

    nodesNone: function(nodeId) {
      if (this.views == 1) {
        this.graphInstance.collapseNode(nodeId);
        this.graphPopup = false;
      } else if (this.views == 2) {
        this.graphInstance.closeNode(nodeId);
        this.graphPopup = false;
      } else {
        this.graphInstance.closeNode(nodeId);
        this.graphPopup = false;
      }

    },
    graphLinksText: function() {
      if (this.graphtext == true) {
        this.graphtext = false;
        this.graphInstance.replaceData(this.formatGraphData(this.$data.originalGraphData))
      } else {
        this.graphtext = true;
        this.graphInstance.replaceData(this.formatGraphLinks(this.$data.originalGraphData))
      }
    },
    //显示link比例值
    formatGraphLinks: function(data) {
      data.nodes.forEach(node => {
        node.loaded = true;
        if (this.views == 2) {
          node.style = {
            label: node.name.replace(/(.{8})/g, '$1 '),
            labelStyle: {
              linelSpacing: 2,
              margin: 10
            }
          }
        } else {
          node.style = {
            label: node.name
          };
        }

        if (node.tag in graphNode) {
          Object.assign(node.style, graphNode[node.tag]);
        } else {
          Object.assign(node.style, graphNode.default);
        }
        node.style.items = [];
        if (this.views == 1) {
          if (node.id == this.detailId) {
            node.style.items.push({
              image: position,
              px: 1.3,
              py: -0.8,
              scaleWithZoom: true,
              scaleWithSize: true,
              hoverEffect: false,
              backgroundStyle: {
                fillColor: "transparent"
              },
            });
          }
          if (node.hasChild) {
            node.style.items.push({
              text: '≡',
              px: 1.2,
              py: -0.1,
              scaleWithZoom: true,
              backgroundStyle: {
                fillColor: "transparent"
              },
              textStyle: {
                font: "16px Arial",
                fillColor: "#d7d7d7"
              }
            })
          }
        }
        if (this.views == 2) {
          if (node.hasChild) {
            if (node.direction == 'down' && node.hasChild) {
              node.style.items.push({
                text: "+",
                px: 0.0,
                py: .9,
                textStyle: {
                  fillColor: "#fff",
                  font: "12px Arial"
                },
                scaleWithZoom: true,
                scaleWithSize: false,
                hoverEffect: false,
                padding: 0,
                backgroundStyle: {
                  fillColor: "#D3D3D3"
                }
              });
            } else if (node.direction == 'up' && node.hasChild) {
              node.style.items.push({
                text: "+",
                px: 0.0,
                py: -.9,
                textStyle: {
                  fillColor: "#fff",
                  font: "12px Arial"
                },
                scaleWithZoom: true,
                scaleWithSize: false,
                hoverEffect: false,
                padding: 0,
                backgroundStyle: {
                  fillColor: "#D3D3D3"
                }
              });
            }
          }
        }
      });
      data.links.forEach(link => {
        link.from = link.from;
        link.to = link.to;
        link.style = {};
        switch (link.relationType) {
          case "Investment":
            Object.assign(link.style, graphLinkText[link.relationType]);
            if (link.weight) {
              if(link.weight == 0){
                link.style.label = '投资';
              }else{
                link.style.label = '投资-'+`${link.weight}%`;                
              }
            }
            break;
          case "Header":
            Object.assign(link.style, graphLinkText[link.relationType]);
            if (link.tag) {
              link.style.label = `${link.tag}`;
            }
            break;
          case "Senior":
            Object.assign(link.style, graphLinkText[link.relationType]);
            if (link.tag) {
              link.style.label = `${link.tag}`;
            }
            break;
          case "Credit":
            Object.assign(link.style, graphLinkText[link.relationType]);
            if (link.tag) {
              link.style.label = `${link.tag}` + '-' + `${link.amount}`;
            }
            break;
          case "Hide":
            Object.assign(link.style, graphLinkText[link.relationType]);
            if (link.tag) {
              link.style.label = `${link.tag}`;
            }
            break;
          case "Guarantee":
            Object.assign(link.style, graphLinkText[link.relationType]);
            if (link.amount) {
              link.style.label = `${link.tag}` + '-' + `${link.amount}`;
            }
            break;
          case "Claim":
            Object.assign(link.style, graphLinkText[link.relationType]);
            if (link.tag) {
              link.style.label = `${link.tag}`;
            }
            break;
          default:
            Object.assign(link.style, graphLinkText.default);
        }

      });
      return data;
    },

























    toggleFullscreen: function() {
      if (!isFullscreenEnabled()) {
        console.warn("浏览器不支持全屏！");
      }
      if (isFullscreen()) {
        exitFullscreen();
      } else {
        requestFullscreen();
      }
    },


  },


  mounted: function() {
    this.$data.result = [
      {
        type: "Investment",
        label: "投资",
        show: true,
        count: 0
      },
      {
        type: "Header",
        label: "工商任职",
        show: true,
        count: 0
      },
      {
        type: "Senior",
        label: "尽调",
        show: true,
        count: 0
      },
      {
        type: "Credit",
        label: "授信用信",
        show: true,
        count: 0
      },
      {
        type: "Hide",
        label: "普洛斯人际",
        show: true,
        count: 0
      },
      {
        type: "Guarantee",
        label: "担保",
        show: true,
        count: 0
      },
      {
        type: "Claim",
        label: "债权",
        show: true,
        count: 0
      },
    ];


    // 开发测试：右键打印当前节点/连线
    // this.graphInstance.on("rightClick", this.commonRightClickEvent);

    // 图谱resize
    var resizeHandler = debounce(() => {
      this.graphInstance &&
        this.graphInstance.updateSettings({
          area: {
            height: document.documentElement.clientHeight,
            width: document.documentElement.clientWidth
          }
        });
      this.fullscreen = isFullscreen();
    }, 500);
    window.addEventListener("resize", resizeHandler, false);

    var query = this.$route.query;
    if (query.ticket) {
      this.isReferenced = true
      let ticket = query.ticket;
      let appid = 'GLP9be0b9301a02c211'
      network.get('/api/login/getToken?ticket=' + ticket + '&appid=' + appid).then(res => {
        if (res.data.code == 200) {
          setToken(res.data.token);
        }
      })
    }


  },
  components: {
    Arrow,
    RelationIntroduction,
    Header,
  }
};
</script>

<style>
::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}

::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.4);
  border-radius: 10px;
  -webkit-box-shadow: inset 1px 1px 0 rgba(0, 0, 0, 0.1);
}

::-webkit-scrollbar-track {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0);
  background-color: white
}

.glp-home {
  min-height: 100vh;
  z-index: 11;
  background: url("../assets/images/glp/glp_bg.png") no-repeat center;
  background-size: 100% auto;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}



@keyframes animate {
  17% {
    border-bottom-right-radius: 3px;
  }
  25% {
    transform: translateY(9px) rotate(22.5deg);
  }
  50% {
    transform: translateY(18px) scale(1, .9) rotate(45deg);
    border-bottom-right-radius: 40px;
  }
  75% {
    transform: translateY(9px) rotate(67.5deg);
  }
  100% {
    transform: translateY(0) rotate(90deg);
  }
}


@keyframes shadow {
  0%,
  100% {
    transform: scale(1, 1);
  }
  50% {
    transform: scale(1.2, 1);
  }
}

@media screen and (max-height: 800px) {
  .hotspot-follow {
    height: 530px;
    margin: 0 auto;
    padding-top: 8%;
    width: 90%;
  }
  .hotspot-follow .hotspot-left li {
    height: 30px;
    width: 100%;
    font-size: 16px;
    color: #666666;
    letter-spacing: 0.22px;
    text-align: center;
    margin: 20px 0px;
    line-height: 30px;
    transition-delay: 100ms;
    transition-duration: 500ms;
  }
  .hotspot-follow .hotspot-right li {
    height: 30px;
    width: 100%;
    font-size: 16px;
    color: #666666;
    letter-spacing: 0.22px;
    text-align: center;
    margin: 20px 0px;
    line-height: 30px;
    transition-delay: 100ms;
    transition-duration: 500ms;
  }
}










/* 重构 */

.glp-home .header {
  background: transparent;
}

.graph-wrapper {
  z-index: 20;
  background: #fff;
  position: fixed;
}

* {
  box-sizing: border-box;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  border: none;
}

.glp-search-box {
  width: 700px;
  margin: 0px auto 0;
  position: relative;
}

.glp-search-box input {
  background: #fff url(../assets/images/glp/search-icon.png) no-repeat 15px center;
  height: 42px;
  padding-left: 41px;
  font-size: 16px;
  color: #333;
  border: none;
  width: 100%;
}










/* .glp-search-box input {
  width: 100%;
  height: 100%;
  color: #444;
  font-size: 14px;
  padding-left: 54px;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 999;
  border: 1px solid #ccc;
  border-right: none;
  outline: 0;
  background: url("/static/_kimg/graph/search-left.png") no-repeat 8px 4px;
  background-color: #fff;
} */

.glp-search-box .input-inner-detail {
  height: 26px;
  padding-right: 10px;
  position: absolute;
  right: 0px;
  top: 8px;
  z-index: 1004;
}

.dele {
  width: 16px;
  height: 16px;
  line-height: 15px;
  font-size: 12px;
  text-align: center;
  float: right;
  margin-top: 5px;
  border-radius: 50%;
  background-color: #e5e5e5;
  color: #fff;
  cursor: pointer;
}

.dele :hover {
  background-color: rgb(252, 70, 77);
}


.glp-search-box .list li {
  height: 100%;
  line-height: 38px;
  padding-left: 21px;
  font-size: 14px;
  color: #333;
  background-color: #fff;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
  text-align: left;
}

.glp-search-box .list li:hover {
  background-color: #ebebeb;
}

.glp-search-box .list {
  background-color: transparent;
  top: 50px;
  border: none;
  box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.2);
  border-radius: 15px;
  -webkit-border-radius: 15px;
  padding: 0px;
}

.glp-logo {
  width: 100%;
  height: 192px;
}

.glp-home .input-inner-detail .showDetail {
  width: 78px;
}

.glp-home .company-detail {
  width: 0;
  height: 26px;
  line-height: 26px;
  text-align: center;
  font-size: 12px;
  color: #fff;
  background-color: #3d4bbd;
  float: right;
  margin-left: 8px;
  transition: width 0.5s;
  -ms-transition: width 0.5s;
  -moz-transition: width 0.5s;
  overflow: hidden;
  cursor: pointer;
}



.glp-home .company-detail:hover {
  background-color: #3c68d2;
}

.glp-search {
  width: 140px;
  height: 42px;
  line-height: 42px;
  right: 0;
  background: #078134;
  color: #fff;
  font-size: 16px;
  transition: all .6s;
  -ms-transition: all .6s;
  -moz-transition: all .6s;
  cursor: pointer;
  overflow: hidden;
}

.glp-graph .graph-header {
  position: fixed;
  z-index: 10;
  left: 0;
  right: 0;
  top: 0;
  height: 56px;
  background: #30374b;
}

.glp-graph .graph-header img {
  position: absolute;
  left: 0px;
  width: 96px;
  margin: 8px;
  cursor: pointer;
}

.glp-graph .graph-header .title {
  text-align: center;
  line-height: 56px;
  font-size: 18px;
  color: #fff;
  font-weight: bold;
}

.glp-graph .legend-wrapper {
  position: absolute;
  right: 20px;
  bottom: 20px;
  height: auto;
  z-index: 30;
  display: flex;
  justify-content: center flex-end end;
  flex-wrap: wrap;
  align-items: flex-end;
}

.glp-graph .legend-wrapper .graph-toolbar {
  width: 24px;
  margin: 0;
  padding: 0;
  padding-bottom: 8px;
}

.glp-graph .legend-wrapper .graph-toolbar>li {
  width: 24px;
  height: 24px;
  margin-top: 4px;
  box-sizing: border-box;
  border-radius: 1px;
  border: 1px solid #ddd;
  background: #fff;
  cursor: pointer;
  background-size: 26px 26px;
  background-repeat: no-repeat;
  background-position: -2px -1px;
}

.glp-graph .legend-wrapper .graph-toolbar>li:hover {
  border-color: #fe7011;
}

.glp-graph .legend-wrapper .graph-toolbar>li.tool-text {
  border: none;
  font-size: 12px;
  height: auto;
  background: none;
}

.glp-graph .legend-wrapper .graph-toolbar>li.graph-explain {
  background-image: url(../assets/images/icon_explainshow@2x.png)
}

.glp-graph .legend-wrapper .graph-toolbar>li.investment-ratio {
  /* background-image: url(../assets/images/icon_shaixuan@2x.png); */
}

.glp-graph .legend-wrapper .graph-toolbar>li.graph-refresh {
  background-image: url(../assets/images/icon_refresh@2x.png);
}

.glp-graph .legend-wrapper .graph-toolbar>li.report-error {
  background-image: url(../assets/images/icon_baocuo@2x.png);
}

.glp-graph .legend-wrapper .graph-toolbar>li.graph-normalscreen {
  background-position: -2px -2px;
  background-image: url(../assets/images/icon_normalscreen@2x.png);
}

.glp-graph .legend-wrapper .graph-toolbar>li.graph-fullscreen {
  background-position: -2px -2px;
  background-image: url(../assets/images/icon_fullscreen@2x.png);
}

.glp-graph .legend-wrapper .graph-toolbar>li.graph-lock>i {
  display: block;
  width: 15px;
  height: 15px;
  margin: 3px;
  background-image: url(../assets/images/glp/lock.png);
}

.glp-graph .legend-wrapper .graph-toolbar>li.graph-lock>i:hover {
  display: block;
  width: 15px;
  height: 15px;
  margin: 3px;
  background-image: url(../assets/images/glp/lock_hover.png);
}

.glp-graph .legend-wrapper .graph-toolbar>li.graph-text>i {
  display: block;
  width: 15px;
  height: 15px;
  margin: 3px;
  background-image: url(../assets/images/glp/graph-text.png);
}

.glp-graph .legend-wrapper .graph-toolbar>li.graph-text>i:hover {
  display: block;
  width: 15px;
  height: 15px;
  margin: 3px;
  background-image: url(../assets/images/glp/graph-text_hover.png);
}

.glp-graph .legend-wrapper .graph-toolbar>li.graph-explain:hover {
  background-image: url(../assets/images/icon_explainshow_hover@2x.png)
}

.glp-graph .legend-wrapper .graph-toolbar>li.investment-ratio:hover {
  /* background-image: url(../assets/images/icon_shaixuan_hover@2x.png); */
  color: #fe7011;
}

.glp-graph .legend-wrapper .graph-toolbar>li.graph-refresh:hover {
  background-image: url(../assets/images/icon_refresh_hover@2x.png);
}

.glp-graph .legend-wrapper .graph-toolbar>li.report-error:hover {
  background-image: url(../assets/images/icon_baocuo_hover@2x.png);
}

.glp-graph .legend-wrapper .graph-toolbar>li.graph-normalscreen:hover {
  background-image: url(../assets/images/icon_normalscreen_hover@2x.png);
}

.glp-graph .legend-wrapper .graph-toolbar>li.graph-fullscreen:hover {
  background-image: url(../assets/images/icon_fullscreen_hover@2x.png);
}

.legend-wrapper .graph-legend {
  width: 1px;
  height: auto;
  transition: .3s ease;
  font-size: 12px;
  overflow: hidden;
  white-space: nowrap;
}

.legend-wrapper .graph-legend-active {
  width: 270px;
  border: 1px solid #eee;
  height: auto;
  box-sizing: border-box;
  overflow: hidden;
  font-size: 12px;
  box-shadow: 0 2px 4px 0 rgba(238, 238, 238, 0.5);
  border-radius: 2px;
  background: #fff;
  margin-left: 10px;
  transition: .3s ease;
  white-space: nowrap;
}

.graph-legend-title {
  margin: 8px 10px 6px;
  text-align: left;
}

.graph-legend-title i.graph-legend-popper {
  display: inline-block;
  width: 12px;
  height: 12px;
  margin-left: 2px;
  border-radius: 50%;
  border: 1px solid #ccc;
  text-align: center;
  line-height: 12px;
  font-style: normal;
  color: #bbb;
  cursor: pointer;
}

.graph-legend-content {
  margin: 0 10px;
  padding: 0;
  overflow: hidden;
  padding-bottom: 10px;
}

.graph-legend-content>li {
  list-style: none;
  float: left;
  width: 50%;
  margin-bottom: 2px;
  box-sizing: border-box;
  text-align: left;
}

.relation-intro {
  background: #f9f9f9 !important;
}

.graph-legend-content .tuli li {
  padding-left: 18px;
  position: relative;
}

.graph-legend-content>li>img {
  height: 12px;
  left: 0px;
}

.glp-graph-search {
  width: 380px;
  position: absolute;
  top: 70px;
  left: 20px;
}

.glp-graph-search input {
  background: #fff url(../assets/images/glp/search-icon.png) no-repeat 15px center;
  height: 42px;
  padding-left: 41px;
  font-size: 13px;
  color: #333;
  border: 1px solid #ccc;
  width: 100%;
}

.glp-graph-search .input-inner-detail {
  height: 26px;
  padding-right: 10px;
  position: absolute;
  right: 0px;
  top: 8px;
  z-index: 10;
}

.glp-graph-search .list {
  height: 300px;
  overflow: auto;
  position: absolute;
  top: 43px;
  border: none;
  -webkit-box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.2);
  box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.2);
  border-radius: 5px;
  -webkit-border-radius: 10px;
  padding: 0px;
  z-index: 2;
  background: #ffffff
}

.glp-graph-search .list li {
  width: 376px;
  height: 38px;
  line-height: 38px;
  padding-left: 25px;
  font-size: 14px;
  color: #333;
  background-color: #fff;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
  text-align: left;
}

.glp-graph-search .list>li:hover {
  background-color: #ebebeb;
}


.leftView {
  position: absolute;
  left: 20px;
  top: 113px;
  width: 378px;
  border: 1px solid #eee;
  box-shadow: 0 2px 4px 0 #eee;
  background: #fff;
}

.leftView ul {
  margin: 0;
  padding: 4px 5px;
  display: flex;
  width: 100%;
  flex-wrap: wrap;
}

.leftView ul li {
  width: 31%;
  margin: 8px 0;
  cursor: pointer;
}

.leftView ul p {
  font-size: 12px;
  color: #666;
  text-align: center;
}

.leftView ul img {
  height: 36px;
}

.leftInfo {
  width: 378px;
  height: 126px;
}

.leftInfo .leftInfo-title {
  width: 100%;
  height: 40px;
  line-height: 40px;
  text-align: center;
  color: #fff;
  font-size: 14px;
  background: #6CB0FF;
}

.leftInfo .leftInfo-li {
  width: 100%;
  height: 41px;
  line-height: 41px;
  padding-left: 33px;
  background: #fff;
  font-size: 14px;
}

.leftInfo .leftInfo-span {
  color: #ff9e4c;
  font-size: 14px;
  width: 216px;
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  float: right;
}

.graph-popup {
  box-sizing: border-box;
  position: fixed;
  background-attachment: #ffffff;
  border: 1px solid #eee;
  box-shadow: 0 2px 4px 0 rgba(238, 238, 238, 0.5);
  border-radius: 2px;
  z-index: 100;
  background: #fff;
}

.graph-popup ul {
  min-width: 190px;
  margin: 0;
  padding: 14px;
}

.graph-popup ul>li {
  padding: 8px 0;
  list-style: none;
  font-size: 12px;
  color: #fff;
  background: #6cb0ff;
  margin-top: 10px;
  text-align: center;
  border-radius: 5px;
  cursor: pointer;
}

.glpSearchEnd {
  width: 380px !important;
  float: left;
  position: absolute;
}

.glp-searchEnd {
  width: 0px;
}

.glp-searchEnd .search-end {
  height: 42px;
  padding-left: 6px;
  font-size: 13px;
  color: #333;
  border: 1px solid #ccc;
  width: 48%;
  float: left;
  background: #fff;
}

.searchCenter {
  width: 15px;
  float: left;
  background: #fff;
  line-height: 39px;
  margin-top: 1px;
}

.boxLoading {
  width: 50px;
  height: 50px;
  margin: auto;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 99;
}

.boxLoading:before {
  content: '';
  width: 50px;
  height: 5px;
  background: #000;
  opacity: 0.1;
  position: absolute;
  top: 59px;
  left: 0;
  border-radius: 50%;
  animation: shadow .5s linear infinite;
}

.boxLoading:after {
  content: '';
  width: 50px;
  height: 50px;
  background: #9DC3FF;
  animation: animate .5s linear infinite;
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 3px;
}

.head-right {
  float: right;
  height: 60px;
}

.head-right .name {
  display: inline-block;
  color: #FFFFFF;
  font-size: 16px;
  vertical-align: middle;
  position: absolute;
  right: 37px;
  top: 18px;
  cursor: pointer;
}


.head-right .name:after {
  content: "";
  position: absolute;
  right: 18px;
  top: 28px;
  width: 16px;
  height: 16px;
  background: url('../assets/images/glp/admin.png') no-repeat;
  cursor: pointer;
  right: -24px;
  top: 4px;
}

.head-right .login-out {
  position: absolute;
  right: 11px;
  top: 56px;
  width: 143px;
  height: 0;
  line-height: 40px;
  padding-left: 52px;
  color: #fff;
  background: #30374b;
  font-size: 14px;
  transition: height .3s;
  -ms-transition: height .3s;
  -moz-transition: height .3s;
  overflow: hidden;
  cursor: pointer;
}

.head-right .login-out.active {
  height: 40px;
}

.head-right .login-out::before {
  content: "";
  position: absolute;
  top: 11px;
  left: 26px;
  width: 16px;
  height: 16px;
  background: url('../assets/images/glp/login-out.png') no-repeat;
}

.history-data {
  position: absolute;
  right: 10%;
  top: 71px;
}

.collapse-span {
  border-bottom: 1px solid #ebeef5;
  background: #ebeef5;
  height: 50px;
  line-height: 50px;
}

.collapse-span>span {
  width: 25%;
  display: block;
  float: left;
}

.collapse-one {
  width: 24%;
  float: left;
  display: block;
}

.collapse-spanTwo {
  border-bottom: 1px solid #ebeef5;
  background: #ebeef5;
  height: 50px;
  line-height: 50px;
}

.collapse-spanTwo>span {
  width: 7%;
  display: block;
  float: left;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.collapse-two {
  text-align: left;
  width: 44%;
  display: table-cell;
}

.collapse-p {
  width: 100%;
  height: 50px;
}

.collapse-p>span {
  text-align: left;
  width: 7%;
  display: block;
  float: left;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  line-height: 50px;
}

.collapse-spanTwo1 {
  border-bottom: 1px solid #ebeef5;
  background: #ebeef5;
  height: 50px;
  line-height: 50px;
}

.collapse-spanTwo1>span {
  width: 5.8%;
  display: block;
  float: left;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.collapse-p {
  width: 100%;
  height: 50px;
}

.collapse-p1>span {
  text-align: left;
  width: 5.8%;
  /* 无租赁数据 */
  display: block;
  float: left;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  line-height: 50px;
}

.glp-searchEnd ::-webkit-input-placeholder {
  color: red;
}
</style>

