

<template>
    <div>
        <Row class="margin-top-10">
            <Col span="24">
                <Card>
                    <p slot="title">
                        <Icon type="ios-person"></Icon>
                         问题列表
                    </p>
                    <Row>
                        <Button icon="plus" type="primary" @click.native="add()">发布问题</Button>
                        <Button type="warning" @click.native="editArticleTag=true">问题分类</Button>
                        <Poptip confirm title="您确定要删除这些问题吗" transfer @on-ok="delMulti">
                            <Button type="error">批量删除</Button>
                        </Poptip>
                        <div class="f_r">
                        <!--
                        <Select v-model="category" placeholder="问题类目" style="width:100px">
                            <Option value="yy">邀约</Option>
                            <Option value="xs">销售</Option>
                            <Option value="xc">宣传</Option>
                        </Select>
                        -->
                            <Input v-model="searchTitle" @on-change="handleSearch" icon="search" placeholder="请输入标题搜索" style="width: 150px" />
                        </div>
                    </Row>
                    <Row>
                        <Col span="24">
                            <div style="text-align:center">
                            <RadioGroup v-model="selectedTag" type="button" @on-change="initArticleByTag(selectedTag)">
                                <Radio label="">全部</Radio>
                                <Radio v-for="item in articleTags" :label="item.tagName"></Radio>
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
                    <Modal v-model="editArticleTag" title="问题分类管理">
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
            articleData: [],
            articles:[],
            searchTitle:'',
            total:0,
            pageSize:8,
            articleColumn : [
            {
                type: 'selection',
                width: 60,
                align: 'center'
            },
            {
                title: '问题标题',
                align: 'left',
                key: 'title'
            },
            {
                title: '分类',
                align: 'center',
                width: 120,
                render: (h, params) => {
                    let str = (params.row.tagDTO == null?'未分类':params.row.tagDTO.tagName);
                    return h('tag', {
                        props: {
                            color:'orange'
                        }
                    }, str)
                }
            },
            {
                title: '热门状态',
                align: 'center',
                width: 120,
                render: (h, params) => {
                    let str = (params.row.hot?'热门问题':'普通问题');
                    let color = (params.row.hot?'green':'default');
                    return h('tag', {
                        props: {
                            color:color
                        }
                    }, str)
                }
            },
            {
                title: '发布状态',
                align: 'center',
                width: 120,
                render: (h, params) => {
                    let str = (params.row.published?'已发布':'未发布');
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
                width: 280,
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
                                title: '您确定要发布该问题吗?',
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
                        params.row.hot ? 
                        h('Poptip',{
                            props: {
                                confirm: true,
                                title: '您确定要取消热门吗?',
                                transfer: true
                            },
                            on: {
                                'on-ok': () => {
                                    this.changeHot(params.row);
                                }
                            }
                        },[
                            h('Button',{
                            style: {
                                margin: '0 5px 0 0'
                            },
                            props: {
                                type: 'info',
                                size: 'small'
                            }
                        },'取消热门')]):
                        h('Poptip',{
                            props: {
                                confirm: true,
                                title: '您确定要设置为热门吗?',
                                transfer: true
                            },
                            on: {
                                'on-ok': () => {
                                    this.changeHot(params.row);
                                }
                            }
                        },[
                            h('Button',{
                            style: {
                                margin: '0 5px 0 0'
                            },
                            props: {
                                type: 'success',
                                size: 'small'
                            }
                        },'设置热门')]),
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
        changeHot(row){
            if (row.hot) {
                var options = {
                    actionType: 'UNHOT',
                    qaUuid:row.qaUuid
                }
            }else {
                var options = {
                    actionType: 'HOT',
                    qaUuid:row.qaUuid
                }
            }
                this.$http.post("/admin/changeQa", this.common.request(options))  
                .then(response => {
                    if(response.data.body.status.statusCode==0){
                        this.$Notice.success({
                            title: '操作成功',
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
        add () {
            this.$router.push({
                                name: 'qaadd',
                            });
        },
        edit (item) {
            this.$router.push({
                                name: 'qaadd',
                                query:{qaUuid:item.qaUuid}
                            });
        },
        delMulti(){
            if(this.selectedArticles==null||this.selectedArticles.length===0){
                this.$Message.info('未选择问题');
                return;
            }
            this.$http.post("/admin/delMultipleQa", this.common.request({qas:this.selectedArticles}))  
                .then(response => {
                    if(response.data.body.status.statusCode==0){
                        this.$Notice.success({
                            title: '成功',
                            desc: '问题已删除',
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
                actionType: 'DELETE',
                qaUuid: article.qaUuid,
            };
            if(this.editModel){
                options.actionType='MODIFY'
            }
            this.$http.post("/admin/changeQa", this.common.request(options))  
                .then(response => {  
                    if(response.data.body.status.statusCode==0){
                        this.$Notice.success({
                            title: '成功',
                            desc: '该问题已删除',
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
                this.$Message.info('该问题已处于发布状态');
                return;
            }
            let options = {
                qaUuid:article.qaUuid,
                actionType:'PUBLISH'
            };
            this.$http.post("/admin/changeQa", this.common.request(options))  
                .then(response => {  
                    if(response.data.body.status.statusCode==0){
                        this.$Notice.success({
                            title: '成功',
                            desc: '该问题已发布',
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
            this.$http.post("/admin/inquiryTag", this.common.request({tagType:'QA'}))  
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
            this.$http.post("/admin/inquiryQaPagination", this.common.request({startIndex:(pageNum-1)*pageSize,pageSize:pageSize}))  
                .then(response => {  
                    if(response.data.body.status.statusCode==0){
                        this.articles = response.data.body.data.qas;
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
            this.selectedArticles = []; //选中的问题清除
        },
        addTag(){
            this.$http.post("/admin/changeTag", this.common.request({actionType:'ADD',tagName:this.newArticleTag,tagType:'QA'}))  
                .then(response => {  
                    if(response.data.body.status.statusCode==0){
                        this.initTagData();
                        this.showAddArticleInput = false;
                        this.loading = false;
                    }else{
                        this.$Message.error(response.data.body.status.errorDesc);
                        this.loading = false;
                    }
                }, response => {  
                    this.$Message.error(response.data.body.status.errorDesc);
                    this.loading  = false;
                });
        },
        deleteTag(item){
            var options ={
                actionType: 'DELETE',
                tagUuid: item.tagUuid,
                tagType: 'QA'
            }
            this.$http.post("/admin/changeTag", this.common.request(options))  
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
                    }else{
                        this.loading = false;
                        this.$Message.error(response.data.body.status.errorDesc);
                    }
                }, response => {  
                    this.loading = false;
                    this.$Message.error('出错了');
                });
        },
        preview(row){
            this.$router.push({
                name: 'qapreview',query:{qaUuid:row.qaUuid}
            });
        },
        inquiryArticleByTag(tagName,pageNum,pageSize){
            this.loading = true;
            let options = {
                startIndex:(pageNum-1)*pageSize,
                pageSize:pageSize
            };
            if(tagName != ''){
                options.tagDTO = {tagName:tagName};
            }
            this.$http.post("/admin/inquiryQaPagination", this.common.request(options)) 
            .then(response => {
                if(response.data.body.status.statusCode==0){
                    this.articles = response.data.body.data.qas;
                    this.count = response.data.body.data.totalCount;
                    this.initPage(this.count,pageNum,this.articles);
                    this.loading = false;
                }else{
                    this.$Message.error(response.data.body.status.errorDesc);
                    this.loading = false;
                }
            }, response => {  
                this.$Message.error(response.data.body.status.errorDesc);
                this.loading = false;
            })
        },
        initArticleByTag(tagName){
            this.inquiryArticleByTag(tagName,1,this.pageSize);
        }
    },
    created () {
        this.initTagData();
        this.initArticleData();
    }
};
</script>
