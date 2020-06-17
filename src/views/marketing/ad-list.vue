<style lang="less">
@import "../../styles/common.less";
</style>

<template>
  <div>
    <Row class="margin-top-10">
      <Col span="24">
        <Card>
          <p slot="title">广告列表</p>
           <Row>
            <!-- <Select v-model="searchType" clearable style="width: 150px">
              <Option value>全部</Option>
              <Option value="CASH">现金券</Option>
              <Option value="DISCOUNT">折扣券</Option>
            </Select>
            <Input
              clearable
              type="text"
              v-model="searchName"
              placeholder="广告名称"
              style="width: 150px"
            />
            <Button type="primary" @click="searchCoupon()">搜索</Button> -->
            <div class="f_r">
              <Button icon="plus" type="primary" @click="add()">新增广告</Button>
            </div>
          </Row>

          <Row class="margin-top-10">
            <Col span="24">
              <div>
                <Table
                  :columns="adColumn"
                  :data="adData"
                  :loading="loading"
                  border
                  stripe
                  ref="adTable"
                ></Table>
              </div>
            </Col>
          </Row>
          <Row class="margin-top-10">
            <Page
              ref="adpage"
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
export default {
  components: {},
  data() {
    return {
      loading: false,
      adData: [],
      adColumn: [
        {
          title: "广告图片",
          align: "center",
          key: "name",
          width: 200,
          render: (h, params) => {
            return h("img", {
              attrs: {
                src: params.row.url
              },
              style: {
                width: "100%",
                height: "100px",
                display: "inline-block",
                float: "left",
                padding: "5px"
              }
            });
          }
        },
        {
          title: "位置",
          align: "center",
          width: 300,
          key: 'location'
        },
        {
          title: "广告商品分类",
          align: "center",
           width: 120,
          render: (h, params) => {
            var cateName = '';
            var location = params.row.location;
            if (location == "商品分类页") cateName = params.row.productCateDTO.cateName;
            return h("Span", {}, cateName);
          }
        },
        {
          title: "广告链接",
          align: "center",
          render: (h, params) => {
            var linkType = params.row.linkType;
            var linkValue = "";
            if (linkType == "商品详情页") linkValue = '商品 - '+params.row.productDTO.productName;
            if (linkType == "商品组") linkValue = '商品组 - '+params.row.groupDTO.groupName;
            else if (linkType == "自定义内容") linkValue = "自定义内容";
            else if (linkType == "外部网页链接") linkValue = params.row.content;
            return h("Span", {}, linkValue);
          }
        },
        {
          title: "是否显示",
          align: "center",
          width: 120,
          render: (h, params) => {
            var active = params.row.active;
            var status = "不显示";
            var color = params.row.active ? "green" : "red";
            if (active) {
              status = "显示";
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
          title: "操作",
          align: "center",
          width: 200,
          render: (h, params) => {
            let active = params.row.active;
            let type = active ? "warning" : "success";
            let statusText = active ? "关闭" : "启用";
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
                    title: "你确定要修改该广告状态吗?",
                    transfer: true
                  },
                  on: {
                    "on-ok": () => {
                      if (active)
                        this.changeAd(
                          params.row.adUuid,
                          "DISABLE"
                        );
                      else
                        this.changeAd(
                          params.row.adUuid,
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
                    title: "您确定要删除该广告吗?",
                    transfer: true
                  },
                  on: {
                    "on-ok": () => {
                      this.changeAd(params.row.adUuid, "DELETE");
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
    //查询广告列表
    inquiryAd() {
      let searchOptions = {};
      this.loading = true;
      this.$http.post("/admin/inquiryAd", this.common.request(searchOptions)).then(
        res => {
          this.loading = false;
          if (res.data.body.status.statusCode == 0) {
            var data = res.data.body.data;
            this.adData = data.ads;
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
        name: "adadd"
      });
    },
    edit(row) {
      this.$router.push({
        name: "adedit",
        params: { adUuid: row.adUuid }
      });
    },
    //删除广告
    changeAd(adUuid, actionType) {
      let options = {
        actionType: actionType,
        adUuid: adUuid
      };
      this.$http.post("/admin/changeAd", this.common.request(options)).then(
        response => {
          this.loading = false;
          if (response.data.body.status.statusCode == 0) {
            var data = response.data.body.data;
            var desc = "广告状态已修改";
            if (actionType == "DELETE") desc = "广告已删除";
            this.$Notice.success({
              title: "成功",
              desc: desc,
              duration: 2
            });
            this.inquiryAd();
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
    this.inquiryAd();
  }
};
</script>
