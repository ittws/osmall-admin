<style lang="less">
    @import '../../styles/common.less';
</style>

<template>
    <div>
        <Modal
            v-model="supplierModel"
            ref="supplierModel"
            width="1000"
            :closable="false"
            title="选择供应商">
            <Row>
                <div class="f_r">
                    <Input v-model="searchsupplierName" @on-change="handleSearch" icon="search" placeholder="供应商名称搜索" style="width: 120px" />
                    <Input v-model="searchContactName" @on-change="handleSearch" icon="search" placeholder="联系人姓名搜索" style="width: 120px" />
                    <Input v-model="searchLandline" @on-change="handleSearch" icon="search" placeholder="座机号码搜索" style="width: 120px" />
                    <Input v-model="searchMobileNo" @on-change="handleSearch" icon="search" placeholder="手机号码搜索" style="width: 120px" />
                </div>
            </Row>
            <Row class="margin-top-10">
                <Table :columns="supplierColumn" :data="supplierData" border stripe ref="supplierTable"></Table>
            </Row>
            <Row class="margin-top-10">
                <Page ref="supplierpage" :total="total" size="small" :pageSize="pageSize" @on-change="changepage" show-total show-elevator></Page>
            </Row>
            
            <div slot="footer">
                <Button type="text" @click="selectcouponcancel">取消</Button>
                <Button type="primary" @click="selectcouponok()">确定</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
import {ajaxsupplierListData} from './data/supplier-list-data.js';
export default {
    data () {
        return {
            supplierColumn: [],
            totalData:[],
            supplierData: [],
            searchsupplierName:'',
            searchContactName:'',
            searchMobileNo:'',
            searchLandline:'',
            total:0,
            pageSize:1,
            supplierModel: true
        }
    },
    methods: {
        getData () {
            this.supplierColumn = [
            {
                type: 'selection',
                align: 'center',
                width: 60
            },
            
            {
                title: '供应商名称',
                align: 'center',
                key: 'supplierName',
                sortable: true
            },

            {
                title: '行业',
                align: 'center',
                key: 'supplierIndustry',
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
                    return row.supplierIndustry === value;
                }
            },
            {
                title: '地址',
                align: 'center',
                width: 200,
                key: 'supplierAddress'
            },
            {
                title: '联系人',
                align: 'center',
                key: 'supplierContactName',
                width: 100,
                sortable: true
            },
            {
                title: '座机号码',
                align: 'center',
                key: 'supplierContactLandline',
                width: 120
            },
            {
                title: '手机号码',
                align: 'center',
                key: 'supplierContactMobileNo',
                width: 120
            },
            {
                title: '状态',
                align: 'center',
                width: 90,
                key: 'supplierStatus',
                render: (h, params) => {
                    const row = params.row;
                    const color = (row.supplierStatus == '正常' ? 'green' : 'red');
                    return h('Tag', {
                        props: {
                            color: color
                        }
                    }, row.supplierStatus);
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
                    return row.supplierStatus === value;
                }
            },
            
            ];
            this.initPage(ajaxsupplierListData);

        },
        initPage(data){
            //获取查询的数据并数据模型
            this.totalData = data;
            //数据总数量
            this.total = this.totalData.length;
            //处理默认首页显示
            if(this.totalData.length < this.pageSize){
                this.supplierData = this.totalData;
            }else{
                this.supplierData = this.totalData.slice(0,this.pageSize);
            }
            //重新设置成显示第一页
            this.$nextTick(function(){
                this.$refs['supplierpage'].currentPage = 1;
            })
        },
        //处理分页-页数改变
        changepage(index){
            var _start = ( index - 1 ) * this.pageSize;
            var _end = index * this.pageSize;
            this.supplierData = this.totalData.slice(_start,_end);
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
            let totalSearchData = this.search(ajaxsupplierListData, {supplierName: this.searchsupplierName, supplierContactName: this.searchsupplierContactName,supplierContactLandline:this.searchLandline,supplierContactMobileNo:searchMobileNo});
            this.initPage(totalSearchData);
        },
        selectcouponcancel () {
            this.$parent.selectsupplierModel = false;   
        },
        selectcouponok () {
            this.$parent.selectsupplierModel=false;  
        },
    },
    created () {
        this.getData();
    }
};
</script>
