<style lang="less">
    @import '../../styles/common.less';
</style>

<template>
    <div>
        <Row class="margin-top-10">
            <Col span="24">
                <Card>
                    <p slot="title">
                        <Icon type="ios-person"></Icon>
                         商品列表
                    </p>
                    <Row>
                        <Button icon="plus" type="primary" @click="add()">录入商品</Button>
                        <div class="f_r">
                        	<Select v-model="chooseMerchant" style="width:200px" @on-change="initMain(chooseMerchant)">
						        <Option v-for="item in merchants" :value="item.merchantUuid" :key="item.merchantUuid">{{ item.merchantName }}</Option>
						    </Select>
                            <Input v-model="searchProductName" @on-change="handleSearch" icon="search" placeholder="商品名称搜索" style="width: 150px" />
                            <Input v-model="searchProductType" @on-change="handleSearch" icon="search" placeholder="商品品类搜索" style="width: 150px" />
                            <Input v-model="searchProductGroup" @on-change="handleSearch" icon="search" placeholder="商品组搜索" style="width: 150px" />
                            
                        </div>
                    </Row>
                    
                    <Row class="margin-top-10">
                        <Col span="24">
                            <div>
                                <Table :columns="productColumn" :data="productData" border stripe ref="productTable"></Table>
                                
                            </div>
                        </Col>
                    </Row>
                    <Row class="margin-top-10">
                        <Page ref="productpage" :total="total" size="small" :pageSize="pageSize" @on-change="changepage" show-total show-elevator></Page>
                    </Row>
                    
                </Card>
            </Col>
        </Row>
        <div>
        <Modal
            v-model="disableModel"
            ref="disableModel"
            title="商品下架">
            你确定要下架该商品吗 ?
            <div slot="footer">
                <Button type="text" @click="disablecancel">取消</Button>
                <Button type="primary" @click="disableok()">确定</Button>
            </div>
        </Modal>
        <Modal
            v-model="enableModel"
            ref="disableModel"
            title="商品上架">
            你确认要上架该商品吗 ?
            <div slot="footer">
                <Button type="text" @click="enablecancel">取消</Button>
                <Button type="primary" @click="enableok()">确定</Button>
            </div>
        </Modal>
        <Modal
            v-model="delModel"
            ref="delModel"
            title="商品删除">
            你确认要删除该商品吗 ,删除之后该商品关联的数据将全部消失?
            <div slot="footer">
                <Button type="text" @click="delcancel">取消</Button>
                <Button type="primary" @click="delok()">确定</Button>
            </div>
        </Modal>
        </div>
    </div>
</template>

