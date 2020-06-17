<style lang="less">
@import "../../styles/common.less";
</style>

<template>
  <div>
    <Form ref="product" :model="product" :label-width="100" :rules="ruleInline">
      <Card class="margin-top-10">
        <Tabs type="card">
          <TabPane label="商品信息" name="productInfo">
            <Card>
              <p slot="title">
                <Icon type="ios-person"></Icon>基本信息
              </p>
              <Row>
                <Col span="24">
                  <Row type="flex" justify="start">
                    <Col span="8">
                      <FormItem label="商品类目" prop="productCateDTO" class="ivu-form-item-required">
                        <Input v-model="product.productCateDTO.title" disabled style="width:60%"></Input>
                        <Button type="info" icon="search" @click.native="prodCateModal=true">查找</Button>
                      </FormItem>
                    </Col>
                    <Col span="8">
                      <FormItem label="商品品牌">
                        <Select v-model="selectedProductBrand" style="width:240px"  filterable remote :remote-method="inquiryBrand" :loading="brandLoading" clearable>
                          <Option
                            v-for="item in brands"
                            :value="item.productBrandUuid"
                            :key="item.productBrandUuid"
                          >{{item.name}}
                            <img style="float:left;width:16px;height:16px;margin-right: 5px":src="item.logoUrl"></img>
                          </Option>
                        </Select>
                      </FormItem>
                    </Col>
                    <Modal v-model="prodCateModal" title="选择商品品类">
                      <Tree
                        :data="producttype"
                        :load-data="loadProdCateData"
                        :render="renderContent"
                      ></Tree>
                    </Modal>
                  </Row>
                  <Row>
                    <Col span="8">
                      <FormItem label="商品名称" prop="productName">
                        <Input v-model="product.productName" style="width:80%"></Input>
                        <Icon type="ios-locked-outline" slot="prepend"></Icon>
                      </FormItem>
                    </Col>
                    <Col span="8">
                      <FormItem label="副标题" prop="memo">
                        <Input v-model="product.memo" style="width:80%"></Input>
                      </FormItem>
                    </Col>
                  </Row>
                  <Row>
                    <Col span="8">
                      <FormItem label="商品编码" prop="productCode">
                        <Input v-model="product.productCode" style="width:80%"></Input>
                      </FormItem>
                    </Col>
                    <Col span="8">
                      <FormItem label="成本价" >
                        <InputNumber :min="0.01" v-model="product.productCostPrice" style="width:80%"></InputNumber>
                      </FormItem>
                    </Col>
                  </Row>
                  <Row>
                    <Col span="8">
                      <FormItem label="积分" prop="unitPoint" class="ivu-form-item-required">
                        <InputNumber :min="1" v-model="product.unitPoint"></InputNumber>
                      </FormItem>
                    </Col>
                    <Col span="8">
                      <FormItem
                        label="市场积分"
                        prop="unitPointStandard"
                        class="ivu-form-item-required"
                      >
                        <InputNumber :min="1" v-model="product.unitPointStandard"></InputNumber>
                      </FormItem>
                    </Col>
                  </Row>
                  <Row>
                  <Col span="8">
                      <FormItem label="选择运费模板" class="ivu-form-item-required">
                        <Select filterable clearable  v-model="selectedFreight" style="width:240px" @on-change="changeFreight">
                          <Option
                            v-for="item in freights"
                            v-if="item.active"
                            :value="item.productFreightUuid"
                            :key="item.productFreightUuid"
                          >{{item.name}}</Option>
                        </Select>
                        <a @click="navProductFreight">编辑运费模板</a>
                      </FormItem>
                    </Col>
                    <Col span="8">
                      <FormItem
                        label="重量(kg)"
                        prop="productWeight"
                        class="ivu-form-item-required"
                      >
                        <InputNumber :min="0.00" v-model="product.productWeight"></InputNumber>
                        &nbsp;&nbsp;&nbsp;<Tooltip content="用于按重量计算运费">?</Tooltip>
                      </FormItem>
                    </Col>
                  </Row>
                  <Row type="flex" justify="start">
                    <Col span="4">
                      <FormItem label="是否新品">
                        <i-switch
                          v-model="product.new"
                          size="large"
                          true-value="true"
                          false-value="false"
                        >
                          <span slot="open">是</span>
                          <span slot="close">否</span>
                        </i-switch>
                      </FormItem>
                    </Col>
                    <Col span="4">
                      <FormItem label="是否热卖">
                        <i-switch
                          v-model="product.hot"
                          size="large"
                          true-value="true"
                          false-value="false"
                        >
                          <span slot="open">是</span>
                          <span slot="close">否</span>
                        </i-switch>
                      </FormItem>
                    </Col>
                    <Col span="4">
                      <FormItem label="是否推荐">
                        <i-switch
                          v-model="product.recommend"
                          size="large"
                          true-value="true"
                          false-value="false"
                        >
                          <span slot="open">是</span>
                          <span slot="close">否</span>
                        </i-switch>
                      </FormItem>
                    </Col>
                  </Row>
                  <Row type="flex" justify="start">
                    <Col span="5">
                      <FormItem label="是否立即上架">
                        <i-switch
                          v-model="product.onSale"
                          size="large"
                          true-value="true"
                          false-value="false"
                        >
                          <span slot="open">是</span>
                          <span slot="close">否</span>
                        </i-switch>
                      </FormItem>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Card>
            <Card class="margin-top-10">
              <p slot="title">商品Banner图片[首张用于商品封面]</p>
              <Row>
                <Col span="24">
                  <div class="upload-list" v-for="item in productImageList">
                    <template v-if="item.status === 'finished'">
                      <img :src="item.url" />
                      <div class="upload-list-cover">
                        <Icon
                          type="ios-eye-outline"
                          @click.native="handleProductImageView(item.url)"
                        ></Icon>
                        <Icon
                          type="ios-trash-outline"
                          @click.native="handleProductImageRemove(item)"
                        ></Icon>
                      </div>
                    </template>
                    <template v-else>
                      <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                    </template>
                  </div>
                  <Upload
                    ref="productImageUpload"
                    :show-upload-list="false"
                    :default-file-list="defaultList"
                    :on-success="handleProductImageSuccess"
                    :format="['jpg','jpeg','png']"
                    :max-size="10240"
                    :on-format-error="handleProductImageFormatError"
                    :on-exceeded-size="handleProductImageMaxSize"
                    :before-upload="handleProductImageBeforeUpload"
                    multiple
                    type="drag"
                    :action="actionName"
                    style="display: inline-block;width:58px;"
                  >
                    <div style="width: 58px;height:58px;line-height: 58px;">
                      <Icon type="camera" size="20"></Icon>
                    </div>
                  </Upload>
                  <Modal title="图片预览" v-model="showPreviewImage">
                    <img :src="previewImageUrl" v-if="showPreviewImage" style="width: 100%" />
                    <div slot="footer">
                      <Button type="default" @click="showPreviewImage = false">关闭</Button>
                    </div>
                  </Modal>
                </Col>
              </Row>
            </Card>
            <Card class="margin-top-10">
              <p slot="title">商品视频</p>
              <Row>
                <Col span="24">
                  <div class="upload-list" v-for="item in productVideoList">
                    <template v-if="item.status === 'finished'">
                      <img :src="item.url" />
                      <div class="upload-list-cover">
                        <Icon
                          type="ios-eye-outline"
                          @click.native="handleProductVideoView(item.url)"
                        ></Icon>
                        <Icon
                          type="ios-trash-outline"
                          @click.native="handleProductVideoRemove(item)"
                        ></Icon>
                      </div>
                    </template>
                    <template v-else>
                      <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                    </template>
                  </div>
                  <Upload
                    ref="productVideoUpload"
                    :show-upload-list="false"
                    :default-file-list="defaultList"
                    :on-success="handleProductVideoSuccess"
                    :format="['mp4','avi','wmv','ogv']"
                    :max-size="512000"
                    :on-format-error="handleProductVideoFormatError"
                    :on-exceeded-size="handleProductVideoMaxSize"
                    :before-upload="handleProductVideoBeforeUpload"
                    type="drag"
                    :action="actionName"
                    style="display: inline-block;width:58px;"
                  >
                    <div style="width: 58px;height:58px;line-height: 58px;">
                      <Icon type="camera" size="20"></Icon>
                    </div>
                  </Upload>
                  <Modal title="视频预览" v-model="showPreviewVideo">
                    <video
                      controls="controls"
                      :src="previewVideoUrl"
                      v-if="showPreviewVideo"
                      style="width: 100%"
                    />
                    <div slot="footer">
                      <Button type="default" @click="showPreviewVideo = false">关闭</Button>
                    </div>
                  </Modal>
                </Col>
              </Row>
            </Card>
            <Card class="margin-top-10">
              <p slot="title">商品详情图</p>
              <Row>
                <Col span="24">
                  <div class="upload-list" v-for="item in productDescList">
                    <template v-if="item.status === 'finished'">
                      <img :src="item.url" />
                      <div class="upload-list-cover">
                        <Icon
                          type="ios-eye-outline"
                          @click.native="handleProductDescView(item.url)"
                        ></Icon>
                        <Icon
                          type="ios-trash-outline"
                          @click.native="handleProductDescRemove(item)"
                        ></Icon>
                      </div>
                    </template>
                    <template v-else>
                      <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                    </template>
                  </div>
                  <Upload
                    ref="productDescUpload"
                    :show-upload-list="false"
                    :default-file-list="defaultList"
                    :on-success="handleProductDescSuccess"
                    :format="['jpg','jpeg','png']"
                    :max-size="10240"
                    :on-format-error="handleProductDescFormatError"
                    :on-exceeded-size="handleProductDescMaxSize"
                    :before-upload="handleProductDescBeforeUpload"
                    type="drag"
                    multiple
                    :action="actionName"
                    style="display: inline-block;width:58px;"
                  >
                    <div style="width: 58px;height:58px;line-height: 58px;">
                      <Icon type="camera" size="20"></Icon>
                    </div>
                  </Upload>
                  <Modal title="图片详情预览" v-model="showPreviewDesc">
                    <img :src="previewDescUrl" v-if="showPreviewDesc" style="width: 100%" />
                    <div slot="footer">
                      <Button type="default" @click="showPreviewDesc = false">关闭</Button>
                    </div>
                  </Modal>
                </Col>
              </Row>
            </Card>
          </TabPane>
          <TabPane label="商品参数" name="productParameter">
            <Card>
              <p slot="title">商品参数</p>

              <Row type="flex" justify="start" class="margin-top-10">
                <Col span="4">
                  <FormItem
                    v-for="(item,index) in product.parameterlist"
                    :key="item.id"
                    :prop="'parameterlist.' + index + '.productAttrName'"
                    :rules="{required: true, message: '参数名不能为空', trigger: 'blur'}"
                    :label-width="10"
                  >
                    <Input v-model="item.productAttrName" placeholder="参数名"></Input>
                  </FormItem>
                </Col>
                <Col span="8" offset="2">
                  <FormItem
                    v-for="(item,index) in product.parameterlist"
                    :key="item.id"
                    :prop="'parameterlist.' + index + '.productAttrValue'"
                    :rules="{required: true, message: '参数值不能为空', trigger: 'blur'}"
                    :label-width="10"
                  >
                    <Input v-model="item.productAttrValue" placeholder="参数值"></Input>
                  </FormItem>
                </Col>
                <Col span="2" offset="1">
                  <FormItem
                    v-for="(item,index) in product.parameterlist"
                    :key="item.id"
                    :label-width="0"
                  >
                    <Button icon="close-round" @click.native="delParam(index)"></Button>
                  </FormItem>
                </Col>
              </Row>

              <Row type="flex" justify="start" class="margin-top-10">
                <Col span="4">
                  <Button icon="plus-round" @click.native="addParam()">添加参数</Button>
                </Col>
              </Row>
            </Card>
          </TabPane>
          <TabPane label="规格库存" name="productSpec">
            <Card>
              <p slot="title">
                <Icon type="ios-person"></Icon>规格库存
              </p>
              <Row type="flex" justify="start">
                <Col span="5">
                  <FormItem label="是否多规格商品">
                    <i-switch v-model="product.skuEnabled" size="large">
                      <span slot="open">是</span>
                      <span slot="close">否</span>
                    </i-switch>
                  </FormItem>
                </Col>
              </Row>
              <div v-if="!product.skuEnabled">
                <Row>
                  <Col span="5">
                    <FormItem label="库存" prop="totalUnit">
                      <inputNumber v-model="product.totalUnit"></inputNumber>&nbsp;&nbsp;
                    </FormItem>
                  </Col>
                </Row>
              </div>
              <div v-if="product.skuEnabled">
                <p style="color:#ed3f14;" v-if="isSkuAttrValueEmpty">！新增规格项/值后，规格项或者规格值必填。</p>
                <Row>
                  <Form ref="skuList" :label-width="0">
                    <Col v-for="(item,index) in skuList" :key="index">
                      <FormItem
                        label="规格名"
                        :prop="'skuList.' + index + '.skuAttrName'"
                        :rules="{required: true, message: '规格名必填项', trigger: 'blur'}"
                      >
                        <Input v-model="item.skuAttrName" placeholder="规格名" style="width:100px;"></Input>
                        <Button type="text" @click.native="deltext(index)">删除规格</Button>
                      </FormItem>
                      <FormItem label="规格值" inline>
                        <Input
                          v-for="(txt,ind) in item.productAttrValueList"
                          :key="item.id"
                          v-model="txt.skuAttrValue"
                          placeholder="规格值"
                          icon="close-circled"
                          style="width:100px;margin-right: 5px;"
                          @on-click="del(index,ind)"
                        ></Input>
                        <Button type="text" @click.native="addtext(index)">添加规格值</Button>
                      </FormItem>
                    </Col>
                    <Button type="ghost" style @click.native="additem()">添加规格项目</Button>
                    <Button type="primary" @click="drawForm('member')" icon="checkmark">确定</Button>
                    <!--<Button type="primary" @click="cle('member')" icon="checkmark">看至</Button>-->
                  </Form>
                </Row>

                <!--</Col>-->
                <Row class="margin-top-10">
                  <Col span="24">
                    <Table :columns="skuColumn" :data="skuData" border stripe></Table>
                  </Col>
                </Row>
                <Modal title="上传规格图片" v-model="showUploadSkuImage">
                    <Row>
                      <Col span="24">
                        <div class="upload-list" v-for="item in skuImageList">
                          <template v-if="item.status === 'finished'">
                            <img :src="item.url" />
                          </template>
                          <template v-else>
                            <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                          </template>
                        </div>
                        <Upload
                          ref="skuImageUpload"
                          :show-upload-list="false"
                          :default-file-list="defaultList"
                          :on-success="handleSkuImageSuccess"
                          :format="['jpg','jpeg','png']"
                          :max-size="10240"
                          :on-format-error="handleSkuImageFormatError"
                          :on-exceeded-size="handleSkuImageMaxSize"
                          :before-upload="handleSkuImageBeforeUpload"
                          type="drag"
                          :action="actionName"
                          style="display: inline-block;width:58px;"
                        >
                          <div style="width: 58px;height:58px;line-height: 58px;">
                            <Icon type="camera" size="20"></Icon>
                          </div>
                        </Upload>
                      </Col>
                    </Row>
                  <div slot="footer">
                    <Button type="text" @click="showUploadSkuImage = false">取消</Button>
                    <Button type="primary" @click="uploadSkuImageOk">确定</Button>
                  </div>
                </Modal>
              </div>
            </Card>
          </TabPane>
        </Tabs>
      </Card>
    </Form>
    <selectProductType v-if="selectProductTypeModel" />
    <div class="margin-top-10">
      <Button @click="back" type="default" style="margin-right:10px">返回</Button>
      <Button :loading="loading" type="primary" @click="addok('product')" icon="checkmark">保存</Button>
    </div>
  </div>
