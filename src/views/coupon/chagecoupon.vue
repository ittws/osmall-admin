<style lang="less">
	@import "../../styles/common.less";
	.selct{
		width: 90%;
		height: 2.1875rem;
		line-height: 2.1875rem;
		border:0.5px solid #e8e8e8;
		border-radius: 3px;
		font-size: 15px;
		margin-top: 10px;
	}
	.gundong{
		float: left;
		width: 18rem;
		height: 37.5rem;
		overflow:auto;
	}
	.selctx{
		float: right;
		    width: 22px;
		    height: 22px;
		    font-size: 18px;
		    text-align: center;
		    line-height: 22px;
		    border-radius: 50%;
		    background-color: #cfc9c9;
		    color: #e62d2d;
		    margin: 5px;
			cursor: pointer;
	}
	.bot_x{
		position: absolute;
		top: -13px;
		right: -13px;
		width: 40px;
		height: 40px;
		background-color: #B3B3B3;
		color: #F3F3F3;
		font-size: 28px;
		text-align: center;
		line-height: 40px;
		border-radius: 50%;
		cursor: pointer;
	}
</style>

<template>
	<div>
		<Row class="margin-top-10">
			<Col span="24">
			<Card>
				<p slot="title">
					<Icon type="ios-person"></Icon>优惠卷列表
				</p>
				<Row>
					<div>
						<Input v-model="couponName" placeholder="优惠卷名称" type="text" style="width: 150px" clearable />
						<Input v-model="coupontype" placeholder="优惠卷类型" type="text" style="width: 150px" clearable />
						<Select v-model="onSale" style="width:120px" placeholder="是否上架" clearable>
							<Option v-for="item in onSales" :value="item.issale" :key="item.issale">{{ item.name }}</Option>
						</Select>
						<!-- <Select clearable remote filterable v-model="couponmerchant" :remote-method="merchanta" style="width:150px"
						 placeholder="选择商家查询" :loading="isloading">
							<Option v-for="item in merchantalist" :value="item.merchantUuid" :key="item.merchantUuid">{{ item.merchantName }}</Option>
						</Select> -->
						<Button type="success" @click="handleSearch">查询</Button>
						<Button class="f_r" icon="plus" type="primary" @click="add()">新增优惠卷</Button>
					</div>
				</Row>
				<Row class="margin-top-10">
					<Col span="24">
					<div>
						<Table :loading="loading" :columns="productColumn" :data="productData" border stripe ref="productTable"></Table>
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
		<Modal v-model="coumodel" width="450px" ref="rejectModelRef" :title="tltle">
			<Form :model="coupanlist" :label-width="100" ref="coupanlist">
				<FormItem label="所属类目:">
					<Select v-if="!isNewCouponCate" v-model="coupanlist.couponCategoryName" style="width:75%">
						<Option v-for="couponCate in couponCateList" 
						:value="couponCate.couponCategoryName">{{couponCate.couponCategoryName}}</Option>
					</Select>
					<a v-if="!isNewCouponCate" @click="isNewCouponCate = true">无合适类目</a>
					
					<Input  style="width:75%" placeholder="请输入消费券所属类目" v-if="isNewCouponCate" v-model="newCouponCate"></Input>
					<a v-if="isNewCouponCate" @click="isNewCouponCate = false">选择类目</a>
				</FormItem>
				<FormItem label="消费券名称:">
					<Input v-model="coupanlist.couponName"></Input>
				</FormItem>
				<FormItem label="消费券类型:">
					<Input v-model="coupanlist.type"></Input>
				</FormItem>
				<FormItem label="有效时间段:">
					<DatePicker style="width: 100%;" v-model="coupanlist.datalis" type="daterange" format="yyyy年MM月dd日" placement="bottom-end"
					 placeholder="选择营业时间段" clearable show-week-numbers></DatePicker>
				</FormItem>
				<FormItem label="消费券库存:" prop="totalCount">
					<InputNumber :min="1" v-model="coupanlist.totalCount"></InputNumber>
					&nbsp;&nbsp;&nbsp;
					金额:
					<Input style="width:40%" v-model="coupanlist.unitPoint"></Input>
				</FormItem>
				<FormItem label="是否上架:" prop="unitPoint">
					<i-switch size="large" v-model="coupanlist.isOnSale">
						<span slot="open">上架</span>
						<span slot="close">下架</span>
					</i-switch>
					&nbsp;&nbsp;&nbsp;
					<Button @click="merchantis()" type="success">选择适用商家</Button>
				</FormItem>
				<FormItem label="消费券描述:">
					<Input v-model="coupanlist.couponDesc"></Input>
				</FormItem>
				<FormItem label="消费卷封面" prop="name">
					<div class="upload-list" v-if="this.images.url">
						<template>
							<img :src="this.images.url" />
							<div class="upload-list-cover">
								<Icon type="ios-eye-outline" @click.native="handleView()"></Icon>
								<Icon type="ios-trash-outline" @click.native="handleRemove()"></Icon>
							</div>
						</template>
						<template>
							<Progress v-if="this.images.showProgress" :percent="this.images.percentage" hide-info></Progress>
						</template>
					</div>
					<Upload ref="upload" :format="['jpg','jpeg','png']" :show-upload-list="false" :on-success="handleSuccess"
					 :max-size="1024" :on-format-error="handleFormatError" :on-exceeded-size="handleMaxSize" type="drag" :action="actionName"
					 style="display: inline-block;width:58px;">
						<div style="width: 58px;height:58px;line-height: 58px;">
							<Icon type="camera" size="20"></Icon>
						</div>
					</Upload>
				</FormItem>
			</Form>
			<div v-if="iszzzz" @click="hind" style="z-index: 998;position: fixed;left: 0;top: 0;width: 100%;height: 100%;background: rgba(0, 0, 0, 0.4);">
			</div>
			<div v-if="isPreviewImage" style="z-index: 999;position: fixed;left: auto;top: 30%;">
				<img :src="images.url" />
			</div>
			<div v-if="ismerchant" style="padding: 20px;z-index: 999;position: fixed;left: 25%;top: 10%;background-color: #FFFFFF;">
				<div class="gundong">
					<p slot="title" style="color: red;font-size: 16px;padding-bottom: 5px;">
						<Icon type="ios-person"></Icon>已选商家列表
					</p>
					<div class="selct" v-for="(item,index) in merchantalis" :key="index">
						<span style="margin-left: 10px;color: #1b911d;">
							<Icon type="android-home"></Icon>{{item.merchantName}}
						</span>
						<span class="selctx" @click="delsplice(index)">x</span>
					</div>
				</div>
				<div style="float: left;">
					<p slot="title" style="color: red;font-size: 16px;padding-bottom: 5px;">
						<Icon type="plus-round"></Icon>双击行选择商家
						<div @click="mergb()" class="bot_x">X</div>
					</p>
					<Row>
						<Input v-model="searchMobileNo" placeholder="手机号码" style="width: 120px" />
						<Input v-model="searchMerchantName" placeholder="名称" style="width: 150px" />
						<Input v-model="searchMerchantAddress" placeholder="地址" style="width: 150px" />
						<Input v-model="searchReferrer" placeholder="推荐人账号" style="width: 120px" />
						<Button type="success" @click="inquiryMerchant('0','10')">查询</Button>
					</Row>
					<Row>
						<Col span="24">
						<div>
							<Table @on-row-dblclick="rowclick" :loading="loading1" :columns="conColumn" :data="merchantlist" border stripe
							 ref="productTable"></Table>
						</div>
						</Col>
					</Row>
					<Row class="margin-top-10">
						<Page ref="conpage" :total="total1" size="small" :pageSize="pageSize1" @on-change="changepagea" show-total
						 show-elevator></Page>
					</Row>
				</div>
			</div>
			<div slot="footer">
				<Button type="text" @click="cancel()">取消</Button>
				<Button type="primary" @click="coupandel()">提交</Button>
			</div>
		</Modal>
	</div>
