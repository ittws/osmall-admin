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
                         订单管理
                    </p>
                    <Row>
                        <div class="f_r">
                            <span>下单时间范围 </span>
                            <DatePicker type="daterange" placement="bottom-end" placeholder="" ></DatePicker>
                            <Button icon="search" type="info" @click="handlesearch">查询</Button>
                        </div>
                    </Row>
                    
                    <Row class="margin-top-10">
                        <Col span="24">
                            <div>
                                <Table :columns="orderColumn" :data="orderData" border stripe ref="orderTable"></Table>
                                
                            </div>
                        </Col>
                    </Row>
                    <Row class="margin-top-10">
                        <Page ref="orderpage" :total="total" size="small" :pageSize="pageSize" @on-change="changepage" show-total show-elevator></Page>
                    </Row>
                    
                </Card>
            </Col>
        </Row>
    </div>
</template>

<script>
import expandRow from './components/order-list-table-expand.vue';
import expandButton from './components/order-list-button-expand.vue';
import {ajaxOrderListData} from './data/order-list-data.js';
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
            editRow: {},
            addRow: {},
            orderColumn: [],
            totalData:[],
            userData: [],
            orderData: [],
            searchOrderStartDate:null,
            searchOrderEndDate:null,
            total:0,
            pageSize:8,
        }
    },
    methods: {
        getData () {
            this.orderColumn = [
            /*{
                type: 'selection',
                align: 'center',
                width: 60
            },*/
            {
                title: '订单号',
                align: 'center',
                key: 'orderNumber',
                width: 150
            },
            {
                title: '商品',
                align: 'center',
                render: (h, params) => {
                    return h('div', {
                        props: {
                            row: params.row
                        }
                    },[
                        h('img', {
                            props: {
                                src: 'https://o5wwk8baw.qnssl.com/a42bdcc1178e62b4694c830f028db5c0/avatar'
                            }
                        }),
                        h('spsn', {
                            props: {
                                
                            }
                        },params.row.product.productName)
                        
                    ])
                }
            },
            {
                title: '数量',
                align: 'center',
                key: 'orderQuantity',
                width: 70,

            },
            {
                title: '买家信息',
                align: 'center',
                key: 'orderBuyer',
                width: 100,

            },
            {
                title: '下单时间',
                align: 'center',
                key: 'orderTime',
                width: 140,
                sortable: true

            },
            {
                title: '订单金额',
                align: 'center',
                key: 'orderTotalAmount',
                width: 100,

            },
            {
                title: '订单状态',
                align: 'center',
                width: 120,
                render: (h, params) => {
                    let status = params.row.orderStatus;
                    let color = '';
                    if(status == '待付款')
                        color = '##2db7f5';
                    else if(status == '待发货')
                        color = 'orange';
                    else if(status == '已发货')
                        color = 'blue';
                    else if(status == '交易成功')
                        color = 'green';
                    else if(status == '交易关闭')
                        color = 'gray';
                    return h('tag', {
                        props: {
                            color: color
                        }
                    }, status)
                },
                filters: [
                    {
                        label: '待付款',
                        value: '待付款'
                    },
                    {
                        label: '待发货',
                        value: '待发货'
                    },
                    {
                        label: '已发货',
                        value: '已发货'
                    },
                    {
                        label: '交易成功',
                        value: '交易成功'
                    },
                    {
                        label: '已关闭',
                        value: '已关闭'
                    }
                ],
                filterMethod (value, row) {
                    return row.orderStatus === value;
                }
            },
            {
                title: '操作',
                align: 'left',
                width: 210,
                render: (h, params) => {
                    return h(expandButton, {
                        props: {
                            row: params.row
                        }
                    })
                }
            },
            
            ];
            this.initPage(ajaxOrderListData);
            //this.loading = false;

        },
        initPage(data){
            //获取查询的数据并数据模型
            this.totalData = data;
            //数据总数量
            this.total = this.totalData.length;
            //处理默认首页显示
            if(this.totalData.length < this.pageSize){
                this.orderData = this.totalData;
            }else{
                this.orderData = this.totalData.slice(0,this.pageSize);
            }
            //重新设置成显示第一页
            this.$nextTick(function(){
                this.$refs['orderpage'].currentPage = 1;
            })
        },
        //处理分页-页数改变
        changepage(index){
            var _start = ( index - 1 ) * this.pageSize;
            var _end = index * this.pageSize;
            this.productData = this.totalData.slice(_start,_end);
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
            //let totalSearchData = this.search(ajaxProductListData, {productTypeName: this.searchProductType, productName: this.searchProductName});
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
