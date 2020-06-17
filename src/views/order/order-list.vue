<style lang="less">
@import "../../styles/common.less";
</style>

<template>
  <div>
    <Row class="margin-top-10">
      <Col span="24">
        <Card>
          <p slot="title">订单列表</p>
          <Row>
            <RadioGroup v-model="dateSearchType" @on-change="changeSearchDate">
              <Radio label="1">今日</Radio>
              <Radio label="2">昨日</Radio>
              <Radio label="3">最近七日</Radio>
              <Radio label="4" disabled>自定义</Radio>
              <DatePicker
                v-model="searchDateRange"
                @click.native="dateChange"
                type="daterange"
                placement="bottom-end"
                placeholder="订单日期"
                style="width: 200px"
              ></DatePicker>
              <Input
                v-model="searchOrderNo"
                @click.native="clickSearchOrderNo"
                placeholder="订单编号"
                style="width: 120px"
              />
              <Select v-model="searchMerchant" placeholder="选择商家" style="width:120px"  filterable remote :remote-method="inquiryMerchant" :loading="merchantLoading" clearable>
                <Option
                  v-for="item in merchants"
                  :value="item.merchantUuid"
                  :key="item.merchantUuid"
                >{{item.merchantName}}
                </Option>
              </Select>
              <Input v-model="searchName" placeholder="会员姓名" style="width: 120px" />
              <!-- <Select clearable filterable v-model="supplierUuid" placeholder="供应商" style="width: 120px" @click.native="clickSearchOrderNoSupplier">
                            <Option
                            v-for="item in suppliers"
                            :value="item.supplierUuid"
                            :key="item.supplierUuid"
                            >{{ item.supplierName }}</Option>
              </Select>-->
              <Select
                clearable
                v-model="orderStatus"
                placeholder="订单状态"
                style="width: 120px"
                @click.native="selectOrderStatus"
              >
                <Option value="0">待付款</Option>
                <Option value="1">待发货</Option>
                <Option value="2">待收货</Option>
                <Option value="3">待评价</Option>
                <Option value="4">已取消</Option>
                <Option value="5">已完成</Option>
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
              <Button 
                :loading="printLoading" 
                @click="printOrder(0)" 
                type="info">打印</Button>
              <Button 
                class="margin-left-10" 
                @click="printOrder(1)" 
                type="info">配货单</Button>
              <Button
                class="margin-left-10"
                :loading="payMultipleOrderLoading"
                @click="payMultipleOrder"
                type="success"
              >批量支付</Button>
              <Button
                class="margin-left-10"
                @click="courierMultipleOrder"
                type="primary"
              >合并发货</Button>
              <Button
                class="margin-left-10"
                icon="document-text"
                type="warning"
                @click="exportOrder()"
                :loading="exportLoading"
              >导出</Button>
            </div>
          </Row>
          <Row class="margin-top-10">
            <Col span="24">
              <div>
                <Table :columns="orderExportColumn" style="display:none"></Table>
                <Table
                  @on-selection-change="selectOrder"
                  :columns="orderColumn"
                  :loading="loading"
                  :data="orderData"
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
            <Col span="6" class="t_r">
              订单合计
              <Icon type="social-yen" style="margin-left:20px"></Icon>
              <Span style="color:red;">{{totalAmount}}</Span>
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
    <Modal title="物流信息" v-model="courierModal" :closable="false" :mask-closable="false">
      <Form :label-width="90">
        <FormItem label="物流公司">
          <Select v-model="courierName" placeholder="请选择物流公司">
            <Option
              v-bind:key="courier.value"
              v-for="courier in courierList"
              :value="courier.value"
            >{{courier.value}}</Option>
          </Select>
        </FormItem>
        <FormItem label="物流单号">
          <Input type="text" v-model="courierNo" placeholder="请输入物流单号"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="couriercancel">取消</Button>
        <Button :loading="courierLoading" type="primary" @click="courierok">提交</Button>
      </div>
    </Modal>
    <Modal v-model="commentModal" width="400px" title="备注信息">
      <Input type="text" v-model="commentRow.orderComment" style="width:360px"></Input>
      <div slot="footer">
        <Button type="text" @click="commentcancel()">取消</Button>
        <Button :loading="commentLoading" type="primary" @click="commentok()">提交</Button>
      </div>
    </Modal>
    <Modal v-model="editModal" width="600px" title="修改订单" :closable="false" :mask-closable="false">
      <Form
        label-position="right"
        :label-width="80"
        :model="editRow"
        :rules="editOrderRule"
        ref="editOrder"
      >
        <Row type="flex" justify="start">
          <Col span="12">
            <FormItem label="订单号:">{{editRow.orderNo}}</FormItem>
          </Col>
          <Col span="12">
            <FormItem
              prop="deliveryStreet"
              label="收货地址:"
              :rules="{required: true, message: '收货地址不能为空', trigger: 'blur'}"
            >
              <Input v-model="editRow.deliveryStreet" style="width:90%"></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem
              prop="deliveryName"
              label="收货人:"
              :rules="{required: true, message: '收货人姓名不能为空', trigger: 'blur'}"
            >
              <Input v-model="editRow.deliveryName" style="width:90%"></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem prop="deliveryContactNo" label="联系电话:">
              <Input v-model="editRow.deliveryContactNo" style="width:90%"></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem prop="deliveryZipcode" label="邮编:">
              <Input v-model="editRow.deliveryZipcode" style="width:90%"></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem prop="actualAmount" label="实付金额:">
              <InputNumber
                :readonly="editRow.orderStatus!='0'"
                :min="0"
                v-model="editRow.actualAmount"
                style="width:90%"
              ></InputNumber>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot="footer">
        <Button type="text" @click="editcancel()">取消</Button>
        <Button :loading="editLoading" type="primary" @click="editok('editOrder')">提交</Button>
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
      merchantLoading: false, //搜索商家加载中
      merchants: [],      //搜索到的商家列表
      editLoading: false, //修改订单加载中
      courierLoading: false, //确认发货按钮加载中
      payMultipleOrderLoading: false, //点击批量支付按钮加载中
      exportLoading: false, //点击导出按钮加载中
      completeMultipleOrderLoading: false, //点击批量完成按钮加载中

      commentModal: false, //备注弹出框
      editModal: false, //编辑弹出框
      courierModal: false, //发货弹出框

      dateSearchType: "3", //查询条件日期选择(今日,昨日, 最近七天, 自定义时间段)
      orderStatus: "", //订单查询订单状态
      searchDateRange: [], //查询自定义订单日期范围
      searchOrderNo: "", //查询订单号
      searchName: "", //查询会员姓名
      searchMerchant: "", //查询商家
      loading: true, //订单数据表加载中状态
      printLoading: false,  //打印按钮加载中状态
      commentRow: {}, //备注订单弹框数据模型
      editRow: {}, //编辑订单弹框数据模型
      courierOrders: {}, //发货弹出框数据模型
      courierName: "", //快递公司
      courierNo: "", //快递单号
      //  suppliers: [],
      // supplierUuid: "",
      //订单导出列
      orderExportColumn: [
        {
          title: "订单号",
          key: "orderNo"
        },
        {
          title: "下单时间",
          key: "orderTime"
        },
        {
          title: "订单状态",
          key: "orderStatusDesc"
        },
        {
          title: "商家名称",
          key: "merchantName"
        },
        {
          title: "商家手机号码",
          key: "merchantMobileNo"
        },
        {
          title: "会员姓名",
          key: "userName"
        },
        {
          title: "会员手机号码",
          key: "userMobileNo"
        },
        {
          title: "收货类型",
          key: "deliveryTypeDesc"
        },
        {
          title: "收件人姓名",
          key: "deliveryName"
        },
        {
          title: "收件人手机号",
          key: "userPersonalPhone"
        },
        {
          title: "地址",
          key: "deliveryStreet"
        },
        {
          title: "邮编",
          key: "deliveryZipcode"
        },
        {
          title: "订单金额",
          key: "totalAmount"
        },
        {
          title: "订单来源",
          key: "orderChannel"
        },
        {
          title: "商品名称",
          key: "productName"
        },
        {
          title: "商品规格",
          key: "productSkuDesc"
        },
        {
          title: "商品编码",
          key: "productCode"
        },
        {
          title: "商品数量",
          key: "productUnit"
        },
        {
          title: "商品单价",
          key: "productUnitPrice"
        },
        {
          title: "商品金额",
          key: "productAmount"
        }
      ],
      //订单展示列
      orderColumn: [
        {
          type: "selection",
          align: "center",
          width: 60
        },
        {
          title: "下单时间",
          width: 150,
          align: "center",
          key: "orderTime"
        },
        {
          title: "订单号",
          align: "center",
          key: "orderNo",
          width: 150
        },
        {
          title: "商家名称",
          align: "center",
          key: "merchantName",
          width: 200
        },
        {
          title: "商家手机号码",
          align: "center",
          key: "merchantMobileNo",
          width: 150
        },
        {
          title: "会员信息",
          align: "center",
          width: 150,
          key: "userName",
          render: (h, params) => {
            var name = "";
            var personalPhone = "";
            if (params.row.userDTO) {
              name = params.row.userDTO.name||"";
            }
            if (params.row.userDTO) {
              personalPhone = params.row.userDTO.personalPhone||"";
            }
            return h("div", [
              h(
                "a",
                {
                  on: {
                    click: event => {
                      this.viewMember(params.row);
                    }
                  }
                },
                name + personalPhone
              )
            ]);
          }
        },
        {
          title: "商品数量",
          align: "center",
          key: "productUnit",
          width: 100
        },
        {
          title: "商品金额",
          align: "center",
          width: 100,
          key: "productAmount"
        },
        {
          title: "实付金额",
          align: "center",
          width: 100,
          key: "actualAmount"
        },
        {
          title: "订单状态",
          align: "center",
          width: 100,
          key: "orderStatus",
          render: (h, params) => {
            let isAfterSale = params.row.afterSale
            let orderStatus = params.row.orderStatus;
            if(!isAfterSale)
              return h("span", {}, this.common.translateOrderStatus(orderStatus));
            else
              return h("span", {}, '已申请退款');
          }
        },
        {
          title: "收货类型",
          width: 120,
          align: "center",
          key: "deliveryTypeDesc"
        },
        {
          title: "收货人",
          width: 120,
          align: "center",
          key: "deliveryName"
        },
        {
          title: "电话号码",
          width: 120,
          align: "center",
          key: "deliveryContactNo"
        },
        {
          title: "收货地址",
          width: 240,
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "span",
                {},
                (params.row.deliveryProvince || "") +
                  (params.row.deliveryCity || "") +
                  (params.row.deliveryArea || "") +
                  params.row.deliveryStreet
              )
            ]);
          }
        },
        {
          title: "物流公司",
          align: "center",
          key: "courierName",
          width: 150
        },
        {
          title: "物流单号",
          align: "center",
          key: "courierNo",
          width: 150
        },
        {
          title: "买家备注",
          align: "center",
          key: "memo",
          width: 150
        },
        {
          title: "订单备注",
          align: "center",
          key: "orderComment",
          width: 150
        },
        // {
        //     title: '供应商',
        //     width: 160,
        //     align: 'center',
        //     key:'supplierName'
        // },

        {
          title: "操作",
          align: "left",
          width: 300,
          fixed: "right",
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
                      this.viewOrder(params.row);
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
                      (params.row.orderStatus === "0" ||
                      params.row.orderStatus === "1") &&
                      !params.row.afterSale
                        ? "display"
                        : "none"
                  },
                  on: {
                    click: () => {
                      this.editOrder(params.row);
                    }
                  }
                },
                "编辑"
              ),
              h(
                "Poptip",
                {
                  props: {
                    confirm: true,
                    title: "请确认客户已经支付该订单?",
                    transfer: true
                  },
                  on: {
                    "on-ok": () => {
                      this.paySingleOrder(params.row);
                    }
                  }
                },
                [
                  h(
                    "Button",
                    {
                      props: {
                        type: "info",
                        size: "small"
                      },
                      style: {
                        margin: "0 5px 0 0",
                        display:
                          (params.row.orderStatus === "0" && !params.row.afterSale) ? "display" : "none"
                      }
                    },
                    "支付"
                  )
                ]
              ),
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  style: {
                    margin: "0 5px 0 0",
                    display: (params.row.orderStatus === "1" && !params.row.afterSale) ? "display" : "none"
                  },
                  on: {
                    click: () => {
                      this.courierOrder(params.row);
                    }
                  }
                },
                "发货"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  style: {
                    margin: "0 5px 0 0",
                    display: (params.row.orderStatus === "2" && !params.row.afterSale) ? "display" : "none"
                  },
                  on: {
                    click: () => {
                      this.courierOrder(params.row);
                    }
                  }
                },
                "修改物流"
              ),
              h(
                "Poptip",
                {
                  props: {
                    confirm: true,
                    title:
                      "如卖家已付款则款项将原路退回, 您确定要取消当前订单么?",
                    transfer: true
                  },
                  on: {
                    "on-ok": () => {
                      this.cancelOrder(params.row);
                    }
                  }
                },
                [
                  h(
                    "Button",
                    {
                      props: {
                        type: "error",
                        size: "small"
                        // disabled: params.row.orderStatus === '0'?false:true
                      },
                      style: {
                        margin: "0 5px 0 0",
                        display:
                          (params.row.orderStatus === "0" ||
                          params.row.orderStatus === "1") &&
                          !params.row.afterSale
                            ? "display"
                            : "none"
                      }
                    },
                    "取消"
                  )
                ]
              ),
              // h(
              //   "Poptip",
              //   {
              //     props: {
              //       confirm: true,
              //       title:
              //         "订单完成后将不能进行任何操作, 您确定要完成当前订单?",
              //       transfer: true
              //     },
              //     on: {
              //       "on-ok": () => {
              //         this.completeOrder(params.row);
              //       }
              //     }
              //   },
              //   [
              //     h(
              //       "Button",
              //       {
              //         props: {
              //           type: "success",
              //           size: "small"
              //         },
              //         style: {
              //           margin: "0 5px 0 0",
              //           display:
              //             params.row.orderStatus === "0" ||
              //             params.row.orderStatus === "3" ||
              //             params.row.orderStatus === "4" ||
              //             params.row.orderStatus === "5" ||
              //             params.row.afterSale
              //               ? "none"
              //               : "display"
              //         }
              //       },
              //       "完成"
              //     )
              //   ]
              // ),
              h(
                "Button",
                {
                  props: {
                    type: "default",
                    size: "small"
                  },
                  style: {
                    margin: "0 5px 0 0"
                  },
                  on: {
                    click: () => {
                      this.commentOrder(params.row);
                    }
                  }
                },
                "备注"
              )
            ]);
          }
        }
      ],
      orderData: [],
      totalAmount: "", //查询出的订单总金额
      selectedOrder: [], //订单多选框选中的订单
      total: 0, //查询出的订单总数量
      pageSize: 20, //每页条数
      startIndex: 0, //分页查询页码
      editOrderRule: {
        //编辑订单页面Form校验
        deliveryStreet: [
          { required: true, message: "收货地址必填", trigger: "blur" }
        ],
        deliveryContactNo: [
          { required: true, message: "收货地址必填", trigger: "blur" }
        ],
        deliveryName: [
          { required: true, message: "收货地址必填", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    //搜索订单商家
    inquiryMerchant(name) {
      var keyArray = [];
      var options = {
        startIndex: 0,
        pageSize: 20
      };
      if(name){
        keyArray.push('MERCHANTNAME');
        options.merchantName = name;
      }
      options.keyArray=keyArray;
      this.merchantLoading = true;
      this.$http
        .post("/admin/searchMerchant", this.common.request(options))
        .then(
          response => {
            this.merchantLoading = false;
            if (response.data.body.status.statusCode == 0) {
              var data = response.data.body.data;
              this.merchants = data.merchants;
            } else {
              this.$Message.error(response.data.body.status.errorDesc);
            }
          },
          response => {
            this.$Message.error("查询商家失败");
          }
        );
    },
    //订单多选框选中事件
    selectOrder(selection) {
      this.selectedOrder = selection;
    },
    //批量完成订单实际调用后台
    completeMultipleOrder() {
      var selection = this.selectedOrder;
      if (selection.length == 0) {
        this.$Message.error("请选择订单");
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
                  title: "订单已完成",
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
    //修改订单查询日期
    changeSearchDate() {
      this.searchOrderNo = null;
    },
    //弹出订单备注框
    commentOrder(row) {
      this.commentModal = true;
      this.commentRow = row;
    },
    //弹出订单修改框
    editOrder(row) {
      this.editModal = true;
      this.editRow = row;
    },
    //点击单个订单后面的发货
    courierOrder(row) {
      this.courierModal = true;
      var selectedOrder = [];
      selectedOrder.push(row);
      this.courierOrders = selectedOrder;
      this.courierName = row.courierName;
      this.courierNo = row.courierNo;
    },
    //点击合并发货
    courierMultipleOrder() {
      if (this.selectedOrder.length === 0) {
        this.$Message.error("请选择至少一个订单");
        return;
      }
      //检查是否所有订单都处于可发货的状态
      var isValid = true;
      this.selectedOrder.forEach(function(val, index) {
        if (val.orderStatus != "1") {
          isValid = false;
        }
      });
      if (!isValid) {
        this.$Message.error("请检查选中订单是否都处于待发货状态");
        return;
      }
      this.courierOrders = this.selectedOrder;
      this.courierModal = true;
    },
    //关闭评论订单模态框
    commentcancel() {
      this.commentModal = false;
    },
    //关闭编辑订单模态框
    editcancel() {
      this.editModal = false;
    },
    //关闭发货模态框
    couriercancel() {
      this.courierModal = false;
    },
    //点击搜索订单编号输入框, 其他搜索条件置空
    clickSearchOrderNo() {
      this.dateSearchType = null;
      this.searchDateRange = null;
      this.supplierUuid = null;
      this.orderStatus = null;
    },
    //完成订单实际调用后台
    completeOrder(e) {
      let logistics = {
        orderUuid: e.orderUuid
      };
      this.$http
        .post("/admin/completeOrder", this.common.request(logistics))
        .then(
          response => {
            this.loading = false;
            if (response.data.body.status.statusCode == 0) {
              var data = response.data.body.data;
              this.$Notice.success({
                title: "该订单已完成",
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
    //取消订单实际调用后台
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
                title: "该订单已取消",
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
    //支付单个订单
    paySingleOrder(order) {
      let orders = [];
      orders.push(order);
      this.payOrder(orders);
    },
    //批量支付订单
    payMultipleOrder() {
      if (this.selectedOrder.length === 0) {
        this.$Message.error("请选择至少一个订单");
        return;
      }
      //检查是否所有订单都处于可支付的状态
      var isValid = true;
      this.selectedOrder.forEach(function(val, index) {
        if (val.orderStatus != "0") {
          isValid = false;
        }
      });
      if (!isValid) {
        this.$Message.error("请检查选中订单是否都处于待付款状态");
        return;
      }
      this.payMultipleOrderLoading = true;
      this.payOrder(this.selectedOrder);
    },
    //支付订单实际调用后台
    payOrder(selectedOrder) {
      let orders = [];
      selectedOrder.forEach(function(val, index) {
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
                title: "订单已成功支付",
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

    //订单状态查询状态改变
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
    //重新获取订单数据
    getData() {
      this.resetpage(); //重置为第一页
      this.searchOrder(this.startIndex, this.pageSize);
    },
    //重置分页
    resetpage() {
      this.$nextTick(function() {
        this.$refs["orderpage"].currentPage = 1;
      });
    },
    //备注订单实际调用后台
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
              title: "已修改订单备注信息",
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
    //编辑订单实际调用后台
    editok(ref) {
      this.$refs[ref].validate(valid => {
        if (valid) {
          let options = {
            orderNo: this.editRow.orderNo,
            deliveryStreet: this.editRow.deliveryStreet,
            deliveryName: this.editRow.deliveryName,
            deliveryContactNo: this.editRow.deliveryContactNo,
            actualAmount: this.editRow.actualAmount
          };
          this.editLoading = true;
          this.$http
            .post("/admin/editOrder", this.common.request(options))
            .then(
              response => {
                this.editLoading = false;
                if (response.data.body.status.statusCode == 0) {
                  this.editModal = false;
                  this.$Notice.success({
                    title: "订单已成功修改",
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
    //确定发货实际调用后台
    courierok() {
      let that = this;
      if (this.courierName === "" || this.courierNo === "") {
        this.$Message.error("请填写物流信息");
        return;
      }
      var orderList = [];
      this.courierOrders.forEach(function(val, index) {
        let order = {};
        order.courierName = that.courierName;
        order.courierNo = that.courierNo;
        order.orderNo = val.orderNo;
        orderList.push(order);
      });
      let options = {
        orders: orderList
      };
      this.courierLoading = true;
      this.$http.post("/admin/deliverOrder", this.common.request(options)).then(
        response => {
          this.courierLoading = false;
          if (response.data.body.status.statusCode == 0) {
            this.$Message.success("订单发货成功");
            this.courierModal = false;
            this.getData();
          } else {
            this.$Message.error(response.data.body.status.errorDesc);
          }
        },
        response => {
          this.$Message.error(response.data.body.status.errorDesc);
          this.courierLoading = false;
        }
      );
    },
    //打印单据(1-配货单)
    printOrder(type) {
      if (this.selectedOrder.length === 0) {
        this.$Message.error("未选择订单");
        return;
      }
      if(type==0){
        this.printCloudOrder();
      }else{
        if (this.selectedOrder.length > 1) {
          this.$Message.error("每次只能打印一个配货单");
          return;
        }
        window.open("/#/print?type="+type+"&orderNo="+this.selectedOrder[0].orderNo,"_blank");
      }
    },
    //使用云端打印机
    printCloudOrder(){
      let orders = [];
      this.selectedOrder.forEach(function(val, index) {
        orders.push({
          orderNo: val.orderNo
        });
      });
      this.printLoading = true;
      this.$http
        .post(
          "/admin/printOrder",
          this.common.request({
            orders: orders
          })
        )
        .then(
          response => {
            this.printLoading = false;
            if (response.data.body.status.statusCode == 0) {
              var data = response.data.body.data;
              this.$Notice.success({
                title: "已发送打印指令",
                duration: 2
              });
            } else {
              this.$Message.error(response.data.body.status.errorDesc);
            }
          },
          response => {
            this.$Message.error(response.data.body.status.errorDesc);
            this.printLoading = false;
          }
        );
    },
    //点击导出订单
    exportOrder() {
      //选择导出指定订单
      if (this.selectedOrder.length > 0) {
        this.exportOrderCsv(this.selectedOrder);
      } else {
        //导出查询出的所有订单(因为当前为分页查询, 所以需要重新查询根据条件查询出的订单)
        if (this.total == 0) {
          this.$Message.error("当前没有订单可导出");
          return;
        }
        this.searchOrder(0, this.total, true);
      }
    },
    //搜索订单实际调用后台
    searchOrder(startIndex, pageSize, isExport) {
      if (!isExport) {
        this.loading = true;
        this.selectedOrder = [];
      } else {
        this.exportLoading = true;
      }
      let searchOptions = {
        startIndex: startIndex,
        pageSize: pageSize
      };
      let keyArray = [];
      keyArray.push('ORDER_TYPE_LIST');
      searchOptions.orderTypeList = ['0','1','2'];
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
        keyArray.push("ORDERDATE");
        searchOptions.orderDateStart = startDate;
        searchOptions.orderDateEnd = endDate;
      }
      //订单编号
      if (this.searchOrderNo) {
        keyArray.push("ORDERNO");
        searchOptions.orderNo = this.searchOrderNo;
      }
      //商家
      if (this.searchMerchant) {
        keyArray.push("MERCHANT");
        searchOptions.merchantUuid = this.searchMerchant;
      }
      //会员姓名
      if (this.searchName) {
        keyArray.push("NAME");
        searchOptions.name = this.searchName;
      }
      //供应商
      if (this.supplierUuid) {
        keyArray.push("SUPPLIER");
        searchOptions.supplierUuid = this.supplierUuid;
      }
      if (this.orderStatus) {
        keyArray.push("ORDERSTATUS");
        searchOptions.orderStatus = this.orderStatus;
      }
      searchOptions.keyArray = keyArray;
      //准备完查询条件, 调用后台
      this.$http
        .post("/admin/searchOrder", this.common.request(searchOptions))
        .then(
          response => {
            this.loading = false;
            this.exportLoading = false;
            if (response.data.body.status.statusCode == 0) {
              var data = response.data.body.data;
              if (isExport) {
                this.exportOrderCsv(data.orders);
              } else {
                this.orderData = data.orders;
                this.totalAmount = data.totalAmount;
              }
              this.total = data.total;
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
    //导出订单列表到cvs文件
    exportOrderCsv(orders) {
      let that = this;
      var orderExportData = [];
      orders.forEach((val, indx) => {
        var singleOrderExportData = that.prepareSingleOrderExportData(val);
        orderExportData = orderExportData.concat(singleOrderExportData);
      });
      var exportList = ["订单记录", this.orderExportColumn, orderExportData];
      this.exportPreparedData(exportList);
    },
    //准备单个订单导出数据
    prepareSingleOrderExportData(order) {
      var exportData = [];
      var productList = order.orderProductDTOList;
      order.orderStatusDesc = this.common.translateOrderStatus(
        order.orderStatus
      );
      order.userName = order.userDTO == null ? "" : order.userDTO.name;
      order.userMobileNo =
        order.userDTO == null ? "" : order.userDTO.personalPhone;
      order.totalAmount = order.productAmount;
      //订单只有一种商品, csv里一行显示
      if (productList.length === 1) {
        var product = productList[0];
        order.productName = product.productName;
        order.productSkuDesc = product.productSkuDesc;
        order.productCode = product.skuEnable
          ? productSkuDTO.skuCode
          : product.productCode;
        order.productUnit = product.productUnit;
        order.productUnitPrice = product.skuEnable
          ? productSkuDTO.skuUnitPrice
          : product.productUnitPrice;
        order.productAmount = product.productAmount;
        exportData.push(order);
        return exportData;
      }
      //订单有多种商品, csv里多行显示每种商品
      else {
        exportData.push(order);
        productList.forEach(function(val, index) {
          exportData.push(val);
        });
        return exportData;
      }
    },
    //处理分页-页数改变
    changePage(index) {
      this.startIndex = (index - 1) * this.pageSize;
      this.searchOrder(this.startIndex, this.pageSize);
    },
    //查看会员详情
    viewMember(row) {
      this.$router.push({
        name: "memberdetail",
        query: { userUuid: row.userDTO.userUuid }
      });
    },
    //订单详情页
    viewOrder(row) {
      this.$router.push({
        name: "orderdetail",
        query: { orderNo: row.orderNo }
      });
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
    //进入页面默认搜索订单
    this.getData();
  }
};
</script>
