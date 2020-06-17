<style lang="less">
    @import "../../styles/common.less";
</style>
<template>
    <div class="home-main">
        <Spin size="large" fix v-if="spinShow" class="mask"></Spin>
        <Card class="margin-top-10">
                <p slot="title">
                     库存概览
                </p>
                <!-- <Row class="t_c">
                        <RadioGroup v-model="dateSearchType" @on-change="">
                            <Radio label="1">本周</Radio>
                            <Radio label="2">本月</Radio>
                            <Radio label="3">本季度</Radio>
                            <Radio label="4">本年</Radio>
                            <Radio label="5">最近三年</Radio>
                        </RadioGroup>
                </Row> -->
                <Row type="flex" justify="start" class="margin-top-20">
                    <Col span="6" class="t_c">
                        <Row style="margin-top:60px">
                            <Col span="24">
                                <i-circle :percent="100">
                                    <span class="demo-Circle-inner" style="font-size:20px">
                                        <span style="color: #3f414d;font-weight: normal;">{{datass.merchantInventory}}</span>
                                        <p style="color: #657180;font-size:14px;margin: 10px 0 15px;">当前库存</p>
                                    </span>
                                </i-circle>
                            </Col>
                        </Row>
                        <Row type="flex" justify="start">
                            <Col span="24" class="t_c">
                                <font size="1" color="#999">已售待提货: </font><font>{{datass.userInventory}}</font>
                            </Col>
                            <Col span="24" class="t_c">
                                <font size="1" color="#999">未售: </font><font>{{datass.deliveryInventory}}</font>
                            </Col>
                        </Row>
                    </Col>
                    <!-- <Col span="12" offset="2">
                        <div id="memberChart" :style="{width: '100%', height: '400px'}"></div>
                    </Col> -->
                </Row>
            </Card>
    </div>
</template>

<script>


export default {
    components: {

    },
    data () {
        return {
            datass:[],
            spinShow:true,
        };
    },
    methods: {
        queryinventory(){
            this.spinShow = true;
            let searchOptions = {

            }
        	this.$http.post("/admin/inquiryInventorySummary", this.common.request(searchOptions))
        	.then(res => {
        		if(res.data.body.status.statusCode==0){
                    var data=res.data.body.data;
                    this.datass = data;
                    this.spinShow = false;
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
                    data: ['08-01', '08-02', '08-03', '08-04', '08-05', '08-06', '08-07']
                },
                yAxis: {
                    name: '库存变化',
                    type: 'value'
                },
                series: [{
                    data: [4000, 6000, 9000, 3000, 8000, 1000, 10000],
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
        }
    },
    mounted(){
        this.queryinventory();
        // this.drawLine();
    },
};
</script>
