<style lang="less">
    @import '../../styles/common.less';
</style>

<template>
    
    <div>
        <Spin size="large" fix v-if="spinShow" class="mask"></Spin>
        <Form  :label-width="90">
            <Card>
                <p slot="title">
                     驿站基础信息
                </p>
                <Row type="flex" justify="start">
                    <Col span="8">
                        <FormItem label="驿站编号:" >{{datas.id}}</FormItem>
                    </Col>
                    <Col span="8">
                        <FormItem label="开站日期:" >
                            {{datas.createDate}}
                        </FormItem>
                    </Col>
                    <Col span="8" >
                        <FormItem label="驿站奖金:">
                            {{datas.awardAmount}}
                        </FormItem>
                    </Col>
                </Row>
                <Row type="flex" justify="start">
                    <Col span="8" >
                        <FormItem label="联系人:">
                            {{datas.contactName}}
                        </FormItem>
                    </Col>
                     <Col span="8">
                        <FormItem label="联系人电话:">
                            {{datas.mobileNo}}
                        </FormItem>
                    </Col>
                    <Col span="8">
                        <FormItem label="联系人身份证:" >
                           
                        </FormItem>
                    </Col>
                    
                </Row>
                <Row type="flex" justify="start">
                      <Col span="8">
                        <FormItem label="联系地址:" >
                            {{datas.merchantAddress}}
                        </FormItem>
                    </Col>                   
                </Row>
            </Card>
            <Card class="margin-top-10">
                <p slot="title">
                     数据概览
                </p>
                <Row type="flex" justify="start">
                    <Col span="4" class="t_c" @click.native="memberlista">
                    <i-circle :percent="100">
                        <span class="demo-Circle-inner" style="font-size:24px">
                            <span style="color: #3f414d;font-weight: normal;">{{datas.userCount}}</span>
                            <p style="color: #657180;font-size:14px;margin: 10px 0 15px;">会员总数</p>
                        </span>
                    </i-circle>
                    </Col>
                    <Col span="4" class="t_c" @click.native="stocklista">
                    <i-circle :percent="100" stroke-color="orange">
                        <span class="demo-Circle-inner" style="font-size:24px">
                            <span style="color: #3f414d;font-weight: normal;">{{merchantInventoryDTO.availableBalance}}</span>
                            <p style="color: #657180;font-size:14px;margin: 10px 0 15px;">当前库存</p>
                        </span>
                    </i-circle>
                    </Col>
                    <Col span="4" class="t_c">
                    <i-circle :percent="100" stroke-color="#5cb85c" @click.native="cashlista">
                        <span class="demo-Circle-inner" style="font-size:24px">
                            <span style="color: #3f414d;font-weight: normal;">{{datas.availableBalance}}</span>
                            <p style="color: #657180;font-size:14px;margin: 10px 0 15px;">可提现余额</p>
                        </span>
                    </i-circle>
                    </Col>
                    <Col span="4" class="t_c">
                    <i-circle :percent="100" stroke-color="#ff5500" @click.native="fundrewarda">
                        <span class="demo-Circle-inner" style="font-size:24px">
                            <span style="color: #3f414d;font-weight: normal;">{{datas.awardAmount}}</span>
                            <p style="color: #657180;font-size:14px;margin: 10px 0 15px;">奖金总金额</p>
                        </span>
                    </i-circle>
                    </Col>
                </Row>
                <Row type="flex" justify="start">
                    <Col span="4" class="t_c">
                    <Button @click="viewSsubordinate" size="small" :loading="loading">会员拓扑图</Button>
                    </Col>
                </Row>
            </Card>
            <Collapse class="margin-top-10" style="background-color:#fff">
                <Panel name="1">
                驿站会员
                <Row slot="content">
                <Col span="24" class="margin-top-10">
                    <Input v-model="searchMemberName" placeholder="姓名" style="width: 100px"  @on-change="conhidi1"/>
                    <Select clearable v-model="Memberships" placeholder="选择会员等级" style="width:100px" @on-change="conhidi0">
                        <Option v-for="item in cityList" :value="item.value" :key="item.value"></Option>
                    </Select>
                    <Input v-model="searchMemberICNo"  placeholder="身份证号码" style="width: 150px" @on-change="conhidi2"/>
                    <Input v-model="searchMemberMobileNo"  placeholder="手机号码" style="width: 120px" @on-change="conhidi3"/>
                    <DatePicker type="daterange" v-model="searchRegisterDate" @click.native="conhidi4" placement="bottom-end" placeholder="注册日期" style="width: 200px"></DatePicker>
                <Button  type="success" @click="searchMember()">查询</Button>
                <Button icon="document-text" type="warning" @click="allMember()" :loading="loadingdc">导出会员</Button>
                </Col>
                    <Col span="24" class="margin-top-10">
                        <div>
                            <Table :columns="memberColumn" :data="userList" border stripe ref="memberTable" :loading="loading1" @on-row-dblclick="view"></Table>
                        </div>
                        <Row class="margin-top-10">
                            <Page ref="Memberpage" :total="total1" size="small" :pageSize="pageSize1" @on-change="changepages" show-total show-elevator>
                            </Page>
                        </Row>
                    </Col>
                </Row>
                <Table ref="deliveryTable" style="display:none"></Table>
                </Panel>
            </Collapse>
            <Collapse class="margin-top-10" style="background-color:#fff">
                <Panel name="2">
                库存明细
                <Row class="margin-top-10" slot="content">
                    <Col span="24">
                        <div>
                            <Table :columns="inventoryColumn" :data="inventoryHistoryListData" border stripe ref="inventoryTable"></Table>
                        </div>
                    </Col>
                    
                </Row>
                <Row class="margin-top-10" slot="content">
                    <Page ref="memberpage" :total="total" size="small" :pageSize="pageSize" @on-change="changepage" show-total show-elevator></Page>
                </Row>
                </Panel>
            </Collapse>
            <Collapse  class="margin-top-10" style="background-color:#fff">
                <Panel name="2">
                驿站订单
                <Row class="margin-top-10" slot="content">
                    <Col span="24">
                        <div>
                            <Table :columns="orderColumn" height="300" :data="orderList" border stripe ref="orderTable"></Table>
                        </div>
                    </Col>
                </Row>
                </Panel>
            </Collapse>
            <Collapse  class="margin-top-10" style="background-color:#fff">
                <Panel name="3">
                提货处理
                <Row class="margin-top-10" slot="content">
                    <Col span="24">
                        <div>
                            <Table :columns="deliveryColumn" height="300" :data="deliveryList" border stripe ref="deliveryTable"></Table>
                        </div>
                    </Col>
                </Row>
                </Panel>
            </Collapse>
            <Collapse  class="margin-top-10" style="background-color:#fff">
                <Panel name="4">
                奖金明细
                <Row class="margin-top-10" slot="content">
                    <Col span="24">
                        <div>
                            <Table :columns="incomeColumn" height="300" :data="awardList" border stripe ref="incomeTable"></Table>
                        </div>
                    </Col>
                </Row>
                </Panel>
            </Collapse>
            <Collapse class="margin-top-10" style="background-color:#fff">
                <Panel name="5">
                提现记录
                <Row class="margin-top-10" slot="content">
                    <Col span="24">
                        <div>
                            <Table :columns="withdrawColumn" height="300" :data="withdrawList" border stripe ref="withdrawTable"></Table>
                        </div>
                    </Col>
                </Row>
                </Panel>
            </Collapse>
        </Form>
   
        <Modal
            v-model="showSubordinate"
            width="800"
            title="会员拓扑图">
             <Tree :data="supervisor" :load-data="loadSuperiorData"></Tree>

        </Modal>
     </div>               
