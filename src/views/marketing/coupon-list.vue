<style lang="less">
@import "../../styles/common.less";
</style>

<template>
  <div>
    <Row class="margin-top-10">
      <Col span="24">
        <Card>
          <p slot="title">
            优惠券列表
          </p>
          <Row>
            <Select v-model="searchType" clearable style="width: 150px">
              <Option value>全部</Option>
              <Option value="CASH">现金券</Option>
              <Option value="DISCOUNT">折扣券</Option>
            </Select>
            <Input
              clearable
              type="text"
              v-model="searchName"
              placeholder="优惠券名称"
              style="width: 150px"
            />
            <Button type="primary" @click="searchCoupon()">搜索</Button>
            <div class="f_r">
              <Button icon="plus" type="primary" @click="add()">新增优惠券</Button>
            </div>
          </Row>

          <Row class="margin-top-10">
            <Col span="24">
              <div>
                <Table
                  :columns="couponColumn"
                  :data="couponData"
                  :loading="loading"
                  border
                  stripe
                  ref="couponTable"
                ></Table>
              </div>
            </Col>
          </Row>
          <Row class="margin-top-10">
            <Page
              ref="couponpage"
              :total="total"
              size="small"
              :pageSize="pageSize"
              @on-change="changepage"
              show-total
              show-elevator
            ></Page>
          </Row>
        </Card>
      </Col>
    </Row>
  </div>
</template>

