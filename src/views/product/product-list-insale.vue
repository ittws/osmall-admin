<style lang="less">
</style>

<template>
	<div>
		<Row class="margin-top-10">
			<Col span="24">
			<Card>
				<p slot="title">
					商品列表
				</p>
				<Row>
					<div>
						<Select v-model="selectedSupplierUuid" style="width:240px" placeholder="供应商" clearable filterable>
							<Option v-for="item in suppliers" :value="item.supplierUuid" :key="item.supplierUuid">{{ item.supplierName }}</Option>
						</Select>
						<Select v-model="onSale" style="width:120px" placeholder="是否上架" clearable>
							<Option v-for="item in onSales" :value="item.issale" :key="item.issale">{{ item.name }}</Option>
						</Select>
						<Select v-model="searchMerchant" placeholder="选择商家" style="width:180px"  filterable remote :remote-method="inquiryMerchant" :loading="merchantLoading" clearable>
							<Option
							v-for="item in merchants"
							:value="item.merchantUuid"
							:key="item.merchantUuid"
							>{{item.merchantName}}
							</Option>
						</Select>
						<Input v-model="searchProductName" placeholder="商品名称" type="text" style="width: 150px" clearable />
						<Input v-model="productCateDTO.title" placeholder="商品类目" style="width: 150px" readonly type="text" clearable
						 @click.native="prodCateModal = true" />
						 <Select v-model="selectedProductBrandUuid" style="width:120px" placeholder="商品品牌" clearable filterable>
							<Option v-for="item in brands" :value="item.productBrandUuid" :key="item.productBrandUuid">{{ item.name }}</Option>
						</Select>
						<i-switch size="large" v-model="hot">
							<span slot="open">热卖</span>
							<span slot="close">热卖</span>
						</i-switch>
						<i-switch size="large" v-model="recommend">
							<span slot="open">推荐</span>
							<span slot="close">推荐</span>
						</i-switch>
						<i-switch size="large" v-model="newProduct">
							<span slot="open">新品</span>
							<span slot="close">新品</span>
						</i-switch>
						<!-- <i-switch size="large" v-model="onSale">
                <span slot="open">上架</span>
                <span slot="close">上架</span>
              </i-switch> -->
						<Button type="success" @click="handleSearch">查询</Button>
						<Button class="f_r" icon="plus" type="primary" @click="add()">录入商品</Button>
					</div>
				</Row>

				<Row class="margin-top-10">
					<Col span="24">
					<div>
						<Table :loading="loading" @on-sort-change="onsort" :columns="productColumn" :data="productData" border stripe ref="productTable"></Table>
					</div>
					</Col>
				</Row>
				<Row class="margin-top-10">
					<Page ref="productpage" :total="total" size="small" :pageSize="pageSize" @on-change="changepage" show-total
					 show-elevator></Page>
				</Row>
			</Card>
			</Col>
		</Row>
		<div>
			<Modal v-model="prodCateModal" title="选择商品类目" @on-cancel="prodCateModal = false">
				<Tree :data="producttype" :load-data="loadProdCateData" :render="renderContent"></Tree>
				<div slot="footer">

				</div>
			</Modal>
			<Modal v-model="disableModel" ref="disableModel" title="商品下架">
				你确定要下架该商品吗 ?
				<div slot="footer">
					<Button type="text" @click="disablecancel">取消</Button>
					<Button type="primary" @click="disableok()">确定</Button>
				</div>
			</Modal>
			<Modal v-model="enableModel" ref="disableModel" title="商品上架">
				你确认要上架该商品吗 ?
				<div slot="footer">
					<Button type="text" @click="enablecancel">取消</Button>
					<Button type="primary" @click="enableok()">确定</Button>
				</div>
			</Modal>
			<Modal v-model="delModel" ref="delModel" title="商品删除">
				你确认要删除该商品吗 ,删除之后该商品关联的数据将全部消失?
				<div slot="footer">
					<Button type="text" @click="delcancel">取消</Button>
					<Button type="primary" @click="delok()">确定</Button>
				</div>
			</Modal>
			<Modal title="图片预览" v-model="showPreviewImage">
				<img :src="previewImageUrl" v-if="showPreviewImage" style="width: 100%" />
				<div slot="footer">
					<Button type="default" @click="showPreviewImage = false">关闭</Button>
				</div>
			</Modal>
		</div>
	</div>
