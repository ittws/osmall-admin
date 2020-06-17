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
                <DropdownItem name='coupon'>发券</DropdownItem>
                <DropdownItem name='replace'>换卡</DropdownItem>
                <DropdownItem name='disable'>挂失</DropdownItem>
                <DropdownItem name='enable'>解锁</DropdownItem>
                <DropdownItem name='extend'>延期</DropdownItem>
                <DropdownItem name='changepassword'>修改密码</DropdownItem>
            </DropdownMenu>
        </Dropdown>        
        <Modal
            v-model="replaceModel"
            ref="replaceModel"
            title="换卡">
            <Form ref="replaceRow" :model="replaceRow" :label-width="80">
                <FormItem label="新卡卡号">
                    <Input v-model='replaceRow.newCardNo'></Input>
                </FormItem>
                <FormItem label="新卡密码">
                    <Input type="password" v-model='replaceRow.newCardPassword'></Input>
                </FormItem>
                <FormItem label="确认密码" prop="mobileNo">
                    <Input type="password" v-model='replaceRow.confirmPassword'></Input>
                </FormItem>                
            </Form>
            <div slot="footer">
                <Button type="text" @click="replacecancel">取消</Button>
                <Button type="primary" @click="replaceok('replaceRow')">确定</Button>
            </div>
        </Modal>
        <Modal
            v-model="changePasswordModel"
            ref="changePasswordModel"
            title="修改密码">
            <Form ref="changePasswordRow" :model="changePasswordRow" :label-width="80">
                <FormItem label="新密码">
                    <Input v-model='changePasswordRow.newPassword'></Input>
                </FormItem>
                <FormItem label="确认密码" prop="mobileNo">
                    <Input v-model='changePasswordRow.confirmPassword'></Input>
                </FormItem>                
            </Form>
            <div slot="footer">
                <Button type="text" @click="changepasswordcancel">取消</Button>
                <Button type="primary" @click="changepasswordok('changePasswordRow')">确定</Button>
            </div>
        </Modal>
        <Modal
            v-model="extendModel"
            ref="extendModel"
            title="延期">
            <Form ref="extendRow" :model="extendRow" :label-width="80">
                <FormItem label="到期日期">
                    2018-09-09
                </FormItem>
                <FormItem label="延期至">
                    <DatePicker type="date" ></DatePicker>
                </FormItem>             
            </Form>
            <div slot="footer">
                <Button type="text" @click="extendcancel">取消</Button>
                <Button type="primary" @click="extendok('extendRow')">确定</Button>
            </div>
        </Modal>
        <Modal
            v-model="disableModel"
            ref="disableModel"
            title="挂失">
            你确认要挂失吗 ?
            <div slot="footer">
                <Button type="text" @click="disablecancel">取消</Button>
                <Button type="primary" @click="disableok()">确定</Button>
            </div>
        </Modal>
        <Modal
            v-model="enableModel"
            ref="disableModel"
            title="解锁">
            你确认要解锁吗 ?
            <div slot="footer">
                <Button type="text" @click="enablecancel">取消</Button>
                <Button type="primary" @click="enableok()">确定</Button>
            </div>
        </Modal>
        <Modal
            v-model="couponModel"
            ref="couponModel"
            title="发券">
            <Form ref="couponRow" :model="couponRow" :label-width="80">、
                <FormItem label="发券给">
                    <span>联盟至尊卡会员 - 罗长青</span>
                </FormItem>
                <FormItem label="优惠券类型">
                    <CheckboxGroup v-model="couponRow.couponType">
                        <Checkbox label="现金券10元">
                            <span>现金券10元</span>
                        </Checkbox>
                        <Checkbox label="通用折扣券-9折">
                            <span>通用折扣券-9折</span>
                        </Checkbox>
                        <Checkbox label="翘脚牛肉高新店满减券-满200减5元">
                            <span>翘脚牛肉高新店满减券-满200减5元</span>
                        </Checkbox>
                    </CheckboxGroup>
                </FormItem>
                <FormItem label="发放数量">
                    <inputNumber min=1 v-model="couponRow.quantity"></inputNumber>     
                </FormItem>
                    
            </Form>
            <div slot="footer">
                <Button type="text" @click="singlecouponcancel">取消</Button>
                <Button type="primary" @click="singlecouponok()">确定</Button>
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
                    name: 'memberedit',
                    params: {memberCardNo:row.memberCardNo}
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
                    desc: '已解锁',
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
                    desc: '已挂失',
                    duration: 2
                });
                this.disableModel=false;
            },
            disablecancel () {
                this.disableModel = false;
            },
            moreaction(actionName) {
                if(actionName === 'replace'){
                    this.replace();
                }else if(actionName === 'disable'){
                    this.disable();
                }else if(actionName === 'enable'){
                    this.enable();
                }else if(actionName === 'extend'){
                    this.extend();
                }else if(actionName === 'changepassword'){
                    this.changepassword();
                }else if(actionName === 'coupon'){
                    this.singlecoupon();
                }
            }
        }
    };
</script>