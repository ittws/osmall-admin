<style lang="less">
@import "../../styles/common.less";
</style>

<template>
  <div>
    <Form :label-width="200">
      <Card>
        <p slot="title">打印机设置(飞鹅云打印机)</p>
        <Row type="flex" justify="start">
          <Col span="12">
            <FormItem label="飞鹅云用户名">
              <Input
                v-model="printSetting.feieUser"
                style="width:80%"
                :maxlength="100"
                placeholder="飞鹅云后台注册用户名"
              />
            </FormItem>
          </Col>
        </Row>
        <Row type="flex" justify="start">
          <Col span="12">
            <FormItem label="飞鹅云UKEY">
              <Input
                v-model="printSetting.feieUkey"
                style="width:80%"
                :maxlength="100"
                placeholder="飞鹅云后台注册账号后生成的UKEY"
              />
            </FormItem>
          </Col>
        </Row>
        <Row type="flex" justify="start">
          <Col span="12">
            <FormItem label="飞鹅云打印机编号">
              <Input
                v-model="printSetting.feieSn"
                style="width:80%"
                :maxlength="100"
                placeholder="飞鹅云打印机编号(打印机底部)"
              />
            </FormItem>
          </Col>
        </Row>
        <Row type="flex" justify="start">
          <Col span="12">
            <FormItem label="飞鹅云打印机密钥">
              <Input
                v-model="printSetting.feieKey"
                style="width:80%"
                :maxlength="100"
                placeholder="飞鹅云打印机密钥(打印机底部)"
              />
            </FormItem>
          </Col>
        </Row>
         <Row type="flex" justify="start">
          <Alert style="display:inline-block" type="warning">请使用配置账户登录飞鹅云管理后台(http://admin.feieyun.com), 并添加配置的打印机</Alert>
        </Row>
        <Button @click="updatePrintSetting" type="primary" size="large" :loading="loading">保存</Button>
      </Card>
    </Form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      printSetting: {}
    };
  },
  methods: {
    updatePrintSetting() {
      this.loading = true;
      this.$http
        .post(
          "/admin/updatePrintSetting",
          this.common.request(this.printSetting)
        )
        .then(
          response => {
            this.loading = false;
            if (response.data.body.status.statusCode == 0) {
              this.$Notice.success({
                title: "成功",
                desc: "打印设置已保存",
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
    getPrintSetting() {
      this.$http
        .post("/admin/getPrintSetting", this.common.request({}))
        .then(
          response => {
            if (response.data.body.status.statusCode == 0) {
              this.printSetting = response.data.body.data;
            }
          },
          response => {}
        );
    }
  },
  created() {},
  mounted() {
    this.getPrintSetting();
  },
  destroyed() {}
};
</script>
<style>

</style>
