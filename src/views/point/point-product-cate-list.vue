<style lang="less">
@import "../../styles/common.less";
</style>

<template>
  <div>
    <Row class="margin-top-10">
      <Col span="24">
        <Card>
          <p slot="title">
            商品类目
          </p>
          <Row>
            <Col span="14">
              <Tree :data="producttype" :load-data="loadData" :render="renderContent"></Tree>
            </Col>
            <Col span="8" offset="2">
              <!--<card>
                            <p slot="title">
                                <Icon type="ios-person"></Icon>
                         类目规格
                            </p>
                            <Row>
                            <Col span="24">
                            
                            <Tag closable color="yellow">品牌</Tag>
                            <Tag closable color="blue">产地</Tag>
                                 <Button icon="ios-plus-empty" type="dashed" size="small" >添加规格</Button>
                            </Col>
                            </Row>
              </card>-->
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
    <Modal v-model="productTypeModel" title="添加类目">
      <Form :model="productTypeRow" :label-width="80" :rules="rules" ref="productTypeRow">
        <FormItem label="类目名称" prop="name">
          <Input v-model="productTypeRow.name"></Input>
        </FormItem>
        <FormItem label="排序" prop="sortNumber" class="ivu-form-item-required">
          <InputNumber :min="sortMin" :step="sortStep" v-model="productTypeRow.sortNumber"></InputNumber>
        </FormItem>

        <FormItem label="首页显示">
          
          <i-switch v-model="productTypeRow.displayedHome" size="large" true-value="true" false-value="false">
            <span slot="open">是</span>
            <span slot="close">否</span>
          </i-switch>
        </FormItem>
        <FormItem label="类目封面" prop="name">
          <div class="upload-list" v-for="(item,index) in uploadList" :key="index">
            <template v-if="item.status === 'finished'">
              <img :src="item.url" />
              <div class="upload-list-cover">
                <Icon type="ios-eye-outline" @click.native="handleView(item.url)"></Icon>
                <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
              </div>
            </template>
            <template v-else>
              <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
            </template>
          </div>
          <Upload
            ref="upload"
            :show-upload-list="false"
            :default-file-list="defaultList"
            :on-success="handleSuccess"
            :format="uploadImageFormat"
            :max-size="uploadImageMaxSize"
            :on-format-error="handleFormatError"
            :on-exceeded-size="handleMaxSize"
            :before-upload="handleBeforeUpload"
            multiple
            type="drag"
            :action="actionName"
            style="display: inline-block;width:58px;"
          >
            <div style="width: 58px;height:58px;line-height: 58px;">
              <Icon type="camera" size="20"></Icon>
            </div>
          </Upload>
          <div style="color:red">(建议上传封面图标分辨率75X75)</div>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="producttypecancel">取消</Button>
        <Button type="primary" @click.native="producttypeok('productTypeRow')">确定</Button>
      </div>
    </Modal>
    <Modal v-model="productTypeEditModel" title="修改类目名称">
      <Form :model="productTypeEditRow" :label-width="80">
        <FormItem label="新类目名称">
          <Input v-model="productTypeRow.name"></Input>
        </FormItem>
        <FormItem label="排序" prop="sortNumber">
          <InputNumber :min="sortMin" :step="sortStep" v-model="productTypeRow.sortNumber"></InputNumber>
        </FormItem>
        <FormItem label="首页显示">
          <i-switch v-model="productTypeRow.displayedHome" size="large" :true-value="true" :false-value="false">
            <span slot="open">是</span>
            <span slot="close">否</span>
          </i-switch>
        </FormItem>
        <FormItem label="类目封面" prop="name">
          <div style="color:red">(建议上传封面图标分辨率75X75)</div>
          <div class="upload-list" v-for="(item,index) in uploadList" :key="index">
            <template v-if="item.status === 'finished'">
              <img :src="item.url" />
              <div class="upload-list-cover">
                <Icon type="ios-eye-outline" @click.native="handleView(item.url)"></Icon>
                <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
              </div>
            </template>
            <template v-else>
              <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
            </template>
          </div>
          <Upload
            ref="upload"
            :show-upload-list="false"
            :default-file-list="defaultList"
            :on-success="handleSuccess"
            :format="uploadImageFormat"
            :max-size="uploadImageMaxSize"
            :on-format-error="handleFormatError"
            :on-exceeded-size="handleMaxSize"
            :before-upload="handleBeforeUpload"
            multiple
            type="drag"
            :action="actionName"
            style="display: inline-block;width:58px;"
          >
            <div style="width: 58px;height:58px;line-height: 58px;">
              <Icon type="camera" size="20"></Icon>
            </div>
          </Upload>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="producttypeeditcancel">取消</Button>
        <Button type="primary" @click="producttypeeditok()">确定</Button>
      </div>
    </Modal>
    <Modal v-model="productTypeDeleteModel" title="删除类目">
      <Span>删除类目将导致该类目下商品失效, 确认要删除吗 ?</Span>
      <div slot="footer">
        <Button type="text" @click="producttypedeletecancel">取消</Button>
        <Button type="primary" @click="producttypedeleteok()">确定</Button>
      </div>
    </Modal>
    <Modal title="类目封面" v-model="isPreviewImage">
      <img :src="previewImageUrl" v-if="isPreviewImage" style="width: 100%" />
      <div slot="footer">
        <Button type="default" @click="isPreviewImage = false">关闭</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
