<style lang="less">
@import "../../styles/common.less";
</style>

<template>
  <div>
    <Row class="margin-top-10">
      <Col span="24">
        <Card>
          <p slot="title">
            秒杀活动
          </p>
          <Row>
            <div class="f_r">
              <Button icon="plus" type="primary" @click="add()">新增秒杀活动</Button>
            </div>
          </Row>

          <Row class="margin-top-10">
            <Col span="24">
              <div>
                <Table
                  :columns="secKillColumn"
                  :data="secKillData"
                  :loading="loading"
                  border
                  stripe
                  ref="secKillTable"
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
      secKillData: [],
      secKillColumn: [
        {
          title: "商品",
          align: "center",
          render: (h, params) => {
            return h("Span", {}, params.row.productDTO.productName);
          }
        },
        {
          title: "秒杀开始时间",
          align: "center",
          key: "startTime",
          width: 180
        },
        {
          title: "秒杀结束时间",
          align: "center",
          key: "endTime",
          width: 180
        },
        {
          title: "库存",
          align: "center",
          key: "stock",
          width: 100
        },
        {
          title: "秒杀价格(元)",
          align: "center",
          key: "unitPrice",
          width: 180
        },
        {
          title: "状态",
          align: "center",
          width: 150,
          render: (h, params) => {
            var status = params.row.status;
            var statusText = "已关闭";
            var color = params.row.status=='1' ? "green" : "red";
            if (status=='1') {
              statusText = "已开启";
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
            let type = status=='0' ? "success" : "warning";
            let statusText = status=='0' ? "开启" : "关闭";
            return h("span", {}, [
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  style: {
                    marginRight: "8px"
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
                    title: "你确定要修改秒杀活动状态吗?",
                    transfer: true
                  },
                  on: {
                    "on-ok": () => {
                      if (status=='1')
                        this.changeSecKillStatus(
                          params.row.secKillProductUuid,
                          "DISABLE"
                        );
                      else
                        this.changeSecKillStatus(
                          params.row.secKillProductUuid,
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
                    title: "您确定要删除该秒杀活动吗?",
                    transfer: true
                  },
                  on: {
                    "on-ok": () => {
                      this.changeSecKillStatus(params.row.secKillProductUuid, "DELETE");
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
    //查询秒杀活动列表
    searchSecKill() {
      let searchOptions = {
        
      };
      this.loading = true;
      this.$http
        .post("/admin/inquirySecKill", this.common.request(searchOptions))
        .then(
          res => {
            this.loading = false;
            if (res.data.body.status.statusCode == 0) {
              var data = res.data.body.data;
              this.secKillData = data.secKills;
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
      this.searchSecKill(startIndex, this.pageSize);
    },
    add() {
      this.$router.push({
        name: "seckilladd"
      });
    },
    edit(row) {
      this.$router.push({
        name: "seckilledit",
        params: { secKillProductUuid: row.secKillProductUuid }
      });
    },
    //发放, 暂停, 删除秒杀活动
    changeSecKillStatus(secKillProductUuid, actionType) {
      let options = {
        actionType: actionType,
        secKillProductUuid: secKillProductUuid
      };
      this.$http.post("/admin/changeSecKill", this.common.request(options)).then(
        response => {
          this.loading = false;
          if (response.data.body.status.statusCode == 0) {
            var data = response.data.body.data;
            var desc = "秒杀活动状态已修改";
            if (actionType == "DELETE") desc = "秒杀活动已删除";
            this.$Notice.success({
              title: "成功",
              desc: desc,
              duration: 2
            });
            this.searchSecKill();
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
    this.searchSecKill();
  }
};
</script>
