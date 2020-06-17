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
                         资金概览
                    </p>
                    <Row>
                        <span class="text-lable">可提现金额:  </span>
                        <span class="text-head-main" style="color:red">￥5688.00&nbsp;&nbsp;&nbsp;</span>
                        <Button type="info" @click="application">提现</Button>
                    </Row>
                    
                </Card>
                <Card class="margin-top-10">
                    <p slot="title">
                        <Icon type="ios-person"></Icon>
                         资金明细
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
        <Modal
            v-model="fundApplicationModel"
            ref="fundApplicationModel"
            title="提现">
            <Form ref="fundApplicationRow" :model="fundApplicationRow">
                <Row>
                    <Col span="24">
                        <FormItem label="可提现金额" prop="applicationAmount">
                            <Span class="text-head-main" style="color:red">￥5000.00</Span>
                        </FormItem>
                    </Col>
                    <Col span="24">
                        <FormItem label="本次提现金额金额"  prop="applicationAmount">
                            <Input v-model="fundApplicationRow.applicationAmount" style="width:50%"></Input>
                        </FormItem>
                    </Col>
                    <Col span="24">
                        <FormItem label="提至账户"  prop="accountType">
                            <Select clearable v-model="fundApplicationRow.accountType"  style="width:50%">
                                <Option value="招商银行账户">招商银行账户-01678944</Option>
                                <Option value="支付宝账户">luochangqing2008@hotmail.com</Option>
                            </Select>
                        </FormItem>
                    </Col>
                </Row>
                
            </form>
            <div slot="footer">
                <Button type="text" @click="applicationcancel">取消</Button>
                <Button type="primary" @click="applicationok()">确定</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
import expandRow from './components/fund-detail-table-expand.vue';
import expandButton from './components/fund-detail-button-expand.vue';
import {ajaxFundDetailData} from './data/fund-detail-data.js';
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
            fundColumn: [],
            totalData:[],
            userData: [],
            fundData: [],
            searchOrderStartDate:null,
            searchOrderEndDate:null,
            total:0,
            pageSize:8,
            fundApplicationModel:false,
            fundApplicationRow: {}
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
                title: '明细项',
                align: 'center',
                key: 'tranItem'
            },
            
            {
                title: '日期',
                align: 'center',
                key: 'tranDate',
                width: 200,
                sortable: true

            },
            {
                title: '交易金额',
                align: 'center',
                key: 'tranAmount',
                width: 200,

            },
            
            {
                title: '余额',
                align: 'left',
                width: 200,
                key: 'balance'
            },
            
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
                this.$refs['orderpage'].currentPage = 1;
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
        application() {
            this.fundApplicationModel = true;
        },
        applicationcancel () {
            this.fundApplicationModel = false;   
        },
        applicationok () {
            this.$Notice.success({
                    title: '成功',
                    desc: '已发起提现申请',
                    duration: 2
                });
                this.fundApplicationModel=false;  
        }

    },
    created () {
        this.getData();
    }
};
</script>
