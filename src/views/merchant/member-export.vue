<style lang="less">
    @import '../../styles/common.less';
</style>

<template>
    <div>
        <Card>
            <p slot="title">
            会员批量导入说明
            </p>
            <ul class="text-help">
                <li>1. 先下载模板,严格按模板文件里面的说明进行EXCEL内容整理</li>
                <li>2. 点击浏览,选择整理好的EXCEL文件</li>
                <li>3. 点击"导入",导入成功后系统会提示上传成功</li>
            </ul>
        </Card>
        <Card class="margin-top-10">
            <p slot="title">
            会员批量导入
            </p>
            <Row type="flex" justify="left" align="middle">
                <Col span="4">
                    1. 点击按钮下载会员模板
                </Col>
                <Col span="10" >
                    <a href="https://www.e4work.com/market/image/login_bg02.jpg" download="会员导入模板">
                    <Button type="info">会员模板</Button>
                    </a>
                </Col>
            </Row>
            <Row type="flex" justify="left" align="middle" class="margin-top-10">
                <Col span="4">
                    2. 选择文件导入
                </Col>
                <Col span="10">
                    <Upload action="//jsonplaceholder.typicode.com/posts/">
                        <Button type="ghost" icon="ios-cloud-upload-outline">选择文件...</Button>
                    </Upload>
                </Col>
            </Row>
            <Row type="flex" justify="left" align="middle" class="margin-top-10">
                <Col span="4">
                    <Button :loading="loading" type="primary" @click="exportmember">导入</Button>
                </Col>
            </Row>
        </Card>
    </div>
</template>

<script>

export default {

    data () {
        return {
            loading:false
        }
    },
    methods: {
        
        exportmember () {
            //将按钮设置为正在加载状态
            this.loading = true;
            this.$Notice.success({
                title: '成功',
                desc: '会员已导入',
                duration: 2
            }); 
            //后台调用成功后将正在加载状态取消
            this.loading = false;
        }
    },
    created () {
        
    }
};
</script>
