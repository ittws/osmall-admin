<template>
    <div>
        <Row >
            <Col span="6">
                <span class="text-lable">商户号:</span>
                <span class="text-value">{{ row.merchantId }}</span>
            </Col>
            <Col span="6">
                <span class="text-lable">座机:</span>
                <span class="text-value">{{ row.merchantContactLandline }}</span>
            </Col>
            <Col span="6">
                <span class="text-lable">地址: </span>
                <span class="text-value">{{ row.merchantAddress}}</span>
            </Col>
        </Row>
    </div>
</template>
<script>
    export default {
        props: {
            row: Object
        }
    };
</script>