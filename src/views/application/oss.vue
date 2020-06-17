<style lang="less">
@import "../../styles/common.less";
</style>

<template>
  <div>
    <Form :label-width="200">
      <Card>
        <p slot="title">阿里云OSS参数设置(图片,音视频都存储在云端)</p>
        <Row type="flex" justify="start">
          <Col span="12">
            <FormItem label="ACCESS ID">
              <Input
                v-model="application.ossAccessId"
                style="width:80%"
                :maxlength="100"
                placeholder="阿里云控制台申请OSS后获取的ACCESS ID"
              />
            </FormItem>
          </Col>
        </Row>
        <Row type="flex" justify="start">
          <Col span="12">
            <FormItem label="ACCESS KEY">
              <Input
                v-model="application.ossAccessKey"
                style="width:80%"
                :maxlength="100"
                placeholder="阿里云控制台申请OSS后获取的ACCESS ID"
              />
            </FormItem>
          </Col>
        </Row>
        <Row type="flex" justify="start">
          <Col span="12">
            <FormItem label="End Point Url">
              <Input
                v-model="application.ossEndPoint"
                style="width:80%"
                :maxlength="100"
                placeholder="阿里云控制台申请OSS后获取的URL,如oss-cn-shenzhen.aliyuncs.com"
              />
            </FormItem>
          </Col>
        </Row>
        <Row type="flex" justify="start">
          <Col span="12">
            <FormItem label="Bucket Name">
              <Input
                v-model="application.ossBucketName"
                style="width:80%"
                :maxlength="100"
                placeholder="阿里云控制台申请OSS后获取的bucket名称, 如ccm"
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
          "/admin/updateGlobalOssSetting",
          this.common.request(this.application)
        )
        .then(
          response => {
            this.loading = false;
            if (response.data.body.status.statusCode == 0) {
              this.$Notice.success({
                title: "成功",
                desc: "存储设置已保存",
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
        .post("/admin/getGlobalOssSetting", this.common.request({}))
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
