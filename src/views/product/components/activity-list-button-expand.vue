<template>
    <div>
        
        <Button type="primary" size="small" v-if="row.activityStatus=='未开始'||row.activityStatus=='进行中'" @click="edit(row)">编辑</Button>
        <Button type="success" size="small" v-if="row.activityStatus=='未开始'" @click="enable(row)">发布</Button>
        <Button type="del" size="small" v-if="row.activityStatus=='未开始'" @click="del(row)">删除</Button>
        <Button type="error" size="small" v-if="row.activityStatus=='进行中'" @click="disable(row)">结束</Button>
        <Button type="info" size="small" v-if="row.activityStatus=='进行中' || row.activityStatus=='已结束'" @click="data(row)">详情</Button>
        <!--
        <Dropdown trigger="hover" transfer @on-click='moreaction'>
            <Button size="small">
                更多
                <Icon type="arrow-down-b"></Icon>
            </Button>
            <DropdownMenu slot="list">
                <DropdownItem name='data' v-if="row.activityStatus=='未开始'">发布活动</DropdownItem>
                <DropdownItem name='data' v-if="row.activityStatus=='进行中'">结束活动</DropdownItem>
                <DropdownItem name='link' v-if="row.enrollmentRequired">报名详情</DropdownItem>
                <DropdownItem name='del' v-if="row.activityStatus=='未开始'">删除活动</DropdownItem>
            </DropdownMenu>
        </Dropdown>
        -->        
        <Modal
            v-model="delModel"
            ref="delModel"
            title="删除活动">
            你确认要删除该活动吗 ?
            <div slot="footer">
                <Button type="text" @click="delcancel">取消</Button>
                <Button type="primary" @click="delok()">确定</Button>
            </div>
        </Modal>
        <Modal
            v-model="linkModel"
            ref="linkModel"
            title="优惠券链接">
            <Row>
            <Col span="24">
            <Form ref="linkRow" :model="linkRow" :label-width="80">
                <FormItem label="链接地址">
                    <Input v-model="linkRow.url"></Input>
                </FormItem>             
            </Form>
            </Col>
            </Row>
            <div slot="footer">
                <Button type="primary" @click="copylink">复制链接</Button>                
            </div>
        </Modal>
        <Modal
            v-model="disableModel"
            ref="disableModel"
            title="结束活动">
            你确认要结束该活动吗?
            <div slot="footer">
                <Button type="text" @click="disablecancel">取消</Button>
                <Button type="primary" @click="disableok()">确定</Button>
            </div>
        </Modal>
        <Modal
            v-model="enableModel"
            ref="disableModel"
            title="发布活动">
            你确认要发布该活动吗 ?
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
                    <inputNumber v-model="couponRow.quantity"></inputNumber>     
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
                    name: 'activityedit',
                    params: {activityName:row.activityName}
                });
            },
            data (row) {
                this.$router.push({
                    name: 'activitydata',
                    params: {activityName:row.activityName}
                });
            },
            del (row) {
                this.$Notice.success({
                    title: '成功',
                    desc: '会员已删除',
                    duration: 2
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
                    desc: '已删除该活动',
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
                    desc: '活动已发布',
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
                    desc: '活动已结束',
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