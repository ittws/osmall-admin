<style lang="less">
@import "../../styles/common.less";
</style>

<template>
  <div>
    <Row class="margin-top-10">
      <Col span="24">
        <Card>
          <p slot="title">培训导师列表</p>
          <Row>
            <Input clearable v-model="searchName" placeholder="姓名" style="width: 100px" />
            <Input clearable v-model="searchIdCardNo" placeholder="身份证号码" style="width: 150px" />
            <Input clearable v-model="searchPersonalPhone" placeholder="手机号码" style="width: 120px" />
            <DatePicker
              type="daterange"
              v-model="searchEffectiveDate"
              placement="bottom-end"
              placeholder="生效日期"
              style="width: 200px"
            ></DatePicker>

            <Button type="success" @click="handleSearch()">查询</Button>
            <div class="f_r">
              <Button :loading="loadingAdd" icon="ios-plus" type="primary" @click="add()">新增</Button>
              <Button
                icon="document-text"
                type="warning"
                @click="exportResult()"
                :loading="loadingExport"
              >导出</Button>
            </div>
          </Row>

          <Row class="margin-top-10">
            <Col span="24">
              <div>
                <Table
                  :columns="trainerColumn"
                  :data="trainerData"
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
              ref="trainerpage"
              :total="total"
              size="small"
              :pageSize="pageSize"
              @on-change="changepage"
              show-total
              show-elevator
            ></Page>
          </Row>
        </Card>
        <Table ref="trainerExportTable" style="display:none"></Table>
      </Col>
    </Row>
    <Modal :clearable="false" :mask-clearable="false" v-model="addModel" title="新增培训导师">
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
            >{{option.name}} - {{option.personalPhone}}</Option>
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
      loading: false,   //培训导师数据表格加载中
      loadingExport: false, //导出按钮加载中
      loadingAdd: false,    //新增培训导师加载中
      searchName: "",   //查询条件会员姓名
      searchIdCardNo: "",   //查询条件会员身份证
      searchPersonalPhone: "",  //查询条件会员手机号码
      searchEffectiveDate: null,    //查询条件生效日期
      userUuids: [],    //新增培训导师时多选的会员
      addModel: false,  //新增培训导师弹出框
      users: [],        //新增培训导师时查询出的会员
      trainerData: [],  //培训导师表格数据
      trainerColumn: [
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
          title: "培训导师类别",
          align: "center",
          key: "trainerLevel",
          width: 150
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
          width: 200
        },
        {
          title: "生效日期",
          align: "left",
          key: "effectiveDate",
          sortable: true
        },
        {
          title: "操作",
          align: "center",
          width: 150,
          render: (h, params) => {
            return h("div", [
              h(
                "Poptip",
                {
                  props: {
                    confirm: true,
                    title: "确定要移除该培训导师吗?",
                    transfer: true
                  },
                  on: {
                    "on-ok": () => {
                      this.del(params.row);
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
                      },
                      style: {
                        margin: "0 5px 0 0"
                      }
                    },
                    "移除"
                  )
                ]
              )
            ]);
          }
        }
      ],
      exportData: [],
      exportColumn: [
        {
          title: "编号",
          key: "id"
        },
        {
          title: "姓名",
          key: "name"
        },
        {
          title: "培训导师级别",
          key: "trainerLevel"
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
          title: "生效日期",
          key: "effectiveDate"
        }
      ],
      total: 0, //分页-查询出的总数量
      pageSize: 20  //分页-每页多少条
    };
  },
  methods: {
    //点击新增培训导师
    add() {
      this.addModel = true;
    },
    addcancel() {
      this.addModel = false;
    },
    //新增培训导师后台调用
    addok() {
      let trainerList = [];
      if (this.userUuids.length === 0) {
        this.$Message.error("请选择会员");
        return;
      } else {
        this.userUuids.forEach(function(val, index) {
          trainerList.push({
            userDTO: {
              userUuid: val
            }
          });
        });
      }
      let options = {
        trainerList: trainerList
      };
      this.loadingAdd = true;
      this.$http
        .post("/admin/upgradeUserToTrainer", this.common.request(options))
        .then(
          response => {
            this.loadingAdd = false;
            if (response.data.body.status.statusCode == 0) {
              this.addModel = false;
              this.$Notice.success({
                title: "成功",
                desc: "添加培训导师成功",
                duration: 2
              });
              this.userUuids = [];
              this.searchTrainer(0, this.pageSize, false);
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
    //移除培训导师后台调用
    del(trainer) {
      let options = {
        trainerUuid: trainer.trainerUuid
      };
      this.$http
        .post("/admin/cancelUserFromTrainer", this.common.request(options))
        .then(
          response => {
            if (response.data.body.status.statusCode == 0) {
              this.$Notice.success({
                title: "成功",
                desc: "培训导师已移除",
                duration: 2
              });
              this.searchTrainer(0, this.pageSize, false);
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
    //初始化数据-查询第一页培训导师
    initData() {
      this.searchTrainer(0, this.pageSize);
    },
    handleSearch() {
      this.resetpage();
      this.searchTrainer(0, this.pageSize);
    },
    exportResult() {
      this.loadingExport = true;
      this.searchTrainer(0, 99999, true);
    },
    //分页查询培训导师调用后台
    searchTrainer(startIndex, pageSize, isExport) {
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
      //判断是否有生效时间查询条件
      var searchDate = this.searchEffectiveDate;
      if (searchDate && searchDate[0] && searchDate[1]) {
        keyArray.push("EFFECTIVEDATE");
        var startDate = searchDate[0];
        var endDate = searchDate[1];
        searchOptions.effectiveDateStart = startDate;
        searchOptions.effectiveDateEnd = endDate;
      }
      searchOptions.keyArray = keyArray;
      if (isExport) {
      } else {
        this.loading = true;
      }
      this.$http
        .post("/admin/searchTrainer", this.common.request(searchOptions))
        .then(
          response => {
            if (!isExport) {
              this.loading = false;
            }
            if (response.data.body.status.statusCode == 0) {
              var data = response.data.body.data;
              if (isExport) {
                var userList = [
                  "培训导师列表",
                  this.exportColumn,
                  data.trainerList
                ];
                this.exportData = userList;
                this.exportTrainer();
              } else {
                this.trainerData = data.trainerList;
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
        this.$refs["trainerpage"].currentPage = 1;
      });
    },
    //处理分页页数改变, 重新查询该页数据
    changepage(pageNo) {
      var startIndex = (pageNo - 1) * this.pageSize;
      this.searchTrainer(startIndex, this.pageSize);
    },
    view(row) {
      this.$router.push({
        name: "trainerdetail",
        query: { trainerUuid: row.trainerUuid }
      });
    },
    //导出培训导师
    exportTrainer() {
      var exportData = this.exportData;
      this.$refs.trainerExportTable.exportCsv({
        filename: exportData[0],
        columns: exportData[1],
        data: exportData[2]
      });
      this.loadingExport = false;
    }
  },
  created() {
    this.initData();
  }
};
</script>
