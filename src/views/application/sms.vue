<style lang="less">
@import "../../styles/common.less";
</style>

<template>
  <div>
    <Form :label-width="200">
      <Card>
        <p slot="title">短信验证码参数设置(阿里云)</p>
        <Row type="flex" justify="start">
          <Col span="12">
            <FormItem label="ACCESS ID">
              <Input
                v-model="application.smsAccessId"
                style="width:80%"
                :maxlength="100"
                placeholder="阿里云控制台申请短信服务后获取的ACCESS ID"
              />
            </FormItem>
          </Col>
        </Row>
        <Row type="flex" justify="start">
          <Col span="12">
            <FormItem label="ACCESS KEY">
              <Input
                v-model="application.smsAccessKey"
                style="width:80%"
                :maxlength="100"
                placeholder="阿里云控制台申请短信服务后获取的ACCESS ID"
              />
            </FormItem>
          </Col>
        </Row>
        <Row type="flex" justify="start">
          <Col span="12">
            <FormItem label="短信签名">
              <Input
                v-model="application.smsSignName"
                style="width:80%"
                :maxlength="100"
                placeholder="短信签名(该签名需在阿里云控制台配置)"
              />
            </FormItem>
          </Col>
        </Row>
        <Row type="flex" justify="start">
          <Col span="12">
            <FormItem label="短信验证码模板ID">
              <Input
                v-model="application.smsTemplateCode"
                style="width:80%"
                :maxlength="100"
                placeholder="发送验证码的模板ID(该模板需在阿里云控制台配置)"
              />
            </FormItem>
          </Col>
        </Row>
        <Row type="flex" justify="start">
          <Col span="12">
            <FormItem label="商家入驻审核通过模板ID">
              <Input
                v-model="application.smsTemplateCodeApplicationApproved"
                style="width:80%"
                :maxlength="100"
                placeholder="商家入驻审核通过的模板ID(该模板需在阿里云控制台配置)"
              />
            </FormItem>
          </Col>
        </Row>
        <Row type="flex" justify="start">
          <Col span="12">
            <FormItem label="商家入驻审核未通过模板ID">
              <Input
                v-model="application.smsTemplateCodeApplicationRejected"
                style="width:80%"
                :maxlength="100"
                placeholder="商家入驻审核未通过的模板ID(该模板需在阿里云控制台配置)"
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
          "/admin/updateGlobalSmsSetting",
          this.common.request(this.application)
        )
        .then(
          response => {
            this.loading = false;
            if (response.data.body.status.statusCode == 0) {
              this.$Notice.success({
                title: "成功",
                desc: "短信设置已保存",
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
        .post("/admin/getGlobalSmsSetting", this.common.request({}))
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
