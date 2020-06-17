<style lang="less">
    @import '../../styles/common.less';
</style>

<template>
    
    <div>
        <Form ref="smsForm" :model="smsForm" :label-width="80">
            <Card>
                <p slot="title">
                    <Icon type="ios-person"></Icon>
                     基础信息

                </p>

                <Row>
                    <Col span="10">
                        <FormItem label="发送给">
                            <RadioGroup v-model="smsRow.toType">
                                <Radio label="全部会员"></Radio>
                                <Radio label="指定会员"></Radio>
                            </RadioGroup>
                            <Button v-if="smsRow.toType=='指定会员'" type="info" @click="selectMember">选择发送对象</Button>
                            <Badge count="4">
                                <Icon type="ios-person" size="30"></Icon>
                            </Badge>
                        </FormItem>
                    </col>
                </Row>
                <Row>
                <Col span="12">
                    <FormItem>
                    <div v-if="smsRow.toType=='指定会员'">
                    <Tag closable color="blue">张非</Tag>
                    <Tag closable color="green">李兰</Tag>
                    <Tag closable color="red">王思域</Tag>
                    <Tag closable color="yellow">彭雷</Tag>
                    </div>
                    </FormItem>
                </col>
                </Row>
                 <Row>
                <Col span="12">
                    <FormItem>
                        <RadioGroup v-model="smsRow.content">
                            <Input type="textarea" style="width:300px" :rows="10" placeholder="编辑短信内容"></Input>
                        </RadioGroup>
                    </FormItem>
                </col>
                <Col span="10" offsite="2">
                    <Row>
                    <Span class="text-head-sub">短信发送条款</Span>
                    </Row>
                    <Row>
                    <Span class="text-help">
                         禁止使用此短信群发功能发送涉及反动、色情、低俗、暴力等违禁内容，一经发现封锁序列号，没收余款！由此产生的相关经济纠纷以及法律责任，由发送者全部承担！
                    </Span>
                    </Row>
                    
                </col>
                </Row> 
                <Row>
                <Col span="12">
                    <FormItem>
                        <Checkbox v-model="smsRow.term">同意短信发送条款</Checkbox>
                    </FormItem>
                </col>
                </Row> 
            </Card>
            
        </Form>
   
        <div class="margin-top-10">
            <Button type="primary" @click="send('smsRow')" icon="navigate">发送短信</Button>
        </div>
        <selectMember v-if="selectMemberModel"></selectMember>
     </div>               
</template>

<script>
import selectMember from '../common-components/select-member.vue';
export default {
    components: {
        selectMember
    },
    data () {
        return {
            selectMemberModel:false,
            smsRow:{toType:'全部会员',term:true},
            smsForm:{}
        }
           
    },
    methods: {
        
        send(Row){
            this.$Notice.success({
                title: '成功',
                desc: '短信已发送',
                duration: 2
            });
        },
    
        selectMember() {
            this.selectMemberModel = true
        }
    },
    created () {
        
    }
};
</script>
