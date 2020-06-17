<style lang="less">
    @import '../../styles/common.less';
</style>

<template>
    
    <div>
        <Form ref="activity" :model="activity" :label-width="100">
            <Card>
                <p slot="title">
                    <Icon type="ios-person"></Icon>
                     平台营销活动

                </p>
                <Row>
                <Col span="24">
                    <Row type="flex" justify="start">
                        <Col span="8" >
                            <FormItem label="活动类型" prop="activityType">
                                <Select clearable v-model="activity.activityType">
                                    <Option value="公告">公告</Option>
                                    <Option value="领券">领券</Option>
                                    <Option value="现场">现场</Option>
                                </Select>
                            </FormItem>
                        </Col>
                        <Col span="6" offset="2">
                            <FormItem label="活动渠道">
                                <Select clearable v-model="activity.activityChannel">
                                    <Option value="线上">线上</Option>
                                    <Option value="线下">线下</Option>
                                </Select>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row type="flex" justify="start">
                        <Col span="8">
                            <FormItem label="活动名称">
                                <Input v-model='activity.activityName' ></Input>&nbsp;
                            </FormItem>
                        </Col>
                         <Col span="14" offset="2">
                            <FormItem label="活动时间" >
                            <DatePicker type="date" placeholder="开始日期"></DatePicker>
                            &nbsp;&nbsp;到&nbsp;&nbsp;
                            <DatePicker type="date" placeholder="结束日期"></DatePicker>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row type="flex" justify="start">
                        <Col span="8">
                            <FormItem label="是否需要报名">
                                <i-switch v-model="activity.enrollmentRequired" size="large">
                                <span slot="open">需要</span>
                                <span slot="close">不需要</span>
                                </i-switch>
                            </FormItem>
                        </Col>
                        <Col span="14" offset="2" v-if="activity.activityChannel=='线下'">
                            <FormItem label="活动地址">
                                <Input v-model="activity.address"></Input>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row type="flex" justify="start" v-if="activity.activityType=='领券'">
                        <Col span="24">
                            <FormItem label="选择优惠券" >
                                <CheckboxGroup v-model="activity.coupons">
                                <Checkbox label="满300减10"></Checkbox>
                                <Checkbox label="9折折扣券"></Checkbox>
                                <Checkbox label="下单立减5元"></Checkbox>
                            </CheckboxGroup>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row type="flex" justify="start">
                        <Col span="24">
                            <FormItem label="参与商户">
                                <Tag closable color="blue">肯德基高新店</Tag>
                                <Tag closable color="green">麦当劳世纪城店</Tag>
                                <Tag closable color="red">跷脚牛肉春熙路店</Tag>
                                <Button type="ghost" @click="selectMerchant">选择</Button>
                            </FormItem>
                        </Col>
                    </Row>
                    
                </Col>
                
                </Row>
            </Card>
        </Form>
   
        <div class="margin-top-10">
            <Button type="primary" @click="addok('member')" icon="checkmark">保存</Button>
        </div>    
        <selectMerchant v-if="selectMerchantModel"/>
     </div>      

</template>

<script>
import selectMerchant from '../common-components/select-merchant.vue';
export default {
    components: {
        selectMerchant
    },
    data () {
        return {
            selectMerchantModel: false,
            selectProductTypeModel: false,
            selectProductModel: false,
            activity: {
                activyType:'公告',
                enrollmentRequired:true
            },
            loading: true,
            memberColumn: [],
            memberData: [],
            searchMemberId:'',
            searchMemberName:'',
            searchMemberMobileNo:'',
            memberLevels:[{
                label:'联盟至尊卡会员', value: '联盟至尊卡会员',minAmount:5000,maxAmount:9999999
            },
            {
                label:'联盟金卡会员', value: '联盟金卡会员',minAmount:1000,maxAmount:5000
            },
            {
                label:'联盟银卡会员', value: '联盟银卡会员',minAmount:0,maxAmount:1000
            }],
            memberReferrals:[{
                label:'刘阳', value: '刘阳'
            },{
                label:'乔建辉', value: '乔建辉'
            }],
            addresses: [{
                    value: 'beijing',
                    label: '北京',
                    children: [
                        {
                            value: 'gugong',
                            label: '故宫'
                        },
                        {
                            value: 'tiantan',
                            label: '天坛'
                        },
                        {
                            value: 'wangfujing',
                            label: '王府井'
                        }
                    ]
                }, {
                    value: 'jiangsu',
                    label: '江苏',
                    children: [
                        {
                            value: 'nanjing',
                            label: '南京',
                            children: [
                                {
                                    value: 'fuzimiao',
                                    label: '夫子庙',
                                }
                            ]
                        },
                        {
                            value: 'suzhou',
                            label: '苏州',
                            children: [
                                {
                                    value: 'zhuozhengyuan',
                                    label: '拙政园',
                                },
                                {
                                    value: 'shizilin',
                                    label: '狮子林',
                                }
                            ]
                        }
                    ],
                }]
        }
    },
    methods: {
        getData () {
            this.activity.activityName = this.$route.params.activityName;
        },
        
        addok (name) {
            this.$Notice.success({
                title: '成功',
                desc: '营销活动已保存',
                duration: 2
            });
        },

        selectMerchant() {
            this.selectMerchantModel = true;
            this.selectProductTypeModel = false;
            this.selectProductModel = false;
        },

        selectProductType() {
            this.selectProductTypeModel = true;
            this.selectMerchantModel = false;
            this.selectProductModel = false;
        },

        selectProduct() {
            this.selectProductTypeModel = false;
            this.selectMerchantModel = false;
            this.selectProductModel = true;
        }
        
    },
    created () {
        this.getData();
    }
};
</script>
