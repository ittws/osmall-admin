<style lang="less">
@import "../../styles/common.less";
</style>

<template>
  <div>
    <Form :label-width="200">
      <Card>
        <p slot="title">积分签到</p>
        <Row type="flex" justify="start">
          <Col span="12">
            <FormItem label="签到奖励">
              <i-switch v-model="signSetting.enabled" size="large">
                <span slot="open">开启</span>
                <span slot="close">关闭</span>
              </i-switch>
            </FormItem>
          </Col>
        </Row>
        <Row type="flex" justify="start">
          <Col span="12">
            <FormItem label="连续签到1天奖励积分">
              <inputNumber v-model="signSetting.day1Point"></inputNumber>&nbsp;&nbsp;
            </FormItem>
          </Col>
        </Row>
        <Row type="flex" justify="start">
          <Col span="12">
            <FormItem label="连续签到2天奖励积分">
              <inputNumber v-model="signSetting.day2Point"></inputNumber>&nbsp;&nbsp;
            </FormItem>
          </Col>
        </Row>
        <Row type="flex" justify="start">
          <Col span="12">
            <FormItem label="连续签到3天奖励积分">
              <inputNumber v-model="signSetting.day3Point"></inputNumber>&nbsp;&nbsp;
            </FormItem>
          </Col>
        </Row>
        <Row type="flex" justify="start">
          <Col span="12">
            <FormItem label="连续签到4天奖励积分">
              <inputNumber v-model="signSetting.day4Point"></inputNumber>&nbsp;&nbsp;
            </FormItem>
          </Col>
        </Row>
        <Row type="flex" justify="start">
          <Col span="12">
            <FormItem label="连续签到5天奖励积分">
              <inputNumber v-model="signSetting.day5Point"></inputNumber>&nbsp;&nbsp;
            </FormItem>
          </Col>
        </Row>
        <Row type="flex" justify="start">
          <Col span="12">
            <FormItem label="连续签到6天奖励积分">
              <inputNumber v-model="signSetting.day6Point"></inputNumber>&nbsp;&nbsp;
            </FormItem>
          </Col>
        </Row>
        <Row type="flex" justify="start">
          <Col span="12">
            <FormItem label="连续签到7天奖励积分">
              <inputNumber v-model="signSetting.day7Point"></inputNumber>&nbsp;&nbsp;
            </FormItem>
          </Col>
        </Row>
        <Row>
              <Col span="10">
                <FormItem label="签到奖励背景图">
                  <div
                    class="upload-list"
                    style="width:240px;height:120px;line-height:120px"
                    v-if="backgroundImage.url"
                  >
                    <template>
                      <img :src="backgroundImage.url" />
                      <div class="upload-list-cover">
                        <Icon type="ios-eye-outline" @click.native="handleView(backgroundImage.url)"></Icon>
                        <Icon type="ios-trash-outline" @click.native="handleBackgroundRemove()"></Icon>
                      </div>
                    </template>
                    <template>
                      <Progress
                        v-if="backgroundImage.showProgress"
                        :percent="backgroundImage.percentage"
                        hide-info
                      ></Progress>
                    </template>
                  </div>
                  <Upload
                    ref="upload"
                    :format="['jpg','jpeg','png']"
                    :show-upload-list="false"
                    :on-success="handleBackgroundSuccess"
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
                </FormItem>
              </Col>
            </Row>
        <Row>
              <Col span="10">
                <FormItem label="活动规则">
                  <div
                    class="upload-list"
                    style="width:240px;height:120px;line-height:120px"
                    v-if="ruleImage.url"
                  >
                    <template>
                      <img :src="ruleImage.url" />
                      <div class="upload-list-cover">
                        <Icon type="ios-eye-outline" @click.native="handleView(ruleImage.url)"></Icon>
                        <Icon type="ios-trash-outline" @click.native="handleRuleRemove()"></Icon>
                      </div>
                    </template>
                    <template>
                      <Progress
                        v-if="ruleImage.showProgress"
                        :percent="ruleImage.percentage"
                        hide-info
                      ></Progress>
                    </template>
                  </div>
                  <Upload
                    ref="upload"
                    :format="['jpg','jpeg','png']"
                    :show-upload-list="false"
                    :on-success="handleRuleSuccess"
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
                  <Modal title="图片预览" v-model="showPreviewImage">
                    <img :src="previewImageUrl" v-if="showPreviewImage" style="width: 100%" />
                    <div slot="footer">
                      <Button type="default" @click="showPreviewImage = false">关闭</Button>
                    </div>
                  </Modal>
                </FormItem>
              </Col>
            </Row>
        
        
        
        <Button @click="updateSignSetting" type="primary" size="large" :loading="loading">保存</Button>
      </Card>
    </Form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      actionName: this.$http.defaults.baseURL + "admin/uploadMediaFile", //上传文件后台地址
      backgroundImage: {}, //签到奖励背景图:
      ruleImage: {},  //签到规则图片
      showPreviewImage: false, //预览图片框
      signSetting: {}
    };
  },
  methods: {
    handleView(previewImageUrl) {
      this.previewImageUrl = previewImageUrl;
      this.showPreviewImage = true;
    },
    handleBackgroundRemove() {
      this.backgroundImage = {};
    },
    handleRuleRemove() {
      this.ruleImage = {};
    },
    handleBackgroundSuccess(res, file) {
      file.url = res.data[0];
      this.backgroundImage = file;
    },
    handleRuleSuccess(res, file) {
      file.url = res.data[0];
      this.ruleImage = file;
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
    },
    updateSignSetting() {
      this.loading = true;
      this.signSetting.backgroundUrl = this.backgroundImage?this.backgroundImage.url:null,
      this.signSetting.ruleUrl = this.ruleImage?this.ruleImage.url:null
      this.$http
        .post(
          "/admin/updateSignSetting",
          this.common.request(this.signSetting)
        )
        .then(
          response => {
            this.loading = false;
            if (response.data.body.status.statusCode == 0) {
              this.$Notice.success({
                title: "成功",
                desc: "积分签到设置已保存",
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
    getSignSetting() {
      this.$http
        .post("/admin/getSignSetting", this.common.request({}))
        .then(
          response => {
            if (response.data.body.status.statusCode == 0) {
              this.signSetting = response.data.body.data;
              this.backgroundImage = {
                url: this.signSetting.backgroundUrl
              };
              this.ruleImage = {
                url: this.signSetting.ruleUrl
              };
            }
          },
          response => {}
        );
    }
  },
  created() {},
  mounted() {
    this.getSignSetting();
  },
  destroyed() {}
};
</script>
<style>

</style>
