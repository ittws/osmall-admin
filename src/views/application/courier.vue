<style lang="less">
@import "../../styles/common.less";
</style>

<template>
  <div>
    <!-- <Spin size="large" fix v-if="spinShow" class="mask"></Spin> -->
    <Form :label-width="100">
      <Card>
        <p slot="title">物流设置</p>
        <Row type="flex" justify="start">
          <Col span="24">
          <Alert style="display:inline-block" type="info">请在阿里云市场购买指定快递物流查询服务, 购买后将获取的AppCode填入并保存, 购买地址<a target="_blank" href="https://market.aliyun.com/products/56928004/cmapi021863.html"> https://market.aliyun.com/products/56928004/cmapi021863.html</a></Alert>
          </Col>
        </Row>
        <Row type="flex" justify="start">
          <Col span="12">
            <FormItem label="AppCode">
              <Input
                v-model="courierAppCode"
                style="width:80%"
                :maxlength="100"
                placeholder="购买快递物流服务后获取的AppCode"
              />
            </FormItem>
          </Col>
        </Row>
        <Button type="primary" size="large" @click="changeCourierSetting()" :loading="loading">保存</Button>
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
      courierAppCode: ''
    };
  },
  methods: {
    changeCourierSetting() {
      this.loading = true;
      let options = {
        settings: [
          {
            name: "COURIER_APP_CODE",
            value: this.courierAppCode
          }
        ]
      };
      this.$http.post("/admin/changeParameter", this.common.request(options)).then(
        response => {
          this.loading = false;
          if (response.data.body.status.statusCode == 0) {
            var data = response.data.body.data;
            this.$Notice.success({
              desc: "已经成功保存物流参数",
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
              this.courierAppCode = response.data.body.data.value;
          }
        },
        response => {}
      );
    }
  },
  created() {},
  mounted() {
    this.inquiryParameter("COURIER_APP_CODE");
  },
  destroyed() {}
};
</script>
<style>

</style>
