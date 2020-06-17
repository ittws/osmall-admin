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
                         商户账户列表
                    </p>
                    <Row>
                        <div class="f_r">
                            <Input v-model="searchName" @on-change="handleSearch" icon="search" placeholder="商户名称搜索" style="width: 150px" />
                            <Input v-model="searchId" @on-change="handleSearch" icon="search" placeholder="商户号搜索" style="width: 150px" />
                            <Input v-model="searchLoginId" @on-change="handleSearch" icon="search" placeholder="账户名搜索" style="width: 150px" />
                        </div>
                    </Row>
                    <Row class="margin-top-10">
                        <Col span="24">
                            <div>
                                <Table :columns="merchantAccountColumn" :data="merchantAccountData" border stripe></Table>
                                
                            </div>
                        </Col>
                    </Row>
                    <Row class="margin-top-10">
                        <Page ref="merchangeaccountpage" :total="total" size="small" :pageSize="pageSize" @on-change="changepage" show-total show-elevator></Page>
                    </Row>
                    <Modal
                        v-model="editModel"
                        title="编辑账户"
                        @on-ok="editok"
                        @on-cancel="cancel">
                        <Form :model="editRow" :label-width="80">
                            <FormItem label="账户名">
                                <Input v-model='editRow.id'></Input>
                            </FormItem>
                            <FormItem label="姓名">
                                <Input v-model='editRow.name'></Input>
                            </FormItem>
                            <FormItem label="手机号码">
                                <Input v-model='editRow.mobileNo'></Input>
                            </FormItem>
                            <FormItem label="部门">
                                <Select clearable v-model="editRow.dept">
                                    <Option v-for="item in depts" :value="item.value" :key="item.value">{{ item.label}}</Option>
                                </Select>
                            </FormItem>
                        </Form>
                    </Modal>
                    <Modal
                        v-model="addModel"
                        ref="addModel"
                        title="新增账户">
                        <Form ref="addRow" :model="addRow" :label-width="80" :rules="ruleValidate">
                            <FormItem label="账户名" prop="id">
                                <Input v-model='addRow.id'></Input>
                            </FormItem>
                            <FormItem label="姓名" prop="name">
                                <Input v-model='addRow.name'></Input>
                            </FormItem>
                            <FormItem label="手机号码" prop="mobileNo">
                                <Input v-model='addRow.mobileNo'></Input>
                            </FormItem>
                            <FormItem label="部门">
                                <Select clearable v-model="addRow.dept">
                                    <Option v-for="item in depts" :value="item.value" :key="item.value">{{ item.label}}</Option>
                                </Select>
                            </FormItem>
                            
                        </Form>
                        <span class="text-help">注: 默认密码为12345678</span>
                        <div slot="footer">
                            <Button type="text" @click="cancel">取消</Button>
                            <Button type="primary" @click="addok('addRow')">确定</Button>
                        </div>
                    </Modal>
                    <Modal
                        v-model="resetModel"
                        title="重置密码"
                        @on-ok="resetok"
                        @on-cancel="cancel">
                        <Form :model="resetRow" :label-width="120">
                            <FormItem label="新密码">
                                <Input type="password" v-model='resetRow.newPassword'></Input>
                            </FormItem>
                            <FormItem label="再次输入新密码">
                                <Input type="password" v-model='resetRow.newPasswordRepeat'></Input>
                            </FormItem>                            
                        </Form>
                    </Modal>
                    <Modal
                        v-model="editRoleModel"
                        title="分配角色"
                        @on-ok="editroleok"
                        @on-cancel="cancel">
                        <Form :model="editRow" :label-width="80">
                            <FormItem label="角色">
                                <CheckboxGroup v-model="editRow.roles">
                                    <Checkbox label="经理"></Checkbox>
                                    <Checkbox label="主管"></Checkbox>
                                    <Checkbox label="会计"></Checkbox>
                                </CheckboxGroup>
                            </FormItem>
                            
                        </Form>
                    </Modal>
                </Card>
            </Col>
        </Row>
    </div>
</template>

