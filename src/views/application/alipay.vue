<style lang="less">
@import "../../styles/common.less";
</style>

<template>
  <div>
    <Form :label-width="200">
      <Card>
        <p slot="title">支付宝支付参数设置</p>
        <Row type="flex" justify="start">
          <Col span="12">
            <FormItem label="APP ID">
              <Input
                v-model="application.alipayAppId"
                style="width:80%"
                :maxlength="100"
                placeholder="支付宝开放平台申请的APP ID"
              />
            </FormItem>
          </Col>
        </Row>
        <Row type="flex" justify="start">
          <Col span="12">
            <FormItem label="应用私钥">
              <Input
                v-model="application.alipayPrivateKey"
                style="width:80%"
                :maxlength="2000"
                placeholder="应用私钥(应用公钥配置在蚂蚁开放平台)"
              />
            </FormItem>
          </Col>
        </Row>
        <Row type="flex" justify="start">
          <Col span="12">
            <FormItem label="支付宝公钥">
              <Input
                v-model="application.alipayPublicKey"
                style="width:80%"
                :maxlength="2000"
                placeholder="蚂蚁开放平台提供给应用下载的公钥"
              />
            </FormItem>
          </Col>
        </Row>
        <Row type="flex" justify="start">
          <Col span="12">
            <FormItem label="支付回调地址">
              <Input
                v-model="application.alipayNotifyUrl"
                style="width:80%"
                :maxlength="100"
                placeholder="支付完成后的回调地址, 如http://www.ccmao.net/alipayResponse"
              />
            </FormItem>
          </Col>
        </Row>
        <Button @click="updateApplication" type="primary" size="large" :loading="loading">保存</Button>
      </Card>
    </Form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      application: {}
    };
  },
  methods: {
    updateApplication() {
      this.loading = true;
      this.$http
        .post(
          "/admin/updateGlobalAlipaySetting",
          this.common.request(this.application)
        )
        .then(
          response => {
            this.loading = false;
            if (response.data.body.status.statusCode == 0) {
              this.$Notice.success({
                title: "成功",
                desc: "支付宝设置已保存",
                duration: 2
              });
            } else {
              this.$Message.error(response.data.body.status.errorDesc);
            }
          },
          response => {
            this.loading = false;
          }
        );
    },
    getApplication() {
      this.$http
        .post("/admin/getGlobalAlipaySetting", this.common.request({}))
        .then(
          response => {
            if (response.data.body.status.statusCode == 0) {
              this.application = response.data.body.data;
            }
          },
          response => {}
        );
    }
  },
  created() {},
  mounted() {
    this.getApplication();
  },
  destroyed() {}
};
</script>
<style>

</style>