</template>

<script>
export default {
    data () {
        return {
            loadingdc:false,
            cityList:[
                {
                    value: '普通会员',
                    label: '1'
                },
                {
                    value: '事业合伙人',
                    label: '2'
                },
                {
                    value: '高级合伙人',
                    label: '3'
                }
            ],
            Memberships:'',
            exportData:[],
            datas:[],
            orderList:[],
            userList:[],
            total:0,
            pageSize:6,
            total1:0,
            pageSize1:6,
            supervisors:[],
            Initializethe:false,
            searchMemberName:'',
            searchIdCardNo:'',
            searchPersonalPhone:'',
            searchRegisterDate:'',
            searchMemberMobileNo:'',
            loading1:false,
            searchMemberICNo:'',
            inventoryHistoryList:[],
            withdrawList:[],
            deliveryList:[],
            awardList:[],
            loading:false,
            def:'',
            inventoryHistoryListData:[],
            merchantInventoryDTO:[],
            showSubordinate:false,
            supervisor:[],
            spinShow:true,
        }
    },
    methods: {
        Dataini(){
            this.memberColumn1 = [
            {
                title: '会员编号',
                key: 'id',
            },
            {
                title: '姓名',
                key: 'name',
            },
            {
                title: '会员等级',
                key: 'userLevelName',
            },
            {
                title: '手机号码',
                key: 'personalPhone',
            },
            {
                title: '身份证号码',
                key: 'idCardNo',
            },
            {
                title: '邀请人',
                key:'supervisorL1Name'
            },
            {
                title: '直接辅导人',
                key:'supervisorL2Name'
            },
            {
                title: '间接辅导人',
                key:'supervisorL3Name'
            },
            {
                title: '注册日期',
                key: 'registerDate',
            },
            {
                title: '可提现余额',
                key:'availableBalance'
            },
            {
                title: '库存(箱)',
                key:'inventoryBalance'
            },
            ];
            this.inventoryColumn = [
            {
                title: '日期',
                align: 'center',
                key: 'createDate',
                width: 200
            },
            {
                title: '交易类型',
                align: 'center',
                key: 'tranType',
                width:150
            },
            {
                title: '交易数量',
                align: 'center',
                width: 150,
                render: (h, params) => {
                    return h('div', {

                    },params.row.tranUnit+params.row.tranUnitValue)
                }
            },
            {
                title: '交易后库存',
                align: 'center',
                width: 150,
                 render: (h, params) => {
                    var balance='';
                    if (params.row.balanceAfter) {
                        balance = params.row.balanceAfter+"箱"
                    }
                    if (params.row.balancePouchAfter>0) {
                        balance = params.row.balanceAfter+"箱"+params.row.balancePouchAfter+"包"
                    }
                    return h('div', {

                    },balance)
                }
            },
            {
                title: '备注',
                align: 'center',
                key: 'tranDesc',
            }
            ],
            this.memberColumn = [
            // {
            //     type: 'selection',
            //     align: 'center',
            //     width: 60
            // },
            {
                title: '会员编号',
                align: 'center',
                key: 'id',
                width: 90
            },
            {
                title: '姓名',
                align: 'center',
                key: 'name',
                width: 80,
            },
            {
                title: '会员等级',
                align: 'center',
                key: 'userLevelName',
                width: 115,
                filters: [
                    {
                        label: '普通会员',
                        value: '普通会员'
                    },
                    {
                        label: '事业合伙人',
                        value: '事业合伙人'
                    },
                    {
                        label: '高级合伙人',
                        value: '高级合伙人'
                    }
                ],
                filterMultiple: false,
                filterMethod (value, row) {
                    return row.userLevelName === value;
                }
            },
            {
                title: '手机号码',
                align: 'center',
                key: 'personalPhone',
                width: 115,
            },
            {
                title: '身份证号码',
                align: 'center',
                key: 'idCardNo',
                width: 160,
            },
            {
                title: '邀请人',
                align: 'center',
                width: 100,
                render: (h, params) => {
                    var name = params.row.supervisorL1 == null? '':params.row.supervisorL1.name;
                    var row = params.row.supervisorL1 == null? null:params.row.supervisorL1;
                    return h('div', [
                        h('a',{
                            on: {
                                click: (event) => {
                                    this.view(row);
                                }
                            }
                        },name)
                    ])
                }
            },
            {
                title: '直接辅导人',
                align: 'center',
                width: 100,
                render: (h, params) => {
                    var name = params.row.supervisorL2 == null? '':params.row.supervisorL2.name;
                    var row = params.row.supervisorL2 == null? null:params.row.supervisorL2;
                    return h('div', [
                        h('a',{
                            on: {
                                click: (event) => {
                                    this.view(row);
                                }
                            }
                        },name)
                    ])
                }
            },
            {
                title: '间接辅导人',
                align: 'center',
                width: 100,
                render: (h, params) => {
                    var name = params.row.supervisorL3 == null? '':params.row.supervisorL3.name;
                    var row = params.row.supervisorL3 == null? null:params.row.supervisorL3;
                    return h('div', [
                        h('a',{
                            on: {
                                click: (event) => {
                                    this.view(row);
                                }
                            }
                        },name)
                    ])
                }
            },
            {
                title: '注册日期',
                align: 'center',
                key: 'registerDate',
                width:140,
                sortable:true
            },
            {
                title: '可提现余额',
                align: 'center',
                width: 115,
                render: (h, params) => {
                    var availableBalance = params.row.userBalanceDTO.availableBalance;
                    return h('div', {

                    },availableBalance)
                }
            },
            {
                title: '库存(箱)',
                align: 'center',
                width: 100,
                render: (h, params) => {
                    var balance = params.row.userInventoryDTO == null? '':params.row.userInventoryDTO.balance;
                    return h('div', {

                    },balance)
                }
            },
            /**
            {
                title: '操作',
                align: 'center',
                width:130,
                render: (h, params) => {
                    return h('div', [
                        h('Button',{
                            props: {
                                type: 'default',
                                size: 'small'
                            },
                            style: {
                                margin: '0 5px 0 0'
                            },
                            on: {
                                click: (event) => {
                                    this.view(params.row);
                                }
                            }
                        },'会员详情'),
                        ])
                }
            }*/
            ],
            this.orderColumn = [
            {
                title: '订单编号',
                align: 'center',
                key: 'orderNo',
                width: 150
            },
            {
                title: '日期',
                align: 'center',
                key: 'orderTime',
            },
            {
                title: '会员',
                align: 'center',
                width: 100,
                render: (h, params) => {
                    return h('div', [
                        h('a',{
                            on: {
                                click: (event) => {
                                    this.view(params.row);
                                }
                            }
                        },params.row.userDTO.name)
                    ])
                }
            },
            {
                title: '购买类型',
                align: 'center',
                key: 'orderType',
                width: 120,
            },
            {
                title: '数量(箱)',
                align: 'center',
                key: 'productUnit',
                width: 115,
            },
            {
                title: '总金额',
                align: 'center',
                key: 'productAmount',
                width: 115,
            },
            {
                title: '订单状态',
                align: 'center',
                width: 120,
                render: (h, params) => {
                     let orderStatus = params.row.orderStatus;
                        if(orderStatus === '1') {
                            return h('span', {

                            },'已确认' )
                        } else if (orderStatus === '0') {
                            return h('span', {

                            },'未确认')
                        }
                }
            }],
            this.deliveryColumn = [
            {
                title: '申请日期',
                align: 'center',
                key: 'applicationTime',
                width: 150
            },
            {
                title: '会员',
                align: 'center',
                width: 100,
                render: (h, params) => {
                    return h('div', [
                        h('a',{
                            on: {
                                click: (event) => {
                                    this.view(params.row);
                                }
                            }
                        },params.row.userDTO.name)
                    ])
                }
            },
            {
                title: '数量',
                align: 'center',
                key: 'deliveryQuantity',
                width:80,
            },
            {
                title: '收货方式',
                align: 'center',
                key: 'deliveryType',
                width: 100,
            },
            {
                title: '邮寄地址',
                align: 'center',
                key: 'deliveryPostCode',
                width: 100,
            },
            {
                title: '物流编号',
                align: 'center',
                key: 'courierNo',
                width: 130,
            },
            {
                title: '收货(自提)地址',
                align: 'center',
                key: 'deliveryAddress',
                width: 240,
            },
            {
                title: '状态',
                align: 'center',
                key: 'deliveryStatus',
                width: 120,
            }],
            this.incomeColumn = [
            {
                title: '奖金类型',
                align: 'center',
                key: 'transactionType',
                width: 150
            },
            {
                title: '日期',
                align: 'center',
                key: 'transactionTime',
                width:200
            },
            {
                title: '奖金金额',
                align: 'center',
                key: 'transactionAmount',
                width: 120,
            },
            {
                title: '备注',
                align: 'center',
                key: 'transactionDesc'
            }],
            this.withdrawColumn = [
            {
                title: '提现日期',
                align: 'center',
                key: 'withdrawTime',
                width: 150,
            },
            {
                title: '提现金额',
                align: 'center',
                key: 'withdrawAmount',
                width: 100,
            },
            {
                title: '提现账户',
                align: 'center',
                key: 'alipayId',
                width: 230,
            },
            {
                title: '状态',
                align: 'center',
                width: 100,
                render: (h,params) =>{
                    let withdrawStatus = params.row.withdrawStatus;
                    if (withdrawStatus === '1') {
                        withdrawStatus = '已同意'
                    } else if(withdrawStatus === '2'){
                        withdrawStatus = '已拒绝'
                    }else if (withdrawStatus === '3') {
                         withdrawStatus = '打款成功'
                    } else if(withdrawStatus === '4'){
                         withdrawStatus = '打款失败'
                    }
                    return h('div',{

                    },withdrawStatus)
                }
            },
            {
                title: '审核日期',
                align: 'center',
                key: 'withdrawNo',
                width: 150,
            },
            {
                title: '打款日期',
                align: 'center',
                key: 'withdrawTransferDate',
                width: 150,
            },
            {
                title: '备注',
                align: 'center',
                key: 'comment'
            }]
            
        },
        getData () {
            this.spinShow = true;
            var options={
                merchantUuid:this.merchantUuid
            }
            this.$http.post("/admin/inquiryMerchant", this.common.request(options))  
            .then(response => {
                if(response.data.body.status.statusCode==0){
                    var data = response.data.body.data;
                    this.merchantInventoryDTO = data.merchantInventoryDTO;
                    this.datas = data;
                    //订单
                    if (data.orderList) {
                        this.orderList = data.orderList;
                    }
                    //库存明细
                    if (data.inventoryHistoryList) {
                        this.inventoryHistoryList = data.inventoryHistoryList;
                    }
                    //提货处理
                    if (data.deliveryList) {
                         this.deliveryList = data.deliveryList;
                    }
                    //奖金
                    if (data.awardList) {
                        this.awardList = data.awardList;
                    }
                    //提现记录
                    if (data.withdrawList) {
                        this.withdrawList = data.withdrawList;
                    }
                    this.spinShow = false;
                        var userDTO = data.userDTO;
                        var supervisor = [];
                        var superiorRoot = {
                            title: userDTO.name+'_'+userDTO.userLevelName+'_'+data.mobileNo,
                            expand:true,
                            userUuid: userDTO.userUuid,
                            loading: false,
                            children: []
                        }
                        supervisor.push(superiorRoot);
                        this.supervisor = supervisor;
                    this.initPage(this.inventoryHistoryList);
                }else{
                    this.$Message.error(response.data.body.status.errorDesc);
                }
            }, response => {  
                this.$Message.error(response.data.body.status.errorDesc);
            })
        },
        memberlista(){
            // this.$router.push({
            //             name: 'memberlist',
            //         });
        },
        // initPages(data){
        //     //获取查询的数据并数据模型
        //     this.totalData = data;
        //     //数据总数量
        //     this.total1 = this.totalData.length;
        //     //处理默认首页显示
        //     if(this.totalData.length < this.pageSize1){
        //         this.userList = this.totalData;
        //     }else{
        //         this.userList = this.totalData.slice(0,this.pageSize1);
        //     }
        //     //重新设置成显示第一页
        //     this.$nextTick(function(){
        //         this.$refs['Memberpage'].currentPage = 1;
        //     })
        // },
        //处理分页-页数改变
        // changepages(index){
        //     var _start = ( index - 1 ) * this.pageSize1;
        //     var _end = index * this.pageSize1;
        //     this.userList = this.totalData.slice(_start,_end);
        // },
        stocklista(){
            // this.$router.push({
            //             name: 'stocklist',
            //         });
        },
        cashlista(){
            // this.$router.push({
            //             name: 'fundwithdraw',
            //         });
        },
        fundrewarda(){
            // this.$router.push({
            //             name: 'fundreward',
            //         });
        },
        view (row) {
            this.$router.push({
                                name: 'memberdetail',
                                query:{userUuid: row.supervisorL1.userUuid}
                            });
        },
        initPage(data){
            //获取查询的数据并数据模型
            this.totalData = data;
            //数据总数量
            this.total = this.totalData.length;

            //处理默认首页显示
            if(this.totalData.length < this.pageSize){
                this.inventoryHistoryListData = this.totalData;
            }else{
                this.inventoryHistoryListData = this.totalData.slice(0,this.pageSize);
            }
            //重新设置成显示第一页
            this.$nextTick(function(){
                this.$refs['memberpage'].currentPage = 1;
            })
        },
        //处理分页-页数改变
        changepage(index){
            var _start = ( index - 1 ) * this.pageSize;
            var _end = index * this.pageSize;
            this.inventoryHistoryListData = this.totalData.slice(_start,_end);
        },
        conhidi1(){
                this.Memberships = null;
                this.searchIdCardNo = null;
                this.searchPersonalPhone = null;
                this.searchRegisterDate =null
        },
        conhidi2(){
            this.Memberships = null;
                this.searchName = null;
                this.searchPersonalPhone = null;
                this.searchRegisterDate =null
        },
        conhidi0(){
                this.searchIdCardNo = null;
                this.searchName = null;
                this.searchIdCardNo = null;
                this.searchRegisterDate =null
        },
        conhidi3(){
                this.Memberships = null;
                this.searchName = null;
                this.searchIdCardNo = null;
                this.searchRegisterDate =null
        },
        conhidi4(){
            if (this.searchRegisterDate) {
                this.searchName = null;
                this.searchIdCardNo = null;
                this.searchPersonalPhone = null;
                this.Memberships = null;
            }  
        },
        viewSsubordinate(){
            this.loading = true;
            var supervisor = this.supervisor;
            this.supervisors = supervisor;
            supervisor.forEach((item,index) =>{
                this.Initializethe = true;
                this.loadSuperiorData(item)
            })
        },
        loadSuperiorData (item, callback) {
                var Initializethe = this.Initializethe;
                var that = this;
                setTimeout(() => {
                    let options= {
                        'userUuid':item.userUuid
                    }
                    this.$http.post("/admin/inquiryL1User", this.common.request(options))  
                    .then(response => {
                        if(response.data.body.status.statusCode==0){
                            var data = response.data.body.data; 
                            var userList = data.userList;
                            let length = userList.length;
                            if (!Initializethe) {
                                if (length === 0) {
                                    this.$Message.error('当前用户无下级目录')
                                }
                            }
                            var children = [];
                            userList.forEach(function(val, index){
                                var child = {
                                    title: val.name+'_'+val.userLevelName+'_'+val.personalPhone,
                                    expand:true,
                                    userUuid: val.userUuid,
                                    loading: false,
                                    children: []
                                }
                                children.push(child);
                            })
                            if (Initializethe) {
                                var supervisors = [];
                                // var visors  = this.supervisors;
                                // supervisors.push(visors)
                                supervisors.push(children);
                                that.supervisors[0].children = supervisors[0];
                                //三级目录
                                supervisors[0].forEach((temm,indexs) =>{
                                     let options= {
                                        'userUuid':temm.userUuid
                                    }
                                    this.$http.post("/admin/inquiryL1User", this.common.request(options))  
                                    .then(response => {
                                        if(response.data.body.status.statusCode==0){
                                            var data = response.data.body.data; 
                                            var userList = data.userList;
                                            var children = [];
                                            userList.forEach(function(val, index){
                                                var child = {
                                                    title: val.name+'_'+val.userLevelName+'_'+val.personalPhone,
                                                    expand:true,
                                                    userUuid: val.userUuid,
                                                    loading: false,
                                                    children: []
                                                }
                                                children.push(child);
                                            })
                                                var supervisors = [];
                                                supervisors.push(children);
                                                that.supervisors[0].children[indexs].children = supervisors[0];
                                                that.supervisor = that.supervisors;
                                        }
                                    })

                                });
                                this.showSubordinate = true;
                                this.loading = false;
                                that.Initializethe = false;
                            }else{
                                callback(children);
                            }
                            
                        }else{
                            this.$Message.error(response.data.body.status.errorDesc);
                            this.loading = false;
                        }
                    }, response => {  
                        this.$Message.error(response.data.body.status.errorDesc);
                        this.loading = false;
                    })
                }, 1000);
        },
        allMember(){
            this.loadingdc = true;
            this.inquiryMember(0, 99999,true);
        },
        exportMember () {
            var exportData=this.exportData;
            this.$refs.deliveryTable.exportCsv({
                            filename: '会员列表',
                            columns:exportData[1],
                            data:exportData[2],
                        });
                        this.loadingdc = false;
        },
        initData(){
            this.inquiryMember(0, this.pageSize);
        },
        searchMember(){
            this.inquiryMember(0, this.pageSize);
            this.resetpage();
        },
        resetpage(){
            this.$nextTick(function(){
                this.$refs['Memberpage'].currentPage = 1;
            })
        },
        //处理分页页数改变, 重新查询该页数据
        changepages(index){
            var startIndex = ( index - 1 ) * this.pageSize;
            this.inquiryMember(startIndex, this.pageSize);
        },
        inquiryMember (startIndex, pageSize,isExport) {
            if(!isExport){
                this.loading1 = true;
            }
            let pstations = {
                startIndex:startIndex,
                pageSize: pageSize
            };
            let keyArray = [];
            keyArray.push('MERCHANT');
            pstations.merchantUuid = this.merchantUuid;
            //判断是否有姓名查询条件
            if (this.searchName) {
              keyArray.push('NAME');
              pstations.name = this.searchName;
            }
            //判断会员等级
            if (this.Memberships) {
              keyArray.push('LEVEL');
              pstations.level = this.Memberships;
            }
            //判断是否有身份证查询条件
            if (this.searchIdCardNo) {
              keyArray.push('IDCARDNO');
              pstations.idCardNo = this.searchIdCardNo;
            }
            //判断是否有身手机号码查询条件
            if (this.searchPersonalPhone) {
              keyArray.push('PERSONALPHONE');
              pstations.personalPhone = this.searchPersonalPhone;
            }
            //判断是否有注册时间查询条件
            var searchDate = this.searchRegisterDate;
            if(searchDate&&searchDate[0] && searchDate[1]){
                keyArray.push('REGISTERDATE');
                var startDate = searchDate[0];
                var endDate = searchDate[1];
                pstations.registerDateStart = startDate;
                pstations.registerDateEnd = endDate;
            }
            pstations.keyArray = keyArray;
            this.$http.post("/admin/searchUser", this.common.request(pstations))  
            .then(response => {

                if(response.data.body.status.statusCode==0){
                    var data = response.data.body.data;
                    if(!isExport){
                        this.loading1 = false;
                        this.userList = data.userList;
                        this.total1 = data.total;
                    }else{
                        var userList= ['会员列表',this.memberColumn1,data.userList]
                        this.exportData = userList;
                        this.exportMember();
                    }
                    
                }else{
                    this.$Message.error(response.data.body.status.errorDesc);
                    this.loading1 = false;
                }
            }, response => {  
                this.loading1 = false;
                this.$Message.error(response.data.body.status.errorDesc);
            })
        },
        
    },
     created () {
        this.merchantUuid =this.$route.query.merchantUuid;
        this.Dataini();
        this.getData();
        this.initData();
    }
};
</script>
