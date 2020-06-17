<style lang="less">
@import "../../styles/common.less";
</style>

<template>
  <div>
    <Form ref="ad" :model="ad" :label-width="120">
      <Card>
        <p slot="title">广告信息</p>
        <Row>
          <Col span="14">
            <Row type="flex" justify="start">
              <Col span="20">
                <FormItem label="广告位置">
                  <Select clearable v-model="ad.location" style="width:250px">
                    <Option v-for="location in locationList" :value="location.value" :key="location.value">{{location.label}}</Option>
                  </Select>
                </FormItem>
              </Col>
            </Row>
            <Row type="flex" justify="start" v-if="ad.location=='商品分类页'">
              <Col span="20">
                <FormItem label="商品分类">
                  <Select clearable v-model="ad.productCateUuid" style="width:250px">
                    <Option v-bind:key="cate.productCateUuid" :value="cate.productCateUuid" v-for="cate in productCates">
                      {{cate.cateName}}
                    </Option>
                  </Select>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="20">
                <FormItem label="广告图片">
                  <div
                    class="upload-list"
                    style="width:240px;height:120px;line-height:120px"
                    v-if="adImage.url"
                  >
                    <template>
                      <img :src="adImage.url" />
                      <div class="upload-list-cover">
                        <Icon type="ios-eye-outline" @click.native="handleView(adImage.url)"></Icon>
                        <Icon type="ios-trash-outline" @click.native="handleRemove()"></Icon>
                      </div>
                    </template>
                    <template>
                      <Progress v-if="adImage.showProgress" :percent="adImage.percentage" hide-info></Progress>
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
              <FormItem label="点击链接内容">
                <RadioGroup v-model="ad.linkType">
                  <Radio label="商品详情页"></Radio>
                  <Radio label="商品组"></Radio>
                  <Radio label="自定义内容"></Radio>
                  <Radio label="外部网页链接"></Radio>
                </RadioGroup>
              </FormItem>
            </Row>
            <Row type="flex" justify="start" v-show="ad.linkType=='商品组'">
              <Col span="20">
                <FormItem label="商品组">
                  <Select clearable v-model="groupUuid" style="width:250px">
                    <Option v-bind:key="group.groupUuid" :value="group.groupUuid" v-for="group in groups">
                      {{group.groupName}}
                    </Option>
                  </Select>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <FormItem label="外部网页链接" v-show="ad.linkType=='外部网页链接'">
                <Input v-model="linkUrl"></Input>
              </FormItem>
            </Row>
            <Row class="margin-top-20" v-show="ad.linkType=='自定义内容'">
              <textarea :id="tinymceId"></textarea>
            </Row>
            <Row>
              <FormItem label="链接商品" v-show="ad.linkType=='商品详情页'">
                {{productName}}
                <Button style="margin-left:5px" type="primary" @click="showProductSearch=true">点击选择</Button>
              </FormItem>
            </Row>
            <Row v-show="showProductSearch">
              <FormItem v-show="ad.linkType=='商品详情页'">
                <div>
                  <Input
                    v-model="searchProductName"
                    placeholder="输入商品名称查询"
                    type="text"
                    style="width: 250px"
                    clearable
                  />
                  <Button type="success" @click="handleSearch">查询</Button>
                </div>
                <Row class="margin-top-10">
                  <Col span="24">
                    <div>
                      <Table
                        :loading="productLoading"
                        :columns="productColumn"
                        :data="productData"
                        border
                        stripe
                        ref="productTable"
                      ></Table>
                    </div>
                  </Col>
                </Row>
                <Row class="margin-top-10">
                  <Page
                    ref="productpage"
                    :total="total"
                    size="small"
                    :pageSize="pageSize"
                    @on-change="changepage"
                    show-total
                    show-elevator
                  ></Page>
                </Row>
              </FormItem>
            </Row>
          </Col>
          <Col span="5" style="padding: 20px">
            <img width="100%" src="../../images/ad_guide_1.png" alt />
          </Col>
          <Col span="5" style="padding: 20px">
            <img width="100%" src="../../images/ad_guide_2.png" alt />
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
        @click="addAd('ad',false)"
        icon="checkmark"
      >保存</Button>
    </div>
  </div>
</template>

