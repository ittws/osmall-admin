<style lang="less">
@import "../../styles/common.less";
</style>

<template>
  <div>
    <Row class="margin-top-10">
      <Col span="24">
        <Card>
          <p slot="title">运费模板</p>
          <Row>
            <Button icon="plus" type="primary" @click="add()">添加运费模板</Button>
          </Row>

          <Row class="margin-top-10">
            <Col span="24">
              <div>
                <Table
                  :columns="shippingColumn"
                  :data="shippingData"
                  :loading="loading"
                  border
                  stripe
                  ref="shippingTable"
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
import expandRow from "./components/shipping-list-table-expand.vue";
import expandButton from "./components/shipping-list-button-expand.vue";
import { ajaxShippingListData } from "./data/shipping-list-data.js";
import table2excel from "@/libs/table2excel.js";
export default {
  components: {
    expandRow
  },
  data() {
    return {
      loading: false,
      shippingColumn: [
        {
          title: "模板名称",
          align: "center",
          key: "name"
        },
        {
          title: "计费方式",
          align: "center",
          width: 150,
          render: (h, params) => {
            let chargeType = params.row.chargeType;
            let chargeTypeDesc = "";
            if (chargeType === 1) chargeTypeDesc = "按件";
            else if (chargeType === 2) chargeTypeDesc = "按重量";
            return h("span", {}, chargeTypeDesc);
          }
        },
        {
          title: "物流公司",
          align: "center",
          key: "courierName",
          width: 120
        },
        {
          title: "是否包邮",
          align: "center",
          width: 120,
          render: (h, params) => {
            let shippingFree = params.row.shippingFree;
            let shippingFreeDesc = shippingFree ? "包邮" : "不包邮";
            return h("span", {}, shippingFreeDesc);
          }
        },
        {
          title: "包邮金额",
          align: "center",
          key: "shippingFreeConditionAmount",
          width: 120
        },
        {
          title: "首重(首件)价格",
          align: "center",
          key: "defaultFirstPrice",
          width: 140
        },
        {
          title: "续重(续件)价格",
          align: "center",
          key: "defaultNextPrice",
          width: 140
        },
        {
          title: "是否默认",
          align: "center",
          width: 120,
          render: (h, params) => {
            return h("i-switch", {
              props: {
                type: "primary",
                value: params.row.default //控制开关的打开或关闭状态，官网文档属性是value
              },
              style: {
                marginRight: "5px"
              },
              on: {
                "on-change": value => {
                  this.setDefaultProductFreight(params.index); //params.index是拿到table的行序列，可以取到对应的表格值
                }
              }
            });
          }
        },
        {
          title: "是否启用",
          align: "center",
          width: 120,
          render: (h, params) => {
            return h("i-switch", {
              props: {
                type: "primary",
                value: params.row.active //控制开关的打开或关闭状态，官网文档属性是value
              },
              style: {
                marginRight: "5px"
              },
              on: {
                "on-change": value => {
                  this.setEnableProductFreight(params.index); //params.index是拿到table的行序列，可以取到对应的表格值
                }
              }
            });
          }
        },
        {
          title: "操作",
          align: "center",
          width: 180,
          render: (h, params) => {
            return h("span", {}, [
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    row: params.row,
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
                    title: "您确定要删除运费模板吗?",
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
                    "删除"
                  )
                ]
              )
            ]);
          }
        }
      ],
      shippingData: []
    };
  },
  methods: {
    edit(row) {},
    del(row) {},
    add() {
      this.$router.push({
        name: "shippingadd"
      });
    },
    setDefaultProductFreight(index) {
      var shippingData = this.shippingData[index];
      this.productFreightUuid = shippingData.productFreightUuid;
      var actionType = shippingData.default ? "UNDEFAULT" : "DEFAULT";
      this.changeProductFreight(actionType);
    },
    setEnableProductFreight(index) {
      var shippingData = this.shippingData[index];
      this.productFreightUuid = shippingData.productFreightUuid;
      var actionType = shippingData.active ? "DISABLE" : "ENABLE";
      this.changeProductFreight(actionType);
    },
    changeProductFreight(actionType) {
      var options = {
        actionType: actionType,
        productFreightUuid: this.productFreightUuid
      };
      this.loading = true;
      this.$http
        .post("/admin/changeProductFreight", this.common.request(options))
        .then(
          response => {
            this.loading = false;
            if (response.data.body.status.statusCode == 0) {
              var title = "";
              if (actionType === "DEFAULT") title = "已将运费模板设为默认";
              if (actionType === "UNDEFAULT") title = "已取消默认运费模板";
              if (actionType === "ENABLE") title = "已启用运费模板";
              if (actionType === "DISABLE") title = "已禁用运费模板";
              this.$Notice.success({
                title: title,
                duration: 2
              });
              this.initData();
            } else {
              this.$Message.error(response.data.body.status.errorDesc);
            }
          },
          response => {
            this.replyLoading = false;
            this.$Message.error("发生错误，请稍后重试");
          }
        );
    },
    initData() {
      var options = {};
      this.loading = true;
      this.$http
        .post("/admin/inquiryProductFreight", this.common.request(options))
        .then(
          response => {
            this.loading = false;
            if (response.data.body.status.statusCode == 0) {
              var data = response.data.body.data;
              this.shippingData = data.freights;
            } else {
            }
          },
          response => {
            this.loading = false;
          }
        );
    },
    edit(freight) {
      this.$router.push({
        name: "shippingedit",
        query: {
          productFreightUuid: freight.productFreightUuid
        }
      });
    },
    del(freight) {
      var options = {
        actionType: "DELETE",
        productFreightUuid: freight.productFreightUuid
      };
      this.$http
        .post("/admin/changeProductFreight", this.common.request(options))
        .then(
          response => {
            if (response.data.body.status.statusCode == 0) {
              this.$Notice.success({
                title: "成功",
                desc: "运费模板已删除",
                duration: 2
              });
              this.initData();
            } else {
              this.$Message.error(response.data.body.status.errorDesc);
            }
          },
          response => {
            this.loading = false;
          }
        );
    }
  },
  created() {
    this.initData();
  }
};
</script>
