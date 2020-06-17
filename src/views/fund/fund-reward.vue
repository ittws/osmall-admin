<style lang="less">
    @import '../../styles/common.less';
</style>

<template>
    <div>
        <Row class="margin-top-10">
            <Col span="24">
                <Card class="margin-top-10">
                    <p slot="title">
                         支出明细
                    </p>
                    <RadioGroup v-model="dateSearchType" @on-change="xuanze1">
                        <Radio label="1">今日</Radio>
                        <Radio label="2">昨日</Radio>
                        <Radio label="3">最近七日</Radio>
                        <Radio label="4" disabled>自定义时间段</Radio>
                            <DatePicker v-model="customsj" @click.native="xuanze" type="daterange" placement="bottom-end" placeholder="支出日期" style="width: 200px"></DatePicker>
                        <Select clearable v-model="searchRewardType" placeholder="奖金类型" style="width: 120px" @click.native="handleSearch1">
                            <Option v-for="item in awardTypes" :value="item" :key="item" ></Option>
                        </Select>
                        <Input v-model="deMember"  placeholder="会员名称" style="width: 120px" />
                        <Button  type="success" @click="searchReward()">查询</Button>
                    </RadioGroup>
                    <div class="f_r">
                            <Button :loading="exportLoading" icon="document-text" type="warning" @click="exportReward()">导出</Button>
                        </div>
                    <Row class="margin-top-10">
                        <Col span="24">
                            <div>
                                <Table :columns="incomeColumn" :loading="loading" :data="incomeData" border stripe ref="incomeTable"></Table>
                            </div>
                        </Col>
                    </Row>
                    <Row class="margin-top-10">
                        <Col span="18">
                            <Page ref="fundpage" :total="total" size="small" :pageSize="pageSize" @on-change="changepage" show-total show-elevator></Page>
                        </Col>
                        <Col span="6" class="t_r">
                            奖金合计
                            <Icon type="social-yen" style="margin-left:20px"></Icon>
                            <Span style="color:red;">{{totalTranAmount}}</Span>
                        </Col>
                    </Row>
                    
                </Card>
            </Col>
        </Row>
        <Modal
            v-model="showRewardDetail"
            width="800"
            title="奖金分配明细">
             <Row class="margin-top-10" type="flex" >
                <Col span="4">
                    <a>李华</a>
                </Col>
                <Col span="4">
                    销售奖金(一级)
                </Col>
                <Col span="4">
                    ￥200
                </Col>
            </Row>
            <Row class="margin-top-10" type="flex">
                <Col span="4">
                    <a>张培</a>
                </Col>
                <Col span="4">
                    销售奖金(二级)
                </Col>
                <Col span="4">
                    ￥160
                </Col>
            </Row>
        </Modal>
        <Modal v-model="notemodel" width="400px" ref="rejectModelRef" title="备注信息">
                <Input type="text" v-model="notetxt" style="width:360px"></Input>
            <div slot="footer">
                <Button type="text" @click="cancel">取消</Button>
                <Button type="primary" @click="rejectok()">提交</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