</template>

<script>
	export default {
		components: {

		},
		data() {
			return {
				social: [],
				isloading:false,
				iszzzz: false,
				ismerchant: false,
				loading1: false,
				isPreviewImage: false,
				coumodel: false,
				merchantalis: [],
				merchantalist: [],
				onSale: '',
				tltle: '添加消费卷',
				coupontype: '',
				sortStep: '',
				actionName: this.$http.defaults.baseURL + "admin/uploadMediaFile",
				merchantCouponDTOList: [],
				couponName: '',
				couponmerchant: '',
				images: '',
				coupanlist: {},
				merchantlist: [],
				loading: false,
				issedit: false,
				productData: [],
				couponCateList: [],	//所属类目
				isNewCouponCate: false,
				newCouponCate:'',
				total: 0,
				total1: 0,
				pageSize: 20,
				startIndex: 0,
				pageSize1: 10,
				startIndex1: 0,
				onSales: [{
						issale: '1',
						name: "已上架"
					},
					{
						issale: '2',
						name: "未上架"
					},
				],
				searchMobileNo: '',
				searchMerchantName: '',
				searchMerchantAddress: '',
				searchReferrer: '',
				conColumn: [{
						title: '商家名称',
						align: 'center',
						key: 'merchantName',
						width: 130
					},
					{
						title: '地址',
						align: 'center',
						width: 280,
						key: 'merchantAddress',
					},
					{
						title: '联系人',
						align: 'center',
						key: 'contactName',
						width: 110
					},
					{
						title: '手机号码',
						align: 'center',
						key: 'mobileNo',
						width: 130
					},
				],
				productColumn: [{
						title: "logo",
						width: 160,
						render: (h, params) => {
							return h("img", {
								attrs: {
									src: params.row.imageUrl
								},
								style: {
									width: "130px",
									height: "55px",
									display: "inline-block",
									float: "left",
									margin: "5px 0"
								},
							}, );
						}
					},
					{
						title: "消费券名称",
						align: "center",
						key: "couponName",
						width: "150"
					},
					{
						title: "消费券类型",
						align: "center",
						key: "type",
						width: "100"
					},
					{
						title: "所属类目",
						align: "center",
						key: "category",
						width: "150"
					},
					{
						title: "销量",
						align: "center",
						key: "soldUnit",
						width: "100"
					},
					{
						title: "库存",
						align: "center",
						key: "totalCount",
						width: "100"
					},
					{
						title: "价格",
						align: "center",
						key: "unitPoint",
						width: "100"
					},
					// {
					// 	title: "商家名称",
					// 	align: "center",
					// 	width: "130",
					// 	render: (h, params) => {
					// 		return h('div', {
					
					// 		}, params.row.merchantCouponList[0].merchantDTO.merchantName)
					// 	}
					// },
					{
						title: '消费券状态',
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
						title: "描述",
						align: "center",
						key: "couponDesc",
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
													this.coupandel(params.row, '3');
												else
													this.coupandel(params.row, '2');
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
										title: '您确定要删除该优惠卷吗?',
										transfer: true
									},
									on: {
										'on-ok': () => {
											this.coupandel(params.row, '4');
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
				],
			}
		},
		methods: {
			add() {
				this.coupanlist = {};
				this.merchantalis = [];
				this.images = {};
				this.issedit = false;
				this.coumodel = true;
				this.tltle = '新增消费券';
				this.isNewCouponCate = false;
			},
			edit(e) {
				var that = this;
				that.coupanlist = {};
				that.merchantalis = [];
				that.issedit = true;
				that.images = {};
				that.coumodel = true;
				this.isNewCouponCate = false;
				that.tltle = '编辑消费券';
				 setTimeout(()=>{
				 debugger;
					that.coupanlist = e;
					that.coupanlist.datalis = [];
					that.coupanlist.datalis[0]=e.startDate;
					that.coupanlist.datalis[1]=e.endDate;
					that.coupanlist.isOnSale=e.onSale;
					that.coupanlist.couponCategoryName=e.category;
					let merchantalis = e.merchantCouponList;
					merchantalis.forEach((team, index) => {
						that.merchantalis.push(team.merchantDTO)
					});
					this.images.url = e.imageUrl;
				 },500);
			},
			cancel() {
				this.coumodel = false;
			},
			addcuo() {

			},
			rowclick(row) {
				let merid = true;
				let merchantalis = this.merchantalis;
				merchantalis.forEach((team, index) => {
					if (row.merchantUuid == team.merchantUuid) {
						merid = false
					}
				});
				if (merid) {
					this.merchantalis.push(row)
				}

			},
			delsplice(index) {
				this.merchantalis.splice(index, 1)
			},
			handleView() {
				this.isPreviewImage = true;
				this.iszzzz = true;
			},
			handleRemove(){
				this.images = {};
			},
			hind() {
				this.isPreviewImage = false;
				this.iszzzz = false;
				this.ismerchant = false;
			},
			merchantis() {
				this.iszzzz = true;
				this.ismerchant = true;
			},
			mergb() {
				this.iszzzz = false;
				this.ismerchant = false;
			},
			handleSuccess(res, file) {
				file.url = res.data[0];
				this.images = file;
			},
			handleMaxSize(file) {
				this.$Notice.warning({
					title: "文件过大",
					desc: "文件大小不能超过1M."
				});
			},
			handleFormatError(file) {
				this.$Notice.warning({
					title: "文件格式错误",
					desc: "上传文件格式错误, 请选择jpg, jpeg 或 png的图片."
				});
			},
			getData() {
				this.inquirycoupon(this.startIndex, this.pageSize);
			},
			handleSearch() {
				this.inquirycoupon(this.startIndex, this.pageSize);
				this.resetpage();
			},
			resetpage() {
				this.$nextTick(function() {
					this.$refs['productpage'].currentPage = 1;
				})
			},
			changepage(index) {
				this.startIndex = (index - 1) * this.pageSize;
				this.inquirycoupon(this.startIndex, this.pageSize);
			},
			changepagea(index) {
				this.startIndex1 = (index - 1) * this.pageSize1;
				this.inquiryMerchant(this.startIndex1, this.pageSize1);
			},
			//查询优惠券类目
			inquiryCouponCate() {
				this.$http.post("/admin/inquiryCategory", this.common.request({}))
					.then(response => {
						this.isloading = false;
						if (response.data.body.status.statusCode == 0) {
							var data = response.data.body.data;
							this.couponCateList = data.couponCategoryDTOList;
						} else {
							
						}
					}, response => {
						
					})

			},
			//按搜索词查询商家
			merchanta(query) {
				if (!query) {
					return;
				}
				this.isloading = true;
				let searchOptions = {
					merchantName: query
				};
				let keyArray = [];
				keyArray.push('MERCHANTNAME');
				searchOptions.keyArray = keyArray;
				this.$http.post("/admin/searchMerchant", this.common.request(searchOptions))
					.then(response => {
						this.isloading = false;
						if (response.data.body.status.statusCode == 0) {
							var data = response.data.body.data;
							this.merchantalist = data.merchants;
						} else {
							this.$Message.error(response.data.body.status.errorDesc);
						}
					}, response => {
						this.isloading = false;
						this.$Message.error(response.data.body.status.errorDesc);
					})

			},
			//分页查询商家
			inquiryMerchant(startIndex, pageSize) {
				this.loading1 = true;
				let searchOptions = {
					startIndex: startIndex,
					pageSize: pageSize,
				};
				let keyArray = [];
				//判断是否有手机号码查询条件
				if (this.searchMobileNo) {
					keyArray.push('MOBILENO');
					searchOptions.mobileNo = this.searchMobileNo;
				}
				//判断是否有姓名查询条件
				if (this.searchMerchantName) {
					keyArray.push('MERCHANTNAME');
					searchOptions.merchantName = this.searchMerchantName;
				}
				//判断是否有地址查询条件
				if (this.searchMerchantAddress) {
					keyArray.push('MERCHANTADDRESS');
					searchOptions.merchantAddress = this.searchMerchantAddress;
				}
				//判断是否有推荐人查询条件
				if (this.searchReferrer) {
					keyArray.push('REFERRER');
					searchOptions.referrer = this.searchReferrer;
				}
				searchOptions.keyArray = keyArray;
				this.$http.post("/admin/searchMerchant", this.common.request(searchOptions))
					.then(response => {
						this.loading1 = false;
						if (response.data.body.status.statusCode == 0) {
							var data = response.data.body.data;
							this.merchantlist = data.merchants;
							this.total1 = data.total;
						} else {
							this.loading1 = false;
							this.$Message.error(response.data.body.status.errorDesc);
						}
					}, response => {
						this.$Message.error(response.data.body.status.errorDesc);
						this.loading1 = false;
					})
			},
			//增删改
			coupandel(row, isodd) {
				var searchOptions = {};
				var actionType = '';
				var couponUuid = '';
				if (isodd) {
					if (isodd == "2") {
						searchOptions = {
							actionType: 'ENABLE',
							couponUuid: row.couponUuid
						}
					} else if (isodd == "3") {
						searchOptions = {
							actionType: 'DISABLE',
							couponUuid: row.couponUuid
						}
					} else if (isodd == "4") {
						searchOptions = {
							actionType: 'DELETE',
							couponUuid: row.couponUuid
						}
					}
				} else {
					var coupanlist = this.coupanlist;
					if(this.isNewCouponCate && !this.newCouponCate){
						this.$Message.error('所属类目必填');
						return;
					}else if (!this.isNewCouponCate && !coupanlist.couponCategoryName) {
						this.$Message.error('所属类目必填');
						return;
					}
					if (!coupanlist.couponName) {
						this.$Message.error('消费券名称必填');
						return;
					}
					if (!coupanlist.type) {
						this.$Message.error('请输入消费券类型');
						return;
					}
					if (!coupanlist.datalis) {
						this.$Message.error('请选择营业时间段');
						return;
					}
					if (!coupanlist.unitPoint) {
						this.$Message.error('请输入消费券兑换所需购币');
						return;
					}
					if (!this.merchantalis.length > 0) {
						this.$Message.error('您未选择任何适用商家');
						return;
					}
					let merchantalis = [];
					let row = this.merchantalis;
					row.forEach((teaa, inx) => {
						let merchant = {
							merchantDTO:{
								"merchantUuid":teaa.merchantUuid
							}
						}
						merchantalis.push(merchant)
					})
					var unitPoint = Number(coupanlist.unitPoint);
					if (this.issedit) {
						searchOptions = {
							actionType: 'MODIFY',
							couponUuid: coupanlist.couponUuid,
							couponName: coupanlist.couponName,
							category: coupanlist.couponCategoryName,
							type: coupanlist.type,
							startDate: coupanlist.datalis[0],
							endDate: coupanlist.datalis[1],
							totalCount: coupanlist.totalCount,
							onSale: coupanlist.isOnSale,
							couponDesc: coupanlist.couponDesc,
							unitPoint: unitPoint,
							imageUrl: this.images.url,
						}
						if(this.isNewCouponCate){
							searchOptions.category = this.newCouponCate;
						}
					} else {
						searchOptions = {
							actionType: 'ADD',
							couponName: coupanlist.couponName,
							category: coupanlist.couponCategoryName,
							type: coupanlist.type,
							startDate: coupanlist.datalis[0],
							endDate: coupanlist.datalis[1],
							totalCount: coupanlist.totalCount,
							onSale: coupanlist.isOnSale,
							couponDesc: coupanlist.couponDesc,
							unitPoint: unitPoint,
							imageUrl: this.images.url,
						}
						if(this.isNewCouponCate){
							searchOptions.category = this.newCouponCate;
						}
					}
					searchOptions.merchantCouponList = merchantalis;
				}
				this.$http.post("/admin/changeCoupon", this.common.request(searchOptions))
					.then(response => {
						this.loading = false;
						if (response.data.body.status.statusCode == 0) {
							this.$Notice.success({
								title: '操作请求已成功',
								duration: 2
							});
							this.coumodel = false;
							this.inquirycoupon(this.startIndex,this.pageSize);
							this.inquiryCouponCate();
						} else {
							this.loading = false;
							this.$Message.error(response.data.body.status.errorDesc);
						}
					}, response => {
						this.$Message.error(response.data.body.status.errorDesc);
						this.loading = false;
					})
			},
			inquirycoupon(startIndex, pageSize) {
				this.loading = true;
				let keyArray = [];
				let searchOptions = {
					startIndex: startIndex,
					pageSize: pageSize,
				};
				if (this.couponName) {
					keyArray.push('COUPON_NAME');
					searchOptions.couponName = this.couponName;
				}
				if (this.coupontype) {
					keyArray.push('TYPE');
					searchOptions.type = this.coupontype;
				}
				if (this.onSale) {
					keyArray.push('ON_SALE');
					if (this.onSale == '1') {
						searchOptions.onSale = true;
					} else{
						searchOptions.onSale = false;
					}
					
				}
				searchOptions.keyArray = keyArray;
				this.$http.post("/admin/searchCoupon", this.common.request(searchOptions))
					.then(response => {
						this.loading = false;
						if (response.data.body.status.statusCode == 0) {
							var data = response.data.body.data;
							this.productData = data.couponList;
							this.total = data.total;
						} else {
							this.loading = false;
							this.$Message.error(response.data.body.status.errorDesc);
						}
					}, response => {
						this.$Message.error(response.data.body.status.errorDesc);
						this.loading = false;
					})
			},
		},
		created() {
			this.getData();
			this.inquiryMerchant('0','10');
			this.inquiryCouponCate();
		}
	};
</script>
