<style lang="less">
    @import '../../styles/common.less';
</style>

<template>
    <div>
        <Row class="margin-top-10">
            <Col span="24">
                <Card class="margin-top-10">
                    <p slot="title">
                         会员升级申请
                    </p>
                    <Row>
                        <Input v-model="searchName" style="width:150px" placeholder="申请人姓名"></Input>
                        <Button  type="success" @click="handleSearch()">查询</Button>
                    </Row>
                    <Row class="margin-top-10">
                        <Col span="24">
                            <div>
                                <Table :columns="memberupgradeColumn" :loading="loading" :data="memberupgradeData" border stripe ref="memberupgradeTable"></Table>
                                
                            </div>
                        </Col>
                    </Row>
                    <Row class="margin-top-10">
                        <Col span="18">
                        <Page ref="memberupgradepage" :total="total" size="small" :pageSize="pageSize" @on-change="changepage" show-total show-elevator></Page>
                        </Col>
                    </Row>
                    <Modal v-model="rejectModel" width="400px" ref="rejectModelRef" title="拒绝原因">
                            <Input type="text" v-model="rejectReason" style="width:360px"></Input>
                        <div slot="footer">
                            <Button type="text" @click="cancel">取消</Button>
                            <Button type="primary" @click="rejectok()">提交</Button>
                        </div>
                    </Modal>
                </Card>
            </Col>
        </Row>
    </div>
</template>

<script>
export default {
    components: {
        
    },
    data () {
        return {
            rejectModel:false,
            loading: true,
            rejectReason:'',
            rejectApplication:{},
            memberupgradeColumn: [],
            applications:[],
            totalData:[],
            memberupgradeData: [],
            total:0,
            pageSize:8,
            searchName:'',
        }
    },
    methods: {
        getData () {
            this.memberupgradeColumn = [
            {
                title: '日期',
                align: 'center',
                key: 'applicationDate',
                sortable: true,
                width: 150
            },
            {
                title: '申请会员',
                align: 'center',
                width: 120,
                render: (h, params) => {
                    return h('div', [
                        h('a',{
                            on: {
                                click: (event) => {
                                    this.view(params.row);
                                }
                            }
                        },params.row.userName)
                    ])
                }

            },
            {
                title: '原会员等级',
                align: 'center',
                key: 'userLevelFrom',
                width: 120

            },
            {
                title: '新会员等级',
                align: 'center',
                key: 'userLevelTo',
                width: 120
            },
            {
                title: '升级原因',
                align: 'center',
                width:260,
                key: 'upgradeReason'
            },
            {
                title: '审核状态',
                align: 'center',
                width: 150,
                render: (h, params) => {
                    let verifyStatus = params.row.verifyStatus;
                    let verify = [];
                    let color = '';
                    if(verifyStatus == '0'){
                        color = 'green';
                        verify= '待审核';
                    }
                    else if(verifyStatus == '1'){
                        color = 'red';
                        verify= '已通过';
                   } else if(verifyStatus == '2'){
                        color = 'gray';
                        verify= '未通过';
                     }   
                    return h('tag', {
                        props: {
                            color: color,
                            type: 'dot'
                        }
                    }, verify)
                },
                filters: [
                    {
                        label: '已通过',
                        value: '1'
                    },
                    {
                        label: '未通过',
                        value: '2'
                    },
                    {
                        label: '待审核',
                        value: '0'
                    }
                ],
                filterMultiple: false,
                filterMethod (value, row) {
                    return row.verifyStatus === value;
                }
            },
            {
                title: '操作',
                align: 'center',
                width:140,
                render: (h, params) => {
                    return h('div', [
                        h('Button',{
                            props: {
                                type: 'success',
                                size: 'small',
                                 disabled: params.row.verifyStatus !== '0'?true:false
                            },
                            style: {
                                margin: '0 5px 0 0'
                            },
                            on: {
                                click: (event) => {
                                    this.rejectok(params.row);
                                }
                            }
                        },'同意'),
                        h('Poptip',{
                            props: {
                                confirm: true,
                                title: '您确定此申请吗?',
                                transfer: true
                            },
                            on: {
                                'on-ok': () => {
                                    this.reject(params.row);
                                }
                            }
                        },[
                            h('Button',{
                            props: {
                                type: 'error',
                                size: 'small',
                                disabled: params.row.verifyStatus !== '0'?true:false
                            },
                            style: {
                                margin: '0 5px 0 0'
                            },
                        },'拒绝')
                        ])
                    ])
                    }
                }
            ];

        },
        inquiryUpgradeApplication(){
            let searchOptions = {
                
            };
            this.$http.post("/admin/inquiryUserUpgradeApplication", this.common.request(searchOptions))  
            .then(response => {  
                this.loading = false;
                if(response.data.body.status.statusCode==0){
                    var data = response.data.body.data;
                    var applications = data.applications;
                    this.applications = applications;
                    this.initPage(applications);
                }else{
                    this.$Message.error(response.data.body.status.errorDesc);
                }
            }, response => {  
                this.loading = false;
                this.$Message.error(response.data.body.status.errorDesc);
            })
        },
        reject(row){
            this.rejectModel = true;
            this.boss = '1';
            this.rejectApplication = row
        },
        cancel(){
            this.rejectModel = false;
        },
        //处理分页-页数改变
        initPage(data){
            //获取查询的数据并数据模型
            this.totalData = data;
            //数据总数量
            this.total = this.totalData.length;
            //处理默认首页显示
            if(this.totalData.length < this.pageSize){
                this.memberupgradeData = this.totalData;
            }else{
                this.memberupgradeData = this.totalData.slice(0,this.pageSize);
            }
            //重新设置成显示第一页
            this.$nextTick(function(){
                this.$refs['memberupgradepage'].currentPage = 1;
            })
        },
        //处理分页-页数改变
        changepage(index){
            var _start = ( index - 1 ) * this.pageSize;
            var _end = index * this.pageSize;
            this.memberupgradeData = this.totalData.slice(_start,_end);
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
            let totalSearchData = this.search(this.applications, {userName: this.searchName});
            this.initPage(totalSearchData);
        },
        rejectok (row) { 
            if (this.boss === '1') {
                this.rejectModel = false;
                var options={
                    actionType: 'REJECT',
                    rejectReason:this.rejectReason,
                    userUpgradeApplicationUuid:this.rejectApplication.userUpgradeApplicationUuid
                }
            }else{
                var options={
                        actionType: 'APPROVE',
                        userUpgradeApplicationUuid:row.userUpgradeApplicationUuid
                    }
            }
            
            this.$http.post("/admin/changeUserUpgradeApplication", this.common.request(options))
			.then(response => {
				if(response.data.body.status.statusCode == 0) {
					var data = response.data.body.data;
					this.$Notice.success({
                            title: '操作成功',
                            duration: 2
                        });
                        this.inquiryUpgradeApplication();
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
        view (row) {
            this.$router.push({
                                name: 'memberdetail',
                                query:{userUuid:row.userDTO.userUuid}
                            });
        },
    },
    created () {
        this.getData();
        this.inquiryUpgradeApplication();
    }
};
</script>
