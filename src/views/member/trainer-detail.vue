
<style lang="less">
@import "../../styles/common.less";
</style>

<template>
  <div>
    <Form :label-width="100">
      <Card>
        <p slot="title">培训导师基础信息</p>
        <Row type="flex" justify="start">
          <Col span="8">
            <FormItem label="编号:">{{trainer.id}}</FormItem>
          </Col>
          <Col span="8">
            <FormItem label="培训导师类别:">{{trainer.trainerLevel}}</FormItem>
          </Col>
          <Col span="8">
            <FormItem label="生效日期:">{{trainer.effectiveDate}}</FormItem>
          </Col>
        </Row>
        <Row type="flex" justify="start">
          <Col span="8">
            <FormItem label="姓名:">{{trainer.name}}</FormItem>
          </Col>
          <Col span="8">
            <FormItem label="电话号码:">{{trainer.personalPhone}}</FormItem>
          </Col>
          <Col span="8">
            <FormItem label="身份证号码:">{{trainer.idCardNo}}</FormItem>
          </Col>
        </Row>
      </Card>
      <Card>
        <p slot="title">培训会员列表</p>
        <Row>
          <div class="f_r">
            <Button
              class="margin-left-10"
              :loading="removeLoading"
              @click="removeMultipleUser"
              type="error"
            >批量移除</Button>
            <Button type="primary" @click="add()">添加培训会员</Button>
          </div>
        </Row>
        <Row class="margin-top-10">
          <Col span="24">
            <div>
              <Table
                :columns="memberColumn"
                :data="memberData"
                :loading="loading"
                @on-selection-change="selectUser"
                border
                stripe
              ></Table>
            </div>
          </Col>
        </Row>
        <Row class="margin-top-10">
          <Page
            ref="memberpage"
            :total="memberTotal"
            size="small"
            :pageSize="pageSize"
            @on-change="changepage"
            show-total
            show-elevator
          ></Page>
        </Row>
      </Card>
    </Form>
    <Modal :clearable="false" :mask-clearable="false" v-model="addModel" title="新增培训会员">
      <Form :label-width="80">
        <FormItem label="选择会员">
          <Select
            v-model="userUuids"
            multiple
            filterable
            remote
            :remote-method="searchUser"
            placeholder="输入手机号码"
            style="width:80%"
          >
            <Option
              v-for="(option, index) in users"
              :value="option.userUuid"
              :label="(option.name||'')+'-'+option.personalPhone"
              :key="option.userUuid"
            >{{option.userLeveName}} - {{option.name}} - {{option.personalPhone}}</Option>
          </Select>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="addcancel">取消</Button>
        <Button :loading="loadingAdd" type="primary" @click="addok">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
export default {
  data() {
    return {
      trainerUuid: "",
      trainer: {},
      addModel: false, //新增培训会员弹出框
      userUuids: [],
      users: [], //搜索的会员列表
      selectedUser: [], //选中的培训会员
      loading: false, //培训会员列表加载中
      loadingAdd: false, //新增培训会员加载中
      removeLoading: false, //移除培训会员加载中
      startIndex: 0,
      pageSize: 20,
      memberTotal: 0,
      memberData: [],
      memberColumn: [
        {
          type: "selection",
          align: "center",
          width: 60
        },
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
          title: "注册日期",
          key: "registerDate"
        },
        {
          title: "备注",
          key: "memo"
        }
      ]
    };
  },
  methods: {
    //培训会员多选框选中事件
    selectUser(selection) {
      this.selectedUser = selection;
    },
    //批量移除培训会员
    removeMultipleUser() {
      if (this.selectedUser.length === 0) {
        this.$Message.error("请选择至少一个会员");
        return;
      }
      this.removeLoading = true;
      this.removeTrainerUser(this.selectedUser);
    },
    //移除培训会员实际调用后台
    removeTrainerUser(selectedUser) {
      let traineeList = [];
      selectedUser.forEach(function(val, index) {
        traineeList.push({
          userUuid: val.userUuid
        });
      });
      this.$http
        .post(
          "/admin/removeUsersToTrainer",
          this.common.request({
            trainerUuid: this.trainerUuid,
            traineeList: traineeList
          })
        )
        .then(
          response => {
            this.removeLoading = false;
            if (response.data.body.status.statusCode == 0) {
              var data = response.data.body.data;
              this.$Notice.success({
                title: "培训会员已移除",
                duration: 2
              });
              this.searchTrainerUser(0, this.pageSize, this.trainerUuid);
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
    //按手机号码查询会员
    searchUser(name) {
      let searchOptions = {
        keyArray: ["PERSONALPHONE"],
        personalPhone: name,
        startIndex: 0,
        pageSize: 10
      };
      this.$http
        .post("/admin/searchUser", this.common.request(searchOptions))
        .then(
          res => {
            if (res.data.body.status.statusCode == 0) {
              var data = res.data.body.data;
              this.users = data.userList;
            } else {
              this.$Message.error(res.data.body.status.errorDesc);
            }
          },
          res => {}
        );
    },
    //点击新增培训导师
    add() {
      this.addModel = true;
    },
    addcancel() {
      this.addModel = false;
    },
    //新增培训导师后台调用
    addok() {
      let traineeList = [];
      if (this.userUuids.length === 0) {
        this.$Message.error("请选择会员");
        return;
      } else {
        this.userUuids.forEach(function(val, index) {
          traineeList.push({
            userUuid: val
          });
        });
      }
      let options = {
        traineeList: traineeList,
        trainerUuid: this.trainerUuid
      };
      this.loadingAdd = true;
      this.$http
        .post("/admin/assignUsersToTrainer", this.common.request(options))
        .then(
          response => {
            this.loadingAdd = false;
            if (response.data.body.status.statusCode == 0) {
              this.addModel = false;
              this.$Notice.success({
                title: "成功",
                desc: "添加培训会员成功",
                duration: 2
              });
              this.userUuids = [];
              this.searchTrainerUser(0, this.pageSize, false);
            } else {
              this.$Message.error(response.data.body.status.errorDesc);
            }
          },
          response => {
            this.loadingAdd = false;
            this.$Message.error(response.data.body.status.errorDesc);
          }
        );
    },
    inquiryTrainer() {
      let options = {
        trainerUuid: this.trainerUuid
      };
      this.$http
        .post("/admin/inquiryTrainer", this.common.request(options))
        .then(
          response => {
            if (response.data.body.status.statusCode == 0) {
              var data = response.data.body.data;
              this.trainer = data;
            } else {
              this.$Message.error(response.data.body.status.errorDesc);
            }
          },
          response => {
            this.$Message.error(response.data.body.status.errorDesc);
          }
        );
    },
    searchTrainerUser(startIndex, pageSize, trainerUuid) {
      let options = {
        trainerUuid: trainerUuid,
        startIndex: startIndex,
        pageSize: pageSize
      };
      this.loading = true;
      this.$http
        .post("/admin/searchTrainerUsers", this.common.request(options))
        .then(
          response => {
            this.loading = false;
            if (response.data.body.status.statusCode == 0) {
              var data = response.data.body.data;
              this.memberData = data.userList;
              this.memberTotal = data.total;
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
      this.searchTrainerUser(startIndex, this.pageSize, this.trainerUuid);
    }
  },
  created() {
    this.trainerUuid = this.$route.query.trainerUuid;
    this.inquiryTrainer();
    this.searchTrainerUser(0, this.pageSize, this.trainerUuid);
  }
};
</script>
