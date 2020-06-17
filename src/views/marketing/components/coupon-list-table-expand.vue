<template>
    <div>
        <Row >

            <Col span="2">
                <span class="text-lable">使用条件: </span>
            </Col>
            <Col span="6">
                <span class="text-value">1. 最低消费{{ row.conditionThreshold}}元</span>
                <span class="text-value" style="display:block">2. 仅限在商户{{ row.conditionMerchant}}消费</span>
                <span class="text-value" style="display:block">3. 仅限{{ row.conditionProductType}}类商品</span>
                <span class="text-value">4. 仅限商品{{ row.conditionProduct}}</span>
            </Col>
            <Col span="6">
                <span class="text-lable">创建时间:</span>
                <span class="text-value">{{ row.createDate }}</span>
            </Col>
            <Col span="10">
                <span class="text-lable">描述: </span>
                <span class="text-value">{{ row.description}}</span>
            </Col>
        </Row>
    </div>
</template>
<script>
    export default {
        data () {
            return {
                
            }
        },
        props: {
            row: Object
        },
        methods: {
           
        }
    };
</script>