<style lang="less">
    @import '../../styles/common.less';
</style>

<template>
    
    <div>
        <!-- <Spin size="large" fix v-if="spinShow" class="mask"></Spin> -->
        <Form :label-width="100">
            
            <Card>
                <p slot="title">
                     购币兑换比例
                </p>
                    <Row type="flex" justify="start">
                        <Col span="11" >
                            <FormItem >
                                充值1元兑换
                                <Input v-model="integral"  style="width:12%" placeholder="0"/>&nbsp;购币
                                <span class="Submissioncss"><Button type="primary" @click="addreward()" class="Button1" :loading="loading">保存</Button></span>
                            </FormItem>
                        </Col>                
                    </Row>
            </card>
        </Form>
     </div>               
</template>

<script>
export default {
    components: {
        
    },
    data () {
        return {
            loading:false,
            element:0,
            integral:0,
        }
    },
    methods: {
        addreward(){
            this.loading = true;
            this.spinShow=true;
            let options = {
                settings:[{
                    name:"PLATFORM_EXCHANGE_RATE",
                    value:this.integral
                }]
            };
            
            this.$http.post("/changeParameter", this.common.request(options))
			.then(response => {
                this.loading = false;
				if(response.data.body.status.statusCode == 0) {
					var data = response.data.body.data;
					this.$Notice.success({
						desc: '已经成功保存参数',
						duration: 2
                    });
                    this.spinShow=false;
				} else {
					this.$Notice.success({
						title: '失败',
						desc: 'response.data.body.status.errorDesc',
						duration: 2
                    });
                    this.spinShow=false;
				}
			}, response => {
                this.loading = false;
                this.$Message.error('出错了，请稍后重试');
                this.spinShow=false;
			})
        },
        reward(){
            let options = {
                name: 'PLATFORM_EXCHANGE_RATE'
            };
            this.$http.post("/inquiryParameter", this.common.request(options))  
            .then(response => {
                if(response.data.body.status.statusCode==0){
                    this.integral = response.data.body.data.value;
                }
            }, response => {  
               
            })
        },
    },
    created () {

    },
    mounted () {
            this.reward();
        },
    destroyed () {
        
    }

};
</script>
<style>
    .demo-upload-list{
        display: inline-block;
        width: 160px;
        height: 160px;
        text-align: center;
        line-height: 60px;
        border: 1px solid transparent;
        border-radius: 4px;
        overflow: hidden;
        background: #fff;
        position: relative;
        box-shadow: 0 1px 1px rgba(0,0,0,.2);
        margin-right: 4px;
    }
    .demo-upload-list img{
        width: 100%;
        height: 100%;
    }
    .demo-upload-list-cover{
        display: none;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0,0,0,.6);
    }
    #inputalss{
            margin: 0px 110px;
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
    .titles{
        float: left;
        font-weight: 500;
        margin-right: 15px;
        letter-spacing: 1px;
    }
    .Submissioncss{
        margin-left:30px; 
    }
    .Button1{
        height: 25px;
        width: 50px;
        text-align: center;
        line-height: 10px;
    }
</style>
