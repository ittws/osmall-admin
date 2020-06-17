<style lang="less">
    @import '../../styles/common.less';
</style>

<template>
    
    <div>
        <Spin size="large" fix v-if="spinShow" class="mask"></Spin>
        <Form  :label-width="90">
            <Card>
                <p slot="title">
                     驿站基础信息
                </p>
                <Row type="flex" justify="start">
                    <Col span="8">
                        <FormItem label="驿站编号:" >{{merchantDTO.id}}</FormItem>
                    </Col>
                    <Col span="8">
                        <FormItem label="开站日期:" >
                            {{merchantDTO.effectiveDate}}
                        </FormItem>
                    </Col>

                </Row>
                <Row type="flex" justify="start">
                    <Col span="8" >
                        <FormItem label="联系人:">
                            {{merchantDTO.contactName}}
                        </FormItem>
                    </Col>
                     <Col span="8">
                        <FormItem label="联系人电话:">
                            {{merchantDTO.mobileNo}}
                        </FormItem>
                    </Col>
                    <Col span="8">
                        <FormItem label="联系地址:" >
                            {{merchantDTO.merchantAddress}}
                        </FormItem>
                    </Col> 
                    
                </Row>
            </Card>
            <Card class="margin-top-10">
                <p slot="title">
                     业绩概览
                </p>
                <Row>
                    <RadioGroup v-model="dateSearchType" @on-change="achievementDateRange=null">
                    <Radio label="1">今日</Radio>
                    <Radio label="2">昨日</Radio>
                    <Radio label="3">最近七日</Radio>
                    <Radio label="4" disabled>自定义时间段</Radio>
                        <DatePicker v-model="achievementDateRange" @click.native="dateSearchType='4'" type="daterange" placement="bottom-end" placeholder="查询日期" style="width: 200px"></DatePicker>
                        <Button  type="success" @click="handleSearch()">查询</Button>
                    </RadioGroup>
                </Row>
                <Row type="flex" justify="start" class="margin-top-20">
                    <Col span="4" class="t_c">
                    <i-circle :percent="100">
                        <span class="demo-Circle-inner" style="font-size:20px">
                            <span style="color: #3f414d;font-weight: normal;">{{achievement.totalUserCount}}</span>
                            <p style="color: #657180;font-size:14px;margin: 10px 0 15px;">会员新增</p>
                        </span>
                    </i-circle>
                    </Col>
                    <Col span="4" class="t_c">
                    <i-circle :percent="100" stroke-color="orange">
                        <span class="demo-Circle-inner" style="font-size:20px">
                            <span style="color: #3f414d;font-weight: normal;">{{achievement.totalProductUnit}}</span>
                            <p style="color: #657180;font-size:14px;margin: 10px 0 15px;">销售产品数</p>
                        </span>
                    </i-circle>
                    </Col>
                    <Col span="4" class="t_c">
                    <i-circle :percent="100" stroke-color="#5cb85c">
                        <span class="demo-Circle-inner" style="font-size:20px">
                            <span style="color: #3f414d;font-weight: normal;">{{achievement.totalProductAmount}}</span>
                            <p style="color: #657180;font-size:14px;margin: 10px 0 15px;">销售总收入</p>
                        </span>
                    </i-circle>
                    </Col>
                    <Col span="4" class="t_c">
                    <i-circle :percent="100"  stroke-color="#ff5500">
                        <span class="demo-Circle-inner" style="font-size:20px">
                            <span style="color: #3f414d;font-weight: normal;">{{achievement.totalAwardAmount}}</span>
                            <p style="color: #657180;font-size:14px;margin: 10px 0 15px;">奖金总支出</p>
                        </span>
                    </i-circle>
                    </Col>
                </Row>
                <Row type="flex" justify="start">
                    <Col span="4" class="t_c">
                    <font size="1" color="#999">高级合伙人: </font><font>{{achievement.totalUserCountL3}}</font>
                    <p><font size="1" color="#999">事业合伙人: </font><font>{{achievement.totalUserCountL2}}</font></p>
                    <p><font size="1" color="#999">普通会员: </font><font>{{achievement.totalUserCountL1}}</font></p>
                    </Col>
                    <Col span="4" class="t_c">
                    <font size="1" color="#999">购买会员: </font><font>{{achievement.totalProductUnitBaoDan}}</font>
                    <p><font size="1" color="#999">复购: </font><font>{{achievement.totalProductUnitFuGou}}</font></p>
                    </Col>
                    <Col span="4" class="t_c" >
                    <font size="1" color="#999">报单: </font><font>{{achievement.totalProductAmountBaoDan}}</font>
                    <p><font size="1" color="#999">复购: </font><font>{{achievement.totalProductAmountFuGou}}</font></p>
                    </Col>
                    <Col span="4" class="t_c" >
                    <font size="1" color="#999">推广收益: </font><font>{{achievement.totalAwardAmountRecruit}}</font>
                    <p><font size="1" color="#999">价差收益: </font><font>{{achievement.totalAwardAmountSale}}</font></p>
                    <p><font size="1" color="#999">驿站提成: </font><font>{{achievement.totalAwardAmountMerchant}}</font></p>
                    </Col>
                </Row>
            </Card>
        </Form> 
     </div>    
                
</template>

<script>
export default {
    data () {
        return {
            loadingdc:false,
            cityList:[
                {
                    value: '普通会员',
                    label: '1'
                },
                {
                    value: '事业合伙人',
                    label: '2'
                },
                {
                    value: '高级合伙人',
                    label: '3'
                }
            ],
            achievement:{},
            merchantDTO:[],
            spinShow:true,
            achievementDateRange:[],
            dateSearchType:"3",
            startDate: null,
            endDate: null
        }
    },
    methods: {
        
        getData () {
            this.handleSearch();
        },
        handleSearch(){
            let options = {
                merchantUuid: this.merchantUuid
            };
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
                    let t = this.achievementDateRange;
                    let startDateT = t[0];
                    let endDateT = t[1];
                    startDate = startDateT;
                    endDate = endDateT;
                }
                options.startDate = startDate;
                options.endDate = endDate;
            }
            this.spinShow = true;
        	this.$http.post("/admin/inquiryMerchantAchievement", this.common.request(options))
        	.then(res => {
        		if(res.data.body.status.statusCode==0){
                    this.spinShow = false;
                    var data=res.data.body.data;
                    this.achievement = data;
                    this.merchantDTO = data.merchantDTO;
                }else{
                    this.$Message.error(res.data.body.status.errorDesc);
                    this.spinShow = false;
                }
                },res => {
                    this.spinShow = false;
                    this.$Message.error('查询业绩失败');
                })
        }
    },
     created () {
        this.merchantUuid =this.$route.query.merchantUuid;
        this.getData();
    }
};
</script>
