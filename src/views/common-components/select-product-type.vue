<style lang="less">
    @import '../../styles/common.less';
</style>

<template>
    <div>
        <Modal
            v-model="productTypeModel"
            ref="productTypeModel"
            :closable="false"
            title="选择商品品类">
            <Tree :data="producttype" show-checkbox multiple></Tree>
            
            <div slot="footer">
                <Button type="text" @click="selectproducttypecancel">取消</Button>
                <Button type="primary" @click="selectproducttypeok()">确定</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
import {ajaxProductTypeListData} from './data/product-type-list-data.js';
export default {
    data () {
        return {
            producttype: ajaxProductTypeListData,
            productTypeModel: true
        }
    },
    methods: {
        
            
        selectproducttypecancel () {
            this.$parent.selectProductTypeModel = false;   
        },
        selectproducttypeok () {
            this.$parent.selectProductTypeModel=false;  
        },
    },
    created () {
        
    }
};
</script>
