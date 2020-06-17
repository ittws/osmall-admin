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
                         商户列表
                    </p>
                    <Row>
                        <Button icon="plus" type="primary" @click="add()">商户入驻</Button>
                        <div class="f_r">
                            <Input v-model="searchMerchantName" @on-change="handleSearch" icon="search" placeholder="商户名称搜索" style="width: 120px" />
                            <Input v-model="searchContactName" @on-change="handleSearch" icon="search" placeholder="联系人姓名搜索" style="width: 120px" />
                            <Input v-model="searchLandline" @on-change="handleSearch" icon="search" placeholder="座机号码搜索" style="width: 120px" />
                            <Input v-model="searchMobileNo" @on-change="handleSearch" icon="search" placeholder="手机号码搜索" style="width: 120px" />
                        </div>
                    </Row>
                    
                    <Row class="margin-top-10">
                        <Col span="24">
                            <div>
                                <Table :columns="merchantColumn" :data="merchantData" border stripe ref="merchantTable"></Table>
                                
                            </div>
                        </Col>
                    </Row>
                    <Row class="margin-top-10">
                        <Page ref="merchantpage" :total="total" size="small" :pageSize="pageSize" @on-change="changepage" show-total show-elevator></Page>
                    </Row>
                    <Modal
                        v-model="multipleCouponModel"
                        ref="multipleCouponModel"
                        width="800"
                        title="批量发券">
                        <Form ref="multipleCouponRow" :model="multipleCouponRow" :label-width="80" >
                            <Card>
                                
                                    <p slot="title">
                                         发放条件
                                    </p>
                                <Row>
                                <Col span="8">
                                    <FormItem label="会员等级" >
                                        <Select clearable v-model="multipleCouponRow.searchMemberLevel">
                                            <Option value="联盟至尊卡会员">联盟至尊卡会员</Option>
                                            <Option value="联盟金卡会员">联盟金卡会员</Option>
                                            <Option value="联盟银卡会员">联盟银卡会员</Option>
                                        </Select>
                                    </FormItem>
                                </Col>
                                <Col span="8">
                                    <FormItem label="会员状态" >
                                        <Select clearable v-model="multipleCouponRow.searchMemberStatus">
                                            <Option value="正常">正常</Option>
                                            <Option value="已过期">已过期</Option>
                                            <Option value="已挂失">已挂失</Option>
                                        </Select>
                                    </FormItem>
                                </Col>
                                <Col span="8">
                                    <FormItem label="开卡商家" >
                                        <Select clearable v-model="multipleCouponRow.searchMemberMerchat">
                                            <Option value="跷脚牛肉高新店">跷脚牛肉高新店</Option>
                                            <Option value="麦当劳春熙路店">麦当劳春熙路店</Option>
                                        </Select>
                                    </FormItem>
                                </Col></Row>
                                <Row>
                                <Col span="12">
                                    <FormItem label="开卡日期" >
                                        <DatePicker v-model="multipleCouponRow.searchMemberOpenDateStart" style="width:40%"></DatePicker>
                                         至
                                        <DatePicker v-model="multipleCouponRow.searchMemberOpenDateEnd" style="width:40%"></DatePicker>
                                    </FormItem>
                                </Col>
                                <Col span="12">
                                    <FormItem label="过期日期" >
                                        <DatePicker v-model="multipleCouponRow.searchMemberExpirationDateStart" style="width:40%"></DatePicker>
                                         至
                                        <DatePicker v-model="multipleCouponRow.searchMemberExpirationDateEnd" style="width:40%"></DatePicker>
                                    </FormItem>
                                </Col>
                                </Row>

                                <Row>
                                <Col span="24">
                                    <div class="t_c">
                                    <span>共有</Span><Span class="text-head-main" style="color:red">50</Span><span>名会员满足条件</Span>
                                    </div>
                                </Col>
                                </Row>
                            </Card>
                            <Card class="margin-top-10">
                                
                                    <p slot="title">
                                         选取优惠券
                                    </p>
                                    <Row>
                                        <Col span="24">
                                        <FormItem label="优惠券类型" >
                                        <CheckboxGroup v-model="multipleCouponRow.couponType">
                                            <Checkbox label="现金券10元">
                                                <span>现金券10元</span>
                                            </Checkbox>
                                            <Checkbox label="通用折扣券-9折">
                                                <span>通用折扣券-9折</span>
                                            </Checkbox>
                                            <Checkbox label="翘脚牛肉高新店满减券-满200减5元">
                                                <span>翘脚牛肉高新店满减券-满200减5元</span>
                                            </Checkbox>
                                        </CheckboxGroup>
                                        </FormItem>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span="24">
                                        <FormItem label="发放数量" >
                                        <inputNumber v-model="multipleCouponRow.quantity"></inputNumber>
                                        </FormItem>
                                         </Col>
                                    </Row>
                            </Card>
                            
                        </Form>
                        <div slot="footer">
                            <Button type="text" @click="multiplecouponcancel">取消</Button>
                            <Button type="primary" @click="multiplecouponok('multipleCouponRow')">发放</Button>
                        </div>
                    </Modal>
                </Card>
            </Col>
        </Row>
    </div>
</template>

