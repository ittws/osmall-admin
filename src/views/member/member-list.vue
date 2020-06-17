<style lang="less">
@import "../../styles/common.less";
@import "./user-list.less";
.ivu-form-item-label {
  text-align: left;
  margin-left: 12px;
}
.vertical-center-modal {
  position: absolute;
  top: -5%;
  left: 35%;
}
</style>

<template>
  <div>
    <Row class="margin-top-10">
      <Col span="24">
        <Card>
          <p slot="title">会员列表</p>
          <Row>
            <Input
              v-model="searchName"
              placeholder="姓名"
              style="width: 100px"
              @on-change="conhidi1"
            />
            <Select clearable v-model="searchLevel" style="width:100px" @on-change="conhidi0">
              <Option
                v-for="item in userLevels"
                :value="item.userLevelUuid"
                :key="item.userLevelUuid"
              >{{item.name}}</Option>
            </Select>
            <Input
              v-model="searchIdCardNo"
              placeholder="身份证号码"
              style="width: 150px"
              @on-change="conhidi2"
            />
            <Input
              v-model="searchPersonalPhone"
              placeholder="手机号码"
              style="width: 120px"
              @on-change="conhidi3"
            />
            <DatePicker
              type="daterange"
              v-model="searchRegisterDate"
              @click.native="conhidi4"
              placement="bottom-end"
              placeholder="注册日期"
              style="width: 200px"
            ></DatePicker>
            <Button type="success" @click="searchData()">查询</Button>
            <div class="f_r">
              <Button icon="plus" type="primary" @click="add()">新增会员</Button>
              <Button
                icon="document-text"
                type="warning"
                @click="allMember()"
                :loading="loadingExport"
              >导出</Button>
            </div>
          </Row>

          <Row class="margin-top-10">
            <Col span="24">
              <div>
                <Table
                  :columns="memberColumn"
                  :data="memberData"
                  :loading="loading"
                  border
                  stripe
                  @on-row-dblclick="view"
                ></Table>
              </div>
            </Col>
          </Row>
          <Row class="margin-top-10">
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
        </Card>
        <Table ref="deliveryTable" style="display:none"></Table>
      </Col>
    </Row>

    <Modal v-model="showInfo" title="修改资料">
      <Form :label-width="120">
        <FormItem label="姓名">
          <Input v-model="infoUser.newName" style="width:90%"></Input>
        </FormItem>
        <FormItem label="手机号码">
          <Input v-model="infoUser.newPersonalPhone" style="width:90%"></Input>
        </FormItem>

        <FormItem label="身份证号码">
          <Input v-model="infoUser.newIdCardNo" style="width:90%"></Input>
        </FormItem>
        <FormItem label="会员级别">
          <Select v-model="infoUser.newUserLevel" style="width:90%">
            <Option
              v-for="item in userLevels"
              :value="item.userLevelUuid"
              :key="item.userLevelUuid"
            >{{ item.name }}</Option>
          </Select>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="infocancel">取消</Button>
        <Button :loading="infoLoading" type="primary" @click="infook">确定</Button>
      </div>
    </Modal>

    <Modal v-model="addModel" title="新增会员">
      <Form :label-width="120">
        <FormItem label="姓名">
          <Input v-model="addRow.name" style="width:90%"></Input>
        </FormItem>
        <FormItem label="手机号码">
          <Input v-model="addRow.personalPhone" style="width:90%"></Input>
        </FormItem>

        <FormItem label="身份证号码">
          <Input v-model="addRow.idCardNo" style="width:90%"></Input>
        </FormItem>
        <FormItem label="会员级别">
          <Select v-model="addRow.userLevelUuid" style="width:90%">
            <Option
              v-for="item in userLevels"
              :value="item.userLevelUuid"
              :key="item.userLevelUuid"
            >{{ item.name }}</Option>
          </Select>
        </FormItem>
        <FormItem label="上级会员">
          <Select
            v-model="addRow.supervisorUserUuid"
            filterable
            remote
            clearable
            :remote-method="searchUserByName"
            :loading="userLoading"
            style="width:90%"
          >
            <Option
              v-for="item in userList"
              :value="item.userUuid"
              :key="item.userUuid"
            >{{item.name}}-{{item.personalPhone}}</Option>
          </Select>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="addcancel">取消</Button>
        <Button :loading="addLoading" type="primary" @click="addok">确定</Button>
      </div>
    </Modal>
    <Modal v-model="showBalance" title="修改余额" @on-ok="inventoryok" @on-cancel="inventorycancel">
      <Form :label-width="120">
        <Alert type="warning">可提现余额指会员能立即提现的金额</Alert>
        <FormItem label="当前可提现余额">{{balanceUser.userBalanceDTO.availableBalance}}</FormItem>

        <FormItem label="更新后可提现余额">
          <InputNumber :min="0" v-model="balanceUser.newAvailableBalance" style="width:90%"></InputNumber>
        </FormItem>
        <Alert type="warning">未到账余额指会员已获取但暂不能提现的金额</Alert>
        <FormItem label="当前未到账余额">{{balanceUser.userBalanceDTO.ledgerBalance}}</FormItem>
        <FormItem label="更新后未到账余额">
          <InputNumber :min="0" v-model="balanceUser.newLedgerBalance" style="width:90%"></InputNumber>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="balancecancel">取消</Button>
        <Button :loading="balanceLoading" type="primary" @click="balanceok">确定</Button>
      </div>
    </Modal>
    <Modal v-model="changeSupervisorModal" title="修改邀请人" :closable="false">
      <Form :model="changeSupervisorRow" :label-width="90">
        <FormItem
          label="当前邀请人"
        >{{changeSupervisorRow.supervisorL1Name}} - {{changeSupervisorRow.supervisorL1PersonalPhone}}</FormItem>
        <FormItem label="新邀请人">
          <Select
            v-model="changeSupervisorRow.newSupervisorUserUuid"
            filterable
            remote
            clearable
            :remote-method="searchUserByName"
            :loading="userLoading"
            style="width:90%"
          >
            <Option
              v-for="item in userList"
              :value="item.userUuid"
              :key="item.userUuid"
            >{{item.name}}-{{item.personalPhone}}</Option>
          </Select>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="supervisorcancel">取消</Button>
        <Button :loading="supervisorLoading" type="primary" @click="supervisorok">确定</Button>
      </div>
    </Modal>
    <Modal v-model="memoModal" width="400px" title="备注信息">
      <Input type="text" v-model="editRow.memo" style="width:360px"></Input>
      <div slot="footer">
        <Button type="text" @click="memocancel">取消</Button>
        <Button type="primary" :loading="loadingmemo" @click="memook()">提交</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
