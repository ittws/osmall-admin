<style lang="less">
@import "../../styles/common.less";
</style>

<template>
  <div>
    <Row class="margin-top-10">
      <Col span="24">
        <Card>
          <p slot="title">充值明细</p>
          <Row>
            <RadioGroup v-model="dateSearchType">
              <Radio label="1">今日</Radio>
              <Radio label="2">昨日</Radio>
              <Radio label="3">最近七日</Radio>
              <Radio label="4" disabled>自定义时间段</Radio>
              <DatePicker
                v-model="searchDate"
                @click.native="dateSearchType=4"
                type="daterange"
                placement="bottom-end"
                placeholder="充值日期"
                style="width: 200px"
              ></DatePicker>
            </RadioGroup>
            <Input v-model="searchMerchantName" placeholder="商家名称" style="width: 150px" clearable />
            <Input
              v-model="searchMerchantMobileNo"
              placeholder="商家联系电话"
              style="width: 150px"
              clearable
            />
            <Button type="success" @click="searchData()">查询</Button>
            <div class="f_r">
              <Button
                icon="document-text"
                type="warning"
                @click="exportCharge()"
                :loading="exportLoading"
              >导出</Button>
            </div>
          </Row>
          <Row class="margin-top-10">
            <Col span="24">
              <div>
                <Table :columns="chargeColumn" :data="chargeData" :loading="loading" border stripe></Table>
              </div>
            </Col>
          </Row>
          <Row class="margin-top-10">
            <Col span="12">
              <Page
                ref="chargepage"
                :total="total"
                size="small"
                :pageSize="pageSize"
                @on-change="changepage"
                show-total
                show-elevator
              ></Page>
            </Col>
            <Col span="6" class="t_r">
              充值金额合计
              <Span style="color:red;">{{totalAmount}}元</Span>
            </Col>
            <Col span="6" class="t_c">
              获得购币合计
              <Span style="color:red;">{{totalPoint}}</Span>
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
    <Table ref="exportTable" style="display:none"></Table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      merchantMobileNo: "", //当前登录商家电话号码
      searchDate: [],
      dateSearchType: "1",
      searchMerchantName: "",
      searchMerchantMobileNo: "",
      loading: false,
      exportLoading: false,
      chargeColumn: [],
      chargeData: [],
      total: 0,
      totalAmount: 0.0,
      totalPoint: 0,
      pageSize: 20
    };
  },
  methods: {
    getData() {
      this.chargeColumn = [
        {
          title: "商家名称",
          align: "center",
          key: "merchantName",
          width: 200,
          render: (h, params) => {
            return h("span", {}, params.row.merchantDTO.merchantName);
          }
        },
        {
          title: "联系电话",
          align: "center",
          key: "mobileNo",
          width: 150,
          render: (h, params) => {
            return h("span", {}, params.row.merchantDTO.mobileNo);
          }
        },
        {
          title: "充值日期",
          align: "center",
          key: "chargeTime",
          width: 200
        },
        {
          title: "充值金额",
          align: "center",
          key: "chargeAmount",
          width: 150,
          sortable: true
        },
        {
          title: "获得购币",
          align: "center",
          key: "chargePoint",
          width: 200
        },
        {
          title: "支付方式",
          align: "center",
          key: "paymentMethodTranslate",
          width: 150,
          render: (h, params) => {
            let paymentMethod = params.row.paymentMethod;
            if (paymentMethod === "WECHAT") {
              return h("span", {}, "微信");
            } else if (paymentMethod === "ALIPAY") {
              return h("span", {}, "支付宝");
            }
          }
        },
        {
          title: "充值前购币",
          align: "center",
          key: "pointBefore",
          width: 150
        },
        {
          title: "充值后购币",
          align: "center",
          key: "pointAfter"
        }
      ];
    },
    initData() {
      this.searchMerchantCharge(0, this.pageSize, false);
    },
    searchData() {
      this.searchMerchantCharge(0, this.pageSize, false);
      this.resetpage();
    },
    exportCharge() {
      this.exportLoading = true;
      this.searchMerchantCharge(0, this.total, true);
    },
    searchMerchantCharge(startIndex, pageSize, isExport) {
      let searchOptions = {
        startIndex: startIndex,
        pageSize: pageSize
      };
      let keyArray = [];
      //判断是否有商家名称查询条件
      if (this.searchMerchantName) {
        keyArray.push("MERCHANTNAME");
        searchOptions.merchantName = this.searchMerchantName;
      }
      //判断是否有商家联系电话查询条件
      if (this.searchMerchantMobileNo) {
        keyArray.push("MOBILENO");
        searchOptions.mobileNo = this.searchMerchantMobileNo;
      }
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
          let t = this.searchDate;
          let startDateT = t[0];
          let endDateT = t[1];
          startDate = startDateT;
          endDate = endDateT;
        }
        keyArray.push("CHARGEDATE");
        searchOptions.chargeDateStart = startDate;
        searchOptions.chargeDateEnd = endDate;
      }
      searchOptions.keyArray = keyArray;
      if (!isExport) {
        this.loading = true;
      }
      this.$http
        .post("/admin/searchCharge", this.common.request(searchOptions))
        .then(
          response => {
            this.loading = false;
            if (response.data.body.status.statusCode == 0) {
              var data = response.data.body.data;
              if (!isExport) {
                this.chargeData = data.charges;
                this.total = data.total;
                this.totalPoint = data.totalPoint;
                this.totalAmount = data.totalAmount;
              } else {
                var charges = data.charges;
                charges.forEach((val, index) => {
                  var paymentMethod = val.paymentMethod;
                  if (paymentMethod == "WECHAT")
                    val.paymentMethodTranslate = "微信";
                  else if (paymentMethod == "ALIPAY")
                    val.paymentMethodTranslate = "支付宝";
                  val.merchantName = val.merchantDTO.merchantName;
                  val.mobileNo = val.merchantDTO.mobileNo;
                });
                this.$refs.exportTable.exportCsv({
                  filename: "充值明细",
                  columns: this.chargeColumn,
                  data: charges
                });
                this.exportLoading = false;
              }
            } else {
              this.$Message.error(response.data.body.status.errorDesc);
            }
          },
          response => {
            this.loading = false;
            this.$Message.error(response.data.body.status.errorDesc);
          }
        );
    },
    //将分页页码重置成1
    resetpage() {
      this.$nextTick(function() {
        this.$refs["chargepage"].currentPage = 1;
      });
    },
    //处理分页页数改变, 重新查询该页数据
    changepage(index) {
      var startIndex = (index - 1) * this.pageSize;
      this.searchMerchantCharge(startIndex, this.pageSize, false);
    }
  },
  mounted() {
    this.merchantMobileNo = localStorage["name"];
    this.getData();
    this.initData();
  }
};
</script>