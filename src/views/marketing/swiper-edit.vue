<style lang="less">
    @import '../../styles/common.less';
    .previewcss h1{
        text-align: center;
        font-size: 14px;
        font-weight: 600;
        margin-top: 20px
    }
    .ivu-col-offset-5 {
        margin: auto
    }
</style>

<template>
    <div>
        <Row>
            <Col span="24">
                <Card>
                    <Form >
                        <!-- <FormItem label="轮播图片" >
                            <div class="demo-upload-list" v-if="coverImageUrl" style="width:120px;line-height:0px;margin-left:40px">
                                <div style="width:100%">
                                    <img :src="coverImageUrl">
                                </div>
                                <div class="demo-upload-list-cover" style="bottom:0">
                                    <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
                                    <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
                                </div>
                            </div>
                            <Upload 
                                :action="actionName"
                                ref="upload"
                                :show-upload-list="false"
                                :default-file-list="defaultList"
                                :on-success="handleSuccess"
                                :format="['jpg','jpeg','png']"
                                :max-size="10240"
                                :on-format-error="handleFormatError"
                                :on-exceeded-size="handleMaxSize"
                                :before-upload="handleBeforeUpload"
                                multiple
                                style="width:100px;border:none;margin-left:52px"
                            >
                                <Button icon="ios-camera">选择图片</Button>
                            </Upload>
                        </FormItem> -->
                        <FormItem >
                            <RadioGroup v-model="articleSource">
                                <Radio label="商品详情页"></Radio>
                                <Radio label="商品组"></Radio>
                                <Radio label="自定义内容"></Radio>
                                <Radio label="外部网页链接"></Radio>
                            </RadioGroup>
                        </FormItem>
                        <FormItem >
                        <Row type="flex" justify="start" v-show="articleSource=='商品组'">
                            <Col span="20">
                            <FormItem label="商品组">
                                <Select clearable v-model="groupUuid" style="width:250px">
                                <Option v-bind:key="group.groupUuid" :value="group.groupUuid" v-for="group in groups">
                                    {{group.groupName}}
                                </Option>
                                </Select>
                            </FormItem>
                            </Col>
                        </Row>
                        </FormItem>
                        <FormItem   v-show="articleSource=='商品详情页'">
                        <div>
                            <Input
                                v-model="searchProductName"
                                placeholder="输入商品名称查询"
                                type="text"
                                style="width: 250px"
                                clearable
                            />
                            <Button type="success" @click="handleSearch">查询</Button>
                        </div>
                        <Row class="margin-top-10">
                            <Col span="18">
                            <div>
                                <Table
                                :loading="loading1"
                                @on-current-change="highlight"
                                :columns="productColumn"
                                :data="productData"
                                no-data-text="输入关键词搜索,不输入则查全部"
                                border
                                stripe
                                ref="productTable"
                                ></Table>
                            </div>
                            </Col>
                        </Row>
                        <Row class="margin-top-10">
                            <Page
                            ref="productpage"
                            :total="total"
                            size="small"
                            :pageSize="pageSize"
                            @on-change="changepage"
                            show-total
                            show-elevator
                            ></Page>
                        </Row>
                        </FormItem>
                        <!-- <div v-show="articleSource=='自定义内容'">
                            <Button size="small" type="primary" @click.native="selectMateria" >打开素材库</Button>
                            <font color="#999" size="2">使用下面编辑器插入图片时, 需先打开素材库复制图片链接.</font>
                        </div> -->
                        <FormItem label="外部网页链接" v-show="articleSource=='外部网页链接'">
                            <Input v-model="previewUrl"></Input>
                        </FormItem>
                             <!-- <Modal title="预览文案" v-model="previewCopywriting" 
                                :width = 380
                                :closable="false"
                                cancel-text
                             >
                                    <Row class="margin-top-20">
                                        <Col style="width:350px" offset="5">
                                            <div>
                                                <Card class="previewcss">
                                                    <h1 >{{ articleTitle }}</h1>
                                                    <p class="preview-publish-time" style="float:right;font-size:12px;margin-top: 10px;">{{timestamp}}</p>
                                                    <div class="preview-content-con" v-html="content1" style="margin-top: 60px;"></div>
                                                </Card>
                                            </div>
                                        </Col>
                                    </Row>
                             </Modal> -->
                    </Form>
                    <div class="margin-top-20" v-show="articleSource=='自定义内容'">
                        <textarea id="articleEditor"></textarea>
                    </div>
                    <!-- <Modal v-model="editArticleTag" title="图文分类管理">
                        <Tag closable v-for="item in articleTags" @on-close="deleteTag(item)">{{item.tagName}}</Tag>
                        <Input v-if="showAddArticleInput" v-model="newArticleTag" @on-blur="addTag()" style="width:150px"></Input>
                        <Button icon="ios-plus-empty" type="dashed" size="small" @click.native="showAddArticleInput=true"></Button>
                    </Modal> -->
                    <Modal title="封面图片" v-model="visible">
                        <img :src="coverImageUrl" v-if="visible" style="width: 100%">
                    </Modal>
                    <!-- <Modal v-model="showMateria" title="素材库" closable :scrollable="true" width="1024px">
                        <div class="demo-upload-list" v-for="item in materias">
                        
                            <div>
                                <div style="height:200px;width:100%">
                                    <img :src="item.url">
                                </div>
                                <div class="demo-upload-list-cover">
                                    <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
                                    <Icon type="ios-trash-outline" @click.native="handleRemoveMateria(item)"></Icon>
                                </div>
                                
                            </div>
                            <div class="padding-top-10 t_c">

                                <button 
                                v-clipboard:copy="item.url"
                                v-clipboard:success="onCopy" 
                                class="ivu-btn ivu-btn-primary ivu-btn-small">复制链接</button>
                            </div>
                        
                        
                    </div>
                    <Upload
                            ref="upload"
                            :show-upload-list="false"
                            :default-file-list="defaultListMateria"
                            :on-success="handleSuccessMateria"
                            :max-size="10240"
                            :on-format-error="handleFormatErrorMateria"
                            :on-exceeded-size="handleMaxSizeMateria"
                            :before-upload="handleBeforeUploadMateria"
                            multiple
                            type="drag"
                            :action="actionName"
                            style="display: inline-block;width:160px;">
                            <div style="width: 160px;height:260px;line-height: 260px;">
                                <Icon type="camera" size="20"></Icon>
                            </div>
                        </Upload>
                    </Modal> -->
                </Card>
            </Col>

        </Row>
        <Row class="margin-top-10">
        <Button type="primary" @click.native="save()" :loading="loading">保存</Button>
        <!-- <Button type="success" style="margin:10px" @click.native="preview" >样式预览</Button> -->
        </Row>
    </div>