<script>
import tinymce from "tinymce";
export default {
  components: {},
  data() {
    return {
      tinymceId: '',
      locationList: [{
        label:'首页',
        value:'首页'
      },{
        label:'商品分类页',
        value:'商品分类页'
      }], 
      productCates:[],
      products: [], //广告使用商品查询
      groups: [],  //广告对应商品组
      groupUuid:'', //商品组ID
      linkUrl: "",
      ad: {
        location: "首页",
        linkType: "商品详情页",
      },
      actionName: this.$http.defaults.baseURL + "admin/uploadMediaFile", //上传文件后台地址
      showPreviewImage: false, //预览广告图片
      adImage: {}, //广告图片
      loading: false,
      showProductSearch: false,
      searchProductName: "",
      productLoading: false,
      total: 0,
      startIndex: 0,
      pageSize: 5,
      productUuid: "",
      productName: "",
      richText: "",
      productData: [],
      productColumn: [
        {
          title: "选中",
          width: 80,
          align: "center",
          key: "checkBox",
          render: (h, params) => {
            return h("div", [
              h("Checkbox", {
                props: {
                  value: params.row.checkBox
                },
                on: {
                  "on-change": e => {
                    this.productData.forEach(items => {
                      this.$set(items, "checkBox", false);
                    });
                    this.productData[params.index].checkBox = e;
                    if (e) {
                      this.productUuid = params.row.productUuid;
                      this.productName = params.row.productName;
                    } else {
                      this.productUuid = "";
                      this.productName = "";
                    }
                  }
                }
              })
            ]);
          }
        },
        {
          title: "商品图片",
          width: "120px",
          render: (h, params) => {
            return h(
              "span",
              {
                props: {
                  row: params.row
                }
              },
              [
                h("img", {
                  attrs: {
                    src: params.row.productMainImage.url
                  },
                  style: {
                    width: "60px",
                    height: "48px",
                    display: "inline-block",
                    float: "left",
                    margin: "5px 0"
                  }
                })
              ]
            );
          }
        },
        {
          title: "商品名称",
          key: "productName"
        }
      ]
    };
  },
  methods: {
    handleSearch() {
      this.resetPage();
      this.searchProduct(this.searchProductName);
    },
    resetPage() {
      this.startIndex = 0;
      this.total = 0;
      this.productData = [];
      this.productlist = [];
      //重新设置成显示第一页
      this.$nextTick(function() {
        this.$refs["productpage"].currentPage = 1;
      });
    },
    changepage(index) {
      this.startIndex = (index - 1) * this.pageSize;
      this.searchProduct();
    },
    searchProduct(name) {
      let searchOptions = {
        keyArray: ["ON_SALE", "PRODUCT_NAME"],
        productName: name,
        startIndex: 0,
        pageSize: 10
      };
      this.productLoading = true;
      this.$http
        .post("/admin/searchProduct", this.common.request(searchOptions))
        .then(
          res => {
            this.productLoading = false;
            if (res.data.body.status.statusCode == 0) {
              var data = res.data.body.data;
              this.productData = data.products;
              this.total = data.total;
            } else {
              this.$Message.error(res.data.body.status.errorDesc);
            }
          },
          res => {
            this.productLoading = false;
          }
        );
    },
    inquiryProductCate() {
      let searchOptions = {
        actionType: 'ROOT'
      };
      this.$http
        .post("/admin/inquiryProductCate", this.common.request(searchOptions))
        .then(
          res => {
            if (res.data.body.status.statusCode == 0) {
              var data = res.data.body.data;
              this.productCates = data.cates;
            }
          },
          res => {
          }
        );
    },
    // 查询商品组
    inquiryProductGroup() {
      let searchOptions = { 
      };
      this.$http
        .post("/admin/inquiryProductGroup", this.common.request(searchOptions))
        .then(
          res => {
            if (res.data.body.status.statusCode == 0) {
              var data = res.data.body.data;
              this.groups = data.groups;
            }
          },
          res => {
          }
        );
    },
    back() {
      this.$router.go(-1);
    },
    addAd(adForm, active) {
      var that = this;
      if (!that.ad.location) {
        that.$Message.error("未选择广告位置");
        return;
      } else if (that.ad.location=='商品分类页'&&!that.ad.productCateUuid) {
        that.$Message.error("未选择商品分类");
        return;
      } else if (!(that.adImage && that.adImage.url)) {
        that.$Message.error("未上传广告图片");
        return;
      } else if (!that.ad.linkType) {
        that.$Message.error("未选择广告链接内容");
        return;
      } else if (that.ad.linkType == "商品详情页" && !that.productUuid) {
        that.$Message.error("未选择商品");
        return;
      } else if (that.ad.linkType == "外部网页链接" && !this.linkUrl) {
        that.$Message.error("未填写外部网页链接");
        return;
      } else if (that.ad.linkType == "商品组" && !this.groupUuid) {
        that.$Message.error("未选择商品组");
        return;
      }
      let options = {
        actionType: "ADD",
        location: that.ad.location,
        linkType: that.ad.linkType,
        url: this.adImage.url,
        productCateDTO:{
          productCateUuid: this.ad.productCateUuid
        }
      };
      if(this.ad.linkType=='商品详情页'){
        options.content = this.productUuid;
      }else if(this.ad.linkType=='自定义内容'){
        options.content = tinymce.activeEditor.getContent();
      }else if(this.ad.linkType=='外部网页链接'){
        options.content = this.linkUrl;
      }else if(this.ad.linkType=='商品组'){
        options.content = this.groupUuid;
      }
      //编辑模式
      if (this.editMode) {
        options.actionType = "MODIFY";
        options.adUuid = this.ad.adUuid;
      }
      this.loading = true;
      this.$http.post("/admin/changeAd", this.common.request(options)).then(
        response => {
          this.loading = false;
          if (response.data.body.status.statusCode == 0) {
            var data = response.data.body.data;
            this.$Notice.success({
              title: "成功",
              desc: "广告已保存",
              duration: 2
            });
            this.$router.push({
              name: "ad"
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
    },
    inquiryAd(adUuid) {
      let that = this;
      let options = {
        adUuid: adUuid
      };
      that.$http.post("/admin/inquiryAd", that.common.request(options)).then(
        response => {
          that.loading = false;
          if (response.data.body.status.statusCode == 0) {
            var data = response.data.body.data;
            that.ad = data;
            //编辑模式, 初始化广告图片, 
            that.adImage = {
              url: that.ad.url
            };
            if(that.ad.location=='商品分类页')
              that.ad.productCateUuid = that.ad.productCateDTO.productCateUuid;
            if(that.ad.linkType=='外部网页链接')
              that.linkUrl = that.ad.content;
            else if(that.ad.linkType=='自定义内容')
              tinymce.activeEditor.setContent(this.ad.content);
            else if(that.ad.linkType=='商品详情页'){
              this.productUuid = that.ad.productDTO.productUuid;
              this.productName = that.ad.productDTO.productName;
            }else if(that.ad.linkType=='商品组'){
              this.groupUuid = that.ad.groupDTO.groupUuid;
            }
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
      this.adImage = {};
    },
    handleSuccess(res, file) {
      file.url = res.data[0];
      this.adImage = file;
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
    initAdDataFun() {}
  },
  created() {
    this.tinymceId = new Date().getTime();
    this.inquiryProductCate();
    this.inquiryProductGroup();
    this.adUuid = this.$route.params.adUuid;
    if (this.adUuid) {
      this.editMode = true;
      this.inquiryAd(this.adUuid);
    }
  },
  mounted() {
    let initAdDataFun = this.initAdDataFun;
    //初始化富文本编辑框
    tinymce.init({
      selector: '#'+this.tinymceId,
      branding: false,
      elementpath: false,
      width: 450,
      height: 600,
      language: "zh_CN.GB2312",
      menubar: "edit insert view format table tools",
      theme: "modern",
      plugins: [
        "advlist autolink lists link image charmap print  hr anchor pagebreak imagetools",
        "searchreplace visualblocks visualchars code fullscreen fullpage",
        "insertdatetime media nonbreaking save table contextmenu directionality",
        "emoticons paste textcolor colorpicker textpattern imagetools codesample"
      ],
      toolbar1:
        " newnote print fullscreen  undo redo | insert | styleselect | fontsizeselect | forecolor backcolor bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image emoticons media",
      autosave_interval: "20s",
      image_advtab: true,
      table_default_styles: {
        width: "100%",
        borderCollapse: "collapse"
      },
      init_instance_callback: function(editor) {
        initAdDataFun();
      }
    });
  }
};
</script>
