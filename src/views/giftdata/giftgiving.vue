<style lang="less">
    @import '../../styles/common.less';
</style>

<template>
    <div>
        <Row class="margin-top-10">
            <Col span="24">
                <Card>
                    <p slot="title">
                         赠送列表
                    </p>
                    <Row>                        
                    <RadioGroup v-model="dateSearchType" @on-change="xuanze1">
                        <Radio label="1">今日</Radio>
                        <Radio label="2">昨日</Radio>
                        <Radio label="3">最近七日</Radio>
                        <Radio label="4" disabled>自定义时间段</Radio>
                            <DatePicker v-model="customsj" @click.native="xuanze" type="daterange" placement="bottom-end" placeholder="赠送日期" style="width: 200px"></DatePicker>
                        <Input v-model="searchname" @click.native="handlename" placeholder="姓名" style="width: 120px" />
                        <Input v-model="searchphone" @click.native="handlephone" placeholder="电话号码" style="width: 120px" />
                        <Button  type="success" @click="searchData()">查询</Button>
                    </RadioGroup>
                    <div class="f_r">
                        <Button icon="document-text" type="warning" @click="exportOrder()">导出</Button>
                    </div>
                    </Row>
                    <Row class="margin-top-10">
                        <Col span="24">
                            <div>
                                <Table :columns="orderColumn" :loading="loading" :data="receiveListData" border stripe ref="orderTable" ></Table>
                            </div>
                        </Col>
                    </Row>
                    <Row class="margin-top-10">
                        <Col span="18">
                        <Page ref="orderpage" :total="total" size="small" :pageSize="pageSize" @on-change="changepage" show-total show-elevator>
                        </Page>
                        </Col>
                        <Col span="6" class="t_r">
                        订单合计
                        <Icon type="social-yen" style="margin-left:20px"></Icon>
                        <Span style="color:red;">{{totalamount}}</Span>
                        </Col>
                    </Row>
                </Card>
            </Col>
        </Row>
        <Modal v-model="picturemodel" width="400px" ref="rejectModelRef" title="查看大图">
               <img :src="pictureurl" style="width:360px">
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
            totalamount:'',
            notemodel:false,
            orderNo:'',
            dateSearchType:'3',
            customsj:[],
            notetxt:'',
            picturemodel:false,
            searchname:'',
            searchphone:'',
            loading: true,
            pictureurl:'',
            viewRow: {},
            examine:'',
            showReceipt:false,
            receiveLists:[],
            images:[],
            orderColumn : [
            {
                title: '赠送时间',
                align: 'center',
                key: 'sendDate',
                width: 200
            },
            {
                title: '赠送人姓名',
                align: 'center',
                width: 140,
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
                title: '赠送人手机号',
                align: 'center',
                width: 130,
                key:'userPersonalPhone',
            },
            {
                title: '会员等级',
                width: 150,
                align: 'center',
                key:'userLevelName'
            },
            {
                title: '受赠人姓名',
                align: 'center',
                width: 140,
                key:'sendName'
            },
            {
                title: '受赠人手机号',
                align: 'center',
                key: 'sendMobileNo',
                width: 150,
            },
            {
                title: '兑换状态',
                align: 'center',
                key: 'returned',
                width: 140,
                render: (h, params) => {
                    let returned = params.row.returned;
                    let examine = '';
                    let color = '';
                    if (returned == false) {
                        examine = '未兑换';
                        color = 'green';
                    }
                    if(returned == true){
                        examine = '已兑换';
                        color = 'gray';
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
                title: '相关图片',
                align: 'center',
                width: 400,
                render: (h, params) => {
                    if (params.row.sendImage1) {
                        return h('div', [
                            h('Img',{
                                attrs:{
                                    src: params.row.sendImage1,
                                    width:"25%",
                                    height:"25%"
                                },
                                style:{
                                    paddingTop:"5px"
                                },
                                on: {
                                    click: (event) => {
                                        this.picture(params.row);
                                    }
                                }
                            })
                        ]);
                    }
                    if (params.row.sendImage2) {
                        return h('div', [
                            h('Img',{
                                attrs:{
                                    src: params.row.sendImage2,
                                    width:"25%",
                                    height:"25%"
                                },
                                style:{
                                    paddingTop:"5px"
                                }
                            })
                        ]);
                    }
                    if (params.row.sendImage3) {
                        return h('div', [
                            h('Img',{
                                attrs:{
                                    src: params.row.sendImage3,
                                    width:"25%",
                                    height:"25%"
                                },
                                style:{
                                    paddingTop:"5px"
                                }
                            })
                        ]);
                    }
                },
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
        },
        note(row){
            this.notemodel = true;
            this.orderNo = row.orderNo;
        },
        cancel(){
            this.notemodel = false;
        },
        handlename(){
                this.dateSearchType=null;
                this.customsj = null;
        },
        handlephone(){
                this.dateSearchType=null;
                this.customsj = null;
        },
        xuanze(){
            this.searchname = null;
            this.searchphone = null;
            this.dateSearchType="4";
        },
        getData () {
            this.inquiryMember(0, this.pageSize);
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
        picture(row){
            var sendImage = '';
            if (row.sendImage1) {
                sendImage = row.sendImage1;
            }else if (row.sendImage2) {
                sendImage = row.sendImage2;
            } else if (row.sendImage3) {
                sendImage = row.sendImage3;
            }
            
            this.pictureurl = sendImage
            this.picturemodel = true;
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
                keyArray.push('SENDDATE');
                searchOptions.sendDateStart = startDate;
                searchOptions.sendDateEnd = endDate;
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
            searchOptions.keyArray = keyArray;
            this.$http.post("/admin/searchUserGiftSend", this.common.request(searchOptions))  
            .then(response => {
                this.loading = false;
                if(response.data.body.status.statusCode==0){
                    this.totalamount = 0;
                    var data = response.data.body.data;
                    this.receiveListData = data.sendList;
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
        viewreceipt (row) {
            this.showReceipt = true;
            this.images = row.images
        },
        viewmember (row) {
            this.$router.push({
                                name: 'memberdetail',
                                query:{userUuid: row.userDTO.userUuid}
                            });
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
        exportOrder(){
            this.loadingdc = true;
            let searchOptions = {
                startIndex:0,
                pageSize: 99999,
            };
            this.$http.post("/admin/searchUserGiftSend", this.common.request(searchOptions))  
            .then(response => {
                this.loading = false;
                if(response.data.body.status.statusCode==0){
                    var data = response.data.body.data;
                    var sendList = data.sendList;
                    sendList.forEach((ar,indx) => {
                        var returned = ar.returned;
                        if (returned == true) {
                            sendList[indx].returned = "已兑换"
                        }else{
                            sendList[indx].returned = "未兑换"
                        }
                    });
                    var orderColumn = [];
                    this.orderColumn.forEach((adr,index) =>{
                        if (index<7) {
                            orderColumn.push(adr)
                        }
                    })
                    var userList= ['赠送记录',orderColumn,sendList]
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
        confirmpayment (row) {
            var options={
                'orderNo':row.orderNo
            }
            this.$http.post("/admin/completeOrder", this.common.request(options))
			.then(response => {
				if(response.data.body.status.statusCode == 0) {
					var data = response.data.body.data;
					this.$Notice.success({
                            title: '成功',
                            desc: '订单已确认',
                            duration: 2
                        });
                        this.getData();
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
    },
    created () {
        this.getData();
    }
};
</script>
