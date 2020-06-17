<style lang="less">
@import "../../styles/common.less";
</style>

<template>
  <div>
    <Form :label-width="200">
      <Card>
        <p slot="title">微信支付参数设置</p>
        <Row type="flex" justify="start">
          <Col span="12">
            <FormItem label="商户号">
              <Input
                v-model="application.wechatMerchantId"
                style="width:80%"
                :maxlength="100"
                placeholder="微信商户平台申请的商户号"
              />
            </FormItem>
          </Col>
        </Row>
        <Row type="flex" justify="start">
          <Col span="12">
            <FormItem label="公众号APP ID">
              <Input
                v-model="application.wechatAppIdOfficialAccount"
                style="width:80%"
                :maxlength="100"
                placeholder="微信公众平台申请的公众号APP ID"
              />
            </FormItem>
          </Col>
        </Row>
        <Row type="flex" justify="start">
          <Col span="12">
            <FormItem label="公众号APP SECRET">
              <Input
                v-model="application.wechatAppSecretOfficialAccount"
                style="width:80%"
                :maxlength="100"
                placeholder="微信公众平台申请的公众号APP SECRET"
              />
            </FormItem>
          </Col>
        </Row>
        <Row type="flex" justify="start">
          <Col span="12">
            <FormItem label="小程序APP ID">
              <Input
                v-model="application.wechatAppIdMiniProgram"
                style="width:80%"
                :maxlength="100"
                placeholder="微信公众平台申请的小程序APP ID"
              />
            </FormItem>
          </Col>
        </Row>
        <Row type="flex" justify="start">
          <Col span="12">
            <FormItem label="小程序APP SECRET">
              <Input
                v-model="application.wechatAppSecretMiniProgram"
                style="width:80%"
                :maxlength="100"
                placeholder="微信公众平台申请的小程序APP SECRET"
              />
            </FormItem>
          </Col>
        </Row>
        <Row type="flex" justify="start">
          <Col span="12">
            <FormItem label="商户平台API密钥">
              <Input
                v-model="application.wechatApiKey"
                style="width:80%"
                :maxlength="100"
                placeholder="商户平台申请的API密钥"
              />
            </FormItem>
          </Col>
        </Row>
        <Row type="flex" justify="start">
          <Col span="12">
            <FormItem label="支付回调地址">
              <Input
                v-model="application.wechatNotifyUrl"
                style="width:80%"
                :maxlength="100"
                placeholder="支付完成后的回调地址, 如http://www.ccmao.net/wechatPayResponse"
              />
            </FormItem>
          </Col>
        </Row>
        <Row type="flex" justify="start">
          <Col span="12">
            <FormItem label="退款回调地址">
              <Input
                v-model="application.wechatRefundNotifyUrl"
                style="width:80%"
                :maxlength="100"
                placeholder="退款完成后的回调地址, 如http://www.ccmao.net/wechatRefundResponse"
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
          "/admin/updateGlobalWechatSetting",
          this.common.request(this.application)
        )
        .then(
          response => {
            this.loading = false;
            if (response.data.body.status.statusCode == 0) {
              this.$Notice.success({
                title: "成功",
                desc: "微信设置已保存",
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
        .post("/admin/getGlobalWechatSetting", this.common.request({}))
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
