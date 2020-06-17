<style lang="less">
@import "../styles/common.less";
</style>

<template>
  <div class="content">
    <Row type="flex" justify="start" class="t_c">
        <Col span="24">
            <h1>配货清单</h1>
          </Col></Row>
    <Spin size="large" v-if="spinShow" class="mask"></Spin>
    <Form :label-width="90">
        <Row type="flex" justify="start" class="margin-top-20">
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
          <Col span="8">
            <FormItem label="商家名称:">
              <span v-if="order.merchantDTO">{{order.merchantDTO.merchantName}}{{order.merchantDTO.merchantMobileNo}}</span>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="商品数量:">{{order.productUnit}}</FormItem>
          </Col>
          <Col span="8">
            <FormItem label="商品金额:">￥{{order.productAmount}}</FormItem>
          </Col>
           <Col span="8">
            <FormItem label="买家备注:">{{order.memo}}</FormItem>
          </Col>
        </Row>
        <Row class="margin-top-10">
          <Col span="24">
            <div>
              <Table :columns="productColumn" :data="productData" border stripe ref="productTable"></Table>
            </div>
          </Col>
        </Row>
        <Row type="flex" justify="start" class="margin-top-20">
          <Col span="6">
            <FormItem label="收件人姓名:">{{order.deliveryName}}</FormItem>
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
        <Row type="flex" justify="start" class="margin-top-20">
          <Col span="24">
            <Button id="printButton" style="width:100%;height:50px;font-size:18px" type="primary" @click="print">打印</Button>
          </Col>
        </Row>
    </Form>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      order: {},
      spinShow: false,
      productData: [],
      productColumn: [
        {
          title: "商品名称",
          key: "productName",
          width: 150
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
    print(){
        document.getElementById('printButton').style.display='none';
        window.print();
        document.getElementById('printButton').style.display='block';
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
<style>
page,.content{
   padding: 20px 100px 20px 100px; 
   background-color: #fff;
}
.ivu-form .ivu-form-item-label{
    font-size: 14px;
}
.ivu-form-item-content{
    font-size: 14px;
}
</style>
