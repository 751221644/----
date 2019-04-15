<template>
  <div class="buy_card">
    <el-card class="box-card">
      <div style="padding:0 40px">
        <div>
          <el-steps
            class="flex just-c"
            :space="200"
            :active="active"
            finish-status="success"
            @click="next"
            align-center
          >
            <el-step title="核对订单"></el-step>
            <el-step title="支付订单"></el-step>
            <el-step title="完成"></el-step>
          </el-steps>
        </div>
        <div v-if="active==1" style="margin-top:60px">
          <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="name" label="名称" width="400"></el-table-column>
            <el-table-column prop="end_time_str" label="有效期至"></el-table-column>
            <el-table-column prop="favprice" label="单价（元）"></el-table-column>

            <el-table-column prop="count" label="数量">
              <template slot-scope="scope">
                <el-button
                  v-if="scope.row.isBuyCount"
                  @click="cutClick(scope.row)"
                  class="count_price"
                  type="text"
                  size="small"
                >-</el-button>
                <span v-if="scope.row.isBuyCount" style="padding: 0 5px">{{scope.row.count}}</span>
                <span v-if="!scope.row.isBuyCount" style="padding: 0 5px">{{scope.row.count}}</span>
                <el-button
                  @click="addClick(scope.row)"
                  v-if="scope.row.isBuyCount"
                  class="count_price"
                  type="text"
                  size="small"
                >+</el-button>
              </template>
              <!-- <template slot-scope="scope" v-if="!scope.row.isBuyCount">
                <span>{{lessonCount}}</span>
              </template>-->
            </el-table-column>

            <el-table-column prop="total_fee" label="小计">
              <template slot-scope="scope">
                <span>{{scope.row.total_fee}}</span>
                <!-- <span  v-if="scope.row.isBuyCount">{{total_fee}}</span> -->
              </template>
            </el-table-column>
          </el-table>
          <div class="flex order_price">
            <div>
              <span>订单总计：</span>
              <span>￥{{totalPrice}}</span>
            </div>
            <div style="margin-top:10px">
              <el-button type="primary" style="margin-top: 12px;" @click="next">确认订单</el-button>
            </div>
          </div>
        </div>
        <div>
          <div></div>
        </div>
        <div class="pay" v-if="active==2">
          <p
            class="flex just-c"
            style="padding :40px;color:#fd4948;font-size:16px"
          >即将支付：￥{{totalPrice}}</p>

          <div class="card_pay">
            <div class="head_pay">
              <span
                v-for="(item,index) in pay_way"
                :class="item.isShow?'payWay_active':''"
                @click="changeTabs(item)"
              >{{item.name}}</span>
            </div>
            <div v-if="pay_way[0].isShow" style="position:relative">
              <span class="span_tip">欢迎使用微信支付，请使用手机微信扫码支付</span>
              <div class="wx_pay_con">
                <img
                  style=" width: 153px; height: 87px;"
                  src="https://static.hrloo.com/hrloo/special/rzkz/img/pay_wechat.png"
                  alt
                >
                <img style="width:250px;height:250px" :src="orderStr" alt>
              </div>
            </div>
            <div v-if="pay_way[1].isShow"></div>
            <!-- <div v-if="pay_way[2].isShow"></div> -->
          </div>
        </div>
        <div class="done flex column" v-if="active==3">
          <i class="el-icon-circle-check done_icon"></i>
          <p>支付成功</p>
          <p>您可在订单记录查看订单详情</p>
          <el-button type="primary" style="margin-top: 12px;" @click="next">确认</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>