<script>
import expandRow from "./components/coupon-list-table-expand.vue";
import expandButton from "./components/coupon-list-button-expand.vue";
import { ajaxCouponListData } from "./data/coupon-list-data.js";
import table2excel from "@/libs/table2excel.js";
export default {
  components: {
    expandRow
  },
  data() {
    return {
      loading: false,
      multipleCouponModel: false,
      multipleCouponRow: {},
      searchName: "",
      searchType: "",
      searchMemberMobileNo: "",
      couponData: [],
      couponColumn: [
        {
          title: "类型",
          align: "center",
          key: "type",
          width: 80,
          render: (h, params) => {
            var type = params.row.type;
            var typeValue = "";
            if (type == "CASH") {
              typeValue = "现金券";
            } else if (type == "DISCOUNT") {
              typeValue = "折扣券";
            }
            return h("Span", {}, typeValue);
          }
        },
        {
          title: "优惠券名称",
          align: "center",
          key: "name",
          width: 200
        },
        {
          title: "优惠券图片",
          align: "center",
          key: "name",
          width: 200,
          render: (h, params) => {
            return h("img", {
              attrs: {
                src: params.row.imageUrl
              },
              style: {
                width: "200px",
                height: "100px",
                display: "inline-block",
                float: "left",
                margin: "5px 0"
              }
            });
          }
        },
        {
          title: "可用商品",
          align: "center",
          width: 300,
          render: (h, params) => {
            var benefitType = params.row.benefitType;
            if (benefitType == "0") return h("Span", {}, "全部商品");
            else {
              var productList = params.row.benefitProductList;
              var spanList = [];
              productList.forEach(function(val, index) {
                var t_span = h("Tag", { attrs: {} }, val.productName);
                spanList.push(t_span);
              });
              return h("Span", spanList, "");
            }
          }
        },
        {
          title: "状态",
          align: "center",
          width: 120,
          render: (h, params) => {
            var active = params.row.active;
            var status = "不可领取";
            var color = params.row.active ? "green" : "red";
            if (active) {
              status = "可领取";
            }
            return h(
              "Tag",
              {
                props: {
                  color: color
                }
              },
              status
            );
          }
        },

        {
          title: "价额",
          align: "center",
          width: 200,
          render: (h, params) => {
            if (params.row.type == "CASH")
              return h(
                "Span",
                {},
                params.row.benefitCash +
                  "元" +
                  "(满" +
                  params.row.conditionAmount +
                  "元可用)"
              );
            else if (params.row.type == "DISCOUNT")
              return h(
                "Span",
                {},
                "折扣率" +
                  params.row.benefitDiscount +
                  "%" +
                  "(满" +
                  params.row.conditionAmount +
                  "元可用)"
              );
          }
        },
        {
          title: "有效日期",
          align: "center",
          key: "validStartDate",
          width: 200,
          render: (h, params) => {
            if (params.row.validType === "1")
              return h(
                "Span",
                {},
                params.row.startDate + " 到 " + params.row.endDate
              );
            else if (params.row.validType == "2")
              return h("Span", {}, "领取后" + params.row.validDays + "天有效");
          }
        },
        {
          title: "每人限领",
          align: "center",
          width: 120,
          render: (h, params) => {
            return h("Span", {}, params.row.limitPerUser + "张");
          }
        },
        {
          title: "发行总量",
          align: "center",
          width: 120,
          render: (h, params) => {
            return h("Span", {}, params.row.totalCount + "张");
          }
        },
        {
          title: "已领取",
          align: "center",
          width: 120,
          render: (h, params) => {
            return h(
              "Span",
              {},
              params.row.totalCount - params.row.availableCount + "张"
            );
          }
        },
        {
          title: "操作",
          align: "center",
          fixed: "right",
          width: 250,
          render: (h, params) => {
            let active = params.row.active;
            let type = active ? "warning" : "success";
            let statusText = active ? "暂停" : "发放";
            return h("span", {}, [
                h(
                "Button",
                {
                  props: {
                    type: "success",
                    size: "small"
                  },
                  style: {
                    marginRight: "8px"
                  },
                  on: {
                    click: () => {
                      this.coupondata(params.row);
                    }
                  }
                },
                "领取详情"
              ),
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
                    title: "你确定要修改该优惠券发放状态吗?",
                    transfer: true
                  },
                  on: {
                    "on-ok": () => {
                      if (active)
                        this.changeCouponStatus(
                          params.row.couponUuid,
                          "DISABLE"
                        );
                      else
                        this.changeCouponStatus(
                          params.row.couponUuid,
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
                    title: "删除后已领取的券仍可使用, 您确定要删除该优惠券吗?",
                    transfer: true
                  },
                  on: {
                    "on-ok": () => {
                      this.changeCouponStatus(params.row.couponUuid, "DELETE");
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
    handleSearch() {},
    //查询优惠券列表
    searchCoupon(startIndex, pageSize) {
      var keyArray = [];
      let searchOptions = {
        startIndex: startIndex,
        pageSize: pageSize
      };
      if (this.searchName) {
        searchOptions.name = this.searchName;
        keyArray.push("NAME");
      }
      if (this.searchType) {
        searchOptions.type = this.searchType;
        keyArray.push("TYPE");
      }
      searchOptions.keyArray = keyArray;
      this.loading = true;
      this.$http
        .post("/admin/searchCoupon", this.common.request(searchOptions))
        .then(
          res => {
            this.loading = false;
            if (res.data.body.status.statusCode == 0) {
              var data = res.data.body.data;
              this.couponData = data.coupons;
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
      this.searchCoupon(startIndex, this.pageSize);
    },
    multiplecouponcancel() {},
    multiplecouponok(form) {},
    add() {
      this.$router.push({
        name: "couponadd"
      });
    },
    edit(row) {
      this.$router.push({
        name: "couponedit",
        params: { couponUuid: row.couponUuid }
      });
    },
    //发放, 暂停, 删除优惠券
    changeCouponStatus(couponUuid, actionType) {
      let options = {
        actionType: actionType,
        couponUuid: couponUuid
      };
      this.$http.post("/admin/changeCoupon", this.common.request(options)).then(
        response => {
          this.loading = false;
          if (response.data.body.status.statusCode == 0) {
            var data = response.data.body.data;
            var desc = "优惠券状态已修改";
            if (actionType == "DELETE") desc = "优惠券已删除";
            this.$Notice.success({
              title: "成功",
              desc: desc,
              duration: 2
            });
            this.searchCoupon(0, this.pageSize);
          } else {
            this.$Message.error(response.data.body.status.errorDesc);
          }
        },
        response => {
          this.loading = false;
          this.$Message.error("保存失败，请检查各项是否填写正确");
        }
      );
    },
    coupondata(row) {
      this.$router.push({
        name: "coupondata",
        params: {
            couponUuid: row.couponUuid
        }
      });
    }
  },
  created() {
    this.searchCoupon(0, this.pageSize);
  }
};
</script>