export default {
  data() {
    return {
      productTypeModel: false,
      productTypeEditModel: false,
      productTypeDeleteModel: false,
      productTypeRow: {},
      productTypeEditRow: {},
      selectedProductType: {},
      sortStep: 1,
      sortMin: 1,
      actionName: this.$http.defaults.baseURL + "admin/uploadMediaFile", //上传图片action
      uploadImageMaxSize: 10240, //最大上传图片大小10M
      uploadImageFormat: ["jpg", "jpeg", "png"], //上传图片格式
      previewImageUrl: "", //预览图片地址
      uploadList: [], //上传图片列表
      fileList: [], //类目封面列表
      defaultList: [
        //类目封面列表
      ],
      isPreviewImage: false, //是否预览类目封面
      rules: {
        name: [
          { required: true, message: "类目名称必填", trigger: "blur" },
          {
            type: "string",
            max: 45,
            message: "类目名称不得大于45字符",
            trigger: "blur"
          }
        ]
      },
      producttype: [
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
                  [
                    h(
                      "Button",
                      {
                        props: Object.assign({}, this.buttonProps, {
                          icon: "ios-plus-empty",
                          type: "info"
                        }),
                        style: {
                          //                              marginRight: '8px'
                        },
                        on: {
                          click: () => {
                            this.append(data);
                          }
                        }
                      },
                      "增加子类"
                    )
                  ]
                )
              ]
            );
          },
          children: []
        }
      ],
      buttonProps: {
        type: "ghost",
        size: "small"
      }
    };
  },
  methods: {
    renderContent(h, { root, node, data }) {
      return h(
        "span",
        {
          style: {
            display: "inline-block",
            width: "100%",
            height: "40px",
            "line-height": "40px",
            "border-bottom": ".5px dashed #c5c5c5"
          }
        },
        [
          h(
            "div",
            {
              style: {
                display: "inline-block"
              }
            },
            [
              h("img", {
                attrs: {
                  src: data.catePicUrl
                },
                style: {
                  width: "40px",
                  height: "40px",
                  "vertical-align": "middle",
                  "margin-right": "10px"
                },
                on: {
                  click: () => {
                    this.handleView(data.catePicUrl);
                  }
                }
              }),
              h("span", data.sortNumber + "-" + data.title),
              data.displayedHome?
              h("Tag", {
                attrs: {
                  color: 'green'
                },style: {
                  "margin-left": "10px"
                },
              },'首页显示'):''
            ]
          ),
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
                    icon: "edit",
                    type: "ghost"
                  }),
                  style: {
                    marginRight: "8px"
                  },
                  on: {
                    click: () => {
                      this.edit(data);
                    }
                  }
                },
                "修改类目"
              ),
              h(
                "Button",
                {
                  props: Object.assign({}, this.buttonProps, {
                    icon: "ios-plus-empty",
                    type: "info"
                  }),
                  style: {
                    marginRight: "8px"
                  },
                  on: {
                    click: () => {
                      this.append(data);
                    }
                  }
                },
                "增加子类"
              ),
              h(
                "Button",
                {
                  props: Object.assign({}, this.buttonProps, {
                    icon: "ios-minus-empty",
                    type: "error"
                  }),
                  on: {
                    click: () => {
                      this.remove(root, node, data);
                    }
                  }
                },
                "删除类目"
              )
            ]
          )
        ]
      );
    },
    append(data) {
      this.productTypeModel = true;
      this.productTypeRow = {};
      this.productTypeRow.sortNumber = null;
      this.selectedProductType = data;
      this.resetUploadList();
    },
    edit(data) {
      this.productTypeEditModel = true;
      this.productTypeRow = data;
      this.productTypeRow.name = data.title;
      debugger
      var uploadList = [];
      uploadList.push({
        url: data.catePicUrl,
        status: "finished"
      });
      this.uploadList = uploadList;
      this.$refs.upload.fileList = [];
    },
    producttypeok(name) {
      if (
        this.productTypeRow.sortNumber == null ||
        this.productTypeRow.sortNumber <= 0 ||
        this.productTypeRow.sortNumber == undefined
      ) {
        this.$Message.error("请输入正确排序");
        return;
      }
      this.$refs[name].validate(valid => {
        if (valid) {
          var options = {
            actionType: "ADD",
            sortNumber: this.productTypeRow.sortNumber,
            cateName: this.productTypeRow.name,
            displayedHome: this.productTypeRow.displayedHome,
            parentCateDTO: {
              productCateUuid: this.selectedProductType.productCateUuid
            }
          };
          if (this.uploadList != null && this.uploadList.length > 0) {
            options.catePicUrl = this.uploadList[0].url;
          }
          this.$http
            .post("/admin/changePointProductCate", this.common.request(options))
            .then(
              response => {
                if (response.data.body.status.statusCode == 0) {
                  // var data = response.data.body.data;
                  this.productTypeModel = false;
                  this.$Notice.success({
                    title: "成功",
                    desc: "类目已添加",
                    duration: 2
                  });
                  let data = this.selectedProductType;
                  const children = data.children || [];
                  children.push({
                    title: this.productTypeRow.name,
                    catePicUrl: this.productTypeRow.catePicUrl,
                    sortNumber: this.productTypeRow.sortNumber,
                    displayedHome: this.productTypeRow.displayedHome,
                    expand: false
                  });
                  this.$set(data, "children", children);
                  this.resetUploadList();
                } else {
                  this.$Message.error(response.data.body.status.errorDesc);
                }
              },
              response => {
                this.$Message.error("失败，请稍后重试");
              }
            );
        }
      });
    },
    producttypeeditok() {
      var options = {
        actionType: "MODIFY",
        sortNumber: this.productTypeRow.sortNumber,
        cateName: this.productTypeRow.name,
        displayedHome: this.productTypeRow.displayedHome,
        productCateUuid: this.productTypeRow.productCateUuid
      };
      if (this.uploadList != null && this.uploadList.length > 0) {
        options.catePicUrl = this.uploadList[0].url;
      }
      debugger
      this.$http
        .post("/admin/changePointProductCate", this.common.request(options))
        .then(
          response => {
            if (response.data.body.status.statusCode == 0) {
              var data = response.data.body.data;
              this.productTypeEditModel = false;
              this.productTypeRow.title = this.productTypeRow.name;
              this.$Notice.success({
                title: "成功",
                desc: "类目已修改",
                duration: 2
              });
              var data = this.selectedProductType;
              const children = data.children || [];
              children.push({
                title: this.productTypeRow.name,
                catePicUrl: this.productTypeRow.catePicUrl,
                sortNumber: this.productTypeRow.sortNumber,
                expand: false
              });
              this.$set(data, "children", children);
              this.resetUploadList();
            } else {
              this.$Message.error(response.data.body.status.errorDesc);
            }
          },
          response => {
            this.$Message.error("失败，请稍后重试");
          }
        );
    },
    producttypecancel() {
      this.productTypeModel = false;
    },
    producttypeeditcancel() {
      this.productTypeEditModel = false;
    },
    remove(root, node, data) {
      const parentKey = root.find(el => el === node).parent;
      const parent = root.find(el => el.nodeKey === parentKey).node;
      const index = parent.children.indexOf(data);
      this.parent = parent;
      this.index = index;
      this.productTypeDeleteModel = true;
      this.productDelete = data;
    },
    producttypedeleteok() {
      var options = {
        actionType: "DELETE",
        productCateUuid: this.productDelete.productCateUuid
      };
      this.$http
        .post("/admin/changePointProductCate", this.common.request(options))
        .then(
          response => {
            if (response.data.body.status.statusCode == 0) {
              var data = response.data.body.data;
              this.parent.children.splice(this.index, 1);
              this.$Notice.success({
                title: "成功",
                desc: "类目已删除",
                duration: 2
              });
              this.productTypeDeleteModel = false;
            } else {
              this.$Message.error(response.data.body.status.errorDesc);
            }
          },
          response => {
            this.$Message.error("失败，请稍后重试");
          }
        );
    },
    producttypedeletecancel() {
      this.productTypeDeleteModel = false;
    },
    loadData(item, callback) {
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
                    sortNumber: val.sortNumber,
                    displayedHome: val.displayedHome,
                    catePicUrl: val.catePicUrl,
                    productCateUuid: val.productCateUuid,
                    children: []
                  };
                } else {
                  var obj = {
                    title: val.cateName,
                    sortNumber: val.sortNumber,
                    displayedHome: val.displayedHome,
                    catePicUrl: val.catePicUrl,
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
    resetUploadList() {
      this.$refs.upload.fileList = [];
      this.uploadList = [];
      this.fileList = [];
    },
    handleView(url) {
      this.previewImageUrl = url;
      this.isPreviewImage = true;
    },
    handleRemove(file) {
      const uploadList = this.uploadList;
      uploadList.splice(uploadList.indexOf(file), 1);
      this.$refs.upload.fileList = [];
      this.uploadList = uploadList;
    },
    handleSuccess(res, file) {
      file.url = res.data[0];
      this.uploadList.push(file);
    },
    handleFormatError(file) {
      this.$Notice.warning({
        title: "文件格式错误",
        desc: "上传文件格式错误, 请选择jpg, jpeg 或 png的图片."
      });
    },
    handleMaxSize(file) {
      this.$Notice.warning({
        title: "文件过大",
        desc: "文件大小不能超过10M."
      });
    },
    handleBeforeUpload() {
      const check = this.uploadList.length >= 1;
      if (check) {
        this.$Notice.warning({
          title: "只能上传一张类目封面."
        });
      }
      return !check;
    }
  },
  mounted: function() {
    this.uploadList = this.$refs.upload.fileList;
  }
};
</script>
<style>
.ivu-tree li ul {
  padding: 0 0 0 40px;
}
</style>
