<style lang="less">
    @import '../../styles/common.less';
</style>

<template>
    <div>
        <Row class="margin-top-10">
            <Col span="24">
                <Card class="margin-top-10">
                    <p slot="title">
                        <Icon type="ios-person"></Icon>
                         库存申请
                    </p>
                    <Row>
                        <Input v-model="searchStationName" placeholder="驿站名称" style="width: 150px" />
                        <Button  type="success" @click="searchStockApplication()">查询</Button>
                    </Row>
                    <Row class="margin-top-10">
                        <Col span="24">
                            <div>
                                <Table :columns="stockColumn" :loading="loading" :data="stockData" border stripe ref="stockTable"></Table>
                            </div>
                        </Col>
                    </Row>
                    <Row class="margin-top-10">
                        <Page ref="stockpage" :total="total" size="small" :pageSize="pageSize" @on-change="changepage" show-total show-elevator></Page>
                    </Row>
                    
                </Card>
            </Col>
        </Row>
        <Modal
            v-model="showInventory"
            title="库存调拨">
            <Form :label-width="80">
                <Row>
                    <!-- <Col span="24">
                        <FormItem label="申请数量" >
                            100箱
                        </FormItem>
                    </Col> -->
                    <Col span="6" class="t_r">
                            调拨数量
                        <Span style="color:red;">&nbsp;&nbsp;&nbsp;{{diaobo.inventoryQuantity}}&nbsp;&nbsp;&nbsp;&nbsp;</Span>/箱
                    </Col>
                </Row>
            </Form>
            <div slot="footer">
                <Button type="text" @click="increaseinventorycancel">取消</Button>
                <Button type="primary" @click="increaseinventoryok()">提交</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
export default {
    data () {
        return {
            diaobo:[],
            loading: true,
            stockColumn: [],
            boss:'',
            applications:[],
            totalData:[],
            searchStationName:'',
            stockData: [],
            total:0,
            pageSize:8,
            showInventory:false
        }
    },
    methods: {
        getData () {
            this.stockColumn = [
            {
                title: '申请时间',
                align: 'center',
                key:'applicationDate',
                width: 150,
                sortable:true
            },
            {
                title: '驿站',
                align: 'center',
                render: (h, params) => {
                    return h('div', [
                        h('a',{
                            on: {
                                click: (event) => {
                                    this.viewstation(params.row);
                                }
                            }
                        },params.row.merchantName)
                    ])
                }
            },
            {
                title: '申请数量(箱)',
                align: 'center',
                key: 'inventoryQuantity',
                width: 150,

            },
            {
                title: '状态',
                align: 'center',
                width: 200,
                render: (h, params) => {
                    let verifyStatus = params.row.verifyStatus;
                    let examine = '';
                    let color = '';
                    if (verifyStatus == '0') {
                        examine = '待处理';
                        color = 'green';
                    } else if(verifyStatus == '1'){
                        examine = '已调拨';
                        color = 'gray';
                    }else if (verifyStatus == '2') {
                        examine = '已拒绝';
                        color = 'red';
                    }    
                    return h('tag', {
                        props: {
                            color : color,
                            type:'dot'
                        }
                    }, examine)
                },
                filters: [
                    {
                        label: '已调拨',
                        value: '1'
                    },
                    {
                        label: '已拒绝',
                        value: '2'
                    },
                    {
                        label: '待处理',
                        value: '待处理'
                    },
                ],
                filterMultiple: false,
                filterMethod (value, row) {
                    return row.verifyStatus === value;
                }
            },
            {
                title: '操作',
                align: 'center',
                width:150,
                render: (h, params) => {
                    return h('div', [
                        h('Button',{
                            props: {
                                type: 'default',
                                size: 'small',
                                disabled: params.row.verifyStatus!=='0'?true:false
                            },
                            style: {
                                margin: '0 5px 0 0'
                            },
                            on: {
                                click: (event) => {
                                    this.increaseinventory(params.row);
                                }
                            }
                        },'调拨'),
                        h('Poptip',{
                            props: {
                                confirm: true,
                                title: '您确定要拒绝该库存申请吗?',
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
                                disabled: params.row.verifyStatus!=='0'?true:false
                            },
                            style: {
                                margin: '0 5px 0 0'
                            },
                        },'拒绝')
                        ]),
                    ])
                }
            }
            ];
        },
        searchStockApplication () {
            let totalSearchData = this.search(this.applications, {merchantName: this.searchStationName});
            this.initPage(totalSearchData);
        },
        initPage(data){
            //获取查询的数据并数据模型
            this.totalData = data;
            //数据总数量
            this.total = this.totalData.length;
            //处理默认首页显示
            if(this.totalData.length < this.pageSize){
                this.stockData = this.totalData;
            }else{
                this.stockData = this.totalData.slice(0,this.pageSize);
            }
            //重新设置成显示第一页
            this.$nextTick(function(){
                this.$refs['stockpage'].currentPage = 1;
            })
        },
        //处理分页-页数改变
        changepage(index){
            var _start = ( index - 1 ) * this.pageSize;
            var _end = index * this.pageSize;
            this.stockData = this.totalData.slice(_start,_end);
        },
        inquiryStock(){
            let searchOptions = {
                
            };
            this.$http.post("/admin/inquiryMerchantInventoryApplication", this.common.request(searchOptions))  
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
        reject (row) {
            this.boss = '2';
            this.increaseinventoryok(row);
        },
        increaseinventory (row) {
            this.boss = '1';
            this.showInventory = true;
            this.diaobo = row;
        },
        increaseinventorycancel () {
            this.showInventory = false;
        },
        increaseinventoryok (row) {
            if (this.boss === '1') {
                this.showInventory = false;
                var options={
                    actionType:'APPROVE',
                    'merchantInventoryApplicationUuid':this.diaobo.merchantInventoryApplicationUuid
                }
            } else {
                var options={
                    actionType:'REJECT',
                    'merchantInventoryApplicationUuid':row.merchantInventoryApplicationUuid
                }
            }
            this.$http.post("/admin/changeMerchantInventoryApplication", this.common.request(options))
			.then(response => {
				if(response.data.body.status.statusCode == 0) {
					var data = response.data.body.data;
					this.$Notice.success({
                            title: '已成功调拨',
                            duration: 2
                        });
                        this.inquiryStock();
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
        exportStock () {
        this.$refs.stockTable.exportCsv({
                            filename: '库存明细'
                        });
        },
        viewstation () {
            this.$router.push({
                                name: 'stationdetail',
                                query:{merchantInventoryApplicationUuid: row.merchantInventoryApplicationUuid}
                            });
        }

    },
    created () {
        this.getData();
        this.inquiryStock();
    }
};
</script>
