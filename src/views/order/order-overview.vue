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
                        销售概览
                    </p>
                    <Row>
                        <RadioGroup v-model="dateSearchType" @on-change="xuanze1">
                        <Radio label="1">今日</Radio>
                        <Radio label="2">昨日</Radio>
                        <Radio label="3">最近七日</Radio>
                        <Radio label="4" disabled>自定义时间段</Radio>
                            <DatePicker v-model="customsj" @click.native="xuanze" type="daterange" placement="bottom-end" placeholder="查询日期" style="width: 200px"></DatePicker>
                            <Button  type="success" @click="handleSearch()">查询</Button>
                        </RadioGroup>
                    </Row>
                    <Row type="flex" justify="start" class="margin-top-20">
                        <Col span="12" class="t_c">
                        <i-circle :percent="100" stroke-color="#5cb85c">
                            <span class="demo-Circle-inner" style="font-size:20px">
                                <span style="color: #3f414d;font-weight: normal;">{{datass.orderRecord}}</span>
                                <p style="color: #657180;font-size:14px;margin: 10px 0 15px;">订单总数</p>
                            </span>
                        </i-circle>
						<div style="width:100%;margin: auto;">
							<div style="float: left;width: 50%;text-align: right;">
								<p style="color: #657180;font-size:14px;">已完成:</p>
								<p style="color: #657180;font-size:14px;">已发货:</p>
								<p style="color: #657180;font-size:14px;">未发货:</p>
								<p style="color: #657180;font-size:14px;">已取消:</p>
							</div>
							<div style="text-align: left;color: #000000;width: 48%;float: left;margin-left: 2%;">
								<p style="color: #657180;font-size:14px;">{{datass.orderRecordCompleted}}</p>
								<p style="color: #657180;font-size:14px;">{{datass.orderRecordDelivered}}</p>
								<p style="color: #657180;font-size:14px;">{{datass.orderRecordNotDelivered}}</p>
								<p style="color: #657180;font-size:14px;">{{datass.orderRecordCancelled}}</p>
							</div>
						</div>
								
                        </Col>
                        <Col span="12" class="t_c">
                        <i-circle :percent="100" stroke-color="#5cb85c">
                            <span class="demo-Circle-inner" style="font-size:20px">
                                <span style="color: #3f414d;font-weight: normal;">{{datass.orderPoint}}</span>
                                <p style="color: #657180;font-size:14px;margin: 10px 0 15px;">订单购币</p>
                            </span>
                        </i-circle>
						<div style="width: 100%;margin: auto;">
							<div style="float: left;width: 50%;text-align: right;">
								<p style="color: #657180;font-size:14px;">已完成的购币数据:</p>
								<p style="color: #657180;font-size:14px;">已发货的购币数据:</p>
								<p style="color: #657180;font-size:14px;">未发货的购币数据:</p>
								<p style="color: #657180;font-size:14px;">已取消的购币数据:</p>
							</div>
							<div style="text-align: left;color: #000000;width: 48%;float: left;margin-left: 2%;">
								<p style="color: #657180;font-size:14px;">{{datass.orderPointCompleted}}</p>
								<p style="color: #657180;font-size:14px;">{{datass.orderPointDelivered}}</p>
								<p style="color: #657180;font-size:14px;">{{datass.orderPointNotDelivered}}</p>
								<p style="color: #657180;font-size:14px;">{{datass.orderPointCancelled}}</p>
							</div>
						</div>
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
    components: {
        
    },
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
        drawLine(){
            // 基于准备好的dom，初始化echarts实例
            let myChart = this.$echarts.init(document.getElementById('memberChart'),'light')
            let option1 = {
                xAxis: {
                    name:'日期',
                    type: 'category',
                    data: this.orderRecordChart.key
                },
                yAxis: {
                    name: '订单数量',
                    type: 'value'
                },
                series: [{
                    data: this.orderRecordChart.value,
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
                    data: this.orderPointChart.key
                },
                yAxis: {
                    name: '订单购币',
                    type: 'value'
                },
                series: [{
                    data: this.orderPointChart.value,
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
                    currentDate.setDate(currentDate.getDate() - 1);
                    startDate =currentDate;
                    endDate = currentDate;
                } else if(dateType == '3') {
                    let tDate = new Date();
                    tDate.setDate(currentDate.getDate() - 7);
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
        	this.$http.post("/admin/inquiryOrderSummary", this.common.request(searchOptions))
        	.then(res => {
        		if(res.data.body.status.statusCode==0){
                    var data=res.data.body.data;
                    this.datass = data;
                    this.orderRecordChart = {
                        key:[],
                        value:[]
                    }
                    this.orderPointChart = {
                        key:[],
                        value:[]
                    }
                    var self=this;
                    data.orderRecordChart.forEach(function(asas,ind){
                        self.orderRecordChart.key.push(asas.valueDate);
                        self.orderRecordChart.value.push(asas.valueInt);
                    })
                    //数量
                    data.orderPointChart.forEach(function(asas,ind){
                        self.orderPointChart.key.push(asas.valueDate);
                        self.orderPointChart.value.push(asas.valueInt);
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
        }
    },
    mounted () {
        this.handleSearch();
    }
};
</script>