<script>
import { log } from "util";
export default {
  data() {
    return {
      active: 1,
      tableData: [],
      totalPrice: 0,
      playUrl: {},
      jdUrl: {},
      User_num: 0,
      orderId: null,
      orderStr: "",
      countTime: null,
      payOroderId: null,
      card_id: null,
      timmer: null,
      jd_url: "",
      hisPath: "",
      childCount: null, //子账号数量
      lessonCount: null, //
      countPrice: null, //子账号单价
      pay_way: [
        { name: "微信支付", isShow: true, pay_way: "1" },
        { name: "支付宝", isShow: false, pay_way: "1" }
      ]
    };
  },
  mounted() {
    // console.log("this.", this.$route.query);
    this.hisPath = this.$storage.get("historyPath");
    console.log("this,.pat", this.hisPath);

    //继续支付的情况，直接跳第二步
    if (this.$route.query.trade_no) {
      var args = {
        trade_no: this.$route.query.trade_no
      };
      this.$api.school
        .pay_order(args)
        .then(res => {
          this.orderStr =
            "https://www.hrloo.com/hrloo.php?m=pay&c=pay&a=weixin_native_pay&WIDout_trade_no=" +
            this.$route.query.trade_no;
          this.getTimeCount();
          this.payOroderId = this.$route.query.trade_no;
          this.active = 2;
          this.totalPrice = res.data.data.total_fee;
        })
        .catch(err => Error(err));
    } else {
      var parms = {
        package_id: this.$route.query.package_id,
        count: this.$route.query.count
      };

      //只够买子账号
      if (this.$route.query.onlyBuyCount) {
        this.pay_staff(parms);
      } else {
        this.toPay(parms);
      }
    }
  },
  computed: {
    computeTotalPrice() {
      this.totalPrice = 0;
      this.tableData.forEach(ele => {
        this.totalPrice += Number(ele.total_fee);
      });
    }
  },
  methods: {
    pay_staff() {
      var parms = {
        count: 1
      };
      this.$api.companyInfo
        .pay_staff(parms)
        .then(res => {
          console.log("res", res.data.data.staff_product);
          res.data.data.staff_product.count = 1;
          this.totalPrice =
            res.data.data.staff_product.count *
            res.data.data.staff_product.total_fee;
          this.tableData.push(res.data.data.staff_product);
          this.giveIsCount()
        })
        .catch(err => Error(err));
    },
  giveIsCount(){
       this.tableData.forEach(ele => {
            if (ele.name == "子账户购买") {
              ele.isBuyCount = true;
            } else {
              ele.isBuyCount = false;
            }
          });
  },
    toPay(parms) {
      this.$api.lessonCenter
        .buylesson(parms)
        .then(res => {
          //只够买子账号
          if (this.$route.query.count == 0) {
            this.tableData.push(res.data.data.video_product);
              this.giveIsCount()

          } else {
            this.lessonCount = res.data.data.video_product.count;
            this.tableData.push(res.data.data.video_product);
            res.data.data.staff_product.count = this.$route.query.count;
            this.tableData.push(res.data.data.staff_product);
            console.log(
              "res.data.data.staff_product",
              res.data.data.staff_product
            );
            if (res.data.data.staff_product) {
              this.childCount = res.data.data.staff_product.count;
              this.countPrice = res.data.data.favprice;
              console.log("有子账号");
            }
            console.log("this.tableData", this.tableData);
              this.giveIsCount()

          }
          this.computeTotalPrice();
        })
        .catch(err => Error(err));
      
    },
    handleChange(value) {
      console.log(value);
    },

    //切换tab
    changeTabs(val) {
      this.pay_way.forEach(element => {
        // if (element.name == val.name) {
        //   element.isShow = true;
        // } else {
        //   element.isShow = false;
        // }
        if (element.name == "支付宝") {
          window.open(this.playUrl.alipay_url);
        }
      });
      // console.log("val", val);
      // this.card_id = val.paneName;
      // if (val.paneName == 1) {
      //   window.open(this.playUrl.alipay_url);
      // }
    },

    next() {
      //去下单
      if (this.active == 1) {
        //子账号确认订单
        if (this.$route.query.onlyBuyCount) {
          var parms = {
            count: 1,
            dosubmit: 1
          };
          this.$api.companyInfo
            .pay_staff(parms)
            .then(res => {
              console.log("res", res);
              if (res.data.result == 0) {
                this.playUrl = res.data.data.pay_url;
                if (res.data.data.pay_url.jd_url) {
                  this.jd_url = res.data.data.pay_url.jd_url;
                } else {
                  this.jd_url = "";
                  // this.pay_way[2].pay_way = '2'
                }
                this.orderStr =
                  "https://www.hrloo.com/hrloo.php?m=pay&c=pay&a=weixin_native_pay&WIDout_trade_no=" +
                  res.data.data.orderid;
                this.payOroderId = res.data.data.orderid;
              } else {
                this.$message.error(res.data.msg);
              }
            })
            .catch(err => Error(err));
        } else {
          var parms = {
            package_id: this.$route.query.package_id,
            count: this.$route.query.count,
            dosubmit: 1
          };
          this.$api.lessonCenter
            .buylesson(parms)
            .then(res => {
              if (res.data.result == 0) {
                this.playUrl = res.data.data.pay_url;
                this.orderStr =
                  "https://www.hrloo.com/hrloo.php?m=pay&c=pay&a=weixin_native_pay&WIDout_trade_no=" +
                  res.data.data.paylist[0].WIDout_trade_no;
                this.payOroderId = res.data.data.orderid;
              } else {
                this.$message.error(res.data.msg);
              }
            })
            .catch(err => {
              Error(err);
            });
        }
        this.getTimeCount();
      }
      //购买完成去跳转之前的点过来的页面
      if (this.active++ > 2)
        this.$router.push({
          path: this.hisPath
        });
    },
    cutClick(val) {
      console.log("val", val);
      if (val.count == 1) return;
      val.count = Number(val.count) - 1;
      val.total_fee = Number(val.count) * Number(val.favprice);
      this.childCount = val.count;
      // this.getPrice()
      this.computeTotalPrice();
    },
    addClick(val) {
      val.count = Number(val.count) + 1;
      this.childCount = val.count;
      val.total_fee = Number(val.count) * Number(val.favprice);
      this.computeTotalPrice();

      // this.getPrice()
    },
    //获取是否购买订单
    isBuyOrder(orderId) {
      var parms = {
        orderid: orderId
      };
      this.$api.global
        .getOrderPayState(parms)
        .then(res => {
          console.log("res", res.data.result);
          if (res.data.result == 0) {
            this.active = 3;
            clearInterval(this.timmer);
          }
        })
        .catch(err => Error(err));
    },
    getTimeCount() {
      this.countTime = 600;
      this.timmer = setInterval(() => {
        console.log("2222222222222", this.payOroderId);
        this.isBuyOrder(this.payOroderId);
        this.countTime--;
        if (this.countTime < 1) {
          clearInterval(this.timmer);
        }
      }, 3000);
    }
  },
  destroyed() {
    if (this.timmer) {
      clearInterval(this.timmer);
    }
  }
};
</script>
<style scoped lang="less">
.count_price {
  width: 20px;
  height: 20px;
  padding: 0;
  margin-bottom: 5px;
  border: 1px solid rgba(215, 215, 215, 1)!important;
  color: rgba(210, 210, 210, 1);
}
.head_pay {
  background-color: rgba(247, 247, 247, 1);
  height: 45px;
  display: flex;
  align-items: center;
  span {
    height: 45px;
    width: 100px;
    align-items: center;
    justify-content: center;
    display: flex;
    font-size: 14px;
    cursor: pointer;
  }
}
.payWay_active {
  font-weight: bold;
  background-color: white;
  border-top: 2px solid rgba(23, 155, 230, 1);
  color: rgba(23, 155, 230, 1);
}
.span_tip {
  position: absolute;
  color: rgb(203, 203, 203);
  top: 20px;
  left: 40px;
}
.el-tabs__content {
  display: flex;
  justify-content: center;
}
.wx_pay_con {
  padding-top: 36px;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.wx_div {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 600px;
  padding-left: 80px;
}
.text {
  font-size: 14px;
}
.buy_card {
  margin: 0 35px 60px;
  height: 100%;
}
.item {
  margin-bottom: 18px;
}
.order_price {
  flex-direction: column;
  align-items: flex-end;
  margin-top: 60px;
}
.done_icon {
  font-size: 60px;
  color: rgba(82, 193, 73, 1);
}
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}
.pay {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.box-card {
  width: 100%;
  height: 100%;
}
.done {
  width: 160px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  padding-top: 200px;
  padding-right: 15px;
}
.el-steps {
  display: flex;
  justify-content: center;
}
.el-card {
  /deep/.el-card__body {
    margin-top: 60px;
  }
}
.el-tabs {
  width: 800px;
  height: 400px;
}
.card_pay {
  width: 800px;
  height: 400px;
  background: #fff;
  border: 1px solid #dcdfe6;
  -webkit-box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.12),
    0 0 6px 0 rgba(0, 0, 0, 0.04);
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.12), 0 0 6px 0 rgba(0, 0, 0, 0.04);
}
</style>