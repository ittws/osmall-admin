<style lang="less">
    @import '../../styles/common.less';
</style>

<template>
    
    <div>
        <Card>
            <Tabs type="card">
                <TabPane label="报名数据" name="enrollmentData">
                <Row class="margin-top-10">
            <Col span="24">
                <Row>
                    <Button icon="document-text" type="success" @click="exportMember()">导出</Button>
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
                </Col>
                </Row>
                </TabPane>
                <TabPane label="优惠券领取数据" name="couponData">
           <Row class="margin-top-10">
            <Col span="24">
                <Row>
                    <Button icon="document-text" type="success" @click="exportCoupon()">导出</Button>
                </Row>
                <Row class="margin-top-10">
                    <Col span="24">
                        <div>
                            <Table :columns="couponColumn" :data="couponData" border stripe ref="memberTable"></Table>
                            
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
import {ajaxMemberListData} from '../member/data/member-list-data.js';
export default {

    data () {
        return {
            activity:{},
            memberColumn : [

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
                width: 150,
                sortable: true
            },
            {
                title: '手机号码',
                align: 'center',
                key: 'memberMobileNo',
                width: 120,
            },
            {
                title: '性别',
                align: 'center',
                key: 'memberSex',
                width: 100,
            },
            {
                title: '报名时间',
                align: 'center',
                sortable: true,
                render: (h, params) => {
                    return h('span', '2017-09-09 12:45');
                },
            }],
            couponColumn : [
            {
                title: '优惠券名称',
                align: 'center',
                width: 150,
                sortable: true,
                render: (h, params) => {
                    return h('span', '满300减5元');
                }
            },
            {
                title: '优惠券号',
                align: 'center',
                width: 150,
                sortable: true,
                render: (h, params) => {
                    return h('span', '20180987234');
                }
            },

            {
                title: '领取人姓名',
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
                title: '手机号码',
                align: 'center',
                key: 'memberMobileNo',
                width: 120,
            },
            {
                title: '性别',
                align: 'center',
                key: 'memberSex',
                width: 100,
            },
            {
                title: '领取时间',
                align: 'center',
                sortable: true,
                render: (h, params) => {
                    return h('span', '2017-09-09 12:45');
                },
            }]

        }
    },
    methods: {
        getData () {
            this.activity.activityName = this.$route.params.activityName;
            this.initPage(ajaxMemberListData);
        },
        
        addok (name) {
            this.$Notice.success({
                title: '成功',
                desc: '营销活动已保存',
                duration: 2
            });
        },
        initPage(data){
            //获取查询的数据并数据模型
            this.totalData = data;
            //数据总数量
            this.total = this.totalData.length;
            //处理默认首页显示
            if(this.totalData.length < this.pageSize){
                this.memberData = this.totalData;
                this.couponData = this.totalData;
            }else{
                this.memberData = this.totalData.slice(0,this.pageSize);
                this.couponData = this.totalData;
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
        exportMember () {
        this.$refs.memberTable.exportCsv({
                            filename: '活动报名人员'
                        });
        },
        exportCoupon () {
        this.$refs.couponTable.exportCsv({
                            filename: '优惠券领取人员'
                        });
        },
        
    },
    created () {
        this.getData();
    }
};
</script>
