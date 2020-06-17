<style lang="less">
	@import '../../styles/common.less';
</style>

<template>
	<div>
		<Row class="margin-top-10">
			<Col span="24">
			<Card>
				<p slot="title">
					核销记录
				</p>
				<Row>
					<RadioGroup v-model="dateSearchType" @on-change="xuanze1">
						<Radio label="1">今日</Radio>
						<Radio label="2">昨日</Radio>
						<Radio label="3">最近七日</Radio>
						<Radio label="4" disabled>自定义时间段</Radio>
						<DatePicker v-model="customsj" @click.native="xuanze" type="daterange" placement="bottom-end" placeholder="订单日期"
						 style="width: 200px"></DatePicker>
						<Input v-model="type" placeholder="消费券类型" style="width: 120px" />
						<Input v-model="phone" placeholder="会员手机号" style="width: 120px" />
						<Select clearable remote filterable v-model="couponmerchant" :remote-method="merchanta" style="width:150px"
						 placeholder="选择商家查询" :loading="isloading">
							<Option v-for="item in merchantalist" :value="item.mobileNo" :key="item.mobileNo">{{ item.merchantName }}</Option>
						</Select>
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
						title: "消费券名称",
						align: "center",
						width: "150",
						key:'couponName',
						render: (h, params) => {
							return h('div', {
						
							}, params.row.userCouponDTO.couponName)
						},
					},{
						title: "消费券类型",
						align: "center",
						width: "150",
						render: (h, params) => {
							return h('div', {

							}, params.row.userCouponDTO.type)
						}
					},
					{
						title: "核销时间",
						align: "center",
						width: "150",
						render: (h, params) => {
							return h('div', {

							}, params.row.couponWriteOffTime)
						}
					},
					{
						title: "会员手机号",
						align: "center",
						width: "130",
						render: (h, params) => {
							return h('div', {
					
							}, params.row.userCouponDTO.userDTO.personalPhone)
						}
					},
					{
						title: "商家名称",
						align: "center",
						width: "180",
						render: (h, params) => {
							return h('div', {
					
							}, params.row.merchantDTO.merchantName)
						}
					},
					{
						title: "商家地址",
						align: "center",
						width: "300",
						render: (h, params) => {
							return h('div', {
					
							}, params.row.merchantDTO.merchantAddress)
						}
					},
					{
						title: "描述",
						align: "center",
						render: (h, params) => {
							return h('div', {
						
							}, params.row.userCouponDTO.couponDesc)
						}
					},
				],
				writedata: [],
				total: 0,
				startIndex: 0,
				pageSize: 20,
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
				if (this.dateSearchType) {
					let dateType = this.dateSearchType;
					let startDate = null;
					let endDate = null;
					let currentDate = new Date();
					if (dateType == '1') {
						startDate = currentDate;
						endDate = currentDate;
					} else if (dateType == '2') {
						currentDate.setDate(currentDate.getDate() - 1);
						startDate = currentDate;
						endDate = currentDate;
					} else if (dateType == '3') {
						let tDate = new Date();
						tDate.setDate(currentDate.getDate() - 7);
						startDate = tDate;
						endDate = currentDate;
					} else if (dateType == '4') {
						let t = this.customsj;
						let startDateT = t[0];
						let endDateT = t[1];
						startDate = startDateT;
						endDate = endDateT;
					}
					keyArray.push('DATE');
					searchOptions.writeOffDateStart = startDate;
					searchOptions.writeOffDateEnd = endDate;
				}
				if (this.type) {
					keyArray.push('TYPE');
					searchOptions.type = this.type;
				}
				if (this.couponmerchant) {
					keyArray.push('MERCHANTPHONE');
					searchOptions.merchantPhone = this.couponmerchant;
				}
				if (this.phone) {
					keyArray.push('PHONE');
					searchOptions.phone = this.phone;
				}
				searchOptions.keyArray = keyArray;
				this.$http.post("/admin/searchCouponWriteOff", this.common.request(searchOptions))
					.then(response => {
						this.loading = false;
						if (response.data.body.status.statusCode == 0) {
							var data = response.data.body.data;
							this.writedata = data.couponWriteOffList;
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
