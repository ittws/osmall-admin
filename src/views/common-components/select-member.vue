<style lang="less">
    @import '../../styles/common.less';
</style>

<template>
    <div>
        <Modal
            v-model="memberModel"
            ref="memberModel"
            width="1000"
            :closable="false"
            title="选择会员">
            <Row>
                <div class="f_r">
                    <Input v-model="searchMemberName" @on-change="handleSearch" icon="search" placeholder="请输入姓名搜索" style="width: 150px" />
                    <Input v-model="searchMemberId" @on-change="handleSearch" icon="search" placeholder="请输入会员卡号搜索" style="width: 150px" />
                    <Input v-model="searchMemberMobileNo" @on-change="handleSearch" icon="search" placeholder="请输入手机号码搜索" style="width: 150px" />
                </div>
            </Row>
            
            <Row class="margin-top-10">
                <Col span="24">
                    <div>
                        <Table :columns="memberColumn" :data="memberData" border stripe ref="memberTable"></Table>
                        
                    </div>
                </Col>
            </Row>
            <Row class="margin-top-10">
                <Page ref="memberpage" :total="total" size="small" :pageSize="pageSize" @on-change="changepage" show-total show-elevator></Page>
            </Row>
            
            <div slot="footer">
                <Button type="text" @click="selectcouponcancel">取消</Button>
                <Button type="primary" @click="selectcouponok()">确定</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
import {ajaxMemberListData} from './data/member-list-data.js';
export default {
    data () {
        return {
            memberModel: true,
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
            depts : [{
                label: '财务部',
                value: '财务部'
            },
            {
                label: '销售部',
                value: '销售部'
            }],
            roles : [{
                label: '经理',
                value: '经理'
            },
            {
                label: '主管',
                value: '主管'
            },
            {
                label: '会计',
                value: '会计'
            }],
            ruleValidate: {
                name: [
                    { required: true, message: '请输入姓名', trigger: 'blur' },
                    { type: 'string', min: 2, max: 20, message: '请输入正确的姓名', trigger: 'blur' }
                ],
                id: [
                    { required: true, message: '请输入账户名', trigger: 'blur' },
                    { type: 'string',  max: 20, message: '账户名不大于20个字符', trigger: 'blur' }
                ],
                mobileNo: [
                    { required: true, message: '请输入手机号码', trigger: 'blur' }
                ]
            }
        }
    },
    methods: {
        getData () {
            this.memberColumn = [
            {
                type: 'selection',
                align: 'center',
                width: 60
            },
            {
                title: '姓名',
                align: 'center',
                key: 'memberName',
                sortable: true,
                width: 130,
                render: (h, params) => {
                    return h('div', [
                        h('Avatar',{
                            props:{
                                icon: 'person'
                            }
                        }),
                        h('Span',{
                            style:{
                                marginLeft: '10px'
                            }
                        }, params.row.memberName)
                    ]);
                },
            },
            {
                title: '卡号',
                align: 'center',
                key: 'memberCardNo',
                width: 120,
                sortable: true
            },
            {
                title: '等级',
                align: 'center',
                key: 'memberLevel',
                width: 150,
                filters: [
                    {
                        label: '联盟至尊卡会员',
                        value: '联盟至尊卡会员'
                    },
                    {
                        label: '联盟金卡会员',
                        value: '联盟金卡会员'
                    },
                    {
                        label: '联盟银卡会员',
                        value: '联盟银卡会员'
                    }
                ],
                filterMultiple: false,
                filterMethod (value, row) {
                    return row.memberLevel === value;
                }
            },
            {
                title: '手机号码',
                align: 'center',
                key: 'memberMobileNo',
                width: 120,
            },
            {
                title: '状态',
                align: 'center',
                width: 90,
                key: 'status',
                render: (h, params) => {
                    const row = params.row;
                    const color = (row.memberStatus == '正常' ? 'green' : 'red');
                    return h('Tag', {
                        props: {
                            color: color
                        }
                    }, row.memberStatus);
                },
                filters: [
                    {
                        label: '正常',
                        value: true
                    },
                    {
                        label: '过期',
                        value: false
                    }
                ],
                filterMultiple: false,
                filterMethod (value, row) {
                    return row.memberStatus === value;
                }
            },
            /*
            {
                title: '余额',
                align: 'center',
                key: 'memberBalance',
                width: 90,
                filters: [
                    {
                        label: '大于5000',
                        value: 1
                    },
                    {
                        label: '1000-5000',
                        value: 2
                    },
                    {
                        label: '小于1000',
                        value: 3
                    }
                ],
                filterMultiple: false,
                filterMethod (value, row) {
                    if (value === 1) {
                        return row.memberBalance > 5000;
                    } else if (value === 2) {
                        return (row.memberBalance < 5000) && (row.memberBalance > 1000);
                    } else if (value === 3) {
                        return row.memberBalance < 1000;
                    }
                }
            },
            {
                title: '购币',
                align: 'center',
                key: 'memberIntegral',
                width: 80,
                filters: [
                    {
                        label: '大于5000',
                        value: 1
                    },
                    {
                        label: '1000-5000',
                        value: 2
                    },
                    {
                        label: '小于1000',
                        value: 3
                    }
                ],
                filterMultiple: false,
                filterMethod (value, row) {
                    if (value === 1) {
                        return row.memberIntegral > 5000;
                    } else if (value === 2) {
                        return (row.memberIntegral < 5000) && (row.memberIntegral > 1000);
                    } else if (value === 3) {
                        return row.memberIntegral < 1000;
                    }
                }
            },
            */
            {
                title: '开卡商家',
                align: 'center',
                key: 'memberOpenMerchant',
                filters: [
                    {
                        label: '麦当劳高新店',
                        value: '麦当劳高新店'
                    },
                    {
                        label: '麦当劳春熙路店',
                        value: '麦当劳春熙路店'
                    },
                    {
                        label: 'PizzaHut高新店',
                        value: 'PizzaHut高新店'
                    }
                ],
                filterMultiple: false,
                filterMethod (value, row) {
                        return row.memberOpenMerchant === value;
                }
            }

            ];
            this.initPage(ajaxMemberListData);
            //this.loading = false;

        },
        initPage(data){
            //获取查询的数据并数据模型
            this.totalData = data;
            //数据总数量
            this.total = this.totalData.length;
            //处理默认首页显示
            if(this.totalData.length < this.pageSize){
                this.memberData = this.totalData;
            }else{
                this.memberData = this.totalData.slice(0,this.pageSize);
            }
            //重新设置成显示第一页
            this.$nextTick(function(){
                this.$refs['memberpage'].currentPage = 1;
            })
        },
        //处理分页-页数改变
        changepage(index){
            var _start = ( index - 1 ) * this.pageSize;
            var _end = index * this.pageSize;
            this.memberData = this.totalData.slice(_start,_end);
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
        selectcouponcancel () {
            this.$parent.selectMemberModel = false;   
        },
        selectcouponok () {
            this.$parent.selectMemberModel=false;  
        }
    },
    created () {
        this.getData();
    }
};
</script>
