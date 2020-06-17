<style lang="less">
@import "../../styles/common.less";
</style>

<template>
  <div>
    <Row class="margin-top-10">
      <Col span="24">
        <Card>
          <p slot="title">培训分润</p>
          <Row>
            <Form>
              <FormItem label="开启培训分润">
                <i-switch
                  v-model="profitTrainerEnabled"
                  size="large"
                  :true-value="true"
                  :false-value="false"
                  @on-change="changeProfitTrainerEnabled"
                >
                  <span slot="open">是</span>
                  <span slot="close">否</span>
                </i-switch>
              </FormItem>
              <Row style="margin-top:20px" v-if="profitTrainerEnabled">
                <Col span="15">
                  <Alert type="warning">培训分润按照团队每月销售额进行统计, 当达到对应销售额等级后, 该团队的培训导师获得相应的分润, 月底结算。</Alert>
                </Col>
              </Row>
              <div v-if="profitTrainerEnabled">
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
                        <Col span="6" style="background-color:#999;padding:5px">培训奖金比列</Col>
                      </Row>

                      <Row v-for="(trainer,index) in level.profitTrainerList">
                        <Col span="6" style="border-bottom:.5px solid #f3f3f3;padding:5px">
                          <InputNumber :min="0" v-model="trainer.amount" style="width:150px"></InputNumber>
                        </Col>
                        <Col span="6" style="border-bottom:.5px solid #f3f3f3;padding:5px">
                          <InputNumber v-model="trainer.rating" style="width:150px">
                            :max="100"
                            :min="0"
                          </InputNumber>%
                        </Col>
                        <Col span="4" style="padding:5px">
                          <Button
                            size="small"
                            type="error"
                            @click="deleteTrainer(levelIndex,index)"
                          >删除</Button>
                        </Col>
                      </Row>
                      <Row style="padding:5px;">
                        <Col span="6">
                          <Button type="default" @click="addTrainer(levelIndex)">添加比例项</Button>
                        </Col>
                        <Col span="6">
                          <Button
                            :loading="loading"
                            type="success"
                            @click="saveProfitTrainer(level)"
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
      profitTrainerEnabled: true,
      loading: false,
      userLevels: [] //会员等级
    };
  },
  methods: {
    addTrainer(levelIndex) {
      var level = this.userLevels[levelIndex];
      level.profitTrainerList.push({
        amount: 0,
        rating: 0
      });
      this.$set(this.userLevels, levelIndex, level);
    },
    deleteTrainer(levelIndex, index) {
      var level = this.userLevels[levelIndex];
      level.profitTrainerList.splice(index, 1);
      this.$set(this.userLevels, levelIndex, level);
    },
    saveProfitTrainer(level) {
      let options = {
        profitUserLevel: {
          userLevelUuid: level.userLevelUuid
        },
        trainerList: level.profitTrainerList
      };
      this.loading = true;
      this.$http
        .post("/admin/changeProfitTrainer", this.common.request(options))
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
    changeProfitTrainerEnabled(e) {
      this.profitTrainerEnabled = e;
      this.changeParameter("PROFIT_TRAINER_ENABLED", e ? "1" : "0");
    },
    inquiryProfitTrainer(userLevel) {
      this.$http
        .post(
          "/admin/inquiryProfitTrainer",
          this.common.request({
            profitUserLevel: userLevel
          })
        )
        .then(
          res => {
            if (res.data.body.status.statusCode == 0) {
              this.loading = false;
              //   userLevel.profitTrainerList =
              //     res.data.body.data.trainerList;
              this.$set(
                userLevel,
                "profitTrainerList",
                res.data.body.data.trainerList
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
              that.inquiryProfitTrainer(val);
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
    isProfitTrainerEnabled(name) {
      this.$http
        .post(
          "/inquiryParameter",
          this.common.request({ name: "PROFIT_RECRUIT_ENABLED" })
        )
        .then(
          res => {
            if (res.data.body.status.statusCode == 0) {
              this.profitTrainerEnabled =
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
    this.isProfitTrainerEnabled();
  }
};
</script>
