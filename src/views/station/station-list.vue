<style lang="less">
@import "../../styles/common.less";
.ivu-table-sort {
  margin-top: 13px;
}
</style>

<template>
  <div>
    <Row class="margin-top-10">
      <Col span="24">
        <Card>
          <p slot="title">商家列表</p>
          <Row>
            <Input v-model="searchMobileNo" placeholder="手机号码" style="width: 120px" />
            <Input v-model="searchMerchantName" placeholder="名称" style="width: 150px" />
            <Input v-model="searchMerchantAddress" placeholder="地址" style="width: 150px" />
            <Button type="success" @click="inquiryonsort()">查询</Button>
            <div class="f_r">
              <Button type="primary" @click="add()">新增商家</Button>
              <Button :loading="exportLoading" type="warning" @click="exportStation()">导出</Button>
            </div>
          </Row>
          <Row class="margin-top-10">
            <Col span="24">
              <div>
                <Table
                  class="table"
                  :columns="stationColumn"
                  @on-sort-change="onsort"
                  :data="stationData"
                  border
                  stripe
                  ref="stationTable"
                  :loading="loading"
                ></Table>
              </div>
            </Col>
          </Row>
          <Row class="margin-top-10">
            <Col span="18">
              <Page
                ref="stationpage"
                :total="total"
                size="small"
                :pageSize="pageSize"
                @on-change="changepage"
                show-total
                show-elevator
              ></Page>
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
    <Modal :closable="false" :mask-closable="false" v-model="mapModal" width="800px" title="商家地址">
      <div class="mymapM">
        <!--捜索
    <div v-if="loading" class="loading">
      <van-loading type="spinner" />
    </div>
        -->
        <div class="search-box">
          <div class="search-postion">
            <input type="text" placeholder="输入关键字搜索" v-model="search_key" />
            <span class="clear" v-if="search_key" @click="search_key ='' ">
              <!--<van-icon color="#8f8f8f" name="clear" />-->
            </span>
            <Button type="primary" @click="keySearch">捜索</Button>
          </div>
        </div>
        <div class="con-box con-map" v-if="!search_key">
          <!--地图-->
          <div class="mapbox">
            <div class="map" id="container"></div>
            <div class="sign"></div>
          </div>
        </div>
        <div class="con-box" v-if="!search_key">
          <!--地址列表-->
          <div class="Hlist-box">
            <ul>
              <li v-for="(item, index) in lists" :key="index" @click="onAddressLi(item)">
                <b>
                  <!--<van-icon color="#a6a6a6" name="clock" />-->
                </b>
                <div>
                  <span>{{item.name}}</span>
                  <p>{{item.address}}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <!--捜索列表-->
        <div class="search-list" v-if="search_key">
          <ul>
            <li
              v-for="(item, index) in search_list"
              :key="index"
              @click="onSearchLi(item.location)"
            >
              <span>{{item.name}}</span>
              <p>{{item.address}}</p>
            </li>
            <li v-if="noSearchShow">
              <p>暂无搜索结果</p>
            </li>
          </ul>
        </div>
      </div>
    </Modal>
    <Modal v-model="memoModal" width="400px" title="备注信息">
      <Input type="text" v-model="editvalue.memo" style="width:360px"></Input>
      <div slot="footer">
        <Button type="text" @click="memocancel">取消</Button>
        <Button type="primary" :loading="memoLoading" @click="memook()">提交</Button>
      </div>
    </Modal>
    <Modal v-model="qrCodeModal" width="400px" :title="'收款码('+paymentvalue.merchantName+')'">
      <div>
        <div ref="paymentQrCode" id="paymentQrCode" style="margin:0 auto;width:300px;"></div>
      </div>
      <div slot="footer">
        <Button type="text" @click="qrCodeModal=false">关闭</Button>
        <Button type="primary" @click="download()">下载</Button>
      </div>
    </Modal>
    <Modal
      :closable="false"
      :mask-closable="false"
      v-model="editmodel"
      title="修改商家"
      @on-ok="editok"
      @on-cancel="cancelEditMerchant"
    >
      <Form
        ref="editMerchantForm"
        :model="editvalue"
        :label-width="120"
        :rules="editMerchantValidate"
      >
        <FormItem label="商家名称" prop="merchantName">
          <Input v-model="editvalue.merchantName" style="width:80%"></Input>
        </FormItem>
        <FormItem label="商家地址" prop="merchantAddress">
          <Input v-model="editvalue.merchantAddress" style="width:80%"></Input>
          <Button
            icon="location"
            type="default"
            size="small"
            style="margin-left:5px"
            @click="openMap('edit')"
          >地图</Button>
        </FormItem>
        <FormItem label="联系人" prop="contactName">
          <Input v-model="editvalue.contactName" style="width:80%"></Input>
        </FormItem>
        <FormItem label="联系电话" prop="mobileNo">
          <Input v-model="editvalue.mobileNo" style="width:80%"></Input>
        </FormItem>
        <!-- <FormItem label="推荐人" prop="referrer">
					<Input v-model='editvalue.referrer' style="width:80%"></Input>
				</FormItem>
				<FormItem label="可用购币" prop="availablePoint">
					<InputNumber :min="0" v-model='editvalue.availablePoint' style="width:80%"></InputNumber>
        </FormItem>-->
        <FormItem label="商家号">
          <Input v-model="editvalue.merchantId" style="width:80%"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="editmodel=false">取消</Button>
        <Button type="primary" :loading="editLoading" @click="editok">确定</Button>
      </div>
    </Modal>
    <Modal :closable="false" :mask-closable="false" v-model="addmodel" title="新增商家">
      <Form
        ref="addMerchantForm"
        :model="addvalue"
        :label-width="120"
        :rules="editMerchantValidate"
      >
        <FormItem label="商家名称" prop="merchantName">
          <Input v-model="addvalue.merchantName" style="width:80%"></Input>
        </FormItem>
        <FormItem label="商家地址" prop="merchantAddress">
          <Input v-model="addvalue.merchantAddress" style="width:80%"></Input>
          <Button
            icon="location"
            type="default"
            size="small"
            style="margin-left:5px"
            @click="openMap('add')"
          >地图</Button>
        </FormItem>
        <FormItem label="联系人" prop="contactName">
          <Input v-model="addvalue.contactName" style="width:80%"></Input>
        </FormItem>
        <FormItem label="联系电话" prop="mobileNo">
          <Input v-model="addvalue.mobileNo" style="width:80%"></Input>
        </FormItem>
        <FormItem label="商家号">
          <Input v-model="editvalue.merchantId" style="width:80%"></Input>
        </FormItem>
        <!-- <FormItem label="推荐人" prop="referrer">
					<Input v-model='addvalue.referrer' style="width:80%"></Input>
        </FormItem>-->
      </Form>
      <div slot="footer">
        <Button type="text" @click="addmodel=false">取消</Button>
        <Button type="primary" :loading="addLoading" @click="addok">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import QRCode from "qrcodejs2";
