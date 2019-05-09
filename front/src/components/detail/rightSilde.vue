<template lang="html">
    <div class="right-slide">
        <div class="model-tip">
            <img class="model-icon" src="@/assets/images/glp/model-tip.png"/>
            <span class="model-des">猜您想要进一步了解</span>
        </div>
        <ul class="model-list clearfix">
            <!-- <li v-for="(item,index) in graphCates" @click="goGraph(item.type)">
                <img src="'@/assets/images/glp/'+item.url+'.png'" alt=""/>
                <a >{{item.name}}</a>
            </li> -->
            <li>
                <img src="@/assets/images/glp/search-puxi.png"/>
                <a>企业谱系</a>
            </li>
            <li>
                <img src="@/assets/images/glp/search-puxi.png"/>
                <a>股权架构</a>
            </li>
            <li>
                <img src="@/assets/images/glp/search-puxi.png"/>
                <a>实际控制人</a>
            </li>
            <li>
                <img src="@/assets/images/glp/search-puxi.png"/>
                <a>受益所有人</a>
            </li>
            <li>
                <img src="@/assets/images/glp/search-puxi.png"/>
                <a>关联探查</a>
            </li>
             <li>
                <img src="@/assets/images/glp/search-puxi.png"/>
                <a>关联探查</a>
            </li>
        </ul>
    </div>
</template>

<script>

export default {
    data () {
        return {
            graphCates : [
                { name:'企业谱系', type:'PedigreeShow',url:'search-puxi' },
                { name:'股权架构', type:'equityShow', url:'search-stock' },
                { name:'实际控制人', type:'actualShow', url:'search-stock' },
                { name:'受益所有人', type:'beneficiaryShow', url:'search-actual' },
                { name:'关联探查', type:'teamShow', url:'search-fang' },
                { name:'关联方', type:'affiliateShow', url:'search-jituan' }
            ]
        }
    },
    methods:{
        goGraph (params) {
            let quiknameSideId = this.routeKey.id
            let entName = this.routeKey.name
			if( params == 'PedigreeShow') {
				this.jumpTo('relation', "type=team&name="+entName+"&entid="+ quiknameSideId);
			}else if(params == 'relationShow') {
				this.jumpTo('relation', 'type=relation&name='+entName+"&entid="+ quiknameSideId);
			}else if(params == 'teamShow') {
				// 集团页面
				this.jumpTo('puxi', "type=puxi&name="+entName+"&entid="+ quiknameSideId);
			}else if(params == 'affiliateShow'){
                this.jumpTo('affiliate', "type=affiliate&name="+entName+"&entid="+ quiknameSideId);
            } else {
				this.jumpTo('pedigree', 'type=' + params + '&name='+entName+"&entid="+ quiknameSideId);
			}
		},
    }
}
</script>

<style lang="less">
.right-slide{
    * { box-sizing: border-box; -moz-box-sizing:border-box;-webkit-box-sizing:border-box ;border:none;}

    float: right;width:228px;
    background:#fff;padding-bottom: 9999px;margin-bottom: -9999px;

    .model-tip{
        width:100%;height:146px;color:#fff;text-align:center;font-size:18px;
        background:rgba(114,194,251,.88);

        .model-icon{ margin-top:22px; }
        .model-des{ display:block; margin-top:8px; }
    }
    .model-list{
        margin-top:26px;padding:0 15px;
        li{
            list-style:none;
            float: left;
            width:88px;margin:10px 5px 30px;font-size:14px;text-align:center;
            border:1px solid transparent;

            img{ margin: 10px 0; }
            a{ display:block;width:100%;line-height: 26px;color:#333;cursor: pointer; }

            &.disabled{
                a{ color:#aaa; }
            }
            &:hover{
                border: 1px solid #c6ddfe; border-radius: 10px;

                a{ text-decoration: none;}
            }
        }
    }
}
</style>
