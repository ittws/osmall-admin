<style lang="less">
    @import '../../styles/common.less';
</style>

<template>
    <div>
        <Spin size="large" fix v-if="spinShow" class="mask"></Spin>
        <Row class="margin-top-10">
            <Col span="24">
                <Card class="margin-top-10">
                    <p slot="title">
                        资金概览
                    </p>
                    <Row>
                        <RadioGroup v-model="dateSearchType" @on-change="xuanze1">
                        <Radio label="1">今日</Radio>
                        <Radio label="2">本月</Radio>
                        <Radio label="3">累计</Radio>
                        <Radio label="4" disabled>自定义时间段</Radio>
                            <DatePicker v-model="customsj" @click.native="xuanze" type="daterange" placement="bottom-end" placeholder="查询日期" style="width: 200px"></DatePicker>
                            <Button  type="success" @click="handleSearch()">查询</Button>
                        </RadioGroup>
                    </Row>
                    <Row type="flex" justify="start" class="margin-top-20">
                        <Col span="4" class="t_c">
                        <i-circle :percent="100" stroke-color="#5cb85c">
                            <span class="demo-Circle-inner" style="font-size:20px">
                                <span style="color: #3f414d;font-weight: normal;">{{datass. productAmount}}</span>
                                <p style="color: #657180;font-size:14px;margin: 10px 0 15px;">总销售收入</p>
                            </span>
                        </i-circle>
                        </Col>
                        <Col span="4" class="t_c">
                        <i-circle :percent="100"  stroke-color="#ff5500">
                            <span class="demo-Circle-inner" style="font-size:20px">
                                <span style="color: #3f414d;font-weight: normal;">{{datass.awardAmount}}</span>
                                <p style="color: #657180;font-size:14px;margin: 10px 0 15px;">总奖金支出</p>
                            </span>
                        </i-circle>
                        </Col>
                        <Col span="4" class="t_c">
                        <i-circle :percent="100"  stroke-color="#2D8CF0">
                            <span class="demo-Circle-inner" style="font-size:20px">
                                <span style="color: #3f414d;font-weight: normal;">{{datass.availableBalance}}</span>
                                <p style="color: #657180;font-size:14px;margin: 10px 0 15px;">可提现总余额</p>
                            </span>
                        </i-circle>
                        </Col>
                        <!--
                        <Col span="4" class="t_c">
                        <i-circle :percent="100"  stroke-color="#ff5500">
                            <span class="demo-Circle-inner" style="font-size:20px">
                                <span style="color: #3f414d;font-weight: normal;">{{datass.performanceAmount}}</span>
                                <p style="color: #657180;font-size:14px;margin: 10px 0 15px;">团队业绩销售额</p>
                            </span>
                        </i-circle>
                        </Col>
                        <Col span="4" class="t_c">
                        <i-circle :percent="100"  stroke-color="#ff5500">
                            <span class="demo-Circle-inner" style="font-size:20px">
                                <span style="color: #3f414d;font-weight: normal;">{{datass.performanceAward}}</span>
                                <p style="color: #657180;font-size:14px;margin: 10px 0 15px;">团队业绩奖金</p>
                            </span>
                        </i-circle>
                        </Col>
                        -->
                     </Row>
                     <Row type="flex" justify="start">

                        <Col span="4" class="t_c" >
                        <font size="1" color="#999">报单: </font><font>{{datass.productAmountBaoDan}}</font>
                        <p><font size="1" color="#999">复购: </font><font>{{datass.productAmountFuGou}}</font></p>
                        </Col>
                        <Col span="4" class="t_c" >
                        <font size="1" color="#999">推广奖金: </font><font>{{datass.awardAmountRecruit}}</font>
                        <p><font size="1" color="#999">价差奖金: </font><font>{{datass.awardAmountSale}}</font></p>
                        <p><font size="1" color="#999">驿站奖金: </font><font>{{datass.awardAmountMerchant}}</font></p>
                        <p><font size="1" color="#999">训练师奖金: </font><font>{{datass.awardAmountTrain}}</font></p>
                        <p><font size="1" color="#999">合伙人奖金: </font><font>{{datass.awardAmountPartner}}</font></p>
                        <p><font size="1" color="#999">业绩奖金: </font><font>{{datass.awardAmountPerformance}}</font></p>
                        </Col>
                        <Col span="4" class="t_c" >
                        <font size="1" color="#999">当前所有会员可提现总余额</font>
                        <p><font size="1" color="#999">与查询日期无关</font></p>
                        </Col>
                    </Row>
                    <Row>
                <Col span="12">
                    <div id="memberChart" :style="{width: '100%', height: '400px'}"></div>
                </Col>
                <Col span="12">
                    <div id="merchantChart" :style="{width: '100%', height: '400px'}"></div>
                </Col>
            </Row>
                </Card>
            </Col>
        </Row>
    </div>
