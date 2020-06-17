<style lang="less">
@import "../../styles/common.less";
</style>

<template>
  <div>
    <Form ref="groupBuy" :model="groupBuy" :label-width="120">
      <Card>
        <p slot="title">团购活动</p>
        <Row>
          <Col span="24">
            <Row type="flex" justify="start">
              <Col span="6">
                <FormItem label="活动名称">
                  <Input v-model="groupBuy.name" style="width:200px"></Input>
                </FormItem>
              </Col>
            </Row>
            <Row type="flex" justify="start">
              <Col span="6">
                <FormItem label="团购开始时间">
                  <DatePicker
                    v-model="groupBuy.startTime"
                    type="datetime"
                    placeholder="团购开始时间"
                    style="width: 200px"
                  ></DatePicker>
                </FormItem>
              </Col>
            </Row>
            <Row type="flex" justify="start">
              <Col span="6">
                <FormItem label="团购结束时间">
                  <DatePicker
                    v-model="groupBuy.endTime"
                    type="datetime"
                    placeholder="选团购结束时间"
                    style="width: 200px"
                  ></DatePicker>
                </FormItem>
              </Col>
            </Row>
            <Row type="flex" justify="start">
              <Col span="6">
                <FormItem label="成团人数">
                  <InputNumber :min="2" v-model="groupBuy.minUserCount" style="width:100px"></InputNumber>
                </FormItem>
              </Col>
            </Row>
            <Row type="flex" justify="start">
              <Col span="6">
                <FormItem label="成团时间">
                  <InputNumber :min="1" v-model="groupBuy.maxTranDays" style="width:100px"></InputNumber>天
                </FormItem>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row class="margin-top-10">
          <Button type="warning" @click="showProductModal">添加团购商品</Button>
        </Row>
        <Row class="margin-top-10">
          <Col span="18">
            <Table :columns="groupBuyProductColumn" :data="groupBuyProductList" border stripe></Table>
          </Col>
        </Row>
      </Card>
    </Form>
    <Modal title="图片预览" v-model="showPreviewImage">
      <img :src="previewImageUrl" v-if="showPreviewImage" style="width: 100%" />
      <div slot="footer">
        <Button type="default" @click="showPreviewImage = false">关闭</Button>
      </div>
    </Modal>
    <Modal width="1000" title="选择商品" v-model="showSelectProduct">
        <Row>
					<div>
						<Input v-model="searchProductName" placeholder="商品名称" type="text" style="width: 200px" clearable />
						<Button type="success" @click="handleSearch">查询</Button>
					</div>
				</Row>
        <Row class="margin-top-10">
					<Col span="24">
					<div>
						<Table @on-selection-change="selectProduct" :loading="loading" :columns="productColumn" :data="productData" border stripe></Table>
					</div>
					</Col>
				</Row>
				<Row class="margin-top-10">
					<Page ref="productpage" :total="total" size="small" :pageSize="pageSize" @on-change="changepage" show-total
					 show-elevator></Page>
				</Row>
      <div slot="footer">
        <Button type="default" @click="showSelectProduct = false">关闭</Button>
        <Button type="primary" @click="addGroupBuyProduct">确认</Button>
      </div>
    </Modal>
    <div class="margin-top-10">
      <Button size="large" type="default" @click="back()" class="margin-right-10">返回</Button>
      <Button
        type="primary"
        size="large"
        :loading="loading"
        @click="addgroupBuy"
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
      showPreviewImage: false,
      showSelectProduct: false,
      searchProductName: '',
      productData:[],
      pageSize: 8,
      pageNo: 1,
      total: 0,
      groupBuy: {
        //form对象
        minUserCount: 2,
        maxTranDays: 7,
        stock: 100,
        unitPrice: 0.01
      },
      products: [], //团购商品商品查询
      selectedProduct:[], //每次选择的商品
      groupBuyProductList: [], //参与团购活动的商品列表
      loading: false,
      groupBuyProductColumn: [
        {
          title: "商品图片",
          align: "center",
          width: 200,
          render: (h, params) => {
            return h("img", {
              attrs: {
                src: params.row.productDTO.productMainImage.url
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
                  this.previewProductImage(params.row.productDTO.productMainImage.url);
                }
              }
            });
          }
        },
        {
          title: "商品名称",
          align: "center",
          render: (h, params) => {
            return h(
              "span",
              {
                props: {
                  row: params.row
                }
              },
              params.row.productDTO.productName
            );
          }
        },
        {
          title: "团购价",
          align: "center",
          key: "unitPrice",
          width: 150,
          render: (h, params) => {
            return h("InputNumber", {
              props: {
                class: "ivu-input",
                min: 0,
                value: params.row.unitPrice
              },
              on: {
                blur: val => {
                  this.groupBuyProductList[params.index].unitPrice = val;
                }
              }
            });
          }
        },
        {
          title: "库存",
          align: "center",
          key: "stock",
          width: 150,
          render: (h, params) => {
            return h("InputNumber", {
              props: {
                class: "ivu-input",
                min: 0,
                value: params.row.stock
              },
              on: {
                blur: val => {
                  this.groupBuyProductList[params.index].stock = val;
                }
              }
            });
          }
        },
        {
						title: "操作",
						align: "center",
						width: 180,
						render: (h, params) => {
							let onSale = params.row.onSale;
							let type = onSale ? "warning" : "success";
							let saleText = onSale ? "下架" : "上架";
							return h("span", {}, [
								h(
									"Button", {
										props: {
											type: "error",
											row: params.row,
											size: "small"
										},
										style: {
											marginRight: "8px"
										},
										on: {
											click: () => {
												this.removeGroupBuyProduct(params.index);
											}
										}
									},
									"移除"
								)
							]);
						}
					}
      ],
      productColumn: [
        {
          type: "selection",
          align: "center",
          width: 60
        },
        {
          title: "商品图片",
          align: "center",
          width: 200,
          render: (h, params) => {
            return h("img", {
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
            });
          }
        },
        {
          title: "商品名称",
          align: "center",
          render: (h, params) => {
            return h(
              "span",
              {
                props: {
                  row: params.row
                }
              },
              params.row.productName
            );
          }
        }
      ]
    };
  },
  methods: {
    previewProductImage(url) {
      this.showPreviewImage = true;
      this.previewImageUrl = url;
    },
    removeGroupBuyProduct(index){
      this.groupBuyProductList.splice(index,1);
    },
    showProductModal(){
      this.showSelectProduct = true;
      this.handleSearch();
    },
    handleSearch() {
      this.resetPage();
      this.searchProduct();
    },
    resetPage(){
      this.pageNo = 1;
      this.total = 0;
      this.productData = [];
      //重新设置成显示第一页
      this.$nextTick(function() {
        this.$refs["productpage"].currentPage = 1;
      });
    },
    changepage(pageNo) {
      this.pageNo = pageNo;
      this.searchProduct();
    },
    searchProduct() {
      let keyArray = [];
      var searchOptions = {
        startIndex: (this.pageNo-1)*this.pageSize,
        pageSize: this.pageSize
      };
      //判断是否有商品名称查询条件
      if (this.searchProductName) {
        keyArray.push("PRODUCT_NAME");
        searchOptions.productName = this.searchProductName;
      }
      //已上架
      keyArray.push("ON_SALE");
      searchOptions.onSale = true;
      
      searchOptions.keyArray = keyArray;
      this.loading = true;
      this.$http
        .post("/admin/searchProduct", this.common.request(searchOptions))
        .then(
          response => {
            if (response.data.body.status.statusCode == 0) {
              this.loading = false;
              this.productData = response.data.body.data.products;
              this.total = response.data.body.data.total;
            } else {
              this.loading = false;
              this.$Message.error(response.data.body.status.errorDesc);
            }
          },
          response => {
            this.$Message.error("失败，请稍后重试");
          }
        );
    },
    //商品多选框选中事件
    selectProduct(selection) {
      this.selectedProduct = selection;
    },
    addGroupBuyProduct(){
      let that = this;
      that.selectedProduct.forEach(function(val,index){
        var groupByProduct = {
          productDTO: val,
          unitPrice: val.unitPrice,
          stock: val.totalUnit
        }
        that.groupBuyProductList.push(groupByProduct);
      });
      this.showSelectProduct = false;
    },
    back() {
      this.$router.go(-1);
    },
    addgroupBuy() {
      let that = this;
      if (!that.groupBuy.name) {
        that.$Message.error("未输入团购活动名称");
        return;
      }
      if (!that.groupBuy.startTime) {
        that.$Message.error("未指定团购开始时间");
        return;
      } else if (!that.groupBuy.endTime) {
        that.$Message.error("未指定团购结束时间");
        return;
      }
      if (
        that.groupBuy.startTime.getTime() >= that.groupBuy.endTime.getTime()
      ) {
        that.$Message.error("结束时间需晚于开始时间");
        return;
      }
      let options = {
        actionType: "ADD",
        minUserCount: that.groupBuy.minUserCount,
        maxTranDays: that.groupBuy.maxTranDays,
        startTime: that.groupBuy.startTime.format('yyyy-MM-dd hh:mm:ss'),
        endTime: that.groupBuy.endTime.format('yyyy-MM-dd hh:mm:ss'),
        name: that.groupBuy.name
      };
      var productOptions = [];
      this.groupBuyProductList.forEach(function(val,index){
        var productOption = {
          productDTO: {
            productUuid: val.productDTO.productUuid
          },
          unitPrice: val.unitPrice,
          stock: val.stock
        }
        productOptions.push(productOption);
      })
      options.groupBuyProductList = productOptions;
      //编辑模式
      if (this.editMode) {
        options.actionType = "MODIFY";
        options.groupBuyDefUuid = this.groupBuyDefUuid;
      }
      this.loading = true;
      this.$http
        .post("/admin/changeGroupBuy", this.common.request(options))
        .then(
          response => {
            this.loading = false;
            if (response.data.body.status.statusCode == 0) {
              var data = response.data.body.data;
              this.$Notice.success({
                title: "成功",
                desc: "团购活动已保存",
                duration: 2
              });
              this.$router.push({
                name: "groupbuyproduct"
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
    inquiryGroupBuy(groupBuyDefUuid) {
      let that = this;
      let options = {
        groupBuyDefUuid: groupBuyDefUuid
      };
      that.$http
        .post("/admin/inquiryGroupBuy", that.common.request(options))
        .then(
          response => {
            that.loading = false;
            if (response.data.body.status.statusCode == 0) {
              var data = response.data.body.data;
              that.groupBuy = data;
              that.groupBuyProductList = data.groupBuyProductList;
            } else {
            }
          },
          response => {}
        );
    }
  },
  created() {
    this.groupBuyDefUuid = this.$route.params.groupBuyDefUuid;
    if (this.groupBuyDefUuid) {
      this.editMode = true;
      this.inquiryGroupBuy(this.groupBuyDefUuid);
    }
  }
};
</script>
