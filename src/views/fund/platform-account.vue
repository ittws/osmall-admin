<style lang="less">
    @import '../../styles/common.less';
</style>

<template>
    
    <div>
        <Form :label-width="100">
            <Card>
                <p slot="title">
                     公司收款账户
                </p>
                <Row>
                    <div class="f_r">
                        <Button  icon="plus" type="primary" @click="addAccount()">新增账号</Button>
                    </div>
                </Row>
                <Row class="margin-top-10">
                    <Col span="24">
                        <div>
                            <Table :columns="accountListColumn" :data="accountListData" border stripe :loading="loading"></Table>
                        </div>
                    </Col>
                </Row>
            </card>
        </Form>
        <Modal
            v-model="addModel"
            ref="addModel"
            title="新增收款账户">
            <Form ref="addRow" :model="addRow" :label-width="100">
                <FormItem label="账户类型" prop="accountType">
                    <RadioGroup v-model="addRow.accountType">
                        <Radio label="银行储蓄卡">
                            <span>银行储蓄卡</span>
                        </Radio>
                        <Radio label="微信">
                            <span>微信</span>
                        </Radio>
                        <Radio label="支付宝">
                            <span>支付宝</span>
                        </Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="银行账户名称" prop="bankAccountNo" v-if="addRow.accountType=='银行储蓄卡'">
                    <Input v-model='addRow.bankAccountName' style="width:250px"></Input>
                </FormItem>
                <FormItem label="银行账号" prop="bankAccountNo" v-if="addRow.accountType=='银行储蓄卡'">
                    <Input v-model='addRow.bankAccountNo' style="width:250px"></Input>
                </FormItem>
                <FormItem label="银行名称" prop="bankName" v-if="addRow.accountType=='银行储蓄卡'">
                    <Select  clearable v-model="addRow.bankName" style="width:200px">
                        <Option v-for="item in bankList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>  
                <FormItem label="支行名称" prop="branchName" v-if="addRow.accountType=='银行储蓄卡'">
                    <Input v-model='addRow.branchName' style="width:250px"></Input>
                </FormItem> 
                <FormItem label="微信号" prop="wechatId" v-if="addRow.accountType=='微信'">
                    <Input v-model='addRow.wechatId' style="width:250px"></Input>
                </FormItem> 
                <FormItem label="微信二维码" v-if="addRow.accountType=='微信'">
                    <div class="demo-upload-list" v-if="addRow.wechatQrCode">
                        <div style="height:160px;width:100%">
                            <img :src="addRow.wechatQrCode">
                        </div>
                        <div class="demo-upload-list-cover" style="bottom:0">
                            <Icon type="ios-eye-outline" @click.native="handleView(addRow.wechatQrCode)"></Icon>
                            <Icon type="ios-trash-outline" @click.native="handleAddWechatRemove()"></Icon>
                        </div>
                    </div>
                    <Upload 
                        :action="actionName"
                        ref="upload"
                        :show-upload-list="false"
                        :default-file-list="defaultList"
                        :on-success="handleAddWechatSuccess"
                        :format="['jpg','jpeg','png']"
                        :max-size="10240"
                        :on-format-error="handleFormatError"
                        :on-exceeded-size="handleMaxSize"
                        :before-upload="handleBeforeUpload"
                        multiple
                        style="border:none;"
                    >
                        <Button icon="ios-camera">上传二维码</Button>
                    </Upload>
                </FormItem>
                <FormItem label="支付宝账号" prop="wechatId" v-if="addRow.accountType=='支付宝'">
                    <Input v-model='addRow.alipayId' style="width:250px"></Input>
                </FormItem> 
                <FormItem label="支付宝二维码" v-if="addRow.accountType=='支付宝'">
                    <div class="demo-upload-list" v-if="addRow.alipayQrCode">
                        <div style="height:160px;width:100%">
                            <img :src="addRow.alipayQrCode">
                        </div>
                        <div class="demo-upload-list-cover" style="bottom:0">
                            <Icon type="ios-eye-outline" @click.native="handleView(addRow.alipayQrCode)"></Icon>
                            <Icon type="ios-trash-outline" @click.native="handleAddAlipayRemove()"></Icon>
                        </div>
                    </div>
                    <Upload 
                        :action="actionName"
                        ref="upload"
                        :show-upload-list="false"
                        :default-file-list="defaultList"
                        :on-success="handleAddAlipaySuccess"
                        :format="['jpg','jpeg','png']"
                        :max-size="10240"
                        :on-format-error="handleFormatError"
                        :on-exceeded-size="handleMaxSize"
                        :before-upload="handleBeforeUpload"
                        multiple
                        style="border:none;"
                    >
                        <Button icon="ios-camera">上传二维码</Button>
                    </Upload>
                </FormItem>               
            </Form>
            <div slot="footer">
                <Button type="text" @click="canceladd">取消</Button>
                <Button :loading='loading' type="primary" @click="addok()">确定</Button>
            </div>
        </Modal>
        <Modal
            v-model="editModel"
            ref="editModel"
            title="编辑收款账户">
            <Form ref="editRow" :model="editRow" :label-width="100">
                <FormItem label="账户类型" prop="accountType">
                    <RadioGroup v-model="editRow.accountType">
                        <Radio label="银行储蓄卡">
                            <span>银行储蓄卡</span>
                        </Radio>
                        <Radio label="微信">
                            <span>微信</span>
                        </Radio>
                        <Radio label="支付宝">
                            <span>支付宝</span>
                        </Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="银行账户名称" prop="bankAccountNo" v-if="editRow.accountType=='银行储蓄卡'">
                    <Input v-model='editRow.bankAccountName' style="width:250px"></Input>
                </FormItem>
                <FormItem label="银行账号" prop="bankAccountNo" v-if="editRow.accountType=='银行储蓄卡'">
                    <Input v-model='editRow.bankAccountNo' style="width:250px"></Input>
                </FormItem>
                <FormItem label="银行名称" prop="bankName" v-if="editRow.accountType=='银行储蓄卡'">
                    <Select clearable v-model="editRow.bankName" style="width:200px">
                        <Option v-for="item in bankList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>  
                <FormItem label="支行名称" prop="branchName" v-if="editRow.accountType=='银行储蓄卡'">
                    <Input v-model='editRow.branchName' style="width:250px"></Input>
                </FormItem> 
                <FormItem label="微信号" prop="wechatId" v-if="editRow.accountType=='微信'">
                    <Input v-model='editRow.wechatId' style="width:250px"></Input>
                </FormItem> 
                <FormItem label="微信二维码" v-if="editRow.accountType=='微信'">
                    <div class="demo-upload-list" v-if="editRow.wechatQrCode">
                        <div style="height:160px;width:100%">
                            <img :src="editRow.wechatQrCode">
                        </div>
                        <div class="demo-upload-list-cover" style="bottom:0">
                            <Icon type="ios-eye-outline" @click.native="handleView(editRow.wechatQrCode)"></Icon>
                            <Icon type="ios-trash-outline" @click.native="handleEditWechatRemove()"></Icon>
                        </div>
                    </div>
                    <Upload 
                        :action="actionName"
                        ref="upload"
                        :show-upload-list="false"
                        :default-file-list="defaultList"
                        :on-success="handleEditWechatSuccess"
                        :format="['jpg','jpeg','png']"
                        :max-size="10240"
                        :on-format-error="handleFormatError"
                        :on-exceeded-size="handleMaxSize"
                        :before-upload="handleBeforeUpload"
                        multiple
                        style="border:none;"
                    >
                        <Button icon="ios-camera">上传二维码</Button>
                    </Upload>
                </FormItem>
                <FormItem label="支付宝账号" prop="wechatId" v-if="editRow.accountType=='支付宝'">
                    <Input v-model='editRow.alipayId' style="width:250px"></Input>
                </FormItem> 
                <FormItem label="支付宝二维码" v-if="editRow.accountType=='支付宝'">
                    <div class="demo-upload-list" v-if="editRow.alipayQrCode">
                        <div style="height:160px;width:100%">
                            <img :src="editRow.alipayQrCode">
                        </div>
                        <div class="demo-upload-list-cover" style="bottom:0">
                            <Icon type="ios-eye-outline" @click.native="handleView(editRow.alipayQrCode)"></Icon>
                            <Icon type="ios-trash-outline" @click.native="handleEditAlipayRemove()"></Icon>
                        </div>
                    </div>
                    <Upload 
                        :action="actionName"
                        ref="upload"
                        :show-upload-list="false"
                        :default-file-list="defaultList"
                        :on-success="handleEditAlipaySuccess"
                        :format="['jpg','jpeg','png']"
                        :max-size="10240"
                        :on-format-error="handleFormatError"
                        :on-exceeded-size="handleMaxSize"
                        :before-upload="handleBeforeUpload"
                        multiple
                        style="border:none;"
                    >
                        <Button icon="ios-camera">上传二维码</Button>
                    </Upload>
                </FormItem>               
            </Form>
            <div slot="footer">
                <Button type="text" @click="canceladd">取消</Button>
                <Button :loading='loading' type="primary" @click="editok()">确定</Button>
            </div>
        </Modal>
        <Modal title="预览" v-model="previewModal">
            <img :src="previewImageUrl" style="width: 100%">
        </Modal>
     </div>               
