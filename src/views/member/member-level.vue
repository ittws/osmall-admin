<style lang="less">
    @import '../../styles/common.less';
</style>

<template>
    <div>
        <Row class="margin-top-10">
            <Col span="24">
                <Card>
                    <p slot="title">
                         会员等级列表
                    </p>
                    <Row>
                        <Col span="8">
                        <Alert>请注意设置默认会员等级, 会员注册时将默认使用该等级！</Alert>
                        </Col>
                        <Col span="16">
                        <Button class="f_r" icon="plus" type="primary" @click="add()">新增会员等级</Button>
                        </Col>
                        
                        
                    </Row>
                    
                    <Row class="margin-top-10">
                        <Col span="24">
                            <div>
                                <Table :loading="loading" :columns="memberLevelColumn" :data="memberLevelData" border stripe></Table>
                                
                            </div>
                        </Col>
                    </Row>
                    <Modal
                        v-model="addModel"
                        :closable="false"
                        :mask-closable="false"
                        title="会员等级"
                        width="800"
                        >
                        <Form ref="addRow" :model="addRow" :label-width="100">
                            <FormItem label="等级名称">
                                <Input v-model='addRow.name' style="width:80%"></Input>
                            </FormItem>
                            <FormItem label="等级排序">
                                <InputNumber :min="1" :step="1"  v-model='addRow.depth' style="width:30%"></InputNumber>
                                <Alert style="display:inline-block">请按照1,2,3,4,5...的顺序设置等级, 1代表最高级</Alert>
                            </FormItem>
                            <FormItem label="商品折扣">
                                <InputNumber  :min="0" :max="10" :step="0.1" v-model='addRow.productDiscount' style="width:30%"></InputNumber>&nbsp;&nbsp;&nbsp;折
                                <Alert style="display:inline-block">该等级会员购买商品享受折扣价</Alert>
                            </FormItem>
                            <FormItem label="推广提成">
                                <i-switch
                                    v-model="addRow.recruitProfitEnabled"
                                    size="large"
                                    :true-value="true"
                                    :false-value="false"
                                >
                                    <span slot="open">是</span>
                                    <span slot="close">否</span>
                                </i-switch>
                                <Alert style="display:inline-block">会员及团队推广会员后获取推广提成</Alert>
                            </FormItem>
                            <FormItem label="销售提成">
                                <i-switch
                                    v-model="addRow.saleProfitEnabled"
                                    size="large"
                                    :true-value="true"
                                    :false-value="false"
                                >
                                    <span slot="open">是</span>
                                    <span slot="close">否</span>
                                </i-switch>
                                <Alert style="display:inline-block">会员及团队销售商品后获取销售提成</Alert>
                            </FormItem>
                            <FormItem label="达到该等级条件">
                                <Checkbox v-model="addRow.requiredByUser">
                                    <span>邀请会员数</span>
                                </Checkbox>
                                <Checkbox v-model="addRow.requiredByAmount">
                                    <span>销售额</span>
                                </Checkbox>
                            </FormItem>
                            <Row v-if="addRow.requiredByUser">
                                <Col span="6">
                                <FormItem label="直邀会员数达到">
                                    <InputNumber style="width:100%"  :min="0" v-model='addRow.requiredUserCountDirect'></InputNumber>&nbsp;&nbsp;&nbsp;人
                                </FormItem>
                                </Col>
                                <Col span="8">
                                    <FormItem :label-width="0">
                                    <RadioGroup v-model="addRow.requiredByUserSymbol">
                                        <Radio label="AND">
                                            <span>并且</span>
                                        </Radio>
                                        <Radio label="OR">
                                            <span>或者</span>
                                        </Radio>
                                    </RadioGroup>
                                    </FormItem>
                                </Col>
                                <Col span="10">
                                    <FormItem label="团队会员数达到">
                                        <InputNumber style="width:60%" :min="0" v-model='addRow.requiredUserCountTeam'></InputNumber>&nbsp;&nbsp;&nbsp;人
                                    </FormItem>
                                </Col>
                            </Row>
                            <Alert v-if="addRow.requiredByUser">会员数达到一定数量可升级至该等级</Alert>
                            <Row v-if="addRow.requiredByAmount" style="margin-top:50px">
                                <Col span="6">
                                <FormItem label="直接销售额达到">
                                    <InputNumber style="width:100%"  :min="0" v-model='addRow.requiredProductAmountDirect'></InputNumber>&nbsp;&nbsp;&nbsp;元
                                </FormItem>
                                </Col>
                                <Col span="8">
                                    <FormItem :label-width="0">
                                    <RadioGroup v-model="addRow.requiredByAmountSymbol">
                                        <Radio label="AND">
                                            <span>并且</span>
                                        </Radio>
                                        <Radio label="OR">
                                            <span>或者</span>
                                        </Radio>
                                    </RadioGroup>
                                    </FormItem>
                                </Col>
                                <Col span="10">
                                    <FormItem label="团队销售额达到">
                                        <InputNumber style="width:60%" :min="0" v-model='addRow.requiredProductAmountTeam'></InputNumber>&nbsp;&nbsp;&nbsp;元
                                    </FormItem>
                                </Col>
                            </Row>
                            <Alert v-if="addRow.requiredByAmount">销售达到一定金额可升级至该等级</Alert>
                            <FormItem label="备注">
                                <Input type="textarea"  :rows="5" :maxlength="500"  v-model='addRow.memo' style="width:80%"></Input>
                            </FormItem>
                        </Form>
                        <div slot="footer">
                            <Button type="text" @click="canceladd">取消</Button>
                            <Button :loading="loadingAdd" type="primary" @click="addok('addRow')">确定</Button>
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
            loading: false,
            loadingAdd: false,  //添加会员等级按钮加载中
            idEdit: false,  //编辑模式(弹出框为编辑会员等级)
            addModel: false,
            //添加会员等级数据模型
            addRow: {}, //新增或编辑数据模型
            memberLevelData: [],
            memberLevelColumn: [
            {
                title: '会员等级',
                align: 'center',
                key: 'name',
                width: 150
            },
            {
                title: '等级排序',
                align: 'center',
                key: 'depth',
                width: 150,
                sortable: 'true'
            },
            {
                title: '商品折扣',
                align: 'center',
                width: 150,
                render: (h, params) => {
							return h('span', {}, params.row.productDiscount+'折')
						}
            },
            {
                title: '推广提成',
                align: 'center',
                width: 120,
                render: (h, params) => {
                    let iconType = (params.row.recruitProfitEnabled ? 'checkmark' : 'close');
                    return h('Icon', {
                        props: {
                            type: iconType
                        }
                    }, '')
                }
            },
            {
                title: '销售提成',
                align: 'center',
                width: 120,
                render: (h, params) => {
                    let iconType = (params.row.saleProfitEnabled ? 'checkmark' : 'close');
                    return h('Icon', {
                        props: {
                            type: iconType
                        }
                    }, '')
                }
            },
            {
                title: "是否默认",
                align: "center",
                width: 120,
                render: (h, params) => {
                    return h("i-switch", {
                    props: {
                        type: "primary",
                        value: params.row.default //控制开关的打开或关闭状态，官网文档属性是value
                    },
                    style: {
                        marginRight: "5px"
                    },
                    on: {
                        "on-change": value => {
                        this.change(params.row,params.row.default?'UNDEFAULT':'DEFAULT'); //params.index是拿到table的行序列，可以取到对应的表格值
                        }
                    }
                    });
                }
            },
            {
                title: '等级条件(会员)',
                align: 'center',
                width: 300,
                render: (h, params) => {
                    let status = '';
                    if(!params.row.requiredByUser)   status = '无任何条件';
                    else{
                        let userCountDirect = params.row.requiredUserCountDirect;
                        status=status+'直接邀请会员'+userCountDirect+'人';
                        if(params.row.requiredByUserSymbol=='OR')
                            status = status + '或者'
                        if(params.row.requiredByUserSymbol=='AND')
                            status = status + '并且'
                        let userCountTeam = params.row.requiredUserCountTeam;
                        status = status + '团队会员数达到'+userCountTeam+'人';
                    }
                    return h('span', {
                    }, status)
                }
            },
            {
                title: '等级条件(销售额)',
                align: 'center',
                width: 300,
                render: (h, params) => {
                    let status = '';
                    if(!params.row.requiredByAmount)   status = '无任何条件';
                    else{
                        let productAmountDirect = params.row.requiredProductAmountDirect;
                        status=status+'直接销售额'+productAmountDirect+'元';
                        if(params.row.requiredByAmountSymbol=='OR')
                            status = status + '或者'
                        if(params.row.requiredByAmountSymbol=='AND')
                            status = status + '并且'
                        let productAmountTeam = params.row.requiredProductAmountTeam;
                        status = status + '团队销售额'+productAmountTeam+'元';
                    }
                    return h('span', {
                    }, status)
                }
            },
            {
                title: '备注',
                align: 'center',
                width: 150,
                key: 'memo'
            },
            {
                title: '操作',
                align: 'center',
                fixed: 'right',
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
                        h('Poptip',{
                            props: {
                                confirm: true,
                                title: '删除会员等级将影响所有会员的销售和推广, 确认删除吗?',
                                transfer: true
                            },
                            on: {
                                'on-ok': () => {
                                    this.change(params.row,'DELETE');
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
            }],
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
        inquiryMemberLevel(){
            this.loading = true;
            this.$http.post("/admin/inquiryUserLevel",this.common.request({}))
            .then(res=>{
                if(res.data.body.status.statusCode==0){
                    this.loading = false;
                    this.memberLevelData = res.data.body.data.levels;
                }else{
                    this.$Message.error(response.data.body.status.errorDesc);
                }
            },res=>{
                this.loading = false;
                this.$Message.error('出错了, 请稍后重试');
            })
        },
        edit (row) {
            this.addModel = true;
            this.addRow = row;
            this.isEdit = true;
        },
        add () {
            this.addModel = true;
            this.addRow = {
                name: '',                       //等级名称
                productDiscount: 9.5,           //会员商品折扣
                requiredByUser:false,           //升级按会员数计算
                requiredByUserSymbol:'OR',      //直邀, 团队条件是并且还是或者
                requiredByAmount: false,        //升级按销售金额计算
                requiredByAmountSymbol:'OR',    //直接销售额, 团队销售额是并且还是或者
                recruitProfitEnabled: false,    //是否可推广
                recruitSaleEnabled: false,      //是否可销售
                requiredUserCountDirect: 0,     //直接邀请会员数
                requiredUserCountTeam: 0,       //团队会员数
                requiredProductAmountDirect: 0, //直接销售金额
                requiredProductAmountTeam: 0,   //团队销售金额
                depth: 1                        //等级排序
            };
            this.isEdit = false;
        },
        addchargerule () {
            this.chargeAddModel = true;
        },
        change (row,actionType) {
            var options = {
                actionType: actionType,
                userLevelUuid:row.userLevelUuid,
            }
            this.$http.post("/admin/changeUserLevel",this.common.request(options))
            .then(res=>{
                if(res.data.body.status.statusCode==0){
                    this.addModel = false;
                    var desc = '';
                    if(actionType=='DELETE')
                        desc = '会员等级已删除';
                    else if(actionType=='DEFAULT')
                        desc = '已设置默认会员等级';
                    else if(actionType=='UNDEFAULT')
                        desc = '已取消设置默认会员等级';
                    this.$Notice.success({
                    title: '成功',
                    desc: desc,
                    duration: 2
                });
                    this.inquiryMemberLevel();
                }else{
                    this.$Message.error(response.data.body.status.errorDesc);
                }
            },res=>{
                this.$Message.error('出错了, 请稍后重试');
            })
        },
        validate(row){
            if(!row.name){
                this.$Message.error('等级名称不能为空');
                return false
            }
            return true;
        },
        addok (formName) {
            if(!this.validate(this.addRow)) return;
            this.loadingAdd = true;
            var options = {
                actionType: 'ADD',
                name:this.addRow.name,
                memo:this.addRow.memo,
                productDiscount:this.addRow.productDiscount,
                recruitProfitEnabled:this.addRow.recruitProfitEnabled,
                saleProfitEnabled:this.addRow.saleProfitEnabled,
                requiredProductAmountDirect:this.addRow.requiredProductAmountDirect,
                requiredProductAmountTeam:this.addRow.requiredProductAmountTeam,
                requiredUserCountDirect:this.addRow.requiredUserCountDirect,
                requiredUserCountTeam:this.addRow.requiredUserCountTeam,
                requiredByUser:this.addRow.requiredByUser,
                requiredByUserSymbol:this.addRow.requiredByUserSymbol,
                requiredByAmount:this.addRow.requiredByAmount,
                requiredByAmountSymbol:this.addRow.requiredByAmountSymbol,
                depth:this.addRow.depth
            }
            if(this.isEdit){
                options.userLevelUuid = this.addRow.userLevelUuid;
                options.actionType = 'MODIFY';
            }
            this.$http.post("/admin/changeUserLevel",this.common.request(options))
            .then(res=>{
                this.loadingAdd = false;
                if(res.data.body.status.statusCode==0){
                    this.addModel = false;
                    this.$Notice.success({
                    title: '成功',
                    desc: '会员等级已添加或修改',
                    duration: 2
                });
                    this.inquiryMemberLevel();
                }else{
                    this.$Message.error(response.data.body.status.errorDesc);
                }
            },res=>{
                this.loadingAdd = false;
                this.$Message.error('出错了, 请稍后重试');
            })
        },
        canceladd () {
            this.addModel = false;   
        }
    },
    created () {
        this.inquiryMemberLevel();
    }
};
</script>
