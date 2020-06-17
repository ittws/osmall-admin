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
                         活动列表
                    </p>
                    <Row>
                        <Button icon="plus" type="primary" @click.native="add()">发布活动</Button>
                        <!--<Button type="warning" @click.native="editArticleTag=true">活动分类</Button>-->
                        <Poptip confirm title="您确定要删除这些活动吗" transfer @on-ok="delMulti">
                            <Button type="error">批量删除</Button>
                        </Poptip>
                        <div class="f_r">
                            <Input v-model="searchTitle" @on-change="handleSearch" icon="search" placeholder="请输入标题搜索" style="width: 150px" />
                        </div>
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
                    <Modal v-model="editArticleTag" title="活动分类管理">
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
                title: '活动标题',
                align: 'left',
                key: 'title'
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
                                title: '您确定要发布该活动吗?',
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
                this.$router.push({
                                name: 'noticeadd'
                            });
        },
        edit (item) {

                this.$router.push({
                                name: 'noticeadd',
                                query:{articleUuid:item.articleUuid}
                            });
            
            
        },
        delMulti(){
            if(this.selectedArticles==null||this.selectedArticles.length===0){
                this.$Message.info('未选择活动');
                return;
            }
            this.$http.post("/admin/delMultipleArticles", this.common.request({articles:this.selectedArticles}))  
                .then(response => {  
                    if(response.data.body.status.statusCode==0){
                        this.$Notice.success({
                            title: '成功',
                            desc: '活动已删除',
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
                            desc: '该活动已删除',
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
                this.$Message.info('该活动已处于发布状态');
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
                            desc: '该活动已发布',
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
            this.$http.post("/admin/inquiryArticlePagination", this.common.request({articleType:'5',startIndex:(pageNum-1)*pageSize,pageSize:pageSize}))  
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
                this.$router.push({
                    name: 'articlepreview',query:{articleUuid:article.articleUuid}
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
            this.inquiryArticleByType(articleType,1,this.pageSize);
        }
    },
    created () {
        this.initTagData();
        this.initArticleData();
    }
};
</script>
