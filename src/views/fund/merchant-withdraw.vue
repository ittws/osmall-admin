<style lang="less">
    @import '../../styles/common.less';
</style>

<template>
    <div>
        <Row class="margin-top-10">
            <Col span="24">
                <Card class="margin-top-10">
                    <p slot="title">
                         提现申请
                    </p>
                    <Row>
                        <RadioGroup v-model="dateSearchType" @on-change="xuanze1">
                            <Radio label="1">今日</Radio>
                            <Radio label="2">昨日</Radio>
                            <Radio label="3">最近七日</Radio>
                            <Radio label="4" disabled>自定义时间段</Radio>
                                <DatePicker v-model="customsj" @click.native="xuanze" type="daterange" placement="bottom-end" placeholder="订单日期" style="width: 200px"></DatePicker>
                            <Input type="text" v-model="searchName" placeholder="商家名称" style="width: 100px"></Input>
                            <Select v-model="searchWithdrawStatus" placeholder="提现状态" style="width: 120px" @click.native="handleSearch1">
                                <Option value="1">全部</Option>
                                <Option value="2">未处理</Option>
                            </Select>
                            <Button  type="success" @click="searchMerchantWithdraw()">查询</Button>
                        </RadioGroup>
                        <div class="f_r">
                            <Button :loading="loadingdc" icon="document-text" type="warning" @click="exportWithdraw()">导出</Button>
                        </div>
                    </Row>
                    <Row class="margin-top-10">
                        <Col span="24">
                            <div>
                                <Table :columns="fundColumn" :data="fundData" border stripe ref="fundTable" :loading="loading"></Table>
                                
                            </div>
                        </Col>
                    </Row>
                    <Row class="margin-top-10">
                        <Col span="18">
                        <Page ref="fundpage" :total="total" size="small" :pageSize="pageSize" @on-change="changepage" show-total show-elevator></Page>
                        </Col>
                        <Col span="6" class="t_r">
                            提现合计
                            <Icon type="social-yen" style="margin-left:20px"></Icon>
                            <Span style="color:red;">{{totals1}}</Span>
                        </Col>
                    </Row>
                    
                </Card>
            </Col>
        </Row>
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
            merchantWithdrawUuid:'',
            operation:'',
            loading: true,
            loadingdc: false,
            customsj:[],
            fundColumn: [],
            totalData:[],
            fundData: [],
            dateSearchType:'3',
            searchWithdrawStatus:'1',
            searchName:'',
            totals1:'',
            total:0,
            pageSize:20,
        }
    },
    methods: {
        getData () {
            this.fundColumn = [
            {
                title: '日期',
                align: 'center',
                key: 'withdrawTime',
                sortable: true,
                width: 140
            },
            {
                title: '申请金额',
                align: 'center',
                key: 'withdrawAmount',
                width: 90,
            },
            {
                title: '综合税费',
                align: 'center',
                key: 'taxAmount',
                width: 90,
            },
            {
                title: '实付金额',
                align: 'center',
                key: 'paymentAmount',
                width: 90,
            },
            {
                title: '账户类型',
                align: 'center',
                width: 120,
                key: 'paymentMethodStr',
                render: (h,params) =>{
                    let paymentMethod = params.row.paymentMethod;
                    if (paymentMethod === '1') {
                        paymentMethod = '银行账户'
                    }
                    if (paymentMethod === '2') {
                        paymentMethod = '支付宝'
                    }
                    return h('div',{
                        
                    },paymentMethod)
                }
            },
            {
                title: '提现账户',
                align: 'center',
                key: 'accountNo',
                width: 200
            },
            {
                title: '提现银行',
                align: 'center',
                key: 'bankName',
                width: 200
            },
            {
                title: '提现商家',
                align: 'center',
                width: 200,
                key: 'merchantName',
                render: (h, params) => {
                    return h('div', [
                        h('span',{
                        
                        },params.row.merchantDTO.merchantName)
                    ])
                }
            },
            {
                title: '手机号码',
                align: 'center',
                width: 150,
                key: 'merchantMobileNo',
                render: (h, params) => {
                    return h('div', [
                        h('span',{
                            
                        },params.row.merchantDTO.mobileNo)
                    ])
                }
            },
            {
                title: '审核状态',
                align: 'center',
                width: 130,
                key: 'auditStatus',
                render: (h, params) => {
                    let withdrawStatus = params.row.withdrawStatus;
                    let examine = '';
                    let color = '';
                    if (withdrawStatus == '0') {
                        examine = '待审核';
                        color = 'gray';
                    } else if(withdrawStatus == '1'||withdrawStatus == '3'||withdrawStatus == '4'){
                        examine = '已通过';
                        color = 'green';
                    }else if (withdrawStatus == '2') {
                        examine = '未通过';
                        color = 'red';
                    }    
                    return h('tag', {
                        props: {
                            color : color,
                            type:'dot'
                        }
                    }, examine)
                },
            },
            {
                title: '打款状态',
                align: 'center',
                width: 140,
                key: 'paymentStatus',
                render: (h, params) => {
                    let withdrawStatus = params.row.withdrawStatus;
                    let _money = '';
                    let color = '';
                        if (withdrawStatus == '3') {
                            _money = '提现成功';
                            color = 'green';
                        } else if (withdrawStatus == '4'){
                            _money = '提现失败';
                            color = 'red';
                        }else if (withdrawStatus == '0'||withdrawStatus == '1') {
                            _money = '等待打款';
                            color = 'gray';
                        }if (withdrawStatus == '2') {
                            _money = '已拒绝';
                            color = 'red';
                        }
                        return h('tag', {
                            props: {
                                color: color,
                                type:'dot'
                            }
                        }, _money)
                },
            },
            {
                title: '备注',
                align: 'center',
                width:150,
                key: 'memo'
            },
            {
                title: '操作',
                align: 'center',
                width:350,
                render: (h, params) => {
                    return h('div', [
                        h('Poptip',{
                            props: {
                                confirm: true,
                                title: '您确定执行同意操作?',
                                transfer: true
                            },
                            on: {
                                'on-ok': () => {
                                    this.viewcourier(params.row);
                                }
                            }
                        },[
                            h('Button',{
                                props: {
                                    type: 'success',
                                    size: 'small',
                                    disabled:params.row.withdrawStatus === '0'?false:true
                                },
                                style: {
                                    margin: '0 5px 0 0',
                                },
                            },'同意')
                        ]),
                        h('Poptip',{
                            props: {
                                confirm: true,
                                title: '您确定执行拒绝操作?',
                                transfer: true
                            },
                            on: {
                                'on-ok': () => {
                                    this.confirmpayment(params.row);
                                }
                            }
                        },[
                            h('Button',{
                            props: {
                                type: 'error',
                                size: 'small',
                                disabled:params.row.withdrawStatus === '0'?false:true
                            },
                            style: {
                                margin: '0 5px 0 0',
                            },
                        },'拒绝')
                        ]),
                        h('Poptip',{
                            props: {
                                confirm: true,
                                title: '您确定要进行以下操作?',
                                transfer: true
                            },
                            on: {
                                'on-ok': () => {
                                    this.success(params.row);
                                }
                            }
                        },[
                            h('Button',{
                                props: {
                                    type: 'success',
                                    size: 'small'
                                },
                                style: {
                                    margin: '0 5px 0 0',
                                    display:(params.row.withdrawStatus === '1')?"inline-block":'none'
                                },
                            },'打款成功')
                        ]),
                        h('Poptip',{
                            props: {
                                confirm: true,
                                title: '您确定要进行以下操作?',
                                transfer: true
                            },
                            on: {
                                'on-ok': () => {
                                    this.fail(params.row);
                                }
                            }
                        },[
                            h('Button',{
                                props: {
                                    type: 'error',
                                    size: 'small'
                                },
                                style: {
                                    margin: '0 5px 0 0',
                                    display:(params.row.withdrawStatus === '1')?"inline-block":'none'
                                },
                            },'打款失败')
                        ]),
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
                    ])
                }
            },
            ];
        },
        //条件显示隐藏
        xuanze1(){
            this.customsj = null;
        },
        xuanze(){
            this.dateSearchType="4";
        },
        note(row){
            this.notemodel = true;
            this.merchantWithdrawUuid = row.merchantWithdrawUuid
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
        },
        cancel(){
                this.notemodel = false;
        },
        rejectok(){
            this.notemodel = false;
            let logistics = {
                    'actionType':'COMMENT',
                    'memo':this.notetxt,
                    'merchantWithdrawUuid':this.merchantWithdrawUuid,
            }
            this.$http.post("/admin/changeMerchantWithdraw", this.common.request(logistics))  
            .then(response => {
                this.loading = false;
                if(response.data.body.status.statusCode==0){
                    var data = response.data.body.data;
                    this.$Notice.success({
                            title: '备注信息已添加或更改',
                            duration: 2
                        });
                    this.searchMerchantWithdraw();
                }else{
                    this.$Message.error(response.data.body.status.errorDesc);
                }
            }, response => {  
                this.$Message.error(response.data.body.status.errorDesc);
                this.loading = false;
            })
        },
        //查询
        searchMerchantWithdraw(){
            this.loading = true;
            let searchOptions = {};
            let keyArray = [];
            let withdrawStatusArray = [];
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
                keyArray.push('WITHDRAWDATE');
                searchOptions.withdrawDateStart = startDate;
                searchOptions.withdrawDateEnd = endDate;
            }
            //提货状态
            if (this.searchWithdrawStatus) {
                 keyArray.push('WITHDRAWSTATUS');
                if (this.searchWithdrawStatus === '1') {
                    withdrawStatusArray=['0','1','2','3','4'];
                    searchOptions.withdrawStatusArray = withdrawStatusArray;
                }else if (this.searchWithdrawStatus === '2') {
                    withdrawStatusArray=['0','1'];
                    searchOptions.withdrawStatusArray = withdrawStatusArray;
                }
            }
            //姓名
            if (this.searchName) {
                keyArray.push('NAME');
                searchOptions.name = this.searchName;
            }
            searchOptions.keyArray = keyArray;
            this.$http.post("/admin/searchMerchantWithdraw", this.common.request(searchOptions))  
            .then(response => {
                this.loading = false;
                if(response.data.body.status.statusCode==0){
                    this.totals1 = 0;
                    var data = response.data.body.data;
                    this.withdraws = data.withdraws;
                    this.withdraws.forEach((temm,index) =>{
                        this.totals1 = this.totals1 + temm.withdrawAmount;
                    })
                    this.initPage(this.withdraws);
                }else{
                    this.$Message.error(response.data.body.status.errorDesc);
                }
            }, response => {  
                this.$Message.error(response.data.body.status.errorDesc);
                this.loading = false;
            })
        },
        exportWithdraw(){
            this.loadingdc = true;
            let searchOptions = {};
            let keyArray = [];
            let withdrawStatusArray = [];
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
                keyArray.push('WITHDRAWDATE');
                searchOptions.withdrawDateStart = startDate;
                searchOptions.withdrawDateEnd = endDate;
            }
            //提货状态
            if (this.searchWithdrawStatus) {
                 keyArray.push('WITHDRAWSTATUS');
                if (this.searchWithdrawStatus === '1') {
                    withdrawStatusArray=['0','1','2','3','4'];
                    searchOptions.withdrawStatusArray = withdrawStatusArray;
                }else if (this.searchWithdrawStatus === '2') {
                    withdrawStatusArray=['0','1'];
                    searchOptions.withdrawStatusArray = withdrawStatusArray;
                }
            }
            searchOptions.keyArray = keyArray;
            this.$http.post("/admin/searchMerchantWithdraw", this.common.request(searchOptions))  
            .then(response => {
                this.loadingdc = false;
                if(response.data.body.status.statusCode==0){
                    var data = response.data.body.data;
                    this.exportData = data.withdraws;
                    this.exportData.forEach((item,index) =>{
                        item.accountNo = "\t"+item.accountNo;
                    })
                    this.$refs.fundTable.exportCsv({
                            filename: '提现记录',
                            columns:this.fundColumn,
                            data:this.exportData,
                        });
                }else{
                    this.$Message.error(response.data.body.status.errorDesc);
                }
            }, response => {  
                this.$Message.error(response.data.body.status.errorDesc);
                this.loading = false;
            })
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
                this.fundData = this.totalData.slice(0,this.pageSize);
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
        viewcourier(row){
                this.operation = '1';
                this.operations(row);
        },
        confirmpayment(row){
            this.operation = '2';
            this.operations(row);
        },
        success(row){
            this.operation = '3';
            this.operations(row);
        },
        fail(row){
            this.operation = '4';
            this.operations(row);
        },
        operations(row){
            if (this.operation === '1') {
                var searchOptions = {
                        actionType:'APPROVE',
                        merchantWithdrawUuid:row.merchantWithdrawUuid
                }
            }else if (this.operation === '2') {
                var searchOptions = {
                        actionType:'REJECT',
                        merchantWithdrawUuid:row.merchantWithdrawUuid,
                        rejectReason:''
                }
            }else if (this.operation === '3') {
                var searchOptions = {
                        actionType:'SUCCESS',
                        merchantWithdrawUuid:row.merchantWithdrawUuid
                }
            }else if (this.operation === '4') {
                var searchOptions = {
                        actionType:'FAIL',
                        failReason:'',
                        merchantWithdrawUuid:row.merchantWithdrawUuid
                }
            }
            this.$http.post("/admin/changeMerchantWithdraw", this.common.request(searchOptions))
			.then(response => {
				if(response.data.body.status.statusCode == 0) {
					var data = response.data.body.data;
					this.$Notice.success({
                            title: '操作成功',
                            duration: 2
                        });
                       this.searchMerchantWithdraw();
				} else {
					this.$Notice.success({
						title: '失败',
						desc: response.data.body.status.errorDesc,
						duration: 2
					});
                }
			}, response => {
				this.$Message.error('出错了，请稍后重试');
			})
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
        this.searchMerchantWithdraw();
    }
};
</script>