</template>

<script>
export default {
    data () {
        return {
            spinShow:true,
            dateSearchType:'3',
            customsj:[],
            datass:[],
        }
    },
    methods: {
        xuanze1(){
            this.customsj = null;
        },
        xuanze(){
            this.dateSearchType = '4'
        },
        handleSearch(){
            this.spinShow = true;
            let searchOptions = {};
            //选择日期
            if (this.dateSearchType) {
                let dateType = this.dateSearchType;
                let startDate = null;
                let endDate = null;
                let currentDate = new Date();
                if(dateType == '1') {
                    startDate =currentDate;
                    endDate = currentDate;
                } else if(dateType == '2') {
                    currentDate.setDate(1);
                    startDate =currentDate;
                    endDate = new Date();
                } else if(dateType == '3') {
                    let tDate = new Date();
                    tDate.setFullYear(currentDate.getFullYear() - 100);
                    startDate =tDate;
                    endDate = currentDate;
                } else if(dateType == '4') {
                    let t = this.customsj;
                    let startDateT = t[0];
                    let endDateT = t[1];
                    startDate = startDateT;
                    endDate = endDateT;
                }
                searchOptions.orderDateStart = startDate;
                searchOptions.orderDateEnd = endDate;
            }
        	this.$http.post("/admin/inquiryFundSummary", this.common.request(searchOptions))
        	.then(res => {
        		if(res.data.body.status.statusCode==0){
                    var data=res.data.body.data;
                    this.datass = data;
                    this.orderAmountCharts = {
                        key:[],
                        value:[]
                    }
                     this.awardAmountCharts = {
                        key:[],
                        value:[]
                    }
                    var self=this;
                    data.awardAmountChart.forEach(function(asas,ind){
                        self.orderAmountCharts.key.push(asas.valueDate);
                        self.orderAmountCharts.value.push(asas.valueDecimal);
                    })
                    data.orderAmountChart.forEach(function(asas,ind){
                        self.awardAmountCharts.key.push(asas.valueDate);
                        self.awardAmountCharts.value.push(asas.valueDecimal);
                    })
                    this.spinShow = false;
                    this.drawLine();
                        }else{
                            this.$Message.error(res.data.body.status.errorDesc);
                            this.spinShow = false;
                        }
                    },res => {
                        this.$Message.error('查询失败');
                        this.spinShow = false;
                    })
        },
        drawLine(){
            // 基于准备好的dom，初始化echarts实例
            let myChart = this.$echarts.init(document.getElementById('memberChart'),'light')
            let option1 = {
                xAxis: {
                    name:'日期',
                    type: 'category',
                    data: this.awardAmountCharts.key,
                },
                yAxis: {
                    name: '销售收入',
                    type: 'value'
                },
                series: [{
                    data: this.awardAmountCharts.value,
                    type: 'line',
                    smooth: true,
                    label: {
                        normal: {
                            show: true,
                            textStyle:{  
                                color:'rgb(255, 213, 114)'  
                            }
                        }
                   },
                   itemStyle : {  
                        normal : {  
                            lineStyle:{  
                                color:'rgb(255, 213, 114)'  
                            }  
                        }  
                    }
                }]
            };

            // 绘制图表
            myChart.setOption(option1);

            // 基于准备好的dom，初始化echarts实例
            let merchantChart = this.$echarts.init(document.getElementById('merchantChart'),'light')
            let optio2 = {
                xAxis: {
                    name:'日期',
                    type: 'category',
                    data: this.orderAmountCharts.key,
                },
                yAxis: {
                    name: '奖金支出',
                    type: 'value'
                },
                series: [{
                    data: this.orderAmountCharts.value,
                    type: 'line',
                    smooth: true,
                    label: {
                        normal: {
                            show: true,
                            textStyle:{  
                                color:'rgb(100, 213, 114)'  
                            }
                        }
                   },
                   itemStyle : {  
                        normal : {  
                            lineStyle:{  
                                color:'rgb(100, 213, 114)'  
                            }  
                        }  
                    }
                }]
            };

            // 绘制图表
            merchantChart.setOption(optio2);
        }
    },
    mounted () {
        this.handleSearch();
    }
};
</script>
