<style lang="less">
@import "../../styles/common.less";
</style>

<template>
  <div>
    <Row class="margin-top-10">
      <Col span="24">
        <Card class="margin-top-10">
          <p slot="title">商家入驻审核</p>
          <Row>
            <Input v-model="searchName" style="width:150px" placeholder="商家名称"></Input>
            <Input v-model="searchMobileNo" style="width:150px" placeholder="手机号码"></Input>
            <Select v-model="searchStatus" style="width:150px" placeholder="申请状态">
              <Option value>全部</Option>
              <Option value="0">待审核</Option>
              <Option value="1">已通过</Option>
              <Option value="2">未通过</Option>
            </Select>
            <Button type="success" @click="handleSearch()">查询</Button>
          </Row>
          <Row class="margin-top-10">
            <Col span="24">
              <div>
                <Table
                  :columns="applicationColumn"
                  :loading="loading"
                  :data="applicationData"
                  border
                  stripe
                  ref="memberupgradeTable"
                ></Table>
              </div>
            </Col>
          </Row>
          <Row class="margin-top-10">
            <Col span="18">
              <Page
                ref="memberupgradepage"
                :total="total"
                size="small"
                :pageSize="pageSize"
                @on-change="changepage"
                show-total
                show-elevator
              ></Page>
            </Col>
          </Row>
          <Modal v-model="rejectModel" width="400px" ref="rejectModelRef" title="拒绝原因">
            <Input type="text" v-model="rejectReason" style="width:360px"></Input>
            <div slot="footer">
              <Button type="text" @click="cancel">取消</Button>
              <Button type="primary" @click="auditok()">提交</Button>
            </div>
          </Modal>
        </Card>
      </Col>
    </Row>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      rejectModel: false,
      loading: false,
      rejectReason: "",
      rejectApplication: {},
      applicationColumn: [],
      applicationData: [],
      total: 0,
      pageSize: 20,
      searchName: "",
      searchMobileNo: "",
      searchStatus: ""
    };
  },
  methods: {
    getData() {
      this.applicationColumn = [
        {
          title: "申请时间",
          align: "center",
          key: "applicationTime",
          sortable: true,
          width: 150
        },
        {
          title: "商家名称",
          align: "center",
          width: 300,
          render: (h, params) => {
            return h("div", [
              h("span", {}, params.row.merchantName)
            ]);
          }
        },
        {
          title: "商家电话",
          align: "center",
          width: 150,
          render: (h, params) => {
            return h("div", [h("span", {}, params.row.mobileNo)]);
          }
        },
        {
          title: "商家地址",
          align: "center",
          width: 300,
          render: (h, params) => {
            return h("div", [
              h("span", {}, params.row.merchantAddress)
            ]);
          }
        },
        {
          title: "审核状态",
          align: "center",
          width: 150,
          render: (h, params) => {
            let verifyStatus = params.row.applicationStatus;
            let verify = [];
            let color = "";
            if (verifyStatus == "0") {
              color = "gray";
              verify = "待审核";
            } else if (verifyStatus == "1") {
              color = "green";
              verify = "已通过";
            } else if (verifyStatus == "2") {
              color = "red";
              verify = "未通过";
            }
            return h(
              "tag",
              {
                props: {
                  color: color,
                  type: "dot"
                }
              },
              verify
            );
          }
        },
        {
          title: "备注",
          align: "center",
          key: "memo"
        },
        {
          title: "操作",
          align: "center",
          width: 140,
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "success",
                    size: "small",
                    disabled: params.row.applicationStatus != "0" ? true : false
                  },
                  style: {
                    margin: "0 5px 0 0"
                  },
                  on: {
                    click: event => {
                      this.auditok(params.row);
                    }
                  }
                },
                "同意"
              ),
              h(
                "Poptip",
                {
                  props: {
                    confirm: true,
                    title: "您确定拒绝此申请吗?",
                    transfer: true
                  },
                  on: {
                    "on-ok": () => {
                      this.reject(params.row);
                    }
                  }
                },
                [
                  h(
                    "Button",
                    {
                      props: {
                        type: "error",
                        size: "small",
                        disabled: params.row.applicationStatus != "0" ? true : false
                      },
                      style: {
                        margin: "0 5px 0 0"
                      }
                    },
                    "拒绝"
                  )
                ]
              )
            ]);
          }
        }
      ];
    },
    searchMerchantApplication(pageNo) {
      let keyArray = [];
      let searchOptions = {
        startIndex: (pageNo - 1) * this.pageSize,
        pageSize: this.pageSize
      };
      if (this.searchName) {
        keyArray.push("MERCHANT_NAME");
        searchOptions.merchantName = this.searchName;
      }
      if (this.searchMobileNo) {
        keyArray.push("MERCHANT_MOBILENO");
        searchOptions.merchantMobileNo = this.searchMobileNo;
      }
      if (this.searchStatus) {
        keyArray.push("APPLICATION_STATUS");
        searchOptions.status = this.searchStatus;
      }
      searchOptions.keyArray = keyArray;
      this.loading = true;
      this.$http
        .post(
          "/admin/searchMerchantApplication",
          this.common.request(searchOptions)
        )
        .then(
          response => {
            this.loading = false;
            if (response.data.body.status.statusCode == 0) {
              var data = response.data.body.data;
              this.applicationData = data.applications;
              this.total = data.total;
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
    reject(row) {
      this.rejectModel = true;
      this.rejectFlag = "1";
      this.rejectApplication = row;
    },
    cancel() {
      this.rejectModel = false;
    },
    //处理分页-页数改变
    changepage(pageNo) {
      this.searchMerchantApplication(pageNo);
    },
    handleSearch() {
      this.searchMerchantApplication(1);
    },
    auditok(row) {
      if (this.rejectFlag === "1") {
        this.rejectModel = false;
        var options = {
          actionType: "REJECT",
          memo: this.rejectReason,
          merchantApplicationUuid: this.rejectApplication.merchantApplicationUuid
        };
      } else {
        var options = {
          actionType: "APPROVE",
          merchantApplicationUuid: row.merchantApplicationUuid
        };
      }
      this.loading = true;
      this.$http
        .post(
          "/admin/auditMerchantApplication",
          this.common.request(options)
        )
        .then(
          response => {
            this.loading = false;
            if (response.data.body.status.statusCode == 0) {
              var data = response.data.body.data;
              this.$Notice.success({
                title: "操作成功",
                duration: 2
              });
              this.searchMerchantApplication(1);
            } else {
              this.$Notice.error({
                title: "失败",
                desc: response.data.body.status.errorDesc,
                duration: 2
              });
            }
          },
          response => {
            this.loading = false;
            this.$Message.error("出错了，请稍后重试");
          }
        );
    }
  },
  created() {
    this.getData();
    this.searchMerchantApplication(1);
  }
};
</script>
