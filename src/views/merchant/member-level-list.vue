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
                         会员等级列表
                    </p>
                    <Row>
                        <Button icon="plus" type="primary" @click="add()">新增会员等级</Button>
                    </Row>
                    
                    <Row class="margin-top-10">
                        <Col span="24">
                            <div>
                                <Table :columns="memberLevelColumn" :data="memberLevelData" border stripe></Table>
                                
                            </div>
                        </Col>
                    </Row>
                    <Modal
                        v-model="editModel"
                        title="编辑会员等级">
                        <Form ref="editRow" :model="editRow" :label-width="100">
                            <FormItem label="等级名称">
                                <Input v-model='editRow.name'></Input>
                            </FormItem>
                            <FormItem label="售卡金额(元)">
                                <inputNumber v-model='editRow.saleAmount'></inputNumber>
                            </FormItem>
                            <FormItem label="初始金额(元)">
                                <inputNumber v-model='editRow.beginningBalance'></inputNumber>
                            </FormItem>
                            <FormItem label="折扣比例">
                                <inputNumber v-model='editRow.discountRatio'>
                                    <span slot="prepend">%</span>
                                </inputNumber>
                            </FormItem>
                            <FormItem label="购币兑换比例">
                                <inputNumber v-model='editRow.conversionRatio'>
                                    <span slot="prepend">%</span>
                                </inputNumber>
                            </FormItem>
                            <FormItem label="会员卡期限(天)">
                                <inputNumber v-model='editRow.duration'></inputNumber>
                            </FormItem>
                            <FormItem label="备注">
                                <Input type="textarea" v-model='editRow.memo'></Input>
                            </FormItem>
                        </Form>
                        <div slot="footer">
                            <Button type="text" @click="canceledit">取消</Button>
                            <Button type="primary" @click="editok('editRow')">确定</Button>
                        </div>
                    </Modal>
                    <Modal
                        v-model="addModel"
                        title="新增会员等级">
                        <Form ref="addRow" :model="addRow" :label-width="100">
                            <FormItem label="等级名称">
                                <Input v-model='addRow.name'></Input>
                            </FormItem>
                            <FormItem label="售卡金额(元)">
                                <Input number=true v-model='addRow.saleAmount'>
                                </Input>
                            </FormItem>
                            <FormItem label="初始金额(元)">
                                <Input v-model='addRow.beginningBalance'></Input>
                            </FormItem>
                            <FormItem label="折扣比例">
                                <Input v-model='addRow.discountRatio' style="width:40%">
                                    <span slot="prepend">%</span>
                                </Input>
                            </FormItem>
                            <FormItem label="购币兑换比例">
                                <Input v-model='addRow.conversionRatio' style="width:40%">
                                    <span slot="prepend">%</span>
                                </Input>
                            </FormItem>
                            <FormItem label="会员卡期限(天)">
                                <Input v-model='addRow.duration'></Input>
                            </FormItem>
                            <FormItem label="备注">
                                <Input type="textarea" v-model='addRow.memo'></Input>
                            </FormItem>
                        </Form>
                        <div slot="footer">
                            <Button type="text" @click="canceladd">取消</Button>
                            <Button type="primary" @click="addok('editRow')">确定</Button>
                        </div>
                    </Modal>
                    <Modal
                        v-model="chargeModel"
                        title="联盟至尊会员卡充值规则">
                        <Row>
                            <Button icon="plus" type="primary" @click="addchargerule()">新增充值规则</Button>
                        </Row>
                        <Row class="margin-top-10">
                        <Col span="24">
                            <div>
                                <Table :columns="chargeRuleColumn" :data="chargeRuleData" border stripe></Table>
                            </div>
                        </Col>
                        </Row>
                        <div slot="footer">
                            <Button type="text" @click="cancelcharge">关闭</Button>
                        </div>
                    </Modal>
                    <Modal
                        v-model="chargeAddModel"
                        title="充值规则">
                        <Form ref="chargeAddRow" :model="chargeAddRow" :label-width="150">
                            <FormItem label="充值金额范围(元)">
                                <inputNumber v-model='chargeRow.minAmount' style="width:40%"></inputNumber> - <inputNumber v-model='chargeRow.maxAmount'  style="width:40%"></inputNumber>
                            </FormItem>
                            <FormItem label="赠送类型">
                                <Select clearable v-model="chargeRow.rewardType" style="width:80%">
                                    <Option value="FIXED">按固定金额</Option>
                                    <Option value="PERCENTAGE">按充值比例</Option>
                                </Select>
                            </FormItem>
                            <FormItem label="赠送金额或比例" style="width:80%">
                                <inputNumber v-model='editRow.rewardValue'></inputNumber>
                            </FormItem>
                        </Form>
                        <div slot="footer">
                            <Button type="text" @click="cancelchargeadd">取消</Button>
                            <Button type="primary" @click="chargeaddok('chargeAddRow')">确定</Button>
                        </div>
                    </Modal>
                </Card>
            </Col>
        </Row>
    </div>
