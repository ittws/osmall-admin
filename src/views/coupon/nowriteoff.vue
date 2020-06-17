<style lang="less">
	@import '../../styles/common.less';
</style>

<template>
	<div>
		<Row class="margin-top-10">
			<Col span="24">
			<Card>
				<p slot="title">
					未核销记录
				</p>
				<Row>
					<RadioGroup v-model="dateSearchType" @on-change="xuanze1">
						<!-- <Radio label="1">今日</Radio>
						<Radio label="2">昨日</Radio>
						<Radio label="3">最近七日</Radio>
						<Radio label="4" disabled>自定义时间段</Radio>
						<DatePicker v-model="customsj" @click.native="xuanze" type="daterange" placement="bottom-end" placeholder="订单日期"
						 style="width: 200px"></DatePicker> -->
						 <Input v-model="couponName" placeholder="消费券名称" style="width: 120px" />
						<Input v-model="type" placeholder="消费券类型" style="width: 120px" />
						<Input v-model="phone" placeholder="会员手机号" style="width: 120px" />
						<!-- <Select clearable remote filterable v-model="couponmerchant" :remote-method="merchanta" style="width:150px"
						 placeholder="选择商家查询" :loading="isloading">
							<Option v-for="item in merchantalist" :value="item.mobileNo" :key="item.mobileNo">{{ item.merchantName }}</Option>
						</Select> -->
						<Button type="success" @click="searchData()">查询</Button>
					</RadioGroup>
				</Row>
				<Row class="margin-top-10">
					<Col span="24">
					<div>
						<Table :columns="orderColumn" :loading="loading" :data="writedata" border stripe ref="orderTable"></Table>
					</div>
					</Col>
				</Row>
				<Row class="margin-top-10">
					<Col span="18">
					<Page ref="orderpage" :total="total" size="small" :pageSize="pageSize" @on-change="changepage" show-total
					 show-elevator>
					</Page>
					</Col>
				</Row>
			</Card>
			</Col>
		</Row>
		<Table ref="deliveryTable" style="display:none"></Table>
	</div>
</template>

<script>
	import table2excel from '@/libs/table2excel.js';
	export default {
		components: {

		},
		data() {
			return {
				orderNo: '',
				type: '',
				dateSearchType: '3',
				couponmerchant: '',
				phone: '',
				isloading:false,
				merchantalist: [],
				customsj: [],
				loading: true,
				orderColumn: [
						{
							title: "logo",
							width: 160,
							render: (h, params) => {
								return h("img", {
									attrs: {
										src: params.row.couponImageUrl
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
							title: "消费券类型",
							align: "center",
							width: "150",
							key:'type',
						},
					{
							title: "消费券名称",
							align: "center",
							width: "150",
							key:'couponName',
						},
						{
							title: "数量",
							align: "center",
							width: "150",
							key:'sum'
						},
					{
						title: "过期时间",
						align: "center",
						width: "150",
						key:'endDate'
					},
					{
						title: "会员手机号",
						align: "center",
						width: "130",
						key:'userPhone'
					},
					{
						title: "会员姓名",
						align: "center",
						width: "180",
						key:'userName'
					},
					{
						title: "描述",
						align: "center",
						key:'couponDesc'
					},
				],
				writedata: [],
				total: 0,
				startIndex: 0,
				pageSize: 20,
				couponName:'',
			}
		},
		methods: {
			xuanze1() {
				this.customsj = []
			},
			xuanze() {
				this.dateSearchType = "4";
			},
			getData() {
				this.inquiryMember(this.startIndex, this.pageSize);
			},
			searchData() {
				this.inquiryMember(0, this.pageSize);
				this.resetpage();
			},
			resetpage() {
				this.$nextTick(function() {
					this.$refs['orderpage'].currentPage = 1;
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
						if (response.data.body.status.statusCode == 0) {
							var data = response.data.body.data;
							this.merchantalist = data.merchants;
						} else {
							this.$Message.error(response.data.body.status.errorDesc);
						}
						this.isloading = false;
					}, response => {
						this.isloading =false;
						this.$Message.error(response.data.body.status.errorDesc);
					})

			},
			inquiryMember(startIndex, pageSize) {
				this.loading = true;
				let searchOptions = {
					startIndex: startIndex,
					pageSize: pageSize,
				};
				let keyArray = [];
				if (this.couponName) {
					keyArray.push('COUPONNAME');
					searchOptions.couponName = this.couponName;
				}
				if (this.type) {
					keyArray.push('TYPE');
					searchOptions.type = this.type;
				}
				if (this.phone) {
					keyArray.push('PHONE');
					searchOptions.phone = this.phone;
				}
				searchOptions.keyArray = keyArray;
				this.$http.post("/admin/searchCouponNotWriteOff", this.common.request(searchOptions))
					.then(response => {
						this.loading = false;
						if (response.data.body.status.statusCode == 0) {
							var data = response.data.body.data;
							this.writedata = data.userCouponList;
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
			//处理分页-页数改变
			changepage(index) {
				this.startIndex = (index - 1) * this.pageSize;
				this.inquiryMember(this.startIndex, this.pageSize);
			},
		},
		created() {
			this.getData();
		}
	};
</script>
