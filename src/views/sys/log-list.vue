<style lang="less">
    @import '../../styles/common.less';
</style>

<template>
    <div>
        <Row class="margin-top-10">
            <Col span="24">
                <Card>
                    <p slot="title">
                        <Icon type="ios-person"></Icon>
                         日志列表
                    </p>
                    <Row>
                        <RadioGroup v-model="dateSearchType" @on-change="xuanze1">
                            <Radio label="1">今日</Radio>
                            <Radio label="2">昨日</Radio>
                            <Radio label="3">最近七日</Radio>
                            <Radio label="4">自定义时间段</Radio>
                                <DatePicker v-model="customsj" @click.native="xuanze" type="daterange" placement="bottom-end" placeholder="日志日期" style="width: 200px"></DatePicker>
                            <Select clearable v-model="searchOrderType" placeholder="日志类型" style="width: 120px"  @click.native="handleSearch1">
                                <Option value="人工日志">人工日志</Option>
                                <Option value="系统日志">系统日志</Option>
                            </Select>
                            <Select clearable v-model="orderStatus" placeholder="日志分类" style="width: 120px"  @click.native="handleSearch2">
                                <Option v-for="item in categories" :value="item" :key="item"></Option>
                            </Select>
                            <Button  type="success" @click="searchData()">查询</Button>
                        </RadioGroup>
                        <div class="f_r">
                            <Button  icon="plus" type="default" @click="add()">日志录入</Button>
                        </div>
                    </Row>
                    
                    <Row class="margin-top-10">
                        <Col span="24">
                            <div>
                                <Table :columns="logColumn" :data="logData" border stripe :loading="loading"></Table>
                            </div>
                        </Col>
                    </Row>
                    <Row class="margin-top-10">
                        <Page ref="logpage" :total="total" size="small" :pageSize="pageSize" @on-change="changepage" show-total show-elevator></Page>
                    </Row>
                    <Modal
                        v-model="addModel"
                        ref="addModel"
                        title="日志录入">
                        <Form ref="addRow" :model="addRow" :label-width="80">
                            <FormItem label="日志内容" prop="id">
                                <Input type="textarea" v-model='addRow.logDetail'></Input>
                            </FormItem>
                            
                        </Form>
                        <div slot="footer">
                            <Button type="text" @click="cancel">取消</Button>
                            <Button type="primary" @click="addok('addRow')">确定</Button>
                        </div>
                    </Modal>
                </Card>
            </Col>
        </Row>
    </div>
</template>

