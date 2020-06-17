<style lang="less">
    @import '../../styles/common.less';
</style>

<template>
    <div>
        <Row class="margin-top-10">
            <Col span="24">
                <Card>
                    <p slot="title">
                         提货记录
                    </p>
                    <Row>
                    <RadioGroup v-model="dateSearchType" @on-change="xuanze1">
                        <Radio label="1">今日</Radio>
                        <Radio label="2">昨日</Radio>
                        <Radio label="3">最近七日</Radio>
                        <Radio label="4" disabled>自定义时间段</Radio>
                            <DatePicker v-model="customsj" @click.native="xuanze" type="daterange" placement="bottom-end" placeholder="订单日期" style="width: 200px"></DatePicker>
                        <Input v-model="searchOrdername" @click.native="handleSearch" placeholder="姓名" style="width: 120px" />
                        <Select clearable v-model="searchOrderType" placeholder="提货状态" style="width: 120px"  @click.native="handleSearch1">
                            <Option value="已发货">已发货</Option>
                            <Option value="未发货">未发货</Option>
                        </Select>
                        <Button  type="success" @click="searchMember()">查询</Button>
                    </RadioGroup>
                    <div class="f_r">
                        <Button :loading="loadingdc" icon="document-text" type="warning" @click="exportDelivery()">导出</Button>
                    </div>
                    </Row>
                    <Row class="margin-top-10">
                        <Col span="24">
                            <div>
                                <Table :columns="deliveryColumn" :data="deliveryData" border stripe ref="deliveryTable" :loading="loading"></Table>
                            </div>
                        </Col>
                    </Row>
                    <Row class="margin-top-10">
                        <Col span="18">
                        <Page ref="deliverypage" :total="total" size="small" :pageSize="pageSize" @on-change="changepage" show-total show-elevator>
                        </Page>
                        </Col>
                        <Col span="6" class="t_r">
                        提货数量合计
                        <Span style="color:red;">{{totals}}</Span>箱
                        </Col>
                    </Row>
                </Card>
            </Col>
        </Row>
        <Modal title="物流信息" v-model="showCourier">
            <Form  :label-width="90">
                    <FormItem label="物流公司" >
                        <Select clearable style="width:300px" v-model="courierName" placeholder="请选择物流公司" >
                            <Option value="顺丰速运">顺丰速运</Option>
                            <Option value="中国邮政">中国邮政</Option>
                            <Option value="圆通速递">圆通速递</Option>
                            <Option value="中通快递">中通快递</Option>
                            <Option value="申通快递">申通快递</Option>
                            <Option value="宅急送">宅急送</Option>
                            <Option value="联邦物流">联邦物流</Option>
                            <Option value="韵达快递">韵达快递</Option>
                            <Option value="京东快递">京东快递</Option>
                            <Option value="百世快递">百世快递</Option>
                            <Option value="天天快递">天天快递</Option>
                            <Option value="其他快递">其他快递</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="物流单号" >
                        <Input type="text" style="width:300px" v-model="courierNo" placeholder="请输入物流单号" >
                        </Input>
                    </FormItem>
            </Form>
            <div slot="footer">
                            <Button type="text" @click="cancel">取消</Button>
                            <Button type="primary" @click="logisticsok()">提交</Button>
                        </div>
        </Modal>
        <Modal v-model="notemodel" width="400px" ref="rejectModelRef" title="备注信息">
                <Input type="text" v-model="notetxt" style="width:360px"></Input>
            <div slot="footer">
                <Button type="text" @click="cancel">取消</Button>
                <Button type="primary" @click="rejectok()">提交</Button>
            </div>
        </Modal>
        <Table ref="exportTable" style="display:none"></Table>
    </div>
</template>

