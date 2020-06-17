<template>
    <div>
        <Card>
        <p slot="title">
            <Icon type="ios-person"></Icon>
             规格参数
        </p>
        <Row>
            <Col span="8">
                <span class="text-lable">品牌: </span>
                <span class="text-value">{{row.productBrand}}</span>
            </Col>
            <Col span="6" offset="2">
                <span class="text-lable">材质: </span>
                <span class="text-value">{{row.productMaterial}}</span>
            </Col>
            <Col span="6" offset="2">
                <span class="text-lable">型号: </span>
                <span class="text-value">{{row.productModel}}</span>
            </Col>
        </Row>
        <Row>
            <Col span="8">
                <span class="text-lable">尺寸: </span>
                <span class="text-value">{{row.productSize}}</span>
            </Col>
            <Col span="6" offset="2">
                <span class="text-lable">产地: </span>
                <span class="text-value">{{row.productFrom}}</span>
            </Col>
            <Col span="6" offset="2">
                <span class="text-lable">容量: </span>
                <span class="text-value">{{row.productVolumn}}</span>
            </Col>
        </Row>
        <Row>
            <Col span="8">
                <span class="text-lable">保修期: </span>
                <span class="text-value">{{row.productWarranty}}</span>
            </Col>
            <Col span="6" offset="2">
                <span class="text-lable">重量: </span>
                <span class="text-value">{{row.productWeight}}</span>
            </Col>
            <Col span="6" offset="2">
                <span class="text-lable">单位: </span>
                <span class="text-value">{{row.productMeasurementUnit}}</span>
            </Col>
        </Row>
        </Card>
        <Card class="margin-top-10">
        <p slot="title">
            <Icon type="ios-person"></Icon>
             商品价格
        </p>
        <Row>
            <Col span="8">
                <span class="text-lable">原单价: </span>
                <span class="text-value">{{row.unitPrice}}</span>
            </Col>
            <Col span="6" offset="2">
                <span class="text-lable">当前特价: </span>
                <span class="text-value">{{row.discountUnitPrice}}</span>
            </Col>
            <Col span="6" offset="2">
                <span class="text-lable">当前折扣: </span>
                <span class="text-value">{{row.discountRatio}}</span>
            </Col>
        </Row>
        <Row>
            <Col span="8">
                <span class="text-lable">获取购币: </span>
                <span class="text-value">{{row.integral}}</span>
            </Col>
            <Col span="6" offset="2">
                <span class="text-lable">库存: </span>
                <span class="text-value">{{row.productQuantity}}</span>
            </Col>
        </Row>
        <Row>
            <Col span="8">
                <span class="text-lable">保修期: </span>
                <span class="text-value">{{row.productWarranty}}</span>
            </Col>
            <Col span="6" offset="2">
                <span class="text-lable">重量: </span>
                <span class="text-value">{{row.productWeight}}</span>
            </Col>
            <Col span="6" offset="2">
                <span class="text-lable">单位: </span>
                <span class="text-value">{{row.productMeasurementUnit}}</span>
            </Col>
        </Row>
        </Card>
        <Card class="margin-top-10">
        <p slot="title">
            <Icon type="ios-person"></Icon>
             物流信息
        </p>
        <Row>
            <Col span="8">
                <span class="text-lable">所在地: </span>
                <span class="text-value">{{row.productFrom}}</span>
            </Col>
            <Col span="6" offset="2">
                <span class="text-lable">快递费承担方: </span>
                <span class="text-value">{{row.transportFeeOwner}}</span>
            </Col>
            <Col span="6" offset="2">
                <span class="text-lable">快递费价格: </span>
                <span class="text-value">{{row.transportFee}}</span>
            </Col>
        </Row>
        <Row>
            <Col span="8">
                <span class="text-lable">快递方式: </span>
                <span class="text-value">{{row.transportType}}</span>
            </Col>
        </Row>
        </Card>
        <Card class="margin-top-10">
            <p slot="title">
            <Icon type="ios-person"></Icon>
             商品描述
        </p>
            <div v-html="row.content"></div>
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