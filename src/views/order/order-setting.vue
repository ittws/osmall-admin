<style lang="less">
@import "../../styles/common.less";
</style>

<template>
  <div>
    <!-- <Spin size="large" fix v-if="spinShow" class="mask"></Spin> -->
    <Form :label-width="100">
      <Card>
        <p slot="title">订单设置</p>
        <Row type="flex" justify="start">
          <Col span="11">
            <FormItem>
              订单&nbsp;&nbsp;&nbsp;
              <InputNumber v-model="orderAutoCancelDays" style="width:12%"/>&nbsp;&nbsp;&nbsp;天不付款自动取消
            </FormItem>
            <FormItem>
              发货后&nbsp;&nbsp;&nbsp;
              <InputNumber v-model="orderAutoConfirmDays" style="width:12%"/>&nbsp;&nbsp;&nbsp;天自动收货
            </FormItem>
            <FormItem>
              收货后&nbsp;&nbsp;&nbsp;
              <InputNumber v-model="orderAutoEvaluateDays" style="width:12%"/>&nbsp;&nbsp;&nbsp;天自动评价
            </FormItem>
          </Col>
        </Row>
        <Button type="primary" size="large" @click="changeOrderSetting()" :loading="loading">保存</Button>
      </Card>
    </Form>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      loading: false,
      orderAutoCancelDays: 1,
      orderAutoConfirmDays: 7,
      orderAutoEvaluateDays: 7
    };
  },
  methods: {
    changeOrderSetting() {
      this.loading = true;
      let options = {
        settings: [
          {
            name: "ORDER_AUTO_CANCEL",
            value: this.orderAutoCancelDays
          },
          {
            name: "ORDER_AUTO_CONFIRM",
            value: this.orderAutoConfirmDays
          },{
            name: "ORDER_AUTO_EVALUATE",
            value: this.orderAutoEvaluateDays
          },
        ]
      };

      this.$http.post("/admin/changeParameter", this.common.request(options)).then(
        response => {
          this.loading = false;
          if (response.data.body.status.statusCode == 0) {
            var data = response.data.body.data;
            this.$Notice.success({
              desc: "已经成功保存参数",
              duration: 2
            });
          } else {
            this.$Notice.success({
              title: "失败",
              desc: response.data.body.status.errorDesc,
              duration: 2
            });
          }
        },
        response => {
          this.loading = false;
          this.$Message.error("出错了，请稍后重试");
        }
      );
    },
    inquiryParameter(name) {
      let options = {
        name: name
      };
      this.$http.post("/inquiryParameter", this.common.request(options)).then(
        response => {
          if (response.data.body.status.statusCode == 0) {
            if(name==='ORDER_AUTO_CANCEL')
                this.orderAutoCancelDays = Number(response.data.body.data.value);
            if(name==='ORDER_AUTO_CONFIRM')
                this.orderAutoConfirmDays = Number(response.data.body.data.value);
            if(name==='ORDER_AUTO_EVALUATE')
                this.orderAutoEvaluateDays = Number(response.data.body.data.value);
          }
        },
        response => {}
      );
    }
  },
  created() {},
  mounted() {
    this.inquiryParameter("ORDER_AUTO_CANCEL");
    this.inquiryParameter("ORDER_AUTO_CONFIRM");
    this.inquiryParameter("ORDER_AUTO_EVALUATE");
  },
  destroyed() {}
};
</script>
<style>
.demo-upload-list {
  display: inline-block;
  width: 160px;
  height: 160px;
  text-align: center;
  line-height: 60px;
  border: 1px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  position: relative;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  margin-right: 4px;
}
.demo-upload-list img {
  width: 100%;
  height: 100%;
}
.demo-upload-list-cover {
  display: none;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
}
#inputalss {
  margin: 0px 110px;
}
.demo-upload-list:hover .demo-upload-list-cover {
  display: block;
}
.demo-upload-list-cover i {
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  margin: 60px 2px;
}
.titles {
  float: left;
  font-weight: 500;
  margin-right: 15px;
  letter-spacing: 1px;
}
.Submissioncss {
  margin-left: 30px;
}
.Button1 {
  height: 25px;
  width: 50px;
  text-align: center;
  line-height: 10px;
}
</style>