<script>
export default {
    components: {
        
    },
    data () {
        return {
            notemodel:false,
            notetxt:'',
            loading: true,
            loadingdc:false,
            userDeliveryUuid:'',
            courierName:'',
            deliveryData:[],
            exportData:[],
            customsj:[],
            courierNo:'',
            totals:'',
            userDeliveryUuid:'',
            searchOrdername:'',
            searchOrderType:'',
            dateSearchType:'3',
            showCourier:false,
            totalData:[],
            total:0,
            pageSize:20,
        }
    },
    methods: {
        tablcontent(){
            this.deliveryColumn = [
            //     {
            //     type:'selection',
            //     align:'center',
            //     width:60,
            // },
            {
                title: '申请日期',
                align: 'center',
                key: 'applicationTime',
                width: 140
            },
            {
                title: '会员姓名',
                align: 'center',
                width: 100,
                key: 'userName'
            },
            {
                title: '会员电话',
                align: 'center',
                width: 150,
                key: 'userPersonalPhone'
            },
            {
                title: '数量',
                align: 'center',
                key: 'deliveryQuantity',
                width: 65,
            },
            {
                title: '收货方式',
                align: 'center',
                key: 'deliveryType',
                width: 100,
            },
            {
                title: '邮政编码',
                align: 'center',
                key: 'deliveryPostCode',
                width: 90,
            },
            {
                title: '物流公司',
                align: 'center',
                key: 'courierName',
                width: 90,
            },
            {
                title: '物流编号',
                align: 'center',
                key: 'courierNo',
                width: 150,
            },
            {
                title: '提货地址',
                align: 'center',
                width:280,
                key: 'deliveryAddress'
            },
            {
                title: '收件人',
                align: 'center',
                width:100,
                key: 'deliveryName'
            },
            {
                title: '联系电话',
                align: 'center',
                width:130,
                key: 'deliveryContactNo'
            },
            {
                title: '所属驿站',
                align: 'center',
                width:240,
                key: 'merchantName'
            },
            {
                title: '状态',
                align: 'center',
                width: 90,
                key: 'deliveryStatus'
            },
            {
                title: '发货日期',
                align: 'center',
                key: 'deliveryTime',
                width: 150,
            },
             {
                title: '备注',
                align: 'center',
                key: 'memo',
                width: 280,
            },
            {
                title: '操作',
                align: 'center',
                width:180,
                render: (h, params) => {
                    var deliveryType = params.row.deliveryType;
                    return h('div', [
                        h('Button',{
                            props: {
                                type: 'primary',
                                size: 'small',
                                // disabled:params.row.deliveryType==="邮寄"?false:true
                            },
                            style: {
                                margin: '0 5px 0 0',
                                display:(params.row.deliveryStatus === '未发货'&&params.row.deliveryType ==='邮寄')?'inline-block':'none'
                            },
                            on: {
                                click: (event) => {
                                    this.viewcourier(params.row);
                                }
                            }
                        },'发货'),
                        h('Button',{
                            props: {
                                type: 'primary',
                                size: 'small',
                            },
                            style: {
                                margin: '0 5px 0 0',
                                display:(params.row.deliveryStatus === '已发货'&&params.row.deliveryType ==='邮寄')?'inline-block':'none'
                            },
                            on: {
                                click: (event) => {
                                    this.viewcourier(params.row);
                                }
                            }
                        },'修改'),
                        h('Poptip',{
                            props: {
                                confirm: true,
                                title: '您确定客户已收到货物么?',
                                transfer: true
                            },
                            on: {
                                'on-ok': () => {
                                    
                                }
                            }
                        },[
                            h('Button',{
                            props: {
                                type: 'primary',
                                size: 'small',
                                disabled:(params.row.deliveryType === '自提')?true:false
                            },
                            style: {
                                margin: '0 5px 0 0',
                                display:(params.row.deliveryType === '自提')?'inline-block':'none'
                            },
                        },'自提'),
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
                        // h('Poptip',{
                        //     props: {
                        //         confirm: true,
                        //         title: '您确定要标记为已发货状态吗?',
                        //         transfer: true
                        //     },
                        //     on: {
                        //         'on-ok': () => {
                        //             this.confirmpayment(params.row);
                        //         }
                        //     }
                        // },[
                        //     h('Button',{
                        //     props: {
                        //         type: 'success',
                        //         size: 'small',
                        //         disabled: params.row.deliveryStatus==='已发货'?true:false
                        //     },
                        //     style: {
                        //         margin: '0 5px 0 0'
                        //     },
                        // },'标记发货')
                        // ]),
                    ])
                }
            }
            ]
        },
        cancel(){
                this.showCourier=false;
                this.notemodel = false;
        },
        note(row){
            this.notemodel = true;
            this.userDeliveryUuid = row.userDeliveryUuid;
        },
        getData () {
            this.inquiryMember(0, this.pageSize);
        },
        exportDelivery(){
            let searchOptions = {
                startIndex:0,
                pageSize: 10000
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
                keyArray.push('APPLICATIONDATE');
                searchOptions.applicationDateStart = startDate;
                searchOptions.applicationDateEnd = endDate;
            }
            //姓名
            if (this.searchOrdername) {
              keyArray.push('NAME');
              searchOptions.name = this.searchOrdername;
            }
            //提货状态
            if (this.searchOrderType) {
              keyArray.push('DELIVERYSTATUS');
              searchOptions.deliveryStatus = this.searchOrderType;
            }
            searchOptions.keyArray = keyArray;
            this.loadingdc = true;
            this.$http.post("/admin/searchUserDelivery", this.common.request(searchOptions))  
            .then(response => {
                if(response.data.body.status.statusCode==0){
                    var data = response.data.body.data;
                    this.exportData = data.deliveryList;
                    this.$refs.exportTable.exportCsv({
                            filename: '提货记录',
                            columns:this.deliveryColumn,
                            data:this.exportData,
                        });
                    this.loadingdc = false;
                }else{
                    this.loadingdc = false;
                    this.$Message.error(response.data.body.status.errorDesc);
                }
            }, response => {  
                this.loadingdc = false;
                this.$Message.error(response.data.body.status.errorDesc);
                this.loading = false;
            })
        },
        rejectok(){
            this.notemodel = false;
            let logistics = {
                    'actionType':'COMMENT',
                    'memo':this.notetxt,
                    'userDeliveryUuid':this.userDeliveryUuid,
            }
            this.$http.post("/admin/changeUserDelivery", this.common.request(logistics))  
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
        logisticsok(){
            if (this.courierName === ''||this.courierNo === '') {
                 this.$Message.error('请填写物流信息');
            }else{this.showCourier = false;
            let logistics = {
                    'actionType':'COURIER',
                    'userDeliveryUuid':this.userDeliveryUuid,
                    'courierName':this.courierName,
                    'courierNo':this.courierNo
            }
            this.$http.post("/admin/changeUserDelivery", this.common.request(logistics))  
            .then(response => {
                this.loading = false;
                if(response.data.body.status.statusCode==0){
                    var data = response.data.body.data;
                    this.sendDelivery();
                }else{
                    this.$Message.error(response.data.body.status.errorDesc);
                }
            }, response => {  
                this.$Message.error(response.data.body.status.errorDesc);
                this.loading = false;
            })
            }
        },
        sendDelivery(){
            let logistics = {
                    'actionType':'SEND',
                    'userDeliveryUuid':this.userDeliveryUuid
            }
            this.$http.post("/admin/changeUserDelivery", this.common.request(logistics))  
            .then(response => {
                this.loading = false;
                if(response.data.body.status.statusCode==0){
                    var data = response.data.body.data;
                    this.$Notice.success({
                            title: '操作成功',
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
        handleSearch(){
                this.dateSearchType=null;
                this.customsj = null;
                this.searchOrderType = null;
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
            this.searchOrdername = null
        },
        xuanze1(){
            this.searchOrdername = null;
            this.customsj = null;
            this.searchOrderType = null;
        },
        xuanze(){
            this.dateSearchType="4";
            this.searchOrderType = null;
            this.searchOrdername = null;
        },
        searchMember(){
            this.inquiryMember(0, this.pageSize);
            this.resetpage();
        },
        resetpage(){
            this.$nextTick(function(){
                this.$refs['deliverypage'].currentPage = 1;
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
                keyArray.push('APPLICATIONDATE');
                searchOptions.applicationDateStart = startDate;
                searchOptions.applicationDateEnd = endDate;
            }
            //姓名
            if (this.searchOrdername) {
              keyArray.push('NAME');
              searchOptions.name = this.searchOrdername;
            }
            //提货状态
            if (this.searchOrderType) {
              keyArray.push('DELIVERYSTATUS');
              searchOptions.deliveryStatus = this.searchOrderType;
            }
            searchOptions.keyArray = keyArray;
            this.$http.post("/admin/searchUserDelivery", this.common.request(searchOptions))  
            .then(response => {
                this.loading = false;
                if(response.data.body.status.statusCode==0){
                    this.totals = 0;
                    var data = response.data.body.data;
                    this.deliveryData = data.deliveryList;
                    this.total = data.total;
                    this.deliveryData.forEach((temm,index) =>{
                        this.totals = this.totals + temm.deliveryQuantity;
                    })
                }else{
                    this.$Message.error(response.data.body.status.errorDesc);
                }
            }, response => {  
                this.$Message.error(response.data.body.status.errorDesc);
                this.loading = false;
            })
        },
        changepage(index){
            var startIndex = (index - 1) * this.pageSize;
            this.inquiryMember(startIndex, this.pageSize);
        },
        viewcourier (row) {
            this.showCourier = true;
            this.userDeliveryUuid = row.userDeliveryUuid;
        },
        // vieworder (row) {
        //     this.$router.push({
        //                         name: 'orderdetail',
        //                         query:{userUuid: row.userDTO.userUuid}
        //                     });
        // },
        confirmpayment () {
            
        },
        exportOrder () {
            this.$refs.orderTable.exportCsv({
                        filename: '提货申请'
                    });
        },
    },
    created () {
        this.getData();
        this.tablcontent();
    }
};
</script>
