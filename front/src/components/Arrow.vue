<template>
  <div class="arrow-wrapper" @click="()=>toggleSelect(arrowData.type)">
    <span :class="{arrow: true, [`arrow_${arrowData.type.toLowerCase()}`]: selected}"></span>
    <span>{{arrowData.label}}({{arrowData.count}}家)</span>
  </div>
</template>

<script>
export default {
  data: function() {
    return {
      selected: true
    };
  },
  methods: {
    toggleSelect: function(type) {
      this.clickEvent(type, this.$data.selected);
      this.$data.selected = !this.$data.selected;
    }
  },
  props: {
    arrowData: Object,
    clickEvent: Function
  },
  watch: {
    arrowData: function() {
      this.$data.selected = true;
    }
  }
};
</script>

<style>
.arrow-wrapper {
  display: inline-block;
  cursor: pointer;
}

.arrow-wrapper>.arrow {
  position: relative;
  display: inline-block;
  height: 0;
  width: 20px;
  padding-top: 4px;
  border-top: 2px solid #ddd;
  margin-right: 10px;
}

.arrow-wrapper>.arrow::after {
  position: absolute;
  left: 15px;
  top: -5px;
  content: "";
  box-sizing: border-box;
  border-width: 4px 12px;
  border-style: solid;
  border-color: transparent transparent transparent #ddd;
}

.arrow-wrapper>.arrow_investment {
  border-color: #F97657;
}

.arrow-wrapper>.arrow_investment::after {
  border-left-color: #F97657;
}


.arrow-wrapper>.arrow_header {
  border-color: #F19EC2;
}

.arrow-wrapper>.arrow_header::after {
  border-left-color: #F19EC2;
}


.arrow-wrapper>.arrow_senior {
  border-color: #AA89BD;
}

.arrow-wrapper>.arrow_senior::after {
  border-left-color: #AA89BD;
}


.arrow-wrapper>.arrow_credit {
  border-color: #EBBC6C;
}

.arrow-wrapper>.arrow_credit::after {
  border-left-color: #EBBC6C;
}


.arrow-wrapper>.arrow_hide {
  border-color: #B8BF80;
}

.arrow-wrapper>.arrow_hide::after {
  border-left-color: #B8BF80;
}

.arrow-wrapper>.arrow_guarantee {
  border-color: #ACD598;
}

.arrow-wrapper>.arrow_guarantee::after {
  border-left-color: #ACD598;
}

.arrow-wrapper>.arrow_claim {
  border-color: #7ECEF4;
}

.arrow-wrapper>.arrow_claim::after {
  border-left-color: #7ECEF4;
}

.arrow-wrapper>.arrow+span {
  color: #999;
}

.arrow-wrapper>.arrow_investment+span,
.arrow-wrapper>.arrow_header+span,
.arrow-wrapper>.arrow_senior+span,
.arrow-wrapper>.arrow_credit+span,
.arrow-wrapper>.arrow_hide+span,
.arrow-wrapper>.arrow_claim+span,
.arrow-wrapper>.arrow_guarantee+span {
  color: inherit;
}
</style>

