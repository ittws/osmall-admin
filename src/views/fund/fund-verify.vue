<style lang="less">
    @import '../../styles/common.less';
</style>

<template>
    <div>
        <Row class="margin-top-10">
            <Col span="24">
                <Card class="margin-top-10">
                    <p slot="title">
                        <Icon type="ios-person"></Icon>
                         提现申请
                    </p>
                    
                    <Row class="margin-top-10">
                        <Col span="24">
                            <div>
                                <Table :columns="fundColumn" :data="fundData" border stripe ref="fundTable"></Table>
                                
                            </div>
                        </Col>
                    </Row>
                    <Row class="margin-top-10">
                        <Page ref="fundpage" :total="total" size="small" :pageSize="pageSize" @on-change="changepage" show-total show-elevator></Page>
                    </Row>
                    
                </Card>
            </Col>
        </Row>
    </div>
</template>

<script>
import {ajaxFundDetailData} from './data/fund-verify-data.js';
import expandButton from './components/fund-verify-button-expand.vue';
export default {
    components: {
        expandButton
    },
    data () {
        return {
            loading: true,
            editModel: false,
            resetModel: false,
            addModel: false,
            editRow: {},
            addRow: {},
            fundColumn: [],
            totalData:[],
            userData: [],
            fundData: [],
            searchOrderStartDate:null,
            searchOrderEndDate:null,
            total:0,
            pageSize:8,
        }
    },
    methods: {
        getData () {
            this.fundColumn = [
            /*{
                type: 'selection',
                align: 'center',
                width: 60
            },*/
            
            {
                title: '日期',
                align: 'center',
                key: 'tranDate',
                sortable: true

            },
            {
                title: '提现金额',
                align: 'center',
                key: 'tranAmount',
                width: 150,

            },
            
            {
                title: '商户',
                align: 'center',
                width: 150,
                key: 'merchantName'
            },
            {
                title: '处理状态',
                align: 'center',
                width: 150,
                render: (h, params) => {
                    let handleStatus = params.row.handleStatus;
                    let color = '';
                    if(handleStatus == '已处理')
                        color = 'green';
                    else if(handleStatus == '未处理')
                        color = 'red';
                        
                    return h('tag', {
                        props: {
                            color: color
                        }
                    }, handleStatus)
                }
            },
            {
                title: '提现结果',
                align: 'center',
                width: 150,
                render: (h, params) => {
                    let status = params.row.status;
                    let color = '';
                    if(status == '成功')
                        color = 'green';
                    else if(status == '失败')
                        color = 'red';
                    
                    return h('tag', {
                        props: {
                            color: color
                        }
                    }, status)
                }
            },
            {
                title: '操作',
                align: 'center',
                width: 200,
                render: (h, params) => {
                    return h(expandButton, {
                        props: {
                            row: params.row
                        }
                    })
                }
            }
            ];
            this.initPage(ajaxFundDetailData);
            //this.loading = false;

        },
        initPage(data){
            //获取查询的数据并数据模型
            this.totalData = data;
            //数据总数量
            this.total = this.totalData.length;
            //处理默认首页显示
            if(this.totalData.length < this.pageSize){
                this.fundData = this.totalData;
            }else{
                this.ofundData = this.totalData.slice(0,this.pageSize);
            }
            //重新设置成显示第一页
            this.$nextTick(function(){
                this.$refs['fundpage'].currentPage = 1;
            })
        },
        //处理分页-页数改变
        changepage(index){
            var _start = ( index - 1 ) * this.pageSize;
            var _end = index * this.pageSize;
            this.fundData = this.totalData.slice(_start,_end);
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
            //let totalSearchData = this.search(ajaxFundDetailData, {productTypeName: this.searchProductType, productName: this.searchProductName});
            //this.initPage(totalSearchData);
        },
        add () {
            this.$router.push({
                                name: 'productadd',
                            });
        },

        coupondata () {
            this.$router.push({
                                name: 'coupondata',
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
