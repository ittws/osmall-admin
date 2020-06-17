<style lang="less">
@import "../../styles/common.less";
@import "home.less";
</style>
<template>
  <div class="home-main">
    <Spin size="large" fix v-if="spinShow" class="mask"></Spin>
    <!-- 今日数据展示 -->
    <Row class="Row box">
      <Col span="4">
        <div class="box-item bg-member">
          <Row>
            <Col span="16">
              <div class="value">{{dashboardData.userCount}}</div>
              <div class="desc">今日会员新增</div>
              <div class="compare">
                较昨日会员{{(dashboardData.userCountGrowthRate*100).toFixed(2)}}%
                <Icon v-if="dashboardData.userCountGrowthRate>=0" type="arrow-up-b"></Icon>
                <Icon v-if="dashboardData.userCountGrowthRate<0" type="arrow-down-b"></Icon>
              </div>
            </Col>
            <Col span="8" class="t_r margin-top-10">
              <Icon size="35" type="person-add"></Icon>
            </Col>
          </Row>
        </div>
      </Col>
      <Col span="4">
        <div class="box-item bg-order">
          <Row>
            <Col span="16">
              <div class="value">{{dashboardData.orderCount}}</div>
              <div class="desc">今日付款订单</div>
              <div class="compare">
                较昨日订单{{(dashboardData.orderCountGrowthRate*100).toFixed(2)}}%
                <Icon v-if="dashboardData.orderCountGrowthRate>=0" type="arrow-up-b"></Icon>
                <Icon v-if="dashboardData.orderCountGrowthRate<0" type="arrow-down-b"></Icon>
              </div>
            </Col>
            <Col span="8" class="t_r margin-top-10">
              <Icon size="35" type="ios-list"></Icon>
            </Col>
          </Row>
        </div>
      </Col>
      <Col span="4">
        <div class="box-item bg-amount">
          <Row>
            <Col span="16">
              <div class="value">￥{{dashboardData.orderAmount}}</div>
              <div class="desc">今日付款金额</div>
              <div class="compare">
                较昨日金额{{(dashboardData.orderAmountGrowthRate*100).toFixed(2)}}%
                <Icon v-if="dashboardData.orderAmountGrowthRate>=0" type="arrow-up-b"></Icon>
                <Icon v-if="dashboardData.orderAmountGrowthRate<0" type="arrow-down-b"></Icon>
              </div>
            </Col>
            <Col span="8" class="t_r margin-top-10">
              <Icon size="35" type="social-usd"></Icon>
            </Col>
          </Row>
        </div>
      </Col>
      <Col span="4">
        <div class="box-item bg-member">
          <Row>
            <Col span="16">
              <div class="value">￥{{dashboardData.merchantWithdrawAmount}}</div>
              <div class="desc">商家提现中金额</div>
            </Col>
            <Col span="8" class="t_r margin-top-10">
              <Icon size="35" type="social-usd"></Icon>
            </Col>
          </Row>
        </div>
      </Col>
      <Col span="4">
        <div class="box-item bg-order">
          <Row>
            <Col span="16">
              <div class="value">￥{{dashboardData.userAwardAmount}}</div>
              <div class="desc">会员总佣金</div>
            </Col>
            <Col span="8" class="t_r margin-top-10">
              <Icon size="35" type="social-usd"></Icon>
            </Col>
          </Row>
        </div>
      </Col>
      <Col span="4">
        <div class="box-item bg-amount">
          <Row>
            <Col span="16">
              <div class="value">￥{{dashboardData.totalOrderAmount}}</div>
              <div class="desc">订单金额</div>
            </Col>
            <Col span="8" class="t_r margin-top-10">
              <Icon size="35" type="social-usd"></Icon>
            </Col>
          </Row>
        </div>
      </Col>
    </Row>
    <Row>
      <Col span="12">
        <div class="hot-product-pannel">
          <Card class="margin-top-20" style="height: 325px">
            <p slot="title">待处理事务</p>
            <Row style="padding:20px">
              <Col span="4" class="ivu-form-item-label">
                订单(待付款)
              </Col>
              <Col span="4" class="t_c">
                <a @click="navOrder">{{dashboardData.toPayOrderCount}}</a>
              </Col>
              <Col span="4" class="ivu-form-item-label">
                订单(待发货)
              </Col>
              <Col span="4" class="t_c">
              <a @click="navOrder">{{dashboardData.toDeliverOrderCount}}</a>
              </Col>
              <Col span="4" class="ivu-form-item-label">
               退款(待审核)
              </Col>
              <Col span="4" class="t_c">
              <a @click="navAfterSale">{{dashboardData.toReviewAfterSaleCount}}</a>
              </Col>
            </Row>
            <Row style="padding:20px">
              <Col span="4" class="ivu-form-item-label">
                退款(待收货)
              </Col>
              <Col span="4" class="t_c">
                <a @click="navAfterSale">{{dashboardData.toConfirmAfterSaleCount}}</a>
              </Col>
              <Col span="4" class="ivu-form-item-label">
                评论(待回复)
              </Col>
              <Col span="4" class="t_c">
              <a @click="navComment">{{dashboardData.toReplyProductCommentCount}}</a>
              </Col>
              <Col span="4" class="ivu-form-item-label">
               商家提现(待审核)
              </Col>
              <Col span="4" class="t_c">
              <a @click="navMerchantWithdraw">{{dashboardData.toVerifyMerchantWithdrawCount}}</a>
              </Col>
            </Row>
            <Row style="padding:20px">
              <Col span="4" class="ivu-form-item-label">
               商家提现(待打款)
              </Col>
              <Col span="4" class="t_c">
              <a @click="navMerchantWithdraw">{{dashboardData.toPayMerchantWithdrawCount}}</a>
              </Col>
            </Row>
          </Card>
        </div>
      </Col>
      <Col span="12">
        <div class="hot-product-pannel">
          <Card class="margin-top-20" style="height: 325px">
            <p slot="title">今日爆款</p>
            <Row>
              <Table
                class="table"
                :show-header="false"
                :columns="hotProductColumn"
                :data="hotProductData"
                stripe
              ></Table>
            </Row>
          </Card>
        </div>
      </Col>
      
    </Row>
    <Row>
      <Col span="12">
        <div class="hot-product-pannel">
          <Card class="margin-top-20">
            <p slot="title">商城信息统计</p>
            <Row style="padding:20px">
              <Col span="8" class="t_c">
                <div class="padding-bottom-10 ivu-form-item-value">
                  {{dashboardData.totalUserCount}}
                </div>
                <div class="ivu-form-item-label">
                  会员总数
                </div>
              </Col>
              <Col span="8" class="t_c">
                <div class="padding-bottom-10 ivu-form-item-value">
                  {{dashboardData.totalProductCount}}
                </div>
                <div class="ivu-form-item-label">
                  商品总数
                </div>
              </Col>
              <Col span="8" class="t_c">
                <div class="padding-bottom-10 ivu-form-item-value">
                  {{dashboardData.totalMerchantCount}}
                </div>
                <div class="ivu-form-item-label">
                  商家总数
                </div>
              </Col>
            </Row>
            <Row style="padding:20px">
              <Col span="8" class="t_c">
                <div class="padding-bottom-10 ivu-form-item-value">
                  {{dashboardData.orderCountDay7}}
                </div>
                <div class="ivu-form-item-label">
                  近七天订单数
                </div>
              </Col>
              <Col span="8" class="t_c">
                <div class="padding-bottom-10 ivu-form-item-value">
                  {{dashboardData.orderAmountDay7}}
                </div>
                <div class="ivu-form-item-label">
                  近7天销售额（元）
                </div>
              </Col>
              <Col span="8" class="t_c">
                <div class="padding-bottom-10 ivu-form-item-value">
                  {{dashboardData.afterSaleAmountDay7}}
                </div>
                <div class="ivu-form-item-label">
                  近7天退款金额（元）
                </div>
              </Col>
            </Row>
          </Card>
        </div>
      </Col>
      <Col span="12">
        <div class="hot-product-pannel">
          <Card class="margin-top-20">
            <p slot="title">快捷入口</p>
            <Row style="padding:20px">
              <Col span="6" class="t_c link" @click.native="navPage('productadd')">
                <div class="padding-bottom-10">
                  <Icon type="pricetag" size="27"></Icon>
                </div>
                <div class="ivu-form-item-label">
                  发布商品
                </div>
              </Col>
              <Col span="6" class="t_c link" @click.native="navPage('orderlist')">
                <div class="padding-bottom-10">
                  <Icon type="ios-list" size="27"></Icon>
                </div>
                <div class="ivu-form-item-label">
                  订单列表
                </div>
              </Col>
              <Col span="6" class="t_c link" @click.native="navPage('memberlist')">
                <div class="padding-bottom-10">
                  <Icon type="person" size="27"></Icon>
                </div>
                <div class="ivu-form-item-label">
                  会员管理
                </div>
              </Col>
              <Col span="6" class="t_c link" @click.native="navPage('merchantlist')">
                <div class="padding-bottom-10">
                  <Icon type="ios-home" size="27"></Icon>
                </div>
                <div class="ivu-form-item-label">
                  商家管理
                </div>
              </Col>
            </Row>
            <Row style="padding:20px">
              <Col span="6" class="t_c link" @click.native="navPage('supplierlist')">
                <div class="padding-bottom-10">
                  <Icon type="outlet" size="28"></Icon>
                </div>
                <div class="ivu-form-item-label">
                  供应商管理
                </div>
              </Col>
              <Col span="6" class="t_c link" @click.native="navPage('merchantwithdraw')">
                <div class="padding-bottom-10">
                  <Icon type="social-yen" size="28"></Icon>
                </div>
                <div class="ivu-form-item-label">
                  商家提现
                </div>
              </Col>
              <Col span="6" class="t_c link" @click.native="navPage('userwithdraw')">
                <div class="padding-bottom-10">
                  <Icon type="social-yen" size="28"></Icon>
                </div>
                <div class="ivu-form-item-label">
                  会员提现
                </div>
              </Col>
              <Col span="6" class="t_c link" @click.native="navPage('aftersalelist')">
                <div class="padding-bottom-10">
                  <Icon type="ios-list" size="28"></Icon>
                </div>
                <div class="ivu-form-item-label">
                  售后处理
                </div>
              </Col>
            </Row>
          </Card>
        </div>
      </Col>
    </Row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dashboardData: {},
      dashboardType: "今日运营数据",
      customSearchDate: [],
      dateSearchType: "3",
      merchantSummaryData: {},
      userSummaryData: {},
      spinShow: false,
      hotProductData: [],
      hotProductColumn: [
        {
          title: "",
          key: "productName",
          width: 25,
          align: "left",
          render: (h, params) => {
            var index = params.index;
            if (index == 0)
              return h(
                "Icon",
                {
                  attrs: {
                    type: "lock-combination",
                    color: "#F9D42D",
                    size: "18"
                  }
                },
                ""
              );
            else if (index == 1)
              return h(
                "Icon",
                {
                  attrs: {
                    type: "lock-combination",
                    color: "#D3D3D3",
                    size: "18"
                  }
                },
                ""
              );
            else if (index == 2)
              return h(
                "Icon",
                {
                  attrs: {
                    type: "lock-combination",
                    color: "#F69F50",
                    size: "18"
                  }
                },
                ""
              );
            else return h("Span", {}, index + 1);
          }
        },
        {
          title: "商品",
          key: "productName",
          width: 180,
          align: "left"
        },
        {
          title: "销量",
          key: "productUnit",
          width: 80,
          align: "left",
          render: (h, params) => {
            var index = params.index;
            if (index == 0)
              return h(
                "Tag",
                {
                  attrs: {
                    color: "#F9D42D"
                  }
                },
                params.row.productUnit
              );
            else if (index == 1)
              return h(
                "Tag",
                {
                  attrs: {
                    color: "#D3D3D3"
                  }
                },
                params.row.productUnit
              );
            else if (index == 2)
              return h(
                "Tag",
                {
                  attrs: {
                    color: "#F69F50"
                  }
                },
                params.row.productUnit
              );
            else
              return h(
                "Tag",
                {
                  color: "gray"
                },
                params.row.productUnit
              );
          }
        }
      ]
    };
  },
  methods: {
    navPage(url){
      this.$router.push({
        name: url
      });
    },
    navOrder() {
      this.$router.push({
        name: "orderlist"
      });
    },
    navAfterSale() {
      this.$router.push({
        name: "aftersalelist"
      });
    },
    navComment() {
      this.$router.push({
        name: "comment"
      });
    },
    navWithdraw() {
      this.$router.push({
        name: "userwithdraw"
      });
    },
    navMerchantWithdraw() {
      this.$router.push({
        name: "merchantwithdraw"
      });
    },
    getData() {
      this.spinShow = true;
      this.$http.post("/dashboard", this.common.request({})).then(
        response => {
          this.spinShow = false;
          if (response.data.body.status.statusCode == 0) {
            var data = response.data.body.data;
            this.dashboardData = data;
            this.hotProductData = this.dashboardData.topUnitProductList;
          } else {
            this.$Message.error(response.data.body.status.errorDesc);
          }
        },
        response => {
          this.spinShow = false;
          this.$Message.error("出错了, 请稍后重试");
        }
      );
    }
  },
  mounted() {
    this.getData();
  }
};
</script>