</template>

<script>
import tinymce from 'tinymce';
export default {
    name: 'artical-publish',
    data () {
        return {
            searchProductName:'',
            pageSize: 15,
            startIndex: 0,
            swiper:{},
            groupUuid:'',   //商品组ID
            groups: [], //商品组列表
            productData: [],
            total:0,
            productUuid:'',
            productColumn:[
                    {
                        title: '选中',
                        width: 80,
                        align: 'center',
                        key:'checkBox',
                        render:(h,params)=>{
                            return h('div',[
                                h('Checkbox',{
                                    props:{
                                        value:params.row.checkBox
                                    },
                                    on:{
                                        'on-change':(e)=>{
                                            this.productData.forEach((items)=>{      
                                                this.$set(items,'checkBox',false)
                                            });
                                            this.productData[params.index].checkBox = e;
                                            if (e) {
                                                this.productUuid = params.row.productUuid
                                            }else{
                                                this.productUuid = ''
                                            }
                                             
                                        }
                                    }
                                })
                            ])
                        }

                    },
                    {
                    title: "供应商",
                    align: "center",
                    key: "supplierName",
                    width: 150,
                    },
                    {
                    title: "类目",
                    align: "center",
                    key: "productCateName",
                    width: 120,
                    },
                    {
                    title: "名称",
                    key: "productName",
                    // width: "300px",
                    render: (h, params) => {
                        return h(
                        "span",
                        {
                            props: {
                            row: params.row
                            }
                        },
                        [
                            h("img", {
                            attrs: {
                                src: params.row.productMainImage.url
                            },
                            style: {
                                width: "60px",
                                height: "48px",
                                display: "inline-block",
                                float: "left",
                                margin: "5px 0"
                            }
                            }),
                            h(
                            "span",
                            {
                                style: {
                                display: "inline-block",
                                float: "left",
                                // width: "200px",
                                marginTop: "10px"
                                }
                            },
                            params.row.productName
                            )
                        ]
                        );
                    }
                    },
                    {
                    title: "价格",
                    align: "center",
                    width: 100,
                    render: (h, params) => {
                        console.log(params);
                        return h(
                        "span",
                        {
                            props: {
                            row: params.row
                            }
                        },
                        [
                            h(
                            "span",
                            {
                                style: {
                                display: "inline-block",
                                float: "right",
                                width: "100px",
                                marginTop: "10px",
                                color:"red"
                                }
                            },
                            params.row.unitPoint+"购币"
                            ),
                            h(
                            "span",
                            {
                                style: {
                                display: "inline-block",
                                float: "right",
                                width: "100px",
                                "text-decoration":"line-through" 
                                }
                            },
                            params.row.unitPointStandard + "购币"
                            )
                        ]
                        );
                    }
                    },
                    {
                    title: "营销状态",
                    align: "center",
                     width: 200,
                    render: (h, params) => {
                        let isHot = params.row.hot;
                        let isRecommend = params.row.recommend;
                        let isNew = params.row.new;
                        return h(
                        "span",
                        {
                            props: {
                            row: params.row
                            }
                        },
                        [
                            h('tag', {
                                props: {
                                color: "green"
                                },
                                style: {
                                    display: isHot?"display":"none"
                                }
                            }, "热卖"),
                            h('tag', {
                                props: {
                                color: "green"
                                },
                                style: {
                                    display: isRecommend?"display":"none"
                                }
                            }, "推荐"),
                            h('tag', {
                                props: {
                                color: "green"
                                },
                                style: {
                                    display: isNew?"display":"none"
                                }
                            }, "新品")
                        ]
                        );
                    }
                    },
                    {
                        title: '状态',
                        align: 'center',
                        width: 120,
                        render: (h, params) => {
                            let status = (params.row.onSale?'已上架':'未上架');
                            let color = (params.row.onSale?'green':'red');
                            return h('tag', {
                                props: {
                                    color: color
                                }
                            }, status)
                        }
                    },
            ],
            animal:'3',
            showMateria:false,
            materias:[],
            timestamp:'1971-01-01 00:00',
            previewCopywriting:false,
            uploadList: [],
            defaultListMateria: [],
            loading1 :false,
            loading:false,
            actionName:this.$http.defaults.baseURL+'admin/uploadMediaFile',
            articleUuid:'',
            swiper:'',
            tagName:'',
            coverImageUrl:'',
            visible:false,
            defaultList:[],
            editModel:false,
            articleTags:[],
            articleTitle: '',
            articleError: '',
            editArticleTag:false,
            showAddArticleInput:false,
            newArticleTag:'',
            showLink: false,
            fixedLink: '',
            articlePath: '',
            content1:'',
            articlePathHasEdited: false,
            editLink: false,
            editPathButtonType: 'ghost',
            editPathButtonText: '编辑',
            articleStateList: [{value: '草稿'}, {value: '等待复审'}],
            editOpenness: false,
            Openness: '公开',
            currentOpenness: '公开',
            topArticle: false,
            publishTime: '',
            publishTimeType: 'immediately',

            editPublishTime: false, // 是否正在编辑发布时间
            articleTagSelected: [], // 文章选中的标签
            articleTagList: [], // 所有标签列表
            classificationList: [],
            classificationSelected: [], // 在所有分类目录中选中的目录数组
            offenUsedClass: [],
            offenUsedClassSelected: [], // 常用目录选中的目录
            classificationFinalSelected: [], // 最后实际选择的目录
            publishLoading: false,
            addingNewTag: false, // 添加新标签
            newTagName: '', // 新建标签名
            articleSource:'外部网页链接',
            previewUrl:''
        };
    },
    methods: {
        highlight(currentRow){
            // this.productUuid = currentRow.productUuid
        },
        handleSearch(){
            this.resetPage();
            this.searchProduct();
        },
        resetPage() {
            this.startIndex = 0;
            this.total = 0;
            this.productData = [];
            this.productlist = [];
            //重新设置成显示第一页
            this.$nextTick(function() {
                this.$refs["productpage"].currentPage = 1;
            });
        },
        changepage(index) {
            this.startIndex = (index - 1) * this.pageSize;
            this.searchProduct();
        },
        // 查询商品组
        inquiryProductGroup() {
        let searchOptions = { 
        };
        this.$http
            .post("/admin/inquiryProductGroup", this.common.request(searchOptions))
            .then(
            res => {
                if (res.data.body.status.statusCode == 0) {
                var data = res.data.body.data;
                this.groups = data.groups;
                }
            },
            res => {
            }
            );
        },
        searchProduct() {
            let keyArray = [];
            var searchOptions = {
                startIndex: this.startIndex,
                pageSize: this.pageSize
            };
            //判断是否有商品名称查询条件
            if (this.searchProductName) {
                keyArray.push("PRODUCT_NAME");
                searchOptions.productName = this.searchProductName;
            }
            searchOptions.keyArray = keyArray;
            this.loading1 = true;
            this.$http
                .post("/admin/searchProduct", this.common.request(searchOptions))
                .then(
                response => {
                    if (response.data.body.status.statusCode == 0) {
                    this.loading1 = false;
                    this.products = response.data.body.data.products;
                    this.total = response.data.body.data.total;
                    let productData = [];
                    this.products.forEach(function(val, ind) {
                        //商品类目
                        val.productCateName = val.productCateDTO.cateName;
                        //供应商
                        if(val.supplierDTO)
                            val.supplierName = val.supplierDTO.supplierName;
                            //多规格商品
                        if (val.skuEnabled) {
                            if (val.minUnitPoint && val.maxUnitPoint) {
                            val.unitPoint = val.minUnitPoint + "-" + val.maxUnitPoint;
                            }
                        }
                        if (val.onSale) {
                            productData.push(val);
                        }
                    });
                    this.productData = productData;
                    // this.getData();
                    } else {
                    this.loading1 = false;
                    this.$Message.error(response.data.body.status.errorDesc);
                    }
                },
                response => {
                    this.$Message.error("失败，请稍后重试");
                }
                );
            },
             iniproductid(productUuid) {
                 this.loading1 = true;
                 var options = {
                    productUuid: productUuid
                };
                this.$http
                    .post("/admin/inquiryProduct", this.common.request(options))
                    .then(
                response => {
                    this.loading1 = false;
                    if (response.data.body.status.statusCode == 0) {
                    let products = response.data.body.data;
                    products.productCateName = products.productCateDTO.cateName;
                    products.supplierName = products.supplierDTO.supplierName;
                    products.checkBox = true;
                    this.productData.push(products);
                    this.total = 1,
                    this.searchProductName = products.productName;
                    } else {
                    this.$Message.error(response.data.body.status.errorDesc);
                    }
                },
                response => {
                    this.loading1 = false;
                    this.$Message.error("失败，请稍后重试");
                }
                );
            },
        preview(){
            this.timestamp = new Date(+new Date()+8*3600*1000).toISOString().replace(/T/g,' ').replace(/\.[\d]{3}Z/,'')
            this.content1 = tinymce.activeEditor.getContent();
            this.previewCopywriting = true;
        },
        handleRemoveMateria (item) {
            let options = {
                actionType:'DELETE',
                materiaUuid:item.materiaUuid
            }
            this.$http.post("/admin/changeMateria", this.common.request(options)) 
            .then(response => {  
                if(response.data.body.status.statusCode==0){
                    this.initMateriaData();
                }else{
                    this.$Message.error(response.data.body.status.errorDesc);
                }
            }, response => {  
                this.$Message.error(response.data.body.status.errorDesc);
            })
        },
        handleSuccessMateria (res, file) {

            let url = res.data[0];  //获取上传成功后的地址
            let options = {
                actionType:'ADD',
                type:this.selectedType,
                url:url
            }
            this.$http.post("/admin/changeMateria", this.common.request(options)) 
            .then(response => {  
                if(response.data.body.status.statusCode==0){
                    this.initMateriaData();
                    
                }else{
                    this.$Message.error(response.data.body.status.errorDesc);
                }
            }, response => {  
                this.$Message.error(response.data.body.status.errorDesc);
            })
            
        },
        handleFormatErrorMateria (file) {
            this.$Notice.warning({
                title: 'The file format is incorrect',
                desc: 'File format of ' + file.name + ' is incorrect, please select jpg or png.'
            });
        },
        handleMaxSizeMateria (file) {
            this.$Notice.warning({
                title: 'Exceeding file size limit',
                desc: 'File  ' + file.name + ' is too large, no more than 2M.'
            });
        },
        handleBeforeUploadMateria () {
            const check = this.uploadList.length < 500;
            if (!check) {
                this.$Notice.warning({
                    title: 'Up to 500 pictures can be uploaded.'
                });
            }
            return check;
        },
        onCopy(){
            this.$Message.info('已复制');
        },
        selectMateria(){
            this.showMateria = true;
        },
        handleView (item) {
            this.viewArticle = item;
            this.visible = true;
        },
        handleRemove (item) {
            this.coverImageUrl = '';
        },
        handleSuccess (res, file) {
            debugger
            this.coverImageUrl = res.data[0];
            
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
        initTagData(){
            
            this.$http.post("/public/inquiryTag", this.common.request({tagType:'ARTICLE'}))  
                .then(response => {  
                    if(response.data.body.status.statusCode==0){
                        this.articleTags = response.data.body.data.tags;
                    }else{
                        this.$Message.error(response.data.body.status.errorDesc);
                    }
                }, response => {  
                    this.$Message.error(response.data.body.status.errorDesc);
                });
        },
        addTag(){
            this.$http.post("/admin/changeTag", this.common.request({actionType:'ADD',tagName:this.newArticleTag,tagType:'ARTICLE'}))  
                .then(response => {  
                    if(response.data.body.status.statusCode==0){
                        this.initTagData();
                        this.showAddArticleInput = false;
                    }else{
                        this.$Message.error(response.data.body.status.errorDesc);
                    }
                }, response => {  
                    this.$Message.error(response.data.body.status.errorDesc);
                });
        },
        deleteTag(item){
            item.actionType="DELETE";
            this.$http.post("/admin/changeTag", this.common.request(item))  
                .then(response => {  
                    if(response.data.body.status.statusCode==0){
                        this.initTagData();
                    }else{
                        this.$Message.error(response.data.body.status.errorDesc);
                    }
                }, response => {  
                    this.$Message.error(response.data.body.status.errorDesc);
                });
        },
        save(){
            var linkType = '';
            let options = {
                actionType:'MODIFY',
                swiperUuid:this.swiper.swiperUuid,
                url:this.swiper.url
            };
            if(this.articleSource == '商品详情页'){
                options.linkType = 0;
                options.content = this.productUuid;
            }
            if(this.articleSource == '自定义内容'){
                options.linkType = 1;
                options.content = tinymce.activeEditor.getContent()
            }
            if(this.articleSource == '外部网页链接'){
                options.linkType = 2;
                options.content = this.previewUrl
            }
            if(this.articleSource == '商品组'){
                options.linkType = 3;
                options.content = this.groupUuid;
            }
            this.loading = true;
            this.$http.post("/admin/changeSwiper", this.common.request(options))  
                .then(response => {  
                    this.loading = false;
                    if(response.data.body.status.statusCode==0){
                        this.$Notice.success({
                            title: '成功',
                            desc: '轮播图链接内容已修改',
                            duration:2
                        });
                        this.$router.go(-1)
                    }else{
                        this.$Message.error(response.data.body.status.errorDesc);
                    }
                }, response => { 
                    this.loading = false;
                    this.$Message.error('出错了');
                    
                });
        },
        handleArticletitleBlur () {
            if (this.articleTitle.length !== 0) {
                // this.articleError = '';
                localStorage.articleTitle = this.articleTitle; // 本地存储文章标题
                if (!this.articlePathHasEdited) {
                    let date = new Date();
                    let year = date.getFullYear();
                    let month = date.getMonth() + 1;
                    let day = date.getDate();
                    this.fixedLink = window.location.host + '/' + year + '/' + month + '/' + day + '/';
                    this.articlePath = this.articleTitle;
                    this.articlePathHasEdited = true;
                    this.showLink = true;
                }
            } else {
                // this.articleError = '文章标题不可为空哦';
                this.$Message.error('文章标题不可为空');
            }
        },
        editArticlePath () {
            this.editLink = !this.editLink;
            this.editPathButtonType = this.editPathButtonType === 'ghost' ? 'success' : 'ghost';
            this.editPathButtonText = this.editPathButtonText === '编辑' ? '完成' : '编辑';
        },
        handleEditOpenness () {
            this.editOpenness = !this.editOpenness;
        },
        handleSaveOpenness () {
            this.Openness = this.currentOpenness;
            this.editOpenness = false;
        },
        cancelEditOpenness () {
            this.currentOpenness = this.Openness;
            this.editOpenness = false;
        },
        handleEditPublishTime () {
            this.editPublishTime = !this.editPublishTime;
        },
        handleSavePublishTime () {
            this.publishTimeType = 'timing';
            this.editPublishTime = false;
        },
        cancelEditPublishTime () {
            this.publishTimeType = 'immediately';
            this.editPublishTime = false;
        },
        setPublishTime (datetime) {
            this.publishTime = datetime;
        },
        setClassificationInAll (selectedArray) {
            this.classificationFinalSelected = selectedArray.map(item => {
                return item.title;
            });
            localStorage.classificationSelected = JSON.stringify(this.classificationFinalSelected); // 本地存储所选目录列表
        },
        setClassificationInOffen (selectedArray) {
            this.classificationFinalSelected = selectedArray;
        },
        handleAddNewTag () {
            this.addingNewTag = !this.addingNewTag;
        },
        createNewTag () {
            if (this.newTagName.length !== 0) {
                this.articleTagList.push({value: this.newTagName});
                this.addingNewTag = false;
                setTimeout(() => {
                    this.newTagName = '';
                }, 200);
            } else {
                this.$Message.error('请输入标签名');
            }
        },
        cancelCreateNewTag () {
            this.newTagName = '';
            this.addingNewTag = false;
        },
        canPublish () {
            if (this.articleTitle.length === 0) {
                this.$Message.error('请输入文章标题');
                return false;
            } else {
                return true;
            }
        },
        handlePreview () {
            if (this.canPublish()) {
                if (this.publishTimeType === 'immediately') {
                    let date = new Date();
                    let year = date.getFullYear();
                    let month = date.getMonth() + 1;
                    let day = date.getDate();
                    let hour = date.getHours();
                    let minute = date.getMinutes();
                    let second = date.getSeconds();
                    localStorage.publishTime = year + ' 年 ' + month + ' 月 ' + day + ' 日 -- ' + hour + ' : ' + minute + ' : ' + second;
                } else {
                    localStorage.publishTime = this.publishTime; // 本地存储发布时间
                }
                localStorage.content = tinymce.activeEditor.getContent();
                this.$router.push({
                    name: 'preview'
                });
            }
        },
        handleSaveDraft () {
            if (!this.canPublish()) {
                //
            }
        },
        handlePublish () {
            if (this.canPublish()) {
                this.publishLoading = true;
                setTimeout(() => {
                    this.publishLoading = false;
                    this.$Notice.success({
                        title: '保存成功',
                        desc: '文章《' + this.articleTitle + '》保存成功'
                    });
                }, 1000);
            }
        },
        handleSelectTag () {
            localStorage.tagsList = JSON.stringify(this.articleTagSelected); // 本地存储文章标签列表
        },
        handleSelectTag () {
            localStorage.tagsList = JSON.stringify(this.articleTagSelected); // 本地存储文章标签列表
        },
        initArticleData () {
            //编辑模式
            let articleUuid = this.$route.query.articleUuid;
            if(articleUuid!=null && articleUuid != ''){
                this.editModel=true;
                this.$http.post("/public/inquiryArticle", this.common.request({articleUuid:articleUuid}))  
                    .then(response => {  
                        if(response.data.body.status.statusCode==0){
                            this.article = response.data.body.data;
                            if(this.article.tagDTO != null)
                                this.tagName=this.article.tagDTO.tagName;
                            this.articleTitle=this.article.title;
                            this.coverImageUrl = this.article.coverImageUrl;
                            this.previewUrl=this.article.previewUrl;
                            if(this.previewUrl==null||this.previewUrl==''){
                                this.articleSource = '自定义内容';
                            }
                            tinymce.activeEditor.setContent(this.article.content);
                        }else{
                            this.$Message.error(response.data.body.status.errorDesc);
                        }
                    }, response => {  
                        this.$Message.error(response.data.body.status.errorDesc);
                    });
                }
        },
        initMateriaData(){
            this.$http.post("/public/inquiryMateria", this.common.request({})) 
            .then(response => {  
                if(response.data.body.status.statusCode==0){
                    this.materias = response.data.body.data.materias;
                }else{
                    this.$Message.error(response.data.body.status.errorDesc);
                }
            }, response => {  
                this.$Message.error('出错了');
            })
        }
    },
    computed: {
        completeUrl () {
            let finalUrl = this.fixedLink + this.articlePath;
            localStorage.finalUrl = finalUrl; // 本地存储完整文章路径
            return finalUrl;
        }
    },
    mounted () {
        this.swiper = this.$route.query.Row;
        if (this.swiper.linkType == '0') {
            this.articleSource = '商品详情页';
            this.iniproductid(this.swiper.content);
        }else{
            this.searchProduct();
        }
        if (this.swiper.linkType == '2') {
            this.articleSource = '外部网页链接';
            this.previewUrl = this.swiper.content
        }
        if (this.swiper.linkType == '3') {
            this.articleSource = '商品组';
            this.groupUuid = this.swiper.content
        }
        this.inquiryProductGroup();
        this.initMateriaData();
        this.initTagData();
        let initArticleDataFun = this.initArticleData;
        tinymce.init({
            selector: '#articleEditor',
            branding: false,
            elementpath: false,
            width:450,
            height: 600,
            language: 'zh_CN.GB2312',
            menubar: 'edit insert view format table tools',
            theme: 'modern',
            plugins: [
                'advlist autolink lists link image charmap print  hr anchor pagebreak imagetools',
                'searchreplace visualblocks visualchars code fullscreen fullpage',
                'insertdatetime media nonbreaking save table contextmenu directionality',
                'emoticons paste textcolor colorpicker textpattern imagetools codesample'
            ],
            toolbar1: ' newnote print fullscreen  undo redo | insert | styleselect | fontsizeselect | forecolor backcolor bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image emoticons media',
            autosave_interval: '20s',
            image_advtab: true,
            table_default_styles: {
                width: '100%',
                borderCollapse: 'collapse'
            },
            init_instance_callback:function (editor) {
                initArticleDataFun();                      
            },
        });
        if (this.swiper.linkType == '1') {
            this.articleSource = '自定义内容';
            tinymce.activeEditor.setContent(this.swiper.content);
        }
        
    },
    created() {
    this.swiper = this.$route.query.Row;
    this.coverImageUrl = this.$route.query.Row.url;
    
  },
    destroyed () {
        tinymce.get('articleEditor').destroy();
        // tinymce.activeEditor.setContent('');
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
        margin: 60px 2px 0 2px;
    }
</style>