</template>

<script>
import selectProductType from "../common-components/select-product-type.vue";
import tinymce from "tinymce";
import { address } from "@/common/address.js";
export default {
  components: {
    selectProductType
  },
  data() {
    return {
      selectProductTypeModel: false, //选择类目弹出框控制
      actionName: this.$http.defaults.baseURL + "admin/uploadMediaFile", //上传图片action
      skuColumn: [], //规格表列数据
      skuData: [], //规格表值数据
      freights: [], //运费模板列表
      brands: [], //商品品牌
      isSkuAttrValueEmpty: false, //新增规格项/值后，规格项或者规格值必填
      //页面验证器
      ruleInline: {
        productName: [
          { required: true, message: "商品名称必填", trigger: "blur" },
          {
            type: "string",
            max: 45,
            message: "商品名称不能超过45个字符",
            trigger: "blur"
          }
        ],
        memo: [
          {
            type: "string",
            max: 45,
            message: "商品标题不能超过45个字符",
            trigger: "blur"
          }
        ],
        productCode: [
          { required: true, message: "商品编码必填", trigger: "blur" },
          {
            type: "string",
            max: 45,
            message: "商品编码不能超过45个字符",
            trigger: "blur"
          }
        ]
      },
      selectedFreight: "", //选择的运费模板
      selectedProductBrand: "", //选择的品牌
      producttype: [
        //选择的类目数据
        {
          title: "全部类目",
          loading: false,
          //                      expand: false,
          render: (h, { root, node, data }) => {
            return h(
              "span",
              {
                style: {
                  display: "inline-block",
                  width: "100%"
                }
              },
              [
                h("span", [
                  h("Icon", {
                    props: {
                      type: "ios-folder-outline"
                    },
                    style: {
                      marginRight: "8px"
                    }
                  }),
                  h("span", data.title)
                ]),
                h(
                  "span",
                  {
                    style: {
                      display: "inline-block",
                      float: "right",
                      marginRight: "32px"
                    }
                  },
                  []
                )
              ]
            );
          },
          children: []
        }
      ],
      searchOptions:{},
      prodCateModal: false, //商品类目弹出框
      product: {
        //商品
        parameterlist: [],
        productCateDTO: {
          title: "",
          productCateUuid: ""
        },
        unitPoint: 1,
        unitPointStandard: 1,
        productWeight: 1.00,
        productName: "",
        memo: "",
        productType: true
      },
      defaultList: [], //默认商品图片
      showPreviewImage: false, //预览商品图片
      showPreviewVideo: false, //预览商品视频
      showPreviewDesc: false, //预览商品描述图片
      productImageList: [], //商品图片列表
      skuImageList: [], //商品SKU图片列表
      productVideoList: [], //商品视频列表
      productDescList: [], //商品描述列表
      loading: false, //加载中
      brandLoading: false, //品牌搜索加载中
      real: true, //是否实物商品, 当前只支持实物商品
      skuList: [],
      showUploadSkuImage: false,
      productSku:{},
      productSkuIndex:null
    };
  },
  methods: {
    //商品类目页面生成
    renderContent(h, { root, node, data }) {
      return h(
        "span",
        {
          style: {
            display: "inline-block",
            width: "100%"
          }
        },
        [
          h("span", [h("span", data.title)]),
          h(
            "span",
            {
              style: {
                display: "inline-block",
                float: "right",
                marginRight: "32px"
              }
            },
            [
              h(
                "Button",
                {
                  props: Object.assign({}, this.buttonProps, {
                    icon: "checkmark",
                    type: "ghost"
                  }),
                  style: {
                    marginRight: "8px"
                  },
                  on: {
                    click: () => {
                      this.selectFreight(data);
                    }
                  }
                },
                "选择类目"
              )
            ]
          )
        ]
      );
    },
    //加载类目数据
    loadProdCateData(item, callback) {
      var options = {};
      if (item.title == "全部类目") {
        options = {
          actionType: "ROOT"
        };
      } else {
        options = {
          actionType: "CHILD",
          productCateUuid: item.productCateUuid || ""
        };
      }
      this.$http
        .post("/admin/inquiryPointProductCate", this.common.request(options))
        .then(
          response => {
            if (response.data.body.status.statusCode == 0) {
              var cates = response.data.body.data.cates;
              var data = [];
              cates.forEach(function(val, ind) {
                if (val.leaf) {
                  var obj = {
                    title: val.cateName,
                    productCateUuid: val.productCateUuid,
                    children: []
                  };
                } else {
                  var obj = {
                    title: val.cateName,
                    loading: false,
                    productCateUuid: val.productCateUuid,
                    children: []
                  };
                }

                data.push(obj);
              });
              callback(data);
            } else {
              this.$Message.error(response.data.body.status.errorDesc);
            }
          },
          response => {
            this.$Message.error("失败，请稍后重试");
          }
        );
    },
    //规格表格数据
    initSkuColumn() {
      // this.skuData = this.skuList;
      // var _this = this;
      // _this.skuList = this.skuList;
      this.skuColumn = [
        {
          title: "规格1",
          align: "center",
          render: (h, params) => {
            return h(
              "span",
              {
                props: {
                  row: params.row
                }
              },
              params.row.value1
            );
          }
        },
        {
          title: "规格2",
          align: "center",
          render: (h, params) => {
            if (params.row.value2) {
              return h(
                "span",
                {
                  props: {
                    row: params.row
                  }
                },
                params.row.value2
              );
            }
          }
        },
        {
          title: "规格3",
          align: "center",
          render: (h, params) => {
            if (params.row.value3) {
              return h(
                "span",
                {
                  props: {
                    row: params.row
                  }
                },
                params.row.value3
              );
            }
          }
        },
        {
          title: "编码",
          align: "center",
          key: "skuCode",
          width: 120,
          render: (h, params) => {
            return h(
              "Input",
              {
                props: {
                  class: "ivu-input",
                  value: params.row.skuCode
                },
                on: {
                  input: val => {
                    this.skuData[params.index].skuCode = val;
                  }
                }
              },
              params.row.skuCode
            );
          }
        },
        {
          title: "积分",
          align: "center",
          key: "skuUnitPoint",
          width: 100,
          render: (h, params) => {
            return h("InputNumber", {
              props: {
                class: "ivu-input-number-input",
                min: 1,
                value: params.row.skuUnitPoint
              },
              on: {
                'on-change': (e) => {
                    this.skuData[params.index].skuUnitPoint = e;
                  }
              }
            });
          }
        },
        {
          title: "市场积分",
          align: "center",
          key: "skuUnitPointStandard",
          width: 120,
          render: (h, params) => {
            return h("InputNumber", {
              props: {
                class: "ivu-input-number-input",
                min: 1,
                value: params.row.skuUnitPointStandard
              },
              on: {
                'on-change': (e) => {
                    this.skuData[params.index].skuUnitPointStandard = e;
                  }
              }
            });
          }
        },
        {
          title: "库存",
          align: "center",
          key: "skuTotalUnit",
          width: 100,
          render: (h, params) => {
            return h("InputNumber", {
              props: {
                class: "ivu-input-number-input",
                min: 0,
                value: params.row.skuTotalUnit
              },
              on: {
                'on-change': (e) => {
                    this.skuData[params.index].skuTotalUnit = e;
                  }
              }
            });
          }
        },
        {
						title: "图片(点击上传)",
            width: 120,
						render: (h, params) => {
							return h(
								"span", {
									props: {
										row: params.row
									}
								},
								[
									h("img", {
										attrs: {
											src: params.row.skuImageUrl||'https://ccmao-b2c.oss-cn-shenzhen.aliyuncs.com/empty-image.png'
										},
										style: {
											width: "60px",
											height: "48px",
											display: "inline-block",
											float: "left",
											margin: "5px 0"
										},
										on: {
											click: () => {
												this.uploadSkuImage(params.row,params.index)
											}
										}
                  }),
                  h("a", {
										on: {
											'click': () => {
												this.deleteSkuImage(params.row,params.index)
											}
										}
									},[
                    h("Icon", {
										attrs: {
											type: 'close-circled'
										},
										style: {
											display: params.row.skuImageUrl?"inline-block":'none',
										}
									})
                  ]),
								]
							);
						}
					}
      ];
    },
     //返回
    back(){
        this.$router.push({
          name: "point-product",
          query: {
            searchOptions:this.searchOptions
          }
        });
    },
    navProductFreight(){
        this.$router.push({
          name: "shippinglist"
        });
    },
    //保存商品
    addok(name) {
      var _this = this;
      this.$refs[name].validate(valid => {
        if (valid) {
          if (!_this.selectedFreight) {
            _this.$Message.error("运费模板必选");
            return;
          }
          if (!_this.product.productWeight) {
            _this.$Message.error("重量必填");
            return;
          }
          if (!_this.product.productCateDTO.productCateUuid) {
            _this.$Message.error("商品类目必选");
            return;
          }
          if (_this.productImageList.length == 0) {
            _this.$Message.error("请至少上传一张商品图片");
            return;
          }
          if (_this.product.skuEnabled) {
            var btn = true;

            _this.skuList.forEach(function(val, ind) {
              if (val.skuAttrName == "") {
                _this.$Message.error("规格名必填");
                btn = false;
                return;
              } else {
                val.productAttrValueList.forEach(function(value, index) {
                  if (value.skuAttrValue == "") {
                    _this.$Message.error("规格值必填");
                    btn = false;
                    return;
                  }
                });
              }
            });
            if (!btn) {
              _this.isSkuAttrValueEmpty = true;
              return;
            } else {
              _this.isSkuAttrValueEmpty = false;
            }
          }
          _this.skuList = _this.skuList;
            _this.skuData.forEach(function(val, ind) {
              val.skuAttrValueList = [];
              if (val.value1) {
                val.skuAttrValueList.push({
                  skuAttrName: _this.skuList[0].skuAttrName,
                  skuAttrValue: val.value1
                });
              }
              if (val.value2) {
                val.skuAttrValueList.push({
                  skuAttrName: _this.skuList[1].skuAttrName,
                  skuAttrValue: val.value2
                });
              }
              if (val.value3) {
                val.skuAttrValueList.push({
                  skuAttrName: _this.skuList[2].skuAttrName,
                  skuAttrValue: val.value3
                });
              }
            });
          var skuList = JSON.parse(JSON.stringify(this.skuData));
          skuList.forEach(function(val, ind) {
            delete val.value1;
            delete val.value2;
            delete val.value3;
          });
          this.product.parameterlist.forEach(function(val, ind) {
            val.cateAttr = false;
          });
          var imgList = [];
          if (this.productImageList.length >= 1) {
            this.productImageList.forEach(function(val, ind) {
              var obj = {
                fileName: val.name,
                size: val.size,
                url: val.url
              };
              imgList.push(obj);
            });
          }
          var descImgList = [];
          if (this.productDescList.length >= 1) {
            this.productDescList.forEach(function(val, ind) {
              var obj = {
                fileName: val.name,
                size: val.size,
                url: val.url
              };
              descImgList.push(obj);
            });
          }
          var videoList = [];
          if (this.productVideoList.length >= 1) {
            this.productVideoList.forEach(function(val, ind) {
              var obj = {
                fileName: val.name,
                size: val.size,
                url: val.url
              };
              videoList.push(obj);
            });
          }
          var options = {
            actionType: "ADD",
            productName: this.product.productName || "", //商品名称
            hot: this.product.hot, //是否热销
            recommend: this.product.recommend, //是否推荐
            new: this.product.new, //是否新品
            memo: this.product.memo || "", //备注
            productCostPrice: this.product.productCostPrice, //成本价
            productCode: this.product.productCode || "", //商品编码
            productBrief: this.product.productSubName || "", //副标题
            productType: this.real ? 1 : 2, //实物商品
            productFreightDTO: {
              //运费模板
              productFreightUuid: this.selectedFreight
            },
            skuEnabled: this.product.skuEnabled, //是否多规格商品
            totalUnit: this.product.totalUnit, //库存
            unitPoint: this.product.unitPoint, //所需购币
            unitPointStandard: this.product.unitPointStandard, //划线购币
            warnUnit: this.product.warnUnit, //库存预警数量
            productWeight: this.product.productWeight, //重量
            productCateDTO: {
              //商品类目
              productCateUuid: this.product.productCateDTO.productCateUuid
            },
            attrList: this.product.parameterlist, //商品参数
            onSale: this.product.onSale //是否上架
          };
          if(this.selectedProductBrand){
            options.productBrandDTO = {
              productBrandUuid: this.selectedProductBrand
            }
          }
          if (this.product.skuEnabled) {
            //多规格商品(规格值)
            if (this.slist.length>0) {
              options.skuAttrList = this.slist;
              options.skuList = skuList;
            }
          }
          if (this.productImageList.length >= 1) {
            //商品图片
            options.productMainImage = {
              fileName: this.productImageList[0].name,
              size: this.productImageList[0].size,
              url: this.productImageList[0].url
            };
            options.productImages = imgList;
          }
          if (this.productDescList.length >= 1) {
            //商品描述图片
            options.productDescImages = descImgList;
          }
          if (this.productVideoList.length >= 1) {
            //商品视频
            options.productVideos = videoList;
          }
          this.loading = true;
          this.$http
            .post("/admin/changePointProduct", this.common.request(options))
            .then(
              response => {
                this.loading = false;
                if (response.data.body.status.statusCode == 0) {
                  var data = response.data.body.data;
                  this.$Notice.success({
                    title: "成功",
                    desc: "商品信息已保存",
                    duration: 2
                  });
                  this.$router.push({
                    name: "point-product",
                    query: {
                      searchOptions:this.searchOptions
                    }
                  });
                
                } else {
                  this.$Message.error(response.data.body.status.errorDesc);
                }
              },
              response => {
                this.loading = false;
                this.$Message.error("保存失败，请检查各项是否填写标准");
              }
            );
        } else {
          this.loading = false;
          this.$Message.error("请按要求填写必填项");
        }
      });
    },
    //选择类目
    selectProductType() {
      this.selectProductTypeModel = true;
    },
    //图片及商品上传移除等方法
    handleProductImageView(previewImageUrl) {
      this.previewImageUrl = previewImageUrl;
      this.showPreviewImage = true;
    },
    handleSkuImageView(previewImageUrl) {
      this.previewImageUrl = previewImageUrl;
      this.showPreviewImage = true;
    },
    handleProductVideoView(previewVideoUrl) {
      this.previewVideoUrl = previewVideoUrl;
      this.showPreviewVideo = true;
    },
    handleProductDescView(previewDescUrl) {
      this.previewDescUrl = previewDescUrl;
      this.showPreviewDesc = true;
    },
    handleProductImageRemove(file) {
      const fileList = this.$refs.productImageUpload.fileList;
      this.$refs.productImageUpload.fileList.splice(fileList.indexOf(file), 1);
    },
    handleSkuImageRemove(file) {
      const fileList = this.$refs.skuImageUpload.fileList;
      this.$refs.skuImageUpload.fileList.splice(fileList.indexOf(file), 1);
    },
    handleProductVideoRemove(file) {
      const fileList = this.$refs.productVideoUpload.fileList;
      this.$refs.productVideoUpload.fileList.splice(fileList.indexOf(file), 1);
    },
    handleProductDescRemove(file) {
      const fileList = this.$refs.productDescUpload.fileList;
      this.$refs.productDescUpload.fileList.splice(fileList.indexOf(file), 1);
    },
    handleProductImageSuccess(res, file) {
      file.url = res.data[0];
    },
    handleSkuImageSuccess(res, file) {
      file.url = res.data[0];
    },
    handleProductVideoSuccess(res, file) {
      file.url = res.data[0];
    },
    handleProductDescSuccess(res, file) {
      file.url = res.data[0];
    },
    handleProductImageFormatError(file) {
      this.$Notice.warning({
        title: "图片格式错误",
        desc: "图片格式错误, 请选择jpg, jpeg 或 png格式图片."
      });
    },
    handleSkuImageFormatError(file) {
      this.$Notice.warning({
        title: "图片格式错误",
        desc: "图片格式错误, 请选择jpg, jpeg 或 png格式图片."
      });
    },
    handleProductDescFormatError(file) {
      this.$Notice.warning({
        title: "图片格式错误",
        desc: "图片格式错误, 请选择jpg, jpeg 或 png格式图片."
      });
    },
    handleProductVideoFormatError(file) {
      this.$Notice.warning({
        title: "视频格式错误",
        desc: "视频格式错误, 请选择mp4, avi, ogv 或 wmv格式视频."
      });
    },
    handleProductImageMaxSize(file) {
      this.$Notice.warning({
        title: "图片大小超过限制",
        desc: file.name + "太大, 不能超过10M"
      });
    },
    handleSkuImageMaxSize(file) {
      this.$Notice.warning({
        title: "图片大小超过限制",
        desc: file.name + "太大, 不能超过10M"
      });
    },
    handleProductDescMaxSize(file) {
      this.$Notice.warning({
        title: "图片大小超过限制",
        desc: file.name + "太大, 不能超过10M"
      });
    },
    handleProductVideoMaxSize(file) {
      this.$Notice.warning({
        title: "视频大小超过限制",
        desc: file.name + "太大, 不能超过500M"
      });
    },
    handleProductImageBeforeUpload() {
      const check = this.productImageList.length < 99;
      if (!check) {
        this.$Notice.warning({
          title: "上传图片超过上限."
        });
      }
      return check;
    },
    handleSkuImageBeforeUpload() {
      const check = this.skuImageList.length < 2;
      if (!check) {
        this.$Notice.warning({
          title: "上传图片超过上限."
        });
      }
      return check;
    },
    handleProductDescBeforeUpload() {
      const check = this.productDescList.length < 99;
      if (!check) {
        this.$Notice.warning({
          title: "上传图片超过上限."
        });
      }
      return check;
    },
    handleProductVideoBeforeUpload() {
      const check = this.productVideoList.length < 4;
      if (!check) {
        this.$Notice.warning({
          title: "最多上传4个视频."
        });
      }
      return check;
    },
    addtext(index) {
      //添加规格
      if (this.skuList[index].productAttrValueList.length >= 10) {
        this.$Message.error("最多有十个规格值");
        return;
      } else {
        this.skuList[index].productAttrValueList.push({
          skuAttrValue: ""
        });
      }
    }, //每个规格值添加子项
    additem() {
      if (this.skuList.length >= 4) {
        this.$Message.error("最多有四个规格项");
        return;
      } else {
        this.skuList.push({
          skuAttrName: "",
          productAttrValueList: [
            {
              skuAttrValue: ""
            }
          ]
        });
      }
    }, //删除规格值
    del(index, ind) {
      this.skuList[index].productAttrValueList.splice(ind, 1);
    },
    //删除商品参数
    delParam(index) {
      this.product.parameterlist.splice(index, 1);
    },
    //添加商品参数
    addParam() {
      this.product.parameterlist.push({
        productAttrName: "",
        productAttrValue: ""
      });
    },
    uploadSkuImage(row,index){
      this.showUploadSkuImage = true; //打开上传图片弹出框
      this.productSku = row;  //当前要上传图片的sku
      this.productSkuIndex = index;  //当前要上传图片的sku索引
      this.skuImageList = [];
      this.$refs.skuImageUpload.fileList = this.skuImageList;
    },
    deleteSkuImage(row,index){
      row.skuImageUrl = null;
      this.skuData[index] = row;
      debugger
    },
    uploadSkuImageOk(){
      if(this.skuImageList.length>0){
        debugger
        this.productSku.skuImageUrl = this.skuImageList[0].url;
        this.skuData[this.productSkuIndex] = this.productSku;
      }
      this.showUploadSkuImage = false;
    },
    //根据规格项和值生成AXB的规格表
    drawForm() {
      this.boxlist = JSON.parse(JSON.stringify(this.skuData));
      this.common.setObject("vasw", this.boxlist);
      var _this = this;
      // _this.skuData = [];
      var arr = [];
      _this.skuList = this.skuList;
      var btn = true;
      this.common.setObject("soiu", _this.skuList);
      _this.skuList.forEach(function(val, ind) {
        if (val.skuAttrName == "") {
          _this.$Message.error("规格名必填");
          btn = false;
          return;
        } else {
          val.productAttrValueList.forEach(function(value, index) {
            if (value.skuAttrValue == "") {
              _this.$Message.error("规格值必填");
              btn = false;
              return;
            }
          });
        }
      });
      if (!btn) {
        this.isSkuAttrValueEmpty = true;
        return;
      } else {
        this.isSkuAttrValueEmpty = false;
      }
      _this.skuData = this.skuData;
      // _this.skuList.forEach((tenn,index) =>{
      //   for (let ind = 0; ind < tenn.productAttrValueList.length; ind++) {
      //       _this.skuData.push({
      //         skuAttrName:tenn.skuAttrName,
      //         skuAttrValue:tenn.productAttrValueList[ind].skuAttrValue,
      //         skuCode:'',
      //         skuTotalUnit:'',
      //         skuUnitPoint:'',
      //         skuUnitPointStandard:'',
      //         });
      //   }
      // })
      if (_this.skuList[0]) {
        _this.skuList[0].productAttrValueList.forEach(function(val1, ind1) {
          if (_this.skuList[1]) {
            _this.skuList[1].productAttrValueList.forEach(function(val2, ind2) {
              if (_this.skuList[2]) {
                _this.skuList[2].productAttrValueList.forEach(function(
                  val3,
                  ind3
                ) {
                  var obj = {
                    value1: val1.skuAttrValue,
                    value2: val2.skuAttrValue,
                    value3: val3.skuAttrValue
                  };
                  arr.push(obj);
                });
              } else {
                var obj = {
                  value1: val1.skuAttrValue,
                  value2: val2.skuAttrValue
                };
                arr.push(obj);
              }
            });
          } else {
            var obj = {
              value1: val1.skuAttrValue
            };
            arr.push(obj);
          }
        });
      }

      this.boxlist.forEach(function(val, ind) {
        arr.forEach(function(value, index) {
          if (value.value3) {
            if (
              val.value1 == value.value1 &&
              val.value2 == value.value2 &&
              val.value3 == value.value3
            ) {
              arr[index] = val;
            }
          } else if (value.value2) {
            if (val.value1 == value.value1 && val.value2 == value.value2) {
              arr[index] = val;
            }
          } else if (value.value1) {
            if (value.value1 == val.value1) {
              arr[index] = val;
            }
          }
        });
      });
      this.common.setObject("arrr", arr);
      //图片默认为空
      var skuData = [];
      arr.forEach(function(val, ind) {
        val.skuImageUrl = null;
        skuData.push(val);
      });
      this.skuData = skuData;

      this.skuData.forEach(function(val, ind) {
        
      });
      debugger;
      for (var i = 0; i < this.skuList.length; i++) {
        this.skuColumn[i].title = this.skuList[i].skuAttrName;
      }
      this.slist = JSON.parse(JSON.stringify(this.skuList));
      this.vlist = this.skuData;
    },
    cle() {
      this.common.setObject("ns", this.skuData);
    },
    selectFreight(data) {
      this.prodCateModal = false;
      this.product.productCateDTO = data;
    },
    //运费模板重新选择
    changeFreight(value){
      this.selectedFreight = value;
    },
    //删除规格项值
    deltext(index) {
      this.skuList.splice(index, 1);
    },
    //查询运费模板
    inquiryProductFreights() {
      let that = this;
      this.$http
        .post("/admin/inquiryProductFreight", this.common.request({}))
        .then(
          response => {
            if (response.data.body.status.statusCode == 0) {
              var data = response.data.body.data;
              this.freights = data.freights;
              this.freights.forEach(function(val,index){
                if(val.default){
                  that.selectedFreight = val.productFreightUuid;
                }
              })
            } else {
              this.$Message.error(response.data.body.status.errorDesc);
            }
          },
          response => {
            this.$Message.error("查询运费模板失败");
          }
        );
    },
    //查询商品品牌
    inquiryBrand(name) {
      var keyArray = [];
      var options = {
        startIndex: 0,
        pageSize: 20
      };
      if(name){
        keyArray.push('BRAND_NAME');
        options.brandName = name;
      }
      options.keyArray=keyArray;
      this.brandLoading = true;
      this.$http
        .post("/admin/searchBrand", this.common.request(options))
        .then(
          response => {
            this.brandLoading = false;
            if (response.data.body.status.statusCode == 0) {
              var data = response.data.body.data;
              this.brands = data.brands;
            } else {
              this.$Message.error(response.data.body.status.errorDesc);
            }
          },
          response => {
            this.$Message.error("查询商品品牌失败");
          }
        );
    }
  },
  created() {
    this.inquiryProductFreights();
    this.inquiryBrand('');
    this.initSkuColumn();
    this.searchOptions = this.$route.query.searchOptions;
  },
  mounted() {
    this.productImageList = this.$refs.productImageUpload.fileList;
    this.productVideoList = this.$refs.productVideoUpload.fileList;
    this.productDescList = this.$refs.productDescUpload.fileList;
  },
  destroyed() {}
};
</script>
