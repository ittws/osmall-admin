<style lang="less">
    @import '../../styles/common.less';
</style>

<template>
    <div>
        <Row class="margin-top-10">
            <Col span="24">
                <Card>
                    <p slot="title">
                        <Icon type="network"></Icon>
                         部门列表
                    </p>
                    <Row>
                        <Button icon="plus" type="primary" @click="add()">新增部门</Button>
                    </Row>
                    <Row class="margin-top-10">
                        <Col span="24">
                            <div>
                                <Table :loading="loading" :columns="deptColumn" :data="deptData" border stripe></Table>
                                
                            </div>
                        </Col>
                    </Row>
                    <Modal
                        v-model="editModel"
                        title="编辑部门"
                        @on-ok="editok"
                        @on-cancel="cancel">
                        <Form :model="formItem" :label-width="80">
                            <FormItem label="部门名称">
                                <Input v-model='editRow.name'></Input>
                            </FormItem>
                            <FormItem label="部门描述">
                                <Input type="textarea" :rows="4" v-model='editRow.description'></Input>
                            </FormItem>  
                        </Form>
                    </Modal>
                    <Modal
                        v-model="addModel"
                        title="新增部门"
                        @on-ok="addok"
                        @on-cancel="cancel">
                        <Form :model="formItem" :label-width="80">
                            <FormItem label="部门名称">
                                <Input v-model='addRow.name'></Input>
                            </FormItem>
                            <FormItem label="部门描述">
                                <Input v-model='addRow.description'></Input>
                            </FormItem>
                        </Form>
                    </Modal>
                </Card>
            </Col>
        </Row>
    </div>
</template>

<script>
import {ajaxDeptListData} from './data/dept-list-data.js';
export default {
    data () {
        return {
            loading: true,
            formItem:new Object(),
            editModel: false,
            addModel: false,
            editRow: {},
            addRow: {},
        }
    },
    methods: {
        getData () {
            this.deptColumn = [
            {
                title: '部门名称',
                align: 'center',
                key: 'name',
                width: 150,
                sortable: true
            },
            {
                title: '部门描述',
                align: 'center',
                key: 'description'
            },
            {
                title: '操作',
                align: 'center',
                width: 150,
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
            }];
            this.deptData = ajaxDeptListData;
            this.loading = false;

        },
        edit (row) {
            this.editModel = true;
            this.editRow = row;
        },
        add () {
            this.addModel = true;
        },
        del (row) {
            this.$Notice.success({
                title: '成功',
                desc: '部门已删除',
                duration: 2
            });
            this.getData();
        },
        editok () {
            this.$Notice.success({
                title: '成功',
                desc: '部门信息已保存',
                duration: 2
            });
            this.getData();
        },
        addok () {
            this.$Notice.success({
                title: '成功',
                desc: '部门信息已保存',
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
