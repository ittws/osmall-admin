<style lang="less">
    @import '../../styles/common.less';
</style>

<template>
    <div>
        <Row class="margin-top-10">
            <Col span="24">
                <Card>
                    <p slot="title">
                         待审核驿站
                    </p>
                    <Row class="margin-top-10">
                        <Col span="24">
                            <div>
                                <Table :columns="stationColumn" :data="stationData" border stripe ref="stationTable" :loading="loading"></Table>
                                
                            </div>
                        </Col>
                    </Row>
                    <Row class="margin-top-10">
                        <Col span="18">
                        <Page ref="stationpage" :total="total" size="small" :pageSize="pageSize" @on-change="changepage" show-total show-elevator>
                        </Page>
                        </Col>
                    </Row>
                </Card>
            </Col>
        </Row>
        <Modal
            v-model="showReject"
            title="驿站审核不通过"
            @on-ok="rejectok"
            @on-cancel="rejectcancel">
            <Form >
             <Row>
                <Col span="24">
                    <FormItem>
                        <Input v-model="rejectReason" type="textarea" :cols="4" placeholder="备注, 原因"></Input>
                    </FormItem>
                </Col>
            </Row>
            </Form>
        </Modal>
    </div>
</template>

<script>
import {ajaxStationListData} from '../common-components/data/station-list-data.js';
import table2excel from '@/libs/table2excel.js';
export default {
    components: {
        
    },
    data () {
        return {
            loading: false,
            viewRow: {},
            stationColumn : [
            {
                title: '申请日期',
                align: 'center',
                key: 'createDate',
                width: 140
            },
            {
                title: '姓名',
                align: 'center',
                key: 'contactName',
                width: 130
            },
            {
                title: '手机号码',
                align: 'center',
                key: 'mobileNo',
                width: 130
            },
            {
                title: '身份证号码',
                align: 'center',
                key: 'idCardNo',
                width: 200
            },
            {
                title: '地址',
                align: 'center',
                key: 'merchantAddress',
            },
            {
                title: '操作',
                align: 'center',
                width:150,
                render: (h, params) => {
                    return h('div', [
                        h('Button',{
                            props: {
                                type: 'error',
                                size: 'small'
                            },
                            style: {
                                margin: '0 5px 0 0'
                            },
                            on: {
                                click: (event) => {
                                    this.reject(params.row);
                                }
                            }
                        },'拒绝'),
                        h('Poptip',{
                            props: {
                                confirm: true,
                                title: '您确定要同意该驿站申请吗?',
                                transfer: true
                            },
                            on: {
                                'on-ok': () => {
                                    this.approve(params.row);
                                }
                            }
                        },[
                            h('Button',{
                            props: {
                                type: 'success',
                                size: 'small'
                            },
                            style: {
                                margin: '0 5px 0 0'
                            },
                        },'同意')
                        ]),
                    ])
                }
            }],
            totalData:[],
            stationData: [],
            total:0,
            pageSize:8,
            dateSearchType:'今日',
            searchStationContactICNo:'',
            searchStationContactMobileNo:'',
            searchStationAddress:'',
            showReject:false,
            rejectReason:''
        }
    },
    methods: {
        getData () {
            var options={
                
            }
            this.loading = true;
            this.$http.post("/admin/inquiryPendingMerchantApplication", this.common.request(options))  
            .then(response => {  
                this.loading = false;
                if(response.data.body.status.statusCode==0){
                    var data=response.data.body.data.applications;
                    //获取查询的数据并数据模型
                    this.initPage(data);
                }
            }, response => {  
                this.loading = false;
                console.log(response);  
            })
        },
        initPage(data){
            //获取查询的数据并数据模型
            this.totalData = data;
            //数据总数量
            this.total = this.totalData.length;
            //处理默认首页显示
            if(this.totalData.length < this.pageSize){
                this.stationData = this.totalData;
            }else{
                this.stationData = this.totalData.slice(0,this.pageSize);
            }
            //重新设置成显示第一页
            this.$nextTick(function(){
                this.$refs['stationpage'].currentPage = 1;
            })
        },
        //处理分页-页数改变
        changepage(index){
            var _start = ( index - 1 ) * this.pageSize;
            var _end = index * this.pageSize;
            this.stationData = this.totalData.slice(_start,_end);
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
            let totalSearchData = this.search(ajaxStationListData, {});
            this.initPage(totalSearchData);
        },
        viewstation (data,index) {
            this.$router.push({
                                name: 'stationdetail',
                            });
        },
        closestation () {
            this.$Notice.success({
                title: '成功',
                desc: '驿站已关闭',
                duration: 2
            });
        },
        reject (row) {
            this.viewRow = row;
            this.showReject = true;
        },
        rejectcancel () {
            this.showReject = false;
        },
        rejectok () {
            var options={
                actionType:'REJECT',
                merchantApplicationUuid:this.viewRow.merchantApplicationUuid,
                rejectReason: this.rejectReason
            }
            this.$http.post("/admin/verifyMerchantApplication", this.common.request(options))  
            .then(response => {  
                if(response.data.body.status.statusCode==0){
                    this.$Notice.error({
                        title: '拒绝',
                        desc: '已拒绝该驿站申请',
                        duration: 2
                    });
                    //重新获取列表数据
                    this.getData();
                }else{
                    this.$Message.error(response.data.boday.status.errorDesc);
                }
            }, response => {  
                console.log(response);  
            })
            this.showReject = false;
        },
        approve (row) {
            var options={
                actionType:'APPROVE',
                merchantApplicationUuid:row.merchantApplicationUuid,
            }
            this.$http.post("/admin/verifyMerchantApplication", this.common.request(options))  
            .then(response => {  
                if(response.data.body.status.statusCode==0){
                    this.$Notice.success({
                        title: '成功',
                        desc: '已通过该驿站申请',
                        duration: 2
                    });
                    //重新获取列表数据
                    this.getData();
                }else{
                    this.$Message.error(response.data.boday.status.errorDesc);
                }
            }, response => {  
                console.log(response);  
            })
        },
    },
    created () {
        this.getData();
    }
};
</script>
