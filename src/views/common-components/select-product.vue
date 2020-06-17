<style lang="less">
    @import '../../styles/common.less';
</style>

<template>
    <div>
        <Modal
            v-model="productModel"
            ref="productModel"
            :closable="false"
            title="选择商品">
            <Tree :data="product" show-checkbox multiple></Tree>
            
            <div slot="footer">
                <Button type="text" @click="selectproductcancel">取消</Button>
                <Button type="primary" @click="selectproductok()">确定</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
import {ajaxProductListData} from './data/product-list-data.js';
export default {
    data () {
        return {
            product: ajaxProductListData,
            productModel: true
        }
    },
    methods: {
        
        selectproductcancel () {
            this.$parent.selectProductModel = false;   
        },
        selectproductok () {
            this.$parent.selectProductModel=false;  
        },
    },
    created () {
        
    }
};
</script>