export default {
  data() {
    return {
      changeSupervisorRow: {},
      addModel: false,
      addLoading: false,
      supervisorLoading: false,
      memoModal: false,
      changeSupervisorModal: false,
      editRow: {},
      userLevels: [],
      model2: "",
      expor1: "0",
      loading: false,
      loadingmemo: false,
      inventoryLoading: false,
      balanceLoading: false,
      infoLoading: false,
      searchName: "",
      exportData: [],
      params: [],
      searchIdCardNo: "",
      searchPersonalPhone: "",
      searchRegisterDate: null,
      newTrainerLevel: "",
      showUpgrade: false,
      showInventory: false,
      showInfo: false,
      showBalance: false,
      addModel: false,
      editRoleModel: false,
      loadingExport: false,
      multipleCouponModel: false,
      editRow: {},
      addRow: {},
      multipleCouponRow: {},
      userColumn: [],
      memberColumn: [],
      memberColumn1: [],
      searchLevel: "",
      totalData: [],
      userData: [],
      memberData: [],
      userList: [],
      userLoading: false,
      upgradeUser: {},
      inventoryUser: {
        userInventoryDTO: {},
        userBalanceDTO: {}
      },
      balanceUser: {
        userInventoryDTO: {},
        userBalanceDTO: {}
      },
      infoUser: {
        userInventoryDTO: {},
        userBalanceDTO: {}
      },
      addUser: {
        userInventoryDTO: {},
        userBalanceDTO: {}
      },
      total: 0,
      pageSize: 20,
      totala: 0,
      pageSizea: 99999
    };
  },
  methods: {
    addcancel() {
      this.addModel = false;
    },
    memo(row) {
      this.memoModal = true;
      this.editRow = row;
    },
    memocancel() {
      this.memoModal = false;
    },
    memook() {
      let logistics = {
        actionType: "MEMO",
        userUuid: this.editRow.userUuid,
        memo: this.editRow.memo
      };
      this.loadingmemo = true;
      this.$http.post("/admin/changeUser", this.common.request(logistics)).then(
        response => {
          this.memoModal = false;
          this.loadingmemo = false;
          if (response.data.body.status.statusCode == 0) {
            var data = response.data.body.data;
            this.$Notice.success({
              title: "已修改备注信息",
              duration: 2
            });
            this.initData();
          } else {
            this.$Message.error(response.data.body.status.errorDesc);
          }
        },
        response => {
          this.memoModal = false;
          this.loadingmemo = false;
          this.$Message.error(response.data.body.status.errorDesc);
          this.loading = false;
        }
      );
    },
    supervisorok() {
      if (
        this.changeSupervisorRow.newSupervisorUserUuid == null ||
        this.changeSupervisorRow.newSupervisorUserUuid == ""
      ) {
        this.$Message.error("新邀请人不能为空");
        return;
      }
      let logistics = {
        actionType: "SUPERVISOR",
        userUuid: this.changeSupervisorRow.userUuid,
        supervisorL1: {
          userUuid: this.changeSupervisorRow.newSupervisorUserUuid
        }
      };
      this.supervisorLoading = true;
      this.$http.post("/admin/changeUser", this.common.request(logistics)).then(
        response => {
          this.changeSupervisorModal = false;
          this.supervisorLoading = false;
          if (response.data.body.status.statusCode == 0) {
            var data = response.data.body.data;
            this.$Notice.success({
              title: "已修改邀请人",
              duration: 2
            });
            this.initData();
          } else {
            this.$Message.error(response.data.body.status.errorDesc);
          }
        },
        response => {
          this.changeSupervisorModal = false;
          this.supervisorLoading = false;
          this.$Message.error(response.data.body.status.errorDesc);
        }
      );
    },
    getData() {
      this.memberColumn = [
        {
          title: "编号",
          align: "center",
          key: "id",
          width: 65
        },
        {
          title: "姓名",
          align: "center",
          key: "name",
          width: 110
        },
        {
          title: "会员等级",
          align: "center",
          key: "userLevelName",
          width: 110
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
          width: 160
        },
        {
          title: "邀请人",
          align: "center",
          width: 180,
          render: (h, params) => {
            var name =
              params.row.supervisorL1 == null
                ? ""
                : (params.row.supervisorL1.name || "") +
                  "-" +
                  (params.row.supervisorL1.personalPhone || "");
            var row =
              params.row.supervisorL1 == null ? null : params.row.supervisorL1;
            return h("div", [
              h(
                "a",
                {
                  on: {
                    click: event => {
                      this.view(row);
                    }
                  }
                },
                name
              )
            ]);
          }
        },
        {
          title: "直接辅导人",
          align: "center",
          width: 180,
          render: (h, params) => {
            var name =
              params.row.supervisorL2 == null
                ? ""
                : (params.row.supervisorL2.name || "") +
                  "-" +
                  (params.row.supervisorL2.personalPhone || "");
            var row =
              params.row.supervisorL2 == null ? null : params.row.supervisorL2;
            return h("div", [
              h(
                "a",
                {
                  on: {
                    click: event => {
                      this.view(row);
                    }
                  }
                },
                name
              )
            ]);
          }
        },
        {
          title: "间接辅导人",
          align: "center",
          width: 180,
          render: (h, params) => {
            var name =
              params.row.supervisorL3 == null
                ? ""
                : (params.row.supervisorL3.name || "") +
                  "-" +
                  (params.row.supervisorL3.personalPhone || "");
            var row =
              params.row.supervisorL3 == null ? null : params.row.supervisorL3;
            return h("div", [
              h(
                "a",
                {
                  on: {
                    click: event => {
                      this.view(row);
                    }
                  }
                },
                name
              )
            ]);
          }
        },
        {
          title: "注册日期",
          align: "center",
          key: "registerDate",
          width: 140,
          sortable: true
        },
        {
          title: "可提现余额",
          align: "center",
          width: 115,
          render: (h, params) => {
            var availableBalance =
              params.row.userBalanceDTO == null
                ? ""
                : params.row.userBalanceDTO.availableBalance;
            return h("div", {}, availableBalance);
          }
        },
        {
          title: "未到账金额",
          align: "center",
          width: 115,
          render: (h, params) => {
            var ledgerBalance =
              params.row.userBalanceDTO == null
                ? ""
                : params.row.userBalanceDTO.ledgerBalance;
            return h("div", {}, ledgerBalance);
          }
        },
        {
          title: "备注",
          align: "center",
          width: 100,
          key: "memo"
        },
        {
          title: "操作",
          align: "center",
          width: 450,
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "warning",
                    size: "small"
                  },
                  style: {
                    margin: "0 5px 0 0"
                  },
                  on: {
                    click: event => {
                      this.memo(params.row);
                    }
                  }
                },
                "备注"
              ),
              h(
                "Poptip",
                {
                  props: {
                    confirm: true,
                    title: "确定停用此会员？",
                    transfer: true
                  },
                  style: {
                    width: 240
                  },
                  on: {
                    "on-ok": () => {
                      this.changeUser(
                        params.row,
                        params.row.active ? "DISABLE" : "ENABLE"
                      );
                    }
                  }
                },
                [
                  h(
                    "Button",
                    {
                      props: {
                        type: params.row.active ? "error" : "success",
                        size: "small"
                      },
                      style: {
                        margin: "0 5px 0 0"
                      }
                    },
                    params.row.active ? "停用" : "启用"
                  )
                ]
              ),
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
                    click: event => {
                      this.changeInfo(params.row);
                    }
                  }
                },
                "修改资料"
              ),
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
                    click: event => {
                      this.changeSupervisor(params.row);
                    }
                  }
                },
                "修改邀请人"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "warning",
                    size: "small"
                  },
                  style: {
                    margin: "0 5px 0 0"
                  },
                  on: {
                    click: event => {
                      this.changeBalance(params.row);
                    }
                  }
                },
                "修改余额"
              )
            ]);
          }
        }
      ];
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
          title: "手机号码",
          key: "personalPhone"
        },
        {
          title: "身份证号码",
          key: "idCardNo"
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
          title: "注册日期",
          key: "registerDate"
        },
        {
          title: "可提现余额",
          key: "availableBalance"
        },
        {
          title: "未到账金额",
          key: "ledgerBalance"
        },
        {
          title: "备注",
          key: "memo"
        }
      ];
    },
    addok() {
      if (!this.addRow.personalPhone) {
        this.$Message.error("手机号码不能为空");
        return;
      }
      if (!this.addRow.userLevelUuid) {
        this.$Message.error("未选择会员等级");
        return;
      }
      debugger;
      let options = {
        name: this.addRow.name,
        personalPhoneCountryCode: "86",
        personalPhone: this.addRow.personalPhone,
        idCardNo: this.addRow.idCardNo,
        registerDate: this.addRow.registerDate,
        supervisorL1: {
          userUuid: this.addRow.supervisorUserUuid
        },
        userLevelDTO: {
          userLevelUuid: this.addRow.userLevelUuid
        }
      };
      this.addLoading = true;
      this.$http.post("/admin/importUser", this.common.request(options)).then(
        response => {
          this.addLoading = false;
          if (response.data.body.status.statusCode == 0) {
            this.addModel = false;
            var data = response.data.body.data;
            this.$Notice.success({
              title: "会员已添加",
              duration: 2
            });
            this.initData();
          } else {
            this.$Message.error(response.data.body.status.errorDesc);
          }
        },
        response => {
          this.addLoading = false;
          this.$Message.error(response.data.body.status.errorDesc);
        }
      );
    },
    changeUser(row, actionType) {
      let logistics = {
        actionType: actionType,
        userUuid: row.userUuid
      };
      this.$http.post("/admin/changeUser", this.common.request(logistics)).then(
        response => {
          this.loading = false;
          if (response.data.body.status.statusCode == 0) {
            var data = response.data.body.data;
            this.$Notice.success({
              title: actionType == "DISABLE" ? "会员已停用" : "会员已启用",
              duration: 2
            });
            this.initData();
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
    conhidi1() {
      this.searchLevel = null;
      this.searchIdCardNo = null;
      this.searchPersonalPhone = null;
      this.searchRegisterDate = null;
    },
    conhidi2() {
      this.searchLevel = null;
      this.searchName = null;
      this.searchPersonalPhone = null;
      this.searchRegisterDate = null;
    },
    conhidi0() {
      this.searchIdCardNo = null;
      this.searchName = null;
      this.searchIdCardNo = null;
      this.searchRegisterDate = null;
    },
    conhidi3() {
      this.searchLevel = null;
      this.searchName = null;
      this.searchIdCardNo = null;
      this.searchRegisterDate = null;
    },
    conhidi4() {
      if (this.searchRegisterDate) {
        this.searchName = null;
        this.searchIdCardNo = null;
        this.searchPersonalPhone = null;
        this.searchLevel = null;
      }
    },
    initData() {
      this.searchUser(0, this.pageSize);
    },
    searchData() {
      this.searchUser(0, this.pageSize);
      this.resetpage();
    },
    inquiryUserLevel() {
      this.$http.post("/public/getUserLevel", this.common.request({})).then(
        response => {
          this.userLoading = false;
          if (response.data.body.status.statusCode == 0) {
            var data = response.data.body.data;
            this.userLevels = data.levels;
          } else {
            this.$Message.error(response.data.body.status.errorDesc);
          }
        },
        response => {
          this.userLoading = false;
          this.$Message.error(response.data.body.status.errorDesc);
        }
      );
    },
    searchUserByName(query) {
      if (!query) {
        return;
      }
      let searchOptions = {
        startIndex: 0,
        pageSize: 10,
        keyArray: ["NAME"],
        name: query
      };
      this.userLoading = true;
      this.$http
        .post("/admin/searchUser", this.common.request(searchOptions))
        .then(
          response => {
            this.userLoading = false;
            if (response.data.body.status.statusCode == 0) {
              var data = response.data.body.data;
              this.userList = data.userList;
            } else {
              this.$Message.error(response.data.body.status.errorDesc);
            }
          },
          response => {
            this.userLoading = false;
            this.$Message.error(response.data.body.status.errorDesc);
          }
        );
    },
    searchUser(startIndex, pageSize, isExport) {
      let searchOptions = {
        startIndex: startIndex,
        pageSize: pageSize
      };
      let keyArray = [];
      //判断是否有姓名查询条件
      if (this.searchName) {
        keyArray.push("NAME");
        searchOptions.name = this.searchName;
      }
      //判断会员等级
      if (this.searchLevel) {
        keyArray.push("LEVEL");
        searchOptions.userLevelUuid = this.searchLevel;
      }
      //判断是否有身份证查询条件
      if (this.searchIdCardNo) {
        keyArray.push("IDCARDNO");
        searchOptions.idCardNo = this.searchIdCardNo;
      }
      //判断是否有身手机号码查询条件
      if (this.searchPersonalPhone) {
        keyArray.push("PERSONALPHONE");
        searchOptions.personalPhone = this.searchPersonalPhone;
      }
      //判断是否有注册时间查询条件
      var searchDate = this.searchRegisterDate;
      if (searchDate && searchDate[0] && searchDate[1]) {
        keyArray.push("REGISTERDATE");
        var startDate = searchDate[0];
        var endDate = searchDate[1];
        searchOptions.registerDateStart = startDate;
        searchOptions.registerDateEnd = endDate;
      }
      searchOptions.keyArray = keyArray;
      if (isExport) {
      } else {
        this.loading = true;
      }
      this.$http
        .post("/admin/searchUser", this.common.request(searchOptions))
        .then(
          response => {
            if (!isExport) {
              this.loading = false;
            }
            if (response.data.body.status.statusCode == 0) {
              var data = response.data.body.data;
              if (isExport) {
                var userList = ["会员列表", this.memberColumn1, data.userList];
                this.exportData = userList;
                this.exportMember();
              } else {
                this.memberData = data.userList;
                this.total = data.total;
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
        this.$refs["memberpage"].currentPage = 1;
      });
    },
    //处理分页页数改变, 重新查询该页数据
    changepage(index) {
      var startIndex = (index - 1) * this.pageSize;
      this.searchUser(startIndex, this.pageSize);
    },
    upgrade(row) {
      this.showUpgrade = true;
      this.upgradeUser = row;
    },
    add() {
      this.addModel = true;
    },
    changeInfo(row) {
      this.showInfo = true;
      this.infoUser = row;
      this.infoUser.newName = row.name;
      this.infoUser.newPersonalPhone = row.personalPhone;
      this.infoUser.newIdCardNo = row.idCardNo;
      this.infoUser.newUserLevel = row.userLevelDTO.userLevelUuid;
    },
    changeSupervisor(row) {
      this.changeSupervisorModal = true;
      this.changeSupervisorRow = row;
      debugger;
    },
    changeInventory(row) {
      this.showInventory = true;
      this.inventoryUser = row;
      this.inventoryUser.newBalance = row.userInventoryDTO.balance;
    },
    changeBalance(row) {
      this.showBalance = true;
      this.balanceUser = row;
      this.balanceUser.newAvailableBalance =
        row.userBalanceDTO.availableBalance;
      this.balanceUser.newLedgerBalance = row.userBalanceDTO.ledgerBalance;
    },
    upgradeok() {
      debugger;
      if (this.upgradeUser.newTrainerLevel == "无")
        this.upgradeUser.newTrainerLevel = "";
      if (
        this.upgradeUser.userLevelName != "高级合伙人" &&
        this.upgradeUser.newTrainerLevel != ""
      ) {
        this.$Notice.error({
          title: "只有高级合伙人才能升级到训练师",
          duration: 2
        });
        return;
      }
      let options = {
        userDTO: {
          userUuid: this.upgradeUser.userUuid
        },
        trainerLevel: this.upgradeUser.newTrainerLevel
      };
      this.$http
        .post("/admin/changeUserTrainerLevel", this.common.request(options))
        .then(
          response => {
            if (response.data.body.status.statusCode == 0) {
              this.showUpgrade = false;
              this.upgradeUser.trainerLevel = this.upgradeUser.newTrainerLevel;
              this.$Notice.success({
                title: "修改成功",
                duration: 2
              });
            } else {
              this.$Message.error(response.data.body.status.errorDesc);
            }
          },
          response => {
            this.$Message.error(response.data.body.status.errorDesc);
          }
        );
    },
    inventoryok() {
      let options = {
        userUuid: this.inventoryUser.userUuid,
        userInventoryDTO: {
          balance: this.inventoryUser.newBalance
        }
      };
      this.inventoryLoading = true;
      this.$http
        .post("/admin/changeUserInventory", this.common.request(options))
        .then(
          response => {
            this.inventoryLoading = false;
            if (response.data.body.status.statusCode == 0) {
              this.showInventory = false;
              this.inventoryUser.userInventoryDTO.balance = this.inventoryUser.newBalance;
              this.$Notice.success({
                title: "修改成功",
                duration: 2
              });
            } else {
              this.$Message.error(response.data.body.status.errorDesc);
            }
          },
          response => {
            this.inventoryLoading = false;
            this.$Message.error(response.data.body.status.errorDesc);
          }
        );
    },
    balanceok() {
      let options = {
        userUuid: this.balanceUser.userUuid,
        userBalanceDTO: {
          availableBalance: this.balanceUser.newAvailableBalance,
          ledgerBalance: this.balanceUser.newLedgerBalance
        }
      };
      this.balanceLoading = true;
      this.$http
        .post("/admin/changeUserBalance", this.common.request(options))
        .then(
          response => {
            this.balanceLoading = false;
            if (response.data.body.status.statusCode == 0) {
              this.showBalance = false;
              this.balanceUser.userBalanceDTO.availableBalance = this.balanceUser.newAvailableBalance;
              this.balanceUser.userBalanceDTO.ledgerBalance = this.balanceUser.newLedgerBalance;
              this.$Notice.success({
                title: "修改成功",
                duration: 2
              });
            } else {
              this.$Message.error(response.data.body.status.errorDesc);
            }
          },
          response => {
            this.inventoryLoading = false;
            this.$Message.error(response.data.body.status.errorDesc);
          }
        );
    },
    infook() {
      if (this.infoUser.newName == null || this.infoUser.newName == "") {
        this.$Message.error("姓名不能为空");
        return;
      }
      if (
        this.infoUser.newPersonalPhone == null ||
        this.infoUser.newPersonalPhone == ""
      ) {
        this.$Message.error("手机号码不能为空");
        return;
      }
      let options = {
        actionType: "INFO",
        userUuid: this.infoUser.userUuid,
        name: this.infoUser.newName,
        personalPhone: this.infoUser.newPersonalPhone,
        idCardNo: this.infoUser.newIdCardNo,
        userLevelDTO: {
          userLevelUuid: this.infoUser.newUserLevel
        }
      };
      this.infoLoading = true;
      this.$http.post("/admin/changeUser", this.common.request(options)).then(
        response => {
          this.infoLoading = false;
          if (response.data.body.status.statusCode == 0) {
            this.showInfo = false;
            this.$Notice.success({
              title: "修改成功",
              duration: 2
            });
            this.resetpage();
            this.searchUser(0, this.pageSize, false);
          } else {
            this.$Message.error(response.data.body.status.errorDesc);
          }
        },
        response => {
          this.infoLoading = false;
          this.$Message.error(response.data.body.status.errorDesc);
        }
      );
    },
    upgradecancel() {
      this.showUpgrade = false;
    },
    balancecancel() {
      this.showBalance = false;
    },
    inventorycancel() {
      this.showInventory = false;
    },
    infocancel() {
      this.showInfo = false;
    },
    supervisorcancel() {
      this.changeSupervisorModal = false;
    },
    view(row) {
      this.$router.push({
        name: "memberdetail",
        query: { userUuid: row.userUuid }
      });
    },
    viewstation(row) {
      this.$router.push({
        name: "stationdetail",
        query: { merchantUuid: row.merchantDTO.merchantUuid }
      });
    },
    allMember() {
      this.loadingExport = true;
      this.searchUser(0, 99999, true);
    },
    exportMember() {
      var exportData = this.exportData;
      this.$refs.deliveryTable.exportCsv({
        filename: exportData[0],
        columns: exportData[1],
        data: exportData[2]
      });
      this.loadingExport = false;
    }
  },
  created() {
    this.getData();
    this.initData();
    this.inquiryUserLevel();
  }
};
</script>
