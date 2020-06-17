<style lang="less">
@import "../../styles/common.less";
@import "analysis.less";
</style>
<template>
  <div class="home-main">
    <Spin size="large" fix v-if="spinShow" class="mask"></Spin>
    <Card class="margin-top-20">
      <p slot="title">运营数据分析</p>
      <Row>
        <RadioGroup class="f_r" v-model="dateSearchType" @on-change="changeSearchDate">
          <Radio label="0">累计</Radio>
          <Radio label="1">今日</Radio>
          <Radio label="2">昨日</Radio>
          <Radio label="3">本月</Radio>
          <Radio label="4">上月</Radio>
          <Radio label="5">最近三个月</Radio>
          <Radio label="6">今年</Radio>
          <Radio label="7">去年</Radio>
          <Radio label="8" disabled>自定义时间段</Radio>
          <DatePicker
            v-model="customSearchDate"
            @click.native="customizeDate"
            type="daterange"
            placement="bottom-end"
            placeholder="查询日期"
            style="width: 200px"
          ></DatePicker>
          <Button type="success" @click="handleSearch()">查询</Button>
        </RadioGroup>
      </Row>
      <Row class="margin-top-20 box">
      <Col span="5">
        <div class="box-item bg-member">
          <Row>
            <Col span="12">
              <div class="value">{{operationData.userCount}}</div>
              <div class="desc">会员数</div>
              <!-- <div class="compare">
                累计
                <Icon type="arrow-up-b"></Icon>
              </div> -->
            </Col>
            <Col span="12" class="t_r margin-top-10">
              <Icon size="50" type="person-add"></Icon>
            </Col>
          </Row>
        </div>
      </Col>
      <Col span="5">
        <div class="box-item bg-amount">
          <Row>
            <Col span="12">
              <div class="value">{{operationData.merchantCount}}</div>
              <div class="desc">商家数</div>
              <!-- <div class="compare">
                累计
              </div> -->
            </Col>
            <Col span="12" class="t_r margin-top-10">
            <Icon size="50" type="person-add"></Icon>
            </Col>
          </Row>
        </div>
      </Col>
      <Col span="4">
        <div class="box-item bg-order">
          <Row>
            <Col span="12">
              <div class="value">{{operationData.orderCount}}</div>
              <div class="desc">订单数</div>
              <!-- <div class="compare">
                累计
              </div> -->
            </Col>
            <Col span="12" class="t_r margin-top-10">
            <Icon size="50" type="ios-list"></Icon>
            </Col>
          </Row>
        </div>
      </Col>
      <Col span="5">
        <div class="box-item bg-amount">
          <Row>
            <Col span="12">
              <div class="value">￥{{operationData.orderAmount}}</div>
              <div class="desc">销售额</div>
              <!-- <div class="compare">
                累计
              </div> -->
            </Col>
            <Col span="12" class="t_r margin-top-10">
              <Icon size="50" type="social-usd"></Icon>
            </Col>
          </Row>
        </div>
      </Col>
      <Col span="5">
        <div class="box-item bg-order">
          <Row>
            <Col span="12">
              <div class="value">￥{{operationData.awardAmount}}</div>
              <div class="desc">奖金支出</div>
              <!-- <div class="compare">
                累计
              </div> -->
            </Col>
            <Col span="12" class="t_r margin-top-10">
            <Icon size="50" type="social-usd"></Icon>
            </Col>
          </Row>
        </div>
      </Col>
    </Row>
    <Row>
      <Col span="12">
        <div class="hot-product-pannel">
          <Card class="margin-top-20">
            <p slot="title">商品销售数量排行</p>
            <Row>
              <Table
                class="table"
                :show-header="false"
                :columns="unitHotProductColumn"
                :data="unitHotProductData"
                stripe
              ></Table>
            </Row>
          </Card>
        </div>
      </Col>
      <Col span="12">
        <div class="hot-product-pannel">
          <Card class="margin-top-20">
            <p slot="title">商品销售金额排行</p>
            <Row>
              <Table
                class="table"
                :show-header="false"
                :columns="amountHotProductColumn"
                :data="amountHotProductData"
                stripe
              ></Table>
            </Row>
          </Card>
        </div>
      </Col>
      <Col span="12">
        <div class="hot-product-pannel">
          <Card class="margin-top-20">
            <p slot="title">商家订单数量排行</p>
            <Row>
              <Table
                class="table"
                :show-header="true"
                :columns="unitHotMerchantColumn"
                :data="unitHotMerchantData"
                stripe
              ></Table>
            </Row>
          </Card>
        </div>
      </Col>
      <Col span="12">
        <div class="hot-product-pannel">
          <Card class="margin-top-20">
            <p slot="title">商家订单金额排行</p>
            <Row>
              <Table
                class="table"
                :show-header="true"
                :columns="amountHotMerchantColumn"
                :data="amountHotMerchantData"
                stripe
              ></Table>
            </Row>
          </Card>
        </div>
      </Col>
    </Row>
      <Row class="margin-top-20">
        <Col span="12">
          <div id="orderChart" :style="{width: '100%', height: '400px'}"></div>
        </Col>
        <Col span="12">
          <div id="amountChart" :style="{width: '100%', height: '400px'}"></div>
        </Col>
        <Col span="12">
          <div id="memberChart" :style="{width: '100%', height: '400px'}"></div>
        </Col>
        <Col span="12">
          <div id="merchantChart" :style="{width: '100%', height: '400px'}"></div>
        </Col>
      </Row>
    </Card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dashboardType: '今日运营数据',
      customSearchDate: [],
      dateSearchType: "3",
      operationData: {},
      spinShow: true,
      unitHotProductData: [],
      amountHotProductData: [],
      unitHotMerchantData: [],
      amountHotMerchantData: [],
      unitHotProductColumn: [
        {
          title: "",
          key: "productName",
          width: 25,
          align: "left",
          render: (h, params) => {
            var index = params.index;
            if (index == 0)
              return h(
                "Icon",
                {
                  attrs: {
                    type: "lock-combination",
                    color: "#F9D42D",
                    size: "18"
                  }
                },
                ""
              );
            else if (index == 1)
              return h(
                "Icon",
                {
                  attrs: {
                    type: "lock-combination",
                    color: "#D3D3D3",
                    size: "18"
                  }
                },
                ""
              );
            else if (index == 2)
              return h(
                "Icon",
                {
                  attrs: {
                    type: "lock-combination",
                    color: "#F69F50",
                    size: "18"
                  }
                },
                ""
              );
            else return h("Span", {}, index + 1);
          }
        },
        {
          title: "商品",
          key: "productName",
          width: 180,
          align: "left"
        },
        {
          title: "销量",
          key: "productUnit",
          width: 80,
          align: "left",
          render: (h, params) => {
            var index = params.index;
            if (index == 0)
              return h(
                "Tag",
                {
                  attrs: {
                    color: "#F9D42D"
                  }
                },
                params.row.productUnit
              );
            else if (index == 1)
              return h(
                "Tag",
                {
                  attrs: {
                    color: "#D3D3D3"
                  }
                },
                params.row.productUnit
              );
            else if (index == 2)
              return h(
                "Tag",
                {
                  attrs: {
                    color: "#F69F50"
                  }
                },
                params.row.productUnit
              );
            else
              return h(
                "Tag",
                {
                  color: "gray"
                },
                params.row.productUnit
              );
          }
        }
      ],
      amountHotProductColumn: [
        {
          title: "",
          key: "productName",
          width: 25,
          align: "left",
          render: (h, params) => {
            var index = params.index;
            if (index == 0)
              return h(
                "Icon",
                {
                  attrs: {
                    type: "lock-combination",
                    color: "#F9D42D",
                    size: "18"
                  }
                },
                ""
              );
            else if (index == 1)
              return h(
                "Icon",
                {
                  attrs: {
                    type: "lock-combination",
                    color: "#D3D3D3",
                    size: "18"
                  }
                },
                ""
              );
            else if (index == 2)
              return h(
                "Icon",
                {
                  attrs: {
                    type: "lock-combination",
                    color: "#F69F50",
                    size: "18"
                  }
                },
                ""
              );
            else return h("Span", {}, index + 1);
          }
        },
        {
          title: "商品",
          key: "productName",
          width: 180,
          align: "left"
        },
        {
          title: "销售额",
          key: "productAmount",
          width: 80,
          align: "left",
          render: (h, params) => {
            var index = params.index;
            if (index == 0)
              return h(
                "Tag",
                {
                  attrs: {
                    color: "#F9D42D"
                  }
                },
                params.row.productAmount
              );
            else if (index == 1)
              return h(
                "Tag",
                {
                  attrs: {
                    color: "#D3D3D3"
                  }
                },
                params.row.productAmount
              );
            else if (index == 2)
              return h(
                "Tag",
                {
                  attrs: {
                    color: "#F69F50"
                  }
                },
                params.row.productAmount
              );
            else
              return h(
                "Tag",
                {
                  color: "gray"
                },
                params.row.productAmount
              );
          }
        }
      ],
      unitHotMerchantColumn: [
        {
          title: "",
          key: "merchantName",
          width: 25,
          align: "left",
          render: (h, params) => {
            var index = params.index;
            if (index == 0)
              return h(
                "Icon",
                {
                  attrs: {
                    type: "lock-combination",
                    color: "#F9D42D",
                    size: "18"
                  }
                },
                ""
              );
            else if (index == 1)
              return h(
                "Icon",
                {
                  attrs: {
                    type: "lock-combination",
                    color: "#D3D3D3",
                    size: "18"
                  }
                },
                ""
              );
            else if (index == 2)
              return h(
                "Icon",
                {
                  attrs: {
                    type: "lock-combination",
                    color: "#F69F50",
                    size: "18"
                  }
                },
                ""
              );
            else return h("Span", {}, index + 1);
          }
        },
        {
          title: "商家",
          key: "merchantName",
          align: "left"
        },
        {
          title: "总订单数",
          key: "productUnit",
          width: 120,
          align: "left",
          render: (h, params) => {
            var index = params.index;
            if (index == 0)
              return h(
                "Tag",
                {
                  attrs: {
                    color: "#F9D42D"
                  }
                },
                params.row.orderUnit
              );
            else if (index == 1)
              return h(
                "Tag",
                {
                  attrs: {
                    color: "#D3D3D3"
                  }
                },
                params.row.orderUnit
              );
            else if (index == 2)
              return h(
                "Tag",
                {
                  attrs: {
                    color: "#F69F50"
                  }
                },
                params.row.orderUnit
              );
            else
              return h(
                "Tag",
                {
                  color: "gray"
                },
                params.row.orderUnit
              );
          }
        },
        {
          title: "退款订单数",
          key: "orderReturnUnit",
          width: 120,
          align: "left"
        },
      ],
      amountHotMerchantColumn: [
        {
          title: "",
          key: "merchantName",
          width: 25,
          align: "left",
          render: (h, params) => {
            var index = params.index;
            if (index == 0)
              return h(
                "Icon",
                {
                  attrs: {
                    type: "lock-combination",
                    color: "#F9D42D",
                    size: "18"
                  }
                },
                ""
              );
            else if (index == 1)
              return h(
                "Icon",
                {
                  attrs: {
                    type: "lock-combination",
                    color: "#D3D3D3",
                    size: "18"
                  }
                },
                ""
              );
            else if (index == 2)
              return h(
                "Icon",
                {
                  attrs: {
                    type: "lock-combination",
                    color: "#F69F50",
                    size: "18"
                  }
                },
                ""
              );
            else return h("Span", {}, index + 1);
          }
        },
        {
          title: "商家",
          key: "merchantName",
          align: "left"
        },
        {
          title: "总订单金额",
          key: "orderAmount",
          width: 150,
          align: "left",
          render: (h, params) => {
            var index = params.index;
            if (index == 0)
              return h(
                "Tag",
                {
                  attrs: {
                    color: "#F9D42D"
                  }
                },
                params.row.orderAmount
              );
            else if (index == 1)
              return h(
                "Tag",
                {
                  attrs: {
                    color: "#D3D3D3"
                  }
                },
                params.row.orderAmount
              );
            else if (index == 2)
              return h(
                "Tag",
                {
                  attrs: {
                    color: "#F69F50"
                  }
                },
                params.row.orderAmount
              );
            else
              return h(
                "Tag",
                {
                  color: "gray"
                },
                params.row.orderAmount
              );
          }
        },
        {
          title: "退款金额",
          key: "orderReturnAmount",
          width: 150,
          align: "left"
        },
      ]
    };
  },
  methods: {
    changeSearchDate() {
      this.customSearchDate = null;
    },
    customizeDate() {
      this.dateSearchType = "8";
    },
    drawUserLine() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(
        document.getElementById("memberChart"),
        "light"
      );
      let option1 = {
        title: {
            x:'center',
            y:'top',
            text: '会员新增趋势',
            textAlign: 'center'
        },
        tooltip : {
            trigger: 'axis',
            formatter: function(params) {
            　　var result = ''
            　　var dotHtml = '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#4ABAF9"></span>'
            　　params.forEach(function (item) {
            　　　　result += item.axisValue + "</br>" + dotHtml + item.data
            　　})
            　　return result
            }
        },
        toolbox: {
            feature: {
                
            }
        },
        xAxis: {
          name: "日期",
          type: "category",
          boundaryGap: false,
          axisLine:{ 
            show:false
          },
          axisTick:{
            show:false
          },
          show:false,
          data: this.userCountCharts.key
        },
        yAxis: {
          name: "",
          type: "value",
          axisTick:{
            show:false
          },
          axisLine:{ 
            show:false
          },
          show:false
        },
        series: [
          {
            data: this.userCountCharts.value,
            type: "line",
            smooth: true,
            symbol: 'none',
            itemStyle: {
              normal: {
                lineStyle: {
                  color: "#4ABAF9"
                }
              }
            },
            areaStyle: { normal: {color: '#4ABAF9'} }
          }
        ]
      };

      // 绘制图表
      myChart.setOption(option1);
    },
    drawMerchantLine() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(
        document.getElementById("merchantChart"),
        "light"
      );
      let option1 = {
        title: {
            x:'center',
            y:'top',
            text: '商家新增趋势',
            textAlign: 'center'
        },
        tooltip : {
            trigger: 'axis',
            formatter: function(params) {
            　　var result = ''
            　　var dotHtml = '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#E5B88C"></span>'
            　　params.forEach(function (item) {
            　　　　result += item.axisValue + "</br>" + dotHtml + item.data
            　　})
            　　return result
            }
        },
        toolbox: {
            feature: {
                
            }
        },
        xAxis: {
          name: "日期",
          type: "category",
          boundaryGap: false,
          axisLine:{ 
            show:false
          },
          axisTick:{
            show:false
          },
          show:false,
          data: this.merchantCountCharts.key
        },
        yAxis: {
          name: "",
          type: "value",
          axisTick:{
            show:false
          },
          axisLine:{ 
            show:false
          },
          show:false
        },
        series: [
          {
            data: this.merchantCountCharts.value,
            type: "line",
            smooth: true,
            symbol: 'none',
            itemStyle: {
              normal: {
                lineStyle: {
                  color: "#E5B88C"
                }
              }
            },
            areaStyle: { normal: {color: '#E5B88C'} }
          }
        ]
      };

      // 绘制图表
      myChart.setOption(option1);
    },
    drawOrderLine() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(
        document.getElementById("orderChart"),
        "light"
      );

      let option1 = {
        title: {
            x:'center',
            y:'top',
            text: '订单数量趋势',
            textAlign: 'center'
        },
        tooltip : {
            trigger: 'axis',
            formatter: function(params) {
            　　var result = ''
            　　var dotHtml = '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#FD9091"></span>'
            　　params.forEach(function (item) {
            　　　　result += item.axisValue + "</br>" + dotHtml + item.data
            　　})
            　　return result
            }
        },
        toolbox: {
            feature: {
                
            }
        },
        xAxis: {
          name: "日期",
          type: "category",
          boundaryGap: false,
          axisLine:{ 
            show:false
          },
          axisTick:{
            show:false
          },
          show:false,
          data: this.orderCountCharts.key
        },
        yAxis: {
          name: "",
          type: "value",
          axisTick:{
            show:false
          },
          axisLine:{ 
            show:false
          },
          show:false
        },
        series: [
          {
            data: this.orderCountCharts.value,
            type: "line",
            smooth: true,
            symbol: 'none',
            itemStyle: {
              normal: {
                lineStyle: {
                  color: "#FD9091"
                }
              }
            },
            areaStyle: { normal: {color: '#FD9091'} }
          }
        ]
      };

      // 绘制图表
      myChart.setOption(option1);
    },
    drawAmountLine() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(
        document.getElementById("amountChart"),
        "light"
      );

      let option1 = {
        title: {
            x:'center',
            y:'top',
            text: '订单金额趋势',
            textAlign: 'center'
        },
        tooltip : {
            trigger: 'axis',
            formatter: function(params) {
            　　var result = ''
            　　var dotHtml = '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#B2F0D1"></span>'
            　　params.forEach(function (item) {
            　　　　result += item.axisValue + "</br>" + dotHtml + item.data
            　　})
            　　return result
            }
        },
        toolbox: {
            feature: {
                
            }
        },
        xAxis: {
          name: "日期",
          type: "category",
          boundaryGap: false,
          axisLine:{ 
            show:false
          },
          axisTick:{
            show:false
          },
          show:false,
          data: this.orderAmountCharts.key
        },
        yAxis: {
          name: "",
          type: "value",
          axisTick:{
            show:false
          },
          axisLine:{ 
            show:false
          },
          show:false
        },
        series: [
          {
            data: this.orderAmountCharts.value,
            type: "line",
            smooth: true,
            symbol: 'none',
            itemStyle: {
              normal: {
                lineStyle: {
                  color: "#B2F0D1"
                }
              }
            },
            areaStyle: { normal: {color: '#B2F0D1'} }
          }
        ]
      };

      // 绘制图表
      myChart.setOption(option1);
    },
    handleSearch() {
      this.spinShow = true;
      let searchOptions = {};
      //选择日期
      if (this.dateSearchType) {
        let dateType = this.dateSearchType;
        let startDate = null;
        let endDate = null;
        let currentDate = new Date();
        if (dateType == "0") {  //累计
          let tDate = new Date();
          tDate.setFullYear(currentDate.getFullYear() - 10);
          startDate = tDate;
          endDate = currentDate;
        } else if (dateType == "1") { //今天
          startDate = currentDate;
          endDate = currentDate;
        } else if (dateType == "2") { //昨天
          let tDate = new Date();
          tDate.setDate(currentDate.getDate()-1);
          startDate = tDate;
          endDate = tDate;
        } else if (dateType == "3") { //本月
          let tDate = new Date();
          tDate.setDate(1);
          startDate = tDate;
          endDate = currentDate;
        } else if (dateType == "4") { //上月
          startDate = this.dateutil.getFirstDayOfLastXMonth(1);
          endDate = this.dateutil.getLastDayOfLastXMonth(1);
        } else if (dateType == "5") { //最近三个月
          let tDate = this.dateutil.getFirstDayOfLastXMonth(2);
          startDate = tDate;
          endDate = currentDate;
        } else if (dateType == "6") { //今年
          let tDate = this.dateutil.getFirstDayOfThisYear();
          startDate = tDate;
          endDate = currentDate;
        } else if (dateType == "7") { //去年
          let tDate = this.dateutil.getFirstDayOfLastYear();
          startDate = tDate;
          endDate = new Date(currentDate.getFullYear()-1,11,31);
        } else if (dateType == "5") { //自定义
          let t = this.customSearchDate;
          let startDateT = t[0];
          let endDateT = t[1];
          startDate = startDateT;
          endDate = endDateT;
        }
        searchOptions.startDate = startDate;
        searchOptions.endDate = endDate;
      }
      this.$http
        .post(
          "/operation/statistic",
          this.common.request(searchOptions)
        )
        .then(
          res => {
            this.spinShow = false;
            if (res.data.body.status.statusCode == 0) {
              var data = res.data.body.data;
              this.operationData = data;
              this.unitHotProductData = data.topUnitProductList;
              this.amountHotProductData = data.topAmountProductList;
              this.unitHotMerchantData = data.topUnitMerchantList;
              this.amountHotMerchantData = data.topAmountMerchantList;
              var userCountChartData = data.userCountChart;
              var merchantCountChartData = data.merchantCountChart;
              var orderCountChartData = data.orderCountChart;
              var orderAmountChartData = data.orderAmountChart;
              this.userCountCharts = {
                key: [],
                value: []
              };
              this.merchantCountCharts = {
                key: [],
                value: []
              };
              this.orderCountCharts = {
                key: [],
                value: []
              };
              this.orderAmountCharts = {
                key: [],
                value: []
              };
              var self = this;
              //会员数量曲线
              userCountChartData.forEach(function(asas, ind) {
                self.userCountCharts.key.push(asas.valueDate);
                self.userCountCharts.value.push(asas.valueInt);
              });
              this.drawUserLine();
              //商家数量曲线
              merchantCountChartData.forEach(function(asas, ind) {
                self.merchantCountCharts.key.push(asas.valueDate);
                self.merchantCountCharts.value.push(asas.valueInt);
              });
              this.drawMerchantLine();
              //订单数量曲线
              orderCountChartData.forEach(function(asas, ind) {
                self.orderCountCharts.key.push(asas.valueDate);
                self.orderCountCharts.value.push(asas.valueInt);
              });
              this.drawOrderLine();
              //订单金额曲线
              orderAmountChartData.forEach(function(asas, ind) {
                self.orderAmountCharts.key.push(asas.valueDate);
                self.orderAmountCharts.value.push(asas.valueDecimal);
              });
              this.drawAmountLine();             
            } else {
              this.$Message.error(res.data.body.status.errorDesc);
            }
          },
          res => {
            this.$Message.error("查询商家增长曲线数据失败");
            this.spinShow = false;
          }
        );
    }
  },
  mounted() {
    this.handleSearch();
  }
};
</script>