</template>

<script>
	import expandRow from "./components/product-list-table-expand.vue";
	import expandButton from "./components/product-list-button-expand.vue";
	import {
		ajaxProductListData
	} from "./data/product-list-insale-data.js";
	import table2excel from "@/libs/table2excel.js";
	export default {
		components: {
			expandRow
		},
		data() {
			return {
				loading: false,
				merchantLoading:false,
				editModel: false,
				resetModel: false,
				addModel: false,
				prodCateModal: false,
				isonsort:'',
				producttype: [ //选择的类目数据
					{
						title: "全部类目",
						loading: false,
						//                      expand: false,
						render: (h, {
							root,
							node,
							data
						}) => {
							return h(
								"span", {
									style: {
										display: "inline-block",
										width: "100%"
									}
								},
								[
									h("span", [
										h("Icon", {
											props: {
												type: "ios-folder-outline"
											},
											style: {
												marginRight: "8px"
											}
										}),
										h("span", data.title)
									]),
									h(
										"span", {
											style: {
												display: "inline-block",
												float: "right",
												marginRight: "32px"
											}
										},
										[
											h(
												"Button", {
													props: Object.assign({}, this.buttonProps, {
														icon: "checkmark",
														type: "ghost"
													}),
													style: {
														marginRight: "8px"
													},
													on: {
														click: () => {
															this.selectProdCate(data);
														}
													}
												},
												"选择类别"
											)
										]
									),
								]
							);
						},
						children: []
					}
				],
				editRow: {},
				addRow: {},
				multipleCouponRow: {},
				productColumn: [],
				productData: [],
				index: 1,
				productCateDTO: {
					productCateUuid: ""
				},
				searchProductName: "",
				searchMerchant: "", //查询商家
				merchants: [],
				newProduct: false,
				recommend: false,
				hot: false,
				onSale: '',
				total: 0,
				pageSize: 20,
				startIndex: 0,
				products: [],
				productlist: [],
				delModel: false,
				linkModel: false,
				disableModel: false,
				enableModel: false,
				suppliers: [],
				brands: [],
				onSales: [{
						issale: '3',
						name: "全部商品"
					},
					{
						issale: '2',
						name: "上架商品"
					},
					{
						issale: '1',
						name: "未上架商品"
					},
				],
				selectedSupplierUuid: '',
				selectedProductBrandUuid: '',
				showPreviewImage: false, //预览照片模态框
				previewImageUrl: '' //预览照片地址
			};
		},
		methods: {
			//预览照片
			previewProductImage(url) {
				this.showPreviewImage = true;
				this.previewImageUrl = url;
			},
			getData() {
				this.productColumn = [
					// {
					// 	type: "expand",
					// 	width: 30,
					// 	render: (h, params) => {
					// 		return h(expandRow, {
					// 			props: {
					// 				row: params.row
					// 			}
					// 		});
					// 	}
					// },
					{
						title: "商家名称",
						align: "center",
						key: "merchantName",
						// width: 180,
					},
					{
						title: "类目",
						align: "center",
						key: "productCateName",
						width: 100,
					},
					{
						title: "品牌",
						align: "center",
						key: "productBrandName",
						width: 100,
					},
					{
						title: "名称",
						key: "productName",
						width: "230px",
						render: (h, params) => {
							return h(
								"span", {
									props: {
										row: params.row
									}
								},
								[
									h("img", {
										attrs: {
											src: params.row.productMainImage.url
										},
										style: {
											width: "60px",
											height: "48px",
											display: "inline-block",
											float: "left",
											margin: "5px 0"
										},
										on: {
											click: () => {
												this.previewProductImage(params.row.productMainImage.url)
											}
										}
									}),
									h(
										"span", {
											style: {
												display: "inline-block",
												float: "right",
												width: "120px",
												marginTop: "10px"
											}
										},
										params.row.productName
									)
								]
							);
						}
					},
					{
						title: "价格",
						align: "center",
						width: 100,
						render: (h, params) => {
							return h(
								"span", {
									props: {
										row: params.row
									}
								},
								[
									h(
										"span", {
											style: {
												display: "inline-block",
												float: "right",
												width: "100px",
												marginTop: "10px",
												color: "red"
											}
										},
										params.row.unitPrice + "元"
									),
									h(
										"span", {
											style: {
												display: "inline-block",
												float: "right",
												width: "100px",
												"text-decoration": "line-through"
											}
										},
										params.row.unitPriceStandard + "元"
									)
								]
							);
						}
					},
					{
						title: "营销状态",
						align: "center",
						width: 180,
						render: (h, params) => {
							let isHot = params.row.hot;
							let isRecommend = params.row.recommend;
							let isNew = params.row.new;
							return h(
								"span", {
									props: {
										row: params.row
									}
								},
								[
									h('tag', {
										props: {
											color: "green"
										},
										style: {
											display: isHot ? "display" : "none"
										}
									}, "热卖"),
									h('tag', {
										props: {
											color: "green"
										},
										style: {
											display: isRecommend ? "display" : "none"
										}
									}, "推荐"),
									h('tag', {
										props: {
											color: "green"
										},
										style: {
											display: isNew ? "display" : "none"
										}
									}, "新品")
								]
							);
						}
					},
					{
						title: "销量",
						align: "center",
						key: "soldUnit",
						width: "100",
						sortable:'custom'
					},
					{
						title: "库存",
						align: "center",
						key: "totalUnit",
						width: "100"
					},
					{
						title: '状态',
						align: 'center',
						width: 120,
						render: (h, params) => {
							let status = (params.row.onSale ? '已上架' : '未上架');
							let color = (params.row.onSale ? 'green' : 'red');
							return h('tag', {
								props: {
									color: color
								}
							}, status)
						}
					},
					{
						title: "操作",
						align: "center",
						width: 180,
						render: (h, params) => {
							let onSale = params.row.onSale;
							let type = onSale ? "warning" : "success";
							let saleText = onSale ? "下架" : "上架";
							return h("span", {}, [
								h(
									"Button", {
										props: {
											type: type,
											row: params.row,
											size: "small"
										},
										style: {
											marginRight: "8px"
										},
										on: {
											click: () => {
												if (onSale)
													this.disable(params.row);
												else
													this.enable(params.row);
											}
										}
									},
									saleText
								),
								h(
									"Button", {
										props: {
											type: "primary",
											row: params.row,
											size: "small"
										},
										style: {
											marginRight: "8px"
										},
										on: {
											click: () => {
												this.edit(params.row);
											}
										}
									},
									"编辑"
								),
								h('Poptip', {
									props: {
										confirm: true,
										title: '您确定要删除该商品吗?',
										transfer: true
									},
									on: {
										'on-ok': () => {
											this.deletesupplier(params.row);
										}
									}
								}, [
									h('Button', {
										props: {
											type: 'error',
											size: 'small'
										},
										style: {
											margin: '0 5px 0 0'
										},
									}, '删除')
								])
							]);
						}
					}
				];
			},
			//加载类目数据
			loadProdCateData(item, callback) {
				var options = {};
				if (item.title == "全部类目") {
					options = {
						actionType: "ROOT"
					};
				} else {
					options = {
						actionType: "CHILD",
						productCateUuid: item.productCateUuid || ""
					};
				}
				this.$http
					.post("/admin/inquiryProductCate", this.common.request(options))
					.then(
						response => {
							if (response.data.body.status.statusCode == 0) {
								var cates = response.data.body.data.cates;
								var data = [];
								cates.forEach(function(val, ind) {
									if (val.leaf) {
										var obj = {
											title: val.cateName,
											productCateUuid: val.productCateUuid,
											children: []
										};
									} else {
										var obj = {
											title: val.cateName,
											loading: false,
											productCateUuid: val.productCateUuid,
											children: []
										};
									}

									data.push(obj);
								});
								callback(data);
							} else {
								this.$Message.error(response.data.body.status.errorDesc);
							}
						},
						response => {
							this.$Message.error("失败，请稍后重试");
						}
					);
			},
			deletesupplier(row) {
				if (row.onSale) {
					this.$Message.error('上架商品不允许删除！');
					return false;
				}
				var options = {
					actionType: 'DELETE',
					productUuid: row.productUuid
				}
				this.$http.post("/admin/changeProduct", this.common.request(options))
					.then(response => {
						if (response.data.body.status.statusCode == 0) {
							var data = response.data.body.data;
							this.$Notice.success({
								title: '商品已删除',
								duration: 2
							});
							this.searchProduct();
						} else {
							this.$Notice.success({
								title: '失败',
								desc: response.data.body.status.errorDesc,
								duration: 2
							});
						}
					}, response => {
						this.$Message.error('出错了，请稍后重试');
					})
			},
			//商品类目页面生成
			renderContent(h, {
				root,
				node,
				data
			}) {
				return h(
					"span", {
						style: {
							display: "inline-block",
							width: "100%"
						}
					},
					[
						h("span", [h("span", data.title)]),
						h(
							"span", {
								style: {
									display: "inline-block",
									float: "right",
									marginRight: "32px"
								}
							},
							[
								h(
									"Button", {
										props: Object.assign({}, this.buttonProps, {
											icon: "checkmark",
											type: "ghost"
										}),
										style: {
											marginRight: "8px"
										},
										on: {
											click: () => {
												this.selectProdCate(data);
											}
										}
									},
									"选择类目"
								)
							]
						)
					]
				);
			},
			resetPage() {
				this.startIndex = 0;
				this.total = 0;
				this.productData = [];
				this.productlist = [];
				//重新设置成显示第一页
				this.$nextTick(function() {
					this.$refs["productpage"].currentPage = 1;
				});
			},
			//处理分页-页数改变
			changepage(index) {
				this.startIndex = (index - 1) * this.pageSize;
				this.index = index;
				this.searchProduct();
			},
			add() {
				let keyArray = [];
				var searchOptions = {
					startIndex: this.startIndex,
					pageSize: this.pageSize,
					index: this.index
				};
				//判断是否有商品名称查询条件
				if (this.searchProductName) {
					keyArray.push("PRODUCT_NAME");
					searchOptions.productName = this.searchProductName;
				}
				//判断是否有商品品类查询条件
				if (this.productCateDTO.productCateUuid) {
					keyArray.push("PRODUCT_CATE");
					searchOptions.productCateUuid = this.productCateDTO.productCateUuid;
				}
				//判断是否有供应商查询条件
				if (this.selectedSupplierUuid) {
					keyArray.push("SUPPLIER");
					searchOptions.supplierUuid = this.selectedSupplierUuid;
				}
				//判断是否有上架查询条件
				if (this.onSale == '1') {
					keyArray.push("ON_SALE");
					searchOptions.onSale = this.onSale;
				}
				if (this.onSale == '2') {
					keyArray.push("ON_SALE");
					searchOptions.onSale = this.onSale;
				}
				//判断是否有新品查询条件
				if (this.newProduct) {
					keyArray.push("NEW");
					searchOptions.new = this.newProduct;
				}
				//判断是否有推荐查询条件
				if (this.recommend) {
					keyArray.push("RECOMMEND");
					searchOptions.recommend = this.recommend;
				}
				//判断是否有热卖查询条件
				if (this.hot) {
					keyArray.push("HOT");
					searchOptions.hot = this.hot;
				}
				searchOptions.keyArray = keyArray;
				// var searchOptions = JSON.stringify(searchOptions);
				// searchOptions = encodeURI(searchOptions);
				this.$router.push({
					name: "productadd",
					query: {
						searchOptions: searchOptions
					}
				});
			},
			selectProdCate(data) {
				this.prodCateModal = false;
				this.productCateDTO = data;
			},
			exportMember() {
				this.$refs.memberTable.exportCsv({
					filename: "会员列表"
				});
			},
			sendMultipleCoupon() {
				this.multipleCouponModel = true;
			},
			multiplecouponcancel() {
				this.multipleCouponModel = false;
			},
			multiplecouponok() {
				this.$Notice.success({
					title: "成功",
					desc: "优惠券已发放",
					duration: 2
				});
				this.multipleCouponModel = false;
			},
			changeProduct(type) {
				var options = {
					actionType: type,
					productUuid: this.productUuid,
					supplierDTO: {
						supplierUuid: this.selectedSupplierUuid
					}
				};
				this.$http
					.post("/admin/changeProduct", this.common.request(options))
					.then(
						response => {
							if (response.data.body.status.statusCode == 0) {
								if (type == "DELETE") {
									var desc = "已删除商品";
								} else if (type == "ENABLE") {
									var desc = "商品上架成功";
								} else if (type == "DISABLE") {
									var desc = "商品下架成功";
								}
								this.$Notice.success({
									title: "成功",
									desc: desc || "",
									duration: 2
								});
								this.searchProduct(this.selectedSupplierUuid);
							} else {
								this.$Message.error(response.data.body.status.errorDesc);
							}
						},
						response => {
							this.$Message.error("失败，请稍后重试");
						}
					);
			},
			handleSearch() {
				this.resetPage();
				this.searchProduct();
			},
			onsort(order){
				if(order.order!=="normal"){
					this.startIndex=0;
					this.pageSize = 20;
					this.isonsort = order.order,
					this.searchProduct();
				}
			},
			searchProduct() {
				let keyArray = [];
				var searchOptions = {
					startIndex: this.startIndex,
					pageSize: this.pageSize
				};
				//判断是否有商品名称查询条件
				if (this.searchProductName) {
					keyArray.push("PRODUCT_NAME");
					searchOptions.productName = this.searchProductName;
				}
				 //商家
				if (this.searchMerchant) {
					keyArray.push("MERCHANT");
					searchOptions.merchantUuid = this.searchMerchant;
				}
				//判断是否有商品品类查询条件
				if (this.productCateDTO.productCateUuid) {
					keyArray.push("PRODUCT_CATE");
					searchOptions.productCateUuid = this.productCateDTO.productCateUuid;
				}
				//判断是否有供应商查询条件
				if (this.selectedSupplierUuid) {
					keyArray.push("SUPPLIER");
					searchOptions.supplierUuid = this.selectedSupplierUuid;
				}
				//判断是否有商品品牌查询条件
				if (this.selectedProductBrandUuid) {
					keyArray.push("BRAND");
					searchOptions.productBrandUuid = this.selectedProductBrandUuid;
				}
				//判断是否有上架查询条件
				if (this.onSale == '1') {
					keyArray.push("ON_SALE");
					searchOptions.onSale = false;
				}
				if (this.onSale == '2') {
					keyArray.push("ON_SALE");
					searchOptions.onSale = true;
				}
				//判断是否有新品查询条件
				if (this.newProduct) {
					keyArray.push("NEW");
					searchOptions.new = this.newProduct;
				}
				//判断是否有推荐查询条件
				if (this.recommend) {
					keyArray.push("RECOMMEND");
					searchOptions.recommend = this.recommend;
				}
				//判断是否有热卖查询条件
				if (this.hot) {
					keyArray.push("HOT");
					searchOptions.hot = this.hot;
				}
				if (this.isonsort) {
					searchOptions.sortBy="soldUnit";
					searchOptions.sort=this.isonsort
				}
				searchOptions.keyArray = keyArray;
				this.loading = true;
				this.$http
					.post("/admin/searchProduct", this.common.request(searchOptions))
					.then(
						response => {
							if (response.data.body.status.statusCode == 0) {
								this.loading = false;
								this.products = response.data.body.data.products;
								this.total = response.data.body.data.total;
								this.products.forEach(function(val, ind) {
									//商品类目
									if (val.productCateDTO) {
										val.productCateName = val.productCateDTO.cateName;
									}
									//供应商
									if (val.supplierDTO)
										val.supplierName = val.supplierDTO.supplierName;
									//商品品牌
									if (val.productBrandDTO) {
										val.productBrandName = val.productBrandDTO.name;
									}
									//多规格商品
									if (val.skuEnabled) {
										if (val.minUnitPoint && val.maxUnitPoint) {
											val.unitPrice = val.minUnitPoint + "-" + val.maxUnitPoint;
										}
									}
								});
								this.productData = this.products;
								this.getData();
							} else {
								this.loading = false;
								this.$Message.error(response.data.body.status.errorDesc);
							}
						},
						response => {
							this.$Message.error("失败，请稍后重试");
						}
					);
			},
			edit(row) {
				let keyArray = [];
				var searchOptions = {
					startIndex: this.startIndex,
					pageSize: this.pageSize,
					index: this.index
				};
				//判断是否有商品名称查询条件
				if (this.searchProductName) {
					keyArray.push("PRODUCT_NAME");
					searchOptions.productName = this.searchProductName;
				}
				//判断是否有商品品类查询条件
				if (this.productCateDTO.productCateUuid) {
					keyArray.push("PRODUCT_CATE");
					searchOptions.productCateUuid = this.productCateDTO.productCateUuid;
				}
				if (this.productCateDTO.title) {
					searchOptions.title = this.productCateDTO.title;
				}
				//判断是否有供应商查询条件
				if (this.selectedSupplierUuid) {
					keyArray.push("SUPPLIER");
					searchOptions.supplierUuid = this.selectedSupplierUuid;
				}
				//判断是否有上架查询条件
				if (this.onSale == '1') {
					keyArray.push("ON_SALE");
					searchOptions.onSale = this.onSale;
				}
				if (this.onSale == '2') {
					keyArray.push("ON_SALE");
					searchOptions.onSale = this.onSale;
				}
				//判断是否有新品查询条件
				if (this.newProduct) {
					keyArray.push("NEW");
					searchOptions.new = this.newProduct;
				}
				//判断是否有推荐查询条件
				if (this.recommend) {
					keyArray.push("RECOMMEND");
					searchOptions.recommend = this.recommend;
				}
				//判断是否有热卖查询条件
				if (this.hot) {
					keyArray.push("HOT");
					searchOptions.hot = this.hot;
				}
				searchOptions.keyArray = keyArray;
				this.$router.push({
					name: "productedit",
					query: {
						productUuid: row.productUuid,
						searchOptions: searchOptions
					}
				});
			},
			del(row) {
				this.productUuid = row.productUuid;
				this.delModel = true;
			},
			enable(row) {
				this.productUuid = row.productUuid;
				this.enableModel = true;
			},
			delcancel(row) {
				this.delModel = false;
			},
			delok(row) {
				this.changeProduct("DELETE");
				this.delModel = false;
			},
			enableok() {
				this.changeProduct("ENABLE");
				this.enableModel = false;
			},
			enablecancel() {
				this.enableModel = false;
			},
			disable(row) {
				this.productUuid = row.productUuid;
				this.disableModel = true;
			},
			disableok() {
				this.changeProduct("DISABLE");
				this.disableModel = false;
			},
			disablecancel() {
				this.disableModel = false;
			},
			inquirySupplier() {
				var options = {};
				this.$http
					.post("/admin/inquirySupplier", this.common.request(options))
					.then(
						response => {
							if (response.data.body.status.statusCode == 0) {
								this.suppliers = response.data.body.data.suppliers;
							} else {
								this.$Message.error(response.data.body.status.errorDesc);
							}
						},
						response => {
							this.$Message.error("失败，请稍后重试");
						}
					);
			},
			inquiryBrand() {
				var options = {};
				this.$http
					.post("/admin/inquiryBrand", this.common.request(options))
					.then(
						response => {
							if (response.data.body.status.statusCode == 0) {
								this.brands = response.data.body.data.brands;
							} else {
								this.$Message.error(response.data.body.status.errorDesc);
							}
						},
						response => {
							this.$Message.error("失败，请稍后重试");
						}
					);
			},
			//搜索订单商家
    inquiryMerchant(name) {
      var keyArray = [];
      var options = {
        startIndex: 0,
        pageSize: 20
      };
      if(name){
        keyArray.push('MERCHANTNAME');
        options.merchantName = name;
      }
      options.keyArray=keyArray;
      this.merchantLoading = true;
      this.$http
        .post("/admin/searchMerchant", this.common.request(options))
        .then(
          response => {
            this.merchantLoading = false;
            if (response.data.body.status.statusCode == 0) {
              var data = response.data.body.data;
              this.merchants = data.merchants;
            } else {
              this.$Message.error(response.data.body.status.errorDesc);
            }
          },
          response => {
            this.$Message.error("查询商家失败");
          }
        );
    },
		},
		created() {
			let searchOptions = this.$route.query.searchOptions;
			if (searchOptions) {
				if (searchOptions.pageSize) {
					this.startIndex = searchOptions.startIndex;
					this.pageSize = searchOptions.pageSize;
					this.searchProductName = searchOptions.productName;
					this.productCateDTO.productCateUuid = searchOptions.productCateUuid;
					this.selectedSupplierUuid = searchOptions.supplierUuid;
					this.selectedProductBrandUuid = searchOptions.supplierUuid;
					this.onSale = searchOptions.onSale;
					this.productCateDTO.title = searchOptions.title;
					this.newProduct = searchOptions.new;
					this.recommend = searchOptions.recommend;
					this.hot = searchOptions.hot;
					this.index = searchOptions.index;
					this.$nextTick(function() {
						this.$refs["productpage"].currentPage = searchOptions.index;
					});
				}
			}
			this.inquirySupplier();
			this.inquiryBrand();
			this.searchProduct();
		}
	};
</script>