export default {
  components: {},
  data() {
    const validateMobileNo = (rule, value, callback) => {
      if (!/^1[2345789]\d{9}$/.test(value)) {
        callback("联系电话格式错误");
      } else {
        callback();
      }
    };
    return {
      center: [116.42792, 39.902896], //经度+纬度
      search_key: "", //搜索值
      lists: [], //地点列表
      search_list: [], //搜索结果列表
      marker: "",
      loading: false,
      noSearchShow: false, //无搜索结果提示，无搜索结果时会显示暂无搜索结果,
      qrCodeModal: false,
      paymentQrCode: null,
      mapModal: false,
      memoModal: false,
      inventoryQuantity: 1,
      registerDate: "",
      loading: false,
      exportLoading: false,
      addLoading: false,
      editLoading: false,
      memoLoading: false,
      editvalue: {},
      czsearchDate: [],
      hbsearchDate: [],
      addvalue: {
        merchantAddress: ""
      },
      paymentvalue: {},
      stationColumn: [
        {
          title: "商家名称",
          key: "merchantName",
          width: 180,
          align: "center",
          render: (h, params) => {
            return h(
              "span",
              {
                props: {
                  row: params.row
                }
              },
              [h("span", {}, params.row.merchantName)]
            );
          }
        },
        {
          title: "商家号",
          align: "center",
          key: "merchantId",
          width: 150
        },
        {
          title: "地址",
          align: "center",
          width: 150,
          key: "merchantAddress"
        },
        {
          title: "联系人",
          align: "center",
          key: "contactName",
          width: 100
        },
        {
          title: "手机号码",
          align: "center",
          key: "mobileNo",
          width: 120
        },
        {
          title: "备注",
          align: "center",
          width: 220,
          key: "memo"
        },
        {
          title: "操作",
          align: "center",
          width: 200,
          render: (h, params) => {
            return h("div", [
              params.row.closed
                ? h(
                    "Poptip",
                    {
                      props: {
                        confirm: true,
                        title: "您确定要启用该商户吗?",
                        transfer: true
                      },
                      on: {
                        "on-ok": () => {
                          this.closestation(params.row);
                        }
                      }
                    },
                    [
                      h(
                        "Button",
                        {
                          style: {
                            margin: "0 20px 0 0"
                          },
                          props: {
                            type: "success",
                            size: "small"
                          }
                        },
                        "启用"
                      )
                    ]
                  )
                : h(
                    "Poptip",
                    {
                      props: {
                        confirm: true,
                        title: "您确定要停用该商户吗?",
                        transfer: true
                      },
                      on: {
                        "on-ok": () => {
                          this.closestation(params.row);
                        }
                      }
                    },
                    [
                      h(
                        "Button",
                        {
                          style: {
                            margin: "0 20px 0 0"
                          },
                          props: {
                            type: "error",
                            size: "small"
                          }
                        },
                        "停用"
                      )
                    ]
                  ),
              h(
                "Button",
                {
                  style: {
                    margin: "0 20px 0 0"
                  },
                  props: {
                    type: "default",
                    size: "small"
                  },
                  on: {
                    click: event => {
                      this.edit(params.row);
                    }
                  }
                },
                "编辑"
              ),
              h(
                "Button",
                {
                  style: {
                    margin: "0 20px 0 0"
                  },
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  on: {
                    click: event => {
                      this.memo(params.row);
                    }
                  }
                },
                "备注"
              )
            ]);
          }
        }
      ],
      sortBy: "",
      totalData: [],
      stationData: [],
      isonsort: "",
      total: 0,
      pageSize: 20,
      startIndex: 0,
      searchMobileNo: "",
      searchMerchantAddress: "",
      searchReferrer: "",
      searchMerchantName: "",
      searchregisterDate: null,
      showInventory: false,
      editmodel: false,
      addmodel: false,
      openMapFrom: "",
      editMerchantValidate: {
        merchantName: [
          {
            required: true,
            message: "请输入商家名称",
            trigger: "blur"
          }
        ],
        contactName: [
          {
            required: true,
            message: "请输入联系人",
            trigger: "blur"
          }
        ],
        mobileNo: [
          {
            required: true,
            message: "请输入联系电话",
            trigger: "blur"
          },
          {
            validator: validateMobileNo,
            trigger: "blur"
          }
        ],
        merchantAddress: [
          {
            required: true,
            message: "请输入商家地址",
            trigger: "blur"
          }
        ],
        referrer: [
          {
            required: true,
            message: "请输入推荐人",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    openMap(value) {
      this.mapModal = true;
      if (value == "edit") this.editmodel = false;
      else if (value == "add") this.addmodel = false;
      this.openMapFrom = value;
    },
    closeMap() {
      this.mapModal = false;
      if (this.openMapFrom == "edit") this.editmodel = true;
      else if (this.openMapFrom == "add") this.addmodel = true;
    },
    download() {
      var a = document.createElement("a");
      // 创建一个单击事件
      var event = new MouseEvent("click");

      // 将a的download属性设置为我们想要下载的图片名称，若name不存在则使用‘下载图片名称’作为默认名称
      a.download = "收款码" + "(" + this.paymentvalue.merchantName + ")";
      // 将生成的URL设置为a.href属性
      var url = this.$refs.paymentQrCode.childNodes[1].src;
      a.href = url;

      // 触发a的单击事件
      a.dispatchEvent(event);
    },
    openPaymentQrCode(merchant) {
      this.qrCodeModal = true;
      this.inquiryPaymentQrCode(merchant);
    },
    generatePaymentQrCode(width, height, text) {
      if (this.paymentQrCode) {
        this.paymentQrCode.clear();
        this.paymentQrCode.makeCode(text);
      } else {
        this.paymentQrCode = new QRCode("paymentQrCode", {
          width: width,
          height: height,
          text: text
        });
      }
    },
    inquiryPaymentQrCode(merchant) {
      this.paymentvalue = merchant;
      let options = {
        merchantUuid: merchant.merchantUuid
      };
      this.$http.post("/admin/payQrCode", this.common.request(options)).then(
        response => {
          if (response.data.body.status.statusCode == 0) {
            var data = response.data.body.data;
            this.generatePaymentQrCode(300, 300, data.paymentQrCode);
          } else {
            this.$Message.error(response.data.body.status.errorDesc);
          }
        },
        response => {
          this.$Message.error(response.data.body.status.errorDesc);
        }
      );
    },
    cancelEditMerchant() {
      this.editmodel = false;
    },
    cancelAddMerchant() {
      this.addmodel = false;
    },
    onsort(order) {
      if (order.order !== "normal") {
        this.startIndex = 0;
        this.pageSize = 20;
        var sortBy = "";
        if (order.column.key == "chargeTotal") {
          this.sortBy = "charge";
          this.hbsearchDate = [];
        }
        if (order.column.key == "assignPointTotal") {
          this.sortBy = "assign";
          this.czsearchDate = [];
        }
        this.searchMobileNo = "";
        this.searchMerchantName = "";
        this.searchMerchantAddress = "";
        this.searchReferrer = "";
        this.searchDate = [];
        this.isonsort = order.order;
        this.inquiryMerchant();
      }
    },
    inquiryonsort(order) {
      this.startIndex = 0;
      this.pageSize = 20;
      this.isonsort = "";
      (this.czsearchDate = []),
        (this.hbsearchDate = []),
        this.inquiryMerchant();
    },
    inquiryMerchant() {
      let searchOptions = {
        startIndex: this.startIndex,
        pageSize: this.pageSize
      };
      let keyArray = [];
      //判断是否有手机号码查询条件
      if (this.searchMobileNo) {
        keyArray.push("MOBILENO");
        searchOptions.mobileNo = this.searchMobileNo;
      }
      //判断是否有姓名查询条件
      if (this.searchMerchantName) {
        keyArray.push("MERCHANTNAME");
        searchOptions.merchantName = this.searchMerchantName;
      }
      //判断是否有地址查询条件
      if (this.searchMerchantAddress) {
        keyArray.push("MERCHANTADDRESS");
        searchOptions.merchantAddress = this.searchMerchantAddress;
      }
      //判断是否有推荐人查询条件
      if (this.searchReferrer) {
        keyArray.push("REFERRER");
        searchOptions.referrer = this.searchReferrer;
      }
      if (this.isonsort) {
        searchOptions.sortBy = this.sortBy;
        searchOptions.sorts = this.isonsort;
      }
      if (this.czsearchDate[0]) {
        let t = this.czsearchDate;
        keyArray.push("RANKINGDATE");
        searchOptions.rankingDateStart = t[0];
        searchOptions.rankingDateEnd = t[1];
      }
      if (this.hbsearchDate[0]) {
        let t = this.hbsearchDate;
        keyArray.push("RANKINGDATE");
        searchOptions.rankingDateStart = t[0];
        searchOptions.rankingDateEnd = t[1];
      }
      //判断是否有注册时间查询条件
      var searchDate = this.searchregisterDate;

      if (searchDate && searchDate[0] && searchDate[1]) {
        keyArray.push("REGISTERDATE");
        var startDate = searchDate[0];
        var endDate = searchDate[1];
        searchOptions.registerDateStart = startDate;
        searchOptions.registerDateEnd = endDate;
      }
      searchOptions.keyArray = keyArray;
      this.loading = true;
      this.$http
        .post("/admin/searchMerchant", this.common.request(searchOptions))
        .then(
          response => {
            this.loading = false;
            if (response.data.body.status.statusCode == 0) {
              var data = response.data.body.data;
              this.stationData = data.merchants;
              this.total = data.total;
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
    getData() {
      this.inquiryMerchant();
    },
    //处理分页-页数改变
    changepage(index) {
      this.startIndex = (index - 1) * this.pageSize;
      this.inquiryMerchant();
    },
    viewstation(row) {
      this.$router.push({
        name: "stationdetail",
        query: {
          merchantUuid: row.merchantUuid
        }
      });
    },
    closestation(row) {
      var options = {
        actionType: "CLOSE",
        merchantUuid: row.merchantUuid
      };
      this.$http
        .post("/admin/changeMerchant", this.common.request(options))
        .then(
          response => {
            if (response.data.body.status.statusCode == 0) {
              var data = response.data.body.data;
              if (!row.closed) {
                this.$Notice.success({
                  title: "已成功启用当前商家",
                  duration: 2
                });
              } else {
                this.$Notice.success({
                  title: "已成功停用当前商家",
                  duration: 2
                });
              }
              this.inquiryMerchant();
            } else {
              this.$Notice.success({
                title: "失败",
                desc: response.data.body.status.errorDesc,
                duration: 2
              });
            }
          },
          response => {
            this.$Message.error("出错了，请稍后重试");
          }
        );
    },
    increaseinventory(row) {
      this.showInventory = true;
      this.rows = row;
    },
    edit(row) {
      this.editmodel = true;
      this.editvalue = row;
    },
    add() {
      this.addmodel = true;
    },
    upgradepartner(row) {
      this.upgradePartnerModel = true;
      this.upgradePartnerMerchant = row;
    },
    memo(row) {
      this.memoModal = true;
      this.editvalue = row;
    },
    viewAchievement(row) {
      this.$router.push({
        name: "stationachievement",
        query: {
          merchantUuid: row.merchantUuid
        }
      });
    },
    viewtrainer(row) {
      this.$router.push({
        name: "trainerdetail",
        query: {
          trainerUuid: row.trainerDTO.trainerUuid
        }
      });
    },

    increaseinventorycancel() {
      this.editmodel = false;
      this.showInventory = false;
    },
    increaseinventoryok() {
      if (this.inventoryQuantity) {
        var options = {
          merchantDTO: {
            merchantUuid: this.rows.merchantUuid
          },
          inventoryQuantity: this.inventoryQuantity
        };
        this.$http
          .post(
            "/admin/allocateMerchantInventory",
            this.common.request(options)
          )
          .then(
            response => {
              if (response.data.body.status.statusCode == 0) {
                var data = response.data.body.data;
                this.$Notice.success({
                  title: "已成功调拨",
                  duration: 2
                });
                this.inquiryMerchant();
              } else {
                this.$Notice.success({
                  title: "失败",
                  desc: "response.data.body.status.errorDesc",
                  duration: 2
                });
              }
            },
            response => {
              this.$Message.error("出错了，请稍后重试");
            }
          );
      } else {
        this.$Message.error("调拨数量为空请输入数值");
      }
    },
    editok() {
      this.$refs["editMerchantForm"].validate(valid => {
        if (valid) {
          this.editmodel = false;
          var options = {
            merchantUuid: this.editvalue.merchantUuid,
            merchantAddress: this.editvalue.merchantAddress,
            longitude: this.editvalue.longitude,
            latitude: this.editvalue.latitude,
            merchantName: this.editvalue.merchantName,
            contactName: this.editvalue.contactName,
            mobileNo: this.editvalue.mobileNo,
            merchantId: this.editvalue.merchantId,
            referrer: this.editvalue.referrer,
            availablePoint: this.editvalue.availablePoint
          };
          this.editLoading = true;
          this.$http
            .post("/admin/updateMerchant", this.common.request(options))
            .then(
              response => {
                this.editLoading = false;
                if (response.data.body.status.statusCode == 0) {
                  var data = response.data.body.data;
                  this.$Notice.success({
                    title: "商家信息已修改",
                    duration: 2
                  });
                  this.inquiryMerchant();
                } else {
                  this.$Notice.success({
                    title: "失败",
                    desc: "response.data.body.status.errorDesc",
                    duration: 2
                  });
                }
              },
              response => {
                this.editLoading = false;
                this.$Message.error("出错了，请稍后重试");
              }
            );
        } else {
        }
      });
    },
    addok() {
      this.$refs["addMerchantForm"].validate(valid => {
        if (valid) {
          this.addmodel = false;
          var options = {
            merchantUuid: this.addvalue.merchantUuid,
            merchantAddress: this.addvalue.merchantAddress,
            longitude: this.addvalue.longitude,
            latitude: this.addvalue.latitude,
            merchantName: this.addvalue.merchantName,
            contactName: this.addvalue.contactName,
            mobileNo: this.addvalue.mobileNo,
            referrer: this.addvalue.referrer
          };
          this.addLoading = true;
          this.$http
            .post("/public/registerMerchant", this.common.request(options))
            .then(
              response => {
                this.addLoading = false;
                if (response.data.body.status.statusCode == 0) {
                  var data = response.data.body.data;
                  this.$Notice.success({
                    title: "商家添加成功",
                    duration: 2
                  });
                  this.inquiryMerchant();
                } else {
                  this.$Notice.success({
                    title: "失败",
                    desc: "response.data.body.status.errorDesc",
                    duration: 2
                  });
                }
              },
              response => {
                this.addLoading = false;
                this.$Message.error("出错了，请稍后重试");
              }
            );
        } else {
        }
      });
    },
    memook() {
      var options = {
        merchantUuid: this.editvalue.merchantUuid,
        memo: this.editvalue.memo,
        actionType: "MEMO"
      };
      this.memoLoading = true;
      this.$http
        .post("/admin/updateMerchantField", this.common.request(options))
        .then(
          response => {
            this.memoLoading = false;
            if (response.data.body.status.statusCode == 0) {
              this.memoModal = false;
              var data = response.data.body.data;
              this.$Notice.success({
                title: "已修改备注",
                duration: 2
              });
            } else {
              this.$Notice.success({
                title: "失败",
                desc: "response.data.body.status.errorDesc",
                duration: 2
              });
            }
          },
          response => {
            this.memoLoading = false;
            this.$Message.error("出错了，请稍后重试");
          }
        );
    },
    memocancel() {
      this.memoModal = false;
    },
    upgradepartnerok() {
      var options = {
        partnerLevel: this.upgradePartnerLevel,
        merchantDTO: {
          merchantUuid: this.upgradePartnerMerchant.merchantUuid
        }
      };
      this.upgradeLoading = true;
      this.$http
        .post("/admin/changeMerchantPartnerLevel", this.common.request(options))
        .then(
          response => {
            this.upgradeLoading = false;
            if (response.data.body.status.statusCode == 0) {
              var data = response.data.body.data;
              this.$Notice.success({
                title: "已升级合伙人",
                duration: 2
              });
              this.upgradePartnerModel = false;
              this.inquiryMerchant();
            } else {
              this.$Notice.success({
                title: "失败",
                desc: "response.data.body.status.errorDesc",
                duration: 2
              });
            }
          },
          response => {
            this.upgradeLoading = false;
            this.$Message.error("出错了，请稍后重试");
          }
        );
    },
    exportStation() {
      let searchOptions = {};
      let keyArray = [];
      //判断是否有手机号码查询条件
      if (this.searchMobileNo) {
        keyArray.push("MOBILENO");
        searchOptions.mobileNo = this.searchMobileNo;
      }
      //判断是否有姓名查询条件
      if (this.searchMerchantName) {
        keyArray.push("MERCHANTNAME");
        searchOptions.merchantName = this.searchMerchantName;
      }
      //判断是否有地址查询条件
      if (this.searchMerchantAddress) {
        keyArray.push("MERCHANTADDRESS");
        searchOptions.merchantAddress = this.searchMerchantAddress;
      }
      searchOptions.keyArray = keyArray;
      this.exportLoading = true;
      this.$http
        .post("/admin/searchMerchant", this.common.request(searchOptions))
        .then(
          response => {
            this.exportLoading = false;
            if (response.data.body.status.statusCode == 0) {
              var data = response.data.body.data;
              var exportData = ["商家列表", this.stationColumn, data.merchants];
              this.$refs.stationTable.exportCsv({
                filename: exportData[0],
                columns: exportData[1],
                data: exportData[2]
              });
            }
          },
          response => {
            this.exportLoading = false;
          }
        );
    },
    adMap() {
      this.loading = true;
      //初始化地图
      var map = new AMap.Map("container", {
        zoom: 14, //缩放级别
        center: this.center //设置地图中心点
        //resizeEnable: true,  //地图初始化加载定位到当前城市
      });
      //获取初始中心点并赋值
      var currentCenter = map.getCenter(); //此方法是获取当前地图的中心点
      this.center = [currentCenter.lng, currentCenter.lat]; //将获取到的中心点的纬度经度赋值给data的center
      console.log(this.center);

      //创建标记
      this.marker = new AMap.Marker({
        position: new AMap.LngLat(currentCenter.lng, currentCenter.lat) // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
      });
      // 将创建的点标记添加到已有的地图实例：
      map.add(this.marker);

      //根据地图中心点查附近地点，此方法在下方
      this.centerSearch();
      //监听地图移动事件，并在移动结束后获取地图中心点并更新地点列表
      var moveendFun = e => {
        // 获取地图中心点
        currentCenter = map.getCenter();
        this.center = [currentCenter.lng, currentCenter.lat];
        this.marker.setPosition([currentCenter.lng, currentCenter.lat]); //更新标记的位置
        //根据地图中心点查附近地点
      };
      //更新数据
      var centerSearch = () => {
        this.loading = true;
        this.centerSearch();
      };

      // 绑定事件移动地图事件
      map.on("mapmove", moveendFun); //更新标记
      map.on("moveend", centerSearch); //更新数据
    },
    centerSearch() {
      AMap.service(["AMap.PlaceSearch"], () => {
        //构造地点查询类
        var placeSearch = new AMap.PlaceSearch({
          type:
            "汽车服务|餐饮服务|购物服务|生活服务|体育休闲服务|医疗保健服务|住宿服务|风景名胜|商务住宅|政府机构及社会团体|科教文化服务|交通设施服务|金融保险服务|公司企业|地名地址信息", // 兴趣点类别
          pageSize: 30, // 单页显示结果条数
          pageIndex: 1, // 页码
          city: "全国", // 兴趣点城市
          autoFitView: false // 是否自动调整地图视野使绘制的 Marker点都处于视口的可见范围
        });
        //根据地图中心点查附近地点
        placeSearch.searchNearBy(
          "",
          [this.center[0], this.center[1]],
          200,
          (status, result) => {
            if (status == "complete") {
              this.lists = result.poiList.pois; //将查询到的地点赋值
              this.loading = false;
            }
          }
        );
      });
    },
    keySearch() {
      this.loading = true;
      AMap.service(["AMap.PlaceSearch"], () => {
        //构造地点查询类
        var placeSearch = new AMap.PlaceSearch({
          type:
            "汽车服务|餐饮服务|购物服务|生活服务|体育休闲服务|医疗保健服务|住宿服务|风景名胜|商务住宅|政府机构及社会团体|科教文化服务|交通设施服务|金融保险服务|公司企业|地名地址信息", // 兴趣点类别
          pageSize: 50, // 单页显示结果条数
          pageIndex: 1, // 页码
          city: "全国", // 兴趣点城市
          citylimit: false, //是否强制限制在设置的城市内搜索
          autoFitView: false // 是否自动调整地图视野使绘制的 Marker点都处于视口的可见范围
        });
        //关键字查询
        placeSearch.search(this.search_key, (status, result) => {
          if (status == "complete") {
            if (result.poiList.count === 0) {
              this.noSearchShow = true;
            } else {
              this.search_list = result.poiList.pois; //将查询到的地点赋值
              this.noSearchShow = false;
              this.loading = false;
            }
          } else {
            this.search_list = [];
            this.noSearchShow = true;
          }
        });
      });
    },
    onAddressLi(e) {
      this.mapModal = false;
      console.log(JSON.stringify(e));
      this.marker.setPosition([e.location.lng, e.location.lat]); //更新标记的位置
      if (this.openMapFrom == "add") {
        this.addmodel = true;
        this.addvalue.longitude = e.location.lng;
        this.addvalue.latitude = e.location.lat;
        this.addvalue.merchantAddress = e.address;
        console.log(JSON.stringify(this.addvalue));
      } else if (this.openMapFrom == "edit") {
        this.editmodel = true;
        this.editvalue.longitude = e.location.lng;
        this.editvalue.latitude = e.location.lat;
        this.editvalue.merchantAddress = e.address;
        console.log(JSON.stringify(this.editvalue));
      }
    },
    onSearchLi(e) {
      console.log(e.lng + "-" + e.lat);
      this.center = [e.lng, e.lat];
      console.log(this.center);
      this.search_key = "";
      // this.loading=true;
      setTimeout(() => {
        this.adMap();
      }, 1000);
    }
  },
  watch: {
    search_key(newv, oldv) {
      if (newv == "") {
        this.search_list = [];
        this.noSearchShow = false;
        setTimeout(() => {
          this.adMap();
        }, 1000);
      } else {
        if (newv != oldv) {
          this.keySearch();
        }
      }
    }
  },
  created() {
    this.getData();
  },
  mounted() {
    setTimeout(() => {
      this.adMap();
    }, 1000);
  }
};
</script>
<style lang="scss" scoped>
.con-map {
  height: 290px;
  width: 100%;
}
.con-box {
  .mapbox {
    margin-bottom: 10px;
    //position: fixed;
    z-index: 111;
    width: 768px;
    height: 280px;
    padding: 10px 0;
    background: #eceeee;

    .map {
      width: 100%;
      height: 280px;
    }
  }

  .Hlist-box {
    width: 96%;
    margin: 0 auto;
    height: 300px;
    overflow-y: auto;
    background: #fff;
    border-radius: 5px;
    li {
      //height: 40px;
      padding: 14px 22px;
      border-bottom: 1px solid #d9d9d9;
      display: flex;
      b {
        display: inline-block;

        i {
          margin: 18px 18px 0 0;
        }
      }
      div {
        width: 100%;
      }
      span {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        font-size: 15px;
        display: inline-block;
        width: 90%;
      }
      p {
        margin-top: 10px;
        color: #a6a6a6;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        font-size: 13px;
        width: 90%;
      }
    }
  }
}
.mymapM {
  .search-box {
    height: 48px;
    line-height: 48px;
    margin-bottom: 16px;
    //border-bottom: 1px solid #bfbec4;

    .search-postion {
      height: 48px;
      line-height: 48px;
      width: 768px;
      //position: fixed;
      z-index: 99999;
      display: flex;
      input {
        flex: 4;
        height: 48px;
        line-height: 48px;
        padding: 16px 0;
        border: none;
        outline: none;
        background-color: #e5e5e5;
        text-indent: 10px;
      }
      .clear {
        margin: 2px 6px;
      }
      .buts {
        width: 15%;
        text-align: center;
        display: inline-block;
        flex: 1;
      }
      .border_but {
        border-left: 1px solid #8f8f8f;
        height: 14px;
        line-height: 14px;
        margin: 17px 0;
      }
    }
  }
  .search-list {
    width: 100%;
    margin: 0 auto;
    margin-top: 10px;
    border-radius: 5px;
    background: #fff;
    li {
      //height: 40px;
      padding: 14px 0 14px 0;
      border-bottom: 1px solid #d9d9d9;
      span {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        font-size: 15px;
        display: inline-block;
        width: 90%;
      }
      p {
        margin-top: 10px;
        color: #a6a6a6;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        font-size: 13px;
        width: 90%;
      }
    }
  }
}
.loading {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 99999999;
}
</style>