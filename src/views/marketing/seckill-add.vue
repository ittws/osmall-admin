<style lang="less">
@import "../../styles/common.less";
</style>

<template>
  <div>
    <Form ref="seckill" :model="secKill" :label-width="120">
      <Card>
        <p slot="title">秒杀活动</p>
        <Row>
          <Col span="24">
            <Row type="flex" justify="start">
              <Col span="8">
                <FormItem label="秒杀商品" prop="name">
                  <Select
                    v-model="productUuid"
                    filterable
                    clearable
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
            <Row type="flex" justify="start">
              <Col span="6">
                <FormItem label="秒杀开始时间">
                  <DatePicker
                    v-model="secKill.startTime"
                    type="datetime"
                    placeholder="选择秒杀开始时间"
                    style="width: 200px"
                  ></DatePicker>
                </FormItem>
              </Col>
            </Row>
            <Row type="flex" justify="start">
              <Col span="6">
                <FormItem label="秒杀结束时间">
                  <DatePicker
                    v-model="secKill.endTime"
                    type="datetime"
                    placeholder="选择秒杀结束时间"
                    style="width: 200px"
                  ></DatePicker>
                </FormItem>
              </Col>
            </Row>
            <Row type="flex" justify="start">
              <Col span="6">
                <FormItem label="商品库存">
                  <InputNumber :min="1" v-model="secKill.stock" style="width:100px"></InputNumber>
                </FormItem>
              </Col>
            </Row>
            <Row type="flex" justify="start">
              <Col span="6">
                <FormItem label="秒杀价格">
                  <InputNumber :min="0.01" v-model="secKill.unitPrice" style="width:100px"></InputNumber>
                </FormItem>
              </Col>
            </Row>
          </Col>
        </Row>
      </Card>
    </Form>

    <div class="margin-top-10">
      <Button size="large" type="default" @click="back()" class="margin-right-10">返回</Button>
      <Button type="primary" size="large" :loading="loading" @click="addSecKill" icon="checkmark">保存</Button>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      productUuid: null, //秒杀商品
      secKill: {  //form对象
        stock: 100,
        unitPrice:1.00,
      }, 
      products: [], //秒杀商品商品查询
      loading: false
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
    addSecKill() {
      let that = this;
      if (!that.productUuid) {
        that.$Message.error("未选择秒杀商品");
        return;
      }
      if (!that.secKill.startTime) {
        that.$Message.error("未指定秒杀开始时间");
        return;
      } else if (!that.secKill.endTime) {
        that.$Message.error("未指定秒杀结束时间");
        return;
      }
      if (that.secKill.startTime.getTime()>=that.secKill.endTime.getTime()) {
        that.$Message.error("结束时间需晚于开始时间");
        return;
      }
      let options = {
        actionType: "ADD",
        productDTO: {
          productUuid: this.productUuid
        },
        stock: that.secKill.stock,
        unitPrice: that.secKill.unitPrice,
        startTime: that.secKill.startTime.format('yyyy-MM-dd hh:mm:ss'),
        endTime: that.secKill.endTime.format('yyyy-MM-dd hh:mm:ss')
      };
      //编辑模式
      if (this.editMode) {
        options.actionType = "MODIFY";
        options.secKillProductUuid = this.secKillProductUuid;
      }
      this.loading = true;
      this.$http.post("/admin/changeSecKill", this.common.request(options)).then(
        response => {
          this.loading = false;
          if (response.data.body.status.statusCode == 0) {
            var data = response.data.body.data;
            this.$Notice.success({
              title: "成功",
              desc: "秒杀活动已保存",
              duration: 2
            });
            this.$router.push({
              name: "seckillproduct"
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
    inquirySecKill(secKillProductUuid) {
      let that = this;
      let options = {
        secKillProductUuid: secKillProductUuid
      };
      that.$http
        .post("/admin/inquirySecKill", that.common.request(options))
        .then(
          response => {
            that.loading = false;
            if (response.data.body.status.statusCode == 0) {
              var data = response.data.body.data;
              that.secKill = data;
              //编辑模式, 初始化优惠券适用商品
              var products = [];
              products.push(that.secKill.productDTO);
              that.products = products; 
            } else {
            }
          },
          response => {}
        );
    },
  },
  created() {
    this.secKillProductUuid = this.$route.params.secKillProductUuid;
    if (this.secKillProductUuid) {
      this.editMode = true;
      this.inquirySecKill(this.secKillProductUuid);
    } else {
      this.searchProduct("");
    }
  }
};
</script>
