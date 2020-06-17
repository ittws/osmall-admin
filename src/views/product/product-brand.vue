<style lang="less">
	@import "../../styles/common.less";
</style>

<template>
	<div>
		<Row class="margin-top-10">
			<Col span="24">
			<Card>
				<p slot="title">
					品牌列表
				</p>
				<Row>
					<div>
						<Input v-model="searchBrandName" placeholder="品牌名称" type="text" style="width: 150px" clearable />
						<Button type="success" @click="handleSearch">查询</Button>
						<Button class="f_r" icon="plus" type="primary" @click="add()">添加品牌</Button>
					</div>
				</Row>

				<Row class="margin-top-10">
					<Col span="24">
					<div>
						<Table :loading="loading" :columns="brandColumn" :data="brandData" border stripe ref="brandTable"></Table>
					</div>
					</Col>
				</Row>
				<Row class="margin-top-10">
					<Page ref="brandpage" :total="total" size="small" :pageSize="pageSize" @on-change="changepage" show-total
					 show-elevator></Page>
				</Row>
			</Card>
			</Col>
		</Row>
		<div>
			<Modal v-model="addModel" title="添加品牌">
		      <Form :model="addRow" :label-width="120" :rules="rules" ref="addRow">
		        <FormItem label="品牌名称" prop="name">
		          <Input v-model="addRow.name" style="width:250px"></Input>
		        </FormItem>
		        <FormItem label="品牌LOGO" prop="logoUrl" class="ivu-form-item-required">
		          <div class="upload-list" v-if="logoUrl">
		              <img :src="logoUrl" />
		              <div class="upload-list-cover">
		                <Icon type="ios-eye-outline" @click.native="handleView(logoUrl)"></Icon>
		                <Icon type="ios-trash-outline" @click.native="handleRemove(logoUrl)"></Icon>
		              </div>
		          </div>
		          <Upload
		            ref="upload"
		            :show-upload-list="false"
		            :default-file-list="defaultList"
		            :on-success="handleSuccess"
		            :format="uploadImageFormat"
		            :max-size="uploadImageMaxSize"
		            :on-format-error="handleFormatError"
		            :on-exceeded-size="handleMaxSize"
		            :before-upload="handleBeforeUpload"
		            type="drag"
		            :action="actionName"
		            style="display: inline-block;width:58px;"
		          >
		            <div style="width: 58px;height:58px;line-height: 58px;">
		              <Icon type="camera" size="20"></Icon>
		            </div>
		          </Upload>
		          <div style="color:red">(建议上传封面图标分辨率150X150)</div>
		        </FormItem>
		         <FormItem label="排序" prop="sortNumber" class="ivu-form-item-required">
		          <InputNumber :min="sortMin" :step="sortStep" v-model="addRow.sortNumber"></InputNumber>
		        </FormItem>
		      </Form>
		      <div slot="footer">
		        <Button type="text" @click="addcancel">取消</Button>
		        <Button type="primary" :loading="addLoading" @click.native="addok('addRow')">确定</Button>
		      </div>
		    </Modal>
		    <Modal v-model="editModel" title="编辑品牌">
		      <Form :model="editRow" :label-width="120" ref="editRow">
		        <FormItem label="品牌名称" class="ivu-form-item-required">
		          <Input v-model="editRow.name" style="width:250px"></Input>
		        </FormItem>
		        <FormItem label="品牌LOGO" class="ivu-form-item-required">
		          <div class="upload-list" v-if="logoUrl">
		              <img :src="logoUrl" />
		              <div class="upload-list-cover">
		                <Icon type="ios-eye-outline" @click.native="handleView(logoUrl)"></Icon>
		                <Icon type="ios-trash-outline" @click.native="handleRemove(logoUrl)"></Icon>
		              </div>
		          </div>
		          <Upload
		            ref="upload"
		            :show-upload-list="false"
		            :default-file-list="defaultList"
		            :on-success="handleSuccess"
		            :format="uploadImageFormat"
		            :max-size="uploadImageMaxSize"
		            :on-format-error="handleFormatError"
		            :on-exceeded-size="handleMaxSize"
		            :before-upload="handleBeforeUpload"
		            type="drag"
		            :action="actionName"
		            style="display: inline-block;width:58px;"
		          >
		            <div style="width: 58px;height:58px;line-height: 58px;">
		              <Icon type="camera" size="20"></Icon>
		            </div>
		          </Upload>
		          <div style="color:red">(建议上传封面图标分辨率150X150)</div>
		        </FormItem>
		         <FormItem label="排序" prop="sortNumber" class="ivu-form-item-required">
		          <InputNumber :min="sortMin" :step="sortStep" v-model="editRow.sortNumber"></InputNumber>
		        </FormItem>
		      </Form>
		      <div slot="footer">
		        <Button type="text" @click="editcancel">取消</Button>
		        <Button type="primary" :loading="editLoading" @click.native="editok('editRow')">确定</Button>
		      </div>
		    </Modal>
			<Modal v-model="delModel" ref="delModel" title="品牌删除">
				你确认要删除该品牌吗 ,删除之后关联的商品也将清除品牌信息?
				<div slot="footer">
					<Button type="text" @click="delcancel">取消</Button>
					<Button type="primary" @click="delok()">确定</Button>
				</div>
			</Modal>
			<Modal title="图片预览" v-model="isPreviewImage">
				<img :src="previewImageUrl" v-if="isPreviewImage" style="width: 100%" />
				<div slot="footer">
					<Button type="default" @click="isPreviewImage = false">关闭</Button>
				</div>
			</Modal>
		</div>
	</div>
