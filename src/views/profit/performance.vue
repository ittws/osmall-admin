<style lang="less">
@import "../../styles/common.less";
</style>

<template>
  <div>
    <Row class="margin-top-10">
      <Col span="24">
        <Card>
          <p slot="title">团队业绩分润</p>
          <Row>
            <Form>
              <FormItem label="开启团队业绩分润">
                <i-switch
                  v-model="profitPerformanceEnabled"
                  size="large"
                  :true-value="true"
                  :false-value="false"
                  @on-change="changeProfitPerformanceEnabled"
                >
                  <span slot="open">是</span>
                  <span slot="close">否</span>
                </i-switch>
              </FormItem>
              <Row style="margin-top:20px" v-if="profitPerformanceEnabled">
                <Col span="15">
                  <Alert type="warning">团队业绩按照团队每月销售额进行统计, 分润金额按照下面的设置进行计算 月底结算。</Alert>
                </Col>
              </Row>
              <div v-if="profitPerformanceEnabled">
                <Collapse accordion>
                  <Panel
                    :name="level.name"
                    v-bind:key="level.userLevelUuid"
                    v-for="(level,levelIndex) in userLevels"
                  >
                    {{level.name}}
                    <div slot="content">
                      <Row style="color:#333;">
                        <Col span="6" style="background-color:#999;padding:5px">累计业绩</Col>
                        <Col span="6" style="background-color:#999;padding:5px">团队业绩奖金比列</Col>
                      </Row>

                      <Row v-for="(performance,index) in level.profitPerformanceList">
                        <Col span="6" style="border-bottom:.5px solid #f3f3f3;padding:5px">
                          <InputNumber :min="0" v-model="performance.amount" style="width:150px"></InputNumber>
                        </Col>
                        <Col span="6" style="border-bottom:.5px solid #f3f3f3;padding:5px">
                          <InputNumber v-model="performance.rating" style="width:150px">
                            :max="100"
                            :min="0"
                          </InputNumber>%
                        </Col>
                        <Col span="4" style="padding:5px">
                          <Button
                            size="small"
                            type="error"
                            @click="deletePerformance(levelIndex,index)"
                          >删除</Button>
                        </Col>
                      </Row>
                      <Row style="padding:5px;">
                        <Col span="6">
                          <Button type="default" @click="addPerformance(levelIndex)">添加比例项</Button>
                        </Col>
                        <Col span="6">
                          <Button
                            :loading="loading"
                            type="success"
                            @click="saveProfitPerformance(level)"
                          >保存设置</Button>
                        </Col>
                      </Row>
                    </div>
                  </Panel>
                </Collapse>
              </div>
            </Form>
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
      profitPerformanceEnabled: true,
      loading: false,
      userLevels: [] //会员等级
    };
  },
  methods: {
    addPerformance(levelIndex) {
      var level = this.userLevels[levelIndex];
      level.profitPerformanceList.push({
        amount: 0,
        rating: 0
      });
      this.$set(this.userLevels, levelIndex, level);
    },
    deletePerformance(levelIndex, index) {
      var level = this.userLevels[levelIndex];
      level.profitPerformanceList.splice(index, 1);
      this.$set(this.userLevels, levelIndex, level);
    },
    saveProfitPerformance(level) {
      let options = {
        profitUserLevel: {
          userLevelUuid: level.userLevelUuid
        },
        performanceList: level.profitPerformanceList
      };
      this.loading = true;
      this.$http
        .post("/admin/changeProfitPerformance", this.common.request(options))
        .then(
          response => {
            this.loading = false;
            if (response.data.body.status.statusCode == 0) {
              var data = response.data.body.data;
              this.$Notice.success({
                desc: "保存参数成功",
                duration: 2
              });
            } else {
              this.$Notice.success({
                title: "失败",
                desc: "response.data.body.status.errorDesc",
                duration: 2
              });
            }
          },
          response => {
            this.$Message.error("出错了，请稍后重试");
            this.loading = false;
          }
        );
    },
    changeProfitPerformanceEnabled(e) {
      this.profitPerformanceEnabled = e;
      this.changeParameter("PROFIT_PERFORMANCE_ENABLED", e ? "1" : "0");
    },
    inquiryProfitPerformance(userLevel) {
      this.$http
        .post(
          "/admin/inquiryProfitPerformance",
          this.common.request({
            profitUserLevel: userLevel
          })
        )
        .then(
          res => {
            if (res.data.body.status.statusCode == 0) {
              this.loading = false;
              //   userLevel.profitPerformanceList =
              //     res.data.body.data.performanceList;
              this.$set(
                userLevel,
                "profitPerformanceList",
                res.data.body.data.performanceList
              );
            } else {
              this.$Message.error(response.data.body.status.errorDesc);
            }
          },
          res => {
            this.loading = false;
            this.$Message.error("出错了, 请稍后重试");
          }
        );
    },
    inquiryUserLevel() {
      let that = this;
      this.$http.post("/admin/inquiryUserLevel", this.common.request({})).then(
        res => {
          if (res.data.body.status.statusCode == 0) {
            this.userLevels = res.data.body.data.levels;
            this.userLevels.forEach(function(val, index) {
              that.inquiryProfitPerformance(val);
            });
          } else {
            this.$Message.error(response.data.body.status.errorDesc);
          }
        },
        res => {
          this.$Message.error("出错了, 请稍后重试");
        }
      );
    },
    isProfitPerformanceEnabled(name) {
      this.$http
        .post(
          "/inquiryParameter",
          this.common.request({ name: "PROFIT_RECRUIT_ENABLED" })
        )
        .then(
          res => {
            if (res.data.body.status.statusCode == 0) {
              this.profitPerformanceEnabled =
                res.data.body.data.value == "1" ? true : false;
            } else {
              this.$Message.error(response.data.body.status.errorDesc);
            }
          },
          res => {
            this.$Message.error("出错了, 请稍后重试");
          }
        );
    },
    changeParameter(name, value) {
      var options = {
        settings: [
          {
            name: name,
            value: value
          }
        ]
      };
      this.$http
        .post("/admin/changeParameter", this.common.request(options))
        .then(
          res => {
            if (res.data.body.status.statusCode == 0) {
            } else {
              this.$Message.error(response.data.body.status.errorDesc);
            }
          },
          res => {
            this.$Message.error("出错了, 请稍后重试");
          }
        );
    }
  },
  created() {
    this.inquiryUserLevel();
    this.isProfitPerformanceEnabled();
  }
};
</script>
