<style lang="less">
    @import '../../styles/common.less';
    @import './user-list.less';
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
                         合伙人列表
                    </p>
                    <Row>

                            <Input clearable v-model="searchName" placeholder="姓名" style="width: 100px"/>
                            <Select clearable v-model="searchPartnerLevel" style="width:120px">
                                <Option v-for="item in partnerLevelList" :value="item.value" :key="item.value"></Option>
                            </Select>
                            <!--<Input clearable v-model="searchIdCardNo"  placeholder="身份证号码" style="width: 150px"/>-->
                            <Input clearable v-model="searchPersonalPhone"  placeholder="手机号码" style="width: 120px"/>
                            <DatePicker type="daterange" v-model="searchEffectiveDate" placement="bottom-end" placeholder="生效日期" style="width: 200px"></DatePicker>

                            <Button  type="success" @click="searchData()">查询</Button>
                            <div class="f_r">
                            <Button icon="document-text" type="warning" @click="exportResult()" :loading="loadingdc">导出</Button>
                        </div>
                    </Row>
                    
                    <Row class="margin-top-10">
                        <Col span="24">
                            <div>
                                <Table :columns="partnerColumn" :data="partnerData"  :loading="loading" border stripe @on-row-dblclick="view"></Table>
                            </div>
                        </Col>
                    </Row>
                    <Row class="margin-top-10">
                        <Page ref="partnerpage" :total="total" size="small" :pageSize="pageSize" @on-change="changepage" show-total show-elevator></Page>
                    </Row>
                </Card>
                        <Table ref="deliveryTable" style="display:none"></Table>
            </Col>
        </Row>
    </div>
</template>

