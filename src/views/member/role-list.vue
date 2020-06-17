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
                        title="编辑角色"
                        @on-ok="editok"
                        @on-cancel="cancel">
                        <Form :model="formItem" :label-width="80">
                            <FormItem label="角色名称">
                                <Input v-model='editRow.name'></Input>
                            </FormItem>
                            <FormItem label="角色描述">
                                <Input v-model='editRow.description'></Input>
                            </FormItem>
                        </Form>
                    </Modal>
                    <Modal
                        v-model="addModel"
                        title="新增角色"
                        @on-ok="addok"
                        @on-cancel="cancel">
                        <Form :model="formItem" :label-width="80">
                            <FormItem label="角色名称">
                                <Input v-model='editRow.name'></Input>
                            </FormItem>
                            <FormItem label="角色描述">
                                <Input v-model='editRow.description'></Input>
                            </FormItem>
                        </Form>
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
                                        <CheckboxGroup v-model="social">
                                            <Checkbox :label="functionItem.functionName" v-for="functionItem in permissionItem.functions">
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
import {ajaxRoleListData,ajaxPermissionListData} from './data/role-list-data.js';
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
                        console.log(tags);
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
            this.roleData = ajaxRoleListData;
            this.permissionListData = ajaxPermissionListData;
            this.loading = false;

        },
        edit (row) {
            this.editModel = true;
            this.editRow = row;
        },
        editpermission (row) {
            this.editPermissionModel = true;
            this.editPermissionRow = row;
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
                desc: '角色已删除',
                duration: 2
            });
            this.getData();
        },
        editok () {
            this.$Notice.success({
                title: '成功',
                desc: '角色信息已保存',
                duration: 2
            });
            this.getData();
        },
        addok () {
            this.$Notice.success({
                title: '成功',
                desc: '角色信息已保存',
                duration: 2
            });
            this.getData();
        },
        editpermissionok () {
            this.$Notice.success({
                title: '成功',
                desc: '权限已修改',
                duration: 2
            });
            this.getData();
        },
        cancel () {
            
        }
    },
    created () {
        this.getData();
    }
};
</script>