<script>
import {ajaxMerchantAccountListData} from './data/merchant-account-list-data.js';
export default {
    data () {
        return {
            loading: true,
            editModel: false,
            resetModel: false,
            addModel: false,
            editRoleModel: false,
            editRow: {},
            addRow: {},
            resetRow: {},
            userColumn: [],
            totalData:[],
            userData: [],
            searchName:'',
            searchId:'',
            total:0,
            pageSize:8,
            
        }
    },
    methods: {
        getData () {
            this.merchantAccountColumn = [
            {
                title: '商家名称',
                align: 'center',
                key: 'merchantName',
                sortable: true
            },
            {
                title: '商户号',
                align: 'center',
                key: 'merchantId',
                width: 150,
                sortable: true
            },
            {
                title: '账户名',
                align: 'center',
                key: 'merchantLoginId',
                width: 150,
            },
            {
                title: '状态',
                align: 'center',
                width: 120,
                key: 'status',
                render: (h, params) => {
                    const row = params.row;
                    const color = (row.merchantAccountStatus ? 'green' : 'red');
                    const text = (row.merchantAccountStatus ? '正常' : '停用');

                    return h('Tag', {
                        props: {
                            color: color
                        }
                    }, text);
                },
                filters: [
                    {
                        label: '正常',
                        value: true
                    },
                    {
                        label: '已停用',
                        value: false
                    }
                ],
                filterMultiple: false,
                filterMethod (value, row) {
                    return row.merchantAccountStatus === value;
                }
            },
            {
                title: '操作',
                align: 'center',
                width: 180,
                render: (h, params) => {
                    return h('div', [
                        params.row.merchantAccountStatus ? 
                        h('Poptip',{
                            props: {
                                confirm: true,
                                title: '您确定要停用该账户吗?',
                                transfer: true
                            },
                            on: {
                                'on-ok': () => {
                                    this.disable(params.row);
                                }
                            }
                        },[
                            h('Button',{
                            style: {
                                margin: '0 5px 0 0'
                            },
                            props: {
                                type: 'info',
                                size: 'small'
                            }
                        },'停用')]):
                        h('Poptip',{
                            props: {
                                confirm: true,
                                title: '您确定要启用该账户吗?',
                                transfer: true
                            },
                            on: {
                                'on-ok': () => {
                                    this.enable(params.row);
                                }
                            }
                        },[
                            h('Button',{
                            style: {
                                margin: '0 5px 0 0'
                            },
                            props: {
                                type: 'success',
                                size: 'small'
                            }
                        },'启用')]),
                        h('Button',{
                            props: {
                                type: 'warning',
                                size: 'small'
                            },
                            style: {
                                margin: '0 5px 0 0'
                            },
                            on: {
                                click: (event) => {
                                    this.reset(params.row);
                                }
                            }
                        },'重置密码')
                        
                    ])
                }
            }];
            this.initPage(ajaxMerchantAccountListData);
            //this.loading = false;

        },
        initPage(data){
            //获取查询的数据并数据模型
            this.totalData = data;
            //数据总数量
            this.total = this.totalData.length;
            //处理默认首页显示
            if(this.totalData.length < this.pageSize){
                this.merchantAccountData = this.totalData;
            }else{
                this.merchantAccountData = this.totalData.slice(0,this.pageSize);
            }
            //重新设置成显示第一页
            this.$nextTick(function(){
                this.$refs['merchantaccountpage'].currentPage = 1;
            })
        },
        //处理分页-页数改变
        changepage(index){
            var _start = ( index - 1 ) * this.pageSize;
            var _end = index * this.pageSize;
            this.userData = this.totalData.slice(_start,_end);
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
            let totalSearchData = this.search(ajaxMerchantAccountListData, {merchantName: this.searchName, merchantId: this.searchId, merchantLoginId: this.searchLoginId});
            this.initPage(totalSearchData);
        },
        edit (row) {
            this.editModel = true;
            this.editRow = row;
        },
        editrole (row) {
            this.editRoleModel = true;
            this.editRow = row;
        },
        add () {
            this.addModel = true;
        },
        reset (row) {
            this.resetModel = true;
            this.resetRow = row;
        },
        del (row) {
            this.$Notice.success({
                title: '成功',
                desc: '用户已删除',
                duration: 2
            });
            this.getData();
        },
        disable (row) {
            this.$Notice.success({
                title: '成功',
                desc: '用户已停用',
                duration: 2
            });
            this.getData();
        },
        enable (row) {
            this.$Notice.success({
                title: '成功',
                desc: '用户已启用',
                duration: 2
            });
            this.getData();
        },
        editok () {
            this.$Notice.success({
                title: '成功',
                desc: '用户信息已保存',
                duration: 2
            });
            this.getData();
        },
        editroleok () {
            this.$Notice.success({
                title: '成功',
                desc: '用户角色已分配',
                duration: 2
            });
            this.getData();
        },
        addok (name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                    this.$Notice.success({
                        title: '成功',
                        desc: '用户信息已保存',
                        duration: 2
                    });
                    this.addModel = false;
                    this.getData();
                } else {
                    
                }
            })
        },
        resetok () {
            this.$Notice.success({
                title: '成功',
                desc: '密码已重置',
                duration: 2
            });
        },
        cancel () {
            this.addModel = false;   
        }
    },
    created () {
        this.getData();
    }
};
</script>
