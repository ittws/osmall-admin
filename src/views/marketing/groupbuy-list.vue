<style lang="less">
@import "../../styles/common.less";
</style>

<template>
  <div>
    <Row class="margin-top-10">
      <Col span="24">
        <Card>
          <p slot="title">
            团购活动
          </p>
          <Row>
            <div class="f_r">
              <Button icon="plus" type="primary" @click="add()">新增团购活动</Button>
            </div>
          </Row>

          <Row class="margin-top-10">
            <Col span="24">
              <div>
                <Table
                  :columns="groupBuyColumn"
                  :data="groupBuyData"
                  :loading="loading"
                  border
                  stripe
                  ref="groupBuyTable"
                ></Table>
              </div>
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  </div>
</template>

<script>
export default {
  components: {

  },
  data() {
    return {
      groupBuyData: [],
      groupBuyColumn: [
        {
          title: "活动名称",
          align: "center",
          render: (h, params) => {
            return h("Span", {}, params.row.name);
          }
        },
        {
          title: "开始时间",
          align: "center",
          render: (h, params) => {
            return h("Span", {}, params.row.startTime);
          }
        },
        {
          title: "结束时间",
          align: "center",
          render: (h, params) => {
            return h("Span", {}, params.row.endTime);
          }
        },
        {
          title: "成团人数",
          align: "center",
          key: "minUserCount",
          width: 200,
          render: (h, params) => {
            return h("Span", {}, params.row.minUserCount+'人');
          }
        },
        {
          title: "成团时间",
          align: "center",
          key: "maxTranDays",
          width: 200,
          render: (h, params) => {
            return h("Span", {}, params.row.maxTranDays+'天');
          }
        },
        {
          title: "状态",
          align: "center",
          width: 200,
          render: (h, params) => {
            var status = params.row.status;
            var startTime = params.row.startTime;
            var endTime = params.row.endTime;
            var statusText = "未生效";
            var color = params.row.status=='1' ? "green" : "red";
            if (status=='1') {
              if(new Date(startTime)>new Date()){
                statusText = '未开始';
              }else if(new Date(endTime)<new Date()){
                statusText = '已结束';
              }else{
                statusText = '进行中';
              }

            }
            return h(
              "Tag",
              {
                props: {
                  color: color
                }
              },
              statusText
            );
          }
        },
        {
          title: "操作",
          align: "center",
          width: 250,
          render: (h, params) => {
            let status = params.row.status;
            var startTime = params.row.startTime;
            var endTime = params.row.endTime;
            let type = status=='0' ? "success" : "warning";
            let statusText = status=='0' ? "生效" : "失效";
            return h("span", {}, [
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  style: {
                    marginRight: "8px",
                    display: (new Date(endTime)<new Date())?'none':''
                  },
                  on: {
                    click: () => {
                      this.edit(params.row);
                    }
                  }
                },
                "编辑"
              ),

              h(
                "Poptip",
                {
                  props: {
                    confirm: true,
                    title: "你确定要修改团购活动状态吗?",
                    transfer: true
                  },
                  style: {
                    display: (new Date(endTime)<new Date())?'none':''
                  },
                  on: {
                    "on-ok": () => {
                      if (status=='1')
                        this.changeGroupBuyStatus(
                          params.row.groupBuyDefUuid,
                          "DISABLE"
                        );
                      else
                        this.changeGroupBuyStatus(
                          params.row.groupBuyDefUuid,
                          "ENABLE"
                        );
                    }
                  }
                },
                [
                  h(
                    "Button",
                    {
                      props: {
                        type: type,
                        row: params.row,
                        size: "small"
                      },
                      style: {
                        marginRight: "8px"
                      }
                    },
                    statusText
                  )
                ]
              ),
              h(
                "Poptip",
                {
                  props: {
                    confirm: true,
                    title: "您确定要删除该团购活动吗?",
                    transfer: true
                  },
                  style: {
                    display: (new Date(startTime)<new Date())?'none':''
                  },
                  on: {
                    "on-ok": () => {
                      this.changeGroupBuyStatus(params.row.groupBuyDefUuid, "DELETE");
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
                    "删除"
                  )
                ]
              )
            ]);
          }
        }
      ],
      total: 0,
      pageSize: 20
    };
  },
  methods: {
    //查询团购活动列表
    searchGroupBuy() {
      let searchOptions = {
        
      };
      this.loading = true;
      this.$http
        .post("/admin/inquiryGroupBuy", this.common.request(searchOptions))
        .then(
          res => {
            this.loading = false;
            if (res.data.body.status.statusCode == 0) {
              var data = res.data.body.data;
              this.groupBuyData = data.groupBuys;
              this.total = data.total;
            } else {
              this.$Message.error(res.data.body.status.errorDesc);
            }
          },
          res => {
            this.loading = false;
          }
        );
    },
    //处理分页-页数改变
    changepage(index) {
      var startIndex = (index - 1) * this.pageSize;
      this.searchGroupBuy(startIndex, this.pageSize);
    },
    add() {
      this.$router.push({
        name: "groupbuyadd"
      });
    },
    edit(row) {
      this.$router.push({
        name: "groupbuyedit",
        params: { groupBuyDefUuid: row.groupBuyDefUuid }
      });
    },
    //发放, 暂停, 删除团购活动
    changeGroupBuyStatus(groupBuyDefUuid, actionType) {
      let options = {
        actionType: actionType,
        groupBuyDefUuid: groupBuyDefUuid
      };
      this.$http.post("/admin/changeGroupBuy", this.common.request(options)).then(
        response => {
          this.loading = false;
          if (response.data.body.status.statusCode == 0) {
            var data = response.data.body.data;
            var desc = "团购活动状态已修改";
            if (actionType == "DELETE") desc = "团购活动已删除";
            this.$Notice.success({
              title: "成功",
              desc: desc,
              duration: 2
            });
            this.searchGroupBuy();
          } else {
            this.$Message.error(response.data.body.status.errorDesc);
          }
        },
        response => {
          this.loading = false;
          this.$Message.error("保存失败，请检查各项是否填写正确");
        }
      );
    }
  },
  created() {
    this.searchGroupBuy();
  }
};
</script>
