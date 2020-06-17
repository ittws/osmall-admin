<style lang="less">
    @import '../../styles/common.less';
    .mask1{
        position: relative;
        top: -17px;
        left: -18%;
        width: 50%;
        height: 10%;
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
                        <FormItem label="音频标题" :error="articleError">
                            <Input v-model="articleTitle" @on-blur="handleArticletitleBlur" style="width:400px"/>
                        </FormItem>
                        <FormItem label="封面图片">
                            <div class="demo-upload-list" v-if="coverImageUrl">
                                <div style="height:160px;width:100%">
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
                                    style="display: inline-block;width:160px;">
                                    <div style="width: 160px;height:160px;line-height: 160px;">
                                        <Icon v-if="coverImageUrl===''" type="camera" size="20"></Icon>
                                        <Icon v-if="coverImageUrl!=''" type="edit" size="20"></Icon>
                                    </div>
                                </Upload> -->
                        </FormItem>
                        <!--
                        <FormItem label="音频文件">
                            <div v-for="item in uploadList">
                            <template v-if="item.status === 'finished'">
                                <div v-if="content">
                                    <audio :src="item.url" controls="controls"></audio>
                                </div>
                            </template>
                            <template v-else>
                                <Progress  :percent="item.percentage" hide-info></Progress>
                            </template>
                            </div>
                                <Upload
                                    ref="audioUpload"
                                    :show-upload-list="false"
                                    :default-file-list="audioList"
                                    :on-success="handleAudioSuccess"
                                    :format="['mp3']"
                                    :max-size="204800"
                                    :on-format-error="handleAudioFormatError"
                                    :on-exceeded-size="handleAudioMaxSize"
                                    :before-upload="handleAudioBeforeUpload"
                                    multiple
                                    type="drag"
                                    :action="actionName"
                                    style="display: inline-block;width:50px;">
                                    <div style="width: 50px;height:50px;line-height: 50px;">
                                        <Icon v-if="content===''" type="ionic" size="20"></Icon>
                                        <Icon v-if="content!=''" type="edit" size="20"></Icon>
                                    </div>
                                </Upload>
                                <div style="height:50px;line-height:50px">
                                mp3格式, 不大于200M
                                </div>
                        </FormItem>
                        -->
                        <FormItem label="音频文件">
                        <template style="position:absolute;">
                            <Spin size="large" fix v-if="spinShow" class="mask1">请稍后、音频文件上传中........</Spin>
                            <div  style="width:30%">
                                <template v-if="content">
                                    <audio :src="content" controls="controls"></audio>
                                </template>
                                <template v-if="uploadList.length>0&&uploadList[uploadList.length-1].percentage!=100">
                                    <Progress :percent="uploadList[uploadList.length-1].percentage" hide-info></Progress>
                                </template>
                            </div>
                            <Upload
                                ref="audioUpload"
                                :show-upload-list="false"
                                :default-file-list="defaultList"
                                :on-success="handleAudioSuccess"

                                :format="['mp3']"
                                :max-size="204800"
                                :on-format-error="handleAudioFormatError"
                                :on-exceeded-size="handleAudioMaxSize"
                                :on-progress="handleAudioBeforeUpload"
                                multiple
                                type="drag"
                                :action=actionName
                                style="display: inline-block;width:58px;">
                                
                                <div style="width: 58px;height:58px;line-height: 58px;">
                                    <Icon type="headphone" size="20"></Icon>
                                </div>

                            </Upload>
                            <div>
                                mp3格式, 小于200M
                                </div>
                        </template>
                         </FormItem>
                        
                    </Form>
                    <!--
                    <div class="margin-top-20">
                        <textarea id="articleEditor"></textarea>
                    </div>
                    -->
                    <Modal v-model="editArticleTag" title="音频分类管理">
                        <Tag closable v-for="item in articleTags" @on-close="deleteTag(item)">{{item.tagName}}</Tag>
                        <Input v-if="showAddArticleInput" v-model="newArticleTag" @on-blur="addTag()" style="width:150px"></Input>
                        <Button icon="ios-plus-empty" type="dashed" size="small" @click.native="showAddArticleInput=true"></Button>
                    </Modal>
                    <Modal title="封面图片" v-model="visible">
                        <img :src="coverImageUrl" v-if="visible" style="width: 100%">
                    </Modal>
                </Card>
            </Col>

        </Row>
        <Row class="margin-top-10">
        <Button type="primary" @click.native="save()" :loading="loading">保存</Button>
        </Row>
    </div>
</template>

<script>
import tinymce from 'tinymce';
export default {
    name: 'artical-publish',
    data () {
        return {
            showMateria:false,
            materias:[],
            uploadList: [],
            defaultListMateria: [],
            loading:false,
            actionName:this.$http.defaults.baseURL+'admin/uploadMediaFile',
            articleUuid:'',
            articleType:'',
            tagName:'',
            coverImageUrl:'',
            content:'',
            visible:false,
            defaultList:[],
            audioList:[],
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
            spinShow:false,
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
            newTagName: '' // 新建标签名
        };
    },
    methods: {
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
                desc: 'File  ' + file.name + ' is too large, no more than 10M.'
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
        handleAudioSuccess (res, file) {
            this.spinShow = false;
            file.url = res.data[0];
            file.name = '';
            this.content = res.data[0];
        },
        handleFormatError (file) {
            this.$Notice.warning({
                title: '图片类型错误',
                desc: '不支持'+file.name + '图片类型, 请上传 jpg 或者 png图片.',
                duration:2
            });
        },
        handleAudioFormatError (file) {
            this.$Notice.warning({
                title: '音频类型错误',
                desc: '不支持'+file.name + '类型, 请上传mp3文件.',
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
        handleAudioMaxSize (file) {
            this.$Notice.warning({
                title: '音频大小超过限制',
                desc: '文件  ' + file.name + ' 文件超过200M.',
                duration:2
            });
        },
        handleBeforeUpload () {
            
        },
        handleAudioBeforeUpload () {
                this.spinShow = true;
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
                content: this.content,
                tagDTO:{
                    tagName:this.tagName
                },
                articleType:'2',
                coverImageUrl:this.coverImageUrl,
                actionType:'ADD',
                fromOfficialAccount:false
            };
            if(this.editModel){
                options.actionType='MODIFY';
                options.articleUuid = this.article.articleUuid;

            }
            this.loading = true;
            this.$http.post("/admin/changeArticle", this.common.request(options))  
                .then(response => {  
                    this.loading = false;
                    if(response.data.body.status.statusCode==0){
                        this.$Notice.success({
                            title: '成功',
                            desc: '音频已保存',
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
                            this.content = this.article.content;
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
        //this.articleType = this.$route.query.articleType;
        //this.initMateriaData();
        this.initTagData();
        this.initArticleData();
        //let initArticleDataFun = this.initArticleData;\
        // this.uploadList = this.$refs.audioUpload.fileList;
        /**
        tinymce.init({
            selector: '#articleEditor',
            branding: false,
            elementpath: false,
            height: 600,
            language: 'zh_CN.GB2312',
            menubar: 'edit insert view format table tools',
            theme: 'modern',
            plugins: [
                'advlist autolink lists link image charmap print preview hr anchor pagebreak imagetools',
                'searchreplace visualblocks visualchars code fullscreen fullpage',
                'insertdatetime media nonbreaking save table contextmenu directionality',
                'emoticons paste textcolor colorpicker textpattern imagetools codesample'
            ],
            toolbar1: ' newnote print fullscreen preview | undo redo | insert | styleselect | fontsizeselect | forecolor backcolor bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image emoticons media',
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
        */
    },
    destroyed () {
        /**
        tinymce.get('articleEditor').destroy();
        */
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