<style lang="less">
@import "../../styles/common.less";
</style>

<template>
  <div>
    <Form ref="group" :model="group" :label-width="120" :rules="rules">
      <Card>
        <p slot="title">商品组信息</p>
        <Row>
          <Col span="24">
            <Row type="flex" justify="start">
              <Col span="6">
                <FormItem label="商品组名称" prop="groupName">
                  <Input
                    :maxlength="45"
                    v-model="group.groupName"
                    style="width:250px"
                    placeholder="请输入商品组名称"
                  ></Input>
                </FormItem>
              </Col>
            </Row>
            <Row type="flex" justify="start">
              <Col span="12">
                <FormItem label="排序">
                  <InputNumber
                    :min="1"
                    v-model="group.sortNumber"
                    style="width:250px"
                    placeholder="商品组排序"
                  ></InputNumber>
                </FormItem>
              </Col>
            </Row>
            <FormItem label="首页显示">
              <Row type="flex" justify="start">
                <Col span="12">
                  <i-switch
                    v-model="group.displayedHome"
                    size="large"
                    :true-value="true"
                    :false-value="false"
                  >
                    <span slot="open">是</span>
                    <span slot="close">否</span>
                  </i-switch>
                </Col>
              </Row>
            </FormItem>
            <FormItem label="会员注册专用">
              <Row type="flex" justify="start">
                <Col span="18">
                  <i-switch
                    v-model="group.register"
                    size="large"
                    :true-value="true"
                    :false-value="false"
                  >
                    <span slot="open">是</span>
                    <span slot="close">否</span>
                  </i-switch>
                  <Alert style="display:inline-block">该商品组商品用于用户付费会员注册时购买！</Alert>
                </Col>
              </Row>
            </FormItem>
            <Row type="flex" justify="start">
              <Col span="6">
                <FormItem label="描述">
                  <Input
                    :maxlength="100"
                    type="textarea"
                    :rows="5"
                    v-model="group.groupDescription"
                    placeholder="请输入商品组描述"
                  ></Input>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="24">
                <Row type="flex" justify="start">
                  <Col span="10">
                    <FormItem label="包含商品">
                      <Select
                        v-model="groupProducts"
                        multiple
                        filterable
                        remote
                        :remote-method="searchProduct"
                        placeholder="输入关键字搜索商品"
                      >
                        <Option
                          v-for="(option, index) in products"
                          :value="option.productUuid"
                          :label="option.productName"
                          :key="option.productUuid"
                        >{{option.productName}}</Option>
                      </Select>
                    </FormItem>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row>
              <Col span="10">
                <FormItem label="背景图片">
                  <div
                    class="upload-list"
                    style="width:240px;height:120px;line-height:120px"
                    v-if="groupImage.url"
                  >
                    <template>
                      <img :src="groupImage.url" />
                      <div class="upload-list-cover">
                        <Icon type="ios-eye-outline" @click.native="handleView(groupImage.url)"></Icon>
                        <Icon type="ios-trash-outline" @click.native="handleRemove()"></Icon>
                      </div>
                    </template>
                    <template>
                      <Progress
                        v-if="groupImage.showProgress"
                        :percent="groupImage.percentage"
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
                  <Alert type="warning">请上传700x300的jpg、jpeg或png图片</Alert>
                  <Modal title="图片预览" v-model="showPreviewImage">
                    <img :src="previewImageUrl" v-if="showPreviewImage" style="width: 100%" />
                    <div slot="footer">
                      <Button type="default" @click="showPreviewImage = false">关闭</Button>
                    </div>
                  </Modal>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="10">
                <FormItem label="图标">
                  <div
                    class="upload-list"
                    style="width:78px;height:78px;line-height:78px"
                    v-if="iconImage.url"
                  >
                    <template>
                      <img :src="iconImage.url" />
                      <div class="upload-list-cover">
                        <Icon type="ios-eye-outline" @click.native="handleView(iconImage.url)"></Icon>
                        <Icon type="ios-trash-outline" @click.native="handleIconRemove()"></Icon>
                      </div>
                    </template>
                    <template>
                      <Progress
                        v-if="iconImage.showProgress"
                        :percent="iconImage.percentage"
                        hide-info
                      ></Progress>
                    </template>
                  </div>
                  <Upload
                    ref="upload"
                    :format="['jpg','jpeg','png']"
                    :show-upload-list="false"
                    :on-success="handleIconSuccess"
                    :max-size="1024"
                    :on-format-error="handleFormatError"
                    :on-exceeded-size="handleMaxSize"
                    type="drag"
                    :action="actionName"
                    style="display: inline-block;width:78px;"
                  >
                    <div style="width: 78px;height:78px;line-height: 78px;">
                      <Icon type="camera" size="40"></Icon>
                    </div>
                  </Upload>
                  <Alert type="warning">请上传78x78的jpg、jpeg或png图片</Alert>
                  <Modal title="图片预览" v-model="showPreviewImage">
                    <img :src="previewImageUrl" v-if="showPreviewImage" style="width: 100%" />
                    <div slot="footer">
                      <Button type="default" @click="showPreviewImage = false">关闭</Button>
                    </div>
                  </Modal>
                </FormItem>
              </Col>
            </Row>
          </Col>
        </Row>
      </Card>
    </Form>

    <div class="margin-top-10">
      <Button size="large" type="default" @click="back()" class="margin-right-10">返回</Button>
      <Button
        type="primary"
        size="large"
        :loading="loading"
        @click="addGroup('group',false)"
        icon="checkmark"
      >保存</Button>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      groupProducts: [], //商品组适用商品
      products: [], //商品组使用商品查询
      group: {
        groupName: "",
        groupDescription: "",
        displayedHome: false,
        register: false,
        sortNumber: 100
      },
      actionName: this.$http.defaults.baseURL + "admin/uploadMediaFile", //上传文件后台地址
      showPreviewImage: false, //预览商品组图片
      groupImage: {}, //商品组背景图:
      iconImage: {},  //商品组图标
      loading: false,
      rules: {
        groupName: [{ required: true, message: "商品组名称", trigger: "blur" }]
      }
    };
  },
  methods: {
    searchProduct(name) {
      let searchOptions = {
        keyArray: ["ON_SALE", "PRODUCT_NAME"],
        productName: name,
        onSale: true,
        startIndex: 0,
        pageSize: 10
      };
      this.$http
        .post("/admin/searchProduct", this.common.request(searchOptions))
        .then(
          res => {
            if (res.data.body.status.statusCode == 0) {
              var data = res.data.body.data;
              this.products = data.products;
            } else {
              this.$Message.error(res.data.body.status.errorDesc);
            }
          },
          res => {}
        );
    },
    back() {
      this.$router.go(-1);
    },
    addGroup(groupForm, active) {
      var that = this;
      this.$refs[groupForm].validate(valid => {
        if (valid) {
          if (that.groupProducts.length == 0) {
            that.$Message.error("未指定商品组商品");
            return;
          }
          let options = {
            actionType: "ADD",
            groupName: that.group.groupName,
            groupDescription: that.group.groupDescription,
            sortNumber: that.group.sortNumber,
            displayedHome: that.group.displayedHome,
            register: that.group.register,
            backgroundUrl: that.groupImage?that.groupImage.url:null,
            iconUrl: that.iconImage?that.iconImage.url:null
          };
          
          //编辑模式
          if (this.editMode) {
            options.actionType = "MODIFY";
            options.groupUuid = this.groupUuid;
          }
          //指定商品使用
          var productList = [];
          //将指定的商品转化为后台需要的格式
          that.groupProducts.forEach(function(val, index) {
            var product = {
              productUuid: val
            };
            productList.push(product);
          });
          options.productList = productList;
          this.loading = true;
          this.$http
            .post("/admin/changeProductGroup", this.common.request(options))
            .then(
              response => {
                this.loading = false;
                if (response.data.body.status.statusCode == 0) {
                  var data = response.data.body.data;
                  this.$Notice.success({
                    title: "成功",
                    desc: "商品组已保存",
                    duration: 2
                  });
                  this.$router.push({
                    name: "productgroup"
                  });
                } else {
                  this.$Message.error(response.data.body.status.errorDesc);
                }
              },
              response => {
                this.loading = false;
                this.$Message.error("保存失败，请检查各项是否填写正确");
              }
            );
        }
      });
    },
    inquirygroup(groupUuid) {
      let that = this;
      let options = {
        groupUuid: groupUuid
      };
      that.$http.post("/admin/inquiryProductGroup", that.common.request(options)).then(
        response => {
          that.loading = false;
          if (response.data.body.status.statusCode == 0) {
            var data = response.data.body.data;
            that.group = data;
            //编辑模式, 初始化背景及图标图片
            that.groupImage = {
              url: that.group.backgroundUrl
            };
            that.iconImage = {
              url: that.group.iconUrl
            };
            //编辑模式, 初始化商品组适用商品
            that.products = that.group.productList; //下拉列表包含已选中的商品
            var groupProducts = [];
            that.products.forEach(function(val,index){
              groupProducts.push(val.productUuid);
            })
            this.groupProducts = groupProducts;
          } else {
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
      this.groupImage = {};
    },
    handleIconRemove() {
      this.iconImage = {};
    },
    handleSuccess(res, file) {
      file.url = res.data[0];
      this.groupImage = file;
    },
    handleIconSuccess(res, file) {
      file.url = res.data[0];
      this.iconImage = file;
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
  created() {
    this.groupUuid = this.$route.params.groupUuid;
    if (this.groupUuid) {
      this.editMode = true;
      this.inquirygroup(this.groupUuid);
    } else {
      this.searchProduct("");
    }
  }
};
</script>
