<style lang="less">
    @import '../../styles/common.less';
</style>

<template>
    <div>
        <Row class="margin-top-20">
            <Col span="12" offset="5">
                <div>
                    <Card>
                        <h1>{{ articleTitle }}</h1>
                        <p class="preview-publish-time"><Icon type="android-alarm-clock"></Icon>&nbsp;发布时间：{{ publishTime }}</p>
                        <audio :src="content" controls="controls"></audio>
                    </Card>
                </div>
            </Col>
        </Row>
    </div>
</template>

<script>
export default {
    data () {
        return {
            articleTitle: '',
            tagsList: '',
            classificationSelected: [],
            content: '',
            publishTime: ''
        };
    },
    mounted () {
        //编辑模式
        let articleUuid = this.$route.query.articleUuid;
        if(articleUuid!=null && articleUuid != ''){
            this.editModel=true;
            this.$http.post("/public/inquiryArticle", this.common.request({articleUuid:articleUuid}))  
                .then(response => {  
                    if(response.data.body.status.statusCode==0){
                        let data = response.data.body.data;
                        this.articleTitle = data.title;
                        this.content=data.content;
                        this.publishTime=data.publishTime;
                    }else{
                        this.$Message.error(response.data.body.status.errorDesc);
                    }
                }, response => {  
                    this.$Message.error(response.data.body.status.errorDesc);
                });
        }
    }
};
</script>