<script>
import expandRow from './components/merchant-list-table-expand.vue';
import expandButton from './components/merchant-list-button-expand.vue';
import {ajaxMerchantListData} from './data/merchant-list-data.js';
import table2excel from '@/libs/table2excel.js';
export default {
    components: {
        expandRow
    },
    data () {
        return {
            loading: true,
            editModel: false,
            resetModel: false,
            addModel: false,
            editRoleModel: false,
            multipleCouponModel: false,
            editRow: {},
            addRow: {},
            multipleCouponRow: {},
            userColumn: [],
            memberColumn: [],
            totalData:[],
            userData: [],
            memberData: [],
            searchMemberId:'',
            searchMemberName:'',
            searchMemberMobileNo:'',
            total:0,
            pageSize:8,
        }
    },
    methods: {
        getData () {
            this.merchantColumn = [
            /*{
                type: 'selection',
                align: 'center',
                width: 60
            },*/
            {
                type: 'expand',
                width: 30,
                render: (h, params) => {
                    return h(expandRow, {
                        props: {
                            row: params.row
                        }
                    })
                }
            },
            
            {
                title: '商户名称',
                align: 'center',
                key: 'merchantName',
                sortable: true
            },
            {
                title: '行业',
                align: 'center',
                key: 'merchantIndustry',
                width: 80,
                filters: [
                    {
                        label: '餐饮',
                        value: '餐饮'
                    },
                    {
                        label: '娱乐',
                        value: '娱乐'
                    }
                ],
                filterMultiple: false,
                filterMethod (value, row) {
                    return row.merchantIndustry === value;
                }
            },
            {
                title: '入驻时间',
                align: 'center',
                key: 'merchantOpenDate',
                width: 120,
                sortable: true
            },
            {
                title: '联系人',
                align: 'center',
                key: 'merchantContactName',
                width: 100,
                sortable: true
            },
            {
                title: '手机号码',
                align: 'center',
                key: 'merchantContactMobileNo',
                width: 120
            },
            {
                title: '状态',
                align: 'center',
                width: 90,
                key: 'merchantStatus',
                render: (h, params) => {
                    const row = params.row;
                    const color = (row.merchantStatus == '正常' ? 'green' : 'red');
                    return h('Tag', {
                        props: {
                            color: color
                        }
                    }, row.merchantStatus);
                },
                filters: [
                    {
                        label: '正常',
                        value: '正常'
                    },
                    {
                        label: '停用',
                        value: '停用'
                    }
                ],
                filterMultiple: false,
                filterMethod (value, row) {
                    return row.merchantStatus === value;
                }
            },
            {
                title: '能否上架商品',
                align: 'center',
                width: 80,
                key: 'isProductUploadable',
                render: (h, params) => {
                    const row = params.row;
                    const color = (row.isProductUploadable? 'green' : 'red');
                    const type = (row.isProductUploadable? 'checkmark' : 'close');
                    return h('Icon', {
                        props: {
                            color: color,
                            type: type
                        }
                    });
                },
                filters: [
                    {
                        label: '能',
                        value: true
                    },
                    {
                        label: '不能',
                        value: 'false'
                    }
                ],
                filterMultiple: false,
                filterMethod (value, row) {
                    return row.isProductUploadable === value;
                }
            },
            {
                title: '上架商品是否需要审核',
                align: 'center',
                width: 100,
                key: 'isProductVerifyRequired',
                render: (h, params) => {
                    const row = params.row;
                    const color = (row.isProductVerifyRequired? 'green' : 'red');
                    const text = (row.isProductVerifyRequired? '需要' : '不需要');
                    return h('Tag', {
                        props: {
                            color: color
                        }
                    },text);
                },
                filters: [
                    {
                        label: '是',
                        value: true
                    },
                    {
                        label: '否',
                        value: false
                    }
                ],
                filterMultiple: false,
                filterMethod (value, row) {
                    return row.isProductVerifyRequired === value;
                }
            },
            
            {
                title: '操作',
                width: 180,
                align: 'center',
                render: (h, params) => {
                    return h(expandButton, {
                        props: {
                            row: params.row
                        }
                    })
                }
            }
            ];
            this.initPage(ajaxMerchantListData);

        },
        initPage(data){
            //获取查询的数据并数据模型
            this.totalData = data;
            //数据总数量
            this.total = this.totalData.length;
            //处理默认首页显示
            if(this.totalData.length < this.pageSize){
                this.merchantData = this.totalData;
            }else{
                this.merchantData = this.totalData.slice(0,this.pageSize);
            }
            //重新设置成显示第一页
            this.$nextTick(function(){
                this.$refs['merchantpage'].currentPage = 1;
            })
        },
        //处理分页-页数改变
        changepage(index){
            var _start = ( index - 1 ) * this.pageSize;
            var _end = index * this.pageSize;
            this.merchantData = this.totalData.slice(_start,_end);
        },
        search (data, argumentObj) {
            let res = data;
            let dataClone = data;
            for (let argu in argumentObj) {
                if (argumentObj[argu].length > 0) {
                    res = dataClone.filter(d => {
                        return d[argu].indexOf(argumentObj[argu]) > -1;
                    });
                    dataClone = res;
                }
            }
            return res;
        },
        handleSearch () {
            let totalSearchData = this.search(ajaxMemberListData, {memberName: this.searchMemberName, memberCardNo: this.searchMemberId,memberMobileNo:this.searchMemberMobileNo});
            this.initPage(totalSearchData);
        },
        add () {
            this.$router.push({
                                name: 'merchantadd',
                            });
        },

        exportMember () {
        this.$refs.memberTable.exportCsv({
                            filename: '会员列表'
                        });
        },
        sendMultipleCoupon() {
        this.multipleCouponModel = true;
        },
        multiplecouponcancel () {
            this.multipleCouponModel = false;   
        },
        multiplecouponok () {
            this.$Notice.success({
                    title: '成功',
                    desc: '优惠券已发放',
                    duration: 2
                });
                this.multipleCouponModel=false;  
        },
    },
    created () {
        this.getData();
    }
};
</script>
