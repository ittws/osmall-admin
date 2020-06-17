<style lang="less">
@import "../../styles/common.less";
</style>

<template>
  <div>
    <Form ref="coupon" :model="coupon" :label-width="120" :rules="rules">
      <Card>
        <p slot="title">基础信息</p>
        <Row>
          <Col span="24">
            <Row type="flex" justify="start">
              <Col span="6">
                <FormItem label="优惠券名称" prop="name">
                  <Input v-model="coupon.name" style="width:250px" placeholder="请输入优惠券名称"></Input>
                </FormItem>
              </Col>
            </Row>
            <Row type="flex" justify="start">
              <Col span="6">
                <FormItem label="类型">
                  <Select clearable v-model="coupon.type" style="width:250px">
                    <Option value="DISCOUNT">折扣券</Option>
                    <Option value="CASH">现金券</Option>
                  </Select>
                </FormItem>
              </Col>
            </Row>
            <Row type="flex" justify="start">
              <Col span="6">
                <FormItem label="优惠金额" v-if="coupon.type==='CASH'">
                  <InputNumber :min="0" v-model="coupon.benefitCash" style="width:250px"></InputNumber>&nbsp;元
                </FormItem>
                <FormItem label="折扣比例(%)" v-if="coupon.type==='DISCOUNT'">
                  <InputNumber
                    :min="0"
                    :max="100"
                    v-model="coupon.benefitDiscount"
                    style="width:220px"
                  ></InputNumber>&nbsp;
                  <Tooltip content="如设置为90%表示9折">
                    <Icon type="help"></Icon>
                  </Tooltip>
                </FormItem>
              </Col>
              <Col span="6">
                <FormItem label="满">
                  <InputNumber :min="0" v-model="coupon.conditionAmount" style="width:150px"></InputNumber>&nbsp;元可用&nbsp;
                  <Tooltip content="如设置为0表示购买任意金额可用%表示9折">
                    <Icon type="help"></Icon>
                  </Tooltip>
                </FormItem>
              </Col>
            </Row>
            <Row type="flex" justify="start">
              <Col span="12">
                <FormItem label="有效期">
                  <RadioGroup v-model="coupon.validType">
                    <Radio label="1">
                      <span>指定有效期</span>
                    </Radio>
                    <Radio label="2">
                      <span>领取后几天内有效</span>
                    </Radio>
                  </RadioGroup>
                </FormItem>
                <FormItem v-if="coupon.validType==='1'">
                  <DatePicker v-model="coupon.startDate" type="date" placeholder="开始日期"></DatePicker>&nbsp;&nbsp;到&nbsp;&nbsp;
                  <DatePicker v-model="coupon.endDate" type="date" placeholder="结束日期"></DatePicker>
                </FormItem>
                <FormItem v-if="coupon.validType==='2'">
                  <InputNumber :min="1" v-model="coupon.validDays" style="width:100px"></InputNumber>&nbsp;天内有效
                </FormItem>
              </Col>
            </Row>
            <Row type="flex" justify="start">
              <Col span="6">
                <FormItem label="优惠券描述">
                  <Input
                    type="textarea"
                    :rows="5"
                    v-model="coupon.memo"
                    placeholder="请输入优惠券描述, 会员将在手机端看到该描述"
                  ></Input>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="10">
                <FormItem label="优惠券图片">
                  <div
                    class="upload-list"
                    style="width:240px;height:120px;line-height:120px"
                    v-if="couponImage.url"
                  >
                    <template>
                      <img :src="couponImage.url" />
                      <div class="upload-list-cover">
                        <Icon type="ios-eye-outline" @click.native="handleView(couponImage.url)"></Icon>
                        <Icon type="ios-trash-outline" @click.native="handleRemove()"></Icon>
                      </div>
                    </template>
                    <template>
                      <Progress
                        v-if="couponImage.showProgress"
                        :percent="couponImage.percentage"
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
          </Col>
        </Row>
      </Card>
      <Card class="margin-top-10">
        <p slot="title">优惠券数量</p>
        <Row>
          <Col span="24">
            <Row type="flex" justify="start">
              <Col span="8">
                <FormItem label="发行总量(张)" prop="totalCount">
                  <inputNumber :min="1" v-model="coupon.totalCount"></inputNumber>
                  <Alert type="warning">优惠券创建后, 发行总量只能增加不能减少, 请谨慎设置</Alert>
                </FormItem>
              </Col>
              <Col span="5" offset="2">
                <FormItem label="每人限领(张)" prop="limitPerUser">
                  <inputNumber :min="1" v-model="coupon.limitPerUser"></inputNumber>
                </FormItem>
              </Col>
            </Row>
          </Col>
        </Row>
      </Card>
      <Card class="margin-top-10">
        <p slot="title">使用范围</p>
        <Row>
          <Col span="24">
            <Row type="flex" justify="start">
              <Col span="6">
                <FormItem label="使用范围">
                  <RadioGroup v-model="coupon.benefitType">
                    <Radio label="0">
                      <span>全场通用</span>
                    </Radio>
                    <Radio label="1">指定商品</Radio>
                  </RadioGroup>
                </FormItem>
              </Col>
              <Col span="10" offsite="2" v-if="coupon.benefitType=='1'">
                <Select
                  v-model="couponProducts"
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
        @click="addCoupon('coupon',false)"
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
      couponProducts: [], //优惠券适用商品
      products: [], //优惠券使用商品查询
      coupon: {
        type: "CASH",
        validType: "1",
        validDays: 30,
        benefitType: "0",
        benefitCash: 5,
        benefitDiscount: 90,
        conditionAmount: 100,
        totalCount: 500,
        limitPerUser: 1
      },
      actionName: this.$http.defaults.baseURL + "admin/uploadMediaFile", //上传文件后台地址
      showPreviewImage: false, //预览优惠券图片
      couponImage: {}, //优惠券图片
      loading: false,
      rules: {
        name: [{ required: true, message: "优惠券名称", trigger: "blur" }],
        type: [{ required: true, message: "优惠券类型必填", trigger: "blur" }],
        validType: [
          { required: true, message: "优惠券有效期必选", trigger: "blur" }
        ],
        benefitType: [
          { required: true, message: "优惠券使用范围必选", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    searchProduct(name) {
      let searchOptions = {
        keyArray: ["ON_SALE", "PRODUCT_NAME"],
        productName: name,
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
    addCoupon(couponForm, active) {
      debugger
      var that = this;
      this.$refs[couponForm].validate(valid => {
        if (valid) {
          if (that.coupon.type == "1") {
            if (that.coupon.benefitCash <= 0) {
              that.$Message.error("优惠金额需大于0");
              return;
            }
          } else if (that.coupon.type == "2") {
            if (that.coupon.benefitDiscount <= 0) {
              that.$Message.error("折扣比例需大于0");
              return;
            }
          }
          if (that.coupon.validType == "1") {
            if (!that.coupon.startDate || !that.coupon.endDate) {
              that.$Message.error("未指定优惠券开始和结束日期");
              return;
            }
          } else if (that.coupon.validType == "2") {
            if (!that.coupon.validDays < 0) {
              that.$Message.error("未指定优惠券多少天内有效");
              return;
            }
          }
          if (that.coupon.benefitType == "1") {
            if (that.couponProducts.length == 0) {
              that.$Message.error("未指定优惠券可使用商品");
              return;
            }
          }
          if (!(that.couponImage && that.couponImage.url)) {
            that.$Message.error("未上传优惠券图片");
            return;
          }
          let options = {
            actionType: "ADD",
            name: that.coupon.name,
            type: that.coupon.type,
            validType: that.coupon.validType,
            benefitType: that.coupon.benefitType, //全场使用, 指定商品使用
            totalCount: that.coupon.totalCount,
            limitPerUser: that.coupon.limitPerUser,
            conditionAmount: that.coupon.conditionAmount,
            imageUrl: that.couponImage.url,
            memo: that.coupon.memo,
            active: active //是否立即发行
          };
          //编辑模式
          if(this.editMode){
            options.actionType='MODIFY';
            options.couponUuid = this.couponUuid;
          }
          //折扣券或满减券
          if (that.coupon.type == "CASH") {
            options.benefitCash = that.coupon.benefitCash;
          } else if (that.coupon.type == "DISCOUNT") {
            options.benefitDiscount = that.coupon.benefitDiscount;
          }
          //有效期是指定还是领取后几天有效
          if (that.coupon.validType == "1") {
            options.startDate = that.coupon.startDate;
            options.endDate = that.coupon.endDate;
          } else if (that.coupon.validType == "2") {
            options.validDays = that.coupon.validDays;
          }
          //指定商品使用
          if (that.coupon.benefitType == "1") {
            var benefitProductList = [];
            //将指定的商品转化为后台需要的格式
            that.couponProducts.forEach(function(val, index) {
              var benefitProduct = {
                productUuid: val
              };
              benefitProductList.push(benefitProduct);
            });
            options.benefitProductList = benefitProductList;
          }
          this.loading = true;
          this.$http
            .post("/admin/changeCoupon", this.common.request(options))
            .then(
              response => {
                this.loading = false;
                if (response.data.body.status.statusCode == 0) {
                  var data = response.data.body.data;
                  this.$Notice.success({
                    title: "成功",
                    desc: "优惠券已保存",
                    duration: 2
                  });
                  this.$router.push({
                    name: "couponlist"
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
    inquiryCoupon(couponUuid) {
      let that = this;
      let options = {
        couponUuid: couponUuid
      };
      that.$http
        .post("/admin/inquiryCoupon", that.common.request(options))
        .then(
          response => {
            that.loading = false;
            if (response.data.body.status.statusCode == 0) {
              var data = response.data.body.data;
              that.coupon = data;
              //编辑模式, 初始化优惠券图片
              that.couponImage = {
                url: that.coupon.imageUrl
              }
              //编辑模式, 初始化优惠券适用商品
              if(that.coupon.benefitType=='1'){
                that.products = that.coupon.benefitProductList; //下拉列表包含已选中的商品
              }
            } else {
              
            }
          },
          response => {
            
          }
        );
    },
    handleView(previewImageUrl) {
      this.previewImageUrl = previewImageUrl;
      this.showPreviewImage = true;
    },
    handleRemove() {
      this.couponImage = {};
    },
    handleSuccess(res, file) {
      file.url = res.data[0];
      this.couponImage = file;
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
    this.couponUuid = this.$route.params.couponUuid;
    if (this.couponUuid) {
      this.editMode = true;
      this.inquiryCoupon(this.couponUuid);
    }
    else{
      this.searchProduct("")
    }
  }
};
</script>
