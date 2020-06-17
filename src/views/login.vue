<style lang="less">
    @import './login.less';
</style>

<template>
    <div class="login" @keydown.enter="handleSubmit">
        <div class="login-con">
            <Card :bordered="false">
                <p slot="title">
                    <Icon type="log-in"></Icon>
                    B2B2C商城后台
                </p>
                <div class="form-con">
                    <Form ref="loginForm" :model="form" :rules="rules">
                        <FormItem prop="userName">
                            <Input v-model="form.userName" placeholder="请输入用户名">
                                <span slot="prepend">
                                    <Icon :size="16" type="person"></Icon>
                                </span>
                            </Input>
                        </FormItem>
                        <FormItem prop="password">
                            <Input type="password" v-model="form.password" placeholder="请输入密码">
                                <span slot="prepend">
                                    <Icon :size="14" type="locked"></Icon>
                                </span>
                            </Input>
                        </FormItem>
                        <FormItem>
                            <Button @click.native="handleSubmit" type="primary" :loading="loading" long>登录</Button>
                        </FormItem>
                    </Form>
                </div>
            </Card>
        </div>
    </div>
</template>

<script>
import Cookies from 'js-cookie';
export default {
    data () {
        return {
            loading:false,
            functionList:[],
            form: {
                userName: '',
                password: ''
            },
            rules: {
                userName: [
                    { required: true, message: '账号不能为空', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '密码不能为空', trigger: 'blur' }
                ]
            }
        };
    },
    methods: {
        handleSubmit () {
            this.$refs.loginForm.validate((valid) => {
                if (valid) {
                    this.loading = true;
                    var options={
                        "id":this.form.userName,
                        "password":this.form.password
                    }
                    this.$http.post("/admin/login", this.common.request(options))  
                    .then(response => {
                        this.loading = false;
                        if(response.data.body.status.statusCode==0){
                            this.common.setObject('ADMINTOKEN',response.data.header.tokenId);
                            this.common.setObject('ADMINID',this.form.userName);
                            Cookies.set('user', this.form.userName);
                            Cookies.set('password', this.form.password);
                            localStorage.setItem("name",this.form.userName);
                            this.$store.commit('setAvator', 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3448484253,3685836170&fm=27&gp=0.jpg');
                            this.roots();
                            if (this.form.userName === 'iview_admin') {
                                Cookies.set('access', 0);
                            } else {
                                Cookies.set('access', 1);
                            }  
                        }else{
                           
                            this.$Message.error(response.data.body.status.errorDesc);
                        }
                    }, response => {  
                         this.loading = false;
                        this.$Message.error(response.data.body.status.errorDesc);
                    })
                }
            });
        },
        roots(){
            var options={
                        "id":this.form.userName,
                    }
                    this.$http.post("/admin/inquiryAdminFunction", this.common.request(options))  
                    .then(response => {
                        if(response.data.body.status.statusCode==0){
                            var functionList = [];
                            var data =  response.data.body.data.functionList;
                            data.forEach((val,index) =>{
                                val.functionList.forEach((temm,index) => {
                                    functionList.push(temm);
                                });
                            })
                            this.$router.push({
                                    name: 'home_index'
                                });
                            var obj = JSON.stringify(functionList);
                            sessionStorage.functionList = obj;
                        }else{
                            this.$Message.error('账户存在异常');
                        }
                    }, response => {  
                        this.$Message.error('出错了，请稍后重试');
                    })
        }
    }
};
</script>

<style>

</style>
