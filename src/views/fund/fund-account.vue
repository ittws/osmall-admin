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
                         资金账号
                    </p>
                    <Row>
                        <Button icon="plus" type="primary" @click="add()">新增资金账号</Button>
                    </Row>
                    
                    <Row class="margin-top-10">
                        <Col span="24">
                            <div>
                                <Table :columns="fundAccountColumn" :data="fundAccountData" border stripe ref="fundAccountTable"></Table>
                                
                            </div>
                        </Col>
                    </Row>
                    <Row class="margin-top-10">
                        <Page ref="accountpage" :total="total" size="small" :pageSize="pageSize" @on-change="changepage" show-total show-elevator></Page>
                    </Row>
                    
                </Card>
            </Col>
        </Row>
    </div>
</template>

<script>
import {ajaxFundAccountData} from './data/fund-account-data.js';
import expandButton from './components/fund-account-button-expand.vue';
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
            fundAccountColumn: [],
            totalData:[],
            userData: [],
            fundAccountData: [],
            searchOrderStartDate:null,
            searchOrderEndDate:null,
            total:0,
            pageSize:8,
        }
    },
    methods: {
        getData () {
            this.fundAccountColumn = [
            /*{
                type: 'selection',
                align: 'center',
                width: 60
            },*/
            {
                title: '账号类型',
                align: 'center',
                key: 'accountType'
            },
            
            {
                title: '账号',
                align: 'center',
                key: 'accountNo',
                width: 300,
                sortable: true

            },
            {
                title: '银行名称',
                align: 'center',
                key: 'accountBankName',
                width: 200,

            },
            
            {
                title: '账户',
                align: 'left',
                width: 200,
                key: 'accountName'
            },
            {
                title: '操作',
                align: 'left',
                width: 150,
                render: (h, params) => {
                    return h(expandButton, {
                        props: {
                            row: params.row
                        }
                    })
                }
            }
            
            ];
            this.initPage(ajaxFundAccountData);
            //this.loading = false;

        },
        initPage(data){
            //获取查询的数据并数据模型
            this.totalData = data;
            //数据总数量
            this.total = this.totalData.length;
            //处理默认首页显示
            if(this.totalData.length < this.pageSize){
                this.fundAccountData = this.totalData;
            }else{
                this.fundAccountData = this.totalData.slice(0,this.pageSize);
            }
            //重新设置成显示第一页
            this.$nextTick(function(){
                this.$refs['fundaccountpage'].currentPage = 1;
            })
        },
        //处理分页-页数改变
        changepage(index){
            var _start = ( index - 1 ) * this.pageSize;
            var _end = index * this.pageSize;
            this.fundAccountData = this.totalData.slice(_start,_end);
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
                                name: 'fundaccountadd',
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
