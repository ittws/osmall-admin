<style lang="less">
@import "../../styles/common.less";
</style>

<template>
  <div>
    <Row>
      <Col span="24">
        <Card class="margin-top-10">
          <p slot="title">
轮播广告(分辨率450x200)
          </p>
          <Row class="margin-top-20">
            <Col span="24">
              <div class="demo-upload-list" v-for="item in swipers">
                <div style="height:160px;width:100%">
                  <img :src="item.url" />
                </div>
                <div class="demo-upload-list-cover">
                  <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
                  <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
                  <p>
                    <Button type="primary" size="small" @click.native="edit(item)">链接内容</Button>
                  </p>
                </div>
                <div></div>
              </div>
              <Upload
                ref="upload"
                :show-upload-list="false"
                :default-file-list="defaultList"
                :on-success="handleSuccess"
                :format="['jpg','jpeg','png']"
                :max-size="2048"
                :on-format-error="handleFormatError"
                :on-exceeded-size="handleMaxSize"
                :before-upload="handleBeforeUpload"
                multiple
                type="drag"
                :action="actionName"
                style="display: inline-block;width:160px;"
              >
                <div style="width: 160px;height:160px;line-height: 160px;">
                  <Icon type="camera" size="20"></Icon>
                </div>
              </Upload>
              <Modal title="查看轮播图" v-model="visible">
                <img :src="viewSwiper.url" v-if="visible" style="width: 100%" />
              </Modal>
            </Col>
          </Row>
        </Card>
        <div> 
                <div style="padding: 20px 10px 10px 10px; font-size: 14px">显示位置如下图所示</div>
                <img src="../../images/swiper_guide.png" alt="">
              </div>
      </Col>
    </Row>
  </div>
</template>

<script>
export default {
  name: "Swiper-list",
  data() {
    return {
      editSwiperTag: false,
      selectedTag: "",
      SwiperTags: [],
      newSwiperTag: "",
      editTagName: "",
      showAddSwiperInput: false,
      editSwiper: {},
      editModel: false,
      actionName: this.$http.defaults.baseURL + "admin/uploadMediaFile",
      swipers: [],
      viewSwiper: {},
      visible: false,
      uploadList: [],
      defaultList: []
    };
  },
  methods: {
    handleView(item) {
      this.viewSwiper = item;
      this.visible = true;
    },
    handleRemove(item) {
      let options = {
        actionType: "DELETE",
        swiperUuid: item.swiperUuid
      };
      this.$http.post("/admin/changeSwiper", this.common.request(options)).then(
        response => {
          if (response.data.body.status.statusCode == 0) {
            this.initSwiperData();
          } else {
            this.$Message.error(response.data.body.status.errorDesc);
          }
        },
        response => {
          this.$Message.error(response.data.body.status.errorDesc);
        }
      );
    },
    handleSuccess(res, file) {
      let url = res.data[0]; //获取上传成功后的地址
      let options = {
        actionType: "ADD",
        url: url
      };
      this.$http.post("/admin/changeSwiper", this.common.request(options)).then(
        response => {
          if (response.data.body.status.statusCode == 0) {
            this.initSwiperData();
          } else {
            this.$Message.error(response.data.body.status.errorDesc);
          }
        },
        response => {
          this.$Message.error(response.data.body.status.errorDesc);
        }
      );
    },
    handleFormatError(file) {
      this.$Notice.warning({
        title: "The file format is incorrect",
        desc:
          "File format of " +
          file.name +
          " is incorrect, please select jpg or png."
      });
    },
    handleMaxSize(file) {
      this.$Notice.warning({
        title: "Exceeding file size limit",
        desc: "File  " + file.name + " is too large, no more than 2M."
      });
    },
    handleBeforeUpload() {
      const check = this.uploadList.length < 500;
      if (!check) {
        this.$Notice.warning({
          title: "Up to 500 pictures can be uploaded."
        });
      }
      return check;
    },
    initSwiperData() {
      this.$http.post("/admin/inquirySwiper", this.common.request({})).then(
        response => {
          if (response.data.body.status.statusCode == 0) {
            this.swipers = response.data.body.data.swipers;
          } else {
            this.$Message.error(response.data.body.status.errorDesc);
          }
        },
        response => {
          this.$Message.error(response.data.body.status.errorDesc);
        }
      );
    },
    edit(item) {
      this.$router.push({
        name: "swiperedit",
        query: { Row: item }
      });
    }
  },
  computed: {},
  created() {
    this.initSwiperData();
  },
  mounted() {},
  destroyed() {}
};
</script>
<style>
.demo-upload-list {
  display: inline-block;
  width: 160px;
  height: 160px;
  text-align: center;
  line-height: 60px;
  overflow: hidden;
  background: #fff;
  position: relative;
  margin-right: 40px;
}
.demo-upload-list img {
  width: 100%;
  height: 100%;
}
.demo-upload-list-cover {
  display: none;
  position: absolute;
  height: 160px;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
}
.demo-upload-list:hover .demo-upload-list-cover {
  display: block;
}
.demo-upload-list-cover i {
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  margin: 60px 2px 0 2px;
}
</style>