</template>

<script>
export default {
    components: {
        
    },
    data () {
        return {
            loading: false,
            accountListData:[],
            addModel:false,
            editModel:false,
            addRow:{
                accountType:'银行储蓄卡',
                wechatQrCode:'',
                wechatId:'',
                alipayQrCode:'',
                alipayId:'',
                bankAccountName:'',
                bankAccountNo:'',
                bankName:'',
                branchName:''
            },
            editRow:{},
            actionName:this.$http.defaults.baseURL+'admin/uploadFile',
            defaultList:[],
            previewImageUrl:'',
            previewModal:false,
            bankList:[{
                label:'中国工商银行',
                value:'中国工商银行'
            },{
                label:'中国农业银行',
                value:'中国农业银行'
            },{
                label:'中国建设银行',
                value:'中国建设银行'
            },{
                label:'招商银行',
                value:'招商银行'
            },{
                label:'交通银行',
                value:'交通银行'
            },{
                label:'中国民生银行',
                value:'中国民生银行'
            },{
                label:'中国邮政储蓄银行',
                value:'中国邮政储蓄银行'
            },{
                label:'中国光大银行',
                value:'中国光大银行'
            },{
                label:'中国银行',
                value:'中国银行'
            },{
                label:'兴业银行',
                value:'兴业银行'
            }],
            accountListColumn:[
                {
                    title: '账户类型',
                    align: 'center',
                    key: 'accountType',
                    width: 100
                },
                {
                    title: '银行名称',
                    align: 'center',
                    render: (h, params) => {
                        if(params.row.accountType=='银行储蓄卡')
                            return h('span', {
                                props: {
                                    
                                }
                            }, params.row.bankName+params.row.branchName)
                    }
                },
                {
                    title: '银行账户名称',
                    align: 'center',
                    key: 'bankAccountName',
                    width: 120,
                },
                {
                    title: '银行账号',
                    align: 'center',
                    key: 'bankAccountNo',
                    width: 100,
                },
                {
                    title: '微信号',
                    align: 'center',
                    key:'wechatId',
                    width: 80,
                },
                {
                    title: '微信二维码',
                    align: 'center',
                    render: (h, params) => {
                        if(params.row.accountType=='微信')
                        return h('div', [
                            h('Img',{
                                attrs:{
                                    src: params.row.wechatQrCode,
                                    width:"100%",
                                    height:"100px"
                                },
                                style:{
                                    paddingTop:"5px"
                                }
                            })
                        ]);
                    }
                },
                {
                    title: '支付宝账号',
                    align: 'center',
                    key:'alipayId',
                },
                {
                    title: '支付宝二维码',
                    align: 'center',
                    render: (h, params) => {
                        if(params.row.accountType=='支付宝')
                        return h('div', [
                            h('Img',{
                                attrs:{
                                    src: params.row.alipayQrCode,
                                    width:"100%",
                                    height:"100px"
                                },
                                style:{
                                    paddingTop:"5px"
                                }
                            })
                        ]);
                    }
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
                                    size: 'small'
                                },
                                style: {
                                    margin: '0 5px 0 0'
                                },
                                on: {
                                    click: (event) => {
                                        this.editAccount(params.row);
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
                                        this.delok(params.row);
                                    }
                                }
                            },[
                                h('Button',{
                                props: {
                                    type: 'error',
                                    size: 'small',
                                },
                                style: {
                                    margin: '0 5px 0 0',
                                },
                            },'删除')
                            ])
                        ])
                    }
                }]
        }
    },
    methods: {
        addAccount(){
            this.addModel = true;
        },
        canceladd(){
            this.addModel = false;
        },
        editAccount(row){
            this.editModel = true;
            this.editRow = row;
        },
        canceledit(){
            this.editModel = false;
        },
        validateAccount(account){
            if(account.accountType=='银行储蓄卡'){
                if(account.bankAccountName==''||account.bankAccountName.size>45){
                    this.$Message.error('银行账户名称为空或大于45个字符');
                    return false;
                }
                if(account.bankAccountNo==''||account.bankAccountNo.size>20){
                    this.$Message.error('银行账号为空或大于20个字符');
                    return false;
                }
                if(account.bankName==''){
                    this.$Message.error('未选择银行名称');
                   return false;
                }
                if(account.branchName==''||account.branchName.size>45){
                    this.$Message.error('支行名称为空或大于45个字符');
                   return false;
                }
            }
            if(account.accountType=='微信'){
                if(account.wechatId==''||account.wechatId.size>80){
                    this.$Message.error('微信号为空或大于80个字符');
                    return false;
                }
                if(account.wechatQrCode==''){
                    this.$Message.error('未上传微信收款二维码');
                    return false;
                }
            }
            if(account.accountType=='支付宝'){
                if(account.alipayId==''||account.alipayId.size>80){
                    this.$Message.error('支付宝账号为空或大于80个字符');
                    return false;
                }
                if(account.alipayQrCode==''){
                    this.$Message.error('未上传支付宝收款二维码');
                    return false;
                }
            }
            return true;
        },
        addok(){
            if(this.validateAccount(this.addRow))
                this.changePlatformAccount(this.addRow,'ADD');
        },
        editok(){
            if(this.validateAccount(this.editRow))
                this.changePlatformAccount(this.editRow,'MODIFY');
        },
        delok(row){
            this.changePlatformAccount(row,'DELETE');
        },
        changePlatformAccount(account,actionType){
            let options = {
                actionType:actionType,
                platformAccountUuid:account.platformAccountUuid,
                accountType:account.accountType,
            }
            if(account.accountType=='银行储蓄卡'){
                options.bankAccountName = account.bankAccountName;
                options.bankAccountNo = account.bankAccountNo;
                options.bankName = account.bankName;
                options.branchName = account.branchName;
            }else if(account.accountType=='微信'){
                options.wechatId = account.wechatId;
                options.wechatQrCode = account.wechatQrCode;
            }else if(account.accountType=='支付宝'){
                options.alipayId = account.alipayId;
                options.alipayQrCode = account.alipayQrCode;
            }
            this.loading = true;
            this.$http.post("/admin/updatePlatformAccount", this.common.request(options)) 
            .then(response => {  
                this.loading = false;
                if(response.data.body.status.statusCode==0){
                    if('ADD'==actionType){
                        this.$Message.success('已成功添加收款账户');
                        this.addModel = false;
                    }else if('MODIFY'==actionType){
                        this.$Message.success('已成功修改收款账户');
                        this.editModel = false;
                    }else if('DELETE'==actionType){
                        this.$Message.success('已成功删除收款账户');
                    }
                    this.inquiryPlatformAccount();
                }else{
                    this.$Message.error(response.data.body.status.errorDesc);
                }
            }, response => {  
                this.loading = false;
                this.$Message.error('出错了, 请稍后重试');
            })
        },
        handleView (url) {   
            this.previewModal = true;
            this.previewImageUrl = url;   
        },
        handleAddWechatRemove (item) {
            this.addRow.wechatQrCode = '';
        },
        handleEditWechatRemove (item) {
        },
        handleAddWechatSuccess (res, file) {
            this.addRow.wechatQrCode = res.data[0]; 
        },
        handleEditWechatSuccess (res, file) {
            this.editRow.wechatQrCode = res.data[0]; 
        },
        handleAddAlipayView (item) {      
        },
        handleEditAlipayView (item) {      
        },
        handleAddAlipayRemove (item) {
            this.addRow.alipayQrCode = '';
        },
        handleEditAlipayRemove (item) {
        },
        handleAddAlipaySuccess (res, file) {
            debugger
            this.addRow.alipayQrCode = res.data[0]; 
        },
        handleEditAlipaySuccess (res, file) {
            this.editRow.alipayQrCode = res.data[0]; 
        },
        handleFormatError (file) {
            this.$Notice.warning({
                title: '图片类型错误',
                desc: '不支持'+file.name + '图片类型, 请上传 jpg 或者 png图片.',
                duration:2
            });
        },
        handleMaxSize (file) {
            this.$Notice.warning({
                title: '图片大小超过限制',
                desc: '文件  ' + file.name + ' 图片超过10M.',
                duration:2
            });
        },
        handleBeforeUpload () {
            
        },
        inquiryPlatformAccount(){
            let that = this;
            let searchOptions = {
            };
            that.loading = true;
            that.$http.post("/admin/inquiryPlatformAccount", this.common.request(searchOptions))  
            .then(response => {
                that.loading = false;
                if(response.data.body.status.statusCode==0){
                    var data = response.data.body.data;
                    that.accountListData = data.accounts;
                }else{
                    that.$Message.error(response.data.body.status.errorDesc);
                }
            }, response => {  
                that.loading = false;
                that.$Message.error(response.data.body.status.errorDesc);
            })
        },
    },
    created () {
         this.inquiryPlatformAccount();
    },
    mounted () {
            
        },
    destroyed () {
        
    }

};
</script>
<style>
    .demo-upload-list{
        display: inline-block;
        width: 200px;
        //height: 160px;
        text-align: center;
        line-height: 60px;
        //border: 1px solid transparent;
        //border-radius: 4px;
        overflow: hidden;
        background: #fff;
        position: relative;
        //box-shadow: 0 1px 1px rgba(0,0,0,.2);
        margin-right: 40px;
    }
    .demo-upload-list img{
        width: 100%;
        height: 100%;
    }
    .demo-upload-list-cover{
        display: none;
        position: absolute;
        top: 0;
        bottom: 60px;
        left: 0;
        right: 0;
        background: rgba(0,0,0,.6);
    }
    .demo-upload-list:hover .demo-upload-list-cover{
        display: block;
    }
    .demo-upload-list-cover i{
        color: #fff;
        font-size: 20px;
        cursor: pointer;
        margin: 60px 2px;
    }
</style>