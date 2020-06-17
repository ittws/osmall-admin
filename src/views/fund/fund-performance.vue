<style lang="less">
    @import '../../styles/common.less';
</style>

<template>
    <div>
        <Row class="margin-top-10">
            <Col span="24">
                <Card class="margin-top-10">
                    <p slot="title">
                         团队业绩查询
                    </p>
                    <RadioGroup v-model="dateSearchType" @on-change="xuanze1">
                        <Radio label="0">累计</Radio>
                        <Radio label="1">本月</Radio>
                        <Radio label="2">上月</Radio>
                        <Radio label="3">最近半年</Radio>
                        <Radio label="4" disabled>自定义时间段</Radio>
                            <DatePicker v-model="customsj" format="yyyy-MM" @click.native="xuanze" type="daterange" placement="bottom-end" placeholder="业绩日期" style="width: 200px"></DatePicker>
                        <Input v-model="deMember"  placeholder="会员名称" style="width: 120px" />
                        <Button  type="success" @click="searchReward()">查询</Button>
                    </RadioGroup>
                    <div class="f_r">
                            <Button icon="document-text" type="warning" @click="exportPerformance()" :loading="loadingdc">导出</Button>
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
                        <Col span="3">
                            业绩销售额汇总:<font color="#f3423c">{{performanceAmount}}</font>
                        </Col>
                        <Col span="3">
                            业绩奖金汇总:<font color="#f3423c">{{performanceAward}}</font>
                        </Col>
                    </Row>
                    <Table ref="deliveryTable" style="display:none"></Table>
                </Card>
            </Col>
        </Row>
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
            totalData:[],
            incomeColumn:[],
            userWithdrawUuid:'',
            performanceAmount:0,
            performanceAward:0,
            loadingdc:false,
            total:0,
            pageSize:8,
        }
    },
    methods: {
        Tablecontent(){
            this.incomeColumn = [
            {
                title: '会员名称',
                align: 'center',
                width: 200,
                key:'userName'
            },
            {
                title: '手机号码',
                align: 'center',
                width: 200,
                key:'userPersonalPhone'
            },
            {
                title: '业绩销售额',
                align: 'center',
                key: 'totalPerformanceAmount',
                width: 300
            },
            {
                title: '业绩奖金',
                align: 'center',
                key: 'totalPerformanceAward',
                width: 200
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
                currentDate.setDate(1);
                if(dateType == '0') {
                    let tDate = new Date();
                    tDate.setDate(1);
                    tDate.setFullYear(2000);
                    startDate =tDate;
                    endDate = currentDate;
                }
                else if(dateType == '1') {
                    startDate =currentDate;
                    endDate = currentDate;
                } else if(dateType == '2') {
                    currentDate.setMonth(currentDate.getMonth() - 1);
                    startDate =currentDate;
                    endDate = currentDate;
                } else if(dateType == '3') {
                    let tDate = new Date();
                    tDate.setDate(1);
                    tDate.setMonth(currentDate.getMonth() - 6);
                    startDate =tDate;
                    endDate = currentDate;
                } else if(dateType == '4') {
                    let t = this.customsj;
                    let startDateT = t[0];
                    let endDateT = t[1];
                    startDate = startDateT.setDate(1);
                    endDate = endDateT.setDate(1);
                }
                keyArray.push('PERFORMANCEDATE');
                searchOptions.performanceDateStart = startDate;
                searchOptions.performanceDateEnd = endDate;
            }
            if(this.deMember){
                keyArray.push('USERNAME');
                searchOptions.userName = this.deMember;
            }
            searchOptions.keyArray = keyArray;
            this.$http.post("/admin/searchUserTotalPerformance", this.common.request(searchOptions))  
            .then(response => {
                this.loading = false;
                if(response.data.body.status.statusCode==0){
                    var data = response.data.body.data;
                    this.incomeData = data.performances;
                    this.total = data.total;
                    this.performanceAmount = data.performanceAmount;
                    this.performanceAward = data.performanceAward;
                }else{
                    this.$Message.error(response.data.body.status.errorDesc);
                }
            }, response => {  
                this.$Message.error(response.data.body.status.errorDesc);
                this.loading = false;
            })
        },
        exportPerformance(){
            this.loadingdc = true;
            let searchOptions = {
                startIndex:0,
                pageSize: 100000
            };
            let keyArray = [];
            //选择日期
            if (this.dateSearchType) {
                let dateType = this.dateSearchType;
                let startDate = null;
                let endDate = null;
                let currentDate = new Date();
                currentDate.setDate(1);
                if(dateType == '0') {
                    let tDate = new Date();
                    tDate.setDate(1);
                    tDate.setFullYear(2000);
                    startDate =tDate;
                    endDate = currentDate;
                }
                else if(dateType == '1') {
                    startDate =currentDate;
                    endDate = currentDate;
                } else if(dateType == '2') {
                    currentDate.setMonth(currentDate.getMonth() - 1);
                    startDate =currentDate;
                    endDate = currentDate;
                } else if(dateType == '3') {
                    let tDate = new Date();
                    tDate.setDate(1);
                    tDate.setMonth(currentDate.getMonth() - 6);
                    startDate =tDate;
                    endDate = currentDate;
                } else if(dateType == '4') {
                    let t = this.customsj;
                    let startDateT = t[0];
                    let endDateT = t[1];
                    startDate = startDateT.setDate(1);
                    endDate = endDateT.setDate(1);
                }
                keyArray.push('PERFORMANCEDATE');
                searchOptions.performanceDateStart = startDate;
                searchOptions.performanceDateEnd = endDate;
            }
            if(this.deMember){
                keyArray.push('USERNAME');
                searchOptions.userName = this.deMember;
            }
            searchOptions.keyArray = keyArray;
            this.$http.post("/admin/searchUserTotalPerformance", this.common.request(searchOptions))  
            .then(response => {
                this.loadingdc = false;
                if(response.data.body.status.statusCode==0){
                    var data = response.data.body.data;
                    debugger;
                    this.$refs.deliveryTable.exportCsv({
                            filename: '团队业绩',
                            columns:this.incomeColumn,
                            data:data.performances,
                        });
                }else{
                    this.$Message.error(response.data.body.status.errorDesc);
                }
            }, response => {  
                this.loadingdc = true;
                this.$Message.error(response.data.body.status.errorDesc);
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