export default {
    data () {
        return {
            notemodel:false,
            notetxt:'',
            deMember:'',
            showRewardDetail:false,
            dateSearchType:'3',
            customsj:[],
            totalamount:'',
            incomeData:[],
            searchRewardType:'',
            awardTypes:[],
            loading: true,
            exportLoading:false,
            totalData:[],
            incomeColumn:[],
            userWithdrawUuid:'',
            total:0,
            totalTranAmount:0,
            pageSize:8,
        }
    },
    methods: {
        Tablecontent(){
            this.incomeColumn = [
            // {
            //     type: 'selection',
            //     align: 'center',
            //     width: 60
            // },
            {
                title: '订单编号',
                align: 'center',
                key: 'transactionCode',
                width: 145,
            },
            {
                title: '日期',
                align: 'center',
                key: 'transactionTime',
                width: 150
            },
            {
                title: '奖金类型',
                align: 'center',
                key: 'transactionType',
                width: 110
            },
            {
                title: '奖金金额',
                align: 'center',
                key: 'transactionAmount',
                width: 120,
            },
            {
                title: '会员名称',
                align: 'center',
                width: 120,
                key: 'userName',
                render: (h, params) => {
                    var row = params.row.userDTO;
                    return h('div', [
                        h('a',{
                            on: {
                                click: (event) => {
                                    this.view(row);
                                }
                            }
                        },row.name)
                    ])
                }
            },
            {
                title: '手机号码',
                align: 'center',
                width: 120,
                key: 'userPersonalPhone',
                render: (h, params) => {
                    var row = params.row.userDTO;
                    return h('div', [
                        h('a',{
                            on: {
                                click: (event) => {
                                    this.view(row);
                                }
                            }
                        },row.personalPhone)
                    ])
                }
            },
            {
                title: '明细',
                align: 'center',
                width:240,
                key: 'transactionDesc'
            },
            {
                title: '备注',
                align: 'center',
                key: 'memo'
            },
            {
                title: '操作',
                align: 'center',
                width:120,
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
                        },'备注'),
                        // h('Button',{
                        //     props: {
                        //         type: 'default',
                        //         size: 'small'
                        //     },
                        //     style: {
                        //         margin: '0 5px 0 0'
                        //     },
                        //     on: {
                        //         click: (event) => {
                        //             this.rewarddetail(params.row);
                        //         }
                        //     }
                        // },'明细'),
                        ])
                }
            }
            ]
        },
        cancel(){
                this.notemodel = false;
        },
        note(row){
            this.notemodel = true;
            this.userAwardUuid = row.userAwardUuid
        },
        rejectok(){
            this.notemodel = false;
            let logistics = {
                    'actionType':'COMMENT',
                    'memo':this.notetxt,
                    'userAwardUuid':this.userAwardUuid,
            }
            this.$http.post("/admin/changeUserAward", this.common.request(logistics))  
            .then(response => {
                this.loading = false;
                if(response.data.body.status.statusCode==0){
                    var data = response.data.body.data;
                    this.$Notice.success({
                            title: '备注信息已添加或更改',
                            duration: 2
                        });
                    this.getData();
                }else{
                    this.$Message.error(response.data.body.status.errorDesc);
                }
            }, response => {  
                this.$Message.error(response.data.body.status.errorDesc);
                this.loading = false;
            })
        },
        xuanze1(){
            this.customsj = null;
            this.deMember =null
        },
        xuanze(){
            this.deMember = null;
            this.dateSearchType="4";
        },
        handleSearch1(){
                if (this.dateSearchType === '4') {
                    if (this.customsj.length === 0) {
                    this.dateSearchType="3";  
                    }
                    if (this.customsj.length === 2) {
                        if (this.customsj[0,1] === null) {
                        this.dateSearchType="3";  
                        }
                    }
            }
            this.deMember = null;
        },
        getData () {
            this.inquiryMember(0, this.pageSize);
        },
        searchReward(){
            this.inquiryMember(0, this.pageSize);
            this.resetpage();
        },
        resetpage(){
            this.$nextTick(function(){
                this.$refs['fundpage'].currentPage = 1;
            })
        },
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
                keyArray.push('AWARDDATE');
                searchOptions.awardDateStart = startDate;
                searchOptions.awardDateEnd = endDate;
            }
            //奖金类型
            if (this.searchRewardType) {
                if (this.searchRewardType === '全部类型') { }else{
                    keyArray.push('TRANSACTIONTYPE');
                    searchOptions.transactionType = this.searchRewardType;
                }
            }
            if (this.deMember) {
                keyArray.push('NAME');
                searchOptions.name = this.deMember;
            }
            searchOptions.keyArray = keyArray;
            this.$http.post("/admin/searchUserAward", this.common.request(searchOptions))  
            .then(response => {
                this.loading = false;
                if(response.data.body.status.statusCode==0){
                    this.totalamount = 0;
                    var data = response.data.body.data;
                    this.incomeData = data.awards;
                    this.total = data.total;
                    this.totalTranAmount = data.totalTranAmount||0;
                }else{
                    this.$Message.error(response.data.body.status.errorDesc);
                }
            }, response => {  
                this.$Message.error(response.data.body.status.errorDesc);
                this.loading = false;
            })
        },
        exportReward(){
            this.exportLoading = true;
            let searchOptions = {
                startIndex:0,
                pageSize: 1000000
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
                keyArray.push('AWARDDATE');
                searchOptions.awardDateStart = startDate;
                searchOptions.awardDateEnd = endDate;
            }
            //奖金类型
            if (this.searchRewardType) {
                if (this.searchRewardType === '全部类型') { }else{
                    keyArray.push('TRANSACTIONTYPE');
                    searchOptions.transactionType = this.searchRewardType;
                }
            }
            if (this.deMember) {
                keyArray.push('NAME');
                searchOptions.name = this.deMember;
            }
            searchOptions.keyArray = keyArray;
            this.$http.post("/admin/searchUserAward", this.common.request(searchOptions))  
            .then(response => {
                this.exportLoading = false;
                if(response.data.body.status.statusCode==0){
                    this.totalamount = 0;
                    var data = response.data.body.data;
                    this.incomeData = data.awards;
                    var exportData=this.exportData;
                    this.$refs.incomeTable.exportCsv({
                                    filename: '奖金支出',
                                    columns:this.incomeColumn,
                                    data:data.awards,
                                });
                }else{
                    this.$Message.error(response.data.body.status.errorDesc);
                }
            }, response => {  
                this.$Message.error(response.data.body.status.errorDesc);
                this.exportLoading = false;
            })
        },
        inquiryMerchant(){
            let searchOptions = {
                
            };
            this.$http.post("/inquiryAwardType ", this.common.request(searchOptions))  
            .then(response => { 
                if(response.data.body.status.statusCode==0){
                    var data = response.data.body.data;
                    this.awardTypes = data.awardTypes;
                    this.awardTypes.push('全部类型')
                }else{
                    this.$Message.error(response.data.body.status.errorDesc);
                }
            }, response => {
                this.$Message.error(response.data.body.status.errorDesc);
            })
        },
        //处理分页-页数改变
        changepage(index){
            var startIndex = (index - 1) * this.pageSize;
            this.inquiryMember(startIndex, this.pageSize);
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
            this.dateSearchType = null;
            this.customsj = null;
            this.searchRewardType = null
        },
        view (row) {
            this.$router.push({
                                name: 'memberdetail',
                                query:{userUuid:row.userUuid}
                            });
        },
        rewarddetail(row) {
            this.showRewardDetail = true;
        }
    },
    created () {
        this.getData();
        this.inquiryMerchant();
        this.Tablecontent();
    }
};
</script>
