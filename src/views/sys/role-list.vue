<style lang="less">
    @import '../../styles/common.less';
</style>

<template>
    <div>
        <Row class="margin-top-10">
            <Col span="24">
                <Card>
                    <p slot="title">
                        <Icon type="ios-body"></Icon>
                         角色列表
                    </p>
                    <Row>
                        <Button icon="plus" type="primary" @click="add()">新增角色</Button>
                    </Row>
                    
                    <Row class="margin-top-10">
                        <Col span="24"> 
                            <div>
                                <Table :loading="loading" :columns="roleColumn" :data="roleData" border stripe></Table>
                            </div>
                        </Col>
                    </Row>
                    <Modal
                        v-model="editModel"
                        title="编辑角色">
                        <Form :model="editRow" :label-width="80">
                            <FormItem label="角色名称">
                                <Input v-model='editRow.newname'></Input>
                            </FormItem>
                        </Form>
                        <div slot="footer">
                            <Button type="text" @click="cancel">取消</Button>
                            <Button type="primary" @click="editok('editForm')">确定</Button>
                        </div>
                    </Modal>
                    <Modal
                        v-model="addModel"
                        title="新增角色">
                        <Form :model="addRow" :label-width="80">
                            <FormItem label="角色名称">
                                <Input v-model='addRow.name'></Input>
                            </FormItem>
                        </Form>
                        <div slot="footer">
                            <Button type="text" @click="cancel">取消</Button>
                            <Button type="primary" @click="addok('addForm')">确定</Button>
                        </div>
                    </Modal>
                    <Modal
                        v-model="editPermissionModel"
                        title="修改权限"
                        @on-ok="editpermissionok"
                        @on-cancel="cancel">
                        <Form :model="formItem" :label-width="80">
                            <Collapse v-model="value1">
                                <Panel :name="permissionItem.applicationName" v-for="permissionItem in permissionListData">
                                    {{permissionItem.applicationName}}
                                    <div slot="content">
                                        <CheckboxGroup>
                                            <Checkbox :label="functionItem.functionName" v-for="functionItem in permissionItem.functions" v-model="functionItem.checked">
                                                <span>{{functionItem.functionName}}</span>
                                            </Checkbox>
                                        </CheckboxGroup>
                                    </div>
                                </Panel>
                            </Collapse>
                        </Form>
                    </Modal>
                </Card>
            </Col>
        </Row>
    </div>
</template>

