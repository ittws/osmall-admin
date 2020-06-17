<style lang="less">
    @import '../../styles/common.less';
</style>

<template>
    
    <div>
        <Form ref="smsForm" :model="smsForm" :label-width="80">
            <Card>
                <p slot="title">
                    <Icon type="ios-person"></Icon>
                     生日祝福

                </p>

                <Row>
                    <Col span="10">
                        <FormItem >
                        <Icon type="trophy" size="25" color="#ffad33"></Icon><Span>会员生日自动发祝福短信</Span>
                        </FormItem>
                    </col>
                </Row>
                <Row>
                    <Col span="10">
                        <FormItem >
                            <i-switch v-model="smsRow.auto" size="large">
                                <span slot="open">开启</span>
                                <span slot="close">关闭</span>
                            </i-switch>
                        </FormItem>
                    </col>
                </Row>
                 <Row v-if="smsRow.auto">
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
                <Row v-if="smsRow.auto">
                <Col span="12">
                    <FormItem>
                        <Checkbox v-model="smsRow.term">同意短信发送条款</Checkbox>
                    </FormItem>
                </col>
                </Row> 
            </Card>
            
        </Form>
   
        <div class="margin-top-10">
            <Button type="primary" @click="save('smsRow')" icon="checkmark">保存</Button>
        </div>
     </div>               
</template>

<script>
export default {
    data () {
        return {
            smsForm:{},
            smsRow:{
                auto:true
            },
            
        }
           
    },
    methods: {
        
        save(Row){
            this.$Notice.success({
                title: '成功',
                desc: '生日祝福已设置',
                duration: 2
            });
        }
    },
    created () {
        
    }
};
</script>
