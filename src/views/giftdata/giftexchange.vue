<style lang="less">
    @import '../../styles/common.less';
</style>

<template>
    <div>
        <Row class="margin-top-10">
            <Col span="24">
                <Card>
                    <p slot="title">
                         兑换列表
                    </p>
                    <Row>                        
                    <RadioGroup v-model="dateSearchType" @on-change="xuanze1">
                        <Radio label="1">今日</Radio>
                        <Radio label="2">昨日</Radio>
                        <Radio label="3">最近七日</Radio>
                        <Radio label="4" disabled>自定义时间段</Radio>
                            <DatePicker v-model="customsj" @click.native="xuanze" type="daterange" placement="bottom-end" placeholder="兑换日期" style="width: 200px"></DatePicker>
                        <Select clearable v-model="searchyz" style="width:220px" placeholder="选择驿站" @click.native="handleSearch1">
                            <Option v-for="(item,index) in merchants" :value="item.merchantAddress" :key="item.merchantAddress" @click.native="dkuuid(index)"></Option>
                        </Select>
                        <Input v-model="searchname" @click.native="handlename" placeholder="姓名" style="width: 120px" />
                        <Input v-model="searchphone" @click.native="handlephone" placeholder="电话号码" style="width: 120px" />
                        <Button  type="success" @click="searchData()">查询</Button>
                    </RadioGroup>
                    <div class="f_r">
                        <Button icon="document-text" type="warning" @click="exportOrder()" :loading="loadingdc">导出</Button>
                    </div>
                    </Row>
                    <Row class="margin-top-10">
                        <Col span="24">
                            <div>
                                <Table :columns="orderColumn" :loading="loading" :data="receiveListData" border stripe ref="orderTable"></Table>
                            </div>
                        </Col>
                    </Row>
                    <Row class="margin-top-10">
                        <Col span="18">
                        <Page ref="orderpage" :total="total" size="small" :pageSize="pageSize" @on-change="changepage" show-total show-elevator>
                        </Page>
                        </Col>
                    </Row>
                </Card>
            </Col>
        </Row>
        <Modal v-model="notemodel" width="400px" ref="rejectModelRef" title="备注信息">
               
        </Modal>
        <Table ref="deliveryTable" style="display:none"></Table>
    </div>
</template>