<script>
import expandRow from './components/product-list-table-expand.vue';
import expandButton from './components/product-list-button-expand.vue';
import {ajaxProductListData} from './data/product-list-insale-data.js';
import table2excel from '@/libs/table2excel.js';
export default {
    components: {
        expandRow
    },
    data () {
        return {
            loading: true,
            editModel: false,
            resetModel: false,
            addModel: false,
            editRoleModel: false,
            multipleCouponModel: false,
            editRow: {},
            searchProductGroup:'',
            addRow: {},
            multipleCouponRow: {},
            userColumn: [],
            productColumn: [],
            totalData:[],
            userData: [],
            productData: [],
            searchProductType:'',
            searchProductName:'',
            total:0,
            pageSize:8,
            products:[],
            productlist:[],
        	delModel: false,
            linkModel: false,
            disableModel: false,
            enableModel: false,
            couponModel: false,
            merchants:[],
            chooseMerchant:{}
        }
    },
    methods: {
        getData () {
            this.productColumn = [
            /*{
                type: 'selection',
                align: 'center',
                width: 60
            },*/
            {
                type: 'expand',
                width: 30,
                render: (h, params) => {
                    return h(expandRow, {
                        props: {
                            row: params.row
                        }
                    })
                }
            },
            {
                title: '品类',
                align: 'center',
                key: 'productTypeName',
                width: 200,
                filters: [
                    {
                        label: '快餐',
                        value: '快餐'
                    },
                    {
                        label: '火锅',
                        value: '火锅'
                    }
                ],
                filterMultiple: true,
                filterMethod (value, row) {
                    return row.productTypeName === value;
                }

            },
            {
                title: '名称',
                key: 'productName',
                width:'200px',
                render: (h, params) => {
                	console.log(params);
                    return h('span', {
                        props: {
                            row: params.row
                        }
                    },[
                        h('img', {
                            attrs: {
                                src: params.row.imgUrl
                            },
                            style:{
                            	width:'60px',
                            	height:'48px',
                            	display:'inline-block',
                            	float:'left',
                            	margin:'5px 0'
                            }
                        }),h('span', {
                        	style:{
                        		display:'inline-block',
                        		float:'right',
                        		width:'100px',
                        		marginTop:'10px'
                        	}
                        },params.row.productName),h('span', {
                        	style:{
                        		display:'inline-block',
                        		float:'right',
                        		width:'100px'
                        	}
                        },params.row.unitPrice+'元')
                        
                    ])
                }
            },
            {
                title: '排序',
                align: 'center',
                key: 'sortNumber',
                width: 100,
                sortable: true

            },
            {
                title: '销量',
                align: 'center',
                key: 'saleNum'

            },
            {
                title: '库存',
                align: 'center',
                key: 'warehouseTotal'
            },
            {
                title: '更新日期',
                align: 'center',
                key: 'updateDate',
                width: 150,

            },
//          {
//              title: '状态',
//              align: 'center',
//              width: 120,
//              render: (h, params) => {
//                  let status = params.row.productStatus;
//                  let color = (status=='已上架'?'green':'red');
//                  return h('tag', {
//                      props: {
//                          color: color
//                      }
//                  }, status)
//              }
//          },
            {
                title: '操作',
                align: 'center',
                width: 180,
                render: (h, params) => {
                    return h('span', {
                    },[h('Button', {
                        props: {
                        	type:'warning',
                            row: params.row,
                            size:"small"
                        },
                        style:{
                        	marginRight: '8px'
                        },
                        on:{
                            click:()=>{
                            	this.enable(params.row)
                            }
                        }
                    },'上架'),h('Button', {
                        props: {
                        	type:'primary',
                            row: params.row,
                            size:"small"
                            
                        },
                        style:{
                        	marginRight: '8px'
                        },
                        on:{
                            click:()=>{
                            	this.edit(params.row)
                            }
                        }
                    },'编辑')
                    ])
                }
            },
            
            ];
            this.initPage(this.productlist);
            //this.loading = false;

        },
        initPage(data){
            //获取查询的数据并数据模型
            this.totalData = data;
            //数据总数量
            this.total = this.totalData.length;
            //处理默认首页显示
            if(this.totalData.length < this.pageSize){
                this.productData = this.totalData;
            }else{
                this.productData = this.totalData.slice(0,this.pageSize);
            }
            //重新设置成显示第一页
            this.$nextTick(function(){
                this.$refs['productpage'].currentPage = 1;
            })
        },
        //处理分页-页数改变
        changepage(index){
            var _start = ( index - 1 ) * this.pageSize;
            var _end = index * this.pageSize;
            this.productData = this.totalData.slice(_start,_end);
        },
        search (data, argumentObj) {
            let res = data;
            let dataClone = data;
            for (let argu in argumentObj) {
                if (argumentObj[argu].length > 0) {
                    res = dataClone.filter(d => {
                        return d[argu].indexOf(argumentObj[argu]) > -1;
                    });
                    dataClone = res;
                }
            }
            return res;
        },
        handleSearch () {
            let totalSearchData = this.search(this.productlist, {productTypeName: this.searchProductType, productName: this.searchProductName,productGroupName:this.searchProductGroup});
            this.initPage(totalSearchData);
        },
        add () {
            this.$router.push({
                                name: 'productadd',
                            });
        },

        coupondata () {
            this.$router.push({
                                name: 'coupondata',
                            });
        },
        exportMember () {
        this.$refs.memberTable.exportCsv({
                            filename: '会员列表'
                        });
        },
        sendMultipleCoupon() {
        this.multipleCouponModel = true;
        },
        multiplecouponcancel () {
            this.multipleCouponModel = false;   
        },
        multiplecouponok () {
            this.$Notice.success({
                    title: '成功',
                    desc: '优惠券已发放',
                    duration: 2
                });
                this.multipleCouponModel=false;  
        },
        changeProduct(type){
        	var options={
        		"actionType":type,
        		"productUuid":this.productUuid,
        		"merchantDTO":{
        			"merchantUuid":this.chooseMerchant
        		}
			}
			this.$http.post("/admin/changeProduct", this.comm.request(options))  
	        .then(response => {  
	      	    if(response.data.body.status.statusCode==0){
	      	    	if(type=="DELETE"){
	      	    		var desc="已删除商品"
	      	    	}else if(type=="ENABLE"){
	      	    		var desc="商品已生效"
	      	    	}else if(type=="DISABLE"){
	      	    		var desc="商品已失效"
	      	    	}
	      	    	this.$Notice.success({
	                    title: '成功',
	                    desc: desc||'',
	                    duration: 2
	                });
	                this.initMain(this.chooseMerchant);
	      	    }else{
	      	    	this.$Message.error(response.data.body.status.errorDesc);
	      	    }
	        }, response => {  
	            this.$Message.error('失败，请稍后重试');
	        })  
        },
        initMain(row){
        	var options={
        		"merchantDTO":{
        			"merchantUuid":row
        		}
			}
			this.$http.post("/admin/inquiryProduct", this.comm.request(options))  
	        .then(response => {  
	      	    if(response.data.body.status.statusCode==0){
	      	    	this.products = response.data.body.data.products;
	      	    	var arr=[];
	      	    	this.products.forEach(function(val,ind){
	      	    		if(!val.onSale){
	      	    		if(val.productCateDTO){
	      	    		var obj={
			                productTypeName:val.productCateDTO.cateName,
			                productName: val.productName,
			                productCode: val.productCode,
			                productUuid:val.productUuid,
			                sortNumber: ind,
			                updateDate: '2018-03-09 12:20',
			                productBrand:'魏家凉皮',
			                attrList:val.attrList,
			                skuList:val.skuList,
			                discountUnitPrice: 14,
			                discountRatio: '10%',
			                integral: 10,
			                productQuantity: 300,
			                productFrom: '西安',
			                transportFeeOwner: '卖家',
			                transportFee: '15',
			                transportType: '顺丰',
			                productStatus: val.onSale?'已上架':'未上架',
			                content:'这是商品描述html内容'
			                
			            }

						obj.warehouseTotal=val.totalUnit-val.soldUnit;
		                obj.saleNum=val.soldUnit;
	      	    		if(val.productMainImage){
	      	    			obj.imgUrl=val.productMainImage.url;
	      	    		}
	      	    		if(val.productGroupDTO){
	      	    			obj.productGroupName=val.productGroupDTO.name;
	      	    		}
	      	    		if(val.skuEnabled){
	      	    			if(val.minUnitPrice&&val.maxUnitPrice){
		      	    			obj.unitPrice= val.minUnitPrice+'-'+val.maxUnitPrice;
		      	    		}else{
		      	    			obj.unitPrice="0"
		      	    		}
	      	    		}else{
	      	    			if(val.unitPrice){
	      	    				obj.unitPrice=val.unitPrice;
		      	    		}else{
		      	    			obj.unitPrice='0'
		      	    		}
	      	    		}
	      	    		
	      	    		arr.push(obj);	
	      	    		}else{
	      	    		var obj={
	      	    			productTypeName:'优惠券',
			                productName: val.productName,
			                productCode: val.productCode,
			                productUuid:val.productUuid,
			                sortNumber: ind,
			                updateDate: '2018-03-09 12:20',
			                productBrand:'魏家凉皮',
			                attrList:val.attrList,
			                skuList:val.skuList,
			                discountUnitPrice: 14,
			                discountRatio: '10%',
			                integral: 10,
			                productQuantity: 300,
			                productFrom: '西安',
			                transportFeeOwner: '卖家',
			                transportFee: '15',
			                transportType: '顺丰',
			                productStatus: val.onSale?'已上架':'未上架',
			                content:'这是商品描述html内容'
			                
			            }
	      	    		obj.warehouseTotal=val.totalUnit-val.soldUnit;
		                obj.saleNum=val.soldUnit;
	      	    		if(val.productMainImage){
	      	    			obj.imgUrl=val.productMainImage.url;
	      	    		}
	      	    		if(val.productGroupDTO){
	      	    			obj.productGroupName=val.productGroupDTO.name;
	      	    		}
	      	    		if(val.skuEnabled){
	      	    			if(val.minUnitPrice&&val.maxUnitPrice){
		      	    			obj.unitPrice= val.minUnitPrice+'-'+val.maxUnitPrice;
		      	    		}else{
		      	    			obj.unitPrice="0"
		      	    		}
	      	    		}else{
	      	    			if(val.unitPrice){
	      	    				obj.unitPrice=val.unitPrice;
		      	    		}else{
		      	    			obj.unitPrice='0'
		      	    		}
	      	    		}
	      	    		
	      	    		arr.push(obj);	
	      	    		}
	      	    		}
	      	    		
	      	    		
	      	    	})
	      	    	this.productlist=arr;
	      	    	this.getData();
	      	    }else{
	      	    	this.$Message.error(response.data.body.status.errorDesc);
	      	    }
	        }, response => {  
	            this.$Message.error('失败，请稍后重试');
	        })  
        },
        	edit(row){
        		var that=this;
                this.$router.push({
                    name: 'productdetail',
                    params: {productUuid:row.productUuid,merchantUuid:that.chooseMerchant}
                });
            },
            del(row){
            	this.productUuid=row.productUuid;
                this.delModel=true;
            },
            enable(row){
            	this.productUuid=row.productUuid;
                this.enableModel=true;
            },
            delcancel (row) {
                this.delModel=false;
            },
            delok(row) {
            	this.changeProduct("DELETE");
                this.delModel=false;
            },
            enableok () {
            	this.changeProduct("ENABLE");
                this.enableModel=false;
            },
            enablecancel () {
                this.enableModel=false;
            },
            disable(row){
            	this.productUuid=row.productUuid;
            	this.disableModel=true;
            },
            disableok () {
            	this.changeProduct("DISABLE");
                this.disableModel=false;
            },
            disablecancel () {
                this.disableModel = false;
            },
            inquiryMerchant(){
            	var options={
				}
				this.$http.post("/admin/inquiryMerchant", this.comm.request(options))  
		        .then(response => {  
		      	    if(response.data.body.status.statusCode==0){
						this.merchants=response.data.body.data.merchants;
						this.chooseMerchant=this.merchants[0].merchantUuid;
						this.initMain(this.merchants[0].merchantUuid);
		      	    }else{
						this.$Message.error(response.data.body.status.errorDesc);
		      	    }
		        }, response => {  
		            this.$Message.error('失败，请稍后重试');
		        })  
            }
    },
    created () {
    	this.inquiryMerchant();
       
    }
};
</script>
