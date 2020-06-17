<style lang="less">
    @import '../../styles/common.less';
	.ivu-table-sort{
		margin-top: 13px;
	}
</style>

<template>
    <div>
        <Row class="margin-top-10">
            <Col span="24">
                <Card>
                    <p slot="title">
                         供应商列表
                    </p>
                    <Row>                        
                        <Input v-model="searchMobileNo" placeholder="联系电话" style="width: 120px" />
                        <Input v-model="searchSupplierName" placeholder="供应商名称" style="width: 150px" />
                        <Input v-model="searchSupplierAddress" placeholder="地址" style="width: 150px" />
                        <DatePicker v-model="searchregisterDate" type="daterange" placement="bottom-end" placeholder="入驻日期" style="width: 200px"></DatePicker>
                        </Radio>
                        <Button  type="success" @click="inquiryonsort()">查询</Button>
                        <div class="f_r">
                            <Button type="primary" @click="add()">新增供应商</Button>
							<Button :loading="exportLoading" type="warning" @click="exportSupplier()">导出</Button>
                        </div>
                    </Row>
                    <Row class="margin-top-10">
                        <Col span="24">
                            <div>
                                <Table class="table" @on-sort-change="onsort" :columns="supplierColumn" :data="supplierData" border stripe ref="supplierTable" :loading="loading"></Table>
                                
                            </div>
                        </Col>
                    </Row>
                    <Row class="margin-top-10">
                        <Col span="18">
                        <Page ref="supplierpage" :total="total" size="small" :pageSize="pageSize" @on-change="changepage" show-total show-elevator>
                        </Page>
                        </Col>
                    </Row>
                </Card>
            </Col>
        </Row>
        <Modal v-model="memoModal" width="400px" title="备注信息">
                <Input type="text" v-model="editvalue.memo" style="width:360px"></Input>
            <div slot="footer">
                <Button type="text" @click="memocancel">取消</Button>
                <Button type="primary" :loading="memoLoading" @click="memook()">提交</Button>
            </div>
        </Modal>
        <Modal
            :closable="false"
            :mask-closable="false"
            v-model="editmodel"
            title="修改供应商">
            <Form ref="editSupplierForm" :model="editvalue" :label-width="120" :rules="editSupplierValidate">
                <FormItem label="供应商名称" prop="supplierName">
                    <Input v-model='editvalue.supplierName' style="width:90%"></Input>
                </FormItem>
                <FormItem label="供应商地址" prop="supplierAddress">
                    <Input v-model='editvalue.supplierAddress' style="width:90%"></Input>
                </FormItem>
                <FormItem label="联系人" prop="contactName">
                    <Input v-model='editvalue.contactName' style="width:90%"></Input>
                </FormItem>
                <FormItem label="联系电话" prop="mobileNo">
                    <Input v-model='editvalue.mobileNo' style="width:90%"></Input>
                </FormItem>
                <FormItem label="描述" prop="supplierDescription">
                    <Input type="textarea" :rows="rows" v-model='editvalue.supplierDescription' style="width:90%"></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="text"  @click="editmodel=false">取消</Button>
                <Button type="primary" :loading="editLoading" @click="editok">确定</Button>
            </div>
        </Modal>
        <Modal
            :closable="false"
            :mask-closable="false"
            v-model="addmodel"
            title="新增供应商">
            <Form ref="addSupplierForm" :model="addvalue" :label-width="120" :rules="editSupplierValidate">
                <FormItem label="供应商名称" prop="supplierName">
                    <Input v-model='addvalue.supplierName' style="width:90%"></Input>
                </FormItem>
                <FormItem label="供应商地址" prop="supplierAddress">
                    <Input v-model='addvalue.supplierAddress' style="width:90%"></Input>
                </FormItem>
                <FormItem label="联系人" prop="contactName">
                    <Input v-model='addvalue.contactName' style="width:90%"></Input>
                </FormItem>
                <FormItem label="联系电话" prop="mobileNo">
                    <Input v-model='addvalue.mobileNo' style="width:90%"></Input>
                </FormItem>
                <FormItem label="描述" prop="supplierDescription">
                    <Input type="textarea" :rows="4" v-model='addvalue.supplierDescription' style="width:90%"></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="text"  @click="addmodel=false">取消</Button>
                <Button type="primary" :loading="addLoading" @click="addok">确定</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
