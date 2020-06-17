<style lang="less">
    @import "../../styles/common.less";
</style>
<template>
    <div class="home-main">
        <Spin size="large" fix v-if="spinShow" class="mask"></Spin>
        <Card class="margin-top-10">
                <p slot="title">
                     数据概览
                </p>
                <Row>
                    <RadioGroup v-model="dateSearchType" @on-change="changeSearchDate">
                        <Radio label="0">累计</Radio>
                        <Radio label="1">今日</Radio>
                        <Radio label="2">昨日</Radio>
                        <Radio label="3">最近七日</Radio>
                        <Radio label="4" disabled>自定义时间段</Radio>
                            <DatePicker v-model="customsj" @click.native="customizeDate" type="daterange" placement="bottom-end" placeholder="查询日期" style="width: 200px"></DatePicker>
                        <Button  type="success" @click="handleSearch()">查询</Button>
                    </RadioGroup>
                </Row>
                <Row type="flex" justify="start" class="margin-top-20">
                    <Col span="6" class="t_c">
                        <Row style="margin-top:60px">
                            <Col span="24">
                                <i-circle :percent="100">
                                    <span class="demo-Circle-inner" style="font-size:20px">
                                        <span style="color: #3f414d;font-weight: normal;">{{datass.userCount}}</span>
                                        <p style="color: #657180;font-size:14px;margin: 10px 0 15px;">会员总数</p>
                                    </span>
                                </i-circle>
                            </Col>
                        </Row>
                    </Col>
                    <Col span="12" offset="2">
                        <div id="memberChart" :style="{width: '100%', height: '400px'}"></div>
                    </Col>
                </Row>
                
            </Card>
    </div>
</template>

<script>


export default {
    data () {
        return {
            customsj:[],
            dateSearchType:'3',
            datass:[],
            spinShow:true,
        };
    },
    methods: {
        changeSearchDate(){
            this.customsj = null;
        },
        customizeDate(){
            this.dateSearchType = '4'
        },
        drawLine(){
            // 基于准备好的dom，初始化echarts实例
            let myChart = this.$echarts.init(document.getElementById('memberChart'),'light')

            let option1 = {
                xAxis: {
                    name:'日期',
                    type: 'category',
                    data: this.userCountCharts.key
                },
                yAxis: {
                    name: '会员新增',
                    type: 'value'
                },
                series: [{
                    data: this.userCountCharts.value,
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
                if(dateType == '0') {
                    let tDate = new Date();
                    tDate.setFullYear(currentDate.getFullYear() - 10);
                    startDate =tDate;
                    endDate = currentDate;
                }else if(dateType == '1') {
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
        	this.$http.post("/admin/inquiryUserSummary", this.common.request(searchOptions))
        	.then(res => {
        		if(res.data.body.status.statusCode==0){
                    var data=res.data.body.data;
                    this.datass = data;
                    this.userCountCharts = {
                        key:[],
                        value:[]
                    }
                    var self=this;
                    data.userCountChart.forEach(function(asas,ind){
                        self.userCountCharts.key.push(asas.valueDate);
                        self.userCountCharts.value.push(asas.valueInt);
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
    mounted(){
        this.handleSearch();
    },
};
</script>