</template>

<script>
import expandRow from './components/member-level-list-table-expand.vue';
import {ajaxMemberLevelListData} from './data/member-level-list-data.js';
export default {
    components: {
        expandRow
    },
    data () {
        return {
            loading: true,
            editModel: false,
            chargeModel: false,
            chargeAddModel: false,
            addModel: false,
            editRow: {},
            addRow: {},
            chargeRow: {},
            chargeAddRow: {},
            memberLevelColumn: [],
            chargeRuleColumn:[],
            totalData:[],
            memberLevelData: [],
            chargeRuleData:[],
            searchName:'',
            searchId:'',
            total:0,
            pageSize:8,
            ruleValidate: {
                name: [
                    { required: true, message: '请输入姓名', trigger: 'blur' },
                    { type: 'string', min: 2, max: 20, message: '请输入正确的姓名', trigger: 'blur' }
                ],
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
            this.memberLevelColumn = [
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
                title: '等级名称',
                align: 'center',
                key: 'name',
                sortable: true
            },
            {
                title: '初始余额',
                align: 'center',
                key: 'beginningBalance',
                width: 150,
            },
            {
                title: '售卡金额',
                align: 'center',
                key: 'saleAmount',
                width: 150,
            },
            {
                title: '购币兑换比例',
                align: 'center',
                width: 150,
                key: 'conversionRatio'
            },
            {
                title: '折扣比例',
                align: 'center',
                width: 150,
                key: 'discountRatio'
            },
            {
                title: '操作',
                align: 'center',
                width: 200,
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
                                    this.charge(params.row);
                                }
                            }
                        },'充值规则'),
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
            this.memberLevelData = ajaxMemberLevelListData;

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
        addchargerule () {
            this.chargeAddModel = true;
        },
        del (row) {
            this.$Notice.success({
                title: '成功',
                desc: '用户已删除',
                duration: 2
            });
            this.getData();
        },
        editok () {
            this.$Notice.success({
                title: '成功',
                desc: '会员等级信息已保存',
                duration: 2
            });
            this.editModel = false;
            this.getData();
        },
        addok (name) {
            this.$Notice.success({
                title: '成功',
                desc: '会员等级信息已保存',
                duration: 2
            });
            this.addModel = false;
            this.getData();
        },
        charge (row) {
            this.chargeRuleColumn = [{
                        title: '充值金额(元)',
                        align: 'center',
                        width: 150,
                        render: (h, params) => {
                            const minAmount = params.row.minAmount;
                            const maxAmount = params.row.maxAmount;
                            return h('Span', {
                                props: {

                                }
                            }, minAmount+" - "+maxAmount);
                        }
                    },
                    {
                        title: '赠送类型',
                        align: 'center',
                        key: 'rewardType',
                        width: 150
                    },
                    {
                        title: '赠送金额或比例',
                        align: 'left',
                        key: 'rewardValue'
                    },
                    {
                        title: '操作',
                        align: 'center',
                        width: 80,
                        render: (h, params) => {
                            return h('div', [
                                  h('Button',{
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    style: {
                                        margin: '0 5px 0 0'
                                    },
                                    on: {
                                        click: (event) => {
                                            this.delchargerule(params.row);
                                        }
                                    }
                                },'删除')                             
                            ])
                        }
                    }]
            this.chargeRuleData = row.chargeRules;
            this.chargeModel = true;
        },
        chargeaddok (name) {
            this.$Notice.success({
                title: '成功',
                desc: '充值规则信息已保存',
                duration: 2
            });
            this.chargeAddModel = false;
        },
        delchargerule (row) {
            this.$Notice.success({
                title: '成功',
                desc: '充值规则已删除',
                duration: 2
            });
        },
        chargeok (name) {
            this.chargeModel = false;
        },
        chargeok (name) {
            this.chargeModel = false;
        },
        canceledit () {
            this.editModel = false;   
        },
        canceladd () {
            this.addModel = false;   
        },
        cancelcharge () {
            this.chargeModel = false;   
        },
        cancelchargeadd () {
            this.chargeAddModel = false;   
        }
    },
    created () {
        this.getData();
    }
};
</script>
