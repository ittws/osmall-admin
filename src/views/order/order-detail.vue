<style lang="less">
@import "../../styles/common.less";
</style>

<template>
  <div>
    <Spin size="large" v-if="spinShow" class="mask"></Spin>
    <Form :label-width="90">
      <Card>
        <p slot="title">基础信息</p>
        <Row type="flex" justify="start">
          <Col span="8">
            <FormItem label="订单编号:">{{order.orderNo}}</FormItem>
          </Col>
          <Col span="8">
            <FormItem label="下单日期:">{{order.orderTime}}</FormItem>
          </Col>
          <Col span="8">
            <FormItem label="下单会员:">
              <span v-if="order.userDTO">{{order.userDTO.name}}{{order.userDTO.personalPhone}}</span>
            </FormItem>
          </Col>
        </Row>
        <Row type="flex" justify="start">
          <Col span="8">
            <FormItem label="订单状态:"><Tag color="blue">{{order.orderStatusDesc}}</Tag></FormItem>
          </Col>
          <Col span="8">
            <FormItem label="订单渠道:">微信小程序</FormItem>
          </Col>
          <Col span="8">
            <FormItem label="支付方式:">{{order.paymentMethod}}</FormItem>
          </Col>
          <Col span="8">
            <FormItem label="商品数量:">{{order.productUnit}}</FormItem>
          </Col>
          <Col span="8">
            <FormItem label="商品金额:">￥{{order.productAmount}}</FormItem>
          </Col>
          <Col span="8">
            <FormItem label="优惠金额:">￥{{order.deductAmount}}</FormItem>
          </Col>
          <Col span="8">
            <FormItem label="运费:">￥{{order.freightAmount}}</FormItem>
          </Col>
          <Col span="8">
            <FormItem label="实付金额:"><Font color="#ed3f14" size="5">￥{{order.actualAmount}}</Font></FormItem>
          </Col>
        </Row>
      </Card>
      <Card class="margin-top-10">
        <p slot="title">商品</p>
        <Row>
          <Col span="24">
            <div>
              <Table :columns="productColumn" :data="productData" border stripe ref="productTable"></Table>
            </div>
          </Col>
        </Row>
      </Card>
      <Card>
        <p slot="title">收货人信息</p>
        <Row type="flex" justify="start">
          <Col span="6">
            <FormItem label="姓名:">{{order.deliveryName}}</FormItem>
          </Col>
          <Col span="6">
            <FormItem label="联系电话:">{{order.deliveryContactNo}}</FormItem>
          </Col>
          <Col span="6">
            <FormItem label="地址:">
              {{order.deliveryProvince || ""}}
              {{order.deliveryCity || ""}}
              {{order.deliveryArea || ""}}
              {{order.deliveryStreet || ""}}
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="邮编:">{{order.deliveryZipcode}}</FormItem>
          </Col>
        </Row>
      </Card>
      <Card>
        <p slot="title">买家备注</p>
        <Row type="flex" justify="start">
          <Col span="8">
            <FormItem>{{order.memo}}</FormItem>
          </Col>
        </Row>
      </Card>
      <Card class="margin-top-10" v-if="awardList.length>0">
            <p slot="title">
                奖金分配
            </p>
            <Row class="margin-top-10" type="flex" v-for="award in awardList">
                <Col span="4">
                    <a>{{award.userName}}</a>
                </Col>
                <Col span="4">
                    <a>{{award.userPersonalPhone}}</a>
                </Col>
                <Col span="4">
                   {{award.transactionType}}
                </Col>
                <Col span="4">
                   ￥&nbsp;{{award.transactionAmount}}
                </Col>
                <Col span="4">
                   {{award.transactionTime}}
                </Col>
            </Row>
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
  components: {},
  data() {
    return {
      order: {},
      awardList:[],
      spinShow: false,
      showPreviewImage: false,
      previewImageUrl: "",
      productData: [],
      productColumn: [
        {
          title: "商品名称",
          key: "productName",
          width: "200px"
        },
        {
          title: "商品图片",
          width: "200px",
          render: (h, params) => {
            return h("img", {
              attrs: {
                src: params.row.productImageUrl
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
                  this.previewProductImage(params.row.productImageUrl);
                }
              }
            });
          }
        },
        {
          title: "商品编码",
          align: "center",
          key: "productCode",
          width: 150
        },
        {
          title: "规格",
          align: "center",
          key: "productSkuDesc",
          width: 150
        },
        {
          title: "单价(元)",
          align: "center",
          key: "productUnitPrice",
          width: 150
        },
        {
          title: "数量",
          align: "center",
          key: "productUnit",
          width: 150
        },
        {
          title: "金额(元)",
          align: "center",
          key: "productAmount",
          width: 150
        }
      ]
    };
  },
  methods: {
    //预览照片
    previewProductImage(url) {
      this.showPreviewImage = true;
      this.previewImageUrl = url;
    },
    inquiryOrder() {
      let searchOptions = {
        orderNo: this.orderNo
      };
      this.spinShow = true;
      this.$http
        .post("/admin/inquiryOrder", this.common.request(searchOptions))
        .then(
          response => {
            this.spinShow = false;
            if (response.data.body.status.statusCode == 0) {
              var data = response.data.body.data;
              this.order = data;
              this.productData = data.orderProductDTOList;
              this.order.orderStatusDesc = this.common.translateOrderStatus(
                this.order.orderStatus
              );
              this.awardList = data.awardList;
            } else {
              this.$Message.error(response.data.body.status.errorDesc);
            }
          },
          response => {
            this.$Message.error(response.data.body.status.errorDesc);
            this.spinShow = false;
          }
        );
    }
  },
  created() {
    this.orderNo = this.$route.query.orderNo;
    this.inquiryOrder();
  }
};
</script>
