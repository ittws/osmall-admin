<style lang="less">
@import "../../styles/common.less";
</style>

<template>
  <div>
    <Row class="margin-top-10">
      <Col span="24">
        <Card>
          <p slot="title">评论列表</p>
          <Row>
            <RadioGroup v-model="dateSearchType" @on-change="changeSearchDateType">
              <Radio label="1">今日</Radio>
              <Radio label="2">昨日</Radio>
              <Radio label="3">最近七日</Radio>
              <Radio label="4" disabled>自定义时间段</Radio>
              <DatePicker
                v-model="searchDateRange"
                @click.native="clickSearchDateRange"
                type="daterange"
                placement="bottom-end"
                placeholder="评价日期"
                style="width: 200px"
              ></DatePicker>
              <!-- <Select v-model="selectedSupplierUuid" style="width:240px" placeholder="供应商" clearable filterable>
						 	<Option v-for="item in suppliers" :value="item.supplierUuid" :key="item.supplierUuid">{{ item.supplierName }}</Option>
              </Select>-->
              <Input
                v-model="searchProductName"
                placeholder="商品名称"
                type="text"
                style="width: 150px"
                clearable
              />
              <Button type="success" @click="searchData()">查询</Button>
            </RadioGroup>
          </Row>
          <Row class="margin-top-10">
            <Col span="24">
              <div>
                <Table
                  :columns="commentColumn"
                  :loading="loading"
                  :data="commentData"
                  border
                  stripe
                  ref="orderTable"
                ></Table>
              </div>
            </Col>
          </Row>
          <Row class="margin-top-10">
            <Col span="18">
              <Page
                ref="orderpage"
                :total="total"
                size="small"
                :pageSize="pageSize"
                @on-change="changepage"
                show-total
                show-elevator
              ></Page>
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
    <Modal v-model="replyModal" width="400px" title="回复内容">
      <Input type="textarea" v-model="replayContent" style="width:360px"></Input>
      <div slot="footer">
        <Button type="text" @click="replyModal = false">取消</Button>
        <Button :loading="replyLoading" type="primary" @click="changeComment()">提交</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import table2excel from "@/libs/table2excel.js";
