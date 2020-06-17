<style lang="less">
    @import '../../styles/common.less';
</style>

<template>
    <div>
        <Row class="margin-top-10">
            <Col span="24">
                <Card>
                    <p slot="title">
                        <Icon type="ios-person"></Icon>
                         订单详情

                    </p>
                    <Row  type="flex" align="middle">
                        <Col span="3">
                            <Tag color="green">交易成功</Tag>
                        </Col>
                    </Row>
                    <Row class="margin-top-10">
                        <Col span="16">
                            <Row class="margin-top-10">
                                <Col span="3">
                                    <span class="text-lable">订单编号: </span>
                                </Col>
                                <Col span="9">
                                    <span class="text-valueable">20180310123456</span>
                                </Col>
                                <Col span="3">
                                    <span class="text-lable">下单时间: </span>
                                </Col>
                                <Col span="9">
                                    <span class="text-valueable">2018-03-10 12:12:00</span>
                                </Col>
                            </Row>
                            
                            <Row class="margin-top-10">
                                <Col span="3">
                                    <span class="text-lable">订单来源: </span>
                                </Col>
                                <Col span="9">
                                    <span class="text-valueable">微商城</span>
                                </Col>
                                <Col span="3">
                                    <span class="text-lable">付款时间: </span>
                                </Col>
                                <Col span="9">
                                    <span class="text-valueable">2018-03-10 12:13:00</span>
                                </Col>
                            </Row>
                            <Row class="margin-top-10">
                                <Col span="3" offset="12">
                                    <span class="text-lable">付款方式: </span>
                                </Col>
                                <Col span="9">
                                    <span class="text-valueable">微信支付</span>
                                </Col>
                            </Row>
                            <Row class="margin-top-10">
                                <Col span="3" >
                                    <span class="text-lable">&nbsp;</span>
                                </Col>
                                <Col span="2">
                                    <span class="text-value">敬兴悦</span>
                                </Col>
                                <Col span="4">
                                    <span class="text-value">13908172896</span>
                                </Col>
                            </Row>
                            <Row class="margin-top-10">
                                <Col span="3" >
                                    <span class="text-lable">&nbsp;</span>
                                </Col>
                                <Col span="10">
                                    <span class="text-lable">  四川省成都市锦江区芙蓉西路468号8栋3105</span>
                                </Col>
                            </Row>
                        </Col>
                        <Col span="8">
                            <Row class="margin-top-10">
                                <Col span="20">
                                    <Span class="text-lable">订单金额</Span>
                                </Col>
                                <Col span="4">
                                    <Span class="text-lable">￥508.00</Span>
                                </Col>
                            </Row>
                            <Row class="margin-top-10">
                                <Col span="20">
                                    <Span class="text-lable">运费</Span>
                                </Col>
                                <Col span="4">
                                    <Span class="text-lable">￥6.00</Span>
                                </Col>
                            </Row>
                            <Row class="margin-top-10">
                                <Col span="20">
                                    <Span class="text-lable">优惠券折扣</Span>
                                </Col>
                                <Col span="4">
                                    <Span class="text-lable">-￥25.00</Span>
                                </Col>
                            </Row>
                            <Row class="margin-top-10">
                                <Col span="20">
                                    <Span class="text-lable">实付款</Span>
                                </Col>
                                <Col span="4">
                                    <Span style="font-size:14px;color:red">￥489.00</Span>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Card>

                <Card class="margin-top-10">
                    <p slot="title">
                        <Icon type="ios-person"></Icon>
                         商品

                    </p>
                    <Row class="margin-top-10" type="flex" align="middle">
                        <Col span="6">
                            <Row  type="flex" justify="center">
                                <Col span="24">
                                    <a href="#/productdetail/1637873"><img src="https://i.loli.net/2017/08/21/599a521472424.jpg" style="width:100%"/></a>
                                </Col>
                            </Row>
                            <Row>
                                <Col span="24">
                                麦当劳经典鸡腿堡
                                </Col>
                            </Row>
                            <Row>
                                <Col span="22">
                                    <span style="color:red">￥319</span>
                                </Col>
                                <Col span="2">
                                    <span class="text-lable f_r" >x 1</span>
                                </Col>
                            </Row>
                        </Col>
                        
                    </Row>
                    
                    
                </Card>
                <Card class="margin-top-10">
                    <p slot="title">
                        <Icon type="ios-person"></Icon>
                         物流

                    </p>
                    <Row class="margin-top-10" type="flex" align="left">
                        <Col span="24">
                            <Timeline>
                                <TimelineItem>
                                    <p class="time">2018年3月9日 12:00</p>
                                    <p class="content">快递员已取货</p>
                                </TimelineItem>
                                <TimelineItem>
                                    <p class="time">2018年3月9日 14:00</p>
                                    <p class="content">到达宁波港, 等待发往成都</p>
                                </TimelineItem>
                                <TimelineItem>
                                    <p class="time">2018年3月10日 14:00</p>
                                    <p class="content">到达成都, 正在分拣</p>
                                </TimelineItem>
                                <TimelineItem>
                                    <p class="time">2018年3月10日 16:00</p>
                                    <p class="content">快递员正在送货</p>
                                </TimelineItem>
                                <TimelineItem color="green">
                                    <p class="time">2018年3月10日 19:00</p>
                                    <p class="content">敬兴悦已签收</p>
                                </TimelineItem>
                            </Timeline>
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
            
        }
    },
    methods: {
        getData () {

        }
    },
    created () {
        
    }
};
</script>
