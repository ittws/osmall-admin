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
                         素材列表
                    </p>
                    <Row>
                        <Button icon="plus" type="primary" @click.native="add('2')">发布音频</Button>
                        <Button icon="plus" type="primary" @click.native="add('3')">发布视频</Button>
                        <Button icon="plus" type="primary" @click.native="add('1')">发布图文</Button>
                        <!--<Button type="warning" @click.native="editArticleTag=true">素材分类</Button>-->
                        <Poptip confirm title="您确定要删除这些素材吗" transfer @on-ok="delMulti">
                            <Button type="error">批量删除</Button>
                        </Poptip>
                        <div class="f_r">
                            <Input v-model="searchTitle" @on-change="handleSearch" icon="search" placeholder="请输入标题搜索" style="width: 150px" />
                        </div>
                    </Row>
                    <Row>
                        <Col span="24">
                            <div style="text-align:center">
                            <RadioGroup v-model="selectedTag" type="button" @on-change="initArticleByType(selectedTag)">
                                <Radio label="0">全部</Radio>
                                <Radio label="1">图文</Radio>
                                <Radio label="2">音频</Radio>
                                <Radio label="3">视频</Radio>
                            </RadioGroup>
                            </div>
                        </Col>
                    </Row>
                    <Row class="margin-top-20">
                        <Col span="24">
                            <div>
                                <Table :loading="loading" :columns="articleColumn" :data="articleData" :border="border" @on-selection-change="selectchange"></Table>
                                
                            </div>
                        </Col>
                    </Row>
                    <Row class="margin-top-10">
                        <Page ref="articlepage" :total="total" size="small" :pageSize="pageSize" @on-change="changepage" show-total show-elevator></Page>
                    </Row>
                    <Modal v-model="editArticleTag" title="素材分类管理">
                        <Tag closable v-for="item in articleTags" @on-close="deleteTag(item)">{{item.tagName}}</Tag>
                        <Input v-if="showAddArticleInput" v-model="newArticleTag" @on-blur="addTag()" style="width:150px"></Input>
                        <Button icon="ios-plus-empty" type="dashed" size="small" @click.native="showAddArticleInput=true"></Button>
                    </Modal>
                </Card>
            </Col>
        </Row>
    </div>
</template>

