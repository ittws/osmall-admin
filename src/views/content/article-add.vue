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
                    <Form :label-width="80">
                        <FormItem label="分类">
                            <RadioGroup v-model="tagName" type="button">
                                <Radio :label="item.tagName" v-for="item in articleTags"></Radio>
                            </RadioGroup>
                            <Button type="info" @click="editArticleTag=true">管理分类</Button>
                        </FormItem>
                        <FormItem label="图文标题" :error="articleError">
                            <Input v-model="articleTitle" @on-blur="handleArticletitleBlur" style="width:260px"/>
                        </FormItem>
                        <FormItem label="封面图片" >
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
                                <!-- <Upload
                                    ref="upload"
                                    :show-upload-list="false"
                                    :default-file-list="defaultList"
                                    :on-success="handleSuccess"
                                    :format="['jpg','jpeg','png']"
                                    :max-size="2048"
                                    :on-format-error="handleFormatError"
                                    :on-exceeded-size="handleMaxSize"
                                    :before-upload="handleBeforeUpload"
                                    multiple
                                    type="drag"
                                    :action="actionName"
                                    style="display: inline-block;width:100px;height:100px"
                                    >
                                    <div style="line-height: 100px;">
                                        <Icon v-if="coverImageUrl===''" type="camera" size="20"></Icon>
                                        <Icon v-if="coverImageUrl!=''" type="edit" size="20"></Icon>
                                    </div>
                                </Upload> -->
                        </FormItem>
                        <FormItem label="内容源">
                            <RadioGroup v-model="linkType">
                                <Radio label="外部链接"></Radio>
                                <Radio label="自定义内容"></Radio>
                            </RadioGroup>
                        </FormItem>
                        <FormItem label="链接地址" v-show="linkType=='外部链接'">
                            <Input v-model="linkUrl"></Input>
                        </FormItem>
                        <div v-show="linkType=='自定义内容'">
                            <Button size="small" type="primary" @click.native="selectMateria" >打开素材库</Button>
                            <font color="#999" size="2">使用下面编辑器插入图片时, 需先打开素材库复制图片链接.</font>
                        </div>
                             <Modal title="预览文案" v-model="previewCopywriting" 
                                :width = 380
                                :closable="false"
                                cancel-text
                             >
                                    <!-- <RadioGroup v-model="animal">
                                        <Radio label="1">4.7寸</Radio>
                                        <Radio label="2">5.15寸</Radio>
                                        <Radio label="3">5.5寸</Radio>
                                        <Radio label="4">6.0寸</Radio>
                                    </RadioGroup> -->
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
                             </Modal>
                    </Form>
                    <div class="margin-top-20" v-show="linkType=='自定义内容'">
                        <textarea id="articleEditor"></textarea>
                    </div>
                    <Modal v-model="editArticleTag" title="图文分类管理">
                        <Tag closable v-for="item in articleTags" @on-close="deleteTag(item)">{{item.tagName}}</Tag>
                        <Input v-if="showAddArticleInput" v-model="newArticleTag" @on-blur="addTag()" style="width:150px"></Input>
                        <Button icon="ios-plus-empty" type="dashed" size="small" @click.native="showAddArticleInput=true"></Button>
                    </Modal>
                    <Modal title="封面图片" v-model="visible">
                        <img :src="coverImageUrl" v-if="visible" style="width: 100%">
                    </Modal>
                    <Modal v-model="showMateria" title="素材库" closable :scrollable="true" width="1024px">
                        <div class="demo-upload-list" v-for="item in materias">
                        
                            <div>
                                <div style="height:200px;width:100%">
                                    <img :src="item.url">
                                </div>
                                <div class="demo-upload-list-cover">
                                    <!--<Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>-->
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
                    </Modal>
                </Card>
            </Col>

        </Row>
        <Row class="margin-top-10">
        <Button type="primary" @click.native="save()" :loading="loading">保存</Button>
        <Button type="success" style="margin:10px" @click.native="preview" >样式预览</Button>
        </Row>
    </div>
</template>

<script>
import tinymce from 'tinymce';
export default {
    name: 'artical-publish',
    data () {
        return {
            animal:'3',
            showMateria:false,
            materias:[],
            timestamp:'1971-01-01 00:00',
            previewCopywriting:false,
            uploadList: [],
            defaultListMateria: [],
            loading:false,
            actionName:this.$http.defaults.baseURL+'admin/uploadMediaFile',
            articleUuid:'',
            articleType:'',
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
            linkType:'外部链接',
            linkUrl:''
        };
    },
    methods: {
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

            let options = {
                title:this.articleTitle,
                content:tinymce.activeEditor.getContent(),
                tagDTO:{
                    tagName:this.tagName
                },
                articleType:'1',
                coverImageUrl:this.coverImageUrl,
                actionType:'ADD',
                fromOfficialAccount:false,
                linkType:this.linkType
            };
            if(this.editModel){
                options.actionType='MODIFY';
                options.articleUuid = this.article.articleUuid;
            }
            if(this.linkType=='外部链接'){
                options.content=this.linkUrl;
            }
            this.loading = true;
            this.$http.post("/admin/changeArticle", this.common.request(options))  
                .then(response => {  
                    this.loading = false;
                    if(response.data.body.status.statusCode==0){
                        this.$Notice.success({
                            title: '成功',
                            desc: '图文已保存',
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
                            this.linkType=this.article.linkType;
                            if(this.linkType==null||this.linkType==''){
                                this.linkType = '自定义内容';
                            }
                            if(this.linkType=='自定义内容')
                                tinymce.activeEditor.setContent(this.article.content);
                            if(this.linkType=='外部链接')
                                this.linkUrl = this.article.content;
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
        this.articleType = this.$route.query.articleType;
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
            }
        });
        
    },
    destroyed () {
        tinymce.get('articleEditor').destroy();
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