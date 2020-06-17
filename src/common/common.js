import axios from 'axios'
import stringutil from './stringutil.js';
import dateutil from './dateutil.js';
const request = function(row) {
    var tokenId = this.getObject('ADMINTOKEN');
    return {
        "header": {
            "requestId": stringutil.getRandomNumber(32),
            "timeStamp": new Date().format('yyyyMMddhhmmss'),
            "applicationId": "san-admin",
            "ip": "127.0.0.1",
            "tokenId": tokenId
        },
        "body": row
    }
}
const setObject = function(key, value) {
    value = JSON.stringify(value)
    return localStorage.setItem(key, value)
}
const getObject = function(key) {
    return JSON.parse(window.localStorage.getItem(key));
}
const inquiryOSSInfo = function() {
    var options = {}
    axios.post("/inquiryOSSInfo", this.request(options))
        .then(response => {
            if (response.data.body.status.statusCode == 0) {
                var data = response.data.body.data;
                this.setObject("ossinfo", data);
            } else {
                this.$Message.error(response.data.body.status.errorDesc);
            }
        }, response => {
            this.$Message.error('操作失败');
        })
}
const getOssInfo = function() {
    return this.getObject('ossinfo');
}
const translateOrderStatus = function(orderStatus) {
    let orderStatusDesc = '';
    switch (orderStatus) {
        case '0':
            orderStatusDesc = '待付款';
            break;
        case '1':
            orderStatusDesc = '待发货';
            break;
        case '2':
            orderStatusDesc = '待收货';
            break;
        case '3':
            orderStatusDesc = '待评价';
            break;
        case '4':
            orderStatusDesc = '已取消';
            break;
        case '5':
            orderStatusDesc = '已完成';
            break;
    }
    return orderStatusDesc;
}
const translateAfterSaleStatus = function(status) {
    let statusDesc = '';
    switch (status) {
        case '0':
            statusDesc = '退款中';
            break;
        case '1':
            statusDesc = '待买家退货';
            break;
        case '2':
            statusDesc = '退款申请拒绝';
            break;
        case '3':
            statusDesc = '待确认收货';
            break;
        case '9':
            statusDesc = '退款成功';
            break;
    }
    return statusDesc;
}
const translateAfterSaleType = function(saleType) {
    let saleTypeDesc = '';
    switch (saleType) {
        case '1':
            saleTypeDesc = '仅退款';
            break;
        case '2':
            saleTypeDesc = '退款退货';
            break;
    }
    return saleTypeDesc;
}
const courierList = [{
    value: '顺丰速运'
}, {
    value: '中国邮政'
}, {
    value: '圆通速递'
}, {
    value: '中通快递'
}, {
    value: '申通快递'
}, {
    value: '宅急送'
}, {
    value: '联邦物流'
}, {
    value: '韵达快递'
}, {
    value: '京东快递'
}, {
    value: '百世快递'
}, {
    value: '其他快递'
}]
export default {
    request,
    setObject,
    getObject,
    inquiryOSSInfo,
    getOssInfo,
    translateOrderStatus,
    translateAfterSaleStatus,
    translateAfterSaleType,
    courierList
}