<script>
export default {
    components: {
        
    },
    data () {
        return {
            notemodel:false,
            orderNo:'',
            dateSearchType:'3',
            customsj:[],
            loadingdc:false,
            merchants:{},
            receiveLists:[],
            notetxt:'',
            searchname:'',
            searchyz:'',
            merchantUuid:'',
            searchphone:'',
            loading: true,
            viewRow: {},
            showReceipt:false,
            images:[],
            orderColumn : [
            {
                title: '兑换时间',
                align: 'center',
                key: 'returnDate',
                width: 160,
            },
            {
                title: '会员等级',
                align: 'center',
                width: 140,
                key:'userLevelName'
            },
            {
                title: '兑换人姓名',
                align: 'center',
                width: 160,
                key:'userName',
                render: (h, params) => {
                    return h('div', [
                        h('a',{
                            on: {
                                click: (event) => {
                                    this.viewmember(params.row);
                                }
                            }
                        },params.row.userDTO.name)
                    ])
                }
            },
            {
                title: '兑换人手机号',
                align: 'center',
                width: 160,
                key:'userPersonalPhone'
            },
            {
                title: '兑换驿站',
                width: 450,
                align: 'center',
                key:'merchantAddress',
                render: (h, params) => {
                    return h('div', [
                        h('a',{
                            on: {
                                click: (event) => {
                                    this.yzmember(params.row);
                                }
                            }
                        },params.row.returnMerchant.merchantAddress)
                    ])
                }
            },
            {
                title: '兑换人次',
                width: 140,
                align: 'center',
                 key:'returnQuantity'
            },
            // {
            //     title: '操作',
            //     align: 'center',
            //     width:200,
            //     render: (h, params) => {
            //         return h('div', [
            //             h('Button',{
            //                 props: {
            //                     type: 'warning',
            //                     size: 'small',
            //                 },
            //                 style: {
            //                     margin: '0 5px 0 0'
            //                 },
            //                 on: {
            //                     click: (event) => {
            //                         this.note(params.row);
            //                     }
            //                 }
            //             },'备注'),
            //             h('Poptip',{
            //                 props: {
            //                     confirm: true,
            //                     title: '您确定已收到该订单款项吗?',
            //                     transfer: true
            //                 },
            //                 on: {
            //                     'on-ok': () => {
            //                         this.confirmpayment(params.row);
            //                     }
            //                 }
            //             },[
            //                 h('Button',{
            //                 props: {
            //                     type: 'success',
            //                     size: 'small',
            //                     disabled: params.row.orderStatus === '1'?true:false
            //                 },
            //                 style: {
            //                     margin: '0 5px 0 0'
            //                 },
            //             },'确认收款')
            //             ]),
            //         ])
            //     }
                // }
            ],
            totalData:[],
            receiveListData:[],
            total:0,
            pageSize:8,
        }
    },
    methods: {
        xuanze1(){
            this.searchname = null;
            this.searchphone = null;
            this.searchyz = null;
            this.customsj = null;
        },
        note(row){
            this.notemodel = true;
            this.orderNo = row.orderNo;
        },
        cancel(){
            this.notemodel = false;
        },
        handleSearch1(){
            this.searchname = null;
            this.searchphone = null;
            this.dateSearchType=null;
            this.customsj = null;
        },
        handlename(){
                this.dateSearchType=null;
                this.searchphone = null;
                this.customsj = null;
                this.searchyz = null;   
        },
        handlephone(){
                this.dateSearchType=null;
                this.searchname = null;
                this.customsj = null;
                this.searchyz = null;
        },
        xuanze(){
            this.searchname = null;
            this.searchphone = null;
            this.dateSearchType="4";
            this.searchyz = null;
        },
        dkuuid(index){
            this.merchantUuid = this.merchants[index].merchantUuid;
        },
        getData () {
            this.inquiryMember(0, this.pageSize);
        },
        inquiryMerchant(){
            let searchOptions = {
                
            };
            this.$http.post("/admin/searchMerchant", this.common.request(searchOptions))  
            .then(response => {  
                if(response.data.body.status.statusCode==0){
                    this.ledgerBalance = 0;
                    var data = response.data.body.data;
                    this.merchants = data.merchants;
                }else{
                    this.$Message.error(response.data.body.status.errorDesc);
                }
            }, response => {
                this.$Message.error(response.data.body.status.errorDesc);
            })
        },
        searchData(){
            this.inquiryMember(0, this.pageSize);
            this.resetpage();
        },
        resetpage(){
            this.$nextTick(function(){
                this.$refs['orderpage'].currentPage = 1;
            })
        },
        // rejectok(){
        //     this.notemodel = false;
        //     let logistics = {
        //             'orderNo':this.orderNo,
        //             'memo':this.notetxt
        //     }
        //     this.$http.post("/admin/commentOrder", this.common.request(logistics))  
        //     .then(response => {
        //         this.loading = false;
        //         if(response.data.body.status.statusCode==0){
        //             var data = response.data.body.data;
        //             this.$Notice.success({
        //                     title: '备注信息已添加或更改',
        //                     duration: 2
        //                 });
        //             this.getData();
        //         }else{
        //             this.$Message.error(response.data.body.status.errorDesc);
        //         }
        //     }, response => {  
        //         this.$Message.error(response.data.body.status.errorDesc);
        //         this.loading = false;
        //     })
        // },
        inquiryMember(startIndex, pageSize){
            this.loading = true;
            let searchOptions = {
                startIndex:startIndex,
                pageSize: pageSize
            };
            let keyArray = [];
            //选择日期
            if (this.dateSearchType) {
                let dateType = this.dateSearchType;
                let startDate = null;
                let endDate = null;
                let currentDate = new Date();
                if(dateType == '1') {
                    startDate =currentDate;
                    endDate = currentDate;
                } else if(dateType == '2') {
                    currentDate.setDate(currentDate.getDate() - 1);
                    startDate =currentDate;
                    endDate = currentDate;
                } else if(dateType == '3') {
                    let tDate = new Date();
                    tDate.setDate(currentDate.getDate() - 7);
                    startDate =tDate;
                    endDate = currentDate;
                } else if(dateType == '4') {
                    let t = this.customsj;
                    let startDateT = t[0];
                    let endDateT = t[1];
                    startDate = startDateT;
                    endDate = endDateT;
                }
                keyArray.push('RETURNDATE');
                searchOptions.returnDateStart = startDate;
                searchOptions.returnDateEnd = endDate;
            }
            //姓名查询
            if (this.searchname) {
              keyArray.push('NAME');
              searchOptions.name = this.searchname;
            }
            //手机号查询
            if (this.searchphone) {
              keyArray.push('PERSONALPHONE');
              searchOptions.personalPhone = this.searchphone;
            }
            //驿站查询
            if (this.searchphone) {
              keyArray.push('MERCHANT');
              searchOptions.merchantUuid = this.merchantUuid;
            }
            searchOptions.keyArray = keyArray;
            this.$http.post("/admin/searchUserGiftReturn", this.common.request(searchOptions))  
            .then(response => {
                this.loading = false;
                if(response.data.body.status.statusCode==0){
                    var data = response.data.body.data;
                    this.receiveListData = data.returnList;
                    this.total = data.total;
                }else{
                    this.$Message.error(response.data.body.status.errorDesc);
                }
            }, response => {  
                this.$Message.error(response.data.body.status.errorDesc);
                this.loading = false;
            })
        },
        //处理分页-页数改变
        changepage(index){
            var startIndex = (index - 1) * this.pageSize;
            this.inquiryMember(startIndex, this.pageSize);
        },
        yzmember(row){
            this.$router.push({
                                name: 'stationdetail',
                                query:{merchantUuid: row.returnMerchant.merchantUuid}
                            });
        },
        viewmember (row) {
            this.$router.push({
                                name: 'memberdetail',
                                query:{userUuid: row.userDTO.userUuid}
                            });
        },
        exportOrder(){
            this.loadingdc = true;
            let searchOptions = {
                startIndex:0,
                pageSize: 99999,
            };
            this.$http.post("/admin/searchUserGiftReturn", this.common.request(searchOptions))  
            .then(response => {
                this.loading = false;
                if(response.data.body.status.statusCode==0){
                    var data = response.data.body.data;
                    var userList= ['兑换记录',this.orderColumn,data.returnList]
                    this.receiveLists = userList;
                    this.dayin();
                }else{
                    this.$Message.error(response.data.body.status.errorDesc);
                }
            }, response => {  
                this.$Message.error(response.data.body.status.errorDesc);
                this.loading = false;
            })
        },
        dayin () {
            var exportData=this.receiveLists;
            this.$refs.deliveryTable.exportCsv({
                            filename: exportData[0],
                            columns:exportData[1],
                            data:exportData[2],
                        });
                        this.loadingdc = false;
        },
    },
    created () {
        this.getData();
        this.inquiryMerchant();
    }
};
</script>