export default {
  components: {},
  data() {
    return {
      replyLoading: false,
      searchProductName: "",
      dateSearchType: "3",
      replyModal: false,
      replyType: "",
      searchDateRange: [],
      // suppliers: [],
      // selectedSupplierUuid:'',
      loading: true,
      commentColumn: [
        {
          title: "商品名称",
          key: "productName",
          render: (h, params) => {
            return h(
              "span",
              {
                props: {
                  row: params.row
                }
              },
              [
                h("img", {
                  attrs: {
                    src: params.row.productDTO.productMainImage.url
                  },
                  style: {
                    width: "60px",
                    height: "48px",
                    display: "inline-block",
                    float: "left",
                    margin: "5px 0"
                  }
                }),
                h(
                  "span",
                  {
                    style: {
                      display: "inline-block",
                      float: "right",
                      width: "100px",
                      marginTop: "10px"
                    }
                  },
                  params.row.productDTO.productName
                )
              ]
            );
          }
        },
        {
          title: "评论时间",
          width: 140,
          align: "center",
          key: "evaluateTime"
        },
        {
          title: "会员信息",
          align: "center",
          width: 150,
          key: "userName",
          render: (h, params) => {
            var name = "";
            var personalPhone = "";
            if (params.row.userDTO.name) {
              name = params.row.userDTO.name;
            }
            if (params.row.userDTO.personalPhone) {
              personalPhone = params.row.userDTO.personalPhone;
            }
            return h("div", [h("span", {}, name + personalPhone)]);
          }
        },

        // {
        // 	title: '供应商',
        // 	width: 160,
        // 	align: 'center',
        // 	render: (h, params) => {
        // 	    return h('span', {
        // 	    }, params.row.orderDTO.supplierName);
        // 	}
        // },
        {
          title: "评级",
          width: 110,
          align: "center",
          render: (h, params) => {
            const commentRank = params.row.commentRank;
            return h("Span", {}, commentRank + "星");
          }
        },
        {
          title: "是否显示",
          align: "center",
          width: 150,
          render: (h, params) => {
            return h("i-switch", {
              props: {
                type: "primary",
                value: params.row.show //控制开关的打开或关闭状态，官网文档属性是value
              },
              style: {
                marginRight: "5px"
              },
              on: {
                "on-change": value => {
                  //触发事件是on-change,用双引号括起来，
                  //参数value是回调值，并没有使用到
                  this.changeReplayShowStatus(params.index); //params.index是拿到table的行序列，可以取到对应的表格值
                }
              }
            });
          }
        },
        {
          title: "评论信息",
          align: "center",
          key: "commentContent"
        },
        {
          title: "回复信息",
          align: "center",
          key: "replayContent"
        },
        {
          title: "操作",
          align: "center",
          width: 250,
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  style: {
                    margin: "0 5px 0 0",
                    display: params.row.replayContent ? "none" : "display"
                  },
                  on: {
                    click: event => {
                      this.reply(params.row, "ADD");
                    }
                  }
                },
                "回复评论"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  style: {
                    margin: "0 5px 0 0",
                    display: params.row.replayContent ? "display" : "none"
                  },
                  on: {
                    click: event => {
                      this.reply(params.row, "EDIT");
                    }
                  }
                },
                "修改回复"
              ),
              h(
                "Poptip",
                {
                  props: {
                    confirm: true,
                    title: "您确定要删除该评论吗?",
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
                    "删除评论"
                  )
                ]
              )
            ]);
          }
        }
      ],
      totalData: [],
      commentData: [],
      total: 0,
      pageSize: 20,
      startIndex: 0,
      replayContent: "",
      productCommentUuid: ""
    };
  },
  methods: {
	  changeReplayShowStatus(index){
		  var comment = this.commentData[index];
		  this.productCommentUuid = comment.productCommentUuid;
		  this.replyType = comment.show?'HIDE':'SHOW';
		  this.changeComment()
	  },
    reply(row, actionType) {
      this.productCommentUuid = row.productCommentUuid;
      this.replyModal = true;
      this.replyType = actionType;
    },
    del(row) {
      var options = {
        actionType: "DELETE",
        productCommentUuid: row.productCommentUuid
      };
      this.$http
        .post("/admin/replayProductComment", this.common.request(options))
        .then(
          response => {
            if (response.data.body.status.statusCode == 0) {
              this.$Notice.success({
                title: "该评论已删除",
                duration: 2
              });
              this.searchComment(this.startIndex, this.pageSize);
            } else {
              this.$Message.error(response.data.body.status.errorDesc);
            }
          },
          response => {
            this.$Message.error("失败，请稍后重试");
          }
        );
    },
    changeComment() {
      var options = {
        actionType: "ADD",
        productCommentUuid: this.productCommentUuid,
        replayContent: this.replayContent
      };
	  if (this.replyType === "EDIT") options.actionType = "MODIFY";
	  else if (this.replyType === "SHOW"){
		  options.actionType = "SHOW";
		  options.show = true;
	  }else if (this.replyType === "HIDE"){
		  options.actionType = "HIDE";
		  options.show = false;
	  }
      this.replyLoading = true;
      this.$http
        .post("/admin/replayProductComment", this.common.request(options))
        .then(
          response => {
            this.replyLoading = false;
            if (response.data.body.status.statusCode == 0) {
			  this.replyModal = false;
			  var title = '评论已回复';
			  if(this.replyType === 'EDIT')	title='评论回复已修改';
			  if(this.replyType === 'SHOW')	title='评论已设为可见';
			  if(this.replyType === 'HIDE')	title='评论已设为隐藏';
              this.$Notice.success({
                title: title,
                duration: 2
              });
              this.searchComment(this.startIndex, this.pageSize);
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
    changeSearchDateType() {
      if (this.dateSearchType != "4") {
        this.searchDateRange = [];
      }
    },
    clickSearchDateRange() {
      this.dateSearchType = "4";
    },
    getData() {
      this.searchComment(this.startIndex, this.pageSize);
    },
    searchData() {
      this.searchComment(this.startIndex, this.pageSize);
      this.resetpage();
    },
    resetpage() {
      this.$nextTick(function() {
        this.$refs["orderpage"].currentPage = 1;
      });
    },
    searchComment(startIndex, pageSize) {
      this.loading = true;
      let searchOptions = {
        startIndex: startIndex,
        pageSize: pageSize
      };
      let keyArray = [];
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
          let t = this.searchDateRange;
          let startDateT = t[0];
          let endDateT = t[1];
          startDate = startDateT;
          endDate = endDateT;
        }
        keyArray.push("DATE");
        searchOptions.dateStart = startDate;
        searchOptions.dateEnd = endDate;
      }
      //判断是否有供应商查询条件
      if (this.selectedSupplierUuid) {
        keyArray.push("SUPPLIERNAME");
        searchOptions.supplierUuid = this.selectedSupplierUuid;
      }
      if (this.searchProductName) {
        keyArray.push("PRODUCTNAME");
        searchOptions.productName = this.searchProductName;
      }
      searchOptions.keyArray = keyArray;
      this.$http
        .post("/admin/searchProductComment", this.common.request(searchOptions))
        .then(
          response => {
            this.loading = false;
            if (response.data.body.status.statusCode == 0) {
              var data = response.data.body.data;
              this.commentData = data.commentList;
              this.total = data.total;
            } else {
              this.loading = false;
              this.$Message.error(response.data.body.status.errorDesc);
            }
          },
          response => {
            this.$Message.error(response.data.body.status.errorDesc);
            this.loading = false;
          }
        );
    },
    //处理分页-页数改变
    changepage(index) {
      this.startIndex = (index - 1) * this.pageSize;
      this.searchComment(this.startIndex, this.pageSize);
    }
    // inquirySupplier() {
    // 	var options = {};
    // 	this.$http
    // 		.post("/admin/inquirySupplier", this.common.request(options))
    // 		.then(
    // 			response => {
    // 				if (response.data.body.status.statusCode == 0) {
    // 					this.suppliers = response.data.body.data.suppliers;
    // 				} else {
    // 					this.$Message.error(response.data.body.status.errorDesc);
    // 				}
    // 			},
    // 			response => {
    // 				this.$Message.error("失败，请稍后重试");
    // 			}
    // 		);
    // },
  },
  created() {
    this.getData();
    // this.inquirySupplier();
  }
};
</script>
