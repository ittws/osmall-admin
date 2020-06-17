
<style lang="less">
@import "../../styles/common.less";
</style>

<template>
  <div>
    <Spin size="large" fix v-if="spinShow" class="mask"></Spin>
    <Form :label-width="90">
      <Card>
        <p slot="title">会员基础信息</p>
        <Row type="flex" justify="start">
          <Col span="8">
            <FormItem label="编号:">{{user.id}}</FormItem>
          </Col>
          <Col span="8">
            <FormItem label="会员等级:">{{userLevelDTO.name}}</FormItem>
          </Col>
          <Col span="8">
            <FormItem label="注册日期:">{{user.registerDate}}</FormItem>
          </Col>
        </Row>
        <Row type="flex" justify="start">
          <Col span="8">
            <FormItem label="姓名:">{{user.name}}</FormItem>
          </Col>
          <Col span="8">
            <FormItem label="电话号码:">{{user.personalPhone}}</FormItem>
          </Col>
          <Col span="8">
            <FormItem label="身份证号码:">{{user.idCardNo}}</FormItem>
          </Col>
        </Row>
        <Row type="flex" justify="start">
          <Col span="8">
            <FormItem label="推荐人:">{{supervisorL1.name}}</FormItem>
          </Col>
        </Row>
      </Card>
      <Card class="margin-top-10">
        <p slot="title">数据概览</p>
        <Row type="flex" justify="start">
          <Col span="4" class="t_c">
            <i-circle :percent="100">
              <span class="demo-Circle-inner" style="font-size:24px">
                <span style="color: #3f414d;font-weight: normal;">{{user.total}}</span>
                <p style="color: #657180;font-size:14px;margin: 10px 0 15px;">会员总数</p>
              </span>
            </i-circle>
          </Col>
          <Col span="4" class="t_c">
            <i-circle :percent="100">
              <span class="demo-Circle-inner" style="font-size:24px">
                <span
                  style="color: #3f414d;font-weight: normal;"
                >{{userBalanceDTO.availableBalance}}</span>
                <p style="color: #657180;font-size:14px;margin: 10px 0 15px;">可提现余额</p>
              </span>
            </i-circle>
          </Col>
          <Col span="4" class="t_c">
            <i-circle :percent="100" stroke-color="#5cb85c">
              <span class="demo-Circle-inner" style="font-size:24px">
                <span style="color: #3f414d;font-weight: normal;">{{user.productUnit}}</span>
                <p style="color: #657180;font-size:14px;margin: 10px 0 15px;">购买总数量</p>
              </span>
            </i-circle>
          </Col>
          <Col span="4" class="t_c">
            <i-circle :percent="100" stroke-color="orange">
              <span class="demo-Circle-inner" style="font-size:24px">
                <span style="color: #3f414d;font-weight: normal;">{{user.productAmount}}</span>
                <p style="color: #657180;font-size:14px;margin: 10px 0 15px;">购买总金额</p>
              </span>
            </i-circle>
          </Col>
          <Col span="4" class="t_c">
            <i-circle :percent="100" stroke-color="#ff5500">
              <span class="demo-Circle-inner" style="font-size:24px">
                <span style="color: #3f414d;font-weight: normal;">{{user.awardAmount}}</span>
                <p style="color: #657180;font-size:14px;margin: 10px 0 15px;">奖金总金额</p>
              </span>
            </i-circle>
          </Col>
        </Row>
        <Row type="flex" justify="start">
          <Col span="4" class="t_c">
            <Button @click="viewSsubordinate" size="small" :loading="loadings">会员拓扑图</Button>
          </Col>
        </Row>
      </Card>
      <Collapse v-model="cOrder" class="margin-top-10" style="background-color:#fff">
        <Panel name="1">
          会员列表
          <Row></Row>
          <Row slot="content">
            <Col span="24" class="margin-top-10">
              <Button type="success" @click="oneCatalog()">直接推荐人</Button>
              <Button type="success" @click="twoCatalog()">间接推荐人</Button>
              <Button
                icon="document-text"
                type="warning"
                :loading="loadingdc"
                @click="exportMember()"
              >导出会员</Button>
            </Col>
            <Col span="24" class="margin-top-10">
              <div>
                <Table
                  :columns="memberColumn"
                  :data="MemberData"
                  :loading="loading1"
                  border
                  stripe
                  ref="orderTable"
                ></Table>
              </div>
            </Col>
          </Row>
          <Row class="margin-top-10" slot="content">
            <Page
              ref="memberpage"
              :total="total"
              size="small"
              :pageSize="pageSize"
              @on-change="changepage"
              show-total
              show-elevator
            ></Page>
          </Row>
        </Panel>
      </Collapse>
      <Collapse v-model="cOrder" class="margin-top-10" style="background-color:#fff">
        <Panel name="2">
          订单记录
          <Row></Row>
          <Row slot="content">
            <!-- <Col span="24">
                     <Button icon="document-text" type="warning" @click="exportOrder()">导出订单</Button>
            </Col>-->
            <Col span="24" class="margin-top-10">
              <div>
                <Table
                  :columns="orderColumn"
                  height="300"
                  :data="orderData"
                  border
                  stripe
                  ref="orderTable"
                ></Table>
              </div>
            </Col>
          </Row>
          <Table ref="deliveryTable1" style="display:none"></Table>
        </Panel>
      </Collapse>
      <Collapse v-model="cIncome" class="margin-top-10" style="background-color:#fff">
        <Panel name="4">
          奖金明细
          <Row slot="content">
            <Col span="24">
              <RadioGroup v-model="dateSearchType">
                <Radio label="1">今日</Radio>
                <Radio label="2">昨日</Radio>
                <Radio label="3">最近七日</Radio>
                <Radio label="4">自定义时间段</Radio>
                <DatePicker
                  v-model="customsj"
                  type="daterange"
                  placement="bottom-end"
                  placeholder="奖金日期"
                  style="width: 200px"
                ></DatePicker>
              </RadioGroup>
              <Select clearable v-model="searchRewardType" placeholder="奖金类型" style="width: 120px">
                <Option v-for="item in awardTypes" :value="item" :key="item"></Option>
              </Select>
              <!--暂不分页-->
              <Button
                :loading="userAwardSearchLoading"
                type="success"
                @click="searchUserAward(0,100000)"
              >查询</Button>
              <Button
                icon="document-text"
                height="300"
                type="warning"
                @click="exportIncome()"
              >导出奖金明细</Button>
            </Col>
            <Col span="24" class="margin-top-10">
              <div>
                <Table :columns="incomeColumn" :data="incomeData" border stripe ref="incomeTable"></Table>
              </div>
            </Col>
          </Row>
        </Panel>
      </Collapse>
      <Collapse v-model="cWithdraw" class="margin-top-10" style="background-color:#fff">
        <Panel name="5">
          提现记录
          <Row slot="content">
            <!-- <Col span="24">
                     <Button icon="document-text"  height="300"  type="warning" @click="exportWithdraw()">导出提现记录</Button>
            </Col>-->
            <Col span="24" class="margin-top-10">
              <div>
                <Table
                  :columns="withdrawColumn"
                  :data="withdrawData"
                  border
                  stripe
                  ref="withdrawTable"
                ></Table>
              </div>
            </Col>
          </Row>
        </Panel>
      </Collapse>
    </Form>

    <Modal v-model="showSubordinate" width="800" cancel-text title="会员拓扑图">
      <Tree :data="supervisor" :load-data="loadSuperiorData"></Tree>
    </Modal>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading1: false,
      loadings: false,
      userAwardSearchLoading: false,
      exportData: [],
      user: {},
      cOrder: [],
      cDelivery: [],
      cIncome: [],
      deliveryList: [],
      cWithdraw: [],
      pageSize: 6,
      total: 0,
      loadingdc: false,
      userBalanceDTO: [],
      showSubordinate: false,
      loading: true,
      subordinate: 1,
      userLevelDTO: [],
      merchantDTO: [],
      supervisorL1: [],
      userInventoryDTO: [],
      spinShow: true,
      supervisor: [],
      MemberData: [],
      withdrawData: [],
      incomeData: [],
      deliveryData: [],
      memberColumn1: [],
      orderData: [],
      searchRewardType: "",
      awardTypes: [],
      dateSearchType: "1",
      customsj: []
    };
  },
  methods: {
    Details() {
      this.memberColumn1 = [
        {
          title: "编号",
          key: "id"
        },
        {
          title: "姓名",
          key: "name"
        },
        {
          title: "会员等级",
          key: "userLevelName"
        },
        {
          title: "所属驿站",
          key: "merchantAddress"
        },
        {
          title: "邀请人",
          key: "supervisorL1Name"
        },
        {
          title: "直接辅导人",
          key: "supervisorL2Name"
        },
        {
          title: "间接辅导人",
          key: "supervisorL3Name"
        },
        {
          title: "手机号码",
          key: "personalPhone"
        },
        {
          title: "身份证号码",
          key: "idCardNo"
        },
        {
          title: "注册日期",
          key: "registerDate"
        },
        {
          title: "可提现余额",
          key: "availablebalance"
        }
      ];
      (this.memberColumn = [
        {
          title: "会员编号",
          align: "center",
          key: "id",
          width: 90
        },
        {
          title: "姓名",
          align: "center",
          key: "name",
          width: 120
        },
        {
          title: "会员等级",
          align: "center",
          key: "userLevelName",
          width: 115,
          filters: [
            {
              label: "普通会员",
              value: "普通会员"
            },
            {
              label: "推广会员",
              value: "推广会员"
            },
            {
              label: "健康天使会员",
              value: "健康天使会员"
            },
            {
              label: "天使会员",
              value: "天使会员"
            }
          ],
          filterMultiple: false,
          filterMethod(value, row) {
            return row.memberLevel === value;
          }
        },
        {
          title: "直接邀请人",
          align: "center",
          key: "supervisorL1Name",
          width: 115
        },
        {
          title: "手机号码",
          align: "center",
          key: "personalPhone",
          width: 115
        },
        {
          title: "身份证号码",
          align: "center",
          key: "idCardNo",
          width: 140
        },
        {
          title: "注册日期",
          align: "center",
          key: "createDate",
          width: 150,
          sortable: true
        }
        // {
        //     title: '操作',
        //     align: 'center',
        //     width:130,
        //     render: (h, params) => {
        //         return h('div', [
        //             h('Button',{
        //                 props: {
        //                     type: 'default',
        //                     size: 'small'
        //                 },
        //                 style: {
        //                     margin: '0 5px 0 0'
        //                 },
        //                 on: {
        //                     click: (event) => {
        //                         this.view(params.row);
        //                     }
        //                 }
        //             },'会员详情'),
        //             ])
        //     }
        // }
      ]),
        (this.orderColumn = [
          {
            title: "订单编号",
            align: "center",
            key: "orderNo",
            width: 150
          },
          {
            title: "日期",
            align: "center",
            key: "orderTime",
            width: 150
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
            key: "productAmount",
            width: 115
          },
          {
            title: "实付金额",
            align: "center",
            key: "actualAmount",
            width: 115
          },
          {
            title: "订单状态",
            align: "center",
            width: 120,
            render: (h, params) => {
              let orderStatus = params.row.orderStatus;
              let orderStatusDesc = this.common.translateOrderStatus(orderStatus);
              return h("span", {}, orderStatusDesc);
            }
          },
          {
            title: "收货人",
            align: "center",
            key: "deliveryName",
            width: 115
          },
          {
            title: "联系电话",
            align: "center",
            key: "deliveryContactNo",
            width: 115
          },
          {
            title: "收货地址",
            align: "center",
            render: (h, params) => {
              let address = params.row.deliveryProvince+params.row.deliveryCity+params.row.deliveryArea+params.row.deliveryStreet;
              return h("span", {}, address);
            }
          },
        ]),
        (this.deliveryColumn = [
          {
            title: "申请日期",
            align: "center",
            key: "applicationTime",
            width: 150
          },
          {
            title: "数量",
            align: "center",
            width: 80,
            key: "deliveryQuantity"
          },
          {
            title: "收货方式",
            align: "center",
            key: "deliveryType",
            width: 120
          },
          {
            title: "邮政编码",
            align: "center",
            key: "deliveryPostCode",
            width: 120
          },
          {
            title: "物流编号",
            align: "center",
            key: "courierNo",
            width: 150
          },
          {
            title: "收货(自提)地址",
            align: "center",
            key: "deliveryAddress",
            width: 240
          },
          {
            title: "状态",
            align: "center",
            key: "deliveryStatus",
            width: 120
          }
        ]),
        (this.incomeColumn = [
          {
            title: "奖金类型",
            align: "center",
            key: "transactionType",
            width: 120
          },
          {
            title: "日期",
            align: "center",
            key: "transactionTime"
          },
          {
            title: "奖金金额",
            align: "center",
            key: "transactionAmount",
            width: 120
          },
          {
            title: "备注",
            align: "center",
            key: "transactionDesc"
          }
        ]),
        (this.withdrawColumn = [
          {
            title: "编号",
            align: "center",
            key: "withdrawNo",
            width: 150
          },
          {
            title: "提现日期",
            align: "center",
            key: "withdrawTime",
            width: 150
          },
          {
            title: "提现金额",
            align: "center",
            key: "withdrawAmount",
            width: 90
          },

          {
            title: "状态",
            align: "center",
            width: 120,
            render: (h, params) => {
              let withdrawStatus = params.row.withdrawStatus;
              let zhuangtai = "";
              if (withdrawStatus === "1") {
                zhuangtai = "已同意";
              }
              if (withdrawStatus === "2") {
                zhuangtai = "已拒绝";
              }
              if (withdrawStatus === "3") {
                zhuangtai = "打款成功";
              }
              if (withdrawStatus === "4") {
                zhuangtai = "打款失败";
              }
              return h("span", {}, zhuangtai);
            }
          },
          {
            title: "账户类型",
            align: "center",
            width: 120,
            render: (h, params) => {
              let paymentMethod = params.row.paymentMethod;
              let bankName = params.row.bankName;
              let zhuangtai = "";
              if (paymentMethod === "1") {
                zhuangtai = bankName;
              }
              if (paymentMethod === "2") {
                zhuangtai = "支付宝";
              }
              return h("span", {}, zhuangtai);
            }
          },
          {
            title: "账户号",
            align: "center",
            width: 150,
            render: (h, params) => {
              let paymentMethod = params.row.paymentMethod;
              let zhuangtai = "";
              if (paymentMethod === "1") {
                zhuangtai = params.row.bankAccountNo;
              }
              if (paymentMethod === "2") {
                zhuangtai = params.row.alipayId;
              }
              return h("span", {}, zhuangtai);
            }
          },
          {
            title: "账户名称",
            align: "center",
            key: "bankAccountName",
            width: 110
          },
          {
            title: "审核日期",
            align: "center",
            key: "verifyTime",
            width: 150
          },
          {
            title: "打款日期",
            align: "center",
            key: "completeTime",
            width: 150
          },
          {
            title: "备注",
            align: "center",
            key: "comment"
          }
        ]);
      this.getData();
    },
    getData() {
      this.spinShow = true;
      var options = {
        userUuid: this.userUuid
      };
      this.$http.post("/admin/inquiryUser", this.common.request(options)).then(
        response => {
          if (response.data.body.status.statusCode == 0) {
            var data = response.data.body.data;
            this.user = data;
            if (this.deliveryList) {
              this.deliveryList = data.deliveryList;
            }
            if (data.userLevelDTO) {
              this.userLevelDTO = data.userLevelDTO;
            }
            if (data.merchantDTO) {
              this.merchantDTO = data.merchantDTO;
            }
            if (data.userInventoryDTO) {
              this.userInventoryDTO = data.userInventoryDTO;
            }
            if (data.userBalanceDTO) {
              this.userBalanceDTO = data.userBalanceDTO;
            }
            //推荐人
            if (data.supervisorL1) {
              this.supervisorL1 = data.supervisorL1;
            }
            //订单记录
            if (data.orderList) {
              this.orderData = data.orderList;
            }
            //奖金明细
            //if (data.awardList) {
            //    this.incomeData = data.awardList;
            //}
            //提货记录
            if (data.inventoryHistoryList) {
              this.deliveryData = data.inventoryHistoryList;
            }
            //提现记录
            if (data.withdrawList) {
              this.withdrawData = data.withdrawList;
            }
            this.spinShow = false;
            var supervisor = [];
            var superiorRoot = {
              title:
                data.name + "—" + data.userLevelName + "—" + data.personalPhone,
              expand: true,
              userUuid: data.userUuid,
              loading: false,
              children: []
            };
            supervisor.push(superiorRoot);
            this.supervisor = supervisor;
          } else {
            this.$Message.error(response.data.body.status.errorDesc);
          }
        },
        response => {
          this.$Message.error(response.data.body.status.errorDesc);
        }
      );
    },
    viewSsubordinate() {
      this.loadings = true;
      var supervisor = this.supervisor;
      this.supervisors = supervisor;
      supervisor.forEach((item, index) => {
        this.Initializethe = true;
        this.loadSuperiorData(item);
      });
    },
    searchUserAward(startIndex, pageSize) {
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
          let t = this.customsj;
          let startDateT = t[0];
          let endDateT = t[1];
          startDate = startDateT;
          endDate = endDateT;
        }
        keyArray.push("AWARDDATE");
        searchOptions.awardDateStart = startDate;
        searchOptions.awardDateEnd = endDate;
      }
      //奖金类型
      if (this.searchRewardType) {
        keyArray.push("TRANSACTIONTYPE");
        searchOptions.transactionType = this.searchRewardType;
      }
      keyArray.push("USER");
      searchOptions.userUuid = this.userUuid;

      searchOptions.keyArray = keyArray;
      this.userAwardSearchLoading = true;
      this.$http
        .post("/admin/searchUserAward", this.common.request(searchOptions))
        .then(
          response => {
            this.userAwardSearchLoading = false;
            if (response.data.body.status.statusCode == 0) {
              var data = response.data.body.data;
              this.incomeData = data.awards;
            } else {
              this.$Message.error(response.data.body.status.errorDesc);
            }
          },
          response => {
            this.userAwardSearchLoading = false;
            this.$Message.error(response.data.body.status.errorDesc);
          }
        );
    },
    inquiryAwardType() {
      let searchOptions = {};
      this.$http
        .post("/inquiryAwardType ", this.common.request(searchOptions))
        .then(
          response => {
            if (response.data.body.status.statusCode == 0) {
              var data = response.data.body.data;
              this.awardTypes = data.awardTypes;
            } else {
              this.$Message.error(response.data.body.status.errorDesc);
            }
          },
          response => {
            this.$Message.error(response.data.body.status.errorDesc);
          }
        );
    },
    // goodsData () {
    //     var options={
    //         userUuid:this.userUuid
    //     }
    //     this.$http.post("/searchUserDelivery", this.common.request(options))
    //     .then(response => {
    //         this.display1 = true;
    //         if(response.data.body.status.statusCode==0){
    //             var data = response.data.body.data;
    //         }else{
    //             this.$Message.error(response.data.body.status.errorDesc);
    //         }
    //     }, response => {
    //         this.loading = false;
    //         this.$Message.error(response.data.body.status.errorDesc);
    //     })
    // },
    view() {
      this.$router.push({
        name: "memberdetail"
      });
    },
    loadSuperiorData(item, callback) {
      var Initializethe = this.Initializethe;
      var that = this;
      setTimeout(() => {
        let options = {
          userUuid: item.userUuid
        };
        this.$http
          .post("/admin/inquiryL1User", this.common.request(options))
          .then(
            response => {
              if (response.data.body.status.statusCode == 0) {
                var data = response.data.body.data;
                var userList = data.userList;
                var length = userList.length;
                if (!Initializethe) {
                  if (length === 0) {
                    this.$Message.error("无下级会员");
                  }
                }
                var children = [];
                userList.forEach(function(val, index) {
                  var child = {
                    title:
                      val.name +
                      "—" +
                      val.userLevelName +
                      "—" +
                      val.personalPhone,
                    expand: true,
                    userUuid: val.userUuid,
                    loading: false,
                    children: []
                  };
                  children.push(child);
                });
                if (Initializethe) {
                  var supervisors = [];
                  supervisors.push(children);
                  that.supervisors[0].children = supervisors[0];
                  //三级目录
                  supervisors[0].forEach((temm, indexs) => {
                    let options = {
                      userUuid: temm.userUuid
                    };
                    this.$http
                      .post(
                        "/admin/inquiryL1User",
                        this.common.request(options)
                      )
                      .then(response => {
                        if (response.data.body.status.statusCode == 0) {
                          var data = response.data.body.data;
                          var userList = data.userList;
                          var children = [];
                          userList.forEach(function(val, index) {
                            var child = {
                              title:
                                val.name +
                                "—" +
                                val.userLevelName +
                                "—" +
                                val.personalPhone,
                              expand: true,
                              userUuid: val.userUuid,
                              loading: false,
                              children: []
                            };
                            children.push(child);
                          });
                          var supervisors = [];
                          supervisors.push(children);
                          that.supervisors[0].children[indexs].children =
                            supervisors[0];
                          that.supervisor = that.supervisors;
                        }
                      });
                  });
                  this.showSubordinate = true;
                  this.loadings = false;
                  that.Initializethe = false;
                } else {
                  callback(children);
                }
              } else {
                this.$Message.error(response.data.body.status.errorDesc);
                this.loadings = false;
              }
            },
            response => {
              this.$Message.error(response.data.body.status.errorDesc);
              this.loadings = false;
            }
          );
        // const data = [
        //     {
        //         title: '陈浩(18566778888)',
        //         loading: false,
        //         children: []
        //     }
        // ];
        // callback(data);
      }, 1000);
    },
    memberlista() {
      this.$router.push({
        name: "memberlist"
      });
    },
    stocklista() {
      this.$router.push({
        name: "stocklist"
      });
    },
    cashlista() {
      this.$router.push({
        name: "fundwithdraw"
      });
    },
    fundrewarda() {
      this.$router.push({
        name: "fundreward"
      });
    },
    Orderlista() {
      this.$router.push({
        name: "orderlist"
      });
    },
    capitallista() {
      this.$router.push({
        name: "fundoverview"
      });
    },
    exportOrder() {
      this.$refs.orderTable.exportCsv({
        filename: "订单列表"
      });
    },
    exportDelivery() {
      this.$refs.deliveryTable.exportCsv({
        filename: "提货列表"
      });
    },
    exportWithdraw() {
      this.$refs.withdrawTable.exportCsv({
        filename: "提现列表"
      });
    },
    exportIncome() {
      this.$refs.incomeTable.exportCsv({
        filename: "奖金明细"
      });
    },
    initPage(data) {
      //获取查询的数据并数据模型
      this.totalData = data;
      //数据总数量
      this.total = this.totalData.length;

      //处理默认首页显示
      if (this.totalData.length < this.pageSize) {
        this.MemberData = this.totalData;
      } else {
        this.MemberData = this.totalData.slice(0, this.pageSize);
      }
      //重新设置成显示第一页
      this.$nextTick(function() {
        this.$refs["memberpage"].currentPage = 1;
      });
    },
    //处理分页-页数改变
    changepage(index) {
      var _start = (index - 1) * this.pageSize;
      var _end = index * this.pageSize;
      this.MemberData = this.totalData.slice(_start, _end);
    },
    exportMember() {
      this.loadingdc = true;
      var exportData = this.exportData;
      this.$refs.deliveryTable1.exportCsv({
        filename: "会员列表",
        columns: exportData[1],
        data: exportData[2]
      });
      this.loadingdc = false;
    },
    oneCatalog() {
      this.loading1 = true;
      let options = {
        userUuid: this.userUuid
      };
      this.$http
        .post("/admin/inquiryL1User", this.common.request(options))
        .then(
          response => {
            if (response.data.body.status.statusCode == 0) {
              var data = response.data.body.data;
              var userList = data.userList;
              var userLists = ["会员列表", this.memberColumn1, data.userList];
              this.exportData = userLists;
              this.initPage(userList);
              this.loading1 = false;
            } else {
              this.$Message.error(response.data.body.status.errorDesc);
              this.loading1 = false;
            }
          },
          response => {
            this.$Message.error(response.data.body.status.errorDesc);
            this.loading1 = false;
          }
        );
    },
    twoCatalog() {
      this.loading1 = true;
      let options = {
        userUuid: this.userUuid
      };
      this.$http
        .post("/admin/inquiryL2User", this.common.request(options))
        .then(
          response => {
            if (response.data.body.status.statusCode == 0) {
              var data = response.data.body.data;
              var userList = data.userList;
              var userLists = ["会员列表", this.memberColumn1, data.userList];
              this.exportData = userLists;
              this.initPage(userList);
              this.loading1 = false;
            } else {
              this.$Message.error(response.data.body.status.errorDesc);
              this.loading1 = false;
            }
          },
          response => {
            this.$Message.error(response.data.body.status.errorDesc);
            this.loading1 = false;
          }
        );
    }
  },
  created() {
    this.userUuid = this.$route.query.userUuid;
    this.searchUserAward(0, 100000);
    this.Details();
    this.oneCatalog();
    this.inquiryAwardType();
  }
};
</script>