</template>

<script>
	import table2excel from "@/libs/table2excel.js";
	export default {
		components: {
			
		},
		data() {
			return {
				loading: false,
				addLoading:false,
				editLoading:false,
				editModel: false,
				addModel: false,
				delModel: false,
				editRow: {},
				addRow: {},
				delRow: {},
				brandColumn: [],
				brandData: [],
				brands: [],
				searchBrandName: "",
				total: 0,
				pageSize: 20,
				startIndex: 0,
				logoUrl:'',
				isPreviewImage: false, //预览照片模态框
				previewImageUrl: '', //预览照片地址
				uploadList: [], //上传图片列表
		      	fileList: [], //品牌LOGO列表
		      	defaultList: [
		        	//品牌LOGO列表
		      	],
		      	actionName: this.$http.defaults.baseURL + "admin/uploadMediaFile", //上传图片action
		      	uploadImageMaxSize: 10240, //最大上传图片大小10M
		      	uploadImageFormat: ["jpg", "jpeg", "png"], //上传图片格式
		      	sortStep: 1,
      			sortMin: 1,
      			rules: {
			        name: [
			          { required: true, message: "品牌名称必填", trigger: "blur" },
			          {
			            type: "string",
			            max: 45,
			            message: "品牌名称不得大于45字符",
			            trigger: "blur"
			          }
			        ]
			      },
			};
		},
		methods: {
			handleView(url) {
		      this.previewImageUrl = url;
		      this.isPreviewImage = true;
		    },
		    handleRemove(file) {
		      this.logoUrl = '';
		    },
		    handleSuccess(res, file) {
		      file.url = res.data[0];
		      this.logoUrl = file.url;
		    },
		    handleFormatError(file) {
		      this.$Notice.warning({
		        title: "文件格式错误",
		        desc: "上传文件格式错误, 请选择jpg, jpeg 或 png的图片."
		      });
		    },
		    handleMaxSize(file) {
		      this.$Notice.warning({
		        title: "文件过大",
		        desc: "文件大小不能超过10M."
		      });
		    },
		    handleBeforeUpload() {
		      
		    },
			//预览照片
			previewBrandImage(url) {
				this.showPreviewImage = true;
				this.previewImageUrl = url;
			},
			getData() {
				this.brandColumn = [
					{
						title: "品牌LOGO",
						key: "logoUrl",
						width: "300px",
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
											src: params.row.logoUrl
										},
										style: {
											width: "90px",
											height: "76px",
											margin: "5px 0"
										},
										on: {
											click: () => {
												this.previewBrandImage(params.row.logoUrl)
											}
										}
									})
								]
							);
						}
					},
					{
						title: "品牌名称",
						align: "center",
						key: "name"
					},
					{
						title: "排序",
						align: "center",
						key: "sortNumber",
						width: 150,
					},
					{
						title: "操作",
						align: "center",
						width: 180,
						render: (h, params) => {
							return h("span", {}, [
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
								h(
									"Button", {
										props: {
											type: "error",
											row: params.row,
											size: "small"
										},
										style: {
											marginRight: "8px"
										},
										on: {
											click: () => {
												this.del(params.row);
											}
										}
									},
									"删除"
								)
							]);
						}
					}
				];
			},
			resetPage() {
				this.startIndex = 0;
				this.total = 0;
				this.brandData = [];
				//重新设置成显示第一页
				this.$nextTick(function() {
					this.$refs["brandpage"].currentPage = 1;
				});
			},
			//处理分页-页数改变
			changepage(index) {
				this.startIndex = (index - 1) * this.pageSize;
				this.index = index;
				this.searchBrand();
			},
			add() {
				this.addModel = true;
				this.logoUrl = '';
			},
			addok(name) {
			 if (this.addRow.name == null || this.addRow.name == '') {
		          this.$Message.error("请输入品牌名称");
		          return;
		    }
		    if (this.logoUrl == null || this.logoUrl == '') {
		          this.$Message.error("请上传品牌LOGO");
		          return;
		    }
			if (this.addRow.sortNumber == null||this.addRow.sortNumber <=0||this.addRow.sortNumber==undefined) {
		          this.$Message.error("请输入正确排序");
		          return;
		      }
	          var options = {
	            actionType: "ADD",
	            sortNumber: this.addRow.sortNumber,
	            name: this.addRow.name,
	            logoUrl: this.logoUrl
	          };
	          this.addLoading = true;
	          this.$http
	            .post("/admin/changeProductBrand", this.common.request(options))
	            .then(
	              response => {
	              	this.addLoading = false;
	                if (response.data.body.status.statusCode == 0) {
	                  var data = response.data.body.data;
	                  this.addModel = false;
	                  this.$Notice.success({
	                    title: "成功",
	                    desc: "品牌已添加",
	                    duration: 2
	                  });
	                  this.searchBrand();
	                } else {
	                  this.$Message.error(response.data.body.status.errorDesc);
	                }
	              },
	              response => {
	                this.$Message.error("失败，请稍后重试");
	              }
	            );
			},
			addcancel() {
				this.addModel = false;
			},
			exportMember() {
				this.$refs.memberTable.exportCsv({
					filename: "会员列表"
				});
			},
			changeBrand(type) {
				var options = {
					actionType: type,
					productBrandUuid: this.productBrandUuid
				};
				this.$http
					.post("/admin/changeProductBrand", this.common.request(options))
					.then(
						response => {
							if (response.data.body.status.statusCode == 0) {
								if (type == "DELETE") {
									var desc = "已删除品牌";
								} else if (type == "MODIFY") {
									var desc = "已修改品牌";
								}
								this.$Notice.success({
									title: "成功",
									desc: desc || "",
									duration: 2
								});
								this.searchBrand();
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
				this.searchBrand();
			},
			searchBrand() {
				let keyArray = [];
				var searchOptions = {
					startIndex: this.startIndex,
					pageSize: this.pageSize
				};
				//判断是否有商品名称查询条件
				if (this.searchBrandName) {
					keyArray.push("BRAND_NAME");
					searchOptions.brandName = this.searchBrandName;
				}
				searchOptions.keyArray = keyArray;
				this.loading = true;
				this.$http
					.post("/admin/searchBrand", this.common.request(searchOptions))
					.then(
						response => {
							if (response.data.body.status.statusCode == 0) {
								this.loading = false;
								this.brands = response.data.body.data.brands;
								this.total = response.data.body.data.total;
								this.brandData = this.brands;
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
				this.editModel = true;
				this.editRow = row;
				this.logoUrl = row.logoUrl;
			},
			editcancel() {
				this.editModel = false;
			},
			editok(row) {
				
				if (this.editRow.name == null || this.editRow.name == '') {
			          this.$Message.error("请输入品牌名称");
			          return;
			    }
			    if (this.logoUrl == null || this.logoUrl == '') {
			          this.$Message.error("请上传品牌LOGO");
			          return;
			    }
				if (this.editRow.sortNumber == null||this.editRow.sortNumber <=0||this.editRow.sortNumber==undefined) {
			          this.$Message.error("请输入正确排序");
			          return;
		      	}
	          	var options = {
		            actionType: "MODIFY",
		            productBrandUuid: this.editRow.productBrandUuid,
		            sortNumber: this.editRow.sortNumber,
		            name: this.editRow.name,
		            logoUrl: this.logoUrl
		          	};
	          	this.editLoading = true;
	          	this.$http
	            .post("/admin/changeProductBrand", this.common.request(options))
	            .then(
	              response => {
	              	this.editLoading = false;
	                if (response.data.body.status.statusCode == 0) {
	                  var data = response.data.body.data;
	                  this.editModel = false;
	                  this.$Notice.success({
	                    title: "成功",
	                    desc: "品牌已修改",
	                    duration: 2
	                  });
	                  this.searchBrand();
	                } else {
	                  this.$Message.error(response.data.body.status.errorDesc);
	                }
	              },
	              response => {
	                this.$Message.error("失败，请稍后重试");
	              }
	            );
			},
			del(row) {
				this.productBrandUuid = row.productBrandUuid;
				this.delModel = true;
			},
			delcancel(row) {
				this.delModel = false;
			},
			delok(row) {
				this.changeBrand("DELETE");
				this.delModel = false;
			}
		},
		mounted() {
			this.uploadList = this.$refs.upload.fileList;
			this.searchBrand();
		}
	};
</script>
