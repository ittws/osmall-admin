<template>
    <div>
        <Row >
            <Col span="6">
                <span class="text-lable"><Icon type="male"></Icon>&nbsp;性别:</span>
                <span class="text-value">{{ row.memberSex }}</span>
            </Col>
            <Col span="6">
                <span class="text-lable"><Icon type="card"></Icon>&nbsp;身份证号: </span>
                <span class="text-value">{{ row.memberIdNo}}</span>
            </Col>
            <Col span="6">
                <span class="text-lable"><Icon type="location"></Icon>&nbsp;地址: </span>
                <span class="text-value">{{ row.memberAddress}}</span>
            </Col>
             <Col span="6">
                <span class="text-lable"><Icon type="person"></Icon>&nbsp;推荐人: </span>
                <span class="text-link">{{ row.MemberReferral.memberName }}</span>
            </Col>
        </Row>
        <Row class="margin-top-10">
            <Col span="3">
                <span class="text-lable"><Icon type="social-yen"></Icon>&nbsp;余额: </span>
                <span class="text-head-main">{{ row.memberBalance }}</span>
            </Col>
            <Col span="3">
                <Button type="info" size="small" @click="viewBalanceDetail">详情</Button>
            </Col>
             <Col span="3">
                <span class="text-lable"><Icon type="ios-medical"></Icon>&nbsp;购币: </span>
                <span class="text-head-main">{{ row.memberIntegral }}</span>                
            </Col>
            <Col span="3">
                <Button type="info" size="small" @click="viewIntegralDetail">详情</Button>
            </Col>  
            <Col span="6">
                <span class="text-lable"><Icon type="calendar"></Icon>&nbsp;开卡日期: </span>
                <span class="text-value">{{ row.memberOpenDate }}</span>
            </Col>
            <Col span="6">
                <span class="text-lable"><Icon type="calendar"></Icon>&nbsp;过期日期: </span>
                <span class="text-value">{{ row.memberExpirationDate }}</span>
            </Col>
        </Row>
        <Modal
            v-model="balanceDetailModel"
            ref="balanceDetailModel"
            title="消费详情">
                <Table :columns="balanceDetailColumn" :data="balanceDetailData" border stripe ></Table>
            <div slot="footer">
                <Button type="text" @click="cancel">关闭</Button>
            </div>
        </Modal>
        <Modal
            v-model="integralDetailModel"
            ref="integralDetailModel"
            title="购币详情">
                <Table :columns="integralDetailColumn" :data="integralDetailData" border stripe ></Table>
            <div slot="footer">
                <Button type="text" @click="cancel">关闭</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
import {ajaxBalanceListData,ajaxIntegralListData} from '../data/member-balance-list-data.js';
    export default {
        data () {
            return {
                balanceDetailModel:false,
                integralDetailModel:false,
                balanceDetailColumn : [ 
                    {
                        title: '日期',
                        align: 'center',
                        key: 'tranDate',
                        width: 100,
                        sortable: true
                    },
                    {
                        title: '明细项',
                        align: 'center',
                        key: 'tranDescription'
                    },
                    {
                        title: '消费金额(元)',
                        align: 'center',
                        key: 'tranAmount',
                        width: 100
                    },
                    {
                        title: '余额(元)',
                        align: 'center',
                        key: 'balanceAmount',
                        width: 100
                    }
                ],
                integralDetailColumn : [ 
                    {
                        title: '日期',
                        align: 'center',
                        key: 'tranDate',
                        width: 100,
                        sortable: true
                    },
                    {
                        title: '明细项',
                        align: 'center',
                        key: 'tranDescription'
                    },
                    {
                        title: '消费购币',
                        align: 'center',
                        key: 'tranAmount',
                        width: 100
                    },
                    {
                        title: '购币余额',
                        align: 'center',
                        key: 'balanceAmount',
                        width: 100
                    }
                ],
                balanceDetailData: ajaxBalanceListData,
                integralDetailData: ajaxIntegralListData
            }

        },
        props: {
            row: Object
        },
        methods: {
           viewBalanceDetail() {
                this.balanceDetailModel = true;
           },
           viewIntegralDetail() {
                this.integralDetailModel = true;
           },
           cancel() {
                this.balanceDetailModel = false;
                this.integralDetailModel = false;
           } 
        }
    };
</script>