<script>
import {ajaxLogListData} from './data/log-list-data.js';
export default {
    components: {
        
    },
    data () {
        return {
            logColumn:[],
            loading: true,
            addModel: false,
            editRoleModel: false,
            editRow: {},
            addRow: {},
            resetRow: {},
            categories:[],
            userColumn: [],
            totalData:[],
            logData: [],
            searchName:'',
            searchId:'',
            total:0,
            pageSize:8,
            dateSearchType:'3',
            orderStatus:'',
            customsj:[],
            loading: true,
            searchOrderType:'',
        }
    },
    methods: {
        getData () {
            this.logColumn = [
            {
                title: '日期',
                align: 'center',
                key: 'logDate',
                width: 150,
                sortable: true
            },
            {
                title: '账户名',
                align: 'center',
                key: 'logUserId',
                width: 150,
            },
            {
                title: '日志类型',
                align: 'center',
                key: 'logType',
                width: 100,
            },
            {
                title: '日志分类',
                align: 'center',
                key: 'logCategory',
                 width: 100,
            },
            {
                title: '内容',
                align: 'center',
                key:'logDetail',
            },
            {
                title: '操作',
                align: 'center',
                width:80,
                render: (h, params) => {
                    return h('div', [
                        h('Poptip',{
                            props: {
                                confirm: true,
                                title: '您确定要删除这条数据吗?',
                                transfer: true
                            },
                            on: {
                                'on-ok': () => {
                                    this.delJournal(params.row);
                                }
                            }
                        },[
                            h('Button',{
                            props: {
                                type: 'error',
                                size: 'small',
                                disabled: params.row.logType==='系统日志'?true:false
                            },
                            style: {
                                margin: '0 5px 0 0',
                            },
                        },'删除')
                        ])
                    ])
                }
            }
            ];
        },
        handleSearch1(){
                this.dateSearchType=null;
                this.customsj = null;
                this.orderStatus = null
        },
        handleSearch2(){
                this.dateSearchType=null;
                this.customsj = null;
                this.searchOrderType = null;
        },
        xuanze1(){
            this.customsj = null;
            this.searchOrderType = null;
            this.orderStatus = null
        },
        xuanze(){
            this.dateSearchType="4";
            this.searchOrderType = null;
            this.orderStatus = null
        },
        initPage(data){
            //获取查询的数据并数据模型
            this.totalData = data;
            //数据总数量
            this.total = this.totalData.length;
            //处理默认首页显示
            if(this.totalData.length < this.pageSize){
                this.logData = this.totalData;
            }else{
                this.logData = this.totalData.slice(0,this.pageSize);
            }
            //重新设置成显示第一页
            this.$nextTick(function(){
                this.$refs['logpage'].currentPage = 1;
            })
        },
        //处理分页-页数改变
        changepage(index){
            var _start = ( index - 1 ) * this.pageSize;
            var _end = index * this.pageSize;
            this.logData = this.totalData.slice(_start,_end);
        },
        searchData( ){
            this.loading = true;
            let searchOptions = {};
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
                keyArray.push('LOGDATE');
                searchOptions.logDateStart = startDate;
                searchOptions.logDateEnd = endDate;
            }
            //日志类型
            if (this.searchOrderType) {
              keyArray.push('LOGTYPE');
              searchOptions.logType = this.searchOrderType;
            }
            //日志分类
            if (this.orderStatus) {
              keyArray.push('LOGCATEGORY');
              searchOptions.logCategory = this.orderStatus;
            }
            // if (this.Landname) {
            //   keyArray.push('NAME');
            //   searchOptions.name = this.Landname;
            // }
            searchOptions.keyArray = keyArray;
            this.$http.post("/admin/searchSysLog", this.common.request(searchOptions))  
            .then(response => {
                this.loading = false;
                if(response.data.body.status.statusCode==0){
                    var data = response.data.body.data;
                    this.initPage(data.logs);
                }else{
                    this.$Message.error(response.data.body.status.errorDesc);
                }
            }, response => {  
                this.$Message.error(response.data.body.status.errorDesc);
                this.loading = false;
            })
        },
        inquiryMember(){
            let searchOptions = {
            };
            this.$http.post("/admin/inquirySysLogCategory", this.common.request(searchOptions))  
            .then(response => {
                if(response.data.body.status.statusCode==0){
                    var data = response.data.body.data;
                    this.categories = data.categories;
                    this.searchData();
                }else{
                    this.$Message.error(response.data.body.status.errorDesc);
                }
            }, response => {  
                this.$Message.error(response.data.body.status.errorDesc);
            })
        },
        add () {
            this.addModel = true;
        },
        delJournal(row) {
				this.addModel = false;
				var options = {
                    "actionType": "DELETE",
                    "sysLogUuid": row.sysLogUuid
            }
			this.$http.post("/admin/changeSysLog", this.common.request(options))
			.then(response => {
				if(response.data.body.status.statusCode == 0) {
					var data = response.data.body.data;
					this.$Notice.success({
						desc: '已经成功删除日志',
						duration: 2
                    });
                    this.searchData();
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
        addok(name) {
				this.addModel = false;
				var options = {
                    "actionType": "ADD",
                    "logDetail": this.addRow.logDetail
            }
			this.$http.post("/admin/changeSysLog", this.common.request(options))
			.then(response => {
				if(response.data.body.status.statusCode == 0) {
					var data = response.data.body.data;
					this.$Notice.success({
						desc: '已经成功录入日志',
						duration: 2
                    });
                    this.searchData();
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
        cancel () {
            this.addModel = false;
        }
    },
    created () {
        this.Landname = localStorage["name"]
        this.inquiryMember();
        this.getData();
        
    }
};
</script>
