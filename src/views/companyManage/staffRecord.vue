<template>
  <div>
    <div class="staff">
      <table width="100%" border="0" cellspacing="0" cellpadding="0" class="order-tb">
        <colgroup class="colgroup">
          <col class="number-col">
          <col class="amount-col">
          <col class="status-col">
          <col class="operate-col">
        </colgroup>
        <thead>
          <tr class="head1">
            <th>订单详情</th>
            <th>总金额</th>
            <th>全部状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <template v-if="ORDERLIST.length">
        <tbody class="order-item" v-for="(order,i) in ORDERLIST" :key="i">
          <tr class="sep-row">
            <td colspan="4"></td>
          </tr>
          <tr class="tr-th">
            <td colspan="4">
              <span class="gap"></span>
              <span class="dateline">{{order.dateline_str}}</span>
              <span class="orderid">订单号：{{order.WIDout_trade_no}}</span>
            </td>
          </tr>
          <tr class="tr-bd">
            <td>
              <div class="good-item" v-for="(child,j) in order.child" :key="j">
                <div class="p-name">{{child.WIDsubject}}</div>
                <div class="p-details">
                  <span>单价: {{child.favprice>0? '¥' + child.favprice : '免费'}}</span>
                  <span>数量：{{child.shuangpin_count}}</span>
                  <span>小计：¥ {{child.WIDtotal_fee}}</span>
                  <span>{{child.end_time_str}}</span>
                </div>
              </div>
            </td>
            <td :rowspan="2">
              <div class="amount">
                <span>¥{{order.WIDtotal_fee}}</span>
              </div>
            </td>
            <td :rowspan="2">
              <div class="status">
                <span v-if="order.ispay == 0" :class="'status'+order.ispay">未支付</span>
                <span v-else-if="order.ispay == 1" :class="'status'+order.ispay">已完成</span>
                <span v-else-if="order.ispay == 2" :class="'status'+order.ispay">已关闭</span>
                <span v-else-if="order.ispay == 4 || order.ispay == 5">已退款</span>
              </div>
            </td>
            <td :rowspan="2">
              <div class="operate">
                <span v-if="order.ispay == 0" class="pay" @click="toPay(order,i)">继续支付</span>
                <p style="display:none">订单剩余7天失效</p>
              </div>
            </td>
          </tr>
        </tbody>
        </template>
        <template v-else>
        <tbody>
          <tr>
            <td colspan="4">
              <div class="null">
                <img src="https://static.hrloo.com/hrloo56/elp/rl/null.png" alt>
                <p>没有订单记录</p>
              </div>
            </td>
          </tr>
        </tbody>
        </template>
      </table>
      <div class="pagebar" v-if="pagesNum > pages">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="pagesNum"
          :page-size="pages"
          @current-change="_currentChange"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import homeHeader from "../../components/header";
export default {
  data() {
    return {
      ORDERLIST: [], //订单信息
      pagesNum: 0,
      pages: this.$config.pageSize,
      package_id: null,
      count: null
    };
  },
  components: { homeHeader },
  mounted() {
    // console.log("mounted this", this);
    // console.info("URL", URL);
    this._getPayList();
  },
  methods: {
    //获取当前用户订单信息
    _getPayList(args) {
      const self = this;
      self.$api.global
        .getOrderList(args)
        .then(res => {
          // console.info("res.data", res.data.data);
          if (res.data.result === 0) {
            let { data, count } = res.data.data.data;

            self.ORDERLIST = data;
            self.pagesNum = +count;
            // console.log("self.ORDERLIST", self.ORDERLIST);
          } else {
            self.$message.error(result.msg);
          }
        })
        .catch(err => {});
    },
    //分页
    _currentChange(res) {
      console.info("res", res);
      this._getPayList({
        page: res
      });
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    },
    //跳转支付页
    toPay(item, idx) {
      console.log("item", item);
      console.log("idx", idx);
      // item.child.forEach((element,index) => {

      // });
      console.log("item.WIDout_trade_no", item.WIDout_trade_no);
      console.log("this.$route.fullPath", this.$route.fullPath);

      this.$storage.set("historyPath", this.$route.fullPath);

      this.$router.push({
        path: "buyLesson",
        query: { trade_no: item.WIDout_trade_no }
      });
    }
  }
};
</script>
<style lang="less" scoped>
//引入基础less文件
@import (reference) "../../style/mixins/_var.less";
@import (reference) "../../style/mixins/index.less";
.staff {
  margin: 0 35px 35px;
  background-color: #fff;
  padding: 20px;
}
.order-tb {
  tbody td {
    border: 1px solid #eee;
  }
  .sep-row td {
    border: 0;
  }
}
// table
.colgroup {
  .number-col {
    width: 55%;
  }
  .amount-col {
    width: 15%;
  }
  .status-col {
    width: 15%;
  }
  .operate-col {
    width: 15%;
  }
}
.head1 {
  height: 32px;
  line-height: 32px;
  background-color: #ebf3ff;
  font-size: 12px;
  text-align: center;
  th {
    font-weight: normal;
    &:nth-child(1) {
      text-align: left;
      text-indent: 30px;
    }
  }
}
.sep-row {
  height: 20px;
}
.tr-th {
  background-color: #f6f6f6;
  height: 31px;
  line-height: 31px;
  color: #999;
  overflow: hidden;
  span {
    float: left;
    height: 31px;
    line-height: 31px;
    // padding: 2px 0 0;
    _display: inline;
    &.dateline {
      margin-right: 20px;
    }
  }
  .gap {
    display: inline-block;
    width: 15px;
    height: 31px;
  }
}
.tr-bd {
  text-align: center;
  vertical-align: top;
}
.good-item {
  text-align: left;
  padding: 15px 0 15px 30px;
  border-top: 1px solid #eee;
  margin-top: -1px;
  .p-name {
    color: #666;
  }
  .p-details {
    color: #999;
    .flex();
    margin-top: 10px;
    span {
      .flex-value();
    }
  }
}
.amount,
.status,
.operate {
  padding-top: 25px;
}

.amount,
.status {
  font-size: 14px;
}

.amount {
  color: #666;
}
.status0 {
  color: #ff3c3b;
}
.status1 {
  color: #25921d;
}
.status3 {
  color: #666;
}

.operate {
  span.pay {
    display: inline-block;
    font-size: 14px;
    color: #fff;
    background-color: @bgColor;
    border-radius: (3px);
    padding: 3px 10px;
    cursor: pointer;
    &:hover {
      background-color: @hovColor;
    }
  }
  p {
    color: @gColor;
    margin-top: 3px;
  }
}
</style>

