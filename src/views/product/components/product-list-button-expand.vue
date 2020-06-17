<template>
    <div>
        
        
        <Button type="success" v-if="row.productStatus=='未上架'" size="small" @click="enable(row)">上架</Button>
        <Button type="warning" v-if="row.productStatus=='已上架'" size="small" @click="disable(row)">下架</Button> 
        <Button type="primary" size="small" @click="edit(row)">编辑</Button>  
        <Button type="error" size="small" @click="del(row)">删除</Button>
        <Modal
            v-model="disableModel"
            ref="disableModel"
            title="商品下架">
            你确定要下架该商品吗 ?
            <div slot="footer">
                <Button type="text" @click="disablecancel">取消</Button>
                <Button type="primary" @click="disableok()">确定</Button>
            </div>
        </Modal>
        <Modal
            v-model="enableModel"
            ref="disableModel"
            title="商品上架">
            你确认要上架该商品吗 ?
            <div slot="footer">
                <Button type="text" @click="enablecancel">取消</Button>
                <Button type="primary" @click="enableok()">确定</Button>
            </div>
        </Modal>
        <Modal
            v-model="delModel"
            ref="delModel"
            title="商品删除">
            你确认要删除该商品吗 ?
            <div slot="footer">
                <Button type="text" @click="delcancel">取消</Button>
                <Button type="primary" @click="delok()">确定</Button>
            </div>
        </Modal>

    </div>
</template>
<script>
    export default {
        data () {
            return {
                delModel: false,
                linkModel: false,
                disableModel: false,
                enableModel: false,
                couponModel: false,
                linkRow:{url:'http://tud86ok9hg905nh/7yf8hdfu8d0di'},
                couponRow:{
                    couponType:['1','2']
                }
            }
        },
        props: {
            row: Object
        },
        methods: {
            edit (row) {
                this.$router.push({
                    name: 'productedit',
                    params: {productCode:row.productCode}
                });
            },
            del () {
                this.delModel=true;
            },
            extend () {
                this.extendModel=true;
            },
            disable () {
                this.disableModel=true;
            },
            enable () {
                this.enableModel=true;
            },
            link () {
                this.linkModel=true;
            },
            copylink () {
                this.$Message.info('链接已复制');
            },
            singlecoupon () {
                this.couponModel=true;
            },
            singlecouponok () {
                this.$Notice.success({
                    title: '成功',
                    desc: '优惠券已发放',
                    duration: 2
                });
                this.couponModel=false;
            },
            singlecouponcancel () {
                this.couponModel=false;
            },
            delcancel (row) {
                this.delModel=false;
            },
            delok (row) {
                this.$Notice.success({
                    title: '成功',
                    desc: '已删除商品',
                    duration: 2
                });
                this.delModel=false;
            },
            extendcancel (row) {
                this.extendModel=false;
            },
            extendok (row) {
                this.$Notice.success({
                    title: '成功',
                    desc: '已延期',
                    duration: 2
                });
                this.extendModel=false;
            },
            changepasswordcancel (row) {
                this.changePasswordModel=false;
            },
            changepasswordok (row) {
                this.$Notice.success({
                    title: '成功',
                    desc: '密码已修改',
                    duration: 2
                });
                this.changePasswordModel=false;
            },
            enableok () {
                this.$Notice.success({
                    title: '成功',
                    desc: '商品已生效',
                    duration: 2
                });
                this.enableModel=false;
            },
            enablecancel () {
                this.enableModel=false;
            },
            disableok () {
                this.$Notice.success({
                    title: '成功',
                    desc: '商品已失效',
                    duration: 2
                });
                this.disableModel=false;
            },
            disablecancel () {
                this.disableModel = false;
            },
            moreaction(actionName) {
                if(actionName === 'del'){
                    this.del();
                }else if(actionName === 'disable'){
                    this.disable();
                }else if(actionName === 'enable'){
                    this.enable();
                }else if(actionName === 'extend'){
                    this.extend();
                }else if(actionName === 'link'){
                    this.link();
                }else if(actionName === 'coupon'){
                    this.singlecoupon();
                }
            }
        }
    };
</script>