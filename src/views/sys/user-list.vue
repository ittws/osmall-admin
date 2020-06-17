<style lang="less">
    @import '../../styles/common.less';
    @import './user-list.less';
</style>

<template>
    <div>
        <Row class="margin-top-10">
            <Col span="24">
                <Card>
                    <p slot="title">
                        <Icon type="ios-person"></Icon>
                         账户列表
                    </p>
                    <Row>
                        <Button icon="plus" type="primary" @click="add()">新增账户</Button>
                        <div class="f_r">
                            <Input v-model="searchId" @on-change="handleSearch" icon="search" placeholder="请输入账户名搜索" style="width: 150px" />
                        </div>
                    </Row>
                    
                    <Row class="margin-top-10">
                        <Col span="24">
                            <div>
                                <Table :columns="userColumn" :data="userData" border stripe :loading="loading"></Table>
                            </div>
                        </Col>
                    </Row>
                    <Row class="margin-top-10">
                        <Page ref="userpage" :total="total" size="small" :pageSize="pageSize" @on-change="changepage" show-total show-elevator></Page>
                    </Row>
                    <Modal
                        v-model="editModel"
                        title="编辑账户">
                        <Form :model="editRow" :label-width="80">
                            <FormItem label="账户名">
                                <Input v-model='editRow.id'></Input>
                            </FormItem>
                            <FormItem label="手机号码">
                                <Input v-model='editRow.mobileNo'></Input>
                            </FormItem>
                        </Form>
                        <div slot="footer">
                            <Button type="text" @click="cancel">取消</Button>
                            <Button type="primary" @click="editok('editForm')">确定</Button>
                        </div>
                    </Modal>
                    <Modal
                        v-model="addModel"
                        ref="addModel"
                        title="新增账户">
                        <Form ref="addForm" :model="addRow" :label-width="80" :rules="ruleValidate">
                            <FormItem label="账户名" prop="id">
                                <Input v-model='addRow.id'></Input>
                            </FormItem>
                            <FormItem label="手机号码" prop="mobileNo">
                                <Input v-model='addRow.mobileNo'></Input>
                            </FormItem>
                            
                        </Form>
                        <span class="text-help">注: 默认密码为123456</span>
                        <div slot="footer">
                            <Button type="text" @click="cancel">取消</Button>
                            <Button type="primary" @click="addok('addForm')">确定</Button>
                        </div>
                    </Modal>
                    <Modal
                        v-model="resetModel"
                        title="重置密码">
                        <Form :model="resetRow" :label-width="120">
                            <FormItem label="新密码">
                                <Input type="password" v-model='resetRow.newPassword'></Input>
                            </FormItem>
                            <FormItem label="再次输入新密码">
                                <Input type="password" v-model='resetRow.newPasswordRepeat'></Input>
                            </FormItem>                            
                        </Form>
                        <div slot="footer">
                            <Button type="text" @click="cancel">取消</Button>
                            <Button type="primary" @click="resetok('resetForm')">确定</Button>
                        </div>
                    </Modal>
                    <Modal
                        v-model="editRoleModel"
                        title="分配角色"
                        @on-ok="editroleok"
                        @on-cancel="cancel">
                        <Form :model="editRow" :label-width="80">
                            <FormItem label="角色">
                                <CheckboxGroup v-model="editRow.roles">
                                    <Checkbox :label="item.roleName" v-for="item in roleslist" :key="item.id"></Checkbox>
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
import expandRow from './components/user-list-table-expand.vue';
export default {
    components: {
        expandRow
    },
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
            roleslist:[],
            searchName:'',
            searchId:'',
            total:0,
            pageSize:8,
            ruleValidate: {
                id: [
                    { required: true, message: '请输入账户名', trigger: 'blur' },
                    { type: 'string',  max: 20, message: '账户名不大于20个字符', trigger: 'blur' }
                ],
                mobileNo: [
                    { required: true, message: '请输入手机号码', trigger: 'blur' }
                ]
            }
        }
    },
    methods: {
        getData () {
            this.userColumn = [
            {
                title: '账户名',
                align: 'center',
                key: 'id',
                width: 150,
                sortable: true
            },
             {
                title: '手机号码',
                align: 'center',
                key: 'mobileNo',
                width: 120,
                sortable: true
            },
            {
                title: '角色',
                align: 'center',
                render: (h, params) => {
                    const roles = params.row.roles;
                    let text = '';
                    if(roles){
                        if(roles.length == 1)
                            text = roles[0];
                        else if(roles.length > 1){
                            roles.forEach(function(item,index){
                                if(index===roles.length-1)
                                    text = text + item;
                                else
                                    text = text + item + ', ';
                            });
                        }
                    }
                    
                    return h('Span', {
                        props: {
                            
                        }
                    }, text);
                },
                filters: this.roles,
                filterMultiple: true,
                filterMethod (value, row) {
                    if(row.roles){
                        const roleNames = JSON.stringify(row.roles);
                        return roleNames.indexOf(value) >= 0;
                    }
                }
            },
            {
                title: '状态',
                align: 'center',
                width: 120,
                key: 'status',
                render: (h, params) => {
                    const row = params.row;
                    const color = (row.active ? 'green' : 'red');
                    const text = (row.active ? '已启用' : '已停用');

                    return h('Tag', {
                        props: {
                            color: color
                        }
                    }, text);
                },
                filters: [
                    {
                        label: '已启用',
                        value: true
                    },
                    {
                        label: '已停用',
                        value: false
                    }
                ],
                filterMultiple: false,
                filterMethod (value, row) {
                    return row.active === value;
                }
            },
            {
                title: '操作',
                align: 'center',
                width: 320,
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
                        h('Button',{
                            props: {
                                type: 'info',
                                size: 'small'
                            },
                            style: {
                                margin: '0 5px 0 0'
                            },
                            on: {
                                click: (event) => {
                                    this.editrole(params.row);
                                }
                            }
                        },'分配角色'),
                        params.row.active ? 
                        h('Poptip',{
                            props: {
                                confirm: true,
                                title: '您确定要停用该用户吗?',
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
                                title: '您确定要启用该用户吗?',
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
                        },'重置密码'),
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
            }];
            this.initPage(this.roles);
            //this.loading = false;

        },
        initPage(data){
            //获取查询的数据并数据模型
            this.totalData = data;
            //数据总数量
            this.total = this.totalData.length;
            //处理默认首页显示
            if(this.totalData.length < this.pageSize){
                this.userData = this.totalData;
            }else{
                this.userData = this.totalData.slice(0,this.pageSize);
            }
            //重新设置成显示第一页
            this.$nextTick(function(){
                this.$refs['userpage'].currentPage = 1;
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
            let totalSearchData = this.search(this.roles, {id: this.searchId});
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
            var options={
              "actionType":"DELETE",
              id:row.id,
            }
            this.$http.post("/admin/changeAdmin",this.common.request(options))
            .then(res=>{
                if(res.data.body.status.statusCode==0){
                    this.$Notice.success({
                        title: '成功',
                        desc: '账户已删除',
                        duration: 2
                    });
                    this.initMain();
                }else{
                    this.$Notice.success({
                        title: '失败',
                        desc: res.data.body.status.errorDesc,
                        duration: 2
                    });
                }
            },res=>{
                this.$Notice.success({
                        title: '请求失败',
                        desc: '请稍后重试',
                        duration: 2
                    });
            })
        },
        disable (row) {
            var options={
              "actionType":"DISABLE",
              "id":row.id,
            }
            this.$http.post("/admin/changeAdmin",this.common.request(options))
            .then(res=>{
                if(res.data.body.status.statusCode==0){
                    this.$Notice.success({
                        title: '成功',
                        desc: '账户已停用',
                        duration: 2
                    });
                    this.initMain();
                }else{
                    this.$Notice.success({
                        title: '失败',
                        desc: res.data.body.status.errorDesc,
                        duration: 2
                    });
                }
            },res=>{
                this.$Notice.success({
                        title: '请求失败',
                        desc: '请稍后重试',
                        duration: 2
                    });
            })
        },
        enable (row) {
            var options={
              "actionType":"ENABLE",
              "id":row.id,
            }
            this.$http.post("/admin/changeAdmin",this.common.request(options))
            .then(res=>{
                if(res.data.body.status.statusCode==0){
                    this.$Notice.success({
                        title: '成功',
                        desc: '账户已启用',
                        duration: 2
                    });
                    this.initMain();
                }else{
                    this.$Notice.success({
                        title: '失败',
                        desc: res.data.body.status.errorDesc,
                        duration: 2
                    });
                }
            },res=>{
                this.$Notice.success({
                        title: '请求失败',
                        desc: '请稍后重试',
                        duration: 2
                    });
            })
        },
        editok (name) {
            this.editModel = false;
                	var options={
                	  "actionType":"MODIFY",
                      "adminUuid":this.editRow.adminUuid,
                      "id":this.editRow.id,
                      "mobileNo":this.editRow.mobileNo,
                    }
        			this.$http.post("/admin/changeAdmin",this.common.request(options))
                	.then(res=>{
                		if(res.data.body.status.statusCode==0){
                			this.$Notice.success({
        		                title: '成功',
        		                desc: '账户已修改',
        		                duration: 2
        		            });
        		            this.initMain();
                		}else{
                			this.$Notice.success({
        		                title: '失败',
        		                desc: res.data.body.status.errorDesc,
        		                duration: 2
        		            });
                		}
                	},res=>{
                		this.$Notice.success({
        		                title: '失败',
        		                desc: 请稍后重试,
        		                duration: 2
        		            });
                	})
        },
        editroleok () {
            this.editRoleModel = false;
            var arr =[];
            this.editRow.roles.forEach(function(val,ind){
                var obj = {
                    "roleDTO":{
                        "name":val
                    }
                }
                arr.push(obj);
            })
        	var options={
                "adminUuid":this.editRow.adminUuid,
        		"id":this.editRow.id,
		  		"adminRoleList":arr
            }
			this.$http.post("/admin/changeAdminRole",this.common.request(options))
        	.then(res=>{
        		if(res.data.body.status.statusCode==0){
        			this.$Notice.success({
		                title: '成功',
		                desc: '用户角色已分配',
		                duration: 2
		            });
		            this.initMain();
        		}else{
        			this.$Notice.success({
		                title: '请求失败',
		                desc: res.data.body.status.errorDesc,
		                duration: 2
		            });
        		}
        	},res=>{
        		this.$Notice.success({
	                title: '请求失败',
	                desc: res.data.body.status.errorDesc,
	                duration: 2
	            });
        	})
            
        },
        addok (name) {
             this.addModel = false;
                	var options={
                       "actionType":"ADD",
                       "id":this.addRow.id,
                       "mobileNo":this.addRow.mobileNo,
                       "dept":this.addRow.dept,
                    }
        			this.$http.post("/admin/changeAdmin",this.common.request(options))
                	.then(res=>{
                		if(res.data.body.status.statusCode==0){
                			this.$Notice.success({
                                title: '成功',
                                desc: '账户已添加',
                                duration: 2
                            });
                            this.initMain();
                		}else{
                			this.$Notice.success({
        		                title: '失败',
        		                desc: res.data.body.status.errorDesc,
        		                duration: 2
        		            });
                		}
                	},res=>{
                		this.$Notice.success({
                                title: '失败',
                                desc: '请稍后重试',
                                duration: 2
                            });
                	})
        },
        resetok (name) {
            this.resetModel = false;   
                    if(this.resetRow.newPassword != this.resetRow.newPasswordRepeat){
                        this.$Message.error('两次密码输入不一致');
                        return false;
                    }
                	var options={
                    	"id":this.resetRow.id,
        				"newPassword":this.resetRow.newPassword
                    }
        			this.$http.post("/admin/resetPassword",this.common.request(options))
                    .then(res=>{
                        if(res.data.body.status.statusCode==0){
                            this.$Notice.success({
                                title: '成功',
                                desc: '密码已重置',
                                duration: 2
                            });
                            this.initMain();
                        }else{
                            this.$Notice.error({
                                title: '失败',
                                desc: res.data.body.status.errorDesc,
                                duration: 2
                            });
                        }
                    },res=>{
                        this.$Notice.error({
                            title: '失败',
                            desc: '请稍后重置',
                            duration: 2
                        });
                    })
        },
        initMain(){
            this.loading = true;
            var options={
            }
            this.$http.post("/admin/inquiryAdmin",this.common.request(options))
            .then(response=>{
                if(response.data.body.status.statusCode==0){
                    var roles = response.data.body.data.admins;
                    var self=this;
                    self.roles=[];
                    roles.forEach(function(val,ind){
                        var role ={
                            id: val.id,
                            adminUuid:val.adminUuid,
                            mobileNo: val.mobileNo,
                            dept: '暂无',
                            roles: [],
                            active:val.active,
                            memo:'无'
                        }
                        val.adminRoleList.forEach(function(value,index){
                            role.roles.push(value.roleDTO.name)
                        })
                    self.roles.push(role);
                    })
                    this.loading = false;
                    this.roles=self.roles;
                    this.getData();
                }else{
                    this.$Message.error(response.data.body.status.errorDesc);
                    this.loading = false;
                }
            },response=>{
                this.loading = false;
                this.$Message.error('失败，请稍后重试');
            })		
        },
        cancel () {
            this.editRoleModel = false;
            this.resetModel = false;
            this.editModel = false;
            this.addModel = false;   
        }
    },
    created () {
        this.initMain();
        var options={
            }
            this.$http.post("/admin/inquiryRole",this.common.request(options))
            .then(response=>{
                if(response.data.body.status.statusCode==0){
                    var roles = response.data.body.data.roles;
                    this.roleslist=roles;
                }else{
                    this.$Message.error(response.data.body.status.errorDesc);
                }
            },response=>{
                this.$Message.error('失败，请稍后重试');
            })
    }
};
</script>
