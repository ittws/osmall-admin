<style lang="less">
    @import '../../styles/common.less';
</style>

<template>
    <div>
        <Row class="margin-top-10">
            <Col span="24">
                <Card class="margin-top-10">
                    <p slot="title">
                         退款申请
                    </p>
                    <RadioGroup v-model="dateSearchType" @on-change="xuanze1">
                        <Radio label="1">今日</Radio>
                        <Radio label="2">昨日</Radio>
                        <Radio label="3">最近七日</Radio>
                        <Radio label="4" disabled>自定义时间段</Radio>
                            <DatePicker v-model="customsj" @click.native="xuanze" type="daterange" placement="bottom-end" placeholder="订单日期" style="width: 200px"></DatePicker>
                        <Select clearable v-model="searchRefundStatus" placeholder="退款状态" style="width: 120px"  @click.native="handleSearch1">
                            <Option value="1">全部</Option>
                            <Option value="2">待处理</Option>
                        </Select>
                        <Button  type="success" @click="searchData()">查询</Button>
                    </RadioGroup>
                    <div class="f_r">
                            <Button icon="document-text" type="warning" @click="exportrefund()" :loading="loadingdc">导出</Button>
                        </div>
                    <Row class="margin-top-10">
                        <Col span="24">
                            <div>
                                <Table :columns="refundColumn" :loading="loading" :data="refundData" border stripe ref="refundTable"></Table>
                                
                            </div>
                        </Col>
                    </Row>
                    <Row class="margin-top-10">
                        <Col span="18">
                        <Page ref="fundpage" :total="total" size="small" :pageSize="pageSize" @on-change="changepage" show-total show-elevator></Page>
                        </Col>
                        <Col span="6" class="t_r">
                            退款合计
                            <Icon type="social-yen" style="margin-left:20px"></Icon>
                            <Span style="color:red;">{{totalamount}}</Span>
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
        <Table ref="deliveryTable" style="display:none"></Table>
    </div>
</template>

