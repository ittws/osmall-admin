<style lang="less">
@import "../../styles/common.less";
</style>

<template>
  <div>
    <Form :label-width="100">
      <Card>
        <p slot="title">分销设置</p>
        <Row type="flex" justify="start">
          <Col span="12">
            <FormItem label="开启分销">
                <i-switch
                v-model="profitDistribution.distributionEnabled"
                size="large"
                :true-value="true"
                :false-value="false"
                >
              <span slot="open">是</span>
              <span slot="close">否</span>
            </i-switch>
            </FormItem>
          </Col>
        </Row>
        <Row v-if="profitDistribution.distributionEnabled">
            <Col span="15">
                <Alert type="warning">开启分销后, 佣金将按照设置的分佣比例计算, 同时推广分润、销售分润、团队业绩分润、培训分润设置将失效</Alert>
            </Col>
        </Row>
        <Row type="flex" justify="start" v-if="profitDistribution.distributionEnabled">
          <Col span="12">
            <FormItem label="分销级别">
              <RadioGroup v-model="profitDistribution.distributionLevel">
                    <Radio label="1">
                      <span>一级分销</span>
                    </Radio>
                    <Radio label="2">
                      <span>二级分销</span>
                    </Radio>
                    <Radio label="3">
                      <span>三级分销</span>
                    </Radio>
                  </RadioGroup>
            </FormItem>
          </Col>
        </Row>
        <Row type="flex" justify="start" v-if="profitDistribution.distributionEnabled && profitDistribution.distributionLevel>0">
          <Col span="24">
            <FormItem label="一级分佣比例">
              <InputNumber
                :min="0"
                v-model="profitDistribution.level1Rate"
                style="width:150px"
              />&nbsp;&nbsp;&nbsp;%
            </FormItem>
          </Col>
        </Row>
        <Row type="flex" justify="start" v-if="profitDistribution.distributionEnabled && profitDistribution.distributionLevel>1">
          <Col span="24">
            <FormItem label="二级分佣比例">
              <InputNumber
                :min="0"
                v-model="profitDistribution.level2Rate"
                style="width:150px"
              />&nbsp;&nbsp;&nbsp;%
            </FormItem>
          </Col>
        </Row>
        <Row type="flex" justify="start" v-if="profitDistribution.distributionEnabled && profitDistribution.distributionLevel>2">
          <Col span="24">
            <FormItem label="三级分佣比例">
              <InputNumber
                :min="0"
                v-model="profitDistribution.level3Rate"
                style="width:150px"
              />&nbsp;&nbsp;&nbsp;%
            </FormItem>
          </Col>
        </Row>
        <Button @click="updateDistribution" type="primary" size="large" :loading="loading">保存</Button>
      </Card>
    </Form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      profitDistribution: {
          distributionEnabled: false,
          distributionLevel: 2,
          level1Rate: 7,
          level2Rate: 5,
          level3Rate: 3
      }
    };
  },
  methods: {
    updateDistribution() {
      this.loading = true;
      this.$http
        .post(
          "/admin/changeProfitDistribution",
          this.common.request(this.profitDistribution)
        )
        .then(
          response => {
            this.loading = false;
            if (response.data.body.status.statusCode == 0) {
              this.$Notice.success({
                title: "成功",
                desc: "分销设置已保存",
                duration: 2
              });
            } else {
              this.$Message.error(response.data.body.status.errorDesc);
            }
          },
          response => {
            this.loading = false;
          }
        );
    },
    getDistribution() {
      this.$http
        .post("/admin/inquiryProfitDistribution", this.common.request({}))
        .then(
          response => {
            if (response.data.body.status.statusCode == 0 && response.data.body.data) {
              this.profitDistribution = response.data.body.data;
            }
          },
          response => {}
        );
    }
  },
  created() {},
  mounted() {
    this.getDistribution();
  },
  destroyed() {}
};
</script>
<style>

</style>