<script>
import expandRow from './components/role-list-table-expand.vue';
export default {
    components: {
        expandRow
    },
    data () {
        return {
            loading: true,
            formItem: new Object(),
            editModel: false,
            addModel: false,
            editPermissionModel: false,
            editRow: {},
            editPermissionRow: {},
            addRow: {},
            value1:[],
            roleColumn: [],
            roleData: [],
            permissionListData:[]
        }
    },
    methods: {
        getData () {
            this.roleColumn = [
            {
                type: 'expand',
                width: 50,
                render: (h, params) => {
                    return h(expandRow, {
                        props: {
                            row: params.row
                        }
                    })
                }
            },
            {
                title: '角色名称',
                align: 'center',
                key: 'name',
                width: 100,
            },
            {
                title: '已授权功能',
                align: 'center',
                render: (h, params) => {
                    let functions = params.row.functions;
                    if(functions){
                        let tags = [];
                        functions.forEach(function(item,index){
                            tags.push(
                                h('Tag',{
                                    props: {
                                        color: 'blue'
                                    },
                                    style: {
                                        margin: '5px 5px 5px 5px'
                                    }
                                },item.functionName),
                            );
                        });
                        return h('div', tags);
                    } 
                }
            },
            {
                title: '操作',
                align: 'center',
                width: 250,
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
                                type: 'warning',
                                size: 'small'
                            },
                            style: {
                                margin: '0 5px 0 0'
                            },
                            on: {
                                click: (event) => {
                                    this.editpermission(params.row);
                                }
                            }
                        },'功能授权'),
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
            this.roleData = this.roles;
            const a= this.functionData;
            this.permissionListData = a;
            this.loading = false;

        },
        edit (row) {
            this.editModel = true;
            this.editRow = row;
        },
        editpermission (row) {
            this.editPermissionModel = true;
                var options={
                        }
            this.$http.post("/admin/inquiryFunction",this.common.request(options))
            .then(response=>{
                if(response.data.body.status.statusCode==0){
                    var functionList = response.data.body.data.functionList;
                    var self=this;
                    self.functionData=[];
                    var boxData=[];
                    functionList.forEach(function(val,ind){
                        if(ind==0){
                            var item={
                                applicationName:val.applicationName,
                                functions: [{
                                    functionName: val.functionName,
                                    functionDescription: val.functionDesc,
                                    functionCode:val.functionCode,
                                    applicationCode:val.applicationCode
                                }]
                            }
                            boxData.push(item)
                        }else{
                            var item={
                                applicationName:val.applicationName,
                                functions: [{
                                    functionName: val.functionName,
                                    functionDescription: val.functionDesc,
                                    functionCode:val.functionCode,
                                    applicationCode:val.applicationCode
                                }]
                            }
                            var btn =true;
                            boxData.forEach(function(value,index){
                                if(value.applicationName==item.applicationName){
                                    value.functions.push(item.functions[0]);
    //      						break;
                                    btn=false;
                                    return;
                                }else{
    //      						boxData.push(item)	
    //      						return;
                                }
                            })
                            if(btn){
                                boxData.push(item)	
                            }
                        }
                    })
                    var a = boxData;
                    self.functionData=boxData;
                    this.functionData=self.functionData;
                    this.permissionListData = this.functionData;
                this.permissionListData.forEach(function(val,ind){
        
                    val.functions.forEach(function(value,index){
            
                        row.functions.forEach(function(valu,inde){
                            if(valu.functionName==value.functionName){
                                value.checked=true;
                            }else{
    //							value.checked=false;
                            }
                        })
                    })
                })
                    this.getData();
                }else{
                    this.$Message.error(response.data.body.status.errorDesc);
                }
            },response=>{
                this.$Message.error('失败，请稍后重试');
            })
            this.editPermissionRow = row;
        },
        editpermissionok () {
        	var a = this.permissionListData;
        	var arr=[];
			this.permissionListData.forEach(function(val,ind){
				val.functions.forEach(function(value,index){
					if(value.checked){
						arr.push({
							"functionCode": value.functionCode,
			          		"applicationCode": value.applicationCode
						})
					}
				})
			})
            var options={
            	"roleName": this.editPermissionRow.name,
			    "functionList":arr
            }
			this.$http.post("/admin/changePermission",this.common.request(options))
            .then(response=>{
            	if(response.data.body.status.statusCode==0){
            		this.$Notice.success({
		                title: '成功',
		                desc: '权限已修改',
		                duration: 2
                    });
	            	this.initMain();
            	}else{
            		this.$Message.error(response.data.body.status.errorDesc);
            	}
            },response=>{
            	this.$Message.error('失败，请稍后重试');
            })
            
        },
        add () {
            this.addModel = true;
        },
        del (row) {
            var options={
                "actionType": "DELETE",
                "roleName":row.name
            }
            this.$http.post("/admin/changeRole",this.common.request(options))
            .then(response=>{
                if(response.data.body.status.statusCode==0){
                    this.$Notice.success({
                        title: '成功',
                        desc: '角色已删除',
                        duration: 2
                    });
                    this.initMain();
                }else{
                    this.$Message.error(response.data.body.status.errorDesc);
                }
            },response=>{
                this.$Message.error('失败，请稍后重试');
            })
        },
        editok (name) {
            this.editModel = false;
                	var options={
                    	"actionType": "MODIFY",
                        "roleName":this.editRow.name,
                        "newRoleName":this.editRow.newname,
                    }
        			this.$http.post("/admin/changeRole",this.common.request(options))
                    .then(response=>{
                    	if(response.data.body.status.statusCode==0){
                    		this.$Notice.success({
        		                title: '成功',
        		                desc: '角色信息已修改',
        		                duration: 2
        		            });
        	            	this.initMain();
                    	}else{
                            this.$Notice.error({
                                title: '失败',
                                desc: response.data.body.status.errorDesc,
                                duration: 2
                            });
                    	}
                    },response=>{
                    	this.$Notice.error({
                                title: '失败',
                                desc: '请稍后重试',
                                duration: 2
                            });
                    })
        },
        addok (name) {
            this.addModel = false;
                	var options={
                    	"actionType": "ADD",
        			    "roleName":this.addRow.name
                    }
        			this.$http.post("/admin/changeRole",this.common.request(options))
                    .then(response=>{
                    	if(response.data.body.status.statusCode==0){
                    		this.$Notice.success({
        		                title: '成功',
        		                desc: '角色信息已保存',
        		                duration: 2
        		            });
        	            	this.initMain();
                    	}else{
                    		this.$Message.error(response.data.body.status.errorDesc);
                    	}
                    },response=>{
                    	this.$Message.error('失败，请稍后重试');
                    })
        },
         initMain(){
            var options={
            }
            this.$http.post("/admin/inquiryRole",this.common.request(options))
                .then(response=>{
                    if(response.data.body.status.statusCode==0){
                        var roles = response.data.body.data.roles;
                        var self=this;
                        self.roles=[];
                        
                        roles.forEach(function(val,ind){
                             var role =	
                                {
                                    name: val.roleName,
                                    functions:[]
                                }
                                val.functionList.forEach(function(value,index){
                                    role.functions.push({'functionName':value.functionName})
                                })
                                self.roles.push(role);
                        })
                        this.roles=self.roles;
                        this.getData();
                    }else{
                        this.$Message.error(response.data.body.status.errorDesc);
                    }
            },response=>{
                this.$Message.error('失败，请稍后重试');
            })	
        },
         inquiryFunction(){
        	var options={
                }
                this.$http.post("/admin/inquiryFunction",this.common.request(options))
                .then(response=>{
                    if(response.data.body.status.statusCode==0){
                        var functionList = response.data.body.data.functionList;
                        var self=this;
                        self.functionData=[];
                        var boxData=[];
                        functionList.forEach(function(val,ind){
                            if(ind==0){
                                var item={
                                    applicationName:val.applicationName,
                                    functions: [{
                                        functionName: val.functionName,
                                        functionDescription: val.functionDesc,
                                        functionCode:val.functionCode,
                                        applicationCode:val.applicationCode
                                    }]
                                }
                                boxData.push(item)
                            }else{
                                var item={
                                    applicationName:val.applicationName,
                                    functions: [{
                                        functionName: val.functionName,
                                        functionDescription: val.functionDesc,
                                        functionCode:val.functionCode,
                                        applicationCode:val.applicationCode
                                    }]
                                }
                                var btn =true;
                                boxData.forEach(function(value,index){
                                    if(value.applicationName==item.applicationName){
                                        value.functions.push(item.functions[0]);
        //      						break;
                                        btn=false;
                                        return;
                                    }else{
        //      						boxData.push(item)	
        //      						return;
                                    }
                                })
                                if(btn){
                                    boxData.push(item)	
                                }
                            }
                        })
                        var a = boxData;
                        self.functionData=boxData;
                        this.functionData=self.functionData;
                        this.getData();
                    }else{
                        this.$Message.error(response.data.body.status.errorDesc);
                    }
                },response=>{
                    this.$Message.error('失败，请稍后重试');
                })	
        },
        cancel () {
           this.addModel = false;
            this.editModel = false;
            this.editPermissionModel = false;
        }
    },
    created () {
        this.initMain();
        this.inquiryFunction();
    }
};
</script>
