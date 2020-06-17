<template>
    <div>
        
        
        <Button type="success" size="small" @click="approve(row)" v-if="row.verifyStatus=='待审核'">同意</Button>
        <Button type="error" size="small" @click="reject(row)" v-if="row.verifyStatus=='待审核'">拒绝</Button>
        <Button type="success" size="small" @click="success(row)" v-if="row.verifyStatus=='已通过' && row.transferStatus=='待打款'">打款成功</Button>
        <Button type="error" size="small" @click="fail(row)" v-if="row.verifyStatus=='已通过' && row.transferStatus=='待打款'">打款失败</Button>
        <Modal
            v-model="successModel"
            ref="successModel"
            title="打款成功">
            确认打款成功吗 ?
            <div slot="footer">
                <Button type="text" @click="successcancel">取消</Button>
                <Button type="primary" @click="successok()">确定</Button>
            </div>
        </Modal>
        <Modal
            v-model="failModel"
            ref="fialModel"
            title="打款失败">
            <Form ref="failRow" :model="failRow">
                <FormItem prop="productTypeName">
                    <Input v-model='failRow.reason' type="textarea" placeholder="输入原因"></Input>
                </FormItem>
            </form>
            <div slot="footer">
                <Button type="text" @click="failcancel">取消</Button>
                <Button type="primary" @click="failok()">确定</Button>
            </div>
        </Modal>

    </div>
</template>
<script>
    export default {
        data () {
            return {
                dateSearchType:'',
                successModel: false,
                failModel: false,
                disableModel: false,
                enableModel: false,
                couponModel: false,
                linkRow:{url:'http://tud86ok9hg905nh/7yf8hdfu8d0di'},
                successRow:{
                    
                },
                failRow:{
                    
                }
            }
        },
        props: {
            row: Object
        },
        methods: {

            successcancel (row) {
                this.successModel=false;
            },
            success(){
                this.successModel = true;
            },
            fail(){
                this.failModel = true;
            },
            successok (row) {
                this.$Notice.success({
                    title: '成功',
                    desc: '打款成功',
                    duration: 2
                });
                this.successModel=false;
            },
            failcancel (row) {
                this.failModel=false;
            },
            failok (row) {
                this.$Notice.error({
                    title: '失败',
                    desc: '打款失败',
                    duration: 2
                });
                this.failModel=false;
            },
            reject () {
                this.$Notice.success({
                    title: '成功',
                    desc: '已拒绝该提现申请',
                    duration: 2
                });
                this.showReject = false;
            },
            approve () {
                this.$Notice.success({
                    title: '成功',
                    desc: '已通过该提现申请',
                    duration: 2
                });
            },
        }
    };
</script>