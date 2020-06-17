<style lang="less">
    @import '../../styles/common.less';
</style>

<template>
    
    <div>
        <Form ref="fundaccountForm" :model="fundaccountForm" :label-width="100">

            <Card>
                <p slot="title">
                    <Icon type="ios-person"></Icon>
                     基本信息

                </p>
                <Row>
                <Col span="24">
                    <Row type="flex" justify="start">
                        <Col span="12" >
                            <FormItem label="账号类型" >
                                <Select clearable v-model="fundaccount.accountType">
                                    <Option value="银行账户">银行账户</Option>
                                    <Option value="微信">微信</Option>
                                    <Option value="支付宝">支付宝</Option>
                                </Select>
                            </FormItem>
                        </Col>                
                    </Row>
                    <Row type="flex" justify="start">
                        <Col span="12" >
                            <FormItem label="账号" >
                                <Input v-model="fundaccount.accountNo" placeholder="输入账号"></Input>
                            </FormItem>
                        </Col>                
                    </Row>
                    <Row type="flex" justify="start">
                        <Col span="12" >
                            <FormItem label="账号类型" >
                                <Select clearable v-model="fundaccount.accountBankName">
                                    <Option value="工商银行">工商银行</Option>
                                    <Option value="工商银行">建设银行</Option>
                                    <Option value="工商银行">招商银行</Option>
                                </Select>
                            </FormItem>
                        </Col>                
                    </Row>
                    <Row type="flex" justify="start">
                        <Col span="12" >
                            <FormItem label="账户名" >
                                <Input v-model="fundaccount.accountName" placeholder="输入账户名"></Input>
                            </FormItem>
                        </Col>                
                    </Row>
                </Col>
                </Row>
            </card>
            <Row class="margin-top-10">
                    <Col span="12" >
            <Button type="primary" icon="checkmark" @click="add">保存</Button>
            </Col>
                </Row>
        </Form>
     </div>               
</template>

<script>

export default {
    
    data () {
        return {
            fundaccount: {},
            fundaccountForm:{}
        }
    },
    methods: {
        getData () {
            
        },
        
        add () {
            this.$Notice.success({
                title: '成功',
                desc: '资金账户信息已保存',
                duration: 2
            });
        }
    },
    created () {
        this.getData();
    }

};
</script>