<script>
import {ajaxArticleListData} from '../common-components/data/article-list-data.js';
export default {
    components: {
        
    },
    data () {
        return {
            loading:false,
            actionName:this.$http.defaults.baseURL+'admin/uploadFile',
            articleTags:[],
            editArticleTag:false,
            showAddArticleInput:false,
            newArticleTag:'',
            selectedTag:'',
            selectedArticles:[],
            border:false,
            showHeader:false,
            editModel: false,
            resetModel: false,
            addModel: false,
            editRoleModel: false,
            multipleCouponModel: false,
            editRow: {},
            addRow: {},
            totalData:[],
            articles:[],
            searchTitle:'',
            total:0,
            pageSize:8,
            articleData:[],
            articleColumn : [
            {
                type: 'selection',
                width: 60,
                align: 'center'
            },
            {
                title: '封面图',
                align: 'center',
                width: 160,
                render: (h, params) => {
                    return h('div', [
                        h('Img',{
                            attrs:{
                                src: params.row.coverImageUrl,
                                width:"100%",
                                height:"100px"
                            },
                            style:{
                                paddingTop:"5px"
                            }
                        })
                    ]);
                },
            },
            {
                title: '素材标题',
                align: 'left',
                key: 'title'
            },
            {
                title: '分类标签',
                align: 'center',
                width: 120,
                render: (h, params) => {
                    var tagDTO = params.row.tagDTO;
                    if(tagDTO != null){
                        return h('tag', {
                            props: {
                                color:'blue'
                            }
                        }, tagDTO.tagName)
                    }
                }
            },
            {
                title: '素材类别',
                align: 'center',
                width: 120,
                render: (h, params) => {
                    var articleType = params.row.articleType;
                    let str = "";
                    if(articleType == '1'){
                        str = '图文'
                    }else if(articleType == '2'){
                        str = '音频'
                    }else if(articleType == '3'){
                        str = '视频'
                    }
                    return h('tag', {
                        props: {
                            color:'orange'
                        }
                    }, str)
                }
            },
            {
                title: '状态',
                align: 'center',
                width: 120,
                render: (h, params) => {
                    let str = (params.row.published?'已发布':'草稿');
                    let color = (params.row.published?'green':'default');
                    return h('tag', {
                        props: {
                            color:color
                        }
                    }, str)
                }
            },
            {
                title: '发布日期',
                align: 'center',
                key: 'publishTime',
                sortable:true,
                width: 150,
            },
            {
                title: '操作',
                align: 'center',
                width: 220,
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
                        // h('Button',{
                        //     props: {
                        //         type: 'primary',
                        //         size: 'small'
                        //     },
                        //     style: {
                        //         margin: '0 5px 0 0'
                        //     },
                        //     on: {
                        //         click: (event) => {
                        //             this.preview(params.row);
                        //         }
                        //     }
                        // },'预览'),
                        h('Poptip',{
                            props: {
                                confirm: true,
                                title: '您确定要发布该素材吗?',
                                transfer: true
                            },
                            on: {
                                'on-ok': () => {
                                    this.publish(params.row);
                                }
                            }
                        },[
                            h('Button',{
                            props: {
                                type: 'success',
                                size: 'small'
                            },
                            style: {
                                margin: '0 5px 0 0'
                            },
                        },'发布')
                        ]),
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
            }]
        }
    },
    methods: {
        initPage(totalCount, pageNum, data){
            /**
            this.totalData = data;
            
            this.total = this.totalData.length;
            
            if(this.totalData.length < this.pageSize){
                this.articleData = this.totalData;
            }else{
                this.articleData = this.totalData.slice(0,this.pageSize);
            }
            
            this.$nextTick(function(){
                this.$refs['articlepage'].currentPage = 1;
            })
            **/
            this.articleData = data;
            this.total = totalCount;
            this.$nextTick(function(){
                this.$refs['articlepage'].currentPage = pageNum;
            })
        },
        selectchange(selection){
            this.selectedArticles = selection;
        },
        //处理分页-页数改变
        changepage(pageNum){
            if(this.selectedTag===''){
                this.inquiryArticle(pageNum,this.pageSize);
            }else if(this.selectedTag!=''){
                this.inquiryArticleByTag(this.selectedTag,pageNum,this.pageSize);
            }
            
        },
        search (data, argumentObj) {
            let res = data;
            let dataClone = data;
            for (let argu in argumentObj) {
                if (argumentObj[argu].length > 0) {
                    res = dataClone.filter(d => {
                        return d[argu].indexOf(argumentObj[argu]) > -1;
                    });
                    dataClone = res;
                }
            }
            return res;
        },
        handleSearch () {
            let totalSearchData = this.search(this.articles, {title: this.searchTitle});
            this.initPage(this.total,this.$refs['articlepage'].currentPage,totalSearchData);
        },
        add (articleType) {
            if(articleType=='1'){
                this.$router.push({
                                name: 'articleadd'
                                
                            });
            }else  if(articleType=='2'){
                this.$router.push({
                                name: 'audioadd'
                            });
            }else  if(articleType=='3'){
                this.$router.push({
                                name: 'vedioadd'
                            });
            }
            
        },
        edit (item) {
            if(item.articleType=='1'){
                this.$router.push({
                                name: 'articleadd',
                                query:{articleUuid:item.articleUuid}
                            });
            }else  if(item.articleType=='2'){
                this.$router.push({
                                name: 'audioadd',
                                query:{articleUuid:item.articleUuid}
                            });
            }else  if(item.articleType=='3'){
                this.$router.push({
                                name: 'vedioadd',
                                query:{articleUuid:item.articleUuid}
                            });
            }
            
        },
        delMulti(){
            if(this.selectedArticles==null||this.selectedArticles.length===0){
                this.$Message.info('未选择素材');
                return;
            }
            this.$http.post("/admin/delMultipleArticles", this.common.request({articles:this.selectedArticles}))  
                .then(response => {  
                    if(response.data.body.status.statusCode==0){
                        this.$Notice.success({
                            title: '成功',
                            desc: '素材已删除',
                            duration:2
                        });
                    this.initArticleData();
                    }else{
                        this.$Message.error(response.data.body.status.errorDesc);
                    }
                }, response => {  
                    this.$Message.error(response.data.body.status.errorDesc);
                });
        },
        del(article){
            let options = {
                articleUuid:article.articleUuid,
                actionType:'DELETE'
            };
            if(this.editModel)
                options.actionType='MODIFY'

            this.$http.post("/admin/changeArticle", this.common.request(options))  
                .then(response => {  
                    if(response.data.body.status.statusCode==0){
                        this.$Notice.success({
                            title: '成功',
                            desc: '该素材已删除',
                            duration:2
                        });
                    this.initArticleData();
                    }else{
                        this.$Message.error(response.data.body.status.errorDesc);
                    }
                }, response => {  
                    this.$Message.error(response.data.body.status.errorDesc);
                });
        },
        publish(article){
            if(article.published){
                this.$Message.info('该素材已处于发布状态');
                return;
            }
            let options = {
                articleUuid:article.articleUuid,
                actionType:'PUBLISH'
            };
            this.$http.post("/admin/changeArticle", this.common.request(options))  
                .then(response => {  
                    if(response.data.body.status.statusCode==0){
                        this.$Notice.success({
                            title: '成功',
                            desc: '该素材已发布',
                            duration:2
                        });
                    this.initArticleData();
                    }else{
                        this.$Message.error(response.data.body.status.errorDesc);
                    }
                }, response => {  
                    this.$Message.error('出错了');
                });
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
        inquiryArticle(pageNum, pageSize){
            this.$http.post("/admin/inquiryArticlePagination", this.common.request({startIndex:(pageNum-1)*pageSize,pageSize:pageSize,articleTypeArray:['1','2','3']}))  
                .then(response => {  
                    if(response.data.body.status.statusCode==0){
                        this.articles = response.data.body.data.articles;
                        this.count = response.data.body.data.totalCount;
                        
                        this.initPage(this.count,pageNum,this.articles);
                    }else{
                        this.$Message.error(response.data.body.status.errorDesc);
                    }
                }, response => {  
                    this.$Message.error(response.data.body.status.errorDesc);
                });
            
        },
        initArticleData(){
            this.inquiryArticle(1,this.pageSize);
            this.selectedArticles = []; //选中的文案清除
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
        importArticle(){
            this.loading = true;
            this.$http.post("/admin/importArticle", this.common.request({}))  
                .then(response => {  
                    if(response.data.body.status.statusCode==0){
                        this.initArticleData();
                        this.loading = false;
                    }else{
                        this.loading = false;
                        this.$Message.error(response.data.body.status.errorDesc);
                    }
                }, response => {  
                    this.loading = false;
                    this.$Message.error('出错了');
                });
        },
        preview(article){
            if(article.articleType=='1')
                this.$router.push({
                    name: 'articlepreview',query:{articleUuid:article.articleUuid}
                });
            else if(article.articleType=='2')
                this.$router.push({
                    name: 'audiopreview',query:{articleUuid:article.articleUuid}
                });
            else if(article.articleType=='3')
                this.$router.push({
                    name: 'vediopreview',query:{articleUuid:article.articleUuid}
                });
        },
        inquiryArticleByTag(tagName,pageNum,pageSize){
            let options = {
                startIndex:(pageNum-1)*pageSize,
                pageSize:pageSize
            };
            if(tagName != ''){
                options.tagDTO = {tagName:tagName};
            }
            this.$http.post("/admin/inquiryArticlePagination", this.common.request(options)) 
            .then(response => {  
                if(response.data.body.status.statusCode==0){
                    this.articles = response.data.body.data.articles;
                    this.count = response.data.body.data.totalCount;
                    this.initPage(this.count,pageNum,this.articles);
                }else{
                    this.$Message.error(response.data.body.status.errorDesc);
                }
            }, response => {  
                this.$Message.error(response.data.body.status.errorDesc);
            })
        },
        inquiryArticleByType(articleType,pageNum,pageSize){
            let options = {
                startIndex:(pageNum-1)*pageSize,
                pageSize:pageSize
            };
            if(articleType != ''){
                options.articleType = articleType;
            }   
            this.$http.post("/admin/inquiryArticlePagination", this.common.request(options)) 
            .then(response => {  
                if(response.data.body.status.statusCode==0){
                    this.articles = response.data.body.data.articles;
                    this.count = response.data.body.data.totalCount;
                    this.initPage(this.count,pageNum,this.articles);
                }else{
                    this.$Message.error(response.data.body.status.errorDesc);
                }
            }, response => {  
                this.$Message.error(response.data.body.status.errorDesc);
            })
        },
        initArticleByTag(tagName){
            this.inquiryArticleByTag(tagName,1,this.pageSize);
        },
        initArticleByType(articleType){
            if (articleType === '0') {
                this.initArticleData();
            }else {
                this.inquiryArticleByType(articleType,1,this.pageSize);
            }
        }
    },
    created () {
        this.initTagData();
        this.initArticleData();
    }
};
</script>
