<style lang="less">
    @import '../../styles/common.less';
</style>

<template>
    
    <div>
        <Form ref="member" :model="member" :label-width="80">
            <Card>
                <p slot="title">
                    <Icon type="ios-person"></Icon>
                     基础信息

                </p>

                <Row>
                <Col span="18">
                    <Row type="flex" justify="start">
                         <Col span="10" >
                            <FormItem label="姓名" prop="memberName">
                                <Input v-model='member.memberName'></Input>
                            </FormItem>
                        </Col>
                        <Col span="10" offset="2">
                            <FormItem label="手机号码" prop="memberMobileNo">
                                <Input v-model='member.memberMobileNo'></Input>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row type="flex" justify="start">
                         <Col span="10" >
                            <FormItem label="身份证号" prop="memberIdNo">
                                <Input v-model='member.memberIdNo'></Input>
                            </FormItem>
                        </Col>
                        <Col span="10" offset="2">
                            <FormItem label="生日" prop="memberBirthday">
                                <Input v-model='member.memberBirthday'></Input>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row type="flex" justify="start">
                         <Col span="10" >
                            <FormItem label="性别" prop="memberSex">
                                <Input v-model='member.memberSex'></Input>
                            </FormItem>
                        </Col>
                        <Col span="10" offset="2">
                            <FormItem label="地址">
                                <Cascader :data="addresses" trigger="hover"></Cascader>
                            </FormItem>
                        </Col>
                    </Row>
                </Col>
                <Col span="6">
                    <Row type="flex" justify="center"  class="t_c">
                        <Col span="24">
                            <Avatar icon="person" size="large" />
                        </Col>
                    </Row>
                    <Row type="flex" justify="center"  class="t_c margin-top-10">
                        <Col span="24">
                            <Upload action="">
                                <Button type="ghost" icon="ios-cloud-upload-outline">上传头像</Button>
                            </Upload>
                        </Col>
                    </Row>
                </Col>
                </Row>
            </Card>
            <Card class="margin-top-10">
                <p slot="title">
                    <Icon type="ios-person"></Icon>
                     会员信息
                </p>
                <Row>
                <Col span="24">
                    <Row type="flex" justify="start">
                         <Col span="8" >
                            <FormItem label="会员等级" prop="memberLevel">
                                <Select clearable v-model="member.memberLevel">
                                    <Option v-for="item in memberLevels" :value="item.value" :key="item.value">{{ item.label}}</Option>
                                </Select>
                                <span v-if="member.memberLevel === '联盟至尊卡会员'">售卡金额5000元, 初始金额3000元</span>
                                <span v-if="member.memberLevel === '联盟金卡会员'">售卡金额1000元, 初始金额900元</span>
                                <span v-if="member.memberLevel === '联盟银卡会员'">售卡金额500元, 初始金额400元</span>
                            </FormItem>
                        </Col>
                        <Col span="8" offset="2">
                            <FormItem label="会员卡号" prop="memberCardNo">
                                <Input v-model='member.memberCardNo'></Input>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row type="flex" justify="start">
                         <Col span="10" >
                            <FormItem label="有效期" prop="memberDuration">
                                <RadioGroup v-model="member.memberDuration">
                                    <Radio label="永久有效"></Radio>
                                    <Radio label="有效期至">
                                        <DatePicker type="date" style="width: 200px">
                                        </DatePicker>
                                    </Radio>
                                </RadioGroup>
                            </FormItem>
                        </Col>
                        <Col span="8">
                            <FormItem label="推荐人" prop="memberBirthday">
                                <Select clearable v-model="member.MemberReferral.memberName">
                                    <Option v-for="item in memberReferrals" :value="item.value" :key="item.value">{{ item.label}}</Option>
                                </Select>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row type="flex" justify="start">
                         <Col span="24" >
                            <FormItem label="发送通知到" style="width: 400px">
                                <CheckboxGroup v-model="member.notificationTarget">
                                    <Checkbox label="会员">
                                        <span>会员</span>
                                    </Checkbox>
                                    <Checkbox label="推荐人">
                                        <span>推荐人</span>
                                    </Checkbox>
                                </CheckboxGroup>
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
     </div>               
</template>

<script>
import expandRow from './components/member-list-table-expand.vue';
import {ajaxMemberListData} from './data/member-list-data.js';
export default {
    components: {
        expandRow
    },
    data () {
        return {
            member: {
                MemberReferral:{}
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
            this.member.memberCardNo = this.$route.params.memberCardNo;
        },
        
        addok (name) {
            this.$Notice.success({
                title: '成功',
                desc: '会员信息已保存',
                duration: 2
            });
        }
        
    },
    created () {
        this.getData();
    }
};
</script>
