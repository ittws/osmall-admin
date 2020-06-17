<style lang="less">
    @import '../../styles/common.less';
</style>

<template>
    
    <div>
        <Form ref="merchant" :model="merchant" :label-width="120">
            <Card>
                <p slot="title">
                    <Icon type="ios-person"></Icon>
                     商户基础信息

                </p>

                <Row>
                <Col span="18">
                    <Row type="flex" justify="start">
                         <Col span="10" >
                            <FormItem label="商户名称" prop="merchantName">
                                <Input v-model='merchant.merchantName'></Input>
                            </FormItem>
                        </Col>
                        <Col span="10" offset="2">
                            <FormItem label="行业" prop="merchantIndustry">
                                <Select v-model="merchant.merchantIndustry">
                                    <Option value="餐饮"></Option>
                                    <Option value="娱乐"></Option>
                                </Select>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row type="flex" justify="start">
                         <Col span="10" >
                            <FormItem label="联系人姓名" prop="merchantContactName">
                                <Input v-model='merchant.merchantContactName'></Input>
                            </FormItem>
                        </Col>
                        <Col span="10" offset="2">
                            <FormItem label="商户地址" prop="merchantAddress">
                                <Input v-model='merchant.merchantAddress'></Input>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row type="flex" justify="start">
                         <Col span="10" >
                            <FormItem label="座机号码" prop="merchantContactLandline">
                                <Input v-model='merchant.merchantContactLandline'></Input>
                            </FormItem>
                        </Col>
                        <Col span="10" offset="2">
                            <FormItem label="手机号码" prop="merchantContactMobileNo">
                                <Input v-model='merchant.merchantContactMobileNo'></Input>
                            </FormItem>
                        </Col>
                    </Row>
                </Col>
                </Row>
            </Card>
            <Card class="margin-top-10">
                <p slot="title">
                    <Icon type="ios-person"></Icon>
                     登录及权限信息
                </p>

                <Row type="flex" justify="start">
                    <Col span="6">
                        <FormItem label="登录账户名" prop="merchantLoginId">
                            <Input v-model='merchant.merchantLoginId' placeholder='建议使用手机号码作为登录账户名'></Input>
                            <Span class="text-help">密码默认12345678</Span>
                        </FormItem>
                    </Col>
                    <Col span="6" offset="2">
                        <FormItem label="商户自行上架商品">
                            
                            <i-switch v-model="merchant.switch1" size="large">
                                <span slot="open">开启</span>
                                <span slot="close">关闭</span>
                            </i-switch>
                        
                        </FormItem>
                    </Col>
                    <Col span="6" offset="2">
                        <FormItem label="上架商品需要审核">
                            <i-switch v-model="merchant.switch2" size="large">
                                <span slot="open">开启</span>
                                <span slot="close">关闭</span>
                            </i-switch>
                        </FormItem>
                    </Col>
                </Row>
                <Row type="flex" justify="start">
                    
                </Row>

            </Card>
        </Form>
   
        <div class="margin-top-10">
            <Button type="primary" @click="addok('member')" icon="checkmark">保存</Button>
        </div>
        <Switch ></Switch>
     </div>               
</template>

<script>
import expandRow from './components/merchant-list-table-expand.vue';
import {ajaxMerchantListData} from './data/merchant-list-data.js';
export default {
    components: {
        expandRow
    },
    data () {
        return {

            merchant: {
                switch1: true,
                switch2: true
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
            this.merchant.merchantId = this.$route.params.merchantId;
        },
        change () {
            
        },
        
        addok (name) {
            this.$Notice.success({
                title: '成功',
                desc: '商户信息已保存',
                duration: 2
            });
        }
        
    },
    created () {
        this.getData();
    }
};
</script>
