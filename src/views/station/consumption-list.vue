<style lang="less">
	@import "../../styles/common.less";
</style>

<template>
	<div>
		<Row class="margin-top-10">
			<Col span="24">
			<Card>
				<p slot="title">消费明细</p>
				<Row>
					<RadioGroup v-model="dateSearchType">
						<Radio label="1">今日</Radio>
						<Radio label="2">昨日</Radio>
						<Radio label="3">最近七日</Radio>
						<Radio label="4" disabled>自定义时间段</Radio>
						<DatePicker v-model="searchDate" @click.native="dateSearchType=4" type="daterange" placement="bottom-end"
						 placeholder="消费日期" style="width: 200px"></DatePicker>
					</RadioGroup>
					<Input v-model="searchMerchantMobileNo" placeholder="商家手机电话" style="width: 150px" clearable />
					<Input v-model="searchPersonalPhone" placeholder="会员手机号码" style="width: 150px" clearable />
					<Button type="success" @click="searchData()">查询</Button>
					<div class="f_r">
						<Button icon="document-text" type="warning" @click="exportAssign()" :loading="exportLoading">导出</Button>
					</div>
				</Row>
				<Row class="margin-top-10">
					<Col span="24">
					<div>
						<Table class="table" :columns="assignColumn" :data="assignData" :loading="loading" border stripe></Table>
					</div>
					</Col>
				</Row>
				<Row class="margin-top-10">
					<Col span="12">
					<Page ref="assignpage" :total="total" size="small" :pageSize="pageSize" @on-change="changepage" show-total
					 show-elevator></Page>
					</Col>
				</Row>
			</Card>
			</Col>
		</Row>
		<Table ref="exportTable" style="display:none"></Table>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				searchPersonalPhone: "",
				searchMerchantMobileNo: "",
				searchDate: [],
				dateSearchType: "3",
				loading: false,
				exportLoading: false,
				assignColumn: [],
				assignData: [],
				total: 0,
				totalAmount: 0.0,
				totalPoint: 0,
				pageSize: 20
			};
		},
		methods: {
			getData() {
				this.assignColumn = [{
						title: "消费日期",
						align: "center",
						key: "orderTime",
						width: 180
					},
					{
						title: "商家名称",
						align: "center",
						width: 220,
						key: 'merchantName',
						render: (h, params) => {
							let userName = params.row.merchantDTO.merchantName;
							return h("span", {}, userName);
						}
					},
					{
						title: "商家联系电话",
						align: "center",
						width: 150,
						key: 'merchantMobileNo',
						render: (h, params) => {
							let userName = params.row.merchantDTO.mobileNo;
							return h("span", {}, userName);
						}
					},
					{
						title: "会员姓名",
						align: "center",
						width: 130,
						key: 'userName',
						render: (h, params) => {
							if (params.row.userDTO) {
								let userName = params.row.userDTO.name;
								return h("span", {}, userName);
							}
						}
					},
					{
						title: "会员手机号码",
						align: "center",
						width: 150,
						key: 'userPersonalPhone',
						render: (h, params) => {
							if (params.row.userDTO) {
								let personalPhone = params.row.userDTO.personalPhone;
								return h("span", {}, personalPhone);
							}
						}
					},
					{
						title: "消费金额",
						align: "center",
						key: "productAmount",
						width: 100
					},
					{
						title: "商家分账",
						align: "center",
						key: "asinfoMerchant",
						width: 100
					},
					{
						title: "平台分账",
						align: "center",
						key: "asinfoPlatform",
						width: 100
					},
				];
			},
			initData() {
				this.searchMerchantAssign(0, this.pageSize, false);
			},
			searchData() {
				this.searchMerchantAssign(0, this.pageSize, false);
				this.resetpage();
			},
			exportAssign() {
				this.exportLoading = true;
				this.searchMerchantAssign(0, this.total, true);
			},
			searchMerchantAssign(startIndex, pageSize, isExport) {
				let searchOptions = {
					startIndex: startIndex,
					pageSize: pageSize
				};
				let keyArray = [];
				//判断是否有手机号码查询条件
				if (this.searchPersonalPhone) {
					keyArray.push("PHONE");
					searchOptions.phone = this.searchPersonalPhone;
				}
				//判断是否有商家联系电话查询条件
				if (this.searchMerchantMobileNo) {
					keyArray.push("MOBIENO");
					searchOptions.mobileNo = this.searchMerchantMobileNo;
				}
				//选择日期
				if (this.dateSearchType) {
					let dateType = this.dateSearchType;
					let startDate = null;
					let endDate = null;
					let currentDate = new Date();
					if (dateType == "1") {
						startDate = currentDate;
						endDate = currentDate;
					} else if (dateType == "2") {
						currentDate.setDate(currentDate.getDate() - 1);
						startDate = currentDate;
						endDate = currentDate;
					} else if (dateType == "3") {
						let tDate = new Date();
						tDate.setDate(currentDate.getDate() - 7);
						startDate = tDate;
						endDate = currentDate;
					} else if (dateType == "4") {
						let t = this.searchDate;
						let startDateT = t[0];
						let endDateT = t[1];
						startDate = startDateT;
						endDate = endDateT;
					}
					keyArray.push("DATE");
					searchOptions.orderDateStart = startDate;
					searchOptions.orderDateEnd = endDate;
				}
				searchOptions.keyArray = keyArray;
				if (!isExport) {
					this.loading = true;
				}
				this.$http
					.post("/admin/searchPayOrder", this.common.request(searchOptions))
					.then(
						response => {
							if (response.data.body.status.statusCode == 0) {
								this.loading = false;
								var data = response.data.body.data;
								if (!isExport) {
									this.assignData = data.payOrderList;
									this.total = data.total;
								} else {
									var assignList = data.assignList;
									assignList.forEach((val, index) => {
										val.userName = val.userDTO.name;
										val.userPersonalPhone = val.userDTO.personalPhone;
										val.merchantName = val.merchantDTO.merchantName;
										val.merchantMobileNo = val.merchantDTO.mobileNo;
									});
									this.$refs.exportTable.exportCsv({
										filename: '划拨明细',
										columns: this.assignColumn,
										data: assignList,
									});
									this.exportLoading = false;
								}
							} else {
								this.$Message.error(response.data.body.status.errorDesc);
							}
						},
						response => {
							this.loading = false;
							this.$Message.error(response.data.body.status.errorDesc);
						}
					);
			},
			//将分页页码重置成1
			resetpage() {
				this.$nextTick(function() {
					this.$refs["assignpage"].currentPage = 1;
				});
			},
			//处理分页页数改变, 重新查询该页数据
			changepage(index) {
				var startIndex = (index - 1) * this.pageSize;
				this.searchMerchantAssign(startIndex, this.pageSize, false);
			}
		},
		mounted() {
			this.getData();
			this.initData();
		}
	};
</script>
