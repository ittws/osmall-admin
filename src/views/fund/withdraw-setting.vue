<style lang="less">
@import "../../styles/common.less";
</style>

<template>
  <div>
    <!-- <Spin size="large" fix v-if="spinShow" class="mask"></Spin> -->
    <Form :label-width="100">
      <Card>
        <p slot="title">提现手续费</p>
        <Row type="flex" justify="start">
          <Col span="4">
            <FormItem label="手续费率:">
              %
              <InputNumber
                v-model="taxRate"
                style="width:80%"
                :min="0"
                :max="100"
                placeholder="会员提现时授权的手续费"
              >
              </InputNumber>
            </FormItem>
          </Col>
          <Col span="8">
          <Alert style="display:inline-block" type="info">设置为0表示不收取手续费</Alert>
          </Col>
        </Row>
        <Button type="primary" size="large" @click="changeTaxRateSetting()" :loading="loading">保存</Button>
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
      taxRate: 0
    };
  },
  methods: {
    changeTaxRateSetting() {
      this.loading = true;
      let options = {
        settings: [
          {
            name: "TAX_RATE",
            value: this.taxRate
          }
        ]
      };
      this.$http.post("/admin/changeParameter", this.common.request(options)).then(
        response => {
          this.loading = false;
          if (response.data.body.status.statusCode == 0) {
            var data = response.data.body.data;
            this.$Notice.success({
              desc: "已经成功保存提现手续费参数",
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
              this.taxRate = Number(response.data.body.data.value);
          }
        },
        response => {}
      );
    }
  },
  created() {},
  mounted() {
    this.inquiryParameter("TAX_RATE");
  },
  destroyed() {}
};
</script>
<style>

</style>
