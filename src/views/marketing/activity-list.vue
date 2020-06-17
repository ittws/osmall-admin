<style lang="less">
    @import '../../styles/common.less';
</style>

<template>
    <div>
    <Card>
    <Tabs type="card">
        <TabPane label="平台活动列表" name="platformActivity">
   
        <Row class="margin-top-10">
            <Col span="24">
               
                    <Row>
                        <Button icon="plus" type="primary" @click="add()">新增平台活动</Button>
                        <div class="f_r">
                            <Input v-model="searchActivityName" @on-change="handleSearch" icon="search" placeholder="活动名称搜索" style="width: 150px" />
                        </div>
                    </Row>
                    
                    <Row class="margin-top-10">
                        <Col span="24">
                            <div>
                                <Table :columns="activityColumn" :data="activityData" border stripe ref="couponTable"></Table>
                                
                            </div>
                        </Col>
                    </Row>
                    <Row class="margin-top-10">
                        <Page ref="couponpage" :total="total" size="small" :pageSize="pageSize" @on-change="changepage" show-total show-elevator></Page>
                    </Row>

                
            </Col>
        </Row>
        </TabPane>
        <TabPane label="商户活动列表" name="merchantActivity">
        <Row class="margin-top-10">
            <Col span="24">
               
                    <Row>
                        <Button icon="plus" type="primary" @click="add()">新增商户活动</Button>
                        <div class="f_r">
                            <Input v-model="searchActivityName" @on-change="handleSearch" icon="search" placeholder="活动名称搜索" style="width: 150px" />
                        </div>
                    </Row>
                    
                    <Row class="margin-top-10">
                        <Col span="24">
                            <div>
                                <Table :columns="activityColumn" :data="activityData" border stripe ref="couponTable"></Table>
                                
                            </div>
                        </Col>
                    </Row>
                    <Row class="margin-top-10">
                        <Page ref="couponpage" :total="total" size="small" :pageSize="pageSize" @on-change="changepage" show-total show-elevator></Page>
                    </Row>

                
            </Col>
        </Row>
        </TabPane>
         </Tabs>
         </Card>
    </div>
</template>

<script>
import expandButton from './components/activity-list-button-expand.vue';
import expandRow from './components/activity-list-table-expand.vue';
import {ajaxActivityListData} from './data/activity-list-data.js';
import table2excel from '@/libs/table2excel.js';
export default {
    components: {
        expandButton,expandRow
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
            searchActivityName:'',
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
            this.activityColumn = [
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
                title: '活动类型',
                align: 'center',
                key: 'activityType',
                width: 100,
                filters: [
                    {
                        label: '公告',
                        value: '公告'
                    },
                    {
                        label: '现场',
                        value: '现场'
                    },
                    {
                        label: '领券',
                        value: '领券'
                    }
                ],
                filterMethod (value, row) {
                    return row.activityType === value;
                }

            },
            {
                title: '活动名称',
                align: 'center',
                key: 'activityName',
                width: 150,
                sortable: true
            },
            {
                title: '参与渠道',
                align: 'center',
                key: 'activityChannel',
                width: 120,
                filters: [
                    {
                        label: '线下',
                        value: '线下'
                    },
                    {
                        label: '线上',
                        value: '线上'
                    }
                ],
                filterMultiple: true,
                filterMethod (value, row) {
                    return row.activityChannel === value;
                }

            },
            /*{
                title: '活动内容',
                align: 'center',
                width: 100,
                render: (h, params) => {
                    return h('Tooltip', {
                        props: {
                            content: params.row.activityContent
                        }
                    }, '内容...');
                }

            },*/
            {
                title: '活动时间',
                align: 'center',
                render: (h, params) => {
                    return h('Span', {
                        props: {
                            
                        }
                    }, params.row.activityStartTime+"  到  "+params.row.activityEndTime);
                }

            },
            {
                title: '已报名人数',
                align: 'center',
                key: 'activityJoinerQuantity',
                width: 120,
                sortable: true
            },
            {
                title: '活动状态',
                align: 'center',
                key: 'activityStatus',
                width: 100,
                render: (h, params) => {
                    const row = params.row;
                    let color = 'default';
                    if(row.activityStatus=='已结束')
                        color = 'green';
                    else if(row.activityStatus=='进行中')
                        color = 'orange';
                    return h('Tag', {
                        props: {
                            color: color
                        }
                    }, row.activityStatus);
                }
            },
            {
                title: '操作',
                align: 'left',
                width: 180,
                render: (h, params) => {
                    return h(expandButton, {
                        props: {
                            row: params.row
                        }
                    })
                }
            },
            
            ];
            this.initPage(ajaxActivityListData);
            //this.loading = false;

        },
        initPage(data){
            //获取查询的数据并数据模型
            this.totalData = data;
            //数据总数量
            this.total = this.totalData.length;
            //处理默认首页显示
            if(this.totalData.length < this.pageSize){
                this.activityData = this.totalData;
            }else{
                this.activityData = this.totalData.slice(0,this.pageSize);
            }
            //重新设置成显示第一页
            this.$nextTick(function(){
                this.$refs['couponpage'].currentPage = 1;
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
            let totalSearchData = this.search(ajaxActivityListData, {activityName: this.searchActivityName});
            this.initPage(totalSearchData);
        },
        add () {
            this.$router.push({
                                name: 'activityadd',
                            });
        },

        activityData () {
            this.$router.push({
                                name: 'activityData',
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
