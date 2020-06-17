<template>
    <div>
        
        <Button type="primary" size="small" @click="edit(row)">编辑</Button>
        <Poptip confirm title='您确定要删除这条数据吗?' transfer @on-ok="del(row)">
            <Button type="error" size="small">删除</Button>
        </Poptip>    
        <Dropdown trigger="hover" transfer @on-click='moreaction'>
            <Button size="small">
                更多
                <Icon type="arrow-down-b"></Icon>
            </Button>
            <DropdownMenu slot="list">
                <DropdownItem name='disable'>停用</DropdownItem>
                <DropdownItem name='enable'>启用</DropdownItem>
            </DropdownMenu>
        </Dropdown>        


        <Modal
            v-model="disableModel"
            ref="disableModel"
            title="停用">
            停用后, 商户将不能登录, 你确认要停用该商户吗 ?
            <div slot="footer">
                <Button type="text" @click="disablecancel">取消</Button>
                <Button type="primary" @click="disableok()">确定</Button>
            </div>
        </Modal>
        <Modal
            v-model="enableModel"
            ref="disableModel"
            title="启用">
            你确认要启用该商户吗 ?
            <div slot="footer">
                <Button type="text" @click="enablecancel">取消</Button>
                <Button type="primary" @click="enableok()">确定</Button>
            </div>
        </Modal>
       
    </div>
</template>
<script>
    export default {
        data () {
            return {
                replaceModel: false,
                replaceRow:{},
                extendModel: false,
                disableModel: false,
                enableModel: false,
                couponModel: false,
                extendRow:{},
                changePasswordModel: false,
                changePasswordRow:{},
                couponRow:{
                    couponType:'3'
                }
            }
        },
        props: {
            row: Object,
            replaceModel: false
        },
        methods: {
            edit (row) {
                this.$router.push({
                    name: 'merchantedit',
                    params: {merchantId:row.merchantId}
                });
            },
            del (row) {
                this.$Notice.success({
                    title: '成功',
                    desc: '会员已删除',
                    duration: 2
                });
            },
            replace () {
                this.replaceModel=true;
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
            changepassword () {
                this.changePasswordModel=true;
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
            replacecancel (row) {
                this.replaceModel=false;
            },
            replaceok (row) {
                this.$Notice.success({
                    title: '成功',
                    desc: '已换卡',
                    duration: 2
                });
                this.replaceModel=false;
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
                    desc: '商户已启用',
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
                    desc: '商户已停用',
                    duration: 2
                });
                this.disableModel=false;
            },
            disablecancel () {
                this.disableModel = false;
            },
            moreaction(actionName) {
                if(actionName === 'disable'){
                    this.disable();
                }else if(actionName === 'enable'){
                    this.enable();
                }
            }
        }
    };
</script>