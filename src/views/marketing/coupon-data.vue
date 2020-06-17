<style lang="less">
@import "../home/home.less";
@import "../../styles/common.less";
</style>
<template>
  <div class="home-main">
    <Form ref="coupon">
      <Card>
        <p slot="title">优惠券信息</p>
        <Row>
          <Col span="6">
            <FormItem label="优惠券名称">{{coupon.name}}</FormItem>
          </Col>
          <Col span="6">
            <FormItem label="优惠券类型">
              <Span v-if="coupon.type=='CASH'">现金券</Span>
              <Span v-if="coupon.type=='DISCOUNT'">折扣券</Span>
            </FormItem>
          </Col>
        </Row>
      </Card>
    </Form>
    <Row class="margin-top-10">
      <Select v-model="searchUsed" clearable style="width: 150px">
        <Option value>全部</Option>
        <Option value="true">已使用</Option>
        <Option value="false">未使用</Option>
      </Select>
      <Input
        clearable
        type="text"
        v-model="searchUserName"
        placeholder="会员姓名"
        style="width: 150px"
      />
      <Input
        clearable
        type="text"
        v-model="searchUserMobileNo"
        placeholder="会员手机号码"
        style="width: 150px"
      />
      <Button type="primary" @click="searchCouponUser()">搜索</Button>
      <div class="f_r"></div>
    </Row>
    <Card class="margin-top-10">
      <p slot="title">领取详情</p>
      <Row>
        <Table
          :columns="userCouponColumn"
          :data="userCouponData"
          :loading="loading"
          border
          stripe
          ref="userCouponTable"
        ></Table>
      </Row>

      <Row class="margin-top-10">
        <Page
          ref="usercouponpage"
          :total="total"
          size="small"
          :pageSize="pageSize"
          @on-change="changepage"
          show-total
          show-elevator
        ></Page>
      </Row>
    </Card>
  </div>
</template>

<script>
export default {
  name: "home",
  components: {},
  data() {
    return {
      loading: false,
      pageSize: 20,
      startIndex: 0,
      total: 0,
      coupon: {},
      searchUsed: "",
      searchUserName: "",
      searchUserMobileNo: "",
      userCouponData: [],
      userCouponColumn: [
        {
          title: "会员姓名",
          align: "center",
          key: "type",
          width: 200,
          render: (h, params) => {
            return h("Span", {}, params.row.userDTO.name);
          }
        },
        {
          title: "手机号码",
          align: "center",
          key: "type",
          width: 200,
          render: (h, params) => {
            return h("Span", {}, params.row.userDTO.personalPhone);
          }
        },
        {
          title: "领取时间",
          align: "center",
          key: "receiveTime",
          width: 200
        },
        {
          title: "是否使用",
          align: "center",
          width: 200,
          render: (h, params) => {
            var color = "green";
            var text = "未使用";
            if (params.row.used) {
              color = "red";
              text = "已使用";
            }
            return h(
              "Tag",
              {
                attrs: {
                  color: color
                }
              },
              text
            );
          }
        },
        {
          title: "使用时间",
          align: "center",
          key: "useTime",
          width: 200
        }
      ]
    };
  },
  computed: {},
  methods: {
    inquiryCoupon(couponUuid) {
      let that = this;
      let options = {
        couponUuid: couponUuid
      };
      that.$http
        .post("/admin/inquiryCoupon", that.common.request(options))
        .then(
          response => {
            that.loading = false;
            if (response.data.body.status.statusCode == 0) {
              var data = response.data.body.data;
              that.coupon = data;
            } else {
            }
          },
          response => {}
        );
    },
    searchCouponUser(startIndex, pageSize) {
      var keyArray = ["COUPON_UUID"];
      let searchOptions = {
        startIndex: startIndex,
        pageSize: pageSize,
        couponUuid: this.couponUuid
      };
      if (this.searchUsed) {
        keyArray.push("IS_USED");
        searchOptions.used = this.searchUsed;
      }
      if (this.searchUserName) {
        keyArray.push("USER_NAME");
        searchOptions.userName = this.searchUserName;
      }
      if (this.searchUserMobileNo) {
        keyArray.push("USER_MOBILE_NO");
        searchOptions.userMobileNo = this.searchUserMobileNo;
      }
      searchOptions.keyArray = keyArray;
      this.loading = true;
      this.$http
        .post("/admin/searchUserCoupon", this.common.request(searchOptions))
        .then(
          res => {
            this.loading = false;
            if (res.data.body.status.statusCode == 0) {
              var data = res.data.body.data;
              this.userCouponData = data.userCoupons;
              this.total = data.total;
            } else {
              this.$Message.error(res.data.body.status.errorDesc);
            }
          },
          res => {
            this.loading = false;
          }
        );
    },
    //处理分页-页数改变
    changepage(index) {
      var startIndex = (index - 1) * this.pageSize;
      this.searchCouponUser(startIndex, this.pageSize);
    }
  },
  mounted() {
    this.couponUuid = this.$route.params.couponUuid;
    debugger;
    this.inquiryCoupon(this.couponUuid);
    this.searchCouponUser(0, this.pageSize);
  }
};
</script>
