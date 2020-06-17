<style lang="less">
    @import '../../styles/common.less';
    .ivu-form-item-label{
        text-align: left;
        margin-left: 12px;
    }
    .vertical-center-modal{
        position: absolute;
        top: -5%;
        left: 35%;
    }
</style>

<template>
    <div>
        <Row class="margin-top-10">
            <Col span="24">
                <Card>
                    <p slot="title">
                        <Icon type="ios-person"></Icon>
                         激励团队列表
                    </p>
                    <Row>

                            <Input clearable v-model="searchName" placeholder="姓名" style="width: 100px"/>
                            <Input clearable v-model="searchPersonalPhone"  placeholder="手机号码" style="width: 120px"/>
                            <Button  type="success" @click="searchData()">查询</Button>
                            <div style="float:right">
                            <Button icon="plus" type="primary" @click="add()">新增</Button>
                            <Button icon="document-text" type="warning" @click="exportResult()" :loading="loadingdc">导出</Button>
                        </div>
                    </Row>
                    
                    <Row class="margin-top-10">
                        <Col span="24">
                            <div>
                                <Table :columns="performanceColumn" :data="performanceData"  :loading="loading" border stripe></Table>
                            </div>
                        </Col>
                    </Row>
                    <Row class="margin-top-10">
                        <Page ref="performancepage" :total="total" size="small" :pageSize="pageSize" @on-change="changepage" show-total show-elevator></Page>
                    </Row>
                </Card>
                        <Table ref="deliveryTable" style="display:none"></Table>
            </Col>
        </Row>
        <Modal
            :closable="false"
            :mask-closable="false"
            v-model="addModel"
            title="新增激励团队">
            <Form ref="assignTrainerMerchantForm" :label-width="120">
                <FormItem label="会员">
                    <Select 
                    v-model="addRow.userDTO.userUuid" 
                    filterable
                    remote
                    clearable
                    :remote-method="searchUser"
                    :loading="userLoading"
                    style="width:250px">
                        <Option v-for="item in userList" :value="item.userUuid" :key="item.userUuid">{{item.name}}-{{item.personalPhone}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="激励金额">
                    <InputNumber style="width:250px" :min="1" v-model="addRow.performanceAmount"></InputNumber>
                </FormItem>
                <FormItem label="生效开始日期">
                    <DatePicker style="width:250px" type="date" format="yyyy-MM-dd" v-model="addRow.fromDate"></DatePicker>
                </FormItem>
                <FormItem label="生效结束日期">
                    <DatePicker style="width:250px" type="date" format="yyyy-MM-dd" v-model="addRow.toDate"></DatePicker>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="text"  @click="addModel=false">取消</Button>
                <Button type="primary" :loading="addLoading" @click="addok">确定</Button>
            </div>
        </Modal>
        <Modal
            :closable="false"
            :mask-closable="false"
            v-model="editModel"
            title="编辑激励团队">
            <Form  :label-width="120">
                <FormItem label="会员">
                    {{editRow.userName}}
                </FormItem>
                <FormItem label="激励金额">
                    <InputNumber style="width:250px" :min="1" v-model="editRow.performanceAmount"></InputNumber>
                </FormItem>
                <FormItem label="生效开始日期">
                    <DatePicker style="width:250px" type="date" format="yyyy-MM-dd" v-model="editRow.fromDate"></DatePicker>
                </FormItem>
                <FormItem label="生效结束日期">
                    <DatePicker style="width:250px" type="date" format="yyyy-MM-dd" v-model="editRow.toDate"></DatePicker>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="text"  @click="editModel=false">取消</Button>
                <Button type="primary" :loading="editLoading" @click="editok">确定</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
export default {
    data () {
        return {
            loading: false,
            addLoading: false,
            editLoading: false,
            searchName:'',
            exportData:[],
            params:[],
            searchPersonalPhone:'',
            showUpgrade: false,
            addModel: false,
            editModel: false,
            loadingdc:false,
            userLoading:false,
            editRow: {
                userDTO:{

                }
            },
            addRow: {
                userDTO:{
                    
                }
            },
            performanceColumn: [],
            exportColumn: [],
            totalData:[],
            userList: [],
            performanceData: [],
            total:0,
            pageSize:8,
            totala:0,
        }
    },
    methods: {
        getData () {
            this.performanceColumn = [
            {
                title: '编号',
                align: 'center',
                width: 65,
                render: (h, params) => {
                    return h('div', [
                         h('Span',{
                         },params.index+1),
                        ])
                }
            },
            {
                title: '姓名',
                align: 'center',
                key: 'userName',
                width: 200,
            },
            {
                title: '手机号码',
                align: 'center',
                key: 'userPersonalPhone',
                width: 200,
            },
            {
                title: '激励金额(元)',
                align: 'center',
                key: 'performanceAmount',
                width: 200,
            },
            {
                title: '生效开始日期',
                align: 'center',
                key: 'fromDate',
                sortable:true
            },
            {
                title: '生效结束日期',
                align: 'center',
                key: 'toDate',
                sortable:true
            },
            {
                title: '操作',
                align: 'center',
                width:200,
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
                                     this.edit(params.row);
                                 }
                             }
                         },'编辑'),
                        
                        h('Poptip',{
                            props: {
                                confirm: true,
                                title: '您确定要删除这条数据吗?',
                                transfer: true
                            },
                            on: {
                                'on-ok': () => {
                                    this.del(params.row);
                                }
                            }
                        },[
                            h('Button',{
                            props: {
                                type: 'error',
                                size: 'small'
                            }
                        },'删除')
                        ])
                    ])
                }
            }
            ];
            this.exportColumn = [
            {
                title: '姓名',
                align: 'center',
                key: 'userName',
                width: 110,
            },
            {
                title: '手机号码',
                align: 'center',
                key: 'userPersonalPhone',
                width: 115,
            },
            {
                title: '激励金额(元)',
                align: 'center',
                key: 'performanceAmount',
                width: 200,
            },
            {
                title: '生效开始日期',
                align: 'center',
                key: 'fromDate',
                width: 140,
                sortable:true
            },
            {
                title: '生效结束日期',
                align: 'center',
                key: 'toDate',
                width: 140,
                sortable:true
            }
            ];

        },
        initData(){
            this.inquiryPerformance(0, this.pageSize);
        },
        searchData(){
            this.inquiryPerformance(0, this.pageSize);
            this.resetpage();
        },
        exportResult(){
            this.loadingdc = true;
            this.inquiryPerformance(0, 99999,true);
        },
        inquiryPerformance(startIndex, pageSize,isExport){
            let searchOptions = {
                startIndex:startIndex,
                pageSize: pageSize
            };
            let keyArray = [];
            //判断是否有姓名查询条件
            if (this.searchName) {
              keyArray.push('USERNAME');
              searchOptions.userName = this.searchName;
            }
            //判断是否有身手机号码查询条件
            if (this.searchPersonalPhone) {
              keyArray.push('PERSONALPHONE');
              searchOptions.personalPhone = this.searchPersonalPhone;
            }
            searchOptions.keyArray = keyArray;
            if(isExport){

            }else{
                this.loading = true;
            }
            this.$http.post("/admin/searchUserVirtualPerformance", this.common.request(searchOptions))  
            .then(response => {  
                if(!isExport){
                    this.loading = false;
                }
                if(response.data.body.status.statusCode==0){
                    var data = response.data.body.data;
                    if(isExport){
                       var performanceList= ['激励团队列表',this.exportColumn,data.performances]
                        this.exportData = performanceList;
                        this.exportPerformance();
                    }else{
                        this.performanceData = data.performances;
                        this.total = data.total;
                    }
                }else{
                    this.$Message.error(response.data.body.status.errorDesc);
                }
            }, response => {  
                this.loading = false;
                this.$Message.error(response.data.body.status.errorDesc);
            })
        },
        searchUser(query){
            if(!query){
                return;
            }
            let searchOptions = {
                startIndex:0,
                pageSize: 10,
                keyArray:['NAME'],
                name:query
            };
            this.userLoading = true;
            this.$http.post("/admin/searchUser", this.common.request(searchOptions))  
            .then(response => {  
                this.userLoading = false;
                if(response.data.body.status.statusCode==0){
                    var data = response.data.body.data;
                    this.userList = data.userList;
                }else{
                    this.$Message.error(response.data.body.status.errorDesc);
                }
            }, response => {  
                this.userLoading = false;
                this.$Message.error(response.data.body.status.errorDesc);
            })
        },
        //将分页页码重置成1
        resetpage(){
            this.$nextTick(function(){
                this.$refs['performancepage'].currentPage = 1;
            })
        },
        //处理分页页数改变, 重新查询该页数据
        changepage(index){
            var startIndex = ( index - 1 ) * this.pageSize;
            this.inquiryPerformance(startIndex, this.pageSize);
        },
        edit (row) {
            this.editModel = true;
            this.editRow = row;
            this.searchUser(row.userName);
        },
        add () {
            this.addModel = true;
        },
        addok () { 
            if(!this.validate(this.addRow)){
                return;
            }
            let options = {
                actionType:'ADD',
                userDTO:{
                    userUuid:this.addRow.userDTO.userUuid
                },
                fromDate:this.addRow.fromDate,
                toDate:this.addRow.toDate,
                performanceAmount:this.addRow.performanceAmount
            };
            this.addLoading = true;
            this.$http.post("/admin/changeUserVirtualPerformance", this.common.request(options))  
            .then(response => {  
                this.addLoading = false;
                if(response.data.body.status.statusCode==0){
                    this.$Notice.success({
                        title: '成功',
                        desc: '激励团队已添加',
                        duration: 2
                    });
                    this.addModel=false; 
                    this.inquiryPerformance(0, this.pageSize,false);
                }else{
                    this.$Message.error(response.data.body.status.errorDesc);
                }
            }, response => { 
                this.addLoading = false; 
                this.$Message.error(response.data.body.status.errorDesc);
            }) 
        },
        editok () { 
            if(!this.validate(this.editRow)){
                return;
            }
            let options = {
                actionType:'MODIFY',
                userPerformanceVirtualUuid:this.editRow.userPerformanceVirtualUuid,
                userDTO:{
                    userUuid:this.editRow.userDTO.userUuid
                },
                fromDate:this.editRow.fromDate,
                toDate:this.editRow.toDate,
                performanceAmount:this.editRow.performanceAmount
            };
            this.editLoading = true;
            this.$http.post("/admin/changeUserVirtualPerformance", this.common.request(options))  
            .then(response => {  
                this.editLoading = false;
                if(response.data.body.status.statusCode==0){
                    this.$Notice.success({
                        title: '成功',
                        desc: '激励团队已修改',
                        duration: 2
                    });
                    this.editModel=false; 
                    this.inquiryPerformance(0, this.pageSize,false);
                }else{
                    this.$Message.error(response.data.body.status.errorDesc);
                }
            }, response => { 
                this.editLoading = false; 
                this.$Message.error(response.data.body.status.errorDesc);
            }) 
        },
        del (row) { 
            let options = {
                actionType:'DELETE',
                userPerformanceVirtualUuid:row.userPerformanceVirtualUuid
            };
            this.$http.post("/admin/changeUserVirtualPerformance", this.common.request(options))  
            .then(response => {  
                if(response.data.body.status.statusCode==0){
                    this.$Notice.success({
                        title: '成功',
                        desc: '激励团队已删除',
                        duration: 2
                    });
                    this.inquiryPerformance(0, this.pageSize,false);
                }else{
                    this.$Message.error(response.data.body.status.errorDesc);
                }
            }, response => { 
                this.editModel=false; 
                this.editLoading = false; 
                this.$Message.error(response.data.body.status.errorDesc);
            }) 
        },
        validate(row){
            if(!row.userDTO.userUuid){
                this.$Message.error('请选择会员');
                return false;
            }
            if(!row.fromDate || !row.toDate){
                this.$Message.error('请填写生效日期');
                return false;
            }
            return true;
        },
        exportPerformance () {
            var exportData=this.exportData;
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
        this.initData();
    }
};
</script>
