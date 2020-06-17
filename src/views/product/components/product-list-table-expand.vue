<template>
    <div>
        <Card>
        <p slot="title">
             商品参数
        </p>
        <Row>
            <Col span="6" v-for="item in row.attrList">
                <span class="text-label">{{item.productAttrName}}: </span>
                <span class="text-value">{{item.productAttrValue}}</span>
            </Col>
        </Row>
        </Card>
        <Card class="margin-top-10">
        <p slot="title">
             商品规格
        </p>
        <Row v-if="row.skuAttrList.length>0">
            <Col span="4" v-for="item in row.skuAttrList">
                <span class="text-label">{{item.skuAttrName}}</span>
            </Col>
            <Col span="4" >
                <span class="text-label">价格</span>
             </Col>
             <Col span="4">
                <span class="text-label">划线价格</span>
             </Col>
             <Col span="4">
                <span class="text-label">库存</span>
             </Col>
        </Row>
        <Row v-for="item in row.skuList">
            <Col span="4" v-for="valueItem in item.skuAttrValueList" v-if="item.skuAttrValueList">
                <span class="text-value">{{valueItem.skuAttrValue}}</span>
            </Col>
            <Col span="4" >
                <span class="text-value">{{item.skuUnitPoint}}购币</span>
             </Col>
             <Col span="4">
                <span class="text-value">{{item.skuUnitPointStandard}}购币</span>
             </Col>
             <Col span="4">
                <span class="text-value">{{item.skuTotalUnit - item.skuSoldUnit}}</span>
             </Col>
        </Row>
        </Card>
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