export default {
    components: {
        
    },
    data () {
        const validateMobileNo = (rule, value, callback) => {
            if (!/^1[2345789]\d{9}$/.test(value)) {
                callback('联系电话格式错误');
            } else {
                callback();
            }   
        };
        return {
            memoModal:false,
            inventoryQuantity:1,
            registerDate:'',
            loading: false,
            exportLoading: false,
            addLoading:false,
            editLoading: false,
            memoLoading: false,
            editvalue:{},
            addvalue:{},
			searchDate:[],
            rows: 4,
            supplierColumn : [
            {
                title: '供应商名称',
                align: 'center',
                key: 'supplierName',
                width: 130
            },
            {
                title: '地址',
                align: 'center',
                 width: 280,
                key: 'supplierAddress',
            },
            {
                title: '联系人',
                align: 'center',
                key: 'contactName',
                width: 110
            },
            {
                title: '手机号码',
                align: 'center',
                key: 'mobileNo',
                width: 130
            },
			{
				title: '销量',
				align: "center",
				key: "soldUnitTotal",
				width: 270,
				sortable: 'custom',
				renderHeader: (h, params) => {
					return h('div', {
						style: {
							width:'220px',
							float:'left',
							height:'35px'
						},
					},[
						h("span",{
							style: {
								'color':'#000',
							},
						},'销量'),
						h('DatePicker', {
							props: {
								type: "daterange",
								placeholder:'选择排序日期',
								'clearable':'true',
								value: this.searchDate,
							},
							style: {
								width: "170px",
								'margin-left':'5px'
							},
							on:{
								'on-change':(event) => {
									this.searchDate = event
								}
							}
						}),
					])
				}
			},
            {
                title: '入驻日期',
                width: 140,
                align: 'center',
                key: 'registerDate',
            },
			{
			    title: '描述',
			    align: 'center',
			    key: 'supplierDescription',
				width:200,
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
                                title: '您确定要删除该供应商吗?',
                                transfer: true
                            },
                            on: {
                                'on-ok': () => {
                                    this.deletesupplier(params.row);
                                }
                            }
                        },[
                            h('Button',{
                            props: {
                                type: 'error',
                                size: 'small'
                            },
                            style: {
                                margin: '0 5px 0 0'
                            },
                        },'删除')
                        ]),
                    ])
                }
            }],
            supplierData: [],
            total:0,
            pageSize:20,
			startIndex:0,
            searchMobileNo:'',
            searchSupplierAddress:'',
            searchReferrer:'',
            searchSupplierName:'',
            searchregisterDate:null,
            showInventory:false,
            editmodel:false,
            addmodel:false,
			isonsort:'',
            editSupplierValidate: {
                    supplierName: [
                        { required: true, message: '请输入供应商名称', trigger: 'blur' }
                    ],
                    contactName: [
                        { required: true, message: '请输入联系人', trigger: 'blur' }
                    ],
                    mobileNo: [
                        { required: true, message: '请输入联系电话', trigger: 'blur' },
                        { validator:validateMobileNo,trigger:'blur' }
                    ],
                    supplierAddress: [
                        { required: true, message: '请输入供应商地址', trigger: 'blur' }
                    ]
                }
        }
    },
    methods: {
        cancelEditSupplier(){
            this.editmodel = false;
        },
        cancelAddSupplier(){
            this.addmodel = false;
        },
		onsort(order){
			if(order.order!=="normal"){
				this.startIndex=0;
				this.pageSize = 20;
				this.isonsort = order.order,
				this.searchMobileNo = '',
				this.searchSupplierName = '',
				this.searchSupplierAddress = '',
				this.inquirySupplier();
			}
		},
		inquiryonsort(order){
				this.startIndex=0;
				this.pageSize = 20;
				this.isonsort = '',
				this.searchDate = [],
				this.inquirySupplier();
		},
        inquirySupplier(){
            let searchOptions = {
                startIndex: this.startIndex,
                pageSize: this.pageSize
            };
            let keyArray = [];
            //判断是否有手机号码查询条件
            if (this.searchMobileNo) {
              keyArray.push('MOBILENO');
              searchOptions.mobileNo = this.searchMobileNo;
            }
            //判断是否有姓名查询条件
            if (this.searchSupplierName) {
              keyArray.push('SUPPLIERNAME');
              searchOptions.supplierName = this.searchSupplierName;
            }
            //判断是否有地址查询条件
            if (this.searchSupplierAddress) {
              keyArray.push('SUPPLIERADDRESS');
              searchOptions.supplierAddress = this.searchSupplierAddress;
            }
			if(this.searchDate[0]){
				let t = this.searchDate;
				keyArray.push("RANKINGDATE");
				searchOptions.rankingDateStart = t[0];
				searchOptions.rankingDateEnd = t[1];
			}
			if (this.isonsort) {
				searchOptions.sortBy="soldUnit";
				searchOptions.sorts=this.isonsort
			}
            //判断是否有注册时间查询条件
            var searchDate = this.searchregisterDate;

            if(searchDate&&searchDate[0] && searchDate[1]){
                keyArray.push('REGISTERDATE');
                var startDate = searchDate[0];
                var endDate = searchDate[1];
                searchOptions.registerDateStart = startDate;
                searchOptions.registerDateEnd = endDate;
            }
            searchOptions.keyArray = keyArray;
            this.loading = true;
            this.$http.post("/admin/searchSupplier", this.common.request(searchOptions))  
            .then(response => {  
                this.loading = false;
                if(response.data.body.status.statusCode==0){
                    var data = response.data.body.data;
                    this.supplierData = data.suppliers;
					this.total = data.total;
                }else{
                    this.$Message.error(response.data.body.status.errorDesc);
                }
            }, response => {  
                this.loading = false;
                this.$Message.error(response.data.body.status.errorDesc);
            })
        },
        getData () {
            this.inquirySupplier();
        },
        //处理分页-页数改变
        changepage(index) {
        	this.startIndex = (index - 1) * this.pageSize;
        	this.inquirySupplier();
        },
        viewsupplier (row) {
            this.$router.push({
                                name: 'supplierdetail',
                                query:{supplierUuid:row.supplierUuid}
                            });
        },
        deletesupplier (row) {
            var options={
                actionType:'DELETE',
                supplierUuid:row.supplierUuid
            }
            this.$http.post("/admin/changeSupplier", this.common.request(options))
			.then(response => {
				if(response.data.body.status.statusCode == 0) {
					var data = response.data.body.data;
					this.$Notice.success({
                            title: '供应商已删除',
                            duration: 2
                        });
                        this.inquirySupplier();
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
        edit (row) {
            this.editmodel = true;
            this.editvalue = row
        },
        add () {
            this.addmodel = true;
        },
        memo(row){
            this.memoModal = true;
            this.editvalue = row;
        },
        editok () {
            this.$refs['editSupplierForm'].validate((valid) => {
                if (valid) {
                    this.editmodel = false;
                    var options={
                        actionType: 'MODIFY',
                        supplierUuid:this.editvalue.supplierUuid,
                        supplierAddress:this.editvalue.supplierAddress,
                        supplierDescription:this.editvalue.supplierDescription,
                        supplierName: this.editvalue.supplierName,
                        contactName: this.editvalue.contactName,
                        mobileNo: this.editvalue.mobileNo
                    }
                    this.editLoading = true;
                    this.$http.post("/admin/changeSupplier", this.common.request(options))
                    .then(response => {
                        this.editLoading = false;
                        if(response.data.body.status.statusCode == 0) {
                            var data = response.data.body.data;
                            this.$Notice.success({
                                    title: '供应商信息已修改',
                                    duration: 2
                                });
                                this.inquirySupplier();
                        } else {
                            this.$Notice.success({
                                title: '失败',
                                desc: response.data.body.status.errorDesc,
                                duration: 2
                            });
                        }
                    }, response => {
                        this.editLoading = false;
                        this.$Message.error('出错了，请稍后重试');
                    })
                }else{
                     
                }
            })
            
        },
        addok () {
            this.$refs['addSupplierForm'].validate((valid) => {
                if (valid) {
                    this.addmodel = false;
                    var options={
                        actionType: 'ADD',
                        supplierUuid:this.addvalue.supplierUuid,
                        supplierAddress:this.addvalue.supplierAddress,
                        supplierDescription:this.addvalue.supplierDescription,
                        supplierName: this.addvalue.supplierName,
                        contactName: this.addvalue.contactName,
                        mobileNo: this.addvalue.mobileNo
                    }
                    this.addLoading = true;
                    this.$http.post("/admin/changeSupplier", this.common.request(options))
                    .then(response => {
                        this.addLoading = false;
                        if(response.data.body.status.statusCode == 0) {
                            var data = response.data.body.data;
                            this.$Notice.success({
                                    title: '供应商新增成功',
                                    duration: 2
                                });
                                this.inquirySupplier();
                        } else {
                            this.$Notice.success({
                                title: '失败',
                                desc: response.data.body.status.errorDesc,
                                duration: 2
                            });
                        }
                    }, response => {
                        this.addLoading = false;
                        this.$Message.error('出错了，请稍后重试');
                    })
                }else{
                     
                }
            })
            
        },
        memook () {
            var options={
                        supplierUuid:this.editvalue.supplierUuid,
                        memo:this.editvalue.memo,
                        actionType: 'MEMO'
                    }
                    this.memoLoading = true;
                    this.$http.post("/admin/updateSupplierField", this.common.request(options))
                    .then(response => {
                        this.memoLoading = false;
                        if(response.data.body.status.statusCode == 0) {
                            this.memoModal = false;
                            var data = response.data.body.data;
                            this.$Notice.success({
                                    title: '已修改备注',
                                    duration: 2
                                });
                        } else {
                            this.$Notice.success({
                                title: '失败',
                                desc: 'response.data.body.status.errorDesc',
                                duration: 2
                            });
                        }
                    }, response => {
                        this.memoLoading = false;
                        this.$Message.error('出错了，请稍后重试');
                    })
        },
        memocancel(){
            this.memoModal = false;
        },
        exportSupplier () {
            let that = this;
			let searchOptions = {
			    startIndex: that.startIndex,
			    pageSize: that.pageSize
			};
			let keyArray = [];
			//判断是否有手机号码查询条件
			if (that.searchMobileNo) {
			  keyArray.push('MOBILENO');
			  searchOptions.mobileNo = that.searchMobileNo;
			}
			//判断是否有姓名查询条件
			if (that.searchSupplierName) {
			  keyArray.push('SUPPLIERNAME');
			  searchOptions.supplierName = that.searchSupplierName;
			}
			//判断是否有地址查询条件
			if (that.searchSupplierAddress) {
			  keyArray.push('SUPPLIERADDRESS');
			  searchOptions.supplierAddress = that.searchSupplierAddress;
			}
			if(that.searchDate[0]){
				let t = that.searchDate;
				keyArray.push("RANKINGDATE");
				searchOptions.rankingDateStart = t[0];
				searchOptions.rankingDateEnd = t[1];
			}
			if (that.isonsort) {
				searchOptions.sortBy="soldUnit";
				searchOptions.sorts=that.isonsort
			}
			//判断是否有注册时间查询条件
			var searchDate = that.searchregisterDate;
			
			if(searchDate&&searchDate[0] && searchDate[1]){
			    keyArray.push('REGISTERDATE');
			    var startDate = searchDate[0];
			    var endDate = searchDate[1];
			    searchOptions.registerDateStart = startDate;
			    searchOptions.registerDateEnd = endDate;
			}
			keyArray.push('AA');
			searchOptions.keyArray = keyArray;
            that.exportLoading = true;
            that.$http.post("/admin/searchSupplier", that.common.request(searchOptions))
            .then(response => {
                that.exportLoading = false;
                if(response.data.body.status.statusCode == 0) {
                    var data = response.data.body.data;
                    var exportData= ['供应商列表',that.supplierColumn,data.suppliers]
                    that.$refs.supplierTable.exportCsv({
                            filename: exportData[0],
                            columns:exportData[1],
                            data:exportData[2],
                        });
                }
            }, response => {
                that.exportLoading = false;
            })
        },
    },
    created () {
        this.getData();
    }
};
</script>