<script>
export default {
    data () {
        return {
            loading: false,
            searchName:'',
            exportData:[],
            params:[],
            searchIdCardNo:'',
            searchPersonalPhone:'',
            searchEffectiveDate:null,
            newPartnerLevel: '',
            showUpgrade: false,
            addModel: false,
            editRoleModel: false,
            loadingdc:false,
            editRow: {},
            addRow: {},
            userColumn: [],
            partnerColumn: [],
            exportColumn: [],
            searchPartnerLevel:'',
            totalData:[],
            userData: [],
            partnerData: [],
            total:0,
            pageSize:8,
            totala:0,
            searchPartnerLevel:'',
            partnerLevelList:[{
                value:'孵化中心',
                label:'孵化中心 '
            },
            {
                value:'市级孵化中心',
                label:'市级孵化中心'
            },
            {
                value:'省级孵化中心',
                label:'省级孵化中心'
            },
            {
                value:'核心合伙人',
                label:'核心合伙人'
            }]
        }
    },
    methods: {
        getData () {
            this.partnerColumn = [
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
                key: 'contactName',
                width: 150,
            },
            {
                title: '合伙人类别',
                align: 'center',
                key: 'partnerLevel',
                width: 200,
            },
            {
                title: '手机号码',
                align: 'center',
                key: 'mobileNo',
                width: 150,
            },
            {
                title: '地址',
                align: 'center',
                key: 'merchantAddress'
            },
            {
                title: '生效日期',
                align: 'center',
                key: 'effectiveDate',
                width: 200,
                sortable:true
            }
            ];
            this.exportColumn = [
            {
                title: '姓名',
                align: 'center',
                key: 'contactName',
                width: 110,
            },
            {
                title: '合伙人类别',
                align: 'center',
                key: 'partnerLevel',
                width: 150,
            },
            {
                title: '手机号码',
                align: 'center',
                key: 'mobileNo',
                width: 115,
            },
            {
                title: '地址',
                align: 'center',
                key: 'merchantAddress',
                width: 160,
            },
            {
                title: '生效日期',
                align: 'center',
                key: 'effectiveDate',
                width: 140,
                sortable:true
            }
            ];

        },
        initData(){
            this.inquiryPartner(0, this.pageSize);
        },
        searchData(){
            this.inquiryPartner(0, this.pageSize);
            this.resetpage();
        },
        exportResult(){
            this.loadingdc = true;
            this.inquiryPartner(0, 99999,true);
        },
        changeParentPartner(row){
            this.changeParentPartnerModel = true;
            this.changePartner = row;
            this.parentPartner = row.parentPartner;
        },
        inquiryPartner(startIndex, pageSize,isExport){
            let searchOptions = {
                startIndex:startIndex,
                pageSize: pageSize
            };
            let keyArray = [];
            //判断是否有姓名查询条件
            if (this.searchName) {
              keyArray.push('NAME');
              searchOptions.name = this.searchName;
            }
            //判断合伙人等级
            if (this.searchPartnerLevel) {
              keyArray.push('PARTNERLEVEL');
              searchOptions.partnerLevel = this.searchPartnerLevel;
            }
            //判断是否有身份证查询条件
            if (this.searchIdCardNo) {
              keyArray.push('IDCARDNO');
              searchOptions.idCardNo = this.searchIdCardNo;
            }
            //判断是否有身手机号码查询条件
            if (this.searchPersonalPhone) {
              keyArray.push('PERSONALPHONE');
              searchOptions.personalPhone = this.searchPersonalPhone;
            }
            //判断是否有生效时间查询条件
            var searchDate = this.searchEffectiveDate;
            if(searchDate&&searchDate[0] && searchDate[1]){
                keyArray.push('EFFECTIVEDATE');
                var startDate = searchDate[0];
                var endDate = searchDate[1];
                searchOptions.effectiveDateStart = startDate;
                searchOptions.effectiveDateEnd = endDate;
            }
            searchOptions.keyArray = keyArray;
            if(isExport){

            }else{
                this.loading = true;
            }
            this.$http.post("/admin/searchPartner", this.common.request(searchOptions))  
            .then(response => {  
                if(!isExport){
                    this.loading = false;
                }
                if(response.data.body.status.statusCode==0){
                    var data = response.data.body.data;
                    if(isExport){
                       var userList= ['合伙人列表',this.exportColumn,data.partnerList]
                        this.exportData = userList;
                        this.exportPartner();
                    }else{
                        this.partnerData = data.partnerList;
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
        //将分页页码重置成1
        resetpage(){
            this.$nextTick(function(){
                this.$refs['partnerpage'].currentPage = 1;
            })
        },
        //处理分页页数改变, 重新查询该页数据
        changepage(index){
            var startIndex = ( index - 1 ) * this.pageSize;
            this.inquiryPartner(startIndex, this.pageSize);
        },
        upgrade () {
            this.showUpgrade = true;
        },
        upgradeok () { 
            this.$Notice.success({
                title: '成功',
                desc: '会员等级已修改',
                duration: 2
            });
            this.showUpgrade=false;  
        },
        upgradecancel () {
            this.showUpgrade = false;
        },
        changeok () { 
            let options = {
                partnerUuid:this.changePartner.partnerUuid,
                parentPartner: {
                    partnerUuid: this.newParentPartnerUuid
                }
            };
            this.$http.post("/admin/assignParentPartner", this.common.request(options))  
            .then(response => {  
                this.changeParentPartnerModel=false; 
                if(response.data.body.status.statusCode==0){
                    this.$Notice.success({
                        title: '成功',
                        desc: '修改成功',
                        duration: 2
                    });
                    this.inquiryPartner(0, this.pageSize,false);
                }else{
                    this.$Message.error(response.data.body.status.errorDesc);
                }
            }, response => {  
                this.$Message.error(response.data.body.status.errorDesc);
            }) 
        },
        changecancel () {
            this.changeParentPartnerModel=false;  
        },
        view (row) {
            //this.$router.push({
            //                    name: 'partnerdetail',
            //                   query:{partnerUuid:row.partnerUuid}
            //                });
        },
        viewstation (row) {
            this.$router.push({
                                name: 'stationdetail',
                                query:{merchantUuid:row.merchantDTO.merchantUuid}
                            });
        },
        allPartner(){
            this.loadingdc = true;
            this.inquiryPartner(0, 99999,true);
        },
        exportPartner () {
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
