<style lang="less">
    @import '../../styles/common.less';
</style>

<template>
    <div>
        <Row class="margin-top-10">
            <Col span="24">
                <Card>
                    <p slot="title">
                         销售分润
                    </p>
                    <Row>
                        <Form>
                        <FormItem label="开启销售分润">
                            <i-switch
                            v-model="profitSaleEnabled"
                            size="large"
                            :true-value="true"
                            :false-value="false"
                            @on-change="changeProfitSaleEnabled"
                            >
                          <span slot="open">是</span>
                          <span slot="close">否</span>
                        </i-switch>
                        </FormItem>
                        <FormItem label="分润级数" v-if="profitSaleEnabled">
                            <RadioGroup @on-change="changeProfitSaleLevel" v-model="profitSaleLevel" type="button" size="large">
                                <Radio label="1"></Radio>
                                <Radio label="2"></Radio>
                                <Radio label="3"></Radio>
                                <Radio label="4"></Radio>
                                <Radio label="5"></Radio>
                                <Radio label="6"></Radio>
                                <Radio label="7"></Radio>
                                <Radio label="8"></Radio>
                                <Radio label="9"></Radio>
                                <Radio label="10"></Radio>
                                <Radio label="0">无限</Radio>
                            </RadioGroup>
                        </FormItem>
                        <Row style="margin-top:20px" v-if="profitSaleEnabled">
                            <Col span="15">
                                <Alert type="warning">会员级数从上级开始计算, 会员本身不参与分润。</Alert>
                            </Col>
                        </Row>
                        </Form>
                    </Row>
                    <div v-if="profitSaleEnabled">
                    <Row style="margin-top:20px">
                        <Col span="15">
                        <Alert type="warning">只有参与分润的会员等级才进行设置; </Alert>
                        </Col>
                        <Col span="9">
                        <Button class="f_r" icon="plus" type="primary" @click="add()">新增分润设置</Button>
                        </Col>
                    </Row>
                    
                    <Row class="margin-top-10">
                        <Col span="15">
                            <div>
                                <Table :loading="loading" :columns="saleProfitColumn" :data="saleProfitData" border stripe></Table>
                                
                            </div>
                        </Col>
                    </Row>
                    </div>
                    <Modal
                        v-model="addModel"
                        :closable="false"
                        :mask-closable="false"
                        title="分润设置"
                        width="800"
                        >
                        <Form ref="addRow" :model="addRow" :label-width="100">
                            <FormItem label="分润会员等级">
                                <Select v-model='addRow.profitUserLevelUuid' style="width:60%">
                                    <Option v-bind:key="item.userLevelUuid" v-for="item in userLevels" :value="item.userLevelUuid">{{item.name}}</Option>
                                </Select>
                            </FormItem>
                            <FormItem label="分润比例">
                                <InputNumber  :min="0" :max="100" v-model='addRow.profitRate' style="width:60%"></InputNumber>&nbsp;&nbsp;&nbsp;%
                            </FormItem>
                            <Alert type="warning">销售商品后, 上级各等级会员按设定的分润会员等级和金额进行分润; 购买会员本身不参与销售分润;</Alert>
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
export default {
    components: {
        
    },
    data () {
        return {
            profitSaleEnabled: true,
            profitSaleLevel: 2,  //分润级数
            loading: false,
            loadingAdd: false,  //添加会员等级按钮加载中
            idEdit: false,  //编辑模式(弹出框为编辑会员等级)
            addModel: false,
            //添加会员等级数据模型
            addRow: {}, //新增或编辑数据模型
            userLevels:[],  //会员等级
            saleProfitData: [],
            saleProfitColumn: [
            {
                title: '分润会员等级',
                align: 'center',
                width: 250,
                sortable: 'true',
                render: (h, params) => {
							return h('span', {}, params.row.profitUserLevelDTO.name)
						}
            },
            {
                title: '分润比例',
                align: 'center',
                width: 250,
                render: (h, params) => {
							return h('span', {}, params.row.profitRate+'%')
						}
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
                        h('Poptip',{
                            props: {
                                confirm: true,
                                title: '确认要删除分润设置吗?',
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
            }]
        }
    },
    methods: {
        changeProfitSaleLevel(e){
            this.changeParameter('PROFIT_SALE_LEVEL',e);
        },
        changeProfitSaleEnabled(e){
            this.profitSaleEnabled = e;
            this.changeParameter('PROFIT_SALE_ENABLED',e?'1':'0');
        },
        inquiryProfitSale(){
            this.loading = true;
            this.$http.post("/admin/inquiryProfitSale",this.common.request({}))
            .then(res=>{
                if(res.data.body.status.statusCode==0){
                    this.loading = false;
                    this.saleProfitData = res.data.body.data.sales;
                }else{
                    this.$Message.error(response.data.body.status.errorDesc);
                }
            },res=>{
                this.loading = false;
                this.$Message.error('出错了, 请稍后重试');
            })
        },
        inquiryUserLevel(){
            this.$http.post("/admin/inquiryUserLevel",this.common.request({}))
            .then(res=>{
                if(res.data.body.status.statusCode==0){
                    this.userLevels = res.data.body.data.levels;
                }else{
                    this.$Message.error(response.data.body.status.errorDesc);
                }
            },res=>{
                this.$Message.error('出错了, 请稍后重试');
            })
        },
        isProfitSaleEnabled(name){
            this.$http.post("/inquiryParameter",this.common.request({name:'PROFIT_RECRUIT_ENABLED'}))
            .then(res=>{
                if(res.data.body.status.statusCode==0){
                    this.profitSaleEnabled = res.data.body.data.value=='1'?true:false;
                }else{
                    this.$Message.error(response.data.body.status.errorDesc);
                }
            },res=>{
                this.$Message.error('出错了, 请稍后重试');
            })
        },
        inquiryProfitSaleLevel(){
            this.$http.post("/inquiryParameter",this.common.request({name:'PROFIT_SALE_LEVEL'}))
            .then(res=>{
                if(res.data.body.status.statusCode==0){
                    if(res.data.body.data)
                    this.profitSaleLevel = res.data.body.data.value;
                }else{
                    this.$Message.error(response.data.body.status.errorDesc);
                }
            },res=>{
                this.$Message.error('出错了, 请稍后重试');
            })
        },
        changeParameter(name,value){
            var options = {
                settings:[{
                    name:name,
                    value:value
                }]
            }
            this.$http.post("/admin/changeParameter",this.common.request(options))
            .then(res=>{
                if(res.data.body.status.statusCode==0){
                    
                }else{
                    this.$Message.error(response.data.body.status.errorDesc);
                }
            },res=>{
                this.$Message.error('出错了, 请稍后重试');
            })
        },
        edit (row) {
            this.addModel = true;
            this.addRow = row;
            this.addRow.profitUserLevelUuid = row.profitUserLevelDTO.userLevelUuid;
            this.isEdit = true;
        },
        add () {
            this.addModel = true;
            this.addRow = {
                profitUserLevelUuid: '',        //分润会员等级
                profitRate: 0,                      //分润金额
            };
            this.isEdit = false;
        },
        change (row,actionType) {
            var options = {
                actionType: actionType,
                profitSaleUuid:row.profitSaleUuid,
            }
            this.$http.post("/admin/changeProfitSale",this.common.request(options))
            .then(res=>{
                if(res.data.body.status.statusCode==0){
                    this.addModel = false;
                    this.$Notice.success({
                    title: '成功',
                    desc: '销售分润设置已修改',
                    duration: 2
                });
                    this.inquiryProfitSale();
                }else{
                    this.$Message.error(response.data.body.status.errorDesc);
                }
            },res=>{
                this.$Message.error('出错了, 请稍后重试');
            })
        },
        validate(row){
            if(!row.profitUserLevelUuid){
                this.$Message.error('未选择分润会员等级');
                return false
            }
            return true;
        },
        addok (formName) {
            if(!this.validate(this.addRow)) return;
            this.loadingAdd = true;
            var options = {
                actionType: 'ADD',
                profitRate: this.addRow.profitRate,
                profitUserLevelDTO:{
                    userLevelUuid: this.addRow.profitUserLevelUuid
                }
            }
            if(this.isEdit){
                options.profitSaleUuid = this.addRow.profitSaleUuid;
                options.actionType = 'MODIFY';
            }
            this.$http.post("/admin/changeProfitSale",this.common.request(options))
            .then(res=>{
                this.loadingAdd = false;
                if(res.data.body.status.statusCode==0){
                    this.addModel = false;
                    this.$Notice.success({
                        title: '成功',
                        desc: '销售分润设置已修改',
                        duration: 2
                    });
                    this.inquiryProfitSale();
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
        this.inquiryUserLevel();
        this.inquiryProfitSale();
        this.isProfitSaleEnabled();
        this.inquiryProfitSaleLevel();
    }
};
</script>
