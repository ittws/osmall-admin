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
                         库存明细
                    </p>
                    <!-- <Row>
                        <div class="f_r">
                            <Button icon="document-text" type="warning" @click="exportStock()">导出</Button>
                        </div>
                    </Row> -->
                    <Row class="margin-top-10">
                        <Col span="24">
                            <div>
                                <Table :columns="stockColumn" :loading="loading" :data="stockData" border stripe ref="stockTable"></Table>
                                
                            </div>
                        </Col>
                    </Row>
                    <Row class="margin-top-10">
                        <Col span=12>
                            <Page ref="stockpage" :total="total" size="small" :pageSize="pageSize" @on-change="changepage" show-total show-elevator></Page>
                        </Col>
                        <!-- <Col style="float:right;width:110px">
                            库存合计
                            <text style="color:red;">{{merchantInventory}}</text>
                            箱
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        </Col> -->
                    </Row>
                    
                </Card>
            </Col>
        </Row>
        <Modal v-model="notemodel" width="280" ref="rejectModelRef" :closable=false title="更改库存信息">
            <div style="margin-bottom:10px;margin-left:3px">当前库存：{{availableBalance}}&nbsp;箱&nbsp;{{availableBalancePouch}}&nbsp;包</div>
            <Form :model="inventory" :label-width="75">
                <FormItem label="修改后库存">
                    <InputNumber v-model='inventory.invbox' style="width:35%"></InputNumber>&nbsp;&nbsp;箱
                    <Input disabled v-model='availableBalancePouch' style="width:35%"></Input>&nbsp;&nbsp;包
                </FormItem>
                <!-- <FormItem label="库存(包)">
                    <InputNumber  :max="9" v-model='inventory.package' style="width:65%"></InputNumber>&nbsp;&nbsp;包
                </FormItem> -->
            </Form>
            <div slot="footer">
                <Button type="text" @click="cancel">取消</Button>
                <Button type="primary" @click="inventoryok()">提交</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
export default {
    data () {
        return {
            loading: true,
            notemodel:false,
            availableBalancePouch:'',
            availableBalance:'',
            stockColumn: [],
            inventory:{},
            totalData:[],
            stockData: [],
            total:0,
            merchantInventory:'0',
            pageSize:8,
            fundApplicationModel:false,
        }
    },
    methods: {
        getData () {
            this.stockColumn = [
            // {
            //     type: 'selection',
            //     align: 'center',
            //     width: 60
            // },
            {
                title: '驿站',
                align: 'center',
                width: 450,
                render: (h, params) => {
                    return h('div', [
                        h('a',{
                            on: {
                                click: (event) => {
                                    this.viewstation(params.row);
                                }
                            }
                        },params.row.merchantDTO.merchantAddress)
                    ])
                }
            },
            {
                title: '当前库存',
                align: 'center',
                key: 'availableBalance',
                width: 150,
                render: (h, params) => {
                    var availableBalances='';
                    if (params.row.availableBalance) {
                        availableBalances = params.row.availableBalance+"箱"
                    }
                    if (params.row.availableBalancePouch) {
                        availableBalances = params.row.availableBalance+"箱"+params.row.availableBalancePouch+"包"
                    }
                    return h('div', [
                        h('span',{

                        },availableBalances)
                    ])
                }
            },
            {
                title: '操作',
                align: 'center',
                width:180,
                render: (h, params) => {
                    return h('div', [
                        h('Button',{
                            props: {
                                type: 'warning',
                                size: 'small',
                            },
                            style: {
                                margin: '0 5px 0 0'
                            },
                            on: {
                                click: (event) => {
                                    this.note(params.row);
                                }
                            }
                        },'修改库存'),
                    ])
                }
            },
            ];
        },
        note(row){
            
            this.availableBalance=row.availableBalance;
            this.availableBalancePouch=row.availableBalancePouch;
            this.merchantUuid=row.merchantDTO.merchantUuid;
                this.notemodel = true;
        },
        cancel(){
             this.notemodel = false;
        },
        inventoryok(row){
            this.notemodel=false;
            let searchOptions = {
                        "merchantDTO":{
                            "merchantUuid":this.merchantUuid
                        },
                        "availableBalance":this.inventory.invbox,
                        "availableBalancePouch":this.availableBalancePouch
            };
            this.$http.post("/admin/changeMerchantInventory", this.common.request(searchOptions))  
            .then(response => {
                if(response.data.body.status.statusCode==0){
                    this.$Notice.success({
						desc: '库存已修改',
						duration: 2
                    });
                    this.inquiryStock();
                }else{;
                    this.$Message.error(response.data.body.status.errorDesc);
                }
            }, response => {
                this.$Message.error(response.data.body.status.errorDesc);
            })
        },
        inquiryStock(){
            let searchOptions = {
                
            };
            this.$http.post("/admin/inquiryMerchantInventory", this.common.request(searchOptions))  
            .then(response => {
                this.loading = false;
                if(response.data.body.status.statusCode==0){
                    var availableBalance = 0;
                    var availableBalancePouch = 0;
                    var data = response.data.body.data;
                    var inventoryList = data.inventoryList;
                    // inventoryList.forEach((temm,index) => {
                    //     
                    //     //库存合计
                    //     availableBalancePouch = availableBalancePouch+temm.availableBalancePouch;
                    //     availableBalance+=item.availableBalance;
                    // });
                    // this.merchantInventory = availableBalance+availableBalancePouch;
                    // var a =this.merchantInventory
                    // 
                    this.initPage(inventoryList);
                }else{
                    this.$Message.error(response.data.body.status.errorDesc);
                }
            }, response => {  
                this.loading = false;
                this.$Message.error(response.data.body.status.errorDesc);
            })
        },
        initPage(data){
            //获取查询的数据并数据模型
            this.totalData = data;
            //数据总数量
            this.total = this.totalData.length;
            //处理默认首页显示
            if(this.totalData.length < this.pageSize){
                this.stockData = this.totalData;
            }else{
                this.stockData = this.totalData.slice(0,this.pageSize);
            }
            //重新设置成显示第一页
            this.$nextTick(function(){
                this.$refs['stockpage'].currentPage = 1;
            })
        },
        //处理分页-页数改变
        changepage(index){
            
            var _start = ( index - 1 ) * this.pageSize;
            var _end = index * this.pageSize;
            this.stockData = this.totalData.slice(_start,_end);
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
        },
        exportStock () {
        this.$refs.stockTable.exportCsv({
                            filename: '库存明细'
                        });
        },
        viewstation () {
            this.$router.push({
                                name: 'stationdetail',
                            });
        }

    },
    created () {
        this.getData();
        this.inquiryStock();
    }
};
</script>
