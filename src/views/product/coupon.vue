<style lang="less">
@import "../../styles/common.less";
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
              <Button class="f_r" icon="plus" type="primary" @click="add()">新增优惠卷</Button>
            </div>
          </Row>
          <Row class="margin-top-10">
            <Col span="24">
              <div>
                <Table
                  :loading="loading"
                  :columns="productColumn"
                  :data="productData"
                  border
                  stripe
                  ref="productTable"
                ></Table>
              </div>
            </Col>
          </Row>
          <Row class="margin-top-10">
            <Page
              ref="productpage"
              :total="total"
              size="small"
              :pageSize="pageSize"
              @on-change="changepage"
              show-total
              show-elevator
            ></Page>
          </Row>
        </Card>
      </Col>
    </Row>
  </div>
</template>

<script>
export default {
  components: {
    
  },
  data() {
    return {
      loading: false,
      productData: [],
      total: 0,
      pageSize: 20,
      startIndex: 0,
	  productColumn: [
	      {
	        type: "expand",
	        width: 30,
	        render: (h, params) => {
	          return h(expandRow, {
	            props: {
	              row: params.row
	            }
	          });
	        }
	      },
	      {
	        title: "供应商",
	        align: "center",
	        key: "supplierName",
	        width: 100,
	      },
	      {
	        title: "类目",
	        align: "center",
	        key: "productCateName",
	        width: 100,
	      },
	      {
	        title: "名称",
	        key: "productName",
	        width: "200px",
	        render: (h, params) => {
	          return h(
	            "span",
	            {
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
	                "span",
	                {
	                  style: {
	                    display: "inline-block",
	                    float: "right",
	                    width: "100px",
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
	            "span",
	            {
	              props: {
	                row: params.row
	              }
	            },
	            [
	              h(
	                "span",
	                {
	                  style: {
	                    display: "inline-block",
	                    float: "right",
	                    width: "100px",
	                    marginTop: "10px",
	                    color:"red"
	                  }
	                },
	                params.row.unitPoint+"购币"
	              ),
	              h(
	                "span",
	                {
	                  style: {
	                    display: "inline-block",
	                    float: "right",
	                    width: "100px",
	                    "text-decoration":"line-through" 
	                  }
	                },
	                params.row.unitPointStandard + "购币"
	              )
	            ]
	          );
	        }
	      },
	      {
	        title: "营销状态",
	        align: "center",
	        render: (h, params) => {
	          let isHot = params.row.hot;
	          let isRecommend = params.row.recommend;
	          let isNew = params.row.new;
	          return h(
	            "span",
	            {
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
	                      display: isHot?"display":"none"
	                  }
	              }, "热卖"),
	              h('tag', {
	                  props: {
	                    color: "green"
	                  },
	                  style: {
	                      display: isRecommend?"display":"none"
	                  }
	              }, "推荐"),
	              h('tag', {
	                  props: {
	                    color: "green"
	                  },
	                  style: {
	                      display: isNew?"display":"none"
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
	        width: "100"
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
	              let status = (params.row.onSale?'已上架':'未上架');
	              let color = (params.row.onSale?'green':'red');
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
	          let type = onSale ? "warning": "success";
	          let saleText = onSale ? "下架": "上架";
	          return h("span", {}, [
	            h(
	              "Button",
	              {
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
	                    if(onSale)
	                      this.disable(params.row);
	                    else
	                      this.enable(params.row);
	                  }
	                }
	              },
	              saleText
	            ),
	            h(
	              "Button",
	              {
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
	  						h('Poptip',{
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
	  						},[
	  						    h('Button',{
	  						    props: {
	  						        type: 'error',
	  						        size: 'small'
	  						    },
	  						    style: {
	  						        margin: '0 5px 0 0'
	  						    },
	  						},'删除')
	  						])
	          ]);
	        }
	      }
	    ]
    };
  },
  methods: {
	  add(){
		  
	  },
		//处理分页-页数改变
		changepage(index) {
		  this.startIndex = (index - 1) * this.pageSize;
		  this.index = index;
		  this.searchProduct();
		},
	},
  created() {
    this.inquirySupplier();
    this.searchProduct();
  }
};
</script>
