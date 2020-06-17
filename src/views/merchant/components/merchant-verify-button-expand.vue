<template>
    <div>
        
        <Button type="error" size="small" @click="reject(row)">拒绝</Button>
        <Button type="success" size="small" @click="approve(row)">同意</Button>


        <Modal
            v-model="rejectModel"
            ref="rejectModel"
            title="拒绝商户入驻">
            <Form :model="merchantRow" :label-width="80">
                <FormItem label="原因">
                    <Input type="textarea" v-model='merchantRow.reason'></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="text" @click="rejectcancel">取消</Button>
                <Button type="primary" @click="rejectok()">确定</Button>
            </div>
        </Modal>
        <Modal
            v-model="approveModel"
            ref="approveModel"
            title="同意商户入驻">
            你确认同意该商户入驻吗 ?
            <div slot="footer">
                <Button type="text" @click="approvecancel">取消</Button>
                <Button type="primary" @click="approveok()">确定</Button>
            </div>
        </Modal>
       
    </div>
</template>
<script>
    export default {
        data () {
            return {
                rejectModel: false,
                approveModel: false,
                merchantRow:{}
            }
        },
        props: {
            row: Object
        },
        methods: {
            reject () {
                this.rejectModel=true;
            },
            approve () {
                this.approveModel=true;
            },
            
            approveok () {
                this.$Notice.success({
                    title: '成功',
                    desc: '已同意该商家入驻',
                    duration: 2
                });
                this.approveModel=false;
            },
            approvecancel () {
                this.approveModel=false;
            },
            rejectok () {
                this.$Notice.success({
                    title: '成功',
                    desc: '已拒绝该商家入驻',
                    duration: 2
                });
                this.rejectModel=false;
            },
            rejectcancel () {
                this.rejectModel = false;
            }
        }
    };
</script>