<script>
export default {
    data () {
        return {
            notemodel:false,
            notetxt:'',
            totalamount:'',
            loadingdc:false,
            loading: true,
            dateSearchType: '3',
            receiveLists:[],
            customsj:[],
            operation:'',
            searchRefundStatus:'1',
            userRefundApplicationUuid:'',
            refundColumn: [],
            totalData:[],
            refundData: [],
            total:0,
            pageSize:8,
        }
    },
    methods: {
        getData () {
            this.refundColumn = [
            {
                title: '退款会员',
                align: 'center',
                width: 115,
                key:'userName',
                render: (h, params) => {
                    return h('div', [
                        h('a',{
                            on: {
                                click: (event) => {
                                    this.viewmember(params.row);
                                }
                            }
                        },params.row.userName)
                    ])
                }
            },
            {
                title: '退款金额',
                align: 'center',
                key: 'refundAmount',
                width: 120,

            },
            {
                title: '手机号',
                align: 'center',
                key: 'userPersonalPhone',
                width: 130,
            },
            {
                title: '身份证号',
                align: 'center',
                key: 'idCardNo',
                width: 150,

            },
            {
                title: '上级会员',
                align: 'center',
                key: 'supervisorL1Name',
                width: 120,
                render: (h, params) => {
                    return h('div', [
                        h('a',{
                            on: {
                                click: (event) => {
                                    this.viewmember1(params.row);
                                }
                            }
                        },params.row.userDTO.supervisorL1Name)
                    ])
                }
            },
            {
                title: '退款原因',
                align: 'center',
                key: 'refundReason',
                sortable: true,
                width: 150
            },
            {
                title: '报单日期',
                align: 'center',
                key: 'registerDate',
                sortable: true,
                width: 150
            },
            {
                title: '申请日期',
                align: 'center',
                key: 'applicationDate',
                sortable: true,
                width: 150
            },
            {
                title: '审核状态',
                align: 'center',
                width: 150,
                key:'verifyStatus1',
                render: (h, params) => {
                    let verifyStatus = params.row.verifyStatus;
                    let color = '';
                    let verifyStatus1 = '';
                    if(verifyStatus == '0'){
                        verifyStatus1 = '待审核';
                        color = 'green';
                    }else if(verifyStatus == '1'){
                        verifyStatus1 = '已通过';
                        color = 'red';
                    }else if(verifyStatus == '2'){
                        color = 'gray';
                        verifyStatus1 = '未通过'
                    }return h('tag', {
                        props: {
                            color: color,
                            type: 'dot'
                        }
                    }, verifyStatus1)
                }
            },
            // {
            //     title: '打款状态',
            //     align: 'center',
            //     width: 150,
            //     render: (h, params) => {
            //         let verifyDate = params.row.verifyDate;
            //         let color = '';
            //         if(verifyDate === null || verifyDate === ''){
            //             color = 'green';
            //             verifyDate = '待打款'
            //         }else{
            //             if(verifyDate == '0'){
            //                 color = 'green';
            //                 verifyDate = '待打款'
            //             }else if(verifyDate == '1'){
            //                 color = 'red';
            //                 verifyDate = '打款成功'
            //             }else if(verifyDate == '2'){
            //                 color = 'gray';
            //                 verifyDate = '打款失败'
            //             }return h('tag', {
            //                 props: {
            //                     color: color,
            //                     type:'dot'
            //                 }
            //             })
            //         }
            //         return h('tag', {
            //             props: {
            //                 color: color,
            //                 type: 'dot'
            //             }
            //         }, verifyDate)
            //     }
            // },
            {
                title: '备注',
                align: 'center',
                width:280,
                key: 'memo'
            },
            {
                title: '操作',
                align: 'center',
                width:180,
                render: (h, params) => {
                    let operationend = '';
                    let verifyStatus = params.row.verifyStatus;
                    if (verifyStatus === '1') {
                        operationend = '已同意申请'
                    }else if (verifyStatus === '2') {
                        operationend = '已拒绝申请'
                    }
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
                                    size: 'small'
                                },
                                style: {
                                    margin: '0 5px 0 0',
                                    display:(verifyStatus === '0')?"inline-block":'none'
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
                            },
                            style: {
                                margin: '0 5px 0 0',
                                display:(verifyStatus === '0')?"inline-block":'none'
                            },
                        },'拒绝')
                        ]),
                        // h('Poptip',{
                        //     props: {
                        //         confirm: true,
                        //         title: '您确定要进行以下操作?',
                        //         transfer: true
                        //     },
                        //     on: {
                        //         'on-ok': () => {
                        //             this.success(params.row);
                        //         }
                        //     }
                        // },[
                        //     h('Button',{
                        //         props: {
                        //             type: 'success',
                        //             size: 'small'
                        //         },
                        //         style: {
                        //             margin: '0 5px 0 0',
                        //             display:(verifyStatus === '1')?"inline-block":'none'
                        //         },
                        //     },'打款成功')
                        // ]),
                        // h('Poptip',{
                        //     props: {
                        //         confirm: true,
                        //         title: '您确定要进行以下操作?',
                        //         transfer: true
                        //     },
                        //     on: {
                        //         'on-ok': () => {
                        //             this.fail(params.row);
                        //         }
                        //     }
                        // },[
                        //     h('Button',{
                        //         props: {
                        //             type: 'error',
                        //             size: 'small'
                        //         },
                        //         style: {
                        //             margin: '0 5px 0 0',
                        //             display:(params.row.verifyStatus === '1')?"inline-block":'none'
                        //         },
                        //     },'打款失败')
                        // ]),
                        h('Button',{
                            props: {
                                type: 'primary',
                                size: 'small',
                                disabled:true,
                            },
                            style: {
                                margin: '0 5px 0 0',
                                display:(params.row.verifyStatus === '1'||params.row.verifyStatus === '2')?"inline-block":'none'
                            },
                        },operationend),
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
        cancel(){
                this.notemodel = false;
        },
        rejectok(){
            this.notemodel = false;
            let logistics = {
                    'actionType':'COMMENT',
                    'memo':this.notetxt,
                    'userRefundApplicationUuid':this.userRefundApplicationUuid,
            }
            this.$http.post("/admin/changeUserRefundApplication", this.common.request(logistics))  
            .then(response => {
                this.loading = false;
                if(response.data.body.status.statusCode==0){
                    var data = response.data.body.data;
                    this.$Notice.success({
                            title: '备注信息已添加或更改',
                            duration: 2
                        });
                    this.initialData();
                }else{
                    this.$Message.error(response.data.body.status.errorDesc);
                }
            }, response => {  
                this.$Message.error(response.data.body.status.errorDesc);
                this.loading = false;
            })
        },
        note(row){
            this.notemodel = true;
            this.userRefundApplicationUuid = row.userRefundApplicationUuid
        },
        initialData () {
            this.inquiryMember(0, this.pageSize);
        },
        xuanze1(){
                this.customsj=null;
        },
        xuanze(){
            this.dateSearchType = '4';
        },
        operations(row){
            if (this.operation === '1') {
                var searchOptions = {
                        actionType:'APPROVE',
                        'userRefundApplicationUuid':row.userRefundApplicationUuid
                }
            }else if (this.operation === '2') {
                var searchOptions = {
                        actionType:'REJECT',
                        'userRefundApplicationUuid':row.userRefundApplicationUuid
                }
            }
            this.$http.post("/admin/changeUserRefundApplication", this.common.request(searchOptions))
			.then(response => {
				if(response.data.body.status.statusCode == 0) {
					var data = response.data.body.data;
					this.$Notice.success({
                            title: '操作成功',
                            duration: 2
                        });
                       this.inquiryMember();
				} else {
					this.$Notice.success({
						title: '失败',
						desc: 'response.data.body.status.errorDesc',
						duration: 2
					});
                }
			}, response => {
				this.$Message.error('出错了，请稍后重试');
			})
        },
        viewcourier(row){
            this.operation = '1',
            this.operations(row);
        },
        confirmpayment(row){
            this.operation = '2',
            this.operations(row);
        },
        handleSearch1(){
            if (this.dateSearchType === '4') {
                if (this.customsj.length === 0) {
                  this.dateSearchType="3";  
                }
                if (this.customsj.length === 2) {
                    if (this.customsj[0,1] === null||this.customsj[0,1] === '') {
                       this.dateSearchType="3";  
                    }
                }
            }
        },
        searchData(){
            this.inquiryMember(0, this.pageSize);
            this.resetpage();
        },
        resetpage(){
            this.$nextTick(function(){
                this.$refs['fundpage'].currentPage = 1;
            })
        },
        inquiryMember(startIndex, pageSize,isExport){
            if (!isExport) {
                this.loading = true;
            }
            let searchOptions = {
                startIndex:startIndex,
                pageSize: pageSize
            };
            let withdrawStatusArray = [];
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
                keyArray.push('REFUNDDATE');
                searchOptions.refundDateStart = startDate;
                searchOptions.refundDateEnd = endDate;
            }
            //退款状态
            if (this.searchRefundStatus) {
                 keyArray.push('REFUNDSTATUS');
                if (this.searchRefundStatus === '1') {
                    withdrawStatusArray=['0','1','2'];
                    searchOptions.refundStatusArray = withdrawStatusArray;
                }else if (this.searchRefundStatus === '2') {
                    withdrawStatusArray=['0'];
                    searchOptions.refundStatusArray = withdrawStatusArray;
                }
            }
            searchOptions.keyArray = keyArray;
            this.$http.post("/admin/searchUserRefund", this.common.request(searchOptions))  
            .then(response => {
                this.loading = false;
                if(response.data.body.status.statusCode==0){
                    let totalamount = '';
                    var data = response.data.body.data;
                    this.refundData = data.applications;
                    this.refundData.forEach((imte,index) =>{
                        this.totalamount = totalamount+imte.refundAmount
                    })
                    if (isExport) {
                        var refundDatas = data.applications;
                        refundDatas.forEach((ar,indx) => {
                            var verifyStatus = ar.verifyStatus;
                            if (verifyStatus == 0) {
                                refundDatas[indx].supervisorL1Name = ar.userDTO.supervisorL1Name;
                                refundDatas[indx].verifyStatus = "待审核"
                            }else if(verifyStatus==1){
                                refundDatas[indx].supervisorL1Name = ar.userDTO.supervisorL1Name;
                                refundDatas[indx].verifyStatus = "已通过"
                            }else if(verifyStatus==2){
                                refundDatas[indx].supervisorL1Name = ar.userDTO.supervisorL1Name;
                                refundDatas[indx].verifyStatus = "未通过"
                            }
                        });
                        var refundColumn = [];
                        this.refundColumn.forEach((adr,index) =>{
                            if (index<10) {
                                refundColumn.push(adr)
                            }
                        })
                        var userList= ['退款记录',refundColumn,refundDatas]
                        this.receiveLists = userList;
                        this.daochu();
                    }
                    this.total = data.total;
                }else{
                    this.$Message.error(response.data.body.status.errorDesc);
                }
            }, response => {  
                this.$Message.error(response.data.body.status.errorDesc);
                this.loading = false;
            })
        },
        daochu () {
            var exportData=this.receiveLists;
            this.$refs.deliveryTable.exportCsv({
                            filename: exportData[0],
                            columns:exportData[1],
                            data:exportData[2],
                        });
                        this.loadingdc = false;
        },
        viewmember (row) {
            this.$router.push({
                                name: 'memberdetail',
                                query:{userUuid:row.userDTO.userUuid}
                            });
        },
        viewmember1 (row) {
            this.$router.push({
                                name: 'memberdetail',
                                query:{userUuid:row.userDTO.supervisorL1.userUuid}
                            });
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
        exportrefund () {
            this.loadingdc = true;
            this.inquiryMember(0, 99999,true);
        },
    },
    created () {
        this.getData();
        this.initialData();
        this.searchData();
    }
};
</script>
