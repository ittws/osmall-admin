<style lang="less">
@import "../../styles/common.less";
</style>

<template>
  <div>
    <Row class="margin-top-10">
      <Col span="24">
        <Card>
          <p slot="title">划拨明细</p>
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
                placeholder="划拨日期"
                style="width: 200px"
              ></DatePicker>
            </RadioGroup>
            <Input v-model="searchMerchantName" placeholder="商家名称" style="width: 150px" clearable />
            <Input v-model="searchMerchantMobileNo" placeholder="商家联系电话" style="width: 150px" clearable />
            <Input v-model="searchName" placeholder="会员姓名" style="width: 150px" clearable />
            <Input v-model="searchPersonalPhone" placeholder="会员手机号码" style="width: 150px" clearable />
            <Button type="success" @click="searchData()">查询</Button>
            <div class="f_r">
                <Button icon="document-text" type="warning" @click="exportAssign()" :loading="exportLoading">导出</Button>
            </div>
          </Row>
          <Row class="margin-top-10">
            <Col span="24">
              <div>
                <Table :columns="assignColumn" :data="assignData" :loading="loading" border stripe></Table>
              </div>
            </Col>
          </Row>
          <Row class="margin-top-10">
            <Col span="12">
              <Page
                ref="assignpage"
                :total="total"
                size="small"
                :pageSize="pageSize"
                @on-change="changepage"
                show-total
                show-elevator
              ></Page>
            </Col>
            <Col span="6" class="t_r">
              消费金额合计
              <Span style="color:red;">{{totalAmount}}元</Span>
            </Col>
            <Col span="6" class="t_c">
              划拨购币合计
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
      searchName: "",
      searchPersonalPhone: "",
      searchMerchantName: "",
      searchMerchantMobileNo: "",
      searchDate: [],
      dateSearchType: "1",
      loading: false,
      exportLoading: false,
      assignColumn: [],
      assignData: [],
      total: 0,
      totalAmount: 0.0,
      totalPoint: 0,
      pageSize: 20
    };
  },
  methods: {
    getData() {
      this.assignColumn = [
        {
          title: "划拨日期",
          align: "center",
          key: "assignTime",
          width: 100
        },
        {
          title: "商家名称",
          align: "center",
          width: 150,
          key: 'merchantName',
          render: (h, params) => {
            let userName = params.row.merchantDTO.merchantName;
            return h("span", {}, userName);
          }
        },
        {
          title: "商家联系电话",
          align: "center",
          width: 120,
          key: 'merchantMobileNo',
          render: (h, params) => {
            let userName = params.row.merchantDTO.mobileNo;
            return h("span", {}, userName);
          }
        },
        {
          title: "会员姓名",
          align: "center",
          width: 100,
          key: 'userName',
          render: (h, params) => {
            let userName = params.row.userDTO.name;
            return h("span", {}, userName);
          }
        },
        {
          title: "会员手机号码",
          align: "center",
          width: 120,
          key: 'userPersonalPhone',
          render: (h, params) => {
            let personalPhone = params.row.userDTO.personalPhone;
            return h("span", {}, personalPhone);
          }
        },
        {
          title: "消费金额",
          align: "center",
          key: "tranAmount",
          width: 100
        },
        {
          title: "划拨购币",
          align: "center",
          key: "assignPoint",
          width: 100
        },
        {
          title: "划拨前商家购币",
          align: "center",
          key: "merchantPointBefore",
          width: 140,
          sortable: true
        },
        {
          title: "划拨后商家购币",
          align: "center",
          key: "merchantPointAfter",
          width: 140,
          sortable: true
        },
        {
          title: "划拨前会员购币",
          align: "center",
          key: "userPointBefore",
          width: 140,
          sortable: true
        },
        {
          title: "划拨后会员购币",
          align: "center",
          key: "userPointAfter",
          sortable: true
        }
      ];
    },
    initData() {
      this.searchMerchantAssign(0, this.pageSize,false);
    },
    searchData() {
      this.searchMerchantAssign(0, this.pageSize,false);
      this.resetpage();
    },
    exportAssign(){
      this.exportLoading = true;
      this.searchMerchantAssign(0,this.total, true);
    },
    searchMerchantAssign(startIndex, pageSize, isExport) {
      let searchOptions = {
        startIndex: startIndex,
        pageSize: pageSize
      };
      let keyArray = [];
      //判断是否有姓名查询条件
      if (this.searchName) {
        keyArray.push("USERNAME");
        searchOptions.userName = this.searchName;
      }
      //判断是否有手机号码查询条件
      if (this.searchPersonalPhone) {
        keyArray.push("USERPERSONALPHONE");
        searchOptions.userPersonalPhone = this.searchPersonalPhone;
      }
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
        keyArray.push("ASSIGNDATE");
        searchOptions.assignDateStart = startDate;
        searchOptions.assignDateEnd = endDate;
      }
      searchOptions.keyArray = keyArray;
      if (!isExport) {
          this.loading = true;
      }
      this.$http
        .post("/admin/searchAssign", this.common.request(searchOptions))
        .then(
          response => {
            if (response.data.body.status.statusCode == 0) {
              this.loading = false;
              var data = response.data.body.data;
              if(!isExport){
                this.assignData = data.assignList;
                this.total = data.total;
                this.totalPoint = data.totalPoint;
                this.totalAmount = data.totalAmount;
              }else{
                  var assignList = data.assignList;
                  assignList.forEach((val,index) => {
                      val.userName = val.userDTO.name;
                      val.userPersonalPhone = val.userDTO.personalPhone;
                      val.merchantName = val.merchantDTO.merchantName;
                      val.merchantMobileNo = val.merchantDTO.mobileNo;
                  });
                  this.$refs.exportTable.exportCsv({
                      filename: '划拨明细',
                      columns:this.assignColumn,
                      data:assignList,
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
        this.$refs["assignpage"].currentPage = 1;
      });
    },
    //处理分页页数改变, 重新查询该页数据
    changepage(index) {
      var startIndex = (index - 1) * this.pageSize;
      this.searchMerchantAssign(startIndex, this.pageSize,false);
    }
  },
  mounted() {
    this.merchantMobileNo = localStorage["name"];
    this.getData();
    this.initData();
  }
};
</script>