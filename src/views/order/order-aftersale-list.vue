<style lang="less">
@import "../../styles/common.less";
</style>

<template>
  <div>
    <Row class="margin-top-10">
      <Col span="24">
        <Card>
          <p slot="title">售后单列表</p>
          <Row>
            <RadioGroup v-model="dateSearchType">
              <Radio label="1">今日</Radio>
              <Radio label="2">昨日</Radio>
              <Radio label="3">最近七日</Radio>
              <Radio label="4" disabled>自定义时间段</Radio>
              <DatePicker
                v-model="searchDateRange"
                @click.native="dateChange"
                type="daterange"
                placement="bottom-end"
                placeholder="申请日期"
                style="width: 200px"
              ></DatePicker>
              <Input v-model="searchOrderNo" placeholder="订单号" style="width: 150px" />
              <Input v-model="searchSaleNo" placeholder="售后单号" style="width: 150px" />
              <Input v-model="searchPersonalPhone" placeholder="会员手机号码" style="width: 120px" />
              <!-- <Select clearable filterable v-model="supplierUuid" placeholder="供应商" style="width: 120px" @click.native="clickSearchOrderNoSupplier">
                            <Option
                            v-for="item in suppliers"
                            :value="item.supplierUuid"
                            :key="item.supplierUuid"
                            >{{ item.supplierName }}</Option>
              </Select>-->
              <Select clearable v-model="searchStatus" placeholder="售后状态" style="width: 120px">
                <Option value="0">退款中</Option>
                <Option value="1">待买家退货</Option>
                <Option value="2">退款申请拒绝</Option>
                <Option value="3">待确认收货</Option>
                <Option value="9">退款成功</Option>
              </Select>
              <Select
                clearable
                v-model="searchAfterSaleType"
                placeholder="售后类型"
                style="width: 120px"
              >
                <Option value="1">仅退款</Option>
                <Option value="2">退款退货</Option>
              </Select>
              <Button type="success" @click="getData()">查询</Button>
            </RadioGroup>
            <div class="f_r">
              <!-- <Button
                icon="document-text"
                type="success"
                @click="completeMultipleOrder"
                :loading="completeMultipleOrderLoading"
              >完成</Button>-->
              <!-- <Button
                class="margin-left-10"
                :loading="payMultipleOrderLoading"
                @click="payMultipleOrder"
                icon="social-yen"
                type="success"
              >批量支付</Button>
              <Button
                class="margin-left-10"
                @click="courierMultipleOrder"
                icon="navigate"
                type="primary"
              >合并发货</Button>-->
              <Button
                class="margin-left-10"
                icon="document-text"
                type="warning"
                @click="exportAfterSale()"
                :loading="exportLoading"
              >导出</Button>
            </div>
          </Row>
          <Row class="margin-top-10">
            <Col span="24">
              <div>
                <Table :columns="afterSaleExportColumn" style="display:none"></Table>
                <Table
                  @on-selection-change="selectOrder"
                  :columns="afterSaleColumn"
                  :loading="loading"
                  :data="afterSaleData"
                  border
                  stripe
                  ref="orderTable"
                ></Table>
              </div>
            </Col>
          </Row>
          <Row class="margin-top-10">
            <Col span="18">
              <Page
                ref="orderpage"
                :total="total"
                size="small"
                :pageSize="pageSize"
                @on-change="changePage"
                show-total
                show-elevator
              ></Page>
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
    <Modal title="拒绝售后" v-model="rejectModal" :closable="false" :mask-closable="false">
      <Alert type="warning">拒绝后买家不能再次发起退款, 请与买家仔细沟通后再操作。</Alert>
      <Form>
        <FormItem>
          <Input :rows="5" :maxlength="500" type="textarea" v-model="rejectReason" placeholder="请输入拒绝的原因"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="rejectcancel">取消</Button>
        <Button :loading="rejectLoading" type="primary" @click="rejectok">提交</Button>
      </div>
    </Modal>
    <Modal v-model="commentModal" width="400px" title="备注信息">
      <Input type="text" v-model="commentRow.orderComment" style="width:360px"></Input>
      <div slot="footer">
        <Button type="text" @click="commentcancel()">取消</Button>
        <Button :loading="commentLoading" type="primary" @click="commentok()">提交</Button>
      </div>
    </Modal>
    <Modal v-model="viewModal" width="600px" title="售后单详情" :closable="false" :mask-closable="false">
      <Form
        label-position="right"
        :label-width="80"
        :model="viewRow"
      >
        <Row type="flex" justify="start">
          <Col span="12">
            <FormItem label="售后单号:">{{viewRow.saleNo}}</FormItem>
          </Col>
          <Col span="12">
            <FormItem label="订单号:">{{viewRow.orderNo}}</FormItem>
          </Col>
          <Col span="12">
            <FormItem label="申请时间:">{{viewRow.timeApplication}}</FormItem>
          </Col>
          <Col span="12">
            <FormItem label="会员:">{{viewRow.userinfo}}</FormItem>
          </Col>
          <Col span="12">
            <FormItem label="售后状态:">{{viewRow.statusDesc}}</FormItem>
          </Col>
          <Col span="12">
            <FormItem label="售后类型:">{{viewRow.afterSaleTypeDesc}}</FormItem>
          </Col>
          <Col span="24">
            <FormItem label="退款商品:" v-if="viewRow.orderDTO">
              <div v-bind:key="product.productName"  v-for="product in viewRow.orderDTO.orderProductDTOList">{{product.productName}}(x{{product.productUnit}})</div>
            </FormItem>
          </Col>
          <Col span="24">
            <FormItem label="退款金额:">￥{{viewRow.afterSaleAmount}}</FormItem>
          </Col>
          <Col span="24">
            <FormItem label="退款原因:">{{viewRow.afterSaleDescription}}</FormItem>
          </Col>
          <Col span="24" style="display:flex">
            <FormItem label="退款凭证:"><img  @click="previewImage(url)" style="width:100px;height:100px" :src="url" v-for="url in viewRow.imageUrlList" alt=""></img></FormItem>
          </Col>
        </Row>
      </Form>
      <div slot="footer">
        <Button type="text" @click="viewcancel()">关闭</Button>
      </div>
    </Modal>
    <Modal title="图片预览" v-model="showPreviewImage">
				<img :src="previewImageUrl" v-if="showPreviewImage" style="width: 100%" />
				<div slot="footer">
					<Button type="default" @click="showPreviewImage = false">关闭</Button>
				</div>
			</Modal>
    <Table ref="deliveryTable" style="display:none"></Table>
  </div>
