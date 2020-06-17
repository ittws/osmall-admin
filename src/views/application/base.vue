<style lang="less">
@import "../../styles/common.less";
</style>

<template>
  <div>
    <!-- <Spin size="large" fix v-if="spinShow" class="mask"></Spin> -->
    <Form :label-width="100">
      <Card>
        <p slot="title">应用设置</p>
        <Row type="flex" justify="start">
          <Col span="12">
            <FormItem label="应用名称">
              <Input
                v-model="application.applicationName"
                style="width:50%"
                placeholder="应用名称在移动端展示, 如电商商城"
              />
            </FormItem>
          </Col>
        </Row>
        <Row type="flex" justify="start">
          <Col span="12">
            <FormItem label="应用域名">
              <Input
                v-model="application.applicationDomainName"
                style="width:50%"
                placeholder="如http://www.baidu.com/, 注意最后面的/"
              />
            </FormItem>
          </Col>
        </Row>
        <Row type="flex" justify="start">
          <Col span="12">
            <FormItem label="版本号">
              <Input
                v-model="application.applicationVersion"
                style="width:50%"
                placeholder="如1.0.3"
              />
            </FormItem>
          </Col>
        </Row>
        <Row type="flex" justify="start">
          <Col span="12">
            <FormItem label="公开注册">
              <i-switch
                v-model="application.applicationPublicRegisterEnabled"
                size="large"
                :true-value="true"
                :false-value="false"
              >
                <span slot="open">开启</span>
                <span slot="close">关闭</span>
              </i-switch>
              <Alert style="display:inline-block" type="warning">如关闭公开注册, 需要邀请码才能注册成为会员。</Alert>
            </FormItem>
          </Col>
        </Row>
        <Row type="flex" justify="start">
          <Col span="12">
            <FormItem label="线下门店">
              <i-switch
                v-model="application.applicationMerchantEnabled"
                size="large"
                :true-value="true"
                :false-value="false"
              >
                <span slot="open">开启</span>
                <span slot="close">关闭</span>
              </i-switch>
              <Alert style="display:inline-block" type="warning">如开启线下门店, 会员购物可选择门店自提。</Alert>
            </FormItem>
          </Col>
        </Row>
        
        <Row>
          <Col span="10">
            <FormItem label="应用Logo">
              <div
                class="upload-list"
                style="width:120px;height:120px;line-height:120px"
                v-if="applicationLogoImage.url"
              >
                <template>
                  <img :src="applicationLogoImage.url" />
                  <div class="upload-list-cover">
                    <Icon
                      type="ios-eye-outline"
                      @click.native="handleView(applicationLogoImage.url)"
                    ></Icon>
                    <Icon type="ios-trash-outline" @click.native="handleRemove()"></Icon>
                  </div>
                </template>
                <template>
                  <Progress
                    v-if="applicationLogoImage.showProgress"
                    :percent="applicationLogoImage.percentage"
                    hide-info
                  ></Progress>
                </template>
              </div>
              <Upload
                ref="upload"
                :format="['jpg','jpeg','png']"
                :show-upload-list="false"
                :on-success="handleSuccess"
                :max-size="1024"
                :on-format-error="handleFormatError"
                :on-exceeded-size="handleMaxSize"
                type="drag"
                :action="actionName"
                style="display: inline-block;width:120px;"
              >
                <div style="width: 120px;height:120px;line-height: 120px;">
                  <Icon type="camera" size="40"></Icon>
                </div>
              </Upload>
              <Alert type="warning">请上传300x300的jpg、jpeg或png图片</Alert>
              <Modal title="图片预览" v-model="showPreviewImage">
                <img :src="previewImageUrl" v-if="showPreviewImage" style="width: 100%" />
                <div slot="footer">
                  <Button type="default" @click="showPreviewImage = false">关闭</Button>
                </div>
              </Modal>
            </FormItem>
          </Col>
        </Row>
        <Row type="flex" justify="start">
          <Col span="12">
            <FormItem label="应用描述">
              <Input
                type="textarea"
                :rows="5"
                v-model="application.applicationDesc"
                style="width:50%"
                placeholder="应用名称在移动端展示"
              />
            </FormItem>
          </Col>
        </Row>
        <Button @click="updateApplication" type="primary" size="large" :loading="loading">保存</Button>
      </Card>
      <Modal title="图片预览" v-model="showPreviewImage">
        <img :src="previewImageUrl" v-if="showPreviewImage" style="width: 100%" />
        <div slot="footer">
          <Button type="default" @click="showPreviewImage = false">关闭</Button>
        </div>
      </Modal>
    </Form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      showPreviewImage: false, //预览优惠券图片
      applicationLogoImage: {}, //优惠券图片
      actionName: this.$http.defaults.baseURL + "admin/uploadMediaFile", //上传文件后台地址
      application: {}
    };
  },
  methods: {
    updateApplication() {
      this.loading = true;
      this.application.applicationLogo = this.applicationLogoImage.url;
      this.$http
        .post(
          "/admin/updateGlobalApplicationSetting",
          this.common.request(this.application)
        )
        .then(
          response => {
            this.loading = false;
            if (response.data.body.status.statusCode == 0) {
              this.$Notice.success({
                title: "成功",
                desc: "基础设置已保存",
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
        .post("/getGlobalApplicationSetting", this.common.request({}))
        .then(
          response => {
            if (response.data.body.status.statusCode == 0) {
              this.application = response.data.body.data;
              this.applicationLogoImage = {
                url: this.application.applicationLogo
              };
            }
          },
          response => {}
        );
    },
    handleView(previewImageUrl) {
      this.previewImageUrl = previewImageUrl;
      this.showPreviewImage = true;
    },
    handleRemove() {
      this.applicationLogoImage = {};
    },
    handleSuccess(res, file) {
      file.url = res.data[0];
      this.applicationLogoImage = file;
    },
    handleMaxSize(file) {
      this.$Notice.warning({
        title: "文件过大",
        desc: "文件大小不能超过1M."
      });
    },
    handleFormatError(file) {
      this.$Notice.warning({
        title: "文件格式错误",
        desc: "上传文件格式错误, 请选择jpg, jpeg 或 png的图片."
      });
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
