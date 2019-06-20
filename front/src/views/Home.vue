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
            <li @click="lockGraph" :class="alllockgraph?'graph-unlock' : 'graph-lock'" :title="alllockgraph? '解锁全部' : '全部锁定'">
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
              <img src="../assets/images/glp/glp_logo.png" alt="普洛斯金融"> 普洛斯金融
            </li>
            <li>
              <img src="../assets/images/glp/glp_company.png" alt="父授信"> 父授信企业
            </li>
            <li>
              <img src="../assets/images/glp/glp_credit.png" alt="用信"> 用信企业
              <!-- <span style="width:12px;height:12px;display: inline-block;background: #bc2f2f;border-radius: 100px;"></span> 龙头企业 -->
            </li>
            <li>
              <img src="../assets/images/glp/glp_person.png" alt="非用信"> 非用信个人
            </li>
            <li>
              <img src="../assets/images/glp/glp_enterprise@2.png" alt="非用信企业"> 非用信企业
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
          <li @click="goDetil(graphNodeInfo.entid)" style="margin-top:0px;">公司详情</li>
          <li @click="nodesNone(graphNodeInfo.id)">折叠节点</li>
        </ul>
      </div>
      <!-- 测试 -->
      <el-dialog :visible.sync="creditDialogVisible" width="90%" height="80%" center>
        <el-table :data="CreditData" @row-click="openDetails" ref="refTable" v-loading="loading">
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-table :data="props.row.credit" v-if="creditCredit">
                <el-table-column label="父授信对象" prop="fromname">
                </el-table-column>
                <el-table-column label="子授信对象" prop="toname">
                </el-table-column>
                <el-table-column label="订单编号" prop="sourceid">
                </el-table-column>
                <el-table-column label="子授信状态" prop="status" :filters="filtersGuarantee" :filter-method="filterCredit" filter-placement="bottom-end">
                  <template slot-scope="scope">
                    <span v-if="scope.row.status=='-'">{{scope.row.status}}</span>
                    <el-tag :type="scope.row.status === '10' ? 'success' : 'primary'" disable-transitions v-else>{{scope.row.status == 10 ?'生效':'作废'}}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="子授信金额" prop="eventamt" sortable>
                </el-table-column>
                <el-table-column label="累计放款" prop="principalamt" sortable>
                </el-table-column>
                <el-table-column label="本金余额" prop="principalbalance" sortable>
                </el-table-column>
                <el-table-column label="剩余额度" prop="remainprincipal" sortable>
                </el-table-column>
                <el-table-column label="在逾金额" prop="overdue" sortable>
                </el-table-column>
                <el-table-column label="生效时间" prop="validstarttime" sortable>
                </el-table-column>
                <el-table-column label="失效时间" prop="validendtime" sortable>
                </el-table-column>
              </el-table>
              <el-table :data="props.row.drawdown" v-if="creditDrawdown">
                <el-table-column label="主体名称" prop="fromname">
                </el-table-column>
                <el-table-column label="关系方名称" prop="toname">
                </el-table-column>
                <el-table-column label="订单编号" prop="sourceid">
                </el-table-column>
                <el-table-column label="状态" prop="status" :filters="filtersDrawdown" :filter-method="filterDrawdown" filter-placement="bottom-end">
                  <template slot-scope="scope">
                    <span v-if="scope.row.status=='-'">{{scope.row.status}}</span>
                    <el-tag :type="scope.row.status === '10' ? 'success' : 'primary'" disable-transitions v-else>{{scope.row.status == 10 ?'本金还完':'未全部还完'}}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="用信金额" prop="eventamt" sortable>
                </el-table-column>
                <el-table-column label="本金余额" prop="principalbalance" sortable>
                </el-table-column>
                <el-table-column label="在逾金额" prop="overdue" sortable>
                </el-table-column>
                <el-table-column label="已还本金" prop="repayment" sortable>
                </el-table-column>
                <el-table-column label="事件名称" prop="eventname">
                </el-table-column>
                <el-table-column label="生效时间" prop="validstarttime" sortable>
                </el-table-column>
                <el-table-column label="失效时间" prop="validendtime" sortable>
                </el-table-column>
              </el-table>
            </template>
          </el-table-column>
          <el-table-column label="授信方" prop="fromname">
          </el-table-column>
          <el-table-column label="授信对象" prop="toname" v-if="creditDrawdown">
          </el-table-column>
          <el-table-column label="父授信对象" prop="toname" v-if="creditCredit">
          </el-table-column>
          <el-table-column label="订单编号" prop="sourceid">
          </el-table-column>
          <el-table-column label="状态" prop="status" :filters="this.filtersGuarantee" :filter-method="filterGuarante" filter-placement="bottom-end">
            <template slot-scope="scope">
              <el-tag :type="scope.row.status === '生效' ? 'success' : 'primary'" disable-transitions>{{scope.row.status}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="授信金额" prop="eventamt" sortable>
          </el-table-column>
          <el-table-column label="累计放款" prop="principalamt" sortable>
          </el-table-column>
          <el-table-column label="本金余额" prop="principalbalance" sortable>
          </el-table-column>
          <el-table-column label="剩余额度" prop="remainprincipal" sortable>
          </el-table-column>
          <el-table-column label="在逾金额" prop="overdue" sortable>
          </el-table-column>
          <el-table-column label="事件名称" prop="eventname">
          </el-table-column>
          <el-table-column label="生效时间" prop="validstarttime" sortable>
          </el-table-column>
          <el-table-column label="失效时间" prop="validendtime" sortable>
          </el-table-column>
        </el-table>
      </el-dialog>
      <!-- 债权-基础债权来源 -->
      <el-dialog :visible.sync="clalmDialogVisible" width="80%" height="80%" center>
        <el-table :data="ClalmData" style="width: 100%" :default-sort="{prop: 'date', order: 'descending'}" v-loading="loading">
          <el-table-column prop="eventname" label="事件名称" width="120">
          </el-table-column>
          <el-table-column prop="fromname" label="买方名称" width="150">
          </el-table-column>
          <el-table-column prop="fromcertno" label="买方证件号" width="150">
          </el-table-column>
          <el-table-column prop="toname" label="卖方名称" width="150">
          </el-table-column>
          <el-table-column prop="tocertno" label="卖方证件号" width="150">
          </el-table-column>
          <el-table-column prop="liabamt" label="涉及金额" sortable>
          </el-table-column>
          <el-table-column prop="status" label="状态" :filters="this.filtersStatus" :filter-method="filterTag" filter-placement="bottom-end">
            <template slot-scope="scope">
              <el-tag :type="scope.row.status === '有效' ? 'success' : 'primary'" disable-transitions>{{scope.row.status}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="validstarttime" label="生效时间" sortable>
          </el-table-column>
          <el-table-column prop="validendtime" label="失效时间" sortable>
          </el-table-column>
        </el-table>
      </el-dialog>
      <!-- 债权-融租-融租供应商 -->
      <!-- <el-dialog :visible.sync="clalmDialogleasing" width="80%" height="80%" center>
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
                        </el-dialog> -->
      <!-- 担保 -->
      <el-dialog :visible.sync="GuaranteeDialogVisible" width="80%" height="80%" center>
        <el-table :data="guaranteeData" style="width: 100%" v-loading="loading">
          <el-table-column prop="eventname" label="事件名称" width="100">
          </el-table-column>
          <el-table-column prop="fromname" label="担保方" width="180">
          </el-table-column>
          <el-table-column prop="toname" label="担保对象" width="180">
          </el-table-column>
          <el-table-column prop="cnyamt" label="担保金额" sortable>
          </el-table-column>
          <el-table-column prop="leasetarttime" label="生效时间" sortable>
          </el-table-column>
          <el-table-column prop="leasendtime" label="失效时间" sortable>
          </el-table-column>
          <el-table-column prop="operationlinecode" label="担保来源" :filters="this.filtersSource" :filter-method="filterSoure" filter-placement="bottom-end">
            <template slot-scope="scope">
              <el-tag :type="scope.row.status === '供应链金融' ? 'success' : 'success'" disable-transitions>{{scope.row.operationlinecode}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="guaranteesourceid" label="源系统ID">
          </el-table-column>
          <el-table-column prop="status" label="状态" :filters="this.filtersStatus" :filter-method="filterTag" filter-placement="bottom-end">
            <template slot-scope="scope">
              <el-tag :type="scope.row.status === '有效' ? 'success' : 'primary'" disable-transitions>{{scope.row.status}}</el-tag>
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
import Header from '@/components/Header.vue';
import graph from "@/libs/graph";
import network from "@/libs/network";
import { setItem, getItem, removeItem, setToken } from "@/libs/storage";
import { graphNode, graphLink, noData, position, graphLinkText } from "@/libs/constants";
import {
  isFullscreenEnabled,
  isFullscreen,
  requestFullscreen,
  exitFullscreen
} from "@/libs/tools";
import Arrow from "@/components/Arrow";

export default {
  name: "home",
  data: function() {
    return {
      searchname: "",
      searchList: [],
      isshowdetailBtnOnly: false,
      admin: getItem('admin') || {},
      ssId: '',
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
      creditCredit: false,
      creditDrawdown: false,
      detailId: "",
      filtersStatus: [
        { text: '有效', value: '有效' },
        { text: '无效', value: '无效' }
      ],
      filtersSource: [
        { text: '供应链金融', value: '供应链金融' },
        { text: '商业保理', value: '商业保理' },
        { text: '委托贷款', value: '委托贷款' },
        { text: '小额贷款', value: '小额贷款' },
        { text: '融资租赁', value: '融资租赁' },
        { text: '柯利', value: '柯利' }
      ],
      creditData: [],
      drawDownData: [],
      filtersGuarantee: [
        { text: '生效', value: '生效' },
        { text: '作废', value: '作废' }
      ],
      filtersDrawdown: [
        { text: '本金还完', value: '本金还完' },
        { text: '未全部还完', value: '未全部还完' }
      ],
      loading: false,
      connectedNodeIdMap: null,
      connectedLinkIdMap: null
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
        this.result[4].count = links.filter(item => item.relationType == "Interpersonal").length;
        this.result[5].count = links.filter(item => item.relationType == "Guarantee").length;
        this.result[6].count = links.filter(item => item.relationType == "Claim").length;
      }
      return this.result;
    }
  },
  methods: {
    filterTag: function(value, row) {
      return row.status === value;
    },
    filterGuarante: function(value, row) {
      return row.status === value;
    },
    filterCredit: function(value, row) {
      if (value == "生效") {
        return row.status === "10";
      } else {
        return row.status === "90";
      }
      // return row.status == 10 ?'生效':'作废' === value
    },
    filterDrawdown: function(value, row) {
      if (value == "本金还完") {
        return row.status === "10";
      } else {
        return row.status === "90";
      }
      // return row.status ===value
    },
    filterHandler: function(value, row, column) {
      const property = column['property'];
      return row[property] === value;
    },
    filterSoure: function(value, row) {
      return row.operationlinecode === value;
    },
    openDetails: function(row) {
      this.$refs.refTable.toggleRowExpansion(row)
    },
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
      this.ssId = item.ssid;
      this.detailId = item.id;
      this._clear()
    },
    deleteBtn: function() {
      this.searchname = '';
      this.ssId = "";
      this.isshowdetailBtnOnly = false;
      this._clear();
    },
    godetailEvent: function() {
      if (this.isReferenced) {
        setItem("parameter", {
          id: this.detailId,
          isReferenced: true,
          ssid: this.ssId
        })
      } else {
        setItem("parameter", {
          id: this.detailId,
          ssid: this.ssId
        })
      }
      let routeData = this.$router.resolve({ path: '/detail' })
      window.open(routeData.href, '_blank')
    },
    choose_event: function(e) {
      switch (e.keyCode) {
        case 8: //delete
          this.isshowdetailBtnOnly = false;
          this.ssId = "";
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
      if (this.ssId == '') {
        return false
      } else {
        this.graphShow = false;
        this.graphAfter = true;
        this.graphLoading = true;
        this.views = '1'
        if (this.checkedData == false) {
          network
            .get('/api/graph/group?id=' + this.ssId + '&isvalid=' + 'Y').then(res => {
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
                      initialNodes: [this.$data.ssId]
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
                  this.graphInstance.on("doubleClick", this.graphDoubleEvent);
                  this.graphInstance.on("hoverChange", this.graphhoverChange)
                }
              }
            })
        } else if (this.checkedData == true) {
          network
            .get('/api/graph/group?id=' + this.ssId + '&isvalid=' + 'N').then(res => {
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
                      initialNodes: [this.$data.ssId]
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
          .get("/api/neo4j/equityThrough?nodeid=" + this.ssId + "&direction=" + 'up').then(up => {
            // up.data = this.formatGraphData(up.data, 'up')
            network.get("/api/neo4j/equityThrough?nodeid=" + this.ssId + "&direction=" + 'down').then(down => {
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
                      // initialNodes: [this.$data.ssId]
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
          .get("/api/graph/controller?id=" + this.ssId).then(res => {
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

        if (node.iscp in graphNode) {
          Object.assign(node.style, graphNode[node.iscp]);
        } else {
          Object.assign(node.style, graphNode.default);
        }
        node.style.items = [];
        if (this.views == 1) {
          if (node.id == this.ssId) {
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
          case "Interpersonal":
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
    toggleRelation: function(type) {
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
          }
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
      // var graphZoomSize = this.graphInstance.zoom();
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
      //Credit有下拉
      if (e.clickLink) {
        this.guaranteeData = [];
        this.CreditData = [];
        this.loading = true;
        //子和独是一个字段 drawdown 
        if (e.clickLink.data.relationType == 'Credit' && e.clickLink.data.tag == '独立授信额度') {
          this.creditDialogVisible = true;
          this.creditDrawdown = true;
          this.creditCredit = false;
          if (this.$refs.refTable) {
            this.$refs.refTable.clearFilter();
          }
          network.get("/api/graph/creditEvent?fromid=" + e.clickLink.data.from + "&toid=" + e.clickLink.data.to + "&subtype=" + e.clickLink.data.tag).then(res => {
            this.CreditData = res.data.list;
            this.loading = false;
          })
        }
        else if (e.clickLink.data.relationType == 'Credit' && e.clickLink.data.tag == '子授信额度') {
          this.creditDialogVisible = true;
          this.creditDrawdown = true;
          this.creditCredit = false;
          if (this.$refs.refTable) {
            this.$refs.refTable.clearFilter();
          }
          network.get("/api/graph/creditEvent?fromid=" + e.clickLink.data.from + "&toid=" + e.clickLink.data.to + "&subtype=" + e.clickLink.data.tag).then(res => {
            this.CreditData = res.data.list;
            this.loading = false;
          })
        }
        //credit
        else if (e.clickLink.data.relationType == 'Credit' && e.clickLink.data.tag == '父授信额度') {
          this.creditDialogVisible = true;
          this.creditCredit = true;
          this.creditDrawdown = false;
          if (this.$refs.refTable) {
            this.$refs.refTable.clearFilter();
          }
          network.get("/api/graph/creditEvent?fromid=" + e.clickLink.data.from + "&toid=" + e.clickLink.data.to + "&subtype=" + e.clickLink.data.tag).then(res => {
            this.CreditData = res.data.list;
            this.loading = false;
          })
        }
        else if (e.clickLink.data.relationType == 'Claim') {
          this.clalmDialogVisible = true;
          network.get("/api/graph/claimEvent?fromid=" + e.clickLink.data.from + "&toid=" + e.clickLink.data.to).then(res => {
            this.ClalmData = res.data.list;
            this.loading = false;
          })
        }
        else if (e.clickLink.data.relationType == 'Claim' && e.clickLink.data.tag == '融租供应商') {
          this.clalmDialogleasing = true;
          network.get("/api/graph/claimEvent?fromid=" + e.clickLink.data.from + "&toid=" + e.clickLink.data.to).then(res => {
            this.ClalmData = res.data.list;
            this.loading = false;
          })
        }
        else if (e.clickLink.data.relationType == 'Guarantee') {
          this.GuaranteeDialogVisible = true;
          network.get("/api/graph/guaranteeEvent?fromid=" + e.clickLink.data.from + "&toid=" + e.clickLink.data.to).then(res => {
            this.guaranteeData = res.data.list;
            this.loading = false;
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
          e.clickNode.loading = true;
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
                this.NodesSearch = addNodes;
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
              e.clickNode.loading = true;
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
                e.clickNode.loading = false;
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
        id1: this.ssId,
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
              // initialNodes: [this.$data.ssId]
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
          isReferenced: true,
        })
      } else {
        setItem("parameter", {
          id: id,
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

    graphDragEvent: function(e) {
      this.$data.graphPopup = false;
    },
    graphDoubleEvent: function(e) {
      e.preventDefault();
    },
    graphhoverChange: function(e) {
      let _this = this
      if (e.hoverNode) {
        if (!_this.connectedLinkIdMap) {
          _this.connectedNodeIdMap = {};
          _this.connectedLinkIdMap = {};
          e.hoverNode.links.forEach(function(d) {
            _this.connectedLinkIdMap[d.id] = 1;
            _this.connectedNodeIdMap[d.data.from] = 1;
            _this.connectedNodeIdMap[d.data.to] = 1;
          })
        }
        e.chart.nodes().forEach(function(d) {
          if (!_this.connectedNodeIdMap[d.id]) {
            d.fillColor = '#eee';
            d.image = ''
          }
        });
        e.chart.links().forEach(function(d) {
          if (!_this.connectedLinkIdMap[d.id]) {
            d.fillColor = '#eee';
            d.labelStyle.textStyle.fillColor = '#cecece';
          }
        });
      }else{
        this.connectedNodeIdMap = null;
        this.connectedLinkIdMap = null;
        e.chart.updateStyle();
      }
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
      this.graphtext == false
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
      //改成this.graphInstance.exportData(true,false) 获取全部图谱
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

        if (node.iscp in graphNode) {
          Object.assign(node.style, graphNode[node.iscp]);
        } else {
          Object.assign(node.style, graphNode.default);
        }
        node.style.items = [];
        if (this.views == 1) {
          if (node.id == this.ssId) {
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
              if (link.weight == 0) {
                link.style.label = '投资';
              } else {
                link.style.label = '投资-' + `${link.weight}%`;
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
              link.style.label = `${link.tag}` + '-' + `${link.totalamt}`;
            }
            break;
          case "Interpersonal":
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
        type: "Interpersonal",
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
    this.initializeGraph();
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
      network.get('/api/login/getToken?ticket=' + ticket).then(res => {
        if (res.data.code == 200) {
          setToken(res.data.token);
        }
        setItem("domain", {
          domain: res.data.environment
        })
      })
    }


  },
  components: {
    Arrow,
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

.glp-graph .legend-wrapper .graph-toolbar>li.graph-unlock>i {
  display: block;
  width: 15px;
  height: 15px;
  margin: 3px;
  background-image: url(../assets/images/glp/unlock.png);
}

.glp-graph .legend-wrapper .graph-toolbar>li.graph-unlock>i:hover {
  display: block;
  width: 15px;
  height: 15px;
  margin: 3px;
  background-image: url(../assets/images/glp/unlock_hover.png);
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
  width: 8.9%;
  display: block;
  float: left;
}

.collapse-one {
  width: 8.9%;
  float: left;
  display: block;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.collapse-spanTwo {
  border-bottom: 1px solid #ebeef5;
  background: #ebeef5;
  height: 50px;
  line-height: 50px;
}

.collapse-spanTwo>span {
  width: 8.7%;
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
  width: 8.7%;
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
  width: 11%;
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
  width: 11%;
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