</template>

<script>
import table2excel from "@/libs/table2excel.js";
export default {
  components: {},
  data() {
    return {
      courierList: this.common.courierList,
      commentLoading: false, //修改备注加载中
      editLoading: false, //查看售后单加载中
      rejectLoading: false, //确认发货按钮加载中
      payMultipleOrderLoading: false, //点击批量支付按钮加载中
      exportLoading: false, //点击导出按钮加载中
      completeMultipleOrderLoading: false, //点击批量完成按钮加载中

      commentModal: false, //备注弹出框
      viewModal: false, //详情弹出框
      rejectModal: false, //拒绝申请弹出框

      dateSearchType: "3", //查询条件日期选择(今日,昨日, 最近七天, 自定义时间段)
      searchStatus: "", //售后单查询售后单状态
      searchDateRange: [], //查询自定义售后单日期范围
      searchOrderNo: "", //查询订单单号
      searchSaleNo: "", //查询售后单号
      searchPersonalPhone: "", //查询会员手机号码
      searchAfterSaleType: "", //查询售后类型
      loading: true, //售后单数据表加载中状态
      commentRow: {}, //备注售后单弹框数据模型
      viewRow: {}, //详情售后单弹框数据模型
      rejectRow: {}, //拒绝售后弹出框数据模型
      rejectReason: "", //拒绝原因

      showPreviewImage: false, //预览照片模态框
			previewImageUrl: '', //预览照片地址

      //售后单展示列
      afterSaleColumn: [
        {
          type: "selection",
          align: "center",
          width: 60
        },
        {
          title: "申请时间",
          width: 150,
          align: "center",
          key: "timeApplication"
        },
        {
          title: "售后单号",
          align: "center",
          key: "saleNo",
          width: 150
        },
        {
          title: "订单号",
          align: "center",
          key: "orderNo",
          width: 150
        },
        {
          title: "售后类型",
          align: "center",
          key: "afterSaleTypeDesc",
          width: 120
        },
        {
          title: "售后状态",
          align: "center",
          key: "statusDesc",
          width: 200
        },
        {
          title: "退货物流",
          align: "center",
          key: "courierName",
          width: 200
        },
        {
          title: "物流单号",
          align: "center",
          key: "courierNo",
          width: 200
        },
        {
          title: "会员信息",
          align: "center",
          width: 150,
          key: "userinfo"
        },
        {
          title: "退款金额",
          align: "center",
          key: "afterSaleAmount",
          width: 120
        },
        {
          title: "操作",
          align: "left",
          width: 250,
          fixed: 'right',
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  style: {
                    margin: "0 5px 0 0"
                  },
                  on: {
                    click: () => {
                      this.viewAfterSale(params.row);
                    }
                  }
                },
                "详情"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "warning",
                    size: "small"
                  },
                  style: {
                    margin: "0 5px 0 0",
                    display:
                      params.row.orderStatus === "0" ||
                      params.row.orderStatus === "1"
                        ? "display"
                        : "none"
                  },
                  on: {
                    click: () => {
                      this.editOrder(params.row);
                    }
                  }
                },
                "详情"
              ),
              h(
                "Poptip",
                {
                  props: {
                    confirm: true,
                    title: "确认要同意退款吗?",
                    transfer: true
                  },
                  on: {
                    "on-ok": () => {
                      this.approveAfterSale(params.row);
                    }
                  }
                },
                [
                  h(
                    "Button",
                    {
                      props: {
                        type: "success",
                        size: "small"
                      },
                      style: {
                        margin: "0 5px 0 0",
                        display:
                          params.row.status === "0" ? "display" : "none"
                      }
                    },
                    "同意退款"
                  )
                ]
              ),
              h(
                "Button",
                {
                  props: {
                    type: "error",
                    size: "small"
                  },
                  style: {
                    margin: "0 5px 0 0",
                    display: params.row.status === "0" ? "display" : "none"
                  },
                  on: {
                    click: () => {
                      this.rejectAfterSale(params.row);
                    }
                  }
                },
                "拒绝申请"
              ),
              h(
                "Poptip",
                {
                  props: {
                    confirm: true,
                    title: "确认已收到货物吗?",
                    transfer: true
                  },
                  on: {
                    "on-ok": () => {
                      this.confirmAfterSale(params.row);
                    }
                  }
                },
                [
                  h(
                    "Button",
                    {
                      props: {
                        type: "success",
                        size: "small"
                      },
                      style: {
                        margin: "0 5px 0 0",
                        display:
                          params.row.status === "3" ? "display" : "none"
                      }
                    },
                    "确认收货"
                  )
                ]
              ),
            ]);
          }
        }
      ],
      afterSaleData: [],
      afterSaleExportColumn: [
        {
          title: "申请时间",
          width: 150,
          align: "center",
          key: "timeApplication"
        },
        {
          title: "售后单号",
          align: "center",
          key: "saleNo",
          width: 150
        },
        {
          title: "订单号",
          align: "center",
          key: "orderNo",
          width: 150
        },
        {
          title: "状态",
          align: "center",
          key: "statusDesc",
          width: 120
        },
        {
          title: "售后类型",
          align: "center",
          key: "afterSaleTypeDesc",
          width: 120
        },
        {
          title: "退货物流",
          align: "center",
          key: "courierName",
          width: 200
        },
        {
          title: "物流单号",
          align: "center",
          key: "courierNo",
          width: 200
        },
        {
          title: "会员信息",
          align: "center",
          width: 150,
          key: "userinfo"
        },
        {
          title: "退款金额",
          align: "center",
          key: "afterSaleAmount",
          width: 120
        },
        {
          title: "原因",
          align: "center",
          key: "afterSaleDescription"
        }
      ],
      totalAmount: "", //查询出的售后单总金额
      selectedAfterSale: [], //售后单多选框选中的售后单
      total: 0, //查询出的售后单总数量
      pageSize: 20, //每页条数
      startIndex: 0, //分页查询页码
    };
  },
  methods: {
    //预览照片
			previewImage(url) {
        this.showPreviewImage = true;
        this.previewImageUrl = url;
			},
    //售后单多选框选中事件
    selectOrder(selection) {
      this.selectedAfterSale = selection;
    },
    //批量完成售后单实际调用后台
    completeMultipleOrder() {
      var selection = this.selectedAfterSale;
      if (selection.length == 0) {
        this.$Message.error("请选择售后单");
      } else {
        let orders = {
          orders: selection
        };
        this.completeMultipleOrderLoading = true;
        this.$http
          .post("/admin/completeMultipleOrder", this.common.request(orders))
          .then(
            response => {
              this.completeMultipleOrderLoading = false;
              if (response.data.body.status.statusCode == 0) {
                var data = response.data.body.data;
                this.$Notice.success({
                  title: "售后单已完成",
                  duration: 2
                });
                this.getData();
              } else {
                this.$Message.error(response.data.body.status.errorDesc);
              }
            },
            response => {
              this.completeMultipleOrderLoading = false;
              this.$Message.error(response.data.body.status.errorDesc);
            }
          );
      }
    },
    //查看售后单查询日期
    changeSearchDate() {
      this.searchOrderNo = null;
    },
    //弹出售后单备注框
    commentOrder(row) {
      this.commentModal = true;
      this.commentRow = row;
    },
    //弹出售后单修改框
    editOrder(row) {
      this.viewModal = true;
      this.viewRow = row;
    },
    //点击单个售后单后面的发货
    rejectAfterSale(row) {
      this.rejectModal = true;
      this.rejectRow = row;
    },
    //点击合并发货
    courierMultipleOrder() {
      if (this.selectedAfterSale.length === 0) {
        this.$Message.error("请选择至少一个售后单");
        return;
      }
      //检查是否所有售后单都处于可发货的状态
      var isValid = true;
      this.selectedAfterSale.forEach(function(val, index) {
        if (val.orderStatus != "1") {
          isValid = false;
        }
      });
      if (!isValid) {
        this.$Message.error("请检查选中售后单是否都处于待发货状态");
        return;
      }
      this.courierOrders = this.selectedAfterSale;
      this.rejectModal = true;
    },
    //关闭评论售后单模态框
    commentcancel() {
      this.commentModal = false;
    },
    //关闭详情售后单模态框
    viewcancel() {
      this.viewModal = false;
    },
    //关闭发货模态框
    rejectcancel() {
      this.rejectModal = false;
    },
    //点击搜索售后单编号输入框, 其他搜索条件置空
    clickSearchOrderNo() {
      this.dateSearchType = null;
      this.searchDateRange = null;
      this.supplierUuid = null;
      this.orderStatus = null;
    },
    //同意售后单实际调用后台
    approveAfterSale(item) {
      let option = {
        saleNo: item.saleNo
      };
      this.$http
        .post("/admin/approveOrderAfterSale", this.common.request(option))
        .then(
          response => {
            this.loading = false;
            if (response.data.body.status.statusCode == 0) {
              var data = response.data.body.data;
              this.$Notice.success({
                title: "已同意同款",
                duration: 2
              });
              this.getData();
            } else {
              this.$Message.error(response.data.body.status.errorDesc);
            }
          },
          response => {
            this.$Message.error(response.data.body.status.errorDesc);
            this.loading = false;
          }
        );
    },
    //完成售后单实际调用后台
    confirmAfterSale(item) {
      let option = {
        saleNo: item.saleNo
      };
      this.$http
        .post("/admin/confirmOrderAfterSale", this.common.request(option))
        .then(
          response => {
            this.loading = false;
            if (response.data.body.status.statusCode == 0) {
              var data = response.data.body.data;
              this.$Notice.success({
                title: "已确认收货",
                duration: 2
              });
              this.getData();
            } else {
              this.$Message.error(response.data.body.status.errorDesc);
            }
          },
          response => {
            this.$Message.error(response.data.body.status.errorDesc);
            this.loading = false;
          }
        );
    },
    //取消售后单实际调用后台
    cancelOrder(e) {
      let logistics = {
        orderNo: e.orderNo
      };
      this.$http
        .post("/admin/cancelOrder", this.common.request(logistics))
        .then(
          response => {
            this.loading = false;
            if (response.data.body.status.statusCode == 0) {
              var data = response.data.body.data;
              this.$Notice.success({
                title: "该售后单已取消",
                duration: 2
              });
              this.getData();
            } else {
              this.$Message.error(response.data.body.status.errorDesc);
            }
          },
          response => {
            this.$Message.error(response.data.body.status.errorDesc);
            this.loading = false;
          }
        );
    },
    //支付单个售后单
    paySingleOrder(order) {
      let orders = [];
      orders.push(order);
      this.payOrder(orders);
    },
    //批量支付售后单
    payMultipleOrder() {
      if (this.selectedAfterSale.length === 0) {
        this.$Message.error("请选择至少一个售后单");
        return;
      }
      //检查是否所有售后单都处于可支付的状态
      var isValid = true;
      this.selectedAfterSale.forEach(function(val, index) {
        if (val.orderStatus != "0") {
          isValid = false;
        }
      });
      if (!isValid) {
        this.$Message.error("请检查选中售后单是否都处于待付款状态");
        return;
      }
      this.payMultipleOrderLoading = true;
      this.payOrder(this.selectedAfterSale);
    },
    //支付售后单实际调用后台
    payOrder(selectedAfterSale) {
      let orders = [];
      selectedAfterSale.forEach(function(val, index) {
        orders.push({
          orderNo: val.orderNo
        });
      });
      this.$http
        .post(
          "/admin/payOrder",
          this.common.request({
            orders: orders
          })
        )
        .then(
          response => {
            this.payMultipleOrderLoading = false;
            if (response.data.body.status.statusCode == 0) {
              var data = response.data.body.data;
              this.$Notice.success({
                title: "售后单已成功支付",
                duration: 2
              });
              this.getData();
            } else {
              this.$Message.error(response.data.body.status.errorDesc);
            }
          },
          response => {
            this.$Message.error(response.data.body.status.errorDesc);
            this.payMultipleOrderLoading = false;
          }
        );
    },
    // clickSearchOrderNoSupplier() {
    //   if (this.dateSearchType === "4") {
    //     if (this.searchDateRange.length === 0) {
    //       this.dateSearchType = "3";
    //     }
    //     if (this.searchDateRange.length === 2) {
    //       if (this.searchDateRange[(0, 1)] === null) {
    //         this.dateSearchType = "3";
    //       }
    //     }
    //   }
    //   this.searchOrderNo = null;
    // },

    //售后单状态查询状态改变
    selectOrderStatus() {
      if (this.searchDateRange.length === 0) {
        this.dateSearchType = "3";
      }
      if (this.searchDateRange.length === 2) {
        if (this.searchDateRange[(0, 1)] === null) {
          this.dateSearchType = "3";
        }
      }
      this.searchOrderNo = null;
    },
    //日期查询条件改变
    dateChange() {
      this.searchOrderNo = null;
      this.dateSearchType = "4";
    },
    //重新获取售后单数据
    getData() {
      this.resetpage(); //重置为第一页
      this.searchAfterSale(this.startIndex, this.pageSize);
    },
    //重置分页
    resetpage() {
      this.$nextTick(function() {
        this.$refs["orderpage"].currentPage = 1;
      });
    },
    //备注售后单实际调用后台
    commentok() {
      let options = {
        orderNo: this.commentRow.orderNo,
        orderComment: this.commentRow.orderComment
      };
      this.commentLoading = true;
      this.$http.post("/admin/commentOrder", this.common.request(options)).then(
        response => {
          this.commentLoading = false;
          if (response.data.body.status.statusCode == 0) {
            this.commentModal = false;
            this.$Notice.success({
              title: "已查看售后单备注信息",
              duration: 2
            });
            this.getData();
          } else {
            this.$Message.error(response.data.body.status.errorDesc);
          }
        },
        response => {
          this.commentLoading = false;
          this.$Message.error(response.data.body.status.errorDesc);
        }
      );
    },
    //详情售后单实际调用后台
    editok(ref) {
      this.$refs[ref].validate(valid => {
        if (valid) {
          let options = {
            orderNo: this.viewRow.orderNo,
            deliveryStreet: this.viewRow.deliveryStreet,
            deliveryName: this.viewRow.deliveryName,
            deliveryContactNo: this.viewRow.deliveryContactNo,
            actualPoint: this.viewRow.actualPoint
          };
          this.editLoading = true;
          this.$http
            .post("/admin/editOrder", this.common.request(options))
            .then(
              response => {
                this.editLoading = false;
                if (response.data.body.status.statusCode == 0) {
                  this.viewModal = false;
                  this.$Notice.success({
                    title: "售后单已成功修改",
                    duration: 2
                  });
                  this.getData();
                } else {
                  this.$Message.error(response.data.body.status.errorDesc);
                }
              },
              response => {
                this.editLoading = false;
                this.$Message.error(response.data.body.status.errorDesc);
              }
            );
        }
      });
    },
    //拒绝退款申请实际调用后台
    rejectok() {
      let that = this;
      let options = {
        saleNo: this.rejectRow.saleNo,
        rejectReason: this.rejectReason
      };
      this.rejectLoading = true;
      this.$http.post("/admin/rejectOrderAfterSale", this.common.request(options)).then(
        response => {
          this.rejectLoading = false;
          if (response.data.body.status.statusCode == 0) {
            this.$Message.success("已拒绝售后申请");
            this.rejectModal = false;
            this.getData();
          } else {
            this.$Message.error(response.data.body.status.errorDesc);
          }
        },
        response => {
          this.$Message.error(response.data.body.status.errorDesc);
          this.rejectLoading = false;
        }
      );
    },
    //点击导出售后单
    exportAfterSale() {
      //选择导出指定售后单
      if (this.selectedAfterSale.length > 0) {
        this.exportAfterSaleCsv(this.selectedAfterSale);
      } else {
        //导出查询出的所有售后单(因为当前为分页查询, 所以需要重新查询根据条件查询出的售后单)
        if (this.total == 0) {
          this.$Message.error("当前没有售后单可导出");
          return;
        }
        this.searchAfterSale(0, this.total, true);
      }
    },
    //搜索售后单实际调用后台
    searchAfterSale(startIndex, pageSize, isExport) {
      let that = this;
      if (!isExport) {
        this.loading = true;
        this.selectedAfterSale = [];
      } else {
        this.exportLoading = true;
      }
      let searchOptions = {
        startIndex: startIndex,
        pageSize: pageSize
      };
      let keyArray = [];
      //选择日期
      if (this.dateSearchType) {
        let dateType = this.dateSearchType;
        let startDate = null;
        let endDate = null;
        let currentDate = new Date();
        if (dateType == "1") {
          startDate = currentDate;
          endDate = currentDate;
        } else if (dateType == "2") {
          currentDate.setDate(currentDate.getDate() - 1);
          startDate = currentDate;
          endDate = currentDate;
        } else if (dateType == "3") {
          let tDate = new Date();
          tDate.setDate(currentDate.getDate() - 7);
          startDate = tDate;
          endDate = currentDate;
        } else if (dateType == "4") {
          let t = this.searchDateRange;
          let startDateT = t[0];
          let endDateT = t[1];
          startDate = startDateT;
          endDate = endDateT;
        }
        keyArray.push("APPLICATION_TIME");
        searchOptions.applicationDateStart = startDate;
        searchOptions.applicationDateEnd = endDate;
      }
      //订单单编号
      if (this.searchOrderNo) {
        keyArray.push("ORDERNO");
        searchOptions.orderNo = this.searchOrderNo;
      }
      //售后单编号
      if (this.searchSaleNo) {
        keyArray.push("SALENO");
        searchOptions.saleNo = this.searchSaleNo;
      }
      //会员手机号码
      if (this.searchPersonalPhone) {
        keyArray.push("PERSONALPHONE");
        searchOptions.personalPhone = this.searchPersonalPhone;
      }
      //售后单状态
      if (this.searchStatus) {
        keyArray.push("STATUS");
        searchOptions.status = this.searchStatus;
      }
      //售后类型
      if (this.searchAfterSaleType) {
        keyArray.push("SALETYPE");
        searchOptions.saleType = this.searchAfterSaleType;
      }
      searchOptions.keyArray = keyArray;
      //准备完查询条件, 调用后台
      this.$http
        .post("/admin/searchOrderAfterSale", this.common.request(searchOptions))
        .then(
          response => {
            this.loading = false;
            this.exportLoading = false;
            if (response.data.body.status.statusCode == 0) {
              var data = response.data.body.data;
              var afterSaleList = [];
              data.afterSaleList.forEach(function(val, index) {
                val.statusDesc = that.common.translateAfterSaleStatus(
                  val.status
                );
                val.afterSaleTypeDesc = that.common.translateAfterSaleType(
                  val.afterSaleType
                );
                val.userinfo =
                  val.orderDTO.userDTO.name +
                  val.orderDTO.userDTO.personalPhone;
                val.orderNo = val.orderDTO.orderNo;
                afterSaleList.push(val);
              });
              this.afterSaleData = afterSaleList;
              this.total = data.total;
              if (isExport) {
                this.exportAfterSaleCsv(this.afterSaleData);
              }
            } else {
              this.loading = false;
              this.$Message.error(response.data.body.status.errorDesc);
            }
          },
          response => {
            this.$Message.error(response.data.body.status.errorDesc);
            this.loading = false;
            this.exportLoading = false;
          }
        );
    },
    //导出售后单列表到cvs文件
    exportAfterSaleCsv(afterSaleList) {
      var exportList = [
        "售后单记录",
        this.afterSaleExportColumn,
        afterSaleList
      ];
      this.exportPreparedData(exportList);
    },
    //处理分页-页数改变
    changePage(index) {
      this.startIndex = (index - 1) * this.pageSize;
      this.searchAfterSale(this.startIndex, this.pageSize);
    },
    //查看会员详情
    viewMember(row) {
      this.$router.push({
        name: "memberdetail",
        query: { userUuid: row.userDTO.userUuid }
      });
    },
    //售后单详情页
    viewAfterSale(row) {
      this.viewModal = true;
      this.viewRow = row;
    },
    //实际通过前端exportCsv组件生成csv文件
    exportPreparedData(exportList) {
      this.$refs.deliveryTable.exportCsv({
        filename: exportList[0],
        columns: exportList[1],
        data: exportList[2]
      });
      this.exportLoading = false;
    }
  },
  created() {
    //进入页面默认搜索售后单
    this.getData();
  }
